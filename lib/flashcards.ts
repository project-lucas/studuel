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

// Avancement d'un paquet joué « en boucle » (FlashcardPlayer) : une carte ratée
// repart en fin de pile, elle n'est retirée de la file que lorsqu'elle est sue.
//
// D'où le défaut que ceci corrige : la barre ne mesurait que les cartes SUES,
// donc un élève qui bloque sur 3 cartes voyait une barre parfaitement IMMOBILE
// tour après tour, sans savoir combien il lui restait — la meilleure façon de
// faire abandonner en plein deck. On expose en plus l'avancement des PREMIERS
// passages (qui, lui, progresse à chaque réponse) et le nombre de cartes à
// repasser, pour l'afficher noir sur blanc.
export type DeckProgress = {
  known: number // cartes définitivement sues
  toRedo: number // cartes déjà vues, ratées, en attente d'un nouveau passage
  knownRatio: number // 0..1 — remplissage plein de la barre
  seenRatio: number // 0..1 — avancement des premiers passages (>= knownRatio)
}

export function deckProgress(
  total: number,
  queueIds: string[],
  seenIds: ReadonlySet<string>,
): DeckProgress {
  if (total <= 0) return { known: 0, toRedo: 0, knownRatio: 0, seenRatio: 0 }

  const known = Math.max(0, total - queueIds.length)
  const toRedo = queueIds.filter((id) => seenIds.has(id)).length
  // Premiers passages effectués = cartes vues au moins une fois, bornées au
  // total (une carte revue plusieurs fois ne compte qu'une seule fois).
  const seen = Math.min(seenIds.size, total)

  return {
    known,
    toRedo,
    knownRatio: known / total,
    seenRatio: seen / total,
  }
}

// Les cartes à rejouer : celles explicitement marquées « à revoir », dans
// l'ordre du paquet d'origine.
export function reviewDeck(
  cards: Flashcard[],
  verdicts: Record<string, CardVerdict>,
): Flashcard[] {
  return cards.filter((card) => verdicts[card.id] === 'review')
}
