// Reconnaissance du balayage horizontal — logique pure, testée à part du DOM.

/** Distance minimale (px) pour valider un balayage lent. */
export const SWIPE_MIN_DISTANCE = 60
/** Un geste rapide (px/ms) valide dès cette distance courte. */
export const SWIPE_FLICK_VELOCITY = 0.5
export const SWIPE_FLICK_DISTANCE = 24
/** Le geste doit être franchement horizontal, sinon c'est un scroll. */
export const SWIPE_AXIS_RATIO = 1.5
/** Au-delà, l'utilisateur hésite : ce n'est plus un balayage. */
export const SWIPE_MAX_DURATION = 800

export type SwipeGesture = {
  /** Déplacement horizontal, négatif vers la gauche. */
  dx: number
  /** Déplacement vertical. */
  dy: number
  /** Durée du geste en millisecondes. */
  dt: number
}

/**
 * Direction du balayage, ou null si le geste n'en est pas un
 * (trop court, trop vertical, trop lent).
 */
export function resolveSwipe({ dx, dy, dt }: SwipeGesture): 'left' | 'right' | null {
  if (dt > SWIPE_MAX_DURATION) return null

  const distance = Math.abs(dx)
  if (Math.abs(dy) * SWIPE_AXIS_RATIO > distance) return null

  const velocity = dt > 0 ? distance / dt : Infinity
  const isFlick = velocity >= SWIPE_FLICK_VELOCITY && distance >= SWIPE_FLICK_DISTANCE
  if (!isFlick && distance < SWIPE_MIN_DISTANCE) return null

  return dx < 0 ? 'left' : 'right'
}

/**
 * Décalage à appliquer au contenu pendant le geste : suit le doigt en
 * s'amortissant, et reste bloqué près de zéro quand il n'y a pas d'onglet
 * de ce côté (le mur se sent au doigt).
 */
export function dragOffset(dx: number, hasNeighbor: boolean): number {
  const damped = Math.sign(dx) * Math.min(Math.abs(dx) * 0.35, 48)
  return hasNeighbor ? damped : damped * 0.25
}
