// -----------------------------------------------------------------------------
// LE RIVAL — sa ligne de temps, pure et rejouable.
//
// Un rival de course n'est pas un score final : c'est une SUITE D'INSTANTS.
// À 4,2 s il répond juste, à 9,1 s il rate, à 12,8 s il enchaîne… C'est cette
// suite que l'écran rejoue pendant que l'élève joue, et qui donne au duel sa
// simultanéité : la barre d'en face bouge, la bulle réfléchit, puis tranche.
//
// Deux origines, une seule forme :
//   · un ROBOT — la suite est dérivée d'une graine et d'un réglage (précision,
//     cadence, tempérament). Le serveur la refabrique à l'identique pour
//     revalider le duel ;
//   · un REPLAY — la suite est celle d'un vrai élève, enregistrée quand il a
//     joué cette matière. On rejoue exactement sa partie, à sa cadence.
//
// Dans les deux cas, les points se recalculent ICI avec le barème de la course
// (lib/duel/course) — jamais lus tels quels depuis une donnée stockée.
// -----------------------------------------------------------------------------

import { seededRng } from '@/lib/defi-modes'
import {
  COURSE_MAX_MS,
  GOAL_POINTS,
  hasReachedGoal,
  pointsForAnswer,
} from '@/lib/duel/course'

/** Un pas d'une partie enregistrée : quand, juste ou faux, en combien de temps. */
export type ReplayStep = {
  /** Instant de la réponse, en ms depuis le coup d'envoi. */
  at: number
  good: boolean
  /** Temps de réflexion sur cette question, en ms. */
  ms: number
}

/** Une frappe du rival, points cumulés compris. */
export type RivalEvent = {
  atMs: number
  good: boolean
  answerMs: number
  total: number
}

export type RivalTimeline = {
  events: RivalEvent[]
  finalScore: number
  /** Instant où sa barre s'est remplie, ou null. */
  goalAtMs: number | null
}

/**
 * LE TEMPÉRAMENT, ce qui rend un rival reconnaissable au bout de trois duels.
 *   · fleche     — part très vite, s'essouffle sur la fin ;
 *   · metronome  — la même cadence du début à la fin ;
 *   · finisseur  — lent au départ, accélère franchement dans les derniers mètres ;
 *   · irregulier — des éclairs et des trous, on ne sait jamais.
 */
export type Temperament = 'fleche' | 'metronome' | 'finisseur' | 'irregulier'

export const TEMPERAMENTS: readonly Temperament[] = [
  'fleche',
  'metronome',
  'finisseur',
  'irregulier',
]

export type RivalTuning = {
  /** Précision 0..1. */
  accuracy: number
  /** Cadence moyenne d'une réponse, en ms. */
  paceMs: number
  temperament: Temperament
}

export const PACE_MIN_MS = 3000
export const PACE_MAX_MS = 7000
export const ACCURACY_MIN = 0.45
export const ACCURACY_MAX = 0.9

/** Le temps de révélation entre deux questions, identique pour tout le monde. */
export const REVEAL_MS = 650

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n))

/**
 * Le réglage d'un robot selon les TROPHÉES de l'élève sur la matière.
 *
 * La bande de trophées (0..8, celle du barème de la Route) dit à quel niveau on
 * joue : un débutant affronte un rival qui hésite, un joueur à 800 trophées
 * affronte quelqu'un de vif. `strength` décale légèrement le réglage (−1..1) :
 * c'est la marge de personnalité de chaque robot, jamais un niveau de plus.
 *
 * Le calibrage vise ≈ 60 % de victoires pour l'élève — Supercell ne fait pas
 * du 50/50 : on gagne un peu plus qu'on ne perd, sinon on s'en va.
 */
export function tuningForTrophies(
  trophies: number,
  strength = 0,
): { accuracy: number; paceMs: number } {
  const safe = Number.isFinite(trophies) ? Math.max(0, trophies) : 0
  const band = Math.min(8, Math.floor(safe / 100))
  const t = band / 8
  const s = clamp(Number.isFinite(strength) ? strength : 0, -1, 1)
  return {
    accuracy: clamp(0.52 + 0.3 * t + 0.1 * s, ACCURACY_MIN, ACCURACY_MAX),
    paceMs: Math.round(clamp(6200 - 2600 * t - 700 * s, PACE_MIN_MS, PACE_MAX_MS)),
  }
}

/**
 * Le facteur de cadence à un instant de la course (0 = départ, 1 = fin),
 * selon le tempérament. `rng` fournit le grain d'irrégularité.
 */
export function paceFactor(
  temperament: Temperament,
  progress: number,
  rng: () => number,
): number {
  const p = clamp(Number.isFinite(progress) ? progress : 0, 0, 1)
  switch (temperament) {
    case 'fleche':
      return (0.72 + 0.6 * p) * (0.85 + rng() * 0.3)
    case 'metronome':
      return 0.92 + rng() * 0.16
    case 'finisseur':
      return (1.3 - 0.65 * p) * (0.85 + rng() * 0.3)
    case 'irregulier':
      return 0.5 + rng() * 1.1
  }
}

