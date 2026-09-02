// LE FIL ENTRE LE JETON QUI ATTERRIT ET LE COMPTEUR QUI MONTE.
//
// Le vol (components/recompenses) et le bandeau (components/TopHud) vivent aux
// deux bouts de l'arbre React : le premier est monté autour du contenu de la
// page, le second dans le layout, à côté. Aucun état React ne peut relier les
// deux sans faire remonter le vol jusqu'au layout racine — c'est-à-dire sans
// re-rendre toute l'application à chaque jeton qui tombe.
//
// D'où un événement de fenêtre : le jeton crie « +2 écus » en atterrissant,
// le bandeau écoute et incrémente le seul nombre concerné. Personne d'autre ne
// se re-rend.
//
// ⚠️ CE COMPTEUR EST OPTIMISTE, ET C'EST ASSUMÉ. Il avance sur la foi de ce que
// le serveur a déjà versé (les Server Actions rendent les montants RÉELLEMENT
// écrits, jamais ceux qu'on espérait). Le rafraîchissement qui suit la volée
// remet la valeur du serveur et remet le delta à zéro : si les deux divergent,
// c'est la base qui gagne, en silence et sans à-coup.

import type { UniteGain } from '@/lib/gains'

/** Le nom de l'événement, écrit une fois. */
export const EVENEMENT_GAIN = 'studuel:gain'

export type DetailGain = {
  unite: UniteGain
  /** Ce que CE jeton apporte (pas le total de la volée). */
  montant: number
}

/**
 * L'attribut qui marque une pastille du bandeau comme cible d'un vol.
 * `<div data-hud-cible="ecu">` — voir `UNITES` dans lib/gains.
 */
export const ATTRIBUT_CIBLE = 'data-hud-cible'

/** Le sélecteur de la pastille qui reçoit une unité. */
export function selecteurCible(cible: string): string {
  return `[${ATTRIBUT_CIBLE}="${cible}"]`
}

/** Annonce qu'un jeton vient d'atterrir. Sans navigateur : ne fait rien. */
export function emettreGain(detail: DetailGain): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent<DetailGain>(EVENEMENT_GAIN, { detail }))
}

/**
 * Écoute les atterrissages. Rend la fonction de désabonnement.
 *
 * Rendre le désabonnement plutôt que d'exposer `removeEventListener` évite le
 * piège classique du `useEffect` : une fonction recréée à chaque rendu qu'on
 * croit retirer et qui reste posée.
 */
export function ecouterGains(
  ecoute: (detail: DetailGain) => void,
): () => void {
  if (typeof window === 'undefined') return () => {}
  const handler = (event: Event) => {
    const detail = (event as CustomEvent<DetailGain>).detail
    if (!detail || typeof detail.montant !== 'number') return
    ecoute(detail)
  }
  window.addEventListener(EVENEMENT_GAIN, handler)
  return () => window.removeEventListener(EVENEMENT_GAIN, handler)
}

/**
 * Le centre d'un élément, en coordonnées d'écran — ou `null` s'il n'y a rien à
 * viser.
 *
 * ⚠️ UN ÉLÉMENT MASQUÉ RÉPOND QUAND MÊME. Le bandeau est en `md:hidden` : sur
 * un écran large il reste DANS le DOM, `querySelector` le trouve, et son
 * `getBoundingClientRect()` rend un rectangle de taille zéro posé à l'origine.
 * Sans ce contrôle, tous les jetons voleraient vers le coin haut-gauche de
 * l'écran — visiblement, et pour tout le monde sur ordinateur.
 */
export function centreVisible(
  element: Element | null,
): { x: number; y: number } | null {
  if (!element) return null
  const r = element.getBoundingClientRect()
  if (r.width <= 0 || r.height <= 0) return null
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
}
