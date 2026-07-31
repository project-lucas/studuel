// Retour illustré de la mascotte après chaque question — logique PURE.
//
// Le format « feuille de la mascotte » (façon Duolingo) a d'abord été posé sur
// le seul dossier d'anglais 3e, le temps d'être jugé en vrai. Il est depuis
// SERVI À TOUTES LES MATIÈRES : le player n'a plus de feedback en ligne de
// repli, la feuille porte tout le retour après réponse. La porte d'éligibilité
// (`hasMascotteFeedback`) n'avait donc plus d'objet et a été retirée.

import { COMBO_FIRE, COMBO_HOT, COMBO_UNSTOPPABLE } from '@/lib/juice'

// Petit hachage stable : le même identifiant de question donne toujours la même
// phrase. Sans ça, la formule changerait à chaque rendu (React en fait
// plusieurs) et le texte clignoterait sous les yeux de l'élève.
function hash(seed: string): number {
  let h = 0
  for (let i = 0; i < seed.length; i += 1) {
    h = (h * 31 + seed.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

const BRAVOS = ['Bien vu !', 'Excellent !', 'Parfait !', 'Nickel !'] as const
const RATES = ['Pas cette fois…', 'Oups !', 'Presque !'] as const
// À partir de SOUTIEN_DES, l'élève ne rate plus par distraction : il coule. Le
// dessin continue sa blague, le texte non — on arrête de commenter l'échec et on
// le remet au travail.
const SOUTIENS = [
  'On reprend calmement.',
  'Regarde bien la correction.',
  'Respire, on y retourne.',
] as const

/** Nombre d'illustrations par sens (bonnes réponses / erreurs). */
export const REACTION_MAX = 5
/** Série de bonnes réponses ouvrant la dernière illustration : le sans-faute. */
export const REACTION_SANS_FAUTE = 10
/** Erreurs d'affilée à partir desquelles le texte cesse de commenter l'échec. */
export const SOUTIEN_DES = 4

/**
 * Rang d'illustration (1 à 5) pour une série en cours. `run` est le nombre de
 * réponses DU MÊME SENS enchaînées, jamais un cumul global.
 *
 * L'échelle est volontairement asymétrique :
 *
 * - en bonnes réponses elle s'ÉTIRE et réutilise les paliers de `lib/juice.ts`
 *   plutôt que d'ouvrir une seconde échelle parallèle. Le rang 5 est réservé au
 *   sans-faute : une image d'extase vue à chaque quiz ne récompenserait plus
 *   rien.
 * - en erreurs elle avance d'un cran par erreur, parce que le dessin raconte une
 *   perte de cheveux progressive : sauter un cran casserait le gag.
 */
export function reactionRank(good: boolean, run: number): number {
  const n = Math.max(1, Math.floor(run))
  if (!good) return Math.min(n, REACTION_MAX)
  if (n >= REACTION_SANS_FAUTE) return 5
  if (n >= COMBO_UNSTOPPABLE) return 4
  if (n >= COMBO_FIRE) return 3
  if (n >= COMBO_HOT) return 2
  return 1
}

/** Illustration de la mascotte à afficher pour cette série. */
export function reactionSrc(good: boolean, run: number): string {
  const sens = good ? 'bonne' : 'mauvaise'
  return `/images/mascotte/reaction-${sens}-${reactionRank(good, run)}.webp`
}

/**
 * Titre affiché par la mascotte. `run` suit la même convention que
 * `reactionRank` : la série en cours, dans le sens de la réponse qu'on vient de
 * donner.
 */
export function feedbackTitle(good: boolean, run: number, seed: string): string {
  if (good && run >= COMBO_FIRE) return `Imparable ×${run} !`
  const pool = good ? BRAVOS : run >= SOUTIEN_DES ? SOUTIENS : RATES
  return pool[hash(seed) % pool.length]
}
