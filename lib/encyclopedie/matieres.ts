// -----------------------------------------------------------------------------
// QUELLES MATIÈRES ONT UNE ENCYCLOPÉDIE.
//
// Module VOLONTAIREMENT MINUSCULE, et sans aucun import : il est lu par la
// barre d'onglets du dossier de matière, donc par un composant CLIENT. Tout ce
// qu'il tirerait derrière lui partirait dans le bundle — et derrière
// `lib/encyclopedie/contenu` il y a plusieurs centaines de kilo-octets de
// texte. D'où la séparation : la question « cette matière a-t-elle une
// encyclopédie ? » ne doit pas coûter l'encyclopédie.
//
// Une seule matière pour l'instant. Le jour où les SVT ou la physique auront
// la leur (les savants, les grandes expériences), c'est ici qu'on l'ajoute —
// et nulle part ailleurs.
// -----------------------------------------------------------------------------

export const MATIERES_ENCYCLOPEDIE: readonly string[] = ['histoire-geo']

export function aUneEncyclopedie(slug: string | null | undefined): boolean {
  return slug ? MATIERES_ENCYCLOPEDIE.includes(slug) : false
}

/** L'adresse de l'encyclopédie d'une matière. */
export function hrefEncyclopedie(slug: string): string {
  return `/reviser/${slug}/encyclopedie`
}

/** L'adresse d'une fiche. */
export function hrefFiche(slug: string, id: string): string {
  return `/reviser/${slug}/encyclopedie/${id}`
}
