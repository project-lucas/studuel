import type { QuizQuestion } from './types'

// Rejouer un quiz — logique pure.
//
// Le bouton « Recommencer » remettait TOUT à zéro : qui avait fait 8/10 devait
// refaire les 10 questions, dont les 8 qu'il maîtrisait déjà. Résultat, personne
// ne le pressait — le bouton était mort en pratique, et l'élève repartait sans
// avoir retravaillé ses 2 erreurs, qui sont pourtant le seul contenu utile de
// la session. Les flashcards ont la bonne mécanique depuis le début (la carte
// ratée revient) ; le quiz, non.

// Les questions ratées, dans l'ordre du quiz. `choices[i]` est la réponse
// donnée à `questions[i]` (une question sans réponse compte comme ratée : elle
// n'a pas été traitée).
export function missedQuestions(
  questions: QuizQuestion[],
  choices: number[],
): QuizQuestion[] {
  return questions.filter((q, i) => choices[i] !== q.correct_index)
}

// Faut-il proposer « Revoir mes erreurs » ?
//
// Non s'il n'y a aucune erreur (rien à revoir), et non si TOUT est raté : dans
// ce cas « revoir mes erreurs » serait exactement « recommencer », et deux
// boutons identiques côte à côte ne font qu'hésiter l'élève.
export function canRetryMissed(total: number, missed: number): boolean {
  return missed > 0 && missed < total
}
