// -----------------------------------------------------------------------------
// « À revoir aujourd'hui » — le moteur de révision espacée de Mon carnet.
//
// Le carnet enregistre déjà chaque tentative (carnet_review_attempts) ; ce
// module en déduit QUELLES questions sont dues aujourd'hui, pour que l'accueil
// du carnet propose UNE session (le héros « À revoir ») au lieu d'une liste
// muette — la mécanique de lib/mission appliquée aux questions de l'élève.
//
// Règle (mêmes paliers que le SRS du programme, J+1 → J+35) :
//   • jamais tentée → due ;
//   • dernier essai FAUX → due (on corrige tout de suite) ;
//   • dernier essai juste → due après un délai qui grandit avec la suite de
//     bonnes réponses consécutives : 1, 3, 7, 14 puis 35 jours.
//
// Jours = clés UTC 'YYYY-MM-DD' (convention projet). Pur et testable.
// -----------------------------------------------------------------------------

/** Paliers de révision (en jours) selon la suite de bonnes réponses. */
export const REVOIR_INTERVALS = [1, 3, 7, 14, 35] as const

/** Une question candidate (déjà filtrée : complète/jouable). */
export type RevoirQuestion = {
  id: string
  courseId: string
}

/** Une tentative telle que stockée (l'ordre d'arrivée n'importe pas). */
export type RevoirAttempt = {
  questionId: string
  isCorrect: boolean
  /** Horodatage ISO (answered_at). */
  answeredAt: string
}

const DAY_MS = 86_400_000

/** Clé jour UTC d'un horodatage ISO — '' si illisible. */
function dayOf(iso: string): string {
  const t = Date.parse(iso)
  return Number.isNaN(t) ? '' : new Date(t).toISOString().slice(0, 10)
}

/** Écart en jours entre deux clés UTC (b - a). NaN-safe : 0 si illisible. */
function daysBetween(a: string, b: string): number {
  const ta = Date.parse(`${a}T00:00:00Z`)
  const tb = Date.parse(`${b}T00:00:00Z`)
  if (Number.isNaN(ta) || Number.isNaN(tb)) return 0
  return Math.round((tb - ta) / DAY_MS)
}

/**
 * Une question est-elle due aujourd'hui, au vu de ses tentatives (triées ou
 * non) ? Exposée pour les tests ; les appelants passent par `revoirSummary`.
 */
export function isQuestionDue(
  attempts: readonly RevoirAttempt[],
  today: string,
): boolean {
  if (attempts.length === 0) return true
  const sorted = [...attempts].sort((a, b) =>
    a.answeredAt < b.answeredAt ? -1 : a.answeredAt > b.answeredAt ? 1 : 0,
  )
  const last = sorted[sorted.length - 1]
  if (!last.isCorrect) return true

  // Longueur de la suite de bonnes réponses qui termine l'historique.
  let streak = 0
  for (let i = sorted.length - 1; i >= 0 && sorted[i].isCorrect; i--) streak++

  const interval =
    REVOIR_INTERVALS[Math.min(streak - 1, REVOIR_INTERVALS.length - 1)]
  const lastDay = dayOf(last.answeredAt)
  if (lastDay.length === 0) return true
  return daysBetween(lastDay, today) >= interval
}

export type RevoirSummary = {
  /** Ids des questions dues, dans l'ordre du tableau `questions` reçu. */
  dueIds: string[]
  /** Nombre de questions dues par cours (les cours à 0 n'y figurent pas). */
  dueByCourse: Map<string, number>
  total: number
}

/**
 * Le bilan « à revoir » : questions dues aujourd'hui parmi `questions`,
 * comptées par cours. C'est la donnée du héros du carnet.
 */
export function revoirSummary(
  questions: readonly RevoirQuestion[],
  attempts: readonly RevoirAttempt[],
  today: string,
): RevoirSummary {
  const byQuestion = new Map<string, RevoirAttempt[]>()
  for (const a of attempts) {
    const list = byQuestion.get(a.questionId)
    if (list) list.push(a)
    else byQuestion.set(a.questionId, [a])
  }

  const dueIds: string[] = []
  const dueByCourse = new Map<string, number>()
  for (const q of questions) {
    if (!isQuestionDue(byQuestion.get(q.id) ?? [], today)) continue
    dueIds.push(q.id)
    dueByCourse.set(q.courseId, (dueByCourse.get(q.courseId) ?? 0) + 1)
  }
  return { dueIds, dueByCourse, total: dueIds.length }
}

/** Durée annoncée d'une session « à revoir » : ~30 s par question, min 1 min. */
export function revoirMinutes(questionCount: number): number {
  if (questionCount <= 0) return 0
  return Math.max(1, Math.round(questionCount / 2))
}

/**
 * Couronnes de maîtrise d'un cours (0 → 3), à partir des questions maîtrisées
 * (dernier essai juste) sur le total de questions jouables. Même vocabulaire
 * que les couronnes de leçon : 3 = tout est su, 0 = on démarre.
 */
export function crownsForCourse(mastered: number, total: number): 0 | 1 | 2 | 3 {
  if (total <= 0) return 0
  const ratio = Math.max(0, Math.min(1, mastered / total))
  if (ratio >= 1) return 3
  if (ratio >= 2 / 3) return 2
  if (ratio >= 1 / 3) return 1
  return 0
}
