// -----------------------------------------------------------------------------
// « Duel 90 s » — LA boucle du jeu. Une seule action, répétable, courte :
// 90 secondes de questions sur le chapitre en cours, contre un rival dont le
// score monte EN DIRECT à côté du tien. Pas de manche, pas de BO3, pas d'écran
// intermédiaire — on appuie, on joue, on recommence.
//
// Tout est pur et déterministe ici (aucun React, aucun Supabase) : le rival est
// dérivé d'une graine, donc le serveur peut revalider un score et un test peut
// rejouer un duel entier. Les composants ne font qu'afficher.
// -----------------------------------------------------------------------------

import { seededRng } from '@/lib/defi-modes'

// --- Format --------------------------------------------------------------------

/** Durée d'un duel. 90 s : assez pour une vraie course, assez court pour
 *  « encore une ». C'est la constante la plus structurante du jeu. */
export const DUEL_SECONDS = 90
export const DUEL_MS = DUEL_SECONDS * 1000

/** Combien de questions on prépare pour un duel. Personne ne les épuisera en
 *  90 s (il faudrait répondre en moins de 3 s pendant tout le duel), mais un
 *  duel ne doit JAMAIS tomber en panne de question devant l'élève. */
export const DUEL_QUESTION_BUFFER = 40

/** Le duel est jouable dès ce nombre de questions : en dessous, le chapitre
 *  n'a pas assez de matière et on retombe sur le vivier général. */
export const DUEL_MIN_QUESTIONS = 6

// --- Barème ---------------------------------------------------------------------

export const POINTS_BASE = 100

/** Bonus de vitesse : plein tarif sous FAST_MS, nul au-delà de SLOW_MS,
 *  décroissance linéaire entre les deux. Répondre vite doit se VOIR. */
export const POINTS_SPEED_MAX = 50
export const SPEED_FAST_MS = 2000
export const SPEED_SLOW_MS = 8000

/** Multiplicateur de série : ×1, puis ×2 à 3 bonnes d'affilée, ×3 à 6 (plafond
 *  volontairement plus bas que le Blitz : sur 90 s, ×4 rendait le score
 *  illisible et écrasait la course avec le rival). */
export const MAX_COMBO_MULTIPLIER = 3

export function comboMultiplier(comboBefore: number): number {
  const safe = Number.isFinite(comboBefore) ? Math.max(0, Math.floor(comboBefore)) : 0
  return Math.min(MAX_COMBO_MULTIPLIER, 1 + Math.floor(safe / 3))
}

export function speedBonus(answerMs: number): number {
  if (!Number.isFinite(answerMs)) return 0
  if (answerMs <= SPEED_FAST_MS) return POINTS_SPEED_MAX
  if (answerMs >= SPEED_SLOW_MS) return 0
  const span = SPEED_SLOW_MS - SPEED_FAST_MS
  return Math.round((POINTS_SPEED_MAX * (SPEED_SLOW_MS - answerMs)) / span)
}

/** Points gagnés par une bonne réponse. Une erreur ne retire RIEN : on
 *  enseigne le plaisir, pas la punition — elle coûte déjà la série et le temps. */
export function answerPoints(comboBefore: number, answerMs: number): number {
  return (POINTS_BASE + speedBonus(answerMs)) * comboMultiplier(comboBefore)
}

// --- Le rival ---------------------------------------------------------------------
// Un adversaire asynchrone, mais qui se COMPORTE comme un adversaire en direct :
// son score grimpe pendant que tu joues. Il est entièrement dérivé d'une graine
// (clé de duel + niveaux), donc rejouable, testable et revalidable côté serveur.

/** Une frappe du rival : à quel instant du duel, et combien de points au total
 *  après elle. La courbe est un escalier, jamais une interpolation — un score
 *  de rival qui monte en continu ne ressemble pas à quelqu'un qui répond. */
export type RivalTick = { atMs: number; total: number }

export type RivalProfile = {
  /** Nom affiché du rival (jamais vide). */
  name: string
  /** Sa cadence moyenne de réponse, en ms. */
  paceMs: number
  /** Sa précision (0..1). */
  accuracy: number
  ticks: RivalTick[]
  /** Son score final au terme des 90 s — la barre à battre. */
  finalScore: number
}

const PACE_MIN_MS = 3500
const PACE_MAX_MS = 7500
const ACCURACY_MIN = 0.45
const ACCURACY_MAX = 0.85

/** Précision du rival selon l'écart de niveau : un adversaire plus fort vise
 *  mieux, mais jamais au point de rendre le duel injouable — ni ingagnable. */
export function rivalAccuracy(rivalLevel: number, myLevel: number): number {
  const gap = (Number.isFinite(rivalLevel) ? rivalLevel : 1) -
    (Number.isFinite(myLevel) ? myLevel : 1)
  return Math.min(ACCURACY_MAX, Math.max(ACCURACY_MIN, 0.62 + 0.035 * gap))
}

/**
 * Construit la courbe complète du rival pour un duel. Déterministe : la même
 * clé redonne exactement le même adversaire (re-render, reprise, revalidation
 * serveur). On simule ses réponses une par une jusqu'à la fin des 90 s.
 */
