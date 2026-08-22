// -----------------------------------------------------------------------------
// L'ÉPREUVE ULTIME — le barreau qui n'a pas de plafond, et la COTE qui en sort.
//
// POURQUOI ELLE EXISTE. Les cinq paliers ont une fin : trois étoiles au palier
// Maître, et il n'y a plus rien à gravir. Rien n'y sépare donc les meilleurs, et
// un élève de 6e n'a aucun moyen de prouver qu'il calcule mieux qu'un lycéen.
// L'Ultime est la réponse : une seule vie, aucune fin, la difficulté qui monte
// tant qu'on ne se trompe pas. Le score n'est pas un nombre de points, c'est un
// NIVEAU ATTEINT.
//
// LA RÈGLE QUI FAIT TOUT : l'épreuve est IDENTIQUE POUR TOUT LE MONDE. Aucun
// plancher de classe ne l'ouvre, aucun réglage ne s'adapte à l'âge. C'est la
// condition pour que les résultats se comparent — une épreuve qui s'adapte à la
// classe ne prouve plus rien, et l'objectif entier tombe.
//
// LA RAMPE DE CHAUFFE. Tout le monde démarre au niveau 1, mais un niveau ne
// coûte que trois bonnes réponses et la banque durcit d'un cran à chaque niveau.
// Un fort atteint donc son vrai niveau en une trentaine de secondes : la
// comparabilité est préservée sans ennuyer personne.
//
// CE QUI S'Y DÉBLOQUE : rien ne s'y collectionne (pas d'étoiles). Ce qu'on y
// gagne, c'est une COTE — un nombre absolu, comparable entre tous les joueurs
// quel que soit leur âge, et qui ne redescend jamais.
// -----------------------------------------------------------------------------
import {
  MAX_STARS,
  PALIERS,
  starsAt,
  type PalierProgress,
} from '@/lib/jeux/paliers'
import type { GameFormat, UltimeParams } from '@/lib/jeux/formats'

/**
 * Le réglage de l'épreuve. Un seul jeu de valeurs pour tout le monde : c'est
 * la définition même d'une épreuve comparable.
 */
export const ULTIME: UltimeParams = {
  perLevel: 3,
  startSeconds: 12,
  decaySeconds: 0.6,
  minSeconds: 3,
}

/**
 * Niveaux préparés d'avance dans la banque servie au navigateur. Au-delà, on
 * continue de servir le dernier paquet : le chrono, lui, continue de fondre, si
 * bien que l'épreuve reste une épreuve. Trente niveaux, c'est déjà bien
 * au-dessus de ce que quiconque atteint — et 90 questions dans la page.
 */
export const ULTIME_PREPARED_LEVELS = 30

/**
 * Borne haute acceptée côté serveur. Elle n'existe pas pour brider un joueur
 * (personne n'ira là) mais pour qu'un score fabriqué à la main ne puisse pas
 * s'installer en tête du classement mondial.
 */
export const ULTIME_MAX_LEVEL = 60

/**
 * Le cran de difficulté de la BANQUE au niveau `level` (0-based).
 *
 * Un niveau = un cran, sans palier intermédiaire : c'est la rampe de chauffe.
 * Les cinq premiers crans sont ceux des paliers (`lib/jeux/paliers`) ; au-delà,
 * les générateurs continuent de durcir tout seuls — c'est pour ça que l'épreuve
 * n'est offerte qu'aux jeux dont la banque se génère (`ULTIME_GAMES`).
 */
export function bankTierFor(level: number): number {
  return Math.max(1, Math.floor(level) + 1)
}

/** Le niveau affiché à l'élève : on compte à partir de 1, pas de 0. */
export function displayLevel(step: number): number {
  return Math.max(0, Math.floor(step))
}

// ------------------------------------------------------------- le déblocage

/**
 * L'épreuve s'ouvre en décrochant les TROIS étoiles du dernier palier — donc
 * par le jeu, jamais par la classe. C'est volontaire : si l'âge ouvrait cette
 * porte, un lycéen y entrerait sans l'avoir méritée pendant qu'un 6e très fort
 * resterait dehors, et c'est exactement l'inverse de ce qu'elle sert.
 */
export function isUltimeUnlocked(progress: PalierProgress): boolean {
  const last = PALIERS[PALIERS.length - 1].level
  return starsAt(progress, last) >= MAX_STARS
}

