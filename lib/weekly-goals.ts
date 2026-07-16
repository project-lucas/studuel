// -----------------------------------------------------------------------------
// « Objectifs perso de la semaine » — l'élève se fixe 1 à 3 objectifs libres pour
// la semaine (ex. « 3 sessions de maths », « finir le chapitre Fonctions »), les
// coche, et la liste se remet à zéro chaque lundi. Stockée dans
// profiles.weekly_goals (migration 157). Chaque objectif porte la clé du lundi de
// sa semaine → le filtrage par semaine courante donne le reset hebdo sans cron.
// Logique pure et testable (convention projet).
//
// Dates : clés UTC 'YYYY-MM-DD', semaine commençant lundi (cf. lib/time.ts).
// -----------------------------------------------------------------------------

// 1 à 3 objectifs par semaine (garde-fou partagé avec la migration 157).
export const MAX_WEEKLY_GOALS = 3

export type WeeklyGoal = {
  id: string // uuid généré en base à l'ajout
  text: string // libellé libre de l'objectif
  done: boolean // coché ?
  week: string // clé du lundi de la semaine de l'objectif
}

const isDayKey = (v: unknown): v is string =>
  typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v)

const isNonEmpty = (v: unknown, max = 200): v is string =>
  typeof v === 'string' && v.trim().length > 0 && v.length <= max

// Clé du lundi de la semaine de `now` (UTC, lundi = début de semaine).
export function currentWeekStart(now: Date = new Date()): string {
  const monday = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  )
  monday.setUTCDate(monday.getUTCDate() - ((monday.getUTCDay() + 6) % 7))
  return monday.toISOString().slice(0, 10)
}

// Valide/normalise une valeur brute (JSON de la base) en WeeklyGoal, ou null.
export function normalizeWeeklyGoal(raw: unknown): WeeklyGoal | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  if (!isNonEmpty(o.id, 100) || !isNonEmpty(o.text) || !isDayKey(o.week)) {
    return null
  }
  return {
    id: o.id,
    text: (o.text as string).trim(),
    done: o.done === true,
    week: o.week,
  }
}

// Normalise une valeur brute (JSONB de la base) en liste d'objectifs valides :
// jette les entrées invalides, dédoublonne par id (dernier gagne). La borne
// s'applique par SEMAINE (cf. addWeeklyGoal), pas globalement.
export function normalizeWeeklyGoalsList(raw: unknown): WeeklyGoal[] {
  if (!Array.isArray(raw)) return []
  const byId = new Map<string, WeeklyGoal>()
  for (const entry of raw) {
    const g = normalizeWeeklyGoal(entry)
    if (g) byId.set(g.id, g)
  }
  return [...byId.values()]
}

// Les objectifs d'une semaine donnée (celle de `weekStart`).
export function goalsForWeek(
  list: WeeklyGoal[],
  weekStart: string,
): WeeklyGoal[] {
  return list.filter((g) => g.week === weekStart)
}

// Ajoute un objectif : purge d'abord les objectifs des AUTRES semaines (reset
// hebdo + stockage borné), refuse au-delà de MAX pour la semaine visée. Nouvelle
// liste (immutabilité).
export function addWeeklyGoal(
  list: WeeklyGoal[],
  goal: WeeklyGoal,
): WeeklyGoal[] {
  const thisWeek = list.filter((g) => g.week === goal.week && g.id !== goal.id)
  if (thisWeek.length >= MAX_WEEKLY_GOALS) return list
  return [...thisWeek, goal]
}

// Bascule l'état coché d'un objectif. Nouvelle liste.
export function toggleWeeklyGoal(list: WeeklyGoal[], id: string): WeeklyGoal[] {
  return list.map((g) => (g.id === id ? { ...g, done: !g.done } : g))
}

// Retire un objectif. Nouvelle liste.
export function removeWeeklyGoal(list: WeeklyGoal[], id: string): WeeklyGoal[] {
  return list.filter((g) => g.id !== id)
}

// Avancement des objectifs d'une semaine : { done, total }.
export function weeklyGoalsProgress(
  list: WeeklyGoal[],
  weekStart: string,
): { done: number; total: number } {
  const week = goalsForWeek(list, weekStart)
  return { done: week.filter((g) => g.done).length, total: week.length }
}
