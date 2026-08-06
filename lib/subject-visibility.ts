// Repérer les matières SANS contenu : celles qui n'ont aucun chapitre au niveau
// de l'élève. La migration 193 a ajouté des matières du programme officiel sans
// contenu (allemand, arts-plastiques, grec, musique, sport, emc, hlp,
// llcer-anglais, maths-complementaires, si, snt) : déclarées sur plusieurs
// niveaux, elles menaient à une page vide.
//
// DEUX USAGES, ET UN SEUL MASQUE (02/08/2026) :
//
//  · RÉVISER les MONTRE, avec la mention « Bientôt » sur leur carte. Chaque
//    classe doit voir son programme entier ; ce qui manque est annoncé, pas
//    caché. C'est ici qu'on calcule QUI est vide, pas qui disparaît.
//  · LE DÉFI les masque toujours. Là, une matière sans question ne donne pas
//    une page vide mais un duel qu'on ne peut pas jouer — il n'y a rien à
//    annoncer, seulement une partie impossible à lancer.
//
// Le catalogue brut (getSubjectsCached, /admin) n'est jamais touché, et une
// matière rejoint ses voisines d'elle-même dès qu'un premier chapitre est seedé
// à son niveau.

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

// --- Matières HORS-NIVEAU : leur contenu ne vit pas au niveau de l'élève ------
//
// ⚠️ Le piège qui a coûté cinq matières. `subjectsWithContent` juge une matière
// sur les chapitres du niveau de l'élève — mais une matière `fixed_level`
// (Économie, Fiscalité, Finances perso, Entrepreneuriat, Figures historiques :
// la « culture générale ») déclare TOUS les niveaux et range son contenu à un
// niveau fixe (`tous`). Jugée au niveau de l'élève, elle paraît vide alors
// qu'elle est pleine : elle a disparu de Réviser et du plateau de la Traque
// pour toutes les classes. Le niveau à interroger est donc
// `fixed_level ?? niveau de l'élève` — exactement la règle qu'applique déjà
// `app/reviser/[subject]/page.tsx` pour lire le programme.

/** Le niveau où vit VRAIMENT le contenu d'une matière, pour un élève de `level`. */
export function contentLevelOf(
  subject: { fixed_level?: string | null },
  level: string,
): string {
  return subject.fixed_level ?? level
}

/** Couple (matière, niveau) ayant au moins un chapitre — cf. lib/catalog. */
export type SubjectLevelPair = readonly [subjectId: string, level: string]

const pairKey = (subjectId: string, level: string) => `${subjectId}|${level}`

/**
 * Matières ayant du contenu pour un élève de `level`, **niveau fixe compris**.
 * `pairs` couvre TOUS les niveaux (pas seulement celui de l'élève) : c'est ce
 * qui permet de juger une matière hors-niveau sur son propre niveau.
 */
export function subjectsWithContentAt<
  T extends { id: string; fixed_level?: string | null },
>(subjects: readonly T[], pairs: readonly SubjectLevelPair[], level: string): T[] {
  // Même garde-fou que `subjectsWithContent` : sans donnée, on ne filtre pas.
  if (pairs.length === 0) return [...subjects]
  const have = new Set(pairs.map(([id, lvl]) => pairKey(id, lvl)))
  return subjects.filter((s) => have.has(pairKey(s.id, contentLevelOf(s, level))))
}
