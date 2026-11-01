// -----------------------------------------------------------------------------
// UN STOCK DANS LE NAVIGATEUR, lu par `useSyncExternalStore`.
//
// La recette des thèmes favoris (lib/reviser/favoris), rendue réutilisable pour
// les BOUCLES OUVERTES du 28/10/2026 (l'effet Zeigarnik) : la manche de quiz
// inachevée (lib/quiz-brouillon) et le cours entamé (lib/lecture-entamee).
//
// Trois garanties, les mêmes que pour les favoris :
//   1. `localStorage` lève en navigation privée ou quand les données de site
//      sont bloquées : toute lecture et toute écriture passent par un
//      try/catch, et l'écran s'affiche correctement sans rien ;
//   2. l'instantané est STABLE tant que la chaîne brute n'a pas bougé (exigence
//      de `useSyncExternalStore`, sinon React boucle) ;
//   3. quand le navigateur refuse l'écriture, la valeur vit en mémoire le temps
//      de la visite — l'écran répond quand même.
//
// Les abonnés de l'onglet sont prévenus à chaque écriture ; ceux des autres
// onglets par l'événement `storage`. C'est ce qui fait qu'un onglet gardé
// vivant (Réviser, sous <Activity>) voit la manche qu'on vient de quitter sans
// rien relire.
// -----------------------------------------------------------------------------

export type StockLocal<T> = {
  /** La valeur courante (référence stable entre deux écritures). */
  lire: () => T
  /** Côté serveur et à l'hydratation : la valeur vide. */
  serveur: () => T
  ecrire: (valeur: T) => void
  abonner: (prevenir: () => void) => () => void
}

export function creerStockLocal<T>(
  cle: string,
  parser: (brut: string | null) => T,
  vide: T,
): StockLocal<T> {
  let dernierBrut: string | null | undefined
  let dernier: T = vide
  let enMemoire: { valeur: T } | null = null
  const abonnes = new Set<() => void>()

  function lireBrut(): string | null {
    try {
      return window.localStorage.getItem(cle)
    } catch {
      return null
    }
  }

  function lire(): T {
    if (typeof window === 'undefined') return vide
    if (enMemoire) return enMemoire.valeur
    const brut = lireBrut()
    if (brut !== dernierBrut) {
      dernierBrut = brut
      dernier = parser(brut)
    }
    return dernier
  }

  function ecrire(valeur: T): void {
    try {
      window.localStorage.setItem(cle, JSON.stringify(valeur))
      enMemoire = null
    } catch {
      enMemoire = { valeur }
    }
    for (const prevenir of abonnes) prevenir()
  }

  function abonner(prevenir: () => void): () => void {
    abonnes.add(prevenir)
    window.addEventListener('storage', prevenir)
    return () => {
      abonnes.delete(prevenir)
      window.removeEventListener('storage', prevenir)
    }
  }

  return { lire, serveur: () => vide, ecrire, abonner }
}
