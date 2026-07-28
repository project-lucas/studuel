// Masquer les matières « cul-de-sac » côté élève : celles qui n'ont AUCUN
// chapitre à son niveau. La migration 193 a ajouté 6 matières du programme
// officiel SANS contenu (allemand, arts-plastiques, grec, musique, sport +
// emc, hlp, llcer-anglais, maths-complementaires, si, snt) : déclarées sur
// plusieurs niveaux, elles apparaissaient dans la grille de Réviser et menaient
// à une page vide — un cul-de-sac cliquable.
//
// Règle : une matière n'est montrée que si elle a au moins un chapitre au
// niveau considéré. Le catalogue brut (getSubjectsCached, /admin) n'est PAS
// touché — le filtre vit à la présentation élève, et la matière réapparaît
// d'elle-même dès qu'un premier chapitre de ce niveau est seedé.

/** Matières ayant au moins un chapitre parmi `chapters` (déjà filtrés au niveau). */
export function subjectsWithContent<T extends { id: string }>(
  subjects: readonly T[],
  chapters: readonly { subject_id: string }[],
): T[] {
  // Garde-fou : sans aucun chapitre (cache froid, niveau réellement sans
  // contenu, migration 026 absente), on ne filtre pas — mieux vaut la liste
  // complète qu'une grille vide. Le repli de la page recharge alors les
  // chapitres, et un rendu suivant appliquera le filtre.
  if (chapters.length === 0) return [...subjects]
  const withChapter = new Set(chapters.map((c) => c.subject_id))
  return subjects.filter((s) => withChapter.has(s.id))
}

/** Combien de matières seraient masquées (pour mesurer / journaliser). */
export function emptySubjectCount<T extends { id: string }>(
  subjects: readonly T[],
  chapters: readonly { subject_id: string }[],
): number {
  return subjects.length - subjectsWithContent(subjects, chapters).length
}
