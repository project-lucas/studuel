// -----------------------------------------------------------------------------
// L'ÉCHELLE DE PALIERS d'un jeu de salon — logique pure, plus son stockage.
//
// Pourquoi ce fichier existe : jusqu'ici un jeu n'avait qu'UNE difficulté. Le
// générateur de calcul mental servait les mêmes tables de multiplication à un
// 6e et à un Terminale ; l'un se noyait, l'autre s'ennuyait, et aucun des deux
// ne revenait. Un jeu qui ne grandit pas avec l'élève ne se rejoue pas.
//
// Une échelle de CINQ paliers y répond, et la difficulté se joue sur trois
// leviers à la fois (un chrono raccourci tout seul n'est pas un défi, c'est une
// punition) : la BANQUE de questions (lib/jeux/<jeu>.ts), le RYTHME du format
// (lib/jeux/palier-format.ts) et l'OBJECTIF à atteindre.
//
// Le déblocage se fait aux ÉTOILES : chaque partie en rapporte de 0 à 3, et
// deux étoiles ouvrent le palier suivant. Une étoile acquise ne se reperd
// jamais — contrairement aux trophées, qui redescendent : on ne punit pas un
// mauvais jour en refermant une porte déjà ouverte.
//
// Et personne ne démarre en bas : la CLASSE de l'élève ouvre d'office les
// premiers paliers (`palierFloor`). Un Terminale à qui l'on impose « Éveil »
// avant de jouer ferme l'app.
// -----------------------------------------------------------------------------
import type { GradeLevel } from '@/lib/types'
import type { GameRun } from '@/lib/jeux/run'

export type PalierLevel = 1 | 2 | 3 | 4 | 5
export type StarCount = 0 | 1 | 2 | 3

export type PalierDef = {
  level: PalierLevel
  /** Clé stable (classes CSS, analytics) — sans accent ni espace. */
  key: string
  name: string
  /** La promesse du palier en trois mots, sous son nom. */
  tagline: string
}

/**
 * Les cinq paliers. Volontairement PAS nommés d'après les classes (« niveau
 * 4e ») : un élève de Terminale qui doit jouer au « niveau 4e » est humilié
 * avant d'avoir commencé. Ces noms-là ne disent que le rapport au jeu.
 */
export const PALIERS: readonly PalierDef[] = [
  { level: 1, key: 'eveil', name: 'Éveil', tagline: 'Les bases, sans piège' },
  { level: 2, key: 'apprenti', name: 'Apprenti', tagline: 'On serre un peu' },
  { level: 3, key: 'confirme', name: 'Confirmé', tagline: 'Le jeu à son rythme' },
  { level: 4, key: 'expert', name: 'Expert', tagline: 'Vite, et sans filet' },
  { level: 5, key: 'maitre', name: 'Maître', tagline: 'Le palier des records' },
] as const

export const PALIER_LEVELS: readonly PalierLevel[] = PALIERS.map((p) => p.level)

/**
 * Le palier de référence : celui pour lequel les formats de `lib/jeux/formats`
 * ont été réglés à la main. Les quatre autres sont dérivés de lui.
 */
export const DEFAULT_PALIER: PalierLevel = 3

export const MAX_STARS = 3
/** Étoiles à décrocher sur un palier pour ouvrir le suivant. */
export const STARS_TO_UNLOCK = 2
export const TOTAL_STARS = PALIERS.length * MAX_STARS

export function isPalierLevel(value: unknown): value is PalierLevel {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= PALIERS.length
  )
}

/** Le palier d'un segment d'URL (`/defi/jeux/calcul-mental/4`), ou null. */
export function parsePalier(raw: string | undefined | null): PalierLevel | null {
  if (!raw) return null
  const n = Number(raw)
  return isPalierLevel(n) ? n : null
}

export function palierDef(level: PalierLevel): PalierDef {
  return PALIERS[level - 1] ?? PALIERS[DEFAULT_PALIER - 1]
}

/** « Palier 4 · Expert » — le titre d'écran, toujours écrit pareil. */
export function palierTitle(level: PalierLevel): string {
  return `Palier ${level} · ${palierDef(level).name}`
}

// --------------------------------------------------------------- les étoiles

