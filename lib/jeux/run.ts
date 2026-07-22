// Le MOTEUR de partie des jeux de salon — pur, sans React ni réseau.
//
// Une partie, quelle que soit sa mécanique, se résume à un état (`GameRun`) et
// deux transitions : `answer` (le joueur a répondu) et `timeout` (le chrono de
// la question a expiré). Chaque mécanique interprète ces transitions à sa
// façon — c'est ce qui donne à chaque jeu sa sensation propre :
//
// - sprint     : rien ne s'arrête, seul le chrono global décide de la fin ;
// - vies       : chaque erreur coûte une vie, l'objectif est un nombre de prises ;
// - paliers    : on avance par vagues, le chrono par question se resserre ;
// - expedition : parcours fini, aucune mort — l'exactitude fait le score ;
// - ascension  : on monte d'un étage, une erreur en fait redescendre ;
// - ordre      : on repose les tuiles d'un tableau, l'erreur ne fait pas avancer.
//
// Les composants ne calculent RIEN : ils affichent l'état et rejouent les
// événements. Tout est testé dans run.test.ts.
import {
  waveSeconds,
  type GameFormat,
  type PaliersParams,
} from '@/lib/jeux/formats'

export type RunStatus = 'playing' | 'won' | 'lost'

export type GameRun = {
  status: RunStatus
  /** Points cumulés — le nombre qu'on cherche à battre. */
  score: number
  /** Bonnes réponses d'affilée EN COURS. */
  streak: number
  /** Meilleure série de la partie (l'histoire qu'on raconte à la fin). */
  bestStreak: number
  correct: number
  answered: number
  /**
   * Vies restantes. `null` quand la mécanique n'en a pas (sprint, expédition,
   * ascension) — un compteur de vies affiché à 0 dans un mode sans vies serait
   * un mensonge visuel.
   */
  lives: number | null
  /**
   * Étape courante, 0-based, dont le SENS dépend de la mécanique : index de
   * vague (paliers), index d'escale (expédition), étage atteint (ascension),
   * numéro de la question (sprint, vies).
   */
  step: number
  /** Questions déjà jouées dans la vague courante (paliers uniquement). */
  inWave: number
  /**
   * Vient de franchir une étape marquante (fin de vague, étage gagné, escale
   * bouclée) : le composant s'en sert pour jouer la célébration intermédiaire.
   * Toujours remis à false par la transition suivante.
   */
  stepJustCleared: boolean
}

// Points de base d'une bonne réponse — commun à toutes les mécaniques pour que
// les scores restent comparables d'un jeu à l'autre.
export const BASE_POINTS = 100
/** Bonus d'une réponse rapide (sprint uniquement). */
export const FAST_BONUS = 50
/** Multiplicateur de série maximal. */
export const MAX_MULTIPLIER = 4
/** Prime de fin de vague, multipliée par le rang de la vague. */
export const WAVE_BONUS = 150
/** Prime d'étage gagné, en plus des points de la réponse. */
export const FLOOR_BONUS = 50
/** Prime de parcours sans faute (expédition). */
export const PERFECT_BONUS = 500

/** Multiplicateur de la série EN COURS (avant la réponse) : ×1, ×2 à 3, ×3 à 6… */
export function comboMultiplier(streakBefore: number): number {
  return Math.min(MAX_MULTIPLIER, 1 + Math.floor(streakBefore / 3))
}

/** Part de bonnes réponses à atteindre pour « réussir » une expédition. */
export const EXPEDITION_PASS_RATIO = 0.6

export function startRun(format: GameFormat): GameRun {
  const p = format.params
  const lives =
    p.mechanic === 'vies'
      ? p.vies.lives
      : p.mechanic === 'paliers'
        ? p.paliers.lives
        : p.mechanic === 'ordre'
          ? p.ordre.lives
          : null
  return {
    status: 'playing',
    score: 0,
    streak: 0,
    bestStreak: 0,
    correct: 0,
    answered: 0,
    lives,
    step: 0,
    inWave: 0,
    stepJustCleared: false,
  }
}

