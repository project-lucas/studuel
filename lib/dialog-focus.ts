// Piège de focus d'un dialogue (motif ARIA « dialog ») — logique pure.
//
// Les dialogues de l'app portent `role="dialog"` + `aria-modal="true"`, ce qui
// est une PROMESSE faite au lecteur d'écran : « le reste de la page ne compte
// plus ». Aucun ne la tenait — le focus restait sur le bouton qui avait ouvert
// la modale, Tab continuait de parcourir la grille masquée derrière, et à la
// fermeture le focus repartait au début du document. Un utilisateur au clavier
// pouvait « répondre » à une confirmation d'achat sans jamais voir le dialogue.
//
// Ici seulement le calcul : quelle cible viser quand Tab est pressé.

/**
 * Index à focaliser quand Tab (ou Maj+Tab) est pressé dans un dialogue, ou
 * `null` si le navigateur peut faire son travail normalement (déplacement
 * interne au dialogue, qui n'a pas besoin d'être intercepté).
 *
 * `activeIndex` vaut -1 quand le focus n'est sur aucun élément focalisable du
 * dialogue : sur le panneau lui-même, ou déjà échappé à l'extérieur. Dans les
 * deux cas on ramène le focus DANS le dialogue — c'est tout l'objet du piège.
 */
export function nextDialogFocus(
  count: number,
  activeIndex: number,
  shiftKey: boolean,
): number | null {
  if (count <= 0) return null
  if (activeIndex < 0) return shiftKey ? count - 1 : 0
  if (shiftKey) return activeIndex === 0 ? count - 1 : null
  return activeIndex === count - 1 ? 0 : null
}
