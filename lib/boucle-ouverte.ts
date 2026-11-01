// -----------------------------------------------------------------------------
// LES BOUCLES OUVERTES — « plus que N » (effet Zeigarnik, 28/10/2026).
//
// Une tâche entamée tire vers sa fin d'autant plus fort qu'on voit ce qui
// reste. « 6/10 » est un état ; « plus que 4 » est une invitation. Ce module
// dit le RESTE, à une condition : la boucle doit être vraiment entamée — à
// moitié au moins. En dessous, « plus que 9 fiches » n'appelle personne, et un
// compteur à zéro n'est pas une boucle ouverte, c'est une liste de tâches.
//
// Les nombres affichés restent exacts (règle des jauges d'encouragement) : on
// change la phrase, jamais le compte.
//
// Pur et testé.
// -----------------------------------------------------------------------------

import type { BrouillonQuiz } from '@/lib/quiz-brouillon'
import type { LectureEntamee } from '@/lib/lecture-entamee'

/** La part à partir de laquelle une boucle se dit par ce qui reste. */
export const SEUIL_BOUCLE = 0.5

export type Unite = { un: string; plusieurs: string }

export const UNITES = {
  question: { un: 'question', plusieurs: 'questions' },
  fiche: { un: 'fiche', plusieurs: 'fiches' },
  reponse: { un: 'réponse', plusieurs: 'réponses' },
  partie: { un: 'partie', plusieurs: 'parties' },
  cours: { un: 'cours', plusieurs: 'cours' },
} as const satisfies Record<string, Unite>

/**
 * Ce qui reste à faire, quand la boucle est entamée à moitié au moins et pas
 * finie ; `null` sinon (rien commencé, moins de la moitié, déjà bouclée, ou
 * des nombres absurdes).
 */
export function resteAFaire(fait: number, total: number): number | null {
  if (!Number.isFinite(fait) || !Number.isFinite(total)) return null
  const f = Math.floor(fait)
  const t = Math.floor(total)
  if (t <= 0 || f <= 0 || f >= t) return null
  if (f / t < SEUIL_BOUCLE) return null
  return t - f
}

/** « Plus que 4 questions », ou `null` quand la boucle n'appelle pas encore. */
export function plusQue(fait: number, total: number, unite: Unite): string | null {
  const reste = resteAFaire(fait, total)
  if (reste === null) return null
  return `Plus que ${reste} ${reste > 1 ? unite.plusieurs : unite.un}`
}

/** La même chose sans majuscule, pour une fin de phrase (« 3/5 fiches · plus que 2 »). */
export function plusQueCourt(fait: number, total: number): string | null {
  const reste = resteAFaire(fait, total)
  return reste === null ? null : `plus que ${reste}`
}

// --------------------------------------------- LA boucle à rappeler sur Réviser

export type BoucleARappeler =
  | { genre: 'quiz'; brouillon: BrouillonQuiz }
  | { genre: 'lecture'; lecture: LectureEntamee }

/**
 * UNE carte, jamais deux : la boucle la plus récente entre la manche de quiz
 * et le cours entamé. Deux rappels côte à côte, c'est déjà une liste de
 * choses en retard — l'effet s'inverse en anxiété.
 */
export function boucleARappeler(
  brouillon: BrouillonQuiz | null,
  lecture: LectureEntamee | null,
): BoucleARappeler | null {
  if (brouillon && lecture) {
    return (Date.parse(lecture.at) || 0) > (Date.parse(brouillon.at) || 0)
      ? { genre: 'lecture', lecture }
      : { genre: 'quiz', brouillon }
  }
  if (brouillon) return { genre: 'quiz', brouillon }
  if (lecture) return { genre: 'lecture', lecture }
  return null
}
