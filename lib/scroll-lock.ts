/**
 * LE VERROU DE DÉFILEMENT DE LA PAGE, COMPTÉ.
 *
 * Six endroits empêchaient la page de défiler pendant qu'ils s'affichaient
 * (l'écran de chargement, les trois feuilles du bas, les dialogues), et tous
 * les six écrivaient la même chose :
 *
 *     const precedent = document.body.style.overflow
 *     document.body.style.overflow = 'hidden'
 *     return () => { document.body.style.overflow = precedent }
 *
 * Pris isolément c'est juste. **Ça ne compose pas.** Dès que deux d'entre eux
 * se chevauchent — un dialogue ouvert pendant l'écran de chargement, une
 * feuille ouverte depuis un dialogue —, le second enregistre `'hidden'` comme
 * « valeur précédente » et la **restaure** en partant. La page reste alors
 * bloquée définitivement : plus rien ne défile, et rien à l'écran ne dit
 * pourquoi. C'est l'état dans lequel `/reviser` a été trouvé le 2026-08-27,
 * `document.body.style.overflow` figé à `hidden` sans qu'aucune feuille ne soit
 * ouverte.
 *
 * La correction est un **compteur** : seul le premier verrou écrit dans le
 * style, seul le dernier à partir le restaure. C'est la seule façon d'obtenir
 * un comportement correct quand plusieurs composants indépendants réclament la
 * même ressource globale — et ils sont indépendants par construction, aucun ne
 * peut savoir si un autre est déjà là.
 *
 * NE PAS remplacer un appel par une écriture directe dans
 * `document.body.style.overflow` : une seule écriture sauvage suffit à fausser
 * la restauration de tous les autres.
 */

/** Ce dont le verrou a besoin de sa cible : un style avec un `overflow`. */
export type CibleDefilement = { style: { overflow: string } }

/**
 * Fabrique un verrou compté sur une cible.
 *
 * La cible est rendue par une fonction et non passée directement : au moment
 * où ce module est évalué, sur le serveur, `document` n'existe pas. On ne la
 * demande donc qu'à la première prise de verrou, quand le navigateur est là.
 *
 * Un verrou par cible, et le compteur vit dans la fermeture : ce qu'il protège
 * est unique, un compteur par appelant ne compterait rien.
 */
export function creerVerrouDefilement(cible: () => CibleDefilement | null) {
  let profondeur = 0
  /**
   * La valeur du style *inline* d'avant le tout premier verrou. Capturée une
   * seule fois, par le premier arrivant : c'est elle, et pas `'hidden'`, qu'il
   * faut rendre à la fin.
   */
  let overflowInitial = ''
  let cibleTenue: CibleDefilement | null = null

  /**
   * Empêche la page de défiler tant que la fonction rendue n'est pas appelée.
   *
   * La libération est **idempotente** : la rejouer ne décompte qu'une fois.
   * React réexécute les nettoyages d'effet (deux fois au montage en mode strict
   * pendant le développement), et un décompte en double rouvrirait le
   * défilement sous une feuille encore ouverte.
   *
   * Sans cible (rendu serveur), l'appel ne fait rien et rend une libération
   * inerte — l'appelant n'a pas à s'en soucier.
   */
  function verrouiller(): () => void {
    const el = cible()
    if (!el) return () => {}

    if (profondeur === 0) {
      cibleTenue = el
      overflowInitial = el.style.overflow
      el.style.overflow = 'hidden'
    }
    profondeur += 1

    let libere = false
    return () => {
      if (libere) return
      libere = true
      profondeur -= 1
      if (profondeur === 0 && cibleTenue) {
        cibleTenue.style.overflow = overflowInitial
        cibleTenue = null
      }
    }
  }

  /** Nombre de verrous tenus. Sert aux tests et au diagnostic. */
  verrouiller.profondeur = () => profondeur

  return verrouiller
}

/**
 * Le verrou de l'application, sur `document.body`. C'est celui qu'appellent
 * l'écran de chargement, les feuilles du bas et les dialogues.
 */
export const verrouillerDefilement = creerVerrouDefilement(() =>
  typeof document === 'undefined' ? null : document.body,
)
