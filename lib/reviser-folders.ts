// Les DOSSIERS de l'accueil Réviser — logique pure, sans React.
//
// Pourquoi : l'accueil affichait toutes les matières dépliées d'un coup. Au
// collège c'était une seule grille à rallonge, et l'ajout des matières
// manquantes (EPS, musique, arts, EMC…) l'aurait rendue franchement illisible.
// On range donc en deux dossiers qu'on ouvre et qu'on ferme :
//
//   1. « Programme »       — les matières de la classe, ouvert par défaut ;
//   2. « Hors programme »  — la culture générale (économie, fiscalité…),
//                            fermé par défaut : c'est du bonus, pas du devoir.
//
// Au lycée, le dossier Programme garde ses sous-groupes (tronc commun,
// spécialités, options) : là, la distinction porte une vraie information
// scolaire. Au collège, une seule grille suffit — inventer trois sous-titres
// pour des matières qui sont toutes obligatoires n'aiderait personne.
import type { Subject, SubjectCategory } from '@/lib/types'

/** Les classes où l'on ne distingue ni spécialité ni option. */
export const COLLEGE_LEVELS = ['6e', '5e', '4e', '3e']

export function isCollegeLevel(grade: string): boolean {
  return COLLEGE_LEVELS.includes(grade)
}

/**
 * Les classes où l'on sous-groupe le programme en tronc commun / spécialités /
 * options : la 1re et la Terminale UNIQUEMENT.
 *
 * En seconde, il n'y a pas encore de spécialités dans le système français —
 * tout le monde suit le même tronc commun. Afficher une section « Spécialités »
 * en 2de était donc une erreur : les matières comme Maths ou SVT (marquées
 * `specialite` parce qu'elles LE deviennent au cycle terminal) s'y retrouvaient
 * rangées à tort. On traite donc la 2de comme le collège — une grille unique.
 */
export function usesTrackGroups(grade: string): boolean {
  return grade === '1re' || grade === 'Tle'
}

/** Sous-groupes du dossier Programme, au lycée uniquement. */
export const LYCEE_GROUPS: { category: SubjectCategory; label: string }[] = [
  { category: 'tronc_commun', label: 'Tronc commun' },
  { category: 'specialite', label: 'Spécialités' },
  { category: 'option', label: 'Options' },
]

export type SubjectFolderId = 'programme' | 'hors-programme'

/** Un bloc de matières à l'intérieur d'un dossier. `label` null = sans titre. */
export type SubjectGroup = { label: string | null; items: Subject[] }

export type SubjectFolder = {
  id: SubjectFolderId
  label: string
  /** Une ligne qui dit à quoi sert le dossier, sous son titre. */
  hint: string
  groups: SubjectGroup[]
  /** Nombre total de matières dans le dossier (affiché sur la pastille). */
  count: number
  /**
   * L'unité de ce que compte le dossier, au pluriel (« matières », « modules »).
   * Une pastille « 6 » toute seule ne dit pas 6 de quoi ; associée à `count`
   * elle donne « 6 matières », « 5 modules ». Voir `folderCountLabel`.
   */
  unit: string
  /** Ouvert au premier affichage ? */
  defaultOpen: boolean
}

/**
 * Le libellé complet de la pastille de comptage : « 6 matières », « 1 module ».
 * Accorde l'unité au singulier quand il n'y a qu'un élément (chute du « s »).
 */
export function folderCountLabel(folder: Pick<SubjectFolder, 'count' | 'unit'>): string {
  const unit =
    folder.count === 1 ? folder.unit.replace(/s$/, '') : folder.unit
  return `${folder.count} ${unit}`
}

/** Le dossier auquel appartient une matière. */
export function folderOf(subject: Subject): SubjectFolderId {
  return subject.category === 'culture' ? 'hors-programme' : 'programme'
}

/**
 * Range les matières en dossiers.
 *
 * `programmeSubjects` sont celles qui passent le filtre de l'élève (« Modifier
 * mes matières ») ; en mode édition on passe la liste complète pour qu'il
 * puisse cocher ce qu'il avait retiré. Les matières hors-programme ne sont
 * JAMAIS filtrées : elles ne font pas partie de la sélection.
 *
 * Un dossier vide n'est pas rendu — mieux vaut pas de dossier qu'un dossier
 * qui s'ouvre sur rien.
 */
