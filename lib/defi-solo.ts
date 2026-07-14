// Défi solo par niveaux (Phase 1) — logique pure, testable.
// Un défi = les questions du quiz de la leçon jouées comme des NIVEAUX
// successifs, avec des vies (cœurs) et un score. Ici, uniquement le barème :
// points par niveau, score max, étoiles finales. Voir [[espace-parent-hub-supports]].

export const MAX_LIVES = 3
export const LEVEL_BASE_POINTS = 60
export const WRONG_PENALTY = 20 // par mauvaise tentative sur le niveau
export const HINT_PENALTY = 15 // si un indice a été utilisé
export const MIN_LEVEL_POINTS = 10 // plancher quand le niveau finit par être réussi

// Points gagnés sur un niveau réussi, selon le nombre de tentatives ratées et
// l'usage de l'indice. Réussir du premier coup, sans indice = plein tarif.
export function levelPoints(wrongAttempts: number, hintUsed: boolean): number {
  const raw =
    LEVEL_BASE_POINTS -
    Math.max(0, wrongAttempts) * WRONG_PENALTY -
    (hintUsed ? HINT_PENALTY : 0)
  return Math.max(MIN_LEVEL_POINTS, raw)
}

// Score maximal atteignable sur un défi de `levelCount` niveaux (plein tarif
// partout) — sert de dénominateur pour les étoiles et l'affichage « x / max ».
export function maxScore(levelCount: number): number {
  return Math.max(0, levelCount) * LEVEL_BASE_POINTS
}

// Étoiles débloquées (0..5) selon le ratio score / score max.
export function starsForScore(score: number, max: number): number {
  if (max <= 0) return 0
  const ratio = score / max
  if (ratio >= 0.9) return 5
  if (ratio >= 0.75) return 4
  if (ratio >= 0.55) return 3
  if (ratio >= 0.35) return 2
  if (ratio > 0) return 1
  return 0
}
