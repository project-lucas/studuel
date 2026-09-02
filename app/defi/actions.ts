'use server'

import { revalidatePath } from 'next/cache'
import { isSchoolLevel } from '@/lib/clan'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { validateRevisionToday, validateCommuteToday } from '@/lib/habits'
import { isCommuteNow } from '@/lib/trajet'
import { XP_RULES } from '@/lib/xp'
import { MODE_XP_BONUS, modeXpBonus, type GameModeId } from '@/lib/defi-modes'
import { weeklyBoss, weeklyTrophyId, WEEKLY_TROPHY_COINS } from '@/lib/bosses'
import { toDayKey } from '@/lib/streak'
import { gainsVerses, walletTouch, type WalletAward } from '@/lib/wallet-server'
import type { Gain } from '@/lib/gains'
import type { CommuteSlot } from '@/lib/types'

// Enregistre un défi terminé : compte pour la série, les habitudes et l'XP.
// L'XP est recalculée ICI depuis score/total (+ bonus trajet, + bonus du mode
// de jeu, borné par le barème) — la valeur affichée côté client n'est jamais
// prise pour argent comptant.
//
// Elle est RENVOYÉE pour que l'écran de fin annonce le montant réellement
// versé : le recalculer côté client ratait le bonus de trajet et l'écrêtage,
// donc l'élève lisait un nombre différent de celui crédité à son compte.
export async function recordChallenge(
  score: number,
  total: number,
  mode?: GameModeId,
): Promise<{ saved: boolean; gains: Gain[] }> {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return { saved: false, gains: [] }

  const clean = (n: number, max: number) =>
    Number.isFinite(n) ? Math.max(0, Math.min(Math.round(n), max)) : 0

  const cleanTotal = clean(total, 50)
  const cleanScore = clean(score, cleanTotal)

  // Exploit de trajet : évalué au moment de l'enregistrement, avec les
  // créneaux du profil (même logique que l'affichage côté client).
  const { data: profile } = await supabase
    .from('profiles')
    .select('commute_slots')
    .eq('id', user.id)
    .maybeSingle()
  const slots: CommuteSlot[] = Array.isArray(profile?.commute_slots)
    ? (profile.commute_slots as CommuteSlot[])
    : []

  // Bonus du mode : uniquement une valeur du barème (jamais un nombre client),
  // doublé si le mode est celui mis en avant aujourd'hui (mode du jour).
  const modeBonus =
    mode && mode in MODE_XP_BONUS ? modeXpBonus(mode, toDayKey(new Date())) : 0

  const xp =
    cleanScore * XP_RULES.challengePerCorrect +
    XP_RULES.challengeBonus +
    modeBonus +
    (isCommuteNow(slots) ? XP_RULES.commuteBonus : 0)

  // On récupère l'id de la ligne écrite : c'est lui qui sert de preuve au
  // portefeuille. `wallet_award_xp` ne prend plus de montant, il relit l'XP sur
  // cette session — sans quoi la RPC, appelable directement avec la clé anon
  // publique, permettait de se verser de l'XP sans jouer.
  const { data: session, error } = await supabase
    .from('challenge_sessions')
    .insert({
      user_id: user.id,
      score: cleanScore,
      total: cleanTotal,
      xp,
    })
    .select('id')
    .maybeSingle<{ id: string }>()
  if (error) {
    // Sans trace, l'élève perd en silence son XP + sa validation de série : on
    // journalise comme les actions sœurs (claimWeeklyTrophy, recordDuelResult).
    console.error('[defi] défi non enregistré:', error.message)
  }

  // Coche « Révision quotidienne » (et « Test sur trajets » si on est en
  // créneau) du jour tout de suite, sans attendre le prochain chargement de /moi.
  let award: WalletAward | null = null
  if (!error) {
    const [, , touche] = await Promise.all([
      validateRevisionToday(supabase, user.id),
      validateCommuteToday(supabase, user.id, slots),
      // JOUER N'ACQUIERT RIEN, ET N'EN PAYE DONC PLUS L'XP (migration 348).
      // La colonne `challenge_sessions.xp` ci-dessus reste la trace historique
      // de la partie ; le portefeuille, lui, ne bouge que sur la SÉRIE — et
      // c'est elle qui peut faire tomber la gemme des 7 jours.
      session?.id ? walletTouch(supabase) : Promise.resolve(null),
    ])
    award = touche
  }

  revalidatePath('/defi')
  revalidatePath('/moi')
  // ⚠️ ON NE REND QUE CE QUI A ÉTÉ VERSÉ. Le `xp` calculé plus haut n'a JAMAIS
  // été crédité au portefeuille depuis la 348 : le rendre à l'écran de fin
  // ferait annoncer « +85 XP » par-dessus un compteur qui ne bouge pas.
  return { saved: !error, gains: error ? [] : gainsVerses(award) }
}