/**
 * Les trois seuils d'étoile, en TAUX DE RÉUSSITE. On note l'exactitude et non
 * le score : le score dépend de la mécanique (un sprint en rapporte dix fois
 * plus qu'une expédition), le taux de réussite se compare d'un jeu à l'autre.
 */
export const STAR_ACCURACY = { one: 0.6, two: 0.8, three: 0.95 } as const

/**
 * Les étoiles d'une partie. Une partie PERDUE plafonne à une étoile, si bonne
 * soit sa précision : aller au bout fait partie de l'épreuve. Une partie que la
 * mécanique ne permet pas de perdre (expédition) est toujours « gagnée » — ses
 * étoiles ne dépendent donc que de l'exactitude, ce qui est exactement le sens
 * de ces jeux-là.
 */
export function starsFor(
  run: Pick<GameRun, 'status' | 'correct' | 'answered'>,
): StarCount {
  if (run.answered <= 0) return 0
  const accuracy = run.correct / run.answered
  if (run.status !== 'won') return accuracy >= STAR_ACCURACY.one ? 1 : 0
  if (accuracy >= STAR_ACCURACY.three) return 3
  if (accuracy >= STAR_ACCURACY.two) return 2
  return 1
}

/** Le taux de réussite qu'il faut viser pour l'étoile suivante (null au max). */
export function nextStarAccuracy(stars: StarCount): number | null {
  if (stars >= 3) return null
  if (stars === 2) return STAR_ACCURACY.three
  if (stars === 1) return STAR_ACCURACY.two
  return STAR_ACCURACY.one
}

// -------------------------------------------------------------- la progression

/**
 * Ce qu'on retient d'un palier : ses étoiles, son meilleur score, et le
 * meilleur TEMPS de bouclage.
 *
 * Le temps n'est enregistré que sur une partie GAGNÉE, et c'est tout l'intérêt
 * de la règle : sans elle, abandonner à la première question donnerait le
 * meilleur chrono du jeu. « Le plus rapide » ne veut dire quelque chose que si
 * tout le monde est allé au bout de la même épreuve.
 */
export type PalierScore = {
  stars: StarCount
  best: number
  /** Meilleur temps de bouclage en millisecondes, absent tant qu'on n'a pas gagné. */
  timeMs?: number
}

export type PalierProgress = Partial<Record<PalierLevel, PalierScore>>

export function starsAt(progress: PalierProgress, level: PalierLevel): StarCount {
  return progress[level]?.stars ?? 0
}

export function bestAt(progress: PalierProgress, level: PalierLevel): number {
  return progress[level]?.best ?? 0
}

/** Meilleur temps de bouclage du palier, ou null tant qu'il n'a pas été gagné. */
export function bestTimeAt(
  progress: PalierProgress,
  level: PalierLevel,
): number | null {
  return progress[level]?.timeMs ?? null
}

export function totalStars(progress: PalierProgress): number {
  return PALIER_LEVELS.reduce((sum, l) => sum + starsAt(progress, l), 0)
}

/**
 * Le plus haut palier OUVERT. La classe ouvre d'office jusqu'au plancher, et
 * l'élève continue de grimper À PARTIR DE LÀ, deux étoiles à la fois.
 *
 * On part du plancher et non du bas de l'échelle : sinon un Terminale qui
 * décroche ses deux étoiles au palier Expert n'ouvrirait pas Maître, faute
 * d'avoir joué les trois paliers que sa classe lui avait déjà ouverts.
 */
export function unlockedThrough(
  progress: PalierProgress,
  floor: PalierLevel = 1,
): PalierLevel {
  let level: PalierLevel = floor
  while (level < PALIERS.length && starsAt(progress, level) >= STARS_TO_UNLOCK) {
    level = (level + 1) as PalierLevel
  }
  return level
}

export function isUnlocked(
  progress: PalierProgress,
  floor: PalierLevel,
  level: PalierLevel,
): boolean {
  return level <= unlockedThrough(progress, floor)
}

/**
 * Le palier que l'écran met en avant (« Continuer ») : le premier palier ouvert
 * — à partir du plancher de classe — qui n'a pas encore ses deux étoiles. Tout
 * décroché, on pointe le sommet ouvert.
 *
 * Le plancher compte ici aussi : sans lui, un Terminale à qui la classe ouvre
 * quatre paliers se verrait quand même proposer « Éveil » en premier. Les
 * paliers du bas restent jouables — ils sont là pour les mauvais jours.
 */
