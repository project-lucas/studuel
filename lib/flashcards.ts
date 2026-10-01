// Avancement d'un paquet de cartes joué « en boucle » — logique pure, testée.
//
// Ce module a porté les flashcards DE CHAPITRE, dérivées des questions du quiz
// (recto = l'énoncé, verso = la bonne réponse). Elles ont été retirées le
// 01/10/2026 : c'était le quiz sans ses propositions. Il ne reste ici que ce
// que le lecteur de paquets du Studio (FlashcardPlayer) utilise encore.

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
