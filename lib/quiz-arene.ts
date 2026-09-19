// LE QUIZ EN ARÈNE — la mise en scène des jeux de salon, servie au quiz de
// chapitre. PILOTE : un seul chapitre pour commencer (voir `QUIZ_PILOTES`).
//
// Pourquoi. Le quiz d'une matière « lambda » se jouait sur un écran où rien ne
// bougeait : une barre qui avance une fois par question, un chrono qui compte
// des heures de vie (« 28 h 01 »), aucun point en jeu. À côté, un jeu du Défi
// (Traduction flash…) ouvre par un rituel, tient un score qui saute et une
// jauge qui fond. Même geste (une question, des réponses, un verdict), deux
// tensions sans rapport.
//
// Ce module porte TOUTE la règle de l'arène — le composant ne calcule rien :
//
// - le rituel d'entrée (intro puis décompte 3·2·1) ;
// - la JAUGE ÉCLAIR : un chrono par question qui ne tue jamais. Tant qu'elle
//   n'est pas vide, la bonne réponse rapporte un bonus « éclair » ; vide, la
//   question rapporte ses points de base et rien d'autre. Le mouvement du jeu,
//   sans punir l'élève qui réfléchit — le quiz reste pédagogique (choix
//   révocable, « Valider », explication) ;
// - les POINTS de la manche : base × multiplicateur de série (+ éclair). Ce
//   sont les points d'UNE partie, pas l'XP du compte — l'XP réelle est décidée
//   par le serveur au bilan (et vaut zéro sur un rejeu). Deux nombres, deux
//   noms, pour ne jamais annoncer un gain que le portefeuille ne montrerait
//   pas ;
// - les ÉTOILES du bilan (1 à 3), sur les seuils des paliers de jeu, pour
//   donner une raison de rejouer le chapitre ;
// - l'OBJECTIF : le score qui vaut la couronne (seuil de maîtrise).
//
// Ce qu'on ne copie PAS des jeux : le chrono global, le verrou au premier tap
// et « Abandonner la partie ». Sur un quiz de chapitre, ils tueraient la
// lecture de l'explication.

import { comboMultiplier } from '@/lib/jeux/run'
import { STAR_ACCURACY, type StarCount } from '@/lib/jeux/paliers'
import { MASTERY_THRESHOLDS } from '@/lib/mastery'

/**
 * Les quiz servis en arène pendant le pilote : « Dénombrables, indénombrables,
 * pluriels irréguliers » (Anglais, chapitre « Les noms »), dans ses trois
 * classes (5e, 4e, 3e — migrations 311, 304, 298). Le même chapitre partout,
 * pour comparer les deux écrans côte à côte avant de généraliser.
 */
export const QUIZ_PILOTES: ReadonlySet<string> = new Set([
  '7075ca98-c413-5f00-a93e-4bd8c2d54d94', // 5e
  '4f0d3b81-8343-57c9-9ab0-c1b573ed1d60', // 4e
  'b9badb9d-38f6-5ba1-994d-1ef704071ab1', // 3e
])

/**
 * Ce quiz se joue-t-il en arène ? Le pilote, ou le forçage `?arene=1` sur
 * l'URL du quiz — pour comparer n'importe quel chapitre sans toucher au code.
 */
export function quizEnArene(
  quizId: string,
  forcage?: string | string[] | null,
): boolean {
  if (QUIZ_PILOTES.has(quizId)) return true
  const f = Array.isArray(forcage) ? forcage[0] : forcage
  return f === '1' || f === 'true'
}

// ----------------------------------------------------------------- la jauge

/** Durée de la jauge éclair, en secondes : le temps d'une bonne lecture. */
export const ECLAIR_SECONDES = 20
/** Les dernières secondes de la jauge, celles qui battent et qui sonnent. */
export const ECLAIR_URGENCE = 3

/**
 * La réponse est-elle « éclair » ? Oui tant que la jauge n'est pas vide au
 * moment où l'élève VALIDE — pas au moment où il touche une option : le choix
 * est un brouillon, c'est la validation qui compte.
 */
export function estEclair(msEcoules: number): boolean {
  return Number.isFinite(msEcoules) && msEcoules >= 0 && msEcoules < ECLAIR_SECONDES * 1000
}

/** Ce qu'il reste de jauge (0..1) après `msEcoules`. */
export function jaugeEclair(msEcoules: number): number {
  if (!Number.isFinite(msEcoules) || msEcoules <= 0) return 1
  return Math.max(0, 1 - msEcoules / (ECLAIR_SECONDES * 1000))
}

