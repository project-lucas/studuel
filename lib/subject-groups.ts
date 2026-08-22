// Le rangement des matières sur l'accueil Réviser — logique pure, sans React.
//
// PLUS AUCUN DOSSIER. L'accueil rangeait ses matières dans deux dossiers qu'on
// ouvrait et qu'on fermait — « Programme », puis « Culture générale ». Les deux
// sont tombés, dans cet ordre : replier ce que l'élève vient chercher ne range
// rien, ça met un pli devant. Restent deux grilles annoncées par leur titre,
// l'une sous l'autre.
//
// Ce module ne décide donc plus que d'une chose : comment le PROGRAMME se
// découpe. Au lycée il garde ses sous-groupes (tronc commun, spécialités,
// options) : là, la distinction porte une vraie information scolaire. Au
// collège, une seule grille suffit — inventer trois sous-titres pour des
// matières qui sont toutes obligatoires n'aiderait personne. La culture
// générale, elle, n'a jamais eu de découpage : une grille et c'est tout.
import type { Subject, SubjectCategory } from '@/lib/types'

/**
 * Les classes où l'on sous-groupe le programme en tronc commun / spécialités /
 * options : la 1re et la Terminale GÉNÉRALES, uniquement.
 *
 * En seconde, il n'y a pas encore de spécialités dans le système français —
 * tout le monde suit le même tronc commun. Afficher une section « Spécialités »
 * en 2de était donc une erreur : les matières comme Maths ou SVT (marquées
 * `specialite` parce qu'elles LE deviennent au cycle terminal) s'y retrouvaient
 * rangées à tort. On traite donc la 2de comme le collège — une grille unique.
 *
 * LA VOIE TECHNOLOGIQUE Y ÉCHAPPE AUSSI, et c'est délibéré. Elle a bien des
 * spécialités, mais elles dépendent de sa SÉRIE (STMG, STI2D, ST2S…) — que le
 * profil ne demande pas encore — et le catalogue ne lui en déclare donc aucune
 * (migration 241). Le sous-groupage lui donnerait un titre « Tronc commun »
 * seul au-dessus de sa grille, et deux sections vides : un rangement qui ne
 * range rien. Le primaire, lui, n'a jamais eu de spécialités.
 */
export function usesTrackGroups(grade: string): boolean {
  return grade === '1re' || grade === 'Tle'
}

/** Sous-groupes du programme, au lycée uniquement. */
export const LYCEE_GROUPS: { category: SubjectCategory; label: string }[] = [
  { category: 'tronc_commun', label: 'Tronc commun' },
  { category: 'specialite', label: 'Spécialités' },
  { category: 'option', label: 'Options' },
]

/** Un bloc de matières dans la grille. `label` null = bloc sans titre. */
export type SubjectGroup = { label: string | null; items: Subject[] }

/**
 * Les blocs de matières du PROGRAMME, dans l'ordre d'affichage.
 *
 * `subjects` sont celles qui passent le filtre de l'élève (« Modifier mes
 * matières ») ; en mode édition on passe la liste complète pour qu'il puisse
 * recocher ce qu'il avait retiré.
 *
 * Sans matière, on renvoie une liste vide : c'est à l'appelant de dire quoi
 * faire d'un programme vide (l'accueil propose d'en choisir).
 */
export function programmeGroups({
  subjects,
  grade,
}: {
  subjects: Subject[]
  grade: string
}): SubjectGroup[] {
  if (subjects.length === 0) return []

  // Grille unique au collège ET en seconde (pas de spécialités avant la 1re) ;
  // sous-groupes tronc commun / spé / options seulement en 1re et Terminale.
  const groups: SubjectGroup[] = usesTrackGroups(grade)
    ? LYCEE_GROUPS.map((g) => ({
        label: g.label,
        items: subjects.filter((s) => s.category === g.category),
      })).filter((g) => g.items.length > 0)
    : [{ label: null, items: subjects }]

  // Filet de sécurité : au lycée, une matière dont la catégorie ne tombe dans
  // aucun sous-groupe connu (catégorie « college » sur une matière de 2de,
  // par exemple) disparaîtrait sans un mot. On la remet dans un groupe à
  // part plutôt que de la perdre.
  const grouped = new Set(groups.flatMap((g) => g.items.map((s) => s.id)))
  const orphans = subjects.filter((s) => !grouped.has(s.id))
  if (orphans.length > 0) {
    groups.push({ label: 'Autres matières', items: orphans })
  }

  return groups
}
