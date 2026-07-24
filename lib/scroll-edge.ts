// Détection PURE du dépassement d'extrémité (rubber-band) pendant un geste de
// défilement. Le composant ScrollEdgeSound fournit la mesure du DOM (position de
// scroll, hauteurs) ; ici on ne décide QUE de la direction du rebond — pour
// pouvoir la tester sans navigateur.

/** Décalage minimal du doigt (px) avant de considérer un vrai dépassement. */
export const EDGE_THRESHOLD = 24

export type Overscroll = 'top' | 'bottom' | null

/**
 * `dy` = position actuelle du doigt − position de départ (px). Positif = le
 * doigt DESCEND (on tire le contenu vers le bas, donc on pousse vers le HAUT de
 * la liste). On ne signale un rebond que si la zone est DÉJÀ à l'extrémité
 * concernée, qu'on pousse encore au-delà, et au-dessus du seuil. Une zone qui ne
 * défile pas (`scrollable === false`) ne rebondit jamais : sans ça, la moindre
 * page courte « bwomperait » au premier glissement.
 */
export function overscrollDirection(params: {
  atTop: boolean
  atBottom: boolean
  dy: number
  scrollable: boolean
  threshold?: number
}): Overscroll {
  const { atTop, atBottom, dy, scrollable } = params
  const threshold = params.threshold ?? EDGE_THRESHOLD
  if (!scrollable) return null
  if (atTop && dy > threshold) return 'top'
  if (atBottom && dy < -threshold) return 'bottom'
  return null
}
