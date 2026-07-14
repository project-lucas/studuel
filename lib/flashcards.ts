// Flashcards — logique pure, testable. Voir [[espace-parent-hub-supports]].
// Les cartes sont DÉRIVÉES des questions du quiz de la leçon (recto = question,
// verso = bonne réponse, indice = explication). Aucune table ni saisie de
// contenu dédiée : toute leçon ayant un quiz a immédiatement ses flashcards.

import type { QuizQuestion } from './types'

export type Flashcard = {
  id: string
  front: string // la question (recto)
  back: string // la bonne réponse (verso)
  hint: string | null // l'explication du quiz, en complément au verso
}

// Auto-évaluation de l'élève sur une carte : « je le savais » ou « à revoir ».
export type CardVerdict = 'known' | 'review'

// Construit le paquet à partir des questions, dans l'ordre du quiz. Écarte
// toute carte sans énoncé ou sans réponse (donnée incomplète).
export function flashcardsFromQuestions(
  questions: QuizQuestion[],
): Flashcard[] {
  return questions
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((q) => ({
      id: q.id,
      front: q.question.trim(),
      back: (q.options[q.correct_index] ?? '').trim(),
      hint: q.explanation?.trim() || null,
    }))
    .filter((card) => card.front.length > 0 && card.back.length > 0)
}

// Nombre de cartes marquées « à revoir » (pour le bilan de fin de paquet).
export function countReview(verdicts: Record<string, CardVerdict>): number {
  return Object.values(verdicts).filter((v) => v === 'review').length
}

// Les cartes à rejouer : celles explicitement marquées « à revoir », dans
// l'ordre du paquet d'origine.
export function reviewDeck(
  cards: Flashcard[],
  verdicts: Record<string, CardVerdict>,
): Flashcard[] {
  return cards.filter((card) => verdicts[card.id] === 'review')
}
