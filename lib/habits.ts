import type { SupabaseClient } from '@supabase/supabase-js'
import { toDayKey } from '@/lib/streak'
import { parisHourMinute } from '@/lib/time'
import type { Habit, HabitLog, CommuteSlot } from '@/lib/types'

// -----------------------------------------------------------------------------
// Planification : chaque habitude porte ses jours (0 = lundi … 6 = dimanche)
// et son heure dans habits.target ; repli sur le default_target du catalogue,
// puis sur « tous les jours ».
// -----------------------------------------------------------------------------

const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6]

// Mission fixe pour tous : « Planifier ma semaine » (dimanche).
export const PLANIFIER_CATALOG_ID = '55555555-5555-4555-8555-555555555509'

// Habitude « Révision quotidienne » (auto-validée dès qu'une session est faite).
export const REVISION_CATALOG_ID = '55555555-5555-4555-8555-555555555502'

// Habitude « Test sur trajets » (auto-validée quand un quiz/défi est joué
// pendant un créneau de trajet). Voir supabase/010_moi.sql.
export const COMMUTE_CATALOG_ID = '55555555-5555-4555-8555-555555555503'

// Les 4 tables qui comptent comme « session de travail » (série, temps, révision).
export const SESSION_TABLES = [
  'test_sessions',
  'study_sessions',
  'lesson_completions',
  'challenge_sessions',
] as const

export function habitDays(habit: Habit): number[] {
  const own = (habit.target as { days?: unknown }).days
  if (Array.isArray(own) && own.length > 0) return own.map(Number)
  const def = (habit.habit_catalog?.default_target as { days?: unknown })?.days
  if (Array.isArray(def) && def.length > 0) return def.map(Number)
  return ALL_DAYS
}

export function habitTime(habit: Habit): string | null {
  const own = (habit.target as { time?: unknown }).time
  if (typeof own === 'string' && own) return own
  const def = (habit.habit_catalog?.default_target as { time?: unknown })?.time
  return typeof def === 'string' && def ? def : null
}

// Heure pour un jour précis : target.times['0'..'6'] prime sur l'heure globale.
// (La semaine type permet « basket lundi 18:00, mercredi 17:30 ».)
export function habitTimeForDay(habit: Habit, day: number): string | null {
  const times = (habit.target as { times?: unknown }).times
  if (times && typeof times === 'object') {
    const t = (times as Record<string, unknown>)[String(day)]
    if (typeof t === 'string' && t) return t
  }
  return habitTime(habit)
}

// Durée prévue d'un événement (en minutes) : target.duration prime, sinon le
// default_target du catalogue (minutes), sinon 10 min.
export function habitDuration(habit: Habit): number {
  const own = (habit.target as { duration?: unknown }).duration
  if (typeof own === 'number' && own > 0) return own
  const def = (habit.habit_catalog?.default_target as { minutes?: unknown })
    ?.minutes
  if (typeof def === 'number' && def > 0) return def
  return 10
}

// Index du jour (0 = lundi) pour une clé 'YYYY-MM-DD'.
export function dayIndexOf(dayKey: string): number {
  return (new Date(`${dayKey}T12:00:00Z`).getUTCDay() + 6) % 7
}

// -----------------------------------------------------------------------------
// Créneaux de trajet : un horodatage tombe-t-il dans un créneau (heure locale
// de l'élève) ? Les créneaux sont saisis en heure française — on convertit
// explicitement en Europe/Paris, car ce code tourne sur un serveur en UTC.
// -----------------------------------------------------------------------------

export function isInCommuteSlot(
  timestamp: string,
  slots: CommuteSlot[],
): boolean {
  const d = new Date(timestamp)
  if (Number.isNaN(d.getTime())) return false
  const { hour: h, minute: m } = parisHourMinute(d)
  const minutes = h * 60 + m
  return slots.some((slot) => {
    const [sh, sm] = slot.start.split(':').map(Number)
    const [eh, em] = slot.end.split(':').map(Number)
    if ([sh, sm, eh, em].some((n) => Number.isNaN(n))) return false
    return minutes >= sh * 60 + sm && minutes <= eh * 60 + em
  })
}

// -----------------------------------------------------------------------------
// Auto-validation « à la volée » : au chargement de /moi, on (re)calcule les
// logs du jour pour les habitudes automatiques à partir des sessions réelles.
// -----------------------------------------------------------------------------

