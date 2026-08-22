import { GRADE_LEVELS, type GradeLevel } from '@/lib/types'

// -----------------------------------------------------------------------------
// LES CLASSES, LEURS CYCLES, ET L'ALIAS DE LA VOIE TECHNOLOGIQUE.
//
// L'app couvrait le collège et le lycée général (6e → Tle). Elle couvre
// désormais le PRIMAIRE (CP → CM2) et la VOIE TECHNOLOGIQUE (1re techno,
// Tle techno). Ce module est le seul endroit qui sait ce qu'est une classe :
// à quel cycle elle appartient, comment elle s'écrit, et — le point délicat —
// OÙ VIT SON CONTENU.
//
// L'ALIAS, ET POURQUOI IL EXISTE.
// Le contenu (chapters.level, quizzes.grade_level) est filtré par la valeur
// EXACTE du niveau. Un élève de « 1re techno » suit le même français, la même
// histoire-géo et le même EMC qu'un élève de 1re générale — mais tout ce
// contenu est rangé en base au niveau « 1re ». Sans alias, il ouvrirait une app
// entièrement vide alors que la base est pleine.
//
// D'où la séparation en DEUX questions, qui n'ont pas la même réponse :
//   · QUI EST L'ÉLÈVE ?  → sa classe telle quelle (« 1re techno »). C'est ce
//     qui décide de ses matières (subjects.levels), de sa cohorte au
//     classement, de son clan, de son épreuve. On n'efface jamais la voie.
//   · OÙ EST SON COURS ? → `contentLevelFor(classe)`, qui replie la voie techno
//     sur son niveau général. C'est ce qu'on passe à une requête `chapters`.
//
// Le primaire n'a PAS d'alias : son contenu lui est propre, il vit à son
// niveau. Une matière primaire sans chapitre s'affiche « Bientôt », comme
// partout ailleurs (cf. lib/subject-visibility).
// -----------------------------------------------------------------------------

export type GradeCycle = 'primaire' | 'college' | 'lycee'

export type CycleDef = {
  id: GradeCycle
  /** Intitulé du groupe dans un menu de classes. */
  label: string
  grades: readonly GradeLevel[]
}

/**
 * Les trois cycles, dans l'ordre scolaire. La concaténation de leurs `grades`
 * doit redonner `GRADE_LEVELS` à l'identique — un test le vérifie, sans quoi
 * une classe ajoutée à `GRADE_LEVELS` disparaîtrait en silence du menu.
 */
export const GRADE_CYCLES: readonly CycleDef[] = [
  { id: 'primaire', label: 'Primaire', grades: ['CP', 'CE1', 'CE2', 'CM1', 'CM2'] },
  { id: 'college', label: 'Collège', grades: ['6e', '5e', '4e', '3e'] },
  {
    id: 'lycee',
    label: 'Lycée',
    grades: ['2de', '1re', '1re techno', 'Tle', 'Tle techno'],
  },
] as const

const CYCLE_OF = new Map<string, GradeCycle>(
  GRADE_CYCLES.flatMap((c) => c.grades.map((g) => [g, c.id] as [string, GradeCycle])),
)

/**
 * Le cycle d'une classe. Repli sur `college` quand la classe est inconnue ou
 * absente : c'est le cycle du plus gros de nos élèves, et le repli historique
 * de `schoolLevelForGrade`.
 */
export function cycleOf(grade: string | null | undefined): GradeCycle {
  if (typeof grade !== 'string') return 'college'
  return CYCLE_OF.get(grade.trim()) ?? 'college'
}

export function isGradeLevel(v: unknown): v is GradeLevel {
  return typeof v === 'string' && (GRADE_LEVELS as readonly string[]).includes(v)
}

// --- La voie technologique ---------------------------------------------------

/** Les classes de la voie techno et le niveau général qui porte leur contenu. */
const TECHNO_ALIAS: Record<string, GradeLevel> = {
  '1re techno': '1re',
  'Tle techno': 'Tle',
}

export function isTechno(grade: string | null | undefined): boolean {
  return typeof grade === 'string' && grade.trim() in TECHNO_ALIAS
}

/**
 * Le niveau où lire le CONTENU d'un élève de cette classe.
 *
 * À passer à toute requête sur `chapters.level` / `quizzes.grade_level`.
 * Ne JAMAIS l'utiliser pour filtrer `subjects.levels` (la techno a son propre
 * catalogue de matières), ni pour nommer une cohorte ou un clan.
 */
export function contentLevelFor(grade: string | null | undefined): string {
  const g = typeof grade === 'string' ? grade.trim() : ''
  return TECHNO_ALIAS[g] ?? g
}

// --- Écriture ----------------------------------------------------------------

/**
 * Le nom complet d'une classe, tel qu'on le dit à l'élève. « Tle » ne se
 * prononce pas : c'est « Terminale ». Le primaire s'écrit comme il se dit.
 */
export const GRADE_FULL_LABELS: Record<GradeLevel, string> = {
  CP: 'CP',
  CE1: 'CE1',
  CE2: 'CE2',
  CM1: 'CM1',
  CM2: 'CM2',
  '6e': 'Sixième',
  '5e': 'Cinquième',
  '4e': 'Quatrième',
  '3e': 'Troisième',
  '2de': 'Seconde',
  '1re': 'Première',
  '1re techno': 'Première techno',
  Tle: 'Terminale',
  'Tle techno': 'Terminale techno',
}

/** L'écriture courte du design (exposants), pour une pastille ou un menu. */
export const GRADE_SHORT_LABELS: Record<GradeLevel, string> = {
  CP: 'CP',
  CE1: 'CE1',
  CE2: 'CE2',
  CM1: 'CM1',
  CM2: 'CM2',
  '6e': '6ᵉ',
  '5e': '5ᵉ',
  '4e': '4ᵉ',
  '3e': '3ᵉ',
  '2de': '2ⁿᵈᵉ',
  '1re': '1ʳᵉ',
  '1re techno': '1ʳᵉ techno',
  Tle: 'Terminale',
  'Tle techno': 'Terminale techno',
}

export function gradeLabel(grade: string | null | undefined): string | null {
  if (!isGradeLevel(grade)) return null
  return GRADE_FULL_LABELS[grade]
}
