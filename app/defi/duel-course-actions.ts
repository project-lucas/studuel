'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { validateRevisionToday } from '@/lib/habits'
import { gainsVerses, walletTouch } from '@/lib/wallet-server'
import type { Gain } from '@/lib/gains'
import { advanceQuests } from '@/lib/quests-server'
import { contributeToClan } from '@/lib/clan-week-server'
import { addCrowns } from '@/lib/saison-server'
import { recordReviewAnswers } from '@/app/reviser/actions'
import type { GameTrophyOutcome } from '@/app/defi/actions'
import type { ReviewAnswer } from '@/lib/srs'
import { PROGRAMME_GAME_ID } from '@/lib/jeux/programme'
import {
  countsAsWin,
  courseOutcome,
  goldenIndex,
  sanitizeStats,
  type CourseOutcome,
  type CourseStats,
} from '@/lib/duel/course'
import { botOpponent, opponentTimeline } from '@/lib/duel/opponent'
import { rivalFinal, rivalScoreAtEnd, timelineFromSteps } from '@/lib/duel/rival'
import { sanitizeSteps, type ReplayStep } from '@/lib/duel/replay'
import { fetchReplaySteps, saveReplay } from '@/lib/duel/opponent-server'

// -----------------------------------------------------------------------------
// FIN D'UNE COURSE — le seul endroit où le duel classé retombe : trophées de la
// matière, série, clan de la semaine, quêtes du jour, saison, bilan V/D, file
// de révision, et la TRACE qui fera de cette course le rival de quelqu'un.
//
// RIEN N'EST CRU SUR PAROLE. Le client annonce son score, ses réponses et
// l'adversaire qu'il dit avoir affronté ; le serveur REFABRIQUE le rival (un
// robot depuis la graine, un replay depuis la base), rejoue l'issue avec les
// mêmes fonctions pures que l'écran, et n'accorde les trophées que sur CE
// verdict. Un score annoncé hors du possible est ramené dans les bornes.
// -----------------------------------------------------------------------------

/** L'adversaire tel que le client le renvoie — jamais avec des points. */
export type OpponentClaim =
  | { kind: 'bot'; botId: string; trophiesRef: number }
  | { kind: 'replay'; replayId: string }

export type DuelCourseInput = {
  subjectSlug: string
  seed: string
  opponent: OpponentClaim
  stats: CourseStats
  /** Mes pas, pour la trace. */
  steps: ReplayStep[]
  /** Mes réponses, pour la file de révision. */
  answers: ReviewAnswer[]
}

export type DuelCourseOutcome = {
  saved: boolean
  /** Le verdict du SERVEUR, celui qui compte. */
  outcome: CourseOutcome
  /** Le rival tel que le serveur l'a rejoué (null s'il n'a pas pu). */
  rival: { score: number; goalAtMs: number | null } | null
  stats: CourseStats
  trophies: GameTrophyOutcome
  /** Points versés au clan cette fois-ci. */
  clanPoints: number
  questsCompleted: string[]
  questDayDone: boolean
  /** Ce qui a été versé, prêt à voler vers le bandeau. */
  gains: Gain[]
  /** La trace a été déposée : cette course peut devenir le rival de quelqu'un. */
  replaySaved: boolean
}

const MAX_ANSWERS = 50