/** Une ligne d'horodatage de session, telle que lue en base. */
export type SessionStamp = { created_at: unknown }

/** Les sessions de l'élève, déjà chargées par la page appelante. */
export type SessionsByKind = {
  tests: ReadonlyArray<SessionStamp>
  studies: ReadonlyArray<SessionStamp>
  lessons: ReadonlyArray<SessionStamp>
  challenges: ReadonlyArray<SessionStamp>
}

/** Ligne de `habit_logs` à écrire pour une habitude auto-validée. */
export type AutoHabitLog = {
  habit_id: string
  user_id: string
  date: string
  completed: boolean
  auto_validated: true
}

// Décision pure : quelles habitudes automatiques sont validées aujourd'hui, au
// vu des sessions de la journée. Isolée de l'accès base pour être testable —
// c'est ici que vit la règle, `syncAutoHabits` ne fait plus que l'écrire.
export function autoHabitLogs(
  userId: string,
  habits: Habit[],
  commuteSlots: CommuteSlot[],
  sessions: SessionsByKind,
  today: string,
): AutoHabitLog[] {
  const todayIdx = dayIndexOf(today)
  const autoHabits = habits.filter(
    (h) =>
      (h.habit_catalog?.validation_type === 'auto_revision' ||
        h.habit_catalog?.validation_type === 'auto_commute') &&
      habitDays(h).includes(todayIdx), // seulement si planifiée aujourd'hui
  )
  if (autoHabits.length === 0) return []

  // Les listes reçues couvrent TOUT l'historique (la page les charge déjà pour
  // ses statistiques) : on retient la journée en cours. Comparaison par clé de
  // jour UTC plutôt que sur la chaîne brute, dont le format varie selon la base.
  const isToday = (r: SessionStamp) => {
    const d = new Date(String(r.created_at))
    return !Number.isNaN(d.getTime()) && toDayKey(d) === today
  }
  const testsToday = sessions.tests.filter(isToday)
  const challengesToday = sessions.challenges.filter(isToday)
  const sessionsToday =
    testsToday.length +
    sessions.studies.filter(isToday).length +
    sessions.lessons.filter(isToday).length +
    challengesToday.length

  // Quiz OU défi joué pendant un trajet : les deux comptent — l'objectif est
  // « se tester pendant le trajet », peu importe le format.
  const commuteQuizToday = [...testsToday, ...challengesToday].some((t) =>
    isInCommuteSlot(String(t.created_at), commuteSlots),
  )

  return autoHabits.map((h) => {
    const type = h.habit_catalog?.validation_type
    const target = Number(
      (h.target as { sessions?: unknown }).sessions ??
        (h.habit_catalog?.default_target as { sessions?: unknown })?.sessions ??
        1,
    )
    const completed =
      type === 'auto_revision'
        ? sessionsToday >= Math.max(target, 1)
        : commuteQuizToday
    return {
      habit_id: h.id,
      user_id: userId,
      date: today,
      completed,
      auto_validated: true as const,
    }
  })
}

// Écrit les validations automatiques du jour. Les sessions sont FOURNIES par
// l'appelant : /moi les a déjà chargées pour ses statistiques, les redemander
// coûtait 4 allers-retours réseau en SÉRIE après le chargement parallèle.
export async function syncAutoHabits(
  supabase: SupabaseClient,
  userId: string,
  habits: Habit[],
  commuteSlots: CommuteSlot[],
  sessions: SessionsByKind,
): Promise<void> {
  const rows = autoHabitLogs(
    userId,
    habits,
    commuteSlots,
    sessions,
    toDayKey(new Date()),
  )
  if (rows.length === 0) return

  await supabase
    .from('habit_logs')
    .upsert(rows, { onConflict: 'habit_id,date' })
}

// -----------------------------------------------------------------------------
// Validation immédiate de la révision : appelée à la fin de chaque session
// (quiz, flashcards, défi, leçon) pour cocher « Révision quotidienne » du jour
// sans attendre le prochain chargement de /moi.
// -----------------------------------------------------------------------------

// Nombre de sessions de travail réalisées aujourd'hui (tous types confondus).
export async function countSessionsToday(
  supabase: SupabaseClient,
  userId: string,
): Promise<number> {
  const dayStart = `${toDayKey(new Date())}T00:00:00Z`
  const results = await Promise.all(
    SESSION_TABLES.map((table) =>
      supabase
        .from(table)
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', dayStart),
    ),
  )
  return results.reduce((sum, r) => sum + (r.count ?? 0), 0)
}