/** Chrono de la question courante (secondes), ou null si la mécanique n'en a pas. */
export function questionSeconds(
  format: GameFormat,
  run: GameRun,
): number | null {
  const p = format.params
  switch (p.mechanic) {
    case 'sprint':
      return null // c'est le chrono GLOBAL qui presse, pas la question
    case 'vies':
      return p.vies.questionSeconds
    case 'paliers':
      return waveSeconds(p.paliers, run.step)
    case 'expedition':
      return p.expedition.questionSeconds
    case 'ascension':
      return p.ascension.questionSeconds
    case 'ordre':
      // Un chrono par TUILE n'aurait aucun sens : c'est le tableau entier qu'on
      // reconstitue. La pression, quand il y en a, vient du chrono global.
      return null
  }
}

/**
 * Chrono GLOBAL de la partie en secondes, ou null si la mécanique n'en a pas.
 * Deux mécaniques en ont : le sprint (toujours) et l'ordre (au cas par cas —
 * une frise se joue sans, une phrase en vrac se joue avec).
 */
export function globalSeconds(format: GameFormat): number | null {
  const p = format.params
  if (p.mechanic === 'sprint') return p.sprint.seconds
  if (p.mechanic === 'ordre') return p.ordre.globalSeconds
  return null
}

/** Objectif de la partie, tel qu'affiché dans le HUD (« 5/12 »), ou null. */
export function runTarget(format: GameFormat): number | null {
  const p = format.params
  switch (p.mechanic) {
    case 'vies':
      return p.vies.target
    case 'expedition':
      return p.expedition.stops
    case 'ascension':
      return p.ascension.floors
    case 'paliers':
      return p.paliers.waves
    case 'ordre':
      return p.ordre.boards
    default:
      return null
  }
}

/** Avancement de la partie tel qu'affiché face à `runTarget` (même unité). */
export function runProgress(format: GameFormat, run: GameRun): number {
  const p = format.params
  switch (p.mechanic) {
    case 'vies':
      return run.correct
    case 'expedition':
      return run.answered
    case 'ascension':
      return run.step
    case 'paliers':
    case 'ordre':
      return run.step
    default:
      return run.answered
  }
}

// Fin de la vague `index` atteinte ? (paliers)
function waveCleared(p: PaliersParams, inWave: number): boolean {
  return inWave >= p.waveSize
}

export type AnswerInput = {
  good: boolean
  /** Temps de réponse en ms — sert au bonus de vitesse du sprint. */
  elapsedMs: number
  /**
   * Nombre de tuiles du tableau EN COURS (mécanique `ordre` uniquement).
   *
   * Indispensable : les tableaux n'ont pas tous la même taille (une phrase
   * anglaise fait 4 à 6 mots), et `itemsPerBoard` du format n'en est que le
   * maximum. Se fier au format ferait attendre 6 poses sur un tableau de 4 —
   * le tableau ne se bouclerait jamais et la partie resterait bloquée.
   */
  boardSize?: number
}

/**
 * Applique une réponse. Retourne TOUJOURS un nouvel état (jamais de mutation).
 * Un appel sur une partie terminée est sans effet — les composants peuvent
 * ainsi être « en retard » d'un rendu sans corrompre le score.
 */
