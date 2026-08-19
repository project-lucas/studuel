// LA MATIÈRE QU'ON RETROUVE — logique pure, sans React.
//
// L'arène rouvrait toujours sur la matière du chapitre en cours. C'était bien
// vu côté révision, et faux côté jeu : un élève qui monte son ladder d'histoire
// depuis trois jours retrouvait « Maths » sous le bouton COMBAT parce qu'il
// avait lu une leçon de maths entre-temps, et il devait re-tourner la roulette
// à chaque session. Le choix du joueur passe donc devant la déduction de l'app.
//
// POURQUOI LE NAVIGATEUR ET PAS LA BASE. C'est une préférence d'INTERFACE, du
// même rang que le son coupé (`lib/sounds`) ou le nom du compagnon : elle ne
// change aucun compteur, aucun trophée, rien qui doive suivre l'élève d'un
// appareil à l'autre. Une colonne de plus sur `profiles` aurait coûté une
// migration, une écriture serveur à chaque cran de roulette, et un aller-retour
// réseau sur un geste qui doit être instantané.
//
// Le slug lu n'est JAMAIS cru sur parole : l'appelant le confronte au plateau
// (`boardIndex`), donc une matière disparue du catalogue retombe simplement sur
// la première — pas d'écran vide.

/** Clé de stockage. Préfixe `scolaria-`, comme tout le reste de l'app. */
export const SUBJECT_MEMORY_KEY = 'scolaria-defi-matiere'

/**
 * Le slug retenu, ou null. Prend le `Storage` en paramètre plutôt que de lire
 * `window` : c'est ce qui rend la fonction testable, et ce qui la laisse tourner
 * côté serveur sans garde supplémentaire.
 *
 * Toute erreur vaut « rien de retenu » : en navigation privée, `localStorage`
 * peut exister et JETER à la lecture. Un écran d'arène ne tombe pas pour ça.
 */
export function readRememberedSubject(store: Storage | null): string | null {
  if (!store) return null
  try {
    const value = store.getItem(SUBJECT_MEMORY_KEY)
    return value && value.trim() ? value : null
  } catch {
    return null
  }
}

/** Retient la matière choisie. Silencieux en cas d'échec, pour la même raison. */
export function rememberSubject(store: Storage | null, slug: string): void {
  if (!store || !slug) return
  try {
    store.setItem(SUBJECT_MEMORY_KEY, slug)
  } catch {
    // Quota plein ou stockage refusé : la session se souviendra quand même du
    // choix (l'état React vit), seule la PROCHAINE ouverture l'oubliera.
  }
}
