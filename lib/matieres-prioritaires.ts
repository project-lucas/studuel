// -----------------------------------------------------------------------------
// LES MATIÈRES PRIORITAIRES de l'élève — celles qu'il a marquées d'un « ! »
// sur l'accueil Réviser (10/09/2026, Lucas : « un bouton pour prioriser les
// matières, et laisser un espace entre celles cochées et les autres »).
//
// C'est un choix de l'ÉLÈVE, distinct des chapitres prioritaires du coach
// (`chapters` marqués par le coach) : ici, c'est « ce que je veux voir en
// premier », rangé dans `profiles.matieres_prioritaires` (migration 359), un
// tableau de slugs. Logique pure : la relecture tolérante de ce que la base
// rend, et la coupure en deux de la grille.
// -----------------------------------------------------------------------------

/** Longueur maximale d'un slug de matière accepté (les vrais font < 40). */
export const SLUG_MAX = 64

/**
 * Relit la colonne telle qu'elle revient de la base (JSONB, `null` si la
 * migration dort, n'importe quoi si une main l'a modifiée) : un tableau de
 * slugs propres, sans doublon, dans l'ordre reçu.
 */
export function normaliserPrioritaires(raw: unknown): string[] {
  if (!Array.isArray(raw)) return []
  const vus = new Set<string>()
  for (const v of raw) {
    if (typeof v !== 'string') continue
    const slug = v.trim()
    if (slug.length === 0 || slug.length > SLUG_MAX) continue
    vus.add(slug)
  }
  return [...vus]
}

/**
 * Coupe une liste de matières en deux : les prioritaires devant, les autres
 * derrière — chaque moitié dans l'ordre reçu. L'écran met un espace entre les
 * deux ; une matière prioritaire qui n'est pas dans la liste (déselectionnée,
 * hors classe) n'apparaît nulle part.
 */
export function separerPrioritaires<T extends { slug: string }>(
  matieres: readonly T[],
  prioritaires: ReadonlySet<string> | readonly string[],
): { prioritaires: T[]; autres: T[] } {
  const ensemble = prioritaires instanceof Set ? prioritaires : new Set(prioritaires)
  return {
    prioritaires: matieres.filter((m) => ensemble.has(m.slug)),
    autres: matieres.filter((m) => !ensemble.has(m.slug)),
  }
}
