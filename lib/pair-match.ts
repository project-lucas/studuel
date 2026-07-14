// Association de paires (Défi Phase 2) — logique pure, testable.
// Une manche « Associe les paires » est DÉRIVÉE des questions du quiz : chaque
// paire = (énoncé ↔ bonne réponse). Comme les flashcards et le défi QCM, aucun
// contenu dédié n'est requis. Voir [[espace-parent-hub-supports]].

import { seededRng } from './defi-modes'
import type { QuizQuestion } from './types'

export type Pair = {
  id: string
  left: string // l'énoncé
  right: string // la bonne réponse
}

// Taille jouable d'une grille d'association (au-delà, ça devient illisible).
export const MAX_PAIRS = 5

// Construit les paires depuis des questions, dans l'ordre du quiz. Écarte les
// vrai/faux (« Vrai »/« Faux » à droite seraient ambigus), les questions
// incomplètes, et les réponses en DOUBLON à droite (deux fois la même réponse
// rendrait l'association indécidable). Limite à `max` paires.
export function pairsFromQuestions(
  questions: QuizQuestion[],
  max = MAX_PAIRS,
): Pair[] {
  const seenRight = new Set<string>()
  const pairs: Pair[] = []
  for (const q of questions.slice().sort((a, b) => a.position - b.position)) {
    if (q.kind === 'true_false') continue
    const left = q.question.trim()
    const right = (q.options[q.correct_index] ?? '').trim()
    if (!left || !right) continue
    const key = right.toLowerCase()
    if (seenRight.has(key)) continue
    seenRight.add(key)
    pairs.push({ id: q.id, left, right })
    if (pairs.length >= max) break
  }
  return pairs
}

// Ordre d'affichage de la colonne de DROITE : permutation déterministe des
// index [0..n-1], semée par `seed` (SSR-safe, pas de re-mélange au rendu).
// La colonne de gauche reste dans l'ordre ; seule la droite est mélangée.
export function rightColumnOrder(pairs: Pair[], seed: string): number[] {
  const n = pairs.length
  const order = Array.from({ length: n }, (_, i) => i)
  if (n < 2) return order
  const rng = seededRng(seed)
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    const tmp = order[i]
    order[i] = order[j]
    order[j] = tmp
  }
  return order
}