// Victoire sur le boss de la semaine : débloque le trophée exclusif de la
// collection + quelques pièces. L'identité du boss (donc du trophée) est
// recalculée ICI depuis la date — le client ne choisit rien. La PK de
// collection_unlocks garantit un seul versement par trophée.
export async function claimWeeklyTrophy(): Promise<{
  claimed: boolean
  trophyId: string
}> {
  const supabase = await createClient()
  const user = await getCurrentUser()
  const boss = weeklyBoss(toDayKey(new Date()))
  const trophyId = weeklyTrophyId(boss.id)
  if (!user) return { claimed: false, trophyId }

  const { data: claimed, error } = await supabase.rpc('claim_weekly_trophy', {
    p_item_id: trophyId,
    p_coins: WEEKLY_TROPHY_COINS,
  })
  if (error) {
    console.error('[defi] trophée hebdo non réclamé:', error.message)
    return { claimed: false, trophyId }
  }

  revalidatePath('/coffre')
  return { claimed: claimed === true, trophyId }
}

// Fin de duel : les manches du joueur deviennent son fantôme (duel_recordings).
// Ses amis affronteront cet enregistrement — d'où les bornes strictes : au
// plus 3 manches (BO3), scores et temps plausibles seulement.
export async function saveDuelRecording(
  rounds: { correct: number; timeMs: number }[],
): Promise<{ saved: boolean }> {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return { saved: false }

  const clean = (Array.isArray(rounds) ? rounds : [])
    .slice(0, 3)
    .flatMap((r) => {
      const correct = Number(r?.correct)
      const timeMs = Number(r?.timeMs)
      if (!Number.isFinite(correct) || !Number.isFinite(timeMs)) return []
      return [
        {
          correct: Math.max(0, Math.min(Math.round(correct), 5)),
          time_ms: Math.max(1000, Math.min(Math.round(timeMs), 600_000)),
        },
      ]
    })
  if (clean.length === 0) return { saved: false }

  const { error } = await supabase.from('duel_recordings').upsert({
    user_id: user.id,
    rounds: clean,
    updated_at: new Date().toISOString(),
  })
  return { saved: !error }
}

// Résultat d'une partie sur la ROUTE DES TROPHÉES : fait bouger le compteur du
// couple (matière × jeu). Le barème par bandes est recalculé côté serveur par
// l'RPC apply_game_trophies (migration 238) — le client ne fournit que l'issue.
//
// Le serveur refait tout ce qui compte : la bande du compteur, donc le gain, la
// liste blanche du couple (sinon on farmerait le +10 de la bande débutant sur
// des jeux inventés) et la borne de rythme. `null` couvre les trois refus
// possibles ainsi que le visiteur — dans tous les cas l'écran de fin n'affiche
// simplement pas de trophées.
export type GameTrophyOutcome = {
  before: number
  after: number
  delta: number
  best: number
  /** Total global (somme de tous les jeux), après la partie. */
  total: number
} | null

export async function recordGameTrophies(
  subjectSlug: string,
  gameId: string,
  won: boolean,
  score?: number,
): Promise<GameTrophyOutcome> {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return null

  const { data, error } = await supabase.rpc('apply_game_trophies', {
    p_subject_slug: String(subjectSlug).slice(0, 64),
    p_game_id: String(gameId).slice(0, 64),
    p_won: won === true,
    p_score: Number.isFinite(score) ? Math.max(0, Math.floor(score as number)) : null,
  })
  if (error || !data) {
    // Pas d'erreur console pour un simple refus (couple hors catalogue, rythme
    // dépassé) : ce n'est pas une panne. On ne journalise que l'échec technique.
    if (error) console.error('[defi] trophées non enregistrés:', error.message)
    return null
  }

  revalidatePath('/defi')
  revalidatePath('/amis')
  const r = data as {
    before: number
    after: number
    delta: number
    best: number
    total: number
  }
  return {
    before: Number(r.before ?? 0),
    after: Number(r.after ?? 0),
    delta: Number(r.delta ?? 0),
    best: Number(r.best ?? 0),
    total: Number(r.total ?? 0),
  }
}