export function subjectFolders({
  programmeSubjects,
  cultureSubjects,
  grade,
}: {
  programmeSubjects: Subject[]
  cultureSubjects: Subject[]
  grade: string
}): SubjectFolder[] {
  const folders: SubjectFolder[] = []

  if (programmeSubjects.length > 0) {
    // Grille unique au collège ET en seconde (pas de spécialités avant la 1re) ;
    // sous-groupes tronc commun / spé / options seulement en 1re et Terminale.
    const groups: SubjectGroup[] = usesTrackGroups(grade)
      ? LYCEE_GROUPS.map((g) => ({
          label: g.label,
          items: programmeSubjects.filter((s) => s.category === g.category),
        })).filter((g) => g.items.length > 0)
      : [{ label: null, items: programmeSubjects }]

    // Filet de sécurité : au lycée, une matière dont la catégorie ne tombe dans
    // aucun sous-groupe connu (catégorie « college » sur une matière de 2de,
    // par exemple) disparaîtrait sans un mot. On la remet dans un groupe à
    // part plutôt que de la perdre.
    const grouped = new Set(groups.flatMap((g) => g.items.map((s) => s.id)))
    const orphans = programmeSubjects.filter((s) => !grouped.has(s.id))
    if (orphans.length > 0) {
      groups.push({ label: 'Autres matières', items: orphans })
    }

    folders.push({
      id: 'programme',
      label: 'Programme',
      hint: `Tes matières de ${grade}`,
      groups,
      count: programmeSubjects.length,
      unit: 'matières',
      defaultOpen: true,
    })
  }

  if (cultureSubjects.length > 0) {
    folders.push({
      id: 'hors-programme',
      label: 'Culture générale',
      hint: 'En bonus, à ton rythme',
      groups: [{ label: null, items: cultureSubjects }],
      count: cultureSubjects.length,
      unit: 'modules',
      defaultOpen: false,
    })
  }

  return folders
}

/** Toutes les matières d'un dossier, groupes confondus, dans l'ordre affiché. */
export function folderSubjects(folder: SubjectFolder): Subject[] {
  return folder.groups.flatMap((g) => g.items)
}

/**
 * L'avancement MOYEN d'un dossier, en pourcentage entier (0–100).
 *
 * C'est ce que l'en-tête d'un dossier fermé a de plus utile à dire : la
 * pastille de comptage annonce combien de matières il y a dedans, elle ne dit
 * rien de ce qui reste à faire. Un dossier sans matière n'a pas d'avancement —
 * on renvoie `null` plutôt que 0, qui se lirait « tout est à faire ».
 */
export function folderProgress(
  folder: SubjectFolder,
  progressBySlug: Record<string, number>,
): number | null {
  const subjects = folderSubjects(folder)
  if (subjects.length === 0) return null
  const sum = subjects.reduce((acc, s) => acc + (progressBySlug[s.slug] ?? 0), 0)
  return Math.round(sum / subjects.length)
}

// Mémorisation de l'état ouvert/fermé, par dossier. On garde le choix de
// l'élève d'une visite à l'autre : rouvrir « Hors programme » à chaque fois
// qu'on a pris la peine de le fermer serait exactement le défaut qu'on corrige.
const STORAGE_PREFIX = 'studuel-reviser-dossier-'

export function folderStorageKey(id: SubjectFolderId): string {
  return `${STORAGE_PREFIX}${id}`
}

/**
 * L'état d'ouverture à appliquer : le choix mémorisé s'il existe, sinon le
 * défaut du dossier. Toute valeur inattendue en stockage retombe sur le défaut.
 */
export function resolveOpenState(
  // Seul le défaut est lu : on accepte donc n'importe quoi qui le porte, ce qui
  // évite au composant de reconstruire un dossier complet juste pour appeler.
  folder: Pick<SubjectFolder, 'defaultOpen'>,
  stored: string | null,
): boolean {
  if (stored === 'open') return true
  if (stored === 'closed') return false
  return folder.defaultOpen
}
