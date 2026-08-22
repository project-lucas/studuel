// Les années à examen — et ce que l'examen s'appelle.
//
// Cinq classes finissent sur une épreuve nationale : la 3e (brevet), les deux
// Premières (épreuves anticipées du bac — le français se passe en fin de 1re
// dans la voie générale COMME dans la voie technologique) et les deux
// Terminales (bac). Pour ces élèves, réviser
// ne veut pas dire la même chose : le programme n'est plus une fin, c'est une
// préparation. L'onglet « Annales » n'apparaît que là — proposer des sujets
// d'examen à un 5e serait du bruit.
//
// À ne pas confondre avec `lib/exams.ts`, qui dit QUELLES MATIÈRES sont
// évaluées à l'épreuve (les 5 du brevet, le français en 1re, philo + spés en
// Tle). Ici on répond à une question plus simple et plus large : « cette
// année-là se termine-t-elle par un examen ? »

export type ExamYearKey = 'brevet' | 'bac-anticipe' | 'bac'

export type ExamYear = {
  key: ExamYearKey
  /** Nom court, pour un onglet ou un badge (« Brevet »). */
  short: string
  /** Nom complet, dans une phrase (« le brevet », « le bac »). */
  label: string
}

const BAC_ANTICIPE: ExamYear = {
  key: 'bac-anticipe',
  short: 'Bac de français',
  label: 'les épreuves anticipées du bac',
}

const BAC: ExamYear = { key: 'bac', short: 'Bac', label: 'le bac' }

const EXAM_YEARS: Record<string, ExamYear> = {
  '3e': { key: 'brevet', short: 'Brevet', label: 'le brevet' },
  '1re': BAC_ANTICIPE,
  // La voie technologique passe les MÊMES épreuves anticipées et le MÊME bac,
  // aux mêmes dates. L'oublier ici priverait ces élèves de l'onglet Annales
  // l'année précise où il leur sert le plus.
  '1re techno': BAC_ANTICIPE,
  Tle: BAC,
  'Tle techno': BAC,
}

/** L'examen qui attend l'élève cette année, `null` s'il n'y en a pas. */
export function examYearFor(grade: string | null | undefined): ExamYear | null {
  if (!grade) return null
  return EXAM_YEARS[grade.trim()] ?? null
}

/** Y a-t-il un examen au bout de cette année ? */
export function isExamYear(grade: string | null | undefined): boolean {
  return examYearFor(grade) !== null
}
