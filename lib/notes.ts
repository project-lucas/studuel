// -----------------------------------------------------------------------------
// « Mes notes » — les notes RÉELLES obtenues par l'élève à ses contrôles
// (table school_grades, migration 167). C'est le pont entre l'app et le
// bulletin : moyenne pondérée par trimestre, évolution d'un trimestre à
// l'autre, moyennes par matière. Logique pure et testable (convention projet :
// pas de logique dans les composants).
//
// Trimestres scolaires français, approximation calendaire commune :
//   T1 = septembre → novembre · T2 = décembre → février · T3 = mars → août.
// L'année scolaire est identifiée par l'année civile de sa rentrée (sept.) :
// « 2025 » couvre sept. 2025 → août 2026.
// -----------------------------------------------------------------------------

export type SchoolGrade = {
  id: string
  subject: string // slug de la matière (ex. 'maths')
  label: string | null // intitulé libre (« Contrôle ch. 3 »), optionnel
  score: number // note obtenue
  outOf: number // barème (souvent 20)
  coefficient: number // poids dans la moyenne
  date: string // jour du contrôle, clé UTC 'YYYY-MM-DD'
}

// Bornes partagées avec la migration 167 (CHECK en base) : si tu changes l'un,
// change l'autre.
export const MAX_GRADE_OUT_OF = 100
export const MAX_GRADE_COEFFICIENT = 10

export type Trimestre = 1 | 2 | 3

const isDayKey = (v: unknown): v is string =>
  typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v)

const asNumber = (v: unknown): number | null => {
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

// Valide/normalise une valeur brute (ligne de la base ou formulaire) en
// SchoolGrade, ou null si la forme est invalide. Mêmes bornes que la base.
export function normalizeGrade(raw: unknown): SchoolGrade | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>

  const id = typeof o.id === 'string' && o.id.length > 0 ? o.id : null
  const subject =
    typeof o.subject === 'string' && o.subject.length > 0 && o.subject.length < 60
      ? o.subject
      : null
  const score = asNumber(o.score)
  // La base renvoie out_of/outOf selon le mapping : on accepte les deux formes.
  const outOf = asNumber(o.outOf ?? o.out_of)
  const coefficient = asNumber(o.coefficient) ?? 1

  if (!id || !subject || score === null || outOf === null) return null
  if (!isDayKey(o.date)) return null
  if (score < 0 || outOf <= 0 || outOf > MAX_GRADE_OUT_OF) return null
  if (score > outOf) return null
  if (coefficient <= 0 || coefficient > MAX_GRADE_COEFFICIENT) return null

  const label =
    typeof o.label === 'string' && o.label.trim().length > 0
      ? o.label.trim().slice(0, 120)
      : null

  return { id, subject, label, score, outOf, coefficient, date: o.date }
}

// Liste brute (réponse Supabase) → notes valides, plus récentes d'abord.
export function normalizeGradeList(raw: unknown): SchoolGrade[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map(normalizeGrade)
    .filter((g): g is SchoolGrade => g !== null)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
}

// --- Trimestres ---------------------------------------------------------------

// Année scolaire (année civile de la rentrée) et trimestre d'une clé de jour.
// Null si la clé est invalide.
export function trimestreOf(
  dayKey: string,
): { year: number; t: Trimestre } | null {
  if (!isDayKey(dayKey)) return null
  const year = Number(dayKey.slice(0, 4))
  const month = Number(dayKey.slice(5, 7))
  if (month < 1 || month > 12) return null

  if (month >= 9 && month <= 11) return { year, t: 1 }
  if (month === 12) return { year, t: 2 }
  if (month <= 2) return { year: year - 1, t: 2 }
  // mars → août : troisième trimestre (l'été est rattaché à l'année écoulée).
  return { year: year - 1, t: 3 }
}

export function trimestreLabel(t: Trimestre): string {
  return `Trimestre ${t}`
}

// --- Moyennes -----------------------------------------------------------------

// Note ramenée sur 20 (les barèmes /10, /40… deviennent comparables).
export function noteSur20(g: SchoolGrade): number {
  return (g.score / g.outOf) * 20
}

// Moyenne pondérée sur 20, ou null si aucune note.
export function weightedAverage20(grades: readonly SchoolGrade[]): number | null {
  let sum = 0
  let weight = 0
  for (const g of grades) {
    sum += noteSur20(g) * g.coefficient
    weight += g.coefficient
  }
  return weight > 0 ? sum / weight : null
}

export type TrimestreSummary = {
  t: Trimestre
  avg: number | null // moyenne /20 du trimestre, null si aucune note
  count: number
}

// Les 3 trimestres de l'année scolaire EN COURS (celle de `today`), chacun avec
// sa moyenne pondérée. Les notes d'autres années sont ignorées.
export function trimestreSummaries(
  grades: readonly SchoolGrade[],
  today: string,
): TrimestreSummary[] {
  const now = trimestreOf(today)
  if (!now) return []

  const buckets: Record<Trimestre, SchoolGrade[]> = { 1: [], 2: [], 3: [] }
  for (const g of grades) {
    const tri = trimestreOf(g.date)
    if (tri && tri.year === now.year) buckets[tri.t].push(g)
  }
  return ([1, 2, 3] as const).map((t) => ({
    t,
    avg: weightedAverage20(buckets[t]),
    count: buckets[t].length,
  }))
}

