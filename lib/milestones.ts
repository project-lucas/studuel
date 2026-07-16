// -----------------------------------------------------------------------------
// « Journal de progression » — la timeline des jalons de l'onglet Moi : les
// moments marquants du parcours de l'élève (premières fois, quiz parfait, paliers
// de volume, paliers de série), reconstruits UNIQUEMENT à partir d'événements
// horodatés déjà chargés (sessions, jours d'activité). Aucune donnée nouvelle,
// aucune date incertaine. Logique pure et testable (convention projet).
//
// Dates : clés UTC 'YYYY-MM-DD'. Sortie triée du plus RÉCENT au plus ancien.
// -----------------------------------------------------------------------------

export type MilestoneKind = 'first' | 'perfect' | 'volume' | 'streak'

export type Milestone = {
  date: string
  kind: MilestoneKind
  label: string
}

// On borne la timeline pour rester lisible (les plus récents en tête).
export const MAX_MILESTONES = 15

// Paliers de volume de quiz et de série (jours) qui méritent un jalon.
const QUIZ_VOLUME_STEPS = [10, 25, 50, 100, 200]
const STREAK_STEPS = [3, 7, 14, 30, 50, 100]

type QuizEvent = { date: string; score: number; total: number }

// Plus petite date d'une liste (chaîne 'YYYY-MM-DD' → tri lexicographique sûr).
function earliest(dates: readonly string[]): string | null {
  let min: string | null = null
  for (const d of dates) if (min === null || d < min) min = d
  return min
}

// Décale une clé jour UTC de n jours.
function shiftDay(key: string, n: number): string {
  const t = Date.parse(`${key}T00:00:00Z`)
  if (Number.isNaN(t)) return key
  return new Date(t + n * 86_400_000).toISOString().slice(0, 10)
}

// Construit la liste des jalons à partir des événements horodatés de l'élève.
export function computeMilestones(input: {
  quizzes: readonly QuizEvent[]
  lessonDates: readonly string[]
  challengeDates: readonly string[]
  activityDays: readonly string[]
}): Milestone[] {
  const out: Milestone[] = []

  // 1. Premières fois.
  const firstLesson = earliest(input.lessonDates)
  if (firstLesson)
    out.push({ date: firstLesson, kind: 'first', label: 'Première leçon terminée' })
  const firstQuiz = earliest(input.quizzes.map((q) => q.date))
  if (firstQuiz)
    out.push({ date: firstQuiz, kind: 'first', label: 'Premier quiz joué' })
  const firstChallenge = earliest(input.challengeDates)
  if (firstChallenge)
    out.push({ date: firstChallenge, kind: 'first', label: 'Premier défi relevé' })

  // 2. Premier quiz parfait (100 %).
  const firstPerfect = earliest(
    input.quizzes.filter((q) => q.total > 0 && q.score === q.total).map((q) => q.date),
  )
  if (firstPerfect)
    out.push({ date: firstPerfect, kind: 'perfect', label: 'Premier quiz parfait (100 %)' })

  // 3. Paliers de volume de quiz : la date du Nᵉ quiz (ordre chronologique).
  const quizByDate = [...input.quizzes].sort((a, b) => (a.date < b.date ? -1 : 1))
  for (const step of QUIZ_VOLUME_STEPS) {
    if (quizByDate.length >= step) {
      out.push({
        date: quizByDate[step - 1].date,
        kind: 'volume',
        label: `${step} quiz joués`,
      })
    }
  }

  // 4. Paliers de série : la date où la série a ATTEINT chaque palier (première
  // fois). On parcourt les jours d'activité triés et on suit la course en cours.
  const days = [...new Set(input.activityDays)].sort()
  const reachedOn = new Map<number, string>() // palier → date de première atteinte
  let runLen = 0
  let prev: string | null = null
  for (const day of days) {
    runLen = prev !== null && shiftDay(prev, 1) === day ? runLen + 1 : 1
    for (const step of STREAK_STEPS) {
      if (runLen >= step && !reachedOn.has(step)) reachedOn.set(step, day)
    }
    prev = day
  }
  for (const step of STREAK_STEPS) {
    const date = reachedOn.get(step)
    if (date)
      out.push({ date, kind: 'streak', label: `Série de ${step} jours atteinte` })
  }

  // Plus récent d'abord ; à date égale, on garde l'ordre d'insertion (stable).
  return out
    .map((m, i) => ({ m, i }))
    .sort((a, b) => (a.m.date === b.m.date ? a.i - b.i : a.m.date < b.m.date ? 1 : -1))
    .map(({ m }) => m)
    .slice(0, MAX_MILESTONES)
}