export async function recordDuelCourse(input: DuelCourseInput): Promise<DuelCourseOutcome> {
  const stats = sanitizeStats(input.stats ?? {})
  const seed = String(input.seed ?? '').slice(0, 120)
  const subjectSlug = String(input.subjectSlug ?? '').slice(0, 64)

  const empty = (outcome: CourseOutcome): DuelCourseOutcome => ({
    saved: false,
    outcome,
    rival: null,
    stats,
    trophies: null,
    clanPoints: 0,
    questsCompleted: [],
    questDayDone: false,
    gains: [],
    replaySaved: false,
  })

  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user || !subjectSlug || !seed) return empty('loss')

  // ---------------------------------------------------- le rival, rejoué ici
  const timeline = await rebuildRival(supabase, input.opponent, seed)
  const rivalEnd = timeline ? rivalFinal(timeline) : null
  // Sans rival vérifiable, la course compte pour l'activité (série, quêtes)
  // mais n'accorde PAS de trophées : on ne paye pas une victoire qu'on ne peut
  // pas constater.
  const outcome: CourseOutcome = rivalEnd
    ? courseOutcome({ score: stats.score, goalAtMs: stats.goalAtMs }, rivalEnd)
    : 'loss'
  const won = rivalEnd !== null && countsAsWin(outcome)
  // Ce qu'on renvoie à l'écran : le score du rival AU MOMENT où la course
  // s'est arrêtée, pas sa projection à 90 s.
  const rival =
    timeline && rivalEnd
      ? { score: rivalScoreAtEnd(timeline, stats.goalAtMs), goalAtMs: rivalEnd.goalAtMs }
      : null

  // ------------------------------------------------ la preuve d'activité
  const { data: session, error } = await supabase
    .from('challenge_sessions')
    .insert({
      user_id: user.id,
      score: Math.min(stats.correct, MAX_ANSWERS),
      total: Math.min(stats.answered, MAX_ANSWERS),
      xp: 0,
    })
    .select('id')
    .maybeSingle<{ id: string }>()
  if (error) console.error('[duel] course non enregistrée:', error.message)

  const steps = sanitizeSteps(input.steps)
  const answers = Array.isArray(input.answers) ? input.answers.slice(0, MAX_ANSWERS) : []

  const [, award, clanPlay, clanWin, quests, trophies, crownPlay, crownWin, duelResult, replaySaved] =
    await Promise.all([
      error ? Promise.resolve(null) : validateRevisionToday(supabase, user.id),
      error || !session?.id ? Promise.resolve(null) : walletTouch(supabase),
      contributeToClan(supabase, 'duel_play'),
      won ? contributeToClan(supabase, 'duel_win') : Promise.resolve(0),
      advanceQuests(supabase, user.id, {
        duelsPlayed: 1,
        duelsWon: won ? 1 : 0,
        correct: stats.correct,
        bestCombo: stats.bestCombo,
        chapterIds: [],
      }),
      rival ? applyTrophies(supabase, subjectSlug, won, stats.score) : Promise.resolve(null),
      addCrowns(supabase, 'duel_play'),
      won ? addCrowns(supabase, 'duel_win') : Promise.resolve(0),
      rival ? recordWinLoss(supabase, won) : Promise.resolve(0),
      rival
        ? saveReplay(supabase, { subjectSlug, score: stats.score, won, steps })
        : Promise.resolve(false),
      answers.length > 0 ? recordReviewAnswers(answers).catch(() => null) : Promise.resolve(null),
    ])

  if (quests.allDone) {
    await Promise.all([
      contributeToClan(supabase, 'quest_day'),
      addCrowns(supabase, 'quest_day'),
    ])
  }

  revalidatePath('/defi')
  revalidatePath('/amis')
  revalidatePath('/moi')

  return {
    saved: !error,
    outcome,
    rival,
    stats,
    trophies,
    clanPoints: clanPlay + clanWin,
    questsCompleted: quests.justCompleted,
    questDayDone: quests.allDone,
    gains: gainsVerses(award, {
      couronnes: crownPlay + crownWin,
      ecus: duelResult,
    }),
    replaySaved,
  }
}

// Le rival, refabriqué côté serveur. Un robot se dérive de la graine et du
// réglage annoncé (les trophées de référence sont bornés) ; un replay se relit
// en base — jamais depuis les pas que le client aurait pu renvoyer.
async function rebuildRival(
  supabase: Awaited<ReturnType<typeof createClient>>,
  claim: OpponentClaim,
  seed: string,
) {
  if (!claim || typeof claim !== 'object') return null
  if (claim.kind === 'bot') {
    const ref = Number.isFinite(claim.trophiesRef)
      ? Math.max(0, Math.min(Math.floor(claim.trophiesRef), 20_000))
      : 0
    const opponent = botOpponent(String(claim.botId ?? ''), ref)
    return opponent ? opponentTimeline(opponent, seed) : null
  }
  if (claim.kind === 'replay') {
    const steps = await fetchReplaySteps(supabase, String(claim.replayId ?? ''))
    return steps ? timelineFromSteps(steps, goldenIndex(seed)) : null
  }
  return null
}

// Les trophées de la matière, par la RPC de la Route (238) — la même que les
// jeux de salon, avec l'id « programme » : le duel classé EST le jeu Programme
// de la matière, ses trophées vont sur le même compteur.
async function applyTrophies(
  supabase: Awaited<ReturnType<typeof createClient>>,
  subjectSlug: string,
  won: boolean,
  score: number,
): Promise<GameTrophyOutcome> {
  const { data, error } = await supabase.rpc('apply_game_trophies', {
    p_subject_slug: subjectSlug,
    p_game_id: PROGRAMME_GAME_ID,
    p_won: won,
    p_score: Math.max(0, Math.floor(score)),
  })
  if (error || !data) {
    if (error) console.error('[duel] trophées non enregistrés:', error.message)
    return null
  }
  const r = data as { before: number; after: number; delta: number; best: number; total: number }
  return {
    before: Number(r.before ?? 0),
    after: Number(r.after ?? 0),
    delta: Number(r.delta ?? 0),
    best: Number(r.best ?? 0),
    total: Number(r.total ?? 0),
  }
}

// Le bilan V/D et la monnaie de victoire (174). Rend les écus versés (0 si le
// plafond du jour est atteint, ou si la migration manque).
async function recordWinLoss(
  supabase: Awaited<ReturnType<typeof createClient>>,
  won: boolean,
): Promise<number> {
  const { data, error } = await supabase.rpc('record_duel_result', { p_won: won })
  if (error || !data) return 0
  const r = data as { coins_awarded?: number }
  return Math.max(0, Number(r.coins_awarded) || 0)
}