/**
 * La ligne de temps complète d'un robot. Déterministe : même graine, même
 * réglage → même rival, à la milliseconde. C'est ce qui permet au serveur de
 * revalider la course sans rien stocker.
 */
export function buildTimeline(
  seed: string,
  tuning: RivalTuning,
  goldenIndex: number,
): RivalTimeline {
  const rng = seededRng(`${seed}#rival`)
  const accuracy = clamp(tuning.accuracy, 0, 1)
  const pace = clamp(tuning.paceMs, 800, 20_000)

  const events: RivalEvent[] = []
  let at = 0
  let total = 0
  let combo = 0
  let goalAtMs: number | null = null

  for (let i = 0; i < 200; i++) {
    const factor = paceFactor(tuning.temperament, at / COURSE_MAX_MS, rng)
    const answerMs = Math.max(700, Math.round(pace * factor))
    at += answerMs
    if (at > COURSE_MAX_MS) break
    const good = rng() < accuracy
    total += pointsForAnswer({
      good,
      comboBefore: combo,
      answerMs,
      golden: i === goldenIndex,
    })
    combo = good ? combo + 1 : 0
    events.push({ atMs: at, good, answerMs, total })
    if (hasReachedGoal(total)) {
      goalAtMs = at
      break
    }
    // La révélation de la réponse : le rival la regarde aussi.
    at += REVEAL_MS
  }

  return { events, finalScore: total, goalAtMs }
}

/**
 * La ligne de temps d'un REPLAY : on rejoue les pas d'un vrai élève, mais les
 * points sont RECALCULÉS avec le barème et la question dorée de CE duel. Un
 * score stocké n'est jamais cru sur parole, et une dorée tirée aujourd'hui
 * s'applique aux deux camps.
 */
export function timelineFromSteps(
  steps: readonly ReplayStep[],
  goldenIndex: number,
): RivalTimeline {
  const events: RivalEvent[] = []
  let total = 0
  let combo = 0
  let goalAtMs: number | null = null
  let lastAt = 0

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i]
    const at = Math.max(lastAt, Math.round(step.at))
    if (at > COURSE_MAX_MS) break
    lastAt = at
    total += pointsForAnswer({
      good: step.good,
      comboBefore: combo,
      answerMs: step.ms,
      golden: i === goldenIndex,
    })
    combo = step.good ? combo + 1 : 0
    events.push({ atMs: at, good: step.good, answerMs: step.ms, total })
    if (hasReachedGoal(total)) {
      goalAtMs = at
      break
    }
  }
  return { events, finalScore: total, goalAtMs }
}

/** Ce que l'écran sait du rival à un instant donné. */
export type RivalSnapshot = {
  total: number
  answered: number
  correct: number
  combo: number
  /** Sa dernière frappe déjà passée, ou null avant la première. */
  lastEvent: RivalEvent | null
  /** Sa prochaine frappe, ou null s'il a fini. */
  nextAtMs: number | null
  /** Est-il en train de réfléchir (entre deux frappes, course en cours) ? */
  thinking: boolean
  /** Sa barre est pleine. */
  finished: boolean
}

export function rivalStateAt(
  timeline: RivalTimeline,
  elapsedMs: number,
): RivalSnapshot {
  const now = Number.isFinite(elapsedMs) ? Math.max(0, elapsedMs) : 0
  let total = 0
  let answered = 0
  let correct = 0
  let combo = 0
  let lastEvent: RivalEvent | null = null
  let nextAtMs: number | null = null

  for (const event of timeline.events) {
    if (event.atMs > now) {
      nextAtMs = event.atMs
      break
    }
    total = event.total
    answered += 1
    if (event.good) {
      correct += 1
      combo += 1
    } else {
      combo = 0
    }
    lastEvent = event
  }

  const finished = timeline.goalAtMs !== null && now >= timeline.goalAtMs
  return {
    total,
    answered,
    correct,
    combo,
    lastEvent,
    nextAtMs,
    thinking: !finished && nextAtMs !== null,
    finished,
  }
}

/** Le score final que le rival atteint si la course va au bout des 90 s. */
export function rivalFinal(timeline: RivalTimeline): { score: number; goalAtMs: number | null } {
  return { score: Math.max(0, timeline.finalScore), goalAtMs: timeline.goalAtMs }
}

/**
 * Le score du rival AU MOMENT OÙ LA COURSE S'ARRÊTE — ce qu'on affiche en face
 * du mien sur l'écran de fin. La course s'arrête à la première barre pleine
 * (la mienne ou la sienne), sinon au bout des 90 s. Afficher sa projection à
 * 90 s alors que je l'ai battu à 44 s raconterait une autre course que celle
 * qui vient d'être jouée.
 */
export function rivalScoreAtEnd(
  timeline: RivalTimeline,
  myGoalAtMs: number | null,
): number {
  const candidates = [COURSE_MAX_MS]
  if (myGoalAtMs !== null && Number.isFinite(myGoalAtMs)) candidates.push(myGoalAtMs)
  if (timeline.goalAtMs !== null) candidates.push(timeline.goalAtMs)
  return rivalStateAt(timeline, Math.min(...candidates)).total
}

export { GOAL_POINTS }