// Issue d'un duel 1v1 → bilan Victoires/Défaites (profiles.wins/losses) + monnaie
// de victoire plafonnée. Appelé à la fin de CHAQUE duel — salons, fantômes,
// entraînement ET classé (en plus de recordRankedMatch qui bouge les trophées).
// N'affecte NI les trophées NI le classement ; le montant de pièces est figé et
// plafonné côté serveur (RPC record_duel_result, migration 174). Renvoie le
// nouveau bilan + les pièces versées, ou null (déconnecté / migration absente).
export type DuelResultOutcome = {
  wins: number
  losses: number
  coinsAwarded: number
} | null

export async function recordDuelResult(won: boolean): Promise<DuelResultOutcome> {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return null

  const { data, error } = await supabase.rpc('record_duel_result', {
    p_won: won === true,
  })
  if (error || !data) {
    // Migration 174 pas encore passée, ou déconnexion : le duel reste jouable,
    // seul le bilan V/D n'est pas mis à jour.
    if (error) console.error('[defi] bilan V/D non enregistré:', error.message)
    return null
  }

  revalidatePath('/defi')
  const r = data as { wins: number; losses: number; coins_awarded: number }
  return {
    wins: Math.max(0, Number(r.wins) || 0),
    losses: Math.max(0, Number(r.losses) || 0),
    coinsAwarded: Math.max(0, Number(r.coins_awarded) || 0),
  }
}

// Le versement du temps de travail (chrono du Défi) passe par la route
// app/api/work-time — compatible sendBeacon, garanti même quand la page se ferme.

// -----------------------------------------------------------------------------
// Écoles = clans (migration 159). Recherche/ajout d'école, rattachement de
// l'élève, le tout via RPC atomiques SECURITY DEFINER. Les classements réels
// (clan_ranking / national_ranking) sont lus directement côté page.
// -----------------------------------------------------------------------------

// Recherche d'écoles par nom pour un cycle donné (lecture directe : la table
// schools est lisible par tous les élèves authentifiés). Vide si < 2 caractères.
export async function searchSchools(
  query: string,
  level: string,
): Promise<import('@/lib/clan').School[]> {
  const q = typeof query === 'string' ? query.trim() : ''
  // `isSchoolLevel` plutôt que deux comparaisons en dur : le jour où un
  // troisième cycle est apparu (l'école primaire), la liste écrite ici l'aurait
  // silencieusement refusé — la recherche d'école ne renvoyant jamais rien.
  if (q.length < 2 || !isSchoolLevel(level)) return []
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('schools')
    .select('id, name, city, level')
    .eq('level', level)
    .ilike('name', `%${q}%`)
    .order('name', { ascending: true })
    .limit(12)
  if (error) {
    console.error('[clan] recherche école impossible:', error.message)
    return []
  }
  const { normalizeSchoolList } = await import('@/lib/clan')
  return normalizeSchoolList(data)
}

// Ajoute (ou retrouve) une école, puis rattache l'élève dessus. Renvoie
// l'école normalisée en cas de succès.
export async function joinNewSchool(
  name: string,
  city: string | null,
  level: string,
): Promise<{ ok: boolean; school: import('@/lib/clan').School | null }> {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user || (level !== 'college' && level !== 'lycee')) {
    return { ok: false, school: null }
  }
  const cleanName = typeof name === 'string' ? name.trim() : ''
  if (cleanName.length === 0) return { ok: false, school: null }
  const cleanCity =
    typeof city === 'string' && city.trim().length > 0 ? city.trim() : null

  const { data: id, error } = await supabase.rpc('find_or_create_school', {
    p_name: cleanName,
    p_city: cleanCity,
    p_level: level,
  })
  if (error || !id) {
    console.error('[clan] école non créée:', error?.message)
    return { ok: false, school: null }
  }
  const set = await setMySchool(String(id), level)
  return {
    ok: set.ok,
    school: set.ok
      ? { id: String(id), name: cleanName, city: cleanCity, level }
      : null,
  }
}

// Rattache l'élève à une école existante (ou la quitte avec schoolId null).
export async function setMySchool(
  schoolId: string | null,
  level: string,
): Promise<{ ok: boolean }> {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user || (level !== 'college' && level !== 'lycee')) return { ok: false }

  const { data, error } = await supabase.rpc('set_my_school', {
    p_school_id: schoolId,
    p_level: level,
  })
  if (error || data !== true) {
    console.error('[clan] rattachement école impossible:', error?.message)
    return { ok: false }
  }
  revalidatePath('/defi')
  revalidatePath('/compte')
  return { ok: true }
}