export async function validateRevisionToday(
  supabase: SupabaseClient,
  userId: string,
): Promise<void> {
  // L'habitude « Révision quotidienne » doit être activée par l'élève.
  const { data: habit } = await supabase
    .from('habits')
    .select('id, catalog_id, target, created_at, habit_catalog(*)')
    .eq('user_id', userId)
    .eq('catalog_id', REVISION_CATALOG_ID)
    .maybeSingle<Habit>()
  if (!habit) return

  const today = toDayKey(new Date())
  if (!habitDays(habit).includes(dayIndexOf(today))) return // pas prévue ce jour

  const target = Number(
    (habit.target as { sessions?: unknown }).sessions ??
      (habit.habit_catalog?.default_target as { sessions?: unknown })?.sessions ??
      1,
  )
  const sessions = await countSessionsToday(supabase, userId)
  if (sessions < Math.max(target, 1)) return

  await supabase.from('habit_logs').upsert(
    {
      habit_id: habit.id,
      user_id: userId,
      date: today,
      completed: true,
      auto_validated: true,
    },
    { onConflict: 'habit_id,date' },
  )
}

// Coche « Test sur trajets » du jour dès qu'un quiz/défi est joué pendant un
// créneau de trajet — sans attendre le prochain chargement de /moi. Sinon un
// élève qui se teste en trajet mais n'ouvre pas Moi ce jour-là voit sa journée
// mal classée dans « Ma discipline » et son record « habitude ancrée »
// sous-compté. `slots` est réutilisé quand l'appelant les a déjà chargés (Défi) ;
// sinon on les lit du profil. La fonction s'auto-garde (créneau actif requis) et
// l'upsert par (habit, jour) est idempotent — même clé que syncAutoHabits, donc
// aucun double comptage.
export async function validateCommuteToday(
  supabase: SupabaseClient,
  userId: string,
  slots?: CommuteSlot[],
): Promise<void> {
  let commuteSlots = slots
  if (!commuteSlots) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('commute_slots')
      .eq('id', userId)
      .maybeSingle()
    commuteSlots = Array.isArray(profile?.commute_slots)
      ? (profile.commute_slots as CommuteSlot[])
      : []
  }
  if (!isInCommuteSlot(new Date().toISOString(), commuteSlots)) return

  const { data: habit } = await supabase
    .from('habits')
    .select('id, catalog_id, target, created_at, habit_catalog(*)')
    .eq('user_id', userId)
    .eq('catalog_id', COMMUTE_CATALOG_ID)
    .maybeSingle<Habit>()
  if (!habit) return

  const today = toDayKey(new Date())
  if (!habitDays(habit).includes(dayIndexOf(today))) return // pas prévue ce jour

  await supabase.from('habit_logs').upsert(
    {
      habit_id: habit.id,
      user_id: userId,
      date: today,
      completed: true,
      auto_validated: true,
    },
    { onConflict: 'habit_id,date' },
  )
}

// -----------------------------------------------------------------------------
// Records
// -----------------------------------------------------------------------------

export function longestRun(dayKeys: Set<string>): number {
  let best = 0
  for (const key of dayKeys) {
    const prev = new Date(`${key}T00:00:00Z`)
    prev.setUTCDate(prev.getUTCDate() - 1)
    if (dayKeys.has(toDayKey(prev))) continue // pas un début de série
    let length = 0
    const cursor = new Date(`${key}T00:00:00Z`)
    while (dayKeys.has(toDayKey(cursor))) {
      length += 1
      cursor.setUTCDate(cursor.getUTCDate() + 1)
    }
    best = Math.max(best, length)
  }
  return best
}

// Plus longue habitude ancrée : meilleure série de logs complétés, toutes
// habitudes confondues. Renvoie aussi le nom de l'habitude.
export function longestAnchored(
  habits: Habit[],
  logs: HabitLog[],
): { days: number; title: string | null } {
  let best = { days: 0, title: null as string | null }
  for (const habit of habits) {
    const days = new Set(
      logs.filter((l) => l.habit_id === habit.id && l.completed).map((l) => l.date),
    )
    const run = longestRun(days)
    if (run > best.days) {
      best = { days: run, title: habit.habit_catalog?.title ?? null }
    }
  }
  return best
}
