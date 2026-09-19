// -----------------------------------------------------------------------------
// LES ÉPREUVES CLASSÉES — le catalogue du Palmarès, pur et testé.
//
// Une épreuve est un mode de l'Arène qui rend UN NOMBRE en fin de partie, et
// ce nombre se classe : contre soi (la dernière fois, le record) et contre les
// autres (l'échelle de la semaine, qui repart chaque lundi). Cinq épreuves :
// Blitz, Contre-la-montre, Survie, Boss, Duel fantôme.
//
// Ce fichier est le MIROIR de `mode_catalog` (migration 352) : mêmes ids,
// mêmes bornes. Un test relit le SQL et bloque toute dérive — la même règle
// que celle qui lie lib/trophy-road.ts à apply_game_trophies (238).
//
// Les deux épreuves qui n'avaient pas de score (Boss = gagné/perdu, Duel =
// manches) en reçoivent un ici, calculé par des fonctions pures : la formule
// vit à UN endroit, l'écran et l'action serveur l'appellent tous les deux.
// -----------------------------------------------------------------------------

import { SALONS, type SalonGameId } from '@/lib/jeux/catalog'

/** Les cinq modes de l'Arène. */
export type ArenaEpreuveId = 'blitz' | 'chrono' | 'survie' | 'boss' | 'duel'

/**
 * Tout ce qui se classe : les cinq modes de l'Arène ET les jeux de salon par
 * matière (calcul mental, orthographe…). Un jeu de salon rend lui aussi UN
 * NOMBRE en fin de partie (`run.score`, lib/jeux/run — 100 pts la bonne
 * réponse, multiplicateur de série, primes), et ce nombre se classe de la même
 * façon : contre soi, et contre sa classe, semaine après semaine (migration
 * 355, qui inscrit chaque jeu à `mode_catalog`).
 */
export type EpreuveId = ArenaEpreuveId | SalonGameId

export type Epreuve = {
  id: EpreuveId
  /** Le nom court, tel qu'il se dit dans une phrase. */
  nom: string
  /** L'unité du score : « pts », « bonnes réponses », « d'affilée ». */
  unite: { un: string; plusieurs: string }
  /** Ce que le score MESURE, en une ligne pour l'écran de fin. */
  mesure: string
  /** Emoji du billet (même vocabulaire que la feuille des modes). */
  emoji: string
  /** Borne haute d'un score plausible — miroir de mode_catalog.max_score. */
  maxScore: number
  /** Millisecondes minimales par point — miroir de mode_catalog.min_ms_per_point. */
  minMsParPoint: number
}

/** Une épreuve de l'Arène (les cinq modes). */
export type EpreuveArena = Epreuve & { id: ArenaEpreuveId }

export const EPREUVES: readonly EpreuveArena[] = [
  {
    id: 'blitz',
    nom: 'Blitz 60s',
    unite: { un: 'pt', plusieurs: 'pts' },
    mesure: 'points en 60 secondes, combos compris',
    emoji: '⏱️',
    maxScore: 30000,
    minMsParPoint: 2,
  },
  {
    id: 'chrono',
    nom: 'Contre-la-montre',
    unite: { un: 'bonne réponse', plusieurs: 'bonnes réponses' },
    mesure: 'bonnes réponses avant que le temps te lâche',
    emoji: '⏳',
    maxScore: 300,
    minMsParPoint: 700,
  },
  {
    id: 'survie',
    nom: 'Survie',
    unite: { un: 'd’affilée', plusieurs: 'd’affilée' },
    mesure: 'bonnes réponses d’affilée avant la chute',
    emoji: '💀',
    maxScore: 500,
    minMsParPoint: 700,
  },
  {
    id: 'boss',
    nom: 'Boss',
    unite: { un: 'pt de combat', plusieurs: 'pts de combat' },
    mesure: 'coups portés, prime de victoire et cœurs restants',
    emoji: '👑',
    maxScore: 5000,
    minMsParPoint: 5,
  },
  {
    id: 'duel',
    nom: 'Duel fantôme',
    unite: { un: 'pt', plusieurs: 'pts' },
    mesure: 'bonnes réponses sur les manches, prime de victoire',
    emoji: '👻',
    maxScore: 5000,
    minMsParPoint: 5,
  },
] as const

/** Les cinq ids de l'Arène, dans l'ordre du catalogue. */
export const EPREUVE_IDS: readonly ArenaEpreuveId[] = EPREUVES.map((e) => e.id)

// ------------------------------------------------- les jeux de salon

/** Une épreuve de salon : une épreuve, plus la matière qui la range. */
export type EpreuveJeu = Epreuve & {
  id: SalonGameId
  matiere: string
  matiereEmoji: string
}

/**
 * Bornes communes à tous les jeux de salon — miroir de la migration 355. Le
 * barème est le même pour tous (lib/jeux/run : 100 pts × multiplicateur ≤ 4
 * par bonne réponse, primes de vague, de vitesse et de sans-faute) ; un
 * sprint de 60 s plafonne vers 25 000. Une milliseconde par point : un jeu à
 * 25 questions bouclé en 20 s vaut 10 000 pts au plus, donc reste plausible —
 * c'est la vitesse d'un très bon élève sur du calcul mental facile, pas une
 * triche. L'ÉPREUVE ULTIME n'entre pas ici : sans plafond, elle a sa propre
 * cote et son propre classement (migration 314).
 */
