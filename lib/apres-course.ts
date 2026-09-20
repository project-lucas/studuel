// -----------------------------------------------------------------------------
// APRÈS UNE COURSE — le drapeau « l'arène et les onglets sont périmés ».
//
// La fin d'une course classée ne revalide plus rien côté serveur : dans une
// Server Action, `revalidatePath` re-rend la page COURANTE (la course
// elle-même) et vide le cache client de tous les onglets, à CHAQUE course d'une
// chaîne de revanches. L'écran de fin a déjà sa réponse ; seuls l'arène et les
// onglets doivent être relus — une fois, en sortant de la course. La course
// pose ce drapeau, le préchargeur d'onglets le consomme au premier écran hors
// course (components/PrechargeurOnglets).
//
// sessionStorage peut être absent ou refuser l'écriture (navigation privée,
// aperçu) : la mémoire du module prend alors le relais, pour la vie de l'onglet.
// -----------------------------------------------------------------------------

const CLE = 'studuel:apres-course'

let enMemoire = false

/** Une course vient d'être enregistrée : l'arène devra se relire. */
export function marquerCoursePassee(): void {
  enMemoire = true
  try {
    sessionStorage.setItem(CLE, '1')
  } catch {
    // stockage indisponible : la mémoire du module suffit
  }
}

/** Le drapeau était-il posé ? Le lit ET l'efface (un seul rafraîchissement). */
export function consommerCoursePassee(): boolean {
  let marque = enMemoire
  enMemoire = false
  try {
    marque = marque || sessionStorage.getItem(CLE) === '1'
    sessionStorage.removeItem(CLE)
  } catch {
    // stockage indisponible : seule la mémoire du module a parlé
  }
  return marque
}