/** Étoiles encore manquantes au dernier palier pour ouvrir l'épreuve. */
export function starsMissingForUltime(progress: PalierProgress): number {
  const last = PALIERS[PALIERS.length - 1].level
  return Math.max(0, MAX_STARS - starsAt(progress, last))
}

// ------------------------------------------------------------------ la cote

/**
 * Runs retenues pour la cote. Trois et pas une : une partie de chance ne fait
 * pas un niveau, et une seule mauvaise partie ne doit pas défaire un mois de
 * progrès.
 */
export const COTE_RUNS = 3

/** Cote de départ, celle qu'on a avant d'avoir rien prouvé. */
export const COTE_BASE = 100
/** Ce que vaut un niveau atteint. */
export const COTE_PER_LEVEL = 60

/**
 * La COTE : un nombre absolu, comparable entre un CM2 et un Terminale, calculé
 * sur la moyenne des `COTE_RUNS` meilleures parties.
 *
 * Elle ne redescend jamais : les runs ne s'effacent pas, et une nouvelle partie
 * ne peut qu'entrer dans le trio de tête ou n'y rien changer. Un mauvais jour ne
 * coûte donc rien — même doctrine que les étoiles, et l'inverse des trophées.
 */
export function coteFor(levels: readonly number[]): number {
  const best = [...levels]
    .filter((n) => Number.isFinite(n) && n >= 0)
    .sort((a, b) => b - a)
    .slice(0, COTE_RUNS)
  if (best.length === 0) return 0
  const moyenne = best.reduce((sum, n) => sum + n, 0) / best.length
  return Math.round(COTE_BASE + COTE_PER_LEVEL * moyenne)
}

export type CoteTitle = {
  /** Cote à partir de laquelle le titre est acquis. */
  from: number
  name: string
}

/**
 * Les titres, volontairement génériques : ils qualifient le JOUEUR, pas la
 * matière, et le même mot doit pouvoir se poser sur l'orthographe comme sur le
 * calcul. C'est ce qui permet de lire « Prodige » sans savoir à quoi il joue.
 */
export const COTE_TITLES: readonly CoteTitle[] = [
  { from: 0, name: 'Apprenti' },
  { from: 300, name: 'Aguerri' },
  { from: 700, name: 'Virtuose' },
  { from: 1100, name: 'Prodige' },
  { from: 1600, name: 'Légende' },
] as const

export function coteTitle(cote: number): string {
  let title = COTE_TITLES[0].name
  for (const t of COTE_TITLES) if (cote >= t.from) title = t.name
  return title
}

/** La cote à atteindre pour le titre suivant, ou null au sommet. */
export function nextCoteTitle(cote: number): CoteTitle | null {
  return COTE_TITLES.find((t) => cote < t.from) ?? null
}

// ------------------------------------------------------- le format de l'épreuve

/**
 * Le format d'un jeu, converti en ÉPREUVE ULTIME. Même robe, même timbre, même
 * vocabulaire — c'est le même jeu — mais une mécanique et une règle à part.
 *
 * Construit ici plutôt que déclaré dans `GAME_FORMATS` parce que l'Ultime est
 * le MÊME pour tous les jeux : le dupliquer dix-sept fois inviterait à le régler
 * dix-sept fois, et l'épreuve cesserait d'être comparable.
 */
export function ultimeFormat(format: GameFormat): GameFormat {
  return {
    ...format,
    params: { mechanic: 'ultime', ultime: ULTIME },
    rule: `Une seule vie. Un niveau tous les ${ULTIME.perLevel} succès, et ça durcit à chaque fois. La première erreur arrête tout — jusqu'où montes-tu ?`,
    lexicon: {
      ...format.lexicon,
      step: 'niveau',
      steps: 'niveaux',
      win: 'Épreuve ultime',
      lose: 'Chute au niveau',
    },
  }
}

// -------------------------------------------------------- les jeux concernés

/**
 * Les jeux dont la banque MONTE SANS FIN, seuls à pouvoir porter l'épreuve.
 *
 * Un jeu à banque finie (les capitales, les faux amis) ne peut durcir que par
 * le chrono : son classement mesurerait alors la vitesse de lecture, pas la
 * maîtrise. Lui donner une épreuve ultime serait afficher un classement qui ment
 * sur ce qu'il mesure — on attend d'avoir rendu sa banque générative.
 */
export const ULTIME_GAMES: readonly string[] = ['calcul-mental']

export function hasUltime(gameId: string): boolean {
  return ULTIME_GAMES.includes(gameId)
}