export const JEU_MAX_SCORE = 30000
export const JEU_MIN_MS_PAR_POINT = 1

/**
 * Les jeux de salon jouables, dans l'ordre des salons (matière par matière).
 * Dérivé du catalogue des salons : un jeu qui y passe `implemented` entre ici
 * de lui-même — et le test du miroir réclame alors sa ligne dans la 355.
 */
export const EPREUVES_JEUX: readonly EpreuveJeu[] = SALONS.flatMap((salon) =>
  salon.games
    .filter((g) => g.implemented)
    .map((g) => ({
      id: g.id as SalonGameId,
      nom: g.name,
      unite: { un: 'pt', plusieurs: 'pts' },
      mesure: 'points de la partie, série et primes comprises',
      emoji: g.emoji,
      maxScore: JEU_MAX_SCORE,
      minMsParPoint: JEU_MIN_MS_PAR_POINT,
      matiere: salon.subject,
      matiereEmoji: salon.emoji,
    })),
)

export const JEU_IDS: readonly SalonGameId[] = EPREUVES_JEUX.map((e) => e.id)

export function isJeuId(value: unknown): value is SalonGameId {
  return typeof value === 'string' && (JEU_IDS as readonly string[]).includes(value)
}

export function isArenaEpreuveId(value: unknown): value is ArenaEpreuveId {
  return typeof value === 'string' && (EPREUVE_IDS as readonly string[]).includes(value)
}

export function isEpreuveId(value: unknown): value is EpreuveId {
  return isArenaEpreuveId(value) || isJeuId(value)
}

export function epreuve(id: EpreuveId): Epreuve {
  const found = EPREUVES.find((e) => e.id === id) ?? EPREUVES_JEUX.find((e) => e.id === id)
  if (!found) throw new Error(`Épreuve inconnue : ${id}`)
  return found
}

/**
 * L'écran où se joue l'épreuve : la salle de jeu, mode ouvert, pour l'Arène ;
 * la carte du jeu (ses paliers) pour un jeu de salon.
 */
export function epreuveHref(id: EpreuveId): string {
  return isJeuId(id) ? `/defi/jeux/${id}` : `/defi/jouer?mode=${id}`
}

/** « 1 250 pts », « 12 bonnes réponses », « 7 d'affilée ». */
export function formatScore(id: EpreuveId, score: number): string {
  const e = epreuve(id)
  const n = Math.max(0, Math.round(score))
  const nombre = String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return `${nombre} ${n === 1 ? e.unite.un : e.unite.plusieurs}`
}

// ------------------------------------------------- les scores fabriqués

/** Points par coup porté au boss (une bonne réponse). */
export const BOSS_POINTS_PAR_COUP = 100
/** Prime de victoire : le boss à terre vaut plus que tous les coups réunis. */
export const BOSS_PRIME_VICTOIRE = 500
/** Chaque cœur qui reste à la fin d'une victoire : le combat propre paie. */
export const BOSS_POINTS_PAR_COEUR = 150

/**
 * Le score d'un combat de boss. Une défaite garde ses coups (on a quand même
 * frappé), une victoire ajoute la prime et les cœurs restants — de sorte que
 * gagner sans se faire toucher est le seul moyen de faire le plein.
 */
export function bossScore(input: {
  correct: number
  won: boolean
  livesLeft: number
}): number {
  const coups = Math.max(0, Math.round(input.correct)) * BOSS_POINTS_PAR_COUP
  if (!input.won) return coups
  return (
    coups +
    BOSS_PRIME_VICTOIRE +
    Math.max(0, Math.round(input.livesLeft)) * BOSS_POINTS_PAR_COEUR
  )
}

/** Points par bonne réponse au duel fantôme. */
export const DUEL_POINTS_PAR_REPONSE = 100
/** Prime de victoire du duel. */
export const DUEL_PRIME_VICTOIRE = 500
/** Prime d'une victoire SÈCHE (2-0) : on n'a pas laissé une manche. */
export const DUEL_PRIME_SECHE = 200

/**
 * Le score d'un duel fantôme : les bonnes réponses de toutes les manches,
 * plus la prime si on gagne, plus un peu si on gagne 2-0. Un duel perdu 1-2
 * après 12 bonnes réponses vaut plus qu'un duel gagné 2-1 avec 6 : le
 * classement récompense le jeu, pas le tirage du fantôme.
 */
export function duelFantomeScore(input: {
  correct: number
  won: boolean
  roundsLost: number
}): number {
  const base = Math.max(0, Math.round(input.correct)) * DUEL_POINTS_PAR_REPONSE
  if (!input.won) return base
  return base + DUEL_PRIME_VICTOIRE + (input.roundsLost === 0 ? DUEL_PRIME_SECHE : 0)
}

/**
 * Un score plausible pour cette épreuve, avec la durée jouée ? Même règle que
 * la RPC : on ne l'envoie pas s'il serait refusé — un aller-retour pour rien.
 */
export function scorePlausible(id: EpreuveId, score: number, ms: number): boolean {
  const e = epreuve(id)
  if (!Number.isFinite(score) || !Number.isFinite(ms)) return false
  if (score < 0 || score > e.maxScore) return false
  if (ms <= 0 || ms > 3_600_000) return false
  return ms >= score * e.minMsParPoint
}
