'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { validateRevisionToday } from '@/lib/habits'
import { awardXp } from '@/lib/wallet-server'
import { advanceQuests } from '@/lib/quests-server'
import { contributeToClan } from '@/lib/clan-week-server'
import { addCrowns } from '@/lib/saison-server'
import { duel90Result, type Duel90Result } from '@/lib/duel90'
import { matchmakeOpponentTrophies } from '@/lib/trophies'

// -----------------------------------------------------------------------------
// Fin d'un Duel 90 s — LA boucle du jeu, et donc le seul endroit où convergent
// ses trois retombées : XP + trophées, contribution au clan de la semaine, et
// avancement des quêtes du jour. Un duel joué fait avancer les trois : c'est ce
// qui fait qu'on ne joue jamais « pour rien ».
//
// Le score annoncé par le client n'est JAMAIS pris pour argent comptant : tout
// est recalculé ici depuis le barème pur (lib/duel90), borné par ce qu'un duel
// de 90 secondes peut physiquement produire.
// -----------------------------------------------------------------------------

// Bornes d'un duel. 50 réponses, c'est 1,8 s par question pendant 90 secondes
// — déjà irréaliste — ET la borne exacte du CHECK `challenge_sessions_bounds_check`
// (migration 165 : total <= 50). Dépasser ferait échouer l'INSERT en silence,
// donc perdre l'XP de l'élève : les deux bornes DOIVENT rester alignées.
const MAX_ANSWERS = 50
// Le score maximal théorique : chaque réponse au tarif plein (base + vitesse)
// et au multiplicateur plafond.
const MAX_SCORE = MAX_ANSWERS * (100 + 50) * 3

export type Duel90Outcome = {
  saved: boolean
  result: Duel90Result
  /** Trophées après le duel (null si le mode classé n'est pas disponible). */
  trophiesAfter: number | null
  /** Points versés au clan cette fois-ci (0 = plafond atteint ou sans école). */
  clanPoints: number
  /** Ids des quêtes terminées PAR ce duel — l'écran de fin les célèbre. */
  questsCompleted: string[]
  /** Les trois quêtes du jour sont bouclées. */
  questDayDone: boolean
  /** Couronnes de saison gagnées (0 = plafond du jour, ou migration absente). */
  crowns: number
}

/**
 * Enregistre un duel terminé.
 *
 * @param score       points marqués par l'élève
 * @param correct     bonnes réponses
 * @param answered    réponses données
 * @param bestCombo   meilleure série de la partie
 * @param rivalScore  score final du rival (recalculable depuis la graine)
 * @param chapterId   chapitre joué (fait avancer la quête « chapitres »)
 */
export async function recordDuel90(
  score: number,
  correct: number,
  answered: number,
  bestCombo: number,
  rivalScore: number,
  chapterId?: string,
): Promise<Duel90Outcome> {
  const clamp = (n: number, max: number) =>
    Number.isFinite(n) ? Math.max(0, Math.min(Math.round(n), max)) : 0

  // Assainissement AVANT tout calcul : une valeur hors bornes est ramenée dans
  // le domaine du possible, jamais propagée.
  const safeAnswered = clamp(answered, MAX_ANSWERS)
  const safeCorrect = clamp(correct, safeAnswered)
  const safeScore = clamp(score, MAX_SCORE)
  const safeRival = clamp(rivalScore, MAX_SCORE)
  const safeCombo = clamp(bestCombo, safeCorrect)

  const result = duel90Result(
    safeScore,
    safeCorrect,
    safeAnswered,
    safeCombo,
    safeRival,
  )

  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) {
    return {
      saved: false,
      result,
      trophiesAfter: null,
      clanPoints: 0,
      questsCompleted: [],
      questDayDone: false,
      crowns: 0,
    }
  }

  // La trace du duel : c'est cette ligne qui sert de PREUVE au portefeuille.
  // `wallet_award_xp` relit l'XP dessus côté serveur — sans quoi la RPC,
  // appelable avec la clé anon publique, permettrait de se verser de l'XP sans
  // jouer (même raison que recordChallenge).
  const { data: session, error } = await supabase
    .from('challenge_sessions')
    .insert({
      user_id: user.id,
      score: result.correct,
      total: result.answered,
      xp: result.xp,
    })
    .select('id')
    .maybeSingle<{ id: string }>()
  if (error) {
    console.error('[duel90] duel non enregistré:', error.message)
  }

  // Les retombées ne dépendent pas les unes des autres : en parallèle.
  const [, , clanPlay, clanWin, quests, ranked, crownPlay, crownWin] =
    await Promise.all([
      // Série + habitude « Révision quotidienne » : un duel EST une révision.
      error ? Promise.resolve(null) : validateRevisionToday(supabase, user.id),
      error || !session?.id
        ? Promise.resolve(null)
        : awardXp(supabase, 'defi_arena', session.id),
      // Clan : jouer contribue déjà, gagner contribue plus.
      contributeToClan(supabase, 'duel_play'),
      result.outcome === 'win'
        ? contributeToClan(supabase, 'duel_win')
        : Promise.resolve(0),
      advanceQuests(supabase, user.id, {
        duelsPlayed: 1,
        duelsWon: result.outcome === 'win' ? 1 : 0,
        correct: result.correct,
        bestCombo: result.bestCombo,
        chapterIds: typeof chapterId === 'string' && chapterId ? [chapterId] : [],
      }),
      // La graine du matchmaking est l'id de la session : elle change à chaque
      // duel (avec l'id de l'élève en repli). Prendre l'id de l'ÉLÈVE lui
      // servirait toujours le même adversaire, donc toujours le même delta.
      applyTrophies(
        supabase,
        user.id,
        result.outcome === 'win',
        session?.id ?? user.id,
      ),
      // Saison : la piste avance en jouant, davantage en gagnant.
      addCrowns(supabase, 'duel_play'),
      result.outcome === 'win'
        ? addCrowns(supabase, 'duel_win')
        : Promise.resolve(0),
    ])

  // Journée de quêtes bouclée : le clan ET la saison en profitent (une seule
  // fois — les plafonds quotidiens côté SQL empêchent le versement répété).
  if (quests.allDone) {
    await Promise.all([
      contributeToClan(supabase, 'quest_day'),
      addCrowns(supabase, 'quest_day'),
    ])
  }

  revalidatePath('/defi')
  revalidatePath('/moi')

  return {
    saved: !error,
    result,
    trophiesAfter: ranked,
    clanPoints: clanPlay + clanWin,
    questsCompleted: quests.justCompleted,
    questDayDone: quests.allDone,
    crowns: crownPlay + crownWin,
  }
}

// Trophées : on réutilise la RPC du mode classé (migration 079) — un seul
// endroit fait bouger les trophées dans toute l'app. L'adversaire est matché
// sur les trophées courants, donc l'écart reste équitable.
async function applyTrophies(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  won: boolean,
  seed: string,
): Promise<number | null> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('trophies')
    .eq('id', userId)
    .maybeSingle()
  const mine = Number(profile?.trophies ?? 0)

  const { data, error } = await supabase.rpc('apply_ranked_match', {
    p_won: won,
    p_opponent_trophies: matchmakeOpponentTrophies(mine, seed.slice(0, 64)),
    p_opponent_label: null,
  })
  if (error || !data) {
    if (error) console.error('[duel90] trophées non appliqués:', error.message)
    return null
  }
  return Number((data as { after?: number }).after ?? mine)
}