export function currentPalier(
  progress: PalierProgress,
  floor: PalierLevel = 1,
): PalierLevel {
  const top = unlockedThrough(progress, floor)
  for (let l = floor; l <= top; l++) {
    if (starsAt(progress, l as PalierLevel) < STARS_TO_UNLOCK) {
      return l as PalierLevel
    }
  }
  return top
}

/** Étoiles encore nécessaires au palier précédent pour ouvrir celui-ci (0 si ouvert). */
export function starsMissingFor(
  progress: PalierProgress,
  floor: PalierLevel,
  level: PalierLevel,
): number {
  if (isUnlocked(progress, floor, level)) return 0
  const previous = (level - 1) as PalierLevel
  return Math.max(0, STARS_TO_UNLOCK - starsAt(progress, previous))
}

// ------------------------------------------------------- le résultat d'une partie

/**
 * Ce qu'une table de jeu doit savoir des paliers : celui qu'on joue, et le
 * plancher ouvert par la classe. Le plancher compte au moment de fêter un
 * déblocage — sans lui, on annoncerait « palier 2 ouvert ! » à un Terminale qui
 * en avait déjà quatre.
 */
export type PalierRun = { level: PalierLevel; floor: PalierLevel }

export type PalierOutcome = {
  level: PalierLevel
  /** Étoiles de CETTE partie. */
  stars: StarCount
  /** Étoiles gagnées en plus du record précédent (0 si on n'a pas fait mieux). */
  gained: number
  /** Meilleur score du palier, après la partie. */
  best: number
  isBest: boolean
  /** Temps de CETTE partie, ou null si elle n'a pas été gagnée (donc pas chronométrée). */
  timeMs: number | null
  /** Meilleur temps du palier après la partie, ou null s'il n'y en a toujours pas. */
  bestTimeMs: number | null
  /** Cette partie est le nouveau meilleur temps. */
  isBestTime: boolean
  /** Palier ouvert PAR cette partie, ou null. C'est ce qui se fête. */
  unlocked: PalierLevel | null
}

/**
 * Range une partie dans la progression. Le résultat n'écrase jamais un meilleur
 * résultat : on garde le maximum d'étoiles et le meilleur score.
 */
export function applyRun(
  progress: PalierProgress,
  floor: PalierLevel,
  level: PalierLevel,
  run: Pick<GameRun, 'status' | 'correct' | 'answered' | 'score'>,
  elapsedMs?: number | null,
): { progress: PalierProgress; outcome: PalierOutcome } {
  const before = unlockedThrough(progress, floor)
  const stars = starsFor(run)
  const previous = progress[level] ?? { stars: 0 as StarCount, best: 0 }
  // Le chrono ne compte QUE sur une partie gagnée, et seulement s'il est
  // vraisemblable : une valeur absurde (horloge remise à l'heure en pleine
  // partie, onglet en veille) ne doit pas s'installer comme record à vie.
  const timeMs =
    run.status === 'won' && isPlausibleTime(elapsedMs)
      ? Math.round(elapsedMs as number)
      : null
  const previousTime = previous.timeMs ?? null
  const bestTimeMs =
    timeMs === null
      ? previousTime
      : previousTime === null
        ? timeMs
        : Math.min(previousTime, timeMs)
  const merged: PalierScore = {
    stars: Math.max(previous.stars, stars) as StarCount,
    best: Math.max(previous.best, Math.round(run.score)),
    ...(bestTimeMs === null ? {} : { timeMs: bestTimeMs }),
  }
  const next: PalierProgress = { ...progress, [level]: merged }
  const after = unlockedThrough(next, floor)
  return {
    progress: next,
    outcome: {
      level,
      stars,
      gained: Math.max(0, stars - previous.stars),
      best: merged.best,
      isBest: Math.round(run.score) > previous.best,
      timeMs,
      bestTimeMs,
      isBestTime: timeMs !== null && (previousTime === null || timeMs < previousTime),
      unlocked: after > before ? after : null,
    },
  }
}

/** Durée minimale crédible pour une partie bouclée. */
export const MIN_RUN_MS = 2_000
/** Au-delà, on ne chronomètre plus : l'élève a laissé l'onglet ouvert. */
export const MAX_RUN_MS = 60 * 60 * 1000

