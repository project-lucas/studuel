// -----------------------------------------------------------------------------
// LE BARÈME D'UNE RÉPONSE EN DUEL — base, vitesse, série. Il est né avec le
// « Duel 90 s », retiré le 19/09/2026 (la course classée l'avait remplacé, et
// plus rien ne menait à sa page) ; la course classée (lib/duel/course.ts,
// components/duel/*) compte toujours ses points avec lui, d'où ce fichier.
//
// Tout est pur et déterministe ici (aucun React, aucun Supabase) : le serveur
// peut revalider un score, un test peut rejouer une course entière.
// -----------------------------------------------------------------------------

// --- Format --------------------------------------------------------------------

/** Le duel est jouable dès ce nombre de questions : en dessous, le chapitre
 *  n'a pas assez de matière et on retombe sur le vivier général. */
export const DUEL_MIN_QUESTIONS = 6

// --- Barème ---------------------------------------------------------------------

export const POINTS_BASE = 100

/** Bonus de vitesse : plein tarif sous FAST_MS, nul au-delà de SLOW_MS,
 *  décroissance linéaire entre les deux. Répondre vite doit se VOIR. */
export const POINTS_SPEED_MAX = 50
export const SPEED_FAST_MS = 2000
export const SPEED_SLOW_MS = 8000

/** Multiplicateur de série : ×1, puis ×2 à 3 bonnes d'affilée, ×3 à 6 (plafond
 *  volontairement plus bas que le Blitz : sur 90 s, ×4 rendait le score
 *  illisible et écrasait la course avec le rival). */
export const MAX_COMBO_MULTIPLIER = 3

export function comboMultiplier(comboBefore: number): number {
  const safe = Number.isFinite(comboBefore) ? Math.max(0, Math.floor(comboBefore)) : 0
  return Math.min(MAX_COMBO_MULTIPLIER, 1 + Math.floor(safe / 3))
}

export function speedBonus(answerMs: number): number {
  if (!Number.isFinite(answerMs)) return 0
  if (answerMs <= SPEED_FAST_MS) return POINTS_SPEED_MAX
  if (answerMs >= SPEED_SLOW_MS) return 0
  const span = SPEED_SLOW_MS - SPEED_FAST_MS
  return Math.round((POINTS_SPEED_MAX * (SPEED_SLOW_MS - answerMs)) / span)
}

/** Points gagnés par une bonne réponse. Une erreur ne retire RIEN : on
 *  enseigne le plaisir, pas la punition — elle coûte déjà la série et le temps. */
export function answerPoints(comboBefore: number, answerMs: number): number {
  return (POINTS_BASE + speedBonus(answerMs)) * comboMultiplier(comboBefore)
}