/**
 * L'urgence de la jauge (0 = calme, 1 = dernière seconde), ou null quand il
 * n'y a rien à faire battre. C'est elle qui décide de la pulsation et du bip.
 */
export function urgenceEclair(secondesRestantes: number): number | null {
  if (secondesRestantes <= 0 || secondesRestantes > ECLAIR_URGENCE) return null
  const entiere = Math.ceil(secondesRestantes)
  return 1 - (entiere - 1) / ECLAIR_URGENCE
}

// --------------------------------------------------------------- les points

/** Points d'une bonne réponse, avant multiplicateur. */
export const POINTS_BASE = 100
/** Le bonus éclair, en plus des points de base — jamais multiplié. */
export const BONUS_ECLAIR = 50

export type Verdict = {
  /** Points marqués sur cette question (0 sur une erreur). */
  points: number
  /** Le bonus éclair a-t-il été décroché ? Toujours faux sur une erreur. */
  eclair: boolean
  /** Le multiplicateur de série appliqué (×1 sans série). */
  multiplicateur: number
}

/**
 * Ce que rapporte une réponse. Le multiplicateur se lit sur la série AVANT la
 * réponse (comme dans les jeux) : la quatrième bonne réponse d'affilée se joue
 * déjà à ×2. L'éclair ne se multiplie pas — c'est une prime de vitesse, pas
 * une prime de série, et les deux ne doivent pas se confondre.
 */
export function pointsReponse({
  bonne,
  serieAvant,
  eclair,
}: {
  bonne: boolean
  serieAvant: number
  eclair: boolean
}): Verdict {
  const multiplicateur = comboMultiplier(Math.max(0, serieAvant))
  if (!bonne) return { points: 0, eclair: false, multiplicateur }
  return {
    points: POINTS_BASE * multiplicateur + (eclair ? BONUS_ECLAIR : 0),
    eclair,
    multiplicateur,
  }
}

// ---------------------------------------------------------------- le bilan

/** Le score qui vaut la couronne : le seuil de maîtrise, arrondi au-dessus. */
export function objectifCouronne(total: number): number {
  if (!Number.isFinite(total) || total <= 0) return 0
  return Math.ceil(total * MASTERY_THRESHOLDS.mastered)
}

/**
 * Les étoiles d'un quiz, sur les seuils des paliers de jeu (60 / 80 / 95 %).
 * Pas de plancher à une étoile comme dans une partie gagnée : un quiz se
 * termine toujours, aller au bout n'y est pas un exploit — seule l'exactitude
 * compte, et un 5/10 n'a rien décroché.
 */
export function etoilesQuiz(score: number, total: number): StarCount {
  if (!Number.isFinite(total) || total <= 0) return 0
  const ratio = score / total
  if (ratio >= STAR_ACCURACY.three) return 3
  if (ratio >= STAR_ACCURACY.two) return 2
  if (ratio >= STAR_ACCURACY.one) return 1
  return 0
}

export type Manche = { score: number; total: number }

/**
 * Le meilleur passage sur ce quiz, au RATIO (un 4/5 bat un 7/10). Nul sans
 * passage — l'intro dit alors « première fois ici » plutôt que « record 0 ».
 */
export function meilleureManche(manches: readonly Manche[]): Manche | null {
  let meilleure: Manche | null = null
  for (const m of manches) {
    if (!Number.isFinite(m.total) || m.total <= 0) continue
    if (!meilleure || m.score / m.total > meilleure.score / meilleure.total) {
      meilleure = m
    }
  }
  return meilleure
}

// -------------------------------------------------------------- l'affichage

/**
 * Le titre du bandeau : celui du quiz, sans son préfixe « Quiz — » — dans un
 * bandeau qui dit déjà « on joue », le mot n'apporte rien et mange la place.
 */
export function titreArene(titre: string): string {
  return titre.replace(/^\s*quiz\s*[—–:-]\s*/i, '').trim() || titre.trim()
}

/**
 * La consigne, réduite au GESTE — comme « TRADUIS » au-dessus d'une question
 * de Traduction flash. Décidée à la forme de l'énoncé, jamais à la matière.
 */
export function consigneArene({
  kind,
  question,
  trou,
}: {
  kind?: string | null
  question: string
  trou: boolean
}): string {
  if (trou) return 'Complète'
  if (kind === 'true_false') return 'Vrai ou faux ?'
  if (/^\s*tradui/i.test(question)) return 'Traduis'
  return 'Choisis'
}