export function isPlausibleTime(ms: number | null | undefined): boolean {
  return (
    typeof ms === 'number' &&
    Number.isFinite(ms) &&
    ms >= MIN_RUN_MS &&
    ms <= MAX_RUN_MS
  )
}

/**
 * Un chrono à la française : « 47,3 s » en dessous de la minute (le dixième
 * départage deux parties serrées), « 1 min 24 s » au-dessus.
 *
 * Pas de `toLocaleString` ici, comme pour les records : son résultat dépend de
 * la locale de l'appareil, et le même écran afficherait « 47.3 s » sur un
 * téléphone en anglais.
 */
export function formatDuration(ms: number): string {
  const total = Math.max(0, Math.round(ms))
  if (total < 60_000) {
    return `${(total / 1000).toFixed(1).replace('.', ',')} s`
  }
  const minutes = Math.floor(total / 60_000)
  const seconds = Math.round((total % 60_000) / 1000)
  // 1 min 60 s ne s'écrit pas : l'arrondi des secondes déborde sur la minute.
  if (seconds === 60) return `${minutes + 1} min`
  return seconds === 0 ? `${minutes} min` : `${minutes} min ${seconds} s`
}

// ------------------------------------------------------- le plancher de classe

/**
 * Les paliers ouverts d'office par la CLASSE. Un jeu de salon n'est pas une
 * leçon : sa difficulté ne suit pas le programme, mais il serait absurde de
 * faire recommencer un lycéen à « Éveil ». Le plancher ouvre la porte ; il
 * n'oblige à rien, et les paliers du dessous restent jouables.
 */
export function palierFloor(grade: GradeLevel | null | undefined): PalierLevel {
  switch (grade) {
    case '4e':
    case '3e':
      return 2
    case '2de':
    case '1re':
    case '1re techno':
      return 3
    case 'Tle':
    case 'Tle techno':
      return 4
    default:
      // Primaire, 6e, 5e — et classe inconnue (visiteur) : on part du bas.
      return 1
  }
}

// ------------------------------------------------------------------ stockage
// Local, comme les records (lib/jeux/records) : une banque de jeu de salon ne
// se rapproche d'aucune table côté serveur. Le jour où la progression devra
// suivre l'élève d'un appareil à l'autre, seules ces trois fonctions changent.

/** Même préfixe que les records — une seule famille de clés à retrouver. */
export const PALIER_PREFIX = 'studuel-jeu-'

export function palierStorageKey(id: string): string {
  return `${PALIER_PREFIX}${id}-paliers`
}

/**
 * Relit une progression sérialisée. Tolérante par construction : un stockage
 * corrompu, une version plus ancienne ou une clé écrite à la main rendent une
 * progression VIDE plutôt qu'une exception en pleine ouverture d'écran.
 */
export function parseProgress(raw: string | null | undefined): PalierProgress {
  if (!raw) return {}
  try {
    const data: unknown = JSON.parse(raw)
    if (!data || typeof data !== 'object') return {}
    const progress: PalierProgress = {}
    for (const level of PALIER_LEVELS) {
      const entry = (data as Record<string, unknown>)[String(level)]
      if (!entry || typeof entry !== 'object') continue
      const { stars, best, timeMs } = entry as {
        stars?: unknown
        best?: unknown
        timeMs?: unknown
      }
      const s = Math.round(Number(stars))
      const b = Math.round(Number(best))
      const t = Math.round(Number(timeMs))
      progress[level] = {
        stars: (Number.isFinite(s)
          ? Math.min(MAX_STARS, Math.max(0, s))
          : 0) as StarCount,
        best: Number.isFinite(b) ? Math.max(0, b) : 0,
        ...(isPlausibleTime(t) ? { timeMs: t } : {}),
      }
    }
    return progress
  } catch {
    return {}
  }
}

export function readPalierProgress(id: string): PalierProgress {
  if (typeof window === 'undefined') return {}
  try {
    return parseProgress(window.localStorage.getItem(palierStorageKey(id)))
  } catch {
    return {}
  }
}

export function writePalierProgress(id: string, progress: PalierProgress): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(palierStorageKey(id), JSON.stringify(progress))
  } catch {
    // stockage indisponible (navigation privée) : tant pis pour la progression
  }
}
