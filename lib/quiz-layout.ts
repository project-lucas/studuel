// LA DISPOSITION DES RÉPONSES D'UNE QUESTION DE QUIZ.
//
// `AnswerBoard` sait poser ses réponses de trois façons — grille 2×2, liste
// pleine largeur, duo de grandes plaques — et documente pourquoi : ce sont
// trois façons de LIRE. Les jeux de salon choisissent la leur dans leur format
// (`lib/jeux/formats`), une fois pour toutes, parce qu'un jeu sert toujours la
// même forme de question.
//
// Le quiz de leçon, lui, servait `liste` pour TOUT. Un « Vrai / Faux » y
// prenait deux lignes de pleine largeur à moitié vides, et quatre dates
// (« 1789 », « 1815 »…) s'empilaient sur quatre lignes là où le regard les
// aurait prises d'un coup en 2×2. Même écran pour deux lectures qui n'ont rien
// à voir, sur les 300 chapitres du catalogue.
//
// D'où cette règle, tirée de la FORME des options et non de la matière : le
// moteur ne connaît que la longueur du texte et le nombre de choix. Aucune
// exception par matière ici — c'est la doctrine de `lib/questions/engine`, et
// elle vaut aussi pour la mise en page.

import type { GameLayout } from '@/lib/jeux/formats'

/**
 * La longueur au-delà de laquelle une réponse ne tient plus en demi-largeur.
 *
 * Mesurée sur le pire cas réel : un téléphone de 360 px, deux colonnes, la
 * police du corps. Au-delà, l'option passe sur trois lignes et la grille perd
 * exactement ce qui la justifiait — un balayage d'un seul coup d'œil. En
 * dessous, la case reste lisible d'un regard.
 */
export const GRILLE_MAX_CARACTERES = 22

/** Ce que la disposition a besoin de savoir d'une question. */
export type QuestionForme = {
  kind?: string | null
  options: string[]
}

/**
 * La disposition qui convient à cette question.
 *
 * - deux options (dont tous les « vrai / faux ») → `duo` : on tranche, on ne
 *   compare pas ;
 * - quatre options courtes → `grille` : le regard les prend ensemble ;
 * - tout le reste → `liste`, le repli sûr. Trois options en grille laisseraient
 *   un trou dans le damier, et une phrase en demi-largeur se lit mal.
 */
export function layoutForQuestion(question: QuestionForme): GameLayout {
  const options = question.options ?? []
  if (options.length === 2) return 'duo'
  if (options.length === 4 && options.every(estCourte)) return 'grille'
  return 'liste'
}

function estCourte(option: string): boolean {
  return (option ?? '').trim().length <= GRILLE_MAX_CARACTERES
}
