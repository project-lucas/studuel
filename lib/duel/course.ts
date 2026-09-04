// -----------------------------------------------------------------------------
// LA COURSE — les règles du duel classé, pures et déterministes.
//
// Le duel n'est plus « dix questions, trois vies » : c'est une COURSE. Deux
// barres, une par camp, qui se remplissent à chaque bonne réponse ; la première
// pleine gagne. Le rival répond EN MÊME TEMPS que l'élève — sa barre bouge, on
// le voit réfléchir, réussir, rater — et c'est cette simultanéité qui fait la
// tension : « il me rattrape », « je le double », « plus qu'une ».
//
// Tout ce fichier est sans React ni Supabase : le serveur revalide un duel avec
// exactement ces fonctions, et un test peut rejouer une course entière.
//
// Le BARÈME d'une réponse est celui du Duel 90 s (lib/duel90) : base + vitesse,
// multiplié par la série. Un seul barème dans l'app, jamais deux.
// -----------------------------------------------------------------------------

import { seededRng } from '@/lib/defi-modes'
import { answerPoints } from '@/lib/duel90'

/** La barre est pleine à ce score : c'est la ligne d'arrivée. */
export const GOAL_POINTS = 1000

/** Durée maximale d'une course. Passé ce cap, la barre la plus haute gagne. */
export const COURSE_MAX_MS = 90_000

/**
 * Combien de questions on prépare. Une course à 1 000 points se boucle en 6 à
 * 12 réponses, mais un duel ne doit JAMAIS tomber en panne de question devant
 * l'élève — et un élève rapide qui rate beaucoup peut en consommer vingt.
 */
export const COURSE_QUESTION_BUFFER = 30

/**
 * LA QUESTION DORÉE : une question de la course vaut DOUBLE, pour les deux
 * camps. C'est la variance du duel — le seul endroit où une course perdue peut
 * se retourner d'un coup, et où une course gagnée peut se perdre.
 *
 * Sa place est tirée de la graine, jamais choisie : entre la 3e et la 8e
 * question, assez tôt pour compter, assez tard pour qu'on l'attende.
 */
export const GOLDEN_MULTIPLIER = 2
export const GOLDEN_MIN_INDEX = 2
export const GOLDEN_MAX_INDEX = 7

export function goldenIndex(seed: string): number {
  const rng = seededRng(`${seed}#doree`)
  const span = GOLDEN_MAX_INDEX - GOLDEN_MIN_INDEX + 1
  return GOLDEN_MIN_INDEX + Math.min(span - 1, Math.floor(rng() * span))
}

/**
 * LE SPRINT FINAL : dès qu'un camp dépasse cette part de sa barre, la course
 * entre dans ses derniers mètres — le cœur bat, l'écran se tend. Aucun effet
 * sur les points : le sprint est une mise en scène, pas une règle.
 */
export const SPRINT_RATIO = 0.7

/** Points d'une réponse, question dorée comprise. Une erreur ne retire rien. */
export function pointsForAnswer(input: {
  good: boolean
  comboBefore: number
  answerMs: number
  golden: boolean
}): number {
  if (!input.good) return 0
  const base = answerPoints(input.comboBefore, input.answerMs)
  return input.golden ? base * GOLDEN_MULTIPLIER : base
}

/** Part de barre remplie par un score (0..1, jamais au-delà). */
export function fillRatio(score: number): number {
  if (!Number.isFinite(score) || score <= 0) return 0
  return Math.min(1, score / GOAL_POINTS)
}

/** La barre est-elle pleine ? */
export function hasReachedGoal(score: number): boolean {
  return Number.isFinite(score) && score >= GOAL_POINTS
}

export type Camp = 'moi' | 'rival'

/** Qui mène, ou null à égalité. */
export function leader(myScore: number, rivalScore: number): Camp | null {
  const me = Number.isFinite(myScore) ? myScore : 0
  const them = Number.isFinite(rivalScore) ? rivalScore : 0
  if (me > them) return 'moi'
  if (me < them) return 'rival'
  return null
}

/**
 * Un DÉPASSEMENT vient-il d'avoir lieu ? On ne célèbre que le passage d'une
 * tête à l'autre — pas l'écart qui se creuse, pas la sortie d'une égalité à
 * 0-0 (le premier point n'est pas un dépassement, c'est un départ).
 */
export function overtake(
  before: { me: number; rival: number },
  after: { me: number; rival: number },
): Camp | null {
  const was = leader(before.me, before.rival)
  const now = leader(after.me, after.rival)
  if (now === null || now === was) return null
  // Depuis l'égalité : un dépassement seulement si l'autre avait déjà marqué.
  if (was === null) {
    const otherHadPoints = now === 'moi' ? before.rival > 0 : before.me > 0
    return otherHadPoints ? now : null
  }
  return now
}

/** Le sprint est-il engagé ? */
export function isSprint(myScore: number, rivalScore: number): boolean {
  return (
    fillRatio(myScore) >= SPRINT_RATIO || fillRatio(rivalScore) >= SPRINT_RATIO
  )
}

export type CourseOutcome = 'win' | 'loss' | 'draw'