export function buildRival(
  key: string,
  name: string,
  rivalLevel: number,
  myLevel: number,
): RivalProfile {
  const rng = seededRng(key)
  const accuracy = rivalAccuracy(rivalLevel, myLevel)
  const paceMs = Math.round(PACE_MIN_MS + rng() * (PACE_MAX_MS - PACE_MIN_MS))

  const ticks: RivalTick[] = []
  let at = 0
  let total = 0
  let combo = 0
  // Garde-fou : la cadence minimale borne déjà le nombre d'itérations, mais on
  // ne laisse pas une graine pathologique boucler indéfiniment.
  for (let i = 0; i < 200; i++) {
    // Chaque réponse prend la cadence ± 40 % — un humain n'est pas un métronome.
    const jitter = 0.6 + rng() * 0.8
    at += Math.max(800, Math.round(paceMs * jitter))
    if (at > DUEL_MS) break
    if (rng() < accuracy) {
      // Le rival profite du même barème que le joueur : sinon sa progression
      // paraîtrait arbitraire, et une remontée du joueur ne se sentirait pas.
      total += answerPoints(combo, Math.round(paceMs * jitter))
      combo++
    } else {
      combo = 0
    }
    ticks.push({ atMs: at, total })
  }

  return {
    name: name.trim().length > 0 ? name.trim() : 'Rival',
    paceMs,
    accuracy,
    ticks,
    finalScore: total,
  }
}

/** Score du rival à un instant donné du duel (escalier : la dernière frappe
 *  déjà passée). Avant sa première réponse, il est à zéro comme tout le monde. */
export function rivalScoreAt(rival: RivalProfile, elapsedMs: number): number {
  if (!Number.isFinite(elapsedMs) || elapsedMs <= 0) return 0
  let score = 0
  for (const t of rival.ticks) {
    if (t.atMs > elapsedMs) break
    score = t.total
  }
  return score
}

// --- Issue et récompenses ----------------------------------------------------------

export type DuelOutcome = 'win' | 'loss' | 'draw'

/** Égalité parfaite : au joueur. L'app est de son côté (même règle que le duel
 *  fantôme historique). */
export function duel90Outcome(myScore: number, rivalScore: number): DuelOutcome {
  const me = Number.isFinite(myScore) ? myScore : 0
  const them = Number.isFinite(rivalScore) ? rivalScore : 0
  if (me > them) return 'win'
  if (me < them) return 'loss'
  return 'draw'
}

/** Trophées : +30 en victoire, −15 en défaite, 0 en nul. Gagner rapporte deux
 *  fois ce que perdre coûte — la courbe monte pour qui joue régulièrement,
 *  même en gagnant une fois sur deux. */
export const TROPHIES_WIN = 30
export const TROPHIES_LOSS = -15

export function duel90Trophies(outcome: DuelOutcome): number {
  if (outcome === 'win') return TROPHIES_WIN
  if (outcome === 'loss') return TROPHIES_LOSS
  return 0
}

/** XP d'un duel : le fond vient des bonnes réponses (on récompense ce qui est
 *  APPRIS, pas ce qui est gagné), la prime de victoire reste modeste. */
export const XP_PER_CORRECT = 4
export const XP_WIN_BONUS = 25
export const XP_PLAY_BONUS = 5

export function duel90Xp(correct: number, outcome: DuelOutcome): number {
  const good = Number.isFinite(correct) ? Math.max(0, Math.floor(correct)) : 0
  return (
    good * XP_PER_CORRECT +
    XP_PLAY_BONUS +
    (outcome === 'win' ? XP_WIN_BONUS : 0)
  )
}

// --- Résultat d'un duel joué ---------------------------------------------------

export type Duel90Result = {
  score: number
  correct: number
  answered: number
  bestCombo: number
  rivalScore: number
  outcome: DuelOutcome
  trophies: number
  xp: number
}

/** Assemble le résultat final. Utilisé par l'écran de fin ET par la Server
 *  Action qui recalcule tout côté serveur — un seul barème, jamais deux. */
export function duel90Result(
  score: number,
  correct: number,
  answered: number,
  bestCombo: number,
  rivalScore: number,
): Duel90Result {
  const outcome = duel90Outcome(score, rivalScore)
  return {
    score: Math.max(0, Math.round(score)),
    correct: Math.max(0, Math.round(correct)),
    answered: Math.max(0, Math.round(answered)),
    bestCombo: Math.max(0, Math.round(bestCombo)),
    rivalScore: Math.max(0, Math.round(rivalScore)),
    outcome,
    trophies: duel90Trophies(outcome),
    xp: duel90Xp(correct, outcome),
  }
}

/** Précision affichée en fin de duel (« 8/11 »). */
export function accuracyLabel(correct: number, answered: number): string {
  const a = Math.max(0, Math.round(answered))
  const c = Math.min(Math.max(0, Math.round(correct)), a)
  return `${c}/${a}`
}

/** Le mot de la fin. Court, jamais culpabilisant : même perdu, un duel joué
 *  vaut mieux qu'un duel évité. */
export function outcomeHeadline(outcome: DuelOutcome): string {
  if (outcome === 'win') return 'Duel gagné !'
  if (outcome === 'draw') return 'Égalité parfaite'
  return 'Battu d’un cheveu'
}

/** Le chrono affiché : « 1:30 », « 0:07 ». */
export function clockLabel(msLeft: number): string {
  const s = Math.max(0, Math.ceil((Number.isFinite(msLeft) ? msLeft : 0) / 1000))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}