// Le trimestre « affiché » : celui du jour s'il a des notes, sinon le dernier
// trimestre de l'année en cours qui en a (on ne montre pas un zéro pointé le
// 1er décembre alors que le T1 est plein). Null si l'année est vide.
export function displayedTrimestre(
  summaries: readonly TrimestreSummary[],
  today: string,
): TrimestreSummary | null {
  const now = trimestreOf(today)
  if (!now) return null
  const current = summaries.find((s) => s.t === now.t)
  if (current && current.count > 0) return current
  const withGrades = summaries.filter((s) => s.t <= now.t && s.count > 0)
  return withGrades.length > 0 ? withGrades[withGrades.length - 1] : null
}

// Évolution du trimestre affiché par rapport au PRÉCÉDENT qui a des notes :
// delta en points (/20), null si pas de point de comparaison.
export function trimestreDelta(
  summaries: readonly TrimestreSummary[],
  displayed: TrimestreSummary | null,
): number | null {
  if (!displayed || displayed.avg === null) return null
  const previous = summaries
    .filter((s) => s.t < displayed.t && s.avg !== null)
    .pop()
  if (!previous || previous.avg === null) return null
  return displayed.avg - previous.avg
}

// Phrase honnête sur l'évolution — jamais culpabilisante (ton compagnon).
export function trimestreTrendMessage(delta: number | null): string | null {
  if (delta === null) return null
  if (delta >= 1) return 'En nette progression — ça paie !'
  if (delta >= 0.3) return 'Ça monte doucement, continue.'
  if (delta > -0.3) return 'Stable — le rythme est tenu.'
  if (delta > -1) return 'Léger creux — une matière à resserrer ?'
  return 'Trimestre plus dur — on cible les points faibles ensemble.'
}

// --- Par matière --------------------------------------------------------------

export type SubjectAverage = {
  subject: string // slug
  avg: number // moyenne /20
  count: number
}

// Moyennes par matière sur une liste (déjà filtrée par trimestre/année par
// l'appelant), les mieux fournies d'abord puis par moyenne décroissante.
export function subjectAverages(
  grades: readonly SchoolGrade[],
): SubjectAverage[] {
  const bySubject = new Map<string, SchoolGrade[]>()
  for (const g of grades) {
    const list = bySubject.get(g.subject) ?? []
    bySubject.set(g.subject, [...list, g])
  }
  return [...bySubject.entries()]
    .map(([subject, list]) => ({
      subject,
      avg: weightedAverage20(list) ?? 0,
      count: list.length,
    }))
    .sort((a, b) => b.count - a.count || b.avg - a.avg)
}

// Notes d'un trimestre donné de l'année scolaire de `today`.
export function gradesOfTrimestre(
  grades: readonly SchoolGrade[],
  today: string,
  t: Trimestre,
): SchoolGrade[] {
  const now = trimestreOf(today)
  if (!now) return []
  return grades.filter((g) => {
    const tri = trimestreOf(g.date)
    return tri !== null && tri.year === now.year && tri.t === t
  })
}

// --- Tableau de l'année (matière × trimestre) ---------------------------------

export type SubjectYearRow = {
  subject: string // slug
  // Moyennes /20 des trimestres T1, T2, T3 de l'année en cours (null = vide).
  avgs: [number | null, number | null, number | null]
  count: number // nombre de notes sur l'année
  // Dernier trimestre noté vs le précédent noté (en points /20), null sinon.
  delta: number | null
}

export type AnneeMatrix = {
  rows: SubjectYearRow[] // mieux fournies d'abord, puis ordre alphabétique
  // Moyenne générale (toutes matières pondérées) de chaque trimestre.
  general: [number | null, number | null, number | null]
}

// Le « tableau de l'année » : pour chaque matière notée, la moyenne de chacun
// des 3 trimestres de l'année scolaire de `today` + la tendance ; en tête, la
// moyenne générale par trimestre. Les notes d'autres années sont ignorées.
export function anneeMatrix(
  grades: readonly SchoolGrade[],
  today: string,
): AnneeMatrix {
  const now = trimestreOf(today)
  if (!now) return { rows: [], general: [null, null, null] }

  const year = grades.filter((g) => trimestreOf(g.date)?.year === now.year)
  const avgOf = (list: readonly SchoolGrade[], t: Trimestre) =>
    weightedAverage20(list.filter((g) => trimestreOf(g.date)?.t === t))

  const bySubject = new Map<string, SchoolGrade[]>()
  for (const g of year) {
    bySubject.set(g.subject, [...(bySubject.get(g.subject) ?? []), g])
  }

  const rows: SubjectYearRow[] = [...bySubject.entries()]
    .map(([subject, list]) => {
      const avgs: SubjectYearRow['avgs'] = [
        avgOf(list, 1),
        avgOf(list, 2),
        avgOf(list, 3),
      ]
      const noted = avgs.filter((a): a is number => a !== null)
      const delta =
        noted.length >= 2 ? noted[noted.length - 1] - noted[noted.length - 2] : null
      return { subject, avgs, count: list.length, delta }
    })
    .sort((a, b) => b.count - a.count || a.subject.localeCompare(b.subject))

  return {
    rows,
    general: [avgOf(year, 1), avgOf(year, 2), avgOf(year, 3)],
  }
}

// --- Affichage ----------------------------------------------------------------

// Note formatée à la française : virgule, au plus 1 décimale (« 13,5 », « 15 »).
export function formatNote(n: number): string {
  const rounded = Math.round(n * 10) / 10
  return Number.isInteger(rounded)
    ? String(rounded)
    : String(rounded).replace('.', ',')
}
