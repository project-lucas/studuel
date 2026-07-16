// -----------------------------------------------------------------------------
// « Bilan de la semaine » — la rétro hebdo de l'onglet Moi : un récap narratif à
// superlatifs de la semaine en cours (sessions, jours actifs, moyenne aux quiz,
// jour le plus actif), avec une comparaison à la semaine précédente. Distinct de
// StructureChart (courbe 8 semaines) : ici on résume la semaine COURANTE en
// chiffres parlants. Logique pure et testable (convention projet).
//
// Dates : clés UTC 'YYYY-MM-DD', semaine commençant lundi (cf. lib/time.ts).
// -----------------------------------------------------------------------------

export type WeeklyRecap = {
  sessions: number // sessions jouées cette semaine
  sessionsDelta: number // écart vs la semaine précédente (peut être négatif)
  activeDays: number // jours distincts avec ≥ 1 session (0..7)
  quizCount: number // quiz notés joués cette semaine
  quizAvg: number | null // moyenne des quiz en % (null si aucun quiz)
  bestDay: { index: number; count: number } | null // jour le + actif (0 = lundi)
  headline: string // accroche adaptative à l'état de la semaine
}

// Décale une clé jour UTC de n jours (n peut être négatif). Clé invalide → telle
// quelle (dégradé sûr).
function shiftDay(key: string, n: number): string {
  const t = Date.parse(`${key}T00:00:00Z`)
  if (Number.isNaN(t)) return key
  return new Date(t + n * 86_400_000).toISOString().slice(0, 10)
}

// Les 7 clés jour d'une semaine à partir de son lundi (lundi → dimanche).
function weekKeys(mondayKey: string): string[] {
  return Array.from({ length: 7 }, (_, i) => shiftDay(mondayKey, i))
}

// ≥ ce nombre de jours actifs → on félicite le rythme.
const GOOD_RHYTHM_DAYS = 5

// Calcule le bilan de la semaine dont `weekStartKey` est le lundi, à partir des
// sessions (une entrée par session, clé jour) et des quiz notés de l'élève. Les
// listes peuvent couvrir plusieurs semaines : on filtre sur la semaine visée et
// la précédente pour l'écart.
export function computeWeeklyRecap(
  weekStartKey: string,
  sessionDates: readonly string[],
  quizzes: readonly { date: string; score: number; total: number }[],
): WeeklyRecap {
  const week = new Set(weekKeys(weekStartKey))
  const prevWeek = new Set(weekKeys(shiftDay(weekStartKey, -7)))
  const weekOrder = weekKeys(weekStartKey) // index 0 = lundi

  // Sessions de la semaine et de la précédente + décompte par jour.
  const perDay = new Array<number>(7).fill(0)
  let sessions = 0
  let prevSessions = 0
  for (const d of sessionDates) {
    if (week.has(d)) {
      sessions += 1
      const idx = weekOrder.indexOf(d)
      if (idx >= 0) perDay[idx] += 1
    } else if (prevWeek.has(d)) {
      prevSessions += 1
    }
  }

  const activeDays = perDay.filter((n) => n > 0).length

  // Jour le plus actif (le premier en cas d'égalité, déterministe).
  let bestDay: WeeklyRecap['bestDay'] = null
  for (let i = 0; i < 7; i++) {
    if (perDay[i] > 0 && (bestDay === null || perDay[i] > bestDay.count)) {
      bestDay = { index: i, count: perDay[i] }
    }
  }

  // Moyenne aux quiz de la semaine (quiz notés uniquement).
  const weekQuizzes = quizzes.filter((q) => q.total > 0 && week.has(q.date))
  const quizAvg =
    weekQuizzes.length > 0
      ? Math.round(
          (weekQuizzes.reduce((s, q) => s + q.score / q.total, 0) /
            weekQuizzes.length) *
            100,
        )
      : null

  const sessionsDelta = sessions - prevSessions

  return {
    sessions,
    sessionsDelta,
    activeDays,
    quizCount: weekQuizzes.length,
    quizAvg,
    bestDay,
    headline: recapHeadline(sessions, sessionsDelta, activeDays),
  }
}

// Accroche qui s'adapte à l'état réel de la semaine.
function recapHeadline(
  sessions: number,
  delta: number,
  activeDays: number,
): string {
  if (sessions === 0) {
    return 'Une nouvelle semaine démarre — lance ta première session !'
  }
  if (delta > 0) {
    const plur = delta > 1 ? 'sessions' : 'session'
    return `Belle progression — ${delta} ${plur} de plus que la semaine dernière.`
  }
  if (activeDays >= GOOD_RHYTHM_DAYS) {
    return `${activeDays} jours actifs cette semaine — tu tiens le rythme !`
  }
  return 'Continue sur ta lancée, chaque session compte.'
}
