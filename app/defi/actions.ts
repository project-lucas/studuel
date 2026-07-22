'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { validateRevisionToday, validateCommuteToday } from '@/lib/habits'
import { isCommuteNow } from '@/lib/trajet'
import { XP_RULES } from '@/lib/xp'
import { MODE_XP_BONUS, modeXpBonus, type GameModeId } from '@/lib/defi-modes'
import { weeklyBoss, weeklyTrophyId, WEEKLY_TROPHY_COINS } from '@/lib/bosses'
import { matchmakeOpponentTrophies } from '@/lib/trophies'
import { toDayKey } from '@/lib/streak'
import { awardXp } from '@/lib/wallet-server'
import type { CommuteSlot } from '@/lib/types'

// Enregistre un défi terminé : compte pour la série, les habitudes et l'XP.
// L'XP est recalculée ICI depuis score/total (+ bonus trajet, + bonus du mode
// de jeu, borné par le barème) — la valeur affichée côté client n'est jamais
// prise pour argent comptant.
export async function recordChallenge(
  score: number,
  total: number,
  mode?: GameModeId,
): Promise<{ saved: boolean }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { saved: false }

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

  const { error } = await supabase.from('challenge_sessions').insert({
    user_id: user.id,
    score: cleanScore,
    total: cleanTotal,
    xp,
  })
  if (error) {
    // Sans trace, l'élève perd en silence son XP + sa validation de série : on
    // journalise comme les actions sœurs (claimWeeklyTrophy, recordDuelResult).
    console.error('[defi] défi non enregistré:', error.message)
  }

  // Coche « Révision quotidienne » (et « Test sur trajets » si on est en
  // créneau) du jour tout de suite, sans attendre le prochain chargement de /moi.
  if (!error) {
    await Promise.all([
      validateRevisionToday(supabase, user.id),
      validateCommuteToday(supabase, user.id, slots),
      // Verse la même XP au portefeuille (192) — la session reste la trace
      // historique, le portefeuille le total courant.
      awardXp(supabase, 'defi_arena', undefined, xp),
    ])
  }

  revalidatePath('/defi')
  revalidatePath('/moi')
  return { saved: !error }
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
  const {
    data: { user },
  } = await supabase.auth.getUser()
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
  const {
    data: { user },
  } = await supabase.auth.getUser()
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

// Résultat d'un match CLASSÉ : fait bouger les trophées de l'élève. Le barème
// (Elo-lite) est recalculé côté serveur par l'RPC apply_ranked_match — le
// client ne fournit que l'issue (won) et la graine du match ; les trophées de
// l'adversaire sont dérivés du matchmaking serveur (autour du joueur), et le
// delta est borné. Renvoie le total avant/après pour l'animation, ou null.
export type RankedOutcome = {
  before: number
  after: number
  delta: number
  best: number
} | null

export async function recordRankedMatch(
  won: boolean,
  seed: string,
  opponentLabel?: string,
): Promise<RankedOutcome> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  // Trophées actuels → matchmaking d'un adversaire proche (±120), déterministe.
  const { data: profile } = await supabase
    .from('profiles')
    .select('trophies')
    .eq('id', user.id)
    .maybeSingle()
  const myTrophies = Number(profile?.trophies ?? 0)
  const oppTrophies = matchmakeOpponentTrophies(
    myTrophies,
    typeof seed === 'string' && seed ? seed.slice(0, 64) : `${user.id}`,
  )

  const { data, error } = await supabase.rpc('apply_ranked_match', {
    p_won: won === true,
    p_opponent_trophies: oppTrophies,
    p_opponent_label:
      typeof opponentLabel === 'string' ? opponentLabel.slice(0, 80) : null,
  })
  if (error || !data) {
    console.error('[defi] match classé non enregistré:', error?.message)
    return null
  }

  revalidatePath('/defi')
  revalidatePath('/amis')
  const r = data as { before: number; after: number; delta: number; best: number }
  return {
    before: Number(r.before ?? myTrophies),
    after: Number(r.after ?? myTrophies),
    delta: Number(r.delta ?? 0),
    best: Number(r.best ?? myTrophies),
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
  const {
    data: { user },
  } = await supabase.auth.getUser()
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
  if (q.length < 2 || (level !== 'college' && level !== 'lycee')) return []
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
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
  const {
    data: { user },
  } = await supabase.auth.getUser()
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
  const {
    data: { user },
  } = await supabase.auth.getUser()
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