export function answer(
  format: GameFormat,
  run: GameRun,
  input: AnswerInput,
): GameRun {
  if (run.status !== 'playing') return run

  const streak = input.good ? run.streak + 1 : 0
  const base = {
    ...run,
    streak,
    bestStreak: Math.max(run.bestStreak, streak),
    correct: run.correct + (input.good ? 1 : 0),
    answered: run.answered + 1,
    stepJustCleared: false,
  }
  const gained = input.good ? BASE_POINTS * comboMultiplier(run.streak) : 0
  const p = format.params

  switch (p.mechanic) {
    // --- sprint : rien ne peut arrêter la course sauf le chrono global -------
    case 'sprint': {
      const fast = input.good && input.elapsedMs <= p.sprint.fastMs
      return {
        ...base,
        score: base.score + gained + (fast ? FAST_BONUS : 0),
        step: run.step + 1,
      }
    }

    // --- vies : l'erreur coûte, l'objectif libère ---------------------------
    case 'vies': {
      const lives = (run.lives ?? p.vies.lives) - (input.good ? 0 : 1)
      const reached = base.correct >= p.vies.target
      return {
        ...base,
        score: base.score + gained,
        lives,
        step: run.step + 1,
        status: lives <= 0 ? 'lost' : reached ? 'won' : 'playing',
        stepJustCleared: input.good && reached,
      }
    }

    // --- paliers : on franchit des vagues, le chrono se resserre ------------
    case 'paliers': {
      const lives = (run.lives ?? p.paliers.lives) - (input.good ? 0 : 1)
      if (lives <= 0) {
        return { ...base, score: base.score + gained, lives, status: 'lost' }
      }
      const inWave = run.inWave + 1
      if (!waveCleared(p.paliers, inWave)) {
        return { ...base, score: base.score + gained, lives, inWave }
      }
      // Vague bouclée : prime proportionnelle au rang, on passe à la suivante.
      const nextWave = run.step + 1
      const bonus = WAVE_BONUS * nextWave
      return {
        ...base,
        score: base.score + gained + bonus,
        lives,
        step: nextWave,
        inWave: 0,
        stepJustCleared: true,
        status: nextWave >= p.paliers.waves ? 'won' : 'playing',
      }
    }

    // --- expédition : personne n'élimine personne, on va au bout ------------
    case 'expedition': {
      const step = run.step + 1
      const finished = step >= p.expedition.stops
      const perfect = finished && base.correct === p.expedition.stops
      const passed =
        base.correct >= Math.ceil(p.expedition.stops * EXPEDITION_PASS_RATIO)
      return {
        ...base,
        score: base.score + gained + (perfect ? PERFECT_BONUS : 0),
        step,
        stepJustCleared: input.good,
        status: finished ? (passed ? 'won' : 'lost') : 'playing',
      }
    }

    // --- ordre : on pose les tuiles d'un tableau, une par une ---------------
    // Une erreur ne fait PAS avancer le tableau (la tuile attendue reste la
    // même) : on retente. C'est ce qui rend la mécanique enseignante plutôt que
    // punitive — on finit toujours par voir le bon ordre.
    case 'ordre': {
      const lives =
        p.ordre.lives === null
          ? null
          : (run.lives ?? p.ordre.lives) - (input.good ? 0 : 1)
      if (lives !== null && lives <= 0) {
        return { ...base, score: base.score + gained, lives, status: 'lost' }
      }
      if (!input.good) {
        return { ...base, score: base.score + gained, lives }
      }
      const size = input.boardSize ?? p.ordre.itemsPerBoard
      const placed = run.inWave + 1
      if (placed < size) {
        return { ...base, score: base.score + gained, lives, inWave: placed }
      }
      // Tableau reconstitué : prime, puis on passe au suivant.
      const boards = run.step + 1
      return {
        ...base,
        score: base.score + gained + WAVE_BONUS * boards,
        lives,
        step: boards,
        inWave: 0,
        stepJustCleared: true,
        status:
          p.ordre.boards !== null && boards >= p.ordre.boards
            ? 'won'
            : 'playing',
      }
    }

    // --- ascension : on monte d'un étage, l'erreur fait redescendre ---------
    case 'ascension': {
      const step = input.good
        ? run.step + 1
        : Math.max(0, run.step - p.ascension.fall)
      const reached = step >= p.ascension.floors
      return {
        ...base,
        score: base.score + gained + (input.good ? FLOOR_BONUS : 0),
        step,
        stepJustCleared: input.good,
        status: reached ? 'won' : 'playing',
      }
    }
  }
}

/**
 * Le chrono de la question a expiré. C'est une erreur — mais SANS le bruit
 * d'une mauvaise réponse choisie : `elapsedMs` vaut le chrono complet, donc
 * jamais de bonus de vitesse.
 */
export function timeout(format: GameFormat, run: GameRun): GameRun {
  return answer(format, run, { good: false, elapsedMs: Number.MAX_SAFE_INTEGER })
}

/**
 * Le chrono GLOBAL est arrivé à zéro (sprint, ou jeu d'ordre chronométré) : la
 * course est finie, et une course finie est toujours réussie — c'est un score à
 * battre, pas un examen. Sans effet sur les mécaniques sans chrono global.
 */
export function globalTimeUp(format: GameFormat, run: GameRun): GameRun {
  if (run.status !== 'playing') return run
  return { ...run, status: 'won', stepJustCleared: false }
}

/**
 * Une partie abandonnée en cours de route compte-t-elle ? Oui pour la file de
 * révision (chaque réponse a été donnée), non pour le score. Ce helper dit
 * simplement si la partie a produit quelque chose à enregistrer.
 */
export function isRecordable(run: GameRun): boolean {
  return run.answered > 0
}
