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

/**
 * Restreint les niveaux DÉCLARÉS de chaque matière à ceux qui ont du contenu,
 * et écarte celles qu'il ne reste plus rien à proposer. Sert au sélecteur de
 * matières de `/bienvenue`, qui filtre par `levels` sans jamais voir de
 * chapitre : ainsi un futur 2de ne peut plus cocher « SNT » ou « Espagnol »
 * pour découvrir une page vide à sa première visite.
 *
 * Une matière hors-niveau garde tous ses niveaux déclarés dès lors que son
 * niveau fixe a du contenu — c'est là qu'elle le range.
 */
export function narrowLevelsToContent<
  T extends { id: string; levels: string[]; fixed_level?: string | null },
>(subjects: readonly T[], pairs: readonly SubjectLevelPair[]): T[] {
  if (pairs.length === 0) return [...subjects]
  const have = new Set(pairs.map(([id, lvl]) => pairKey(id, lvl)))
  const out: T[] = []
  for (const s of subjects) {
    if (s.fixed_level) {
      if (have.has(pairKey(s.id, s.fixed_level))) out.push(s)
      continue
    }
    const levels = s.levels.filter((lvl) => have.has(pairKey(s.id, lvl)))
    if (levels.length > 0) out.push({ ...s, levels })
  }
  return out
}