export type CampFinish = {
  score: number
  /** Instant où la barre s'est remplie, ou null si elle ne l'a pas été. */
  goalAtMs: number | null
}

/**
 * L'issue de la course.
 *
 *   1. Le premier à remplir sa barre gagne — même si l'autre la remplit aussi
 *      une seconde plus tard.
 *   2. Personne n'y arrive dans les 90 s : la barre la plus haute gagne.
 *   3. Égalité parfaite : `draw`. (Le serveur la règle EN FAVEUR de l'élève
 *      pour les trophées — l'app est de son côté — mais l'écran dit « égalité »,
 *      parce que c'en est une.)
 */
export function courseOutcome(me: CampFinish, rival: CampFinish): CourseOutcome {
  const mine = me.goalAtMs
  const theirs = rival.goalAtMs
  if (mine !== null && theirs !== null) {
    if (mine < theirs) return 'win'
    if (mine > theirs) return 'loss'
    return 'draw'
  }
  if (mine !== null) return 'win'
  if (theirs !== null) return 'loss'
  const a = Number.isFinite(me.score) ? me.score : 0
  const b = Number.isFinite(rival.score) ? rival.score : 0
  if (a > b) return 'win'
  if (a < b) return 'loss'
  return 'draw'
}

/** Ce que le serveur enregistre comme victoire (l'égalité revient à l'élève). */
export function countsAsWin(outcome: CourseOutcome): boolean {
  return outcome !== 'loss'
}

/** Le mot de la fin, sans jamais rabaisser. */
export function outcomeTitle(outcome: CourseOutcome): string {
  if (outcome === 'win') return 'Victoire !'
  if (outcome === 'draw') return 'Égalité'
  return 'Défaite'
}

/** Le sous-titre, lu avec l'écart. */
export function outcomeCaption(
  outcome: CourseOutcome,
  rivalName: string,
  me: CampFinish,
  rival: CampFinish,
): string {
  if (outcome === 'draw') return `Score parfaitement égal avec ${rivalName} — l’avantage te revient.`
  const gap = Math.abs(me.score - rival.score)
  if (outcome === 'win') {
    if (me.goalAtMs !== null && rival.goalAtMs !== null) {
      const ms = rival.goalAtMs - me.goalAtMs
      return `Tu as fini ${formatGap(ms)} avant ${rivalName}.`
    }
    if (me.goalAtMs !== null) return `Barre pleine avant ${rivalName}.`
    return gap <= 100
      ? `${rivalName} était à ${gap} points — un cheveu.`
      : `${gap} points d’avance sur ${rivalName}.`
  }
  if (rival.goalAtMs !== null && me.goalAtMs !== null) {
    const ms = me.goalAtMs - rival.goalAtMs
    return `${rivalName} a fini ${formatGap(ms)} avant toi.`
  }
  if (rival.goalAtMs !== null) return `${rivalName} a rempli sa barre en premier.`
  return gap <= 100
    ? `Battu d’un cheveu : ${gap} points.`
    : `${rivalName} finit avec ${gap} points d’avance.`
}

function formatGap(ms: number): string {
  const s = Math.max(0.1, ms / 1000)
  return s < 10 ? `${s.toFixed(1).replace('.', ',')} s` : `${Math.round(s)} s`
}

/** Le chrono affiché : « 1:30 », « 0:07 ». */
export function courseClock(msLeft: number): string {
  const s = Math.max(0, Math.ceil((Number.isFinite(msLeft) ? msLeft : 0) / 1000))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

// --- Le résultat d'une course jouée ------------------------------------------

export type CourseStats = {
  score: number
  correct: number
  answered: number
  bestCombo: number
  goalAtMs: number | null
}

export const MAX_COURSE_ANSWERS = 50

/**
 * Le score maximal que 50 réponses peuvent physiquement produire — la borne
 * du serveur, comme `MAX_SCORE` du Duel 90 s. Une réponse au tarif plein vaut
 * 150 × 3, la dorée le double.
 */
export const MAX_COURSE_SCORE = MAX_COURSE_ANSWERS * 150 * 3 + 150 * 3

/** Ramène des statistiques annoncées dans le domaine du possible. */
export function sanitizeStats(input: Partial<CourseStats>): CourseStats {
  const clamp = (n: unknown, max: number) =>
    typeof n === 'number' && Number.isFinite(n)
      ? Math.max(0, Math.min(Math.round(n), max))
      : 0
  const answered = clamp(input.answered, MAX_COURSE_ANSWERS)
  const correct = clamp(input.correct, answered)
  const score = clamp(input.score, MAX_COURSE_SCORE)
  const bestCombo = clamp(input.bestCombo, correct)
  const goal =
    typeof input.goalAtMs === 'number' && Number.isFinite(input.goalAtMs)
      ? Math.max(0, Math.min(Math.round(input.goalAtMs), COURSE_MAX_MS))
      : null
  // Une arrivée annoncée sans le score qui va avec n'est pas une arrivée.
  const goalAtMs = goal !== null && hasReachedGoal(score) ? goal : null
  return { score, correct, answered, bestCombo, goalAtMs }
}
