import type { SupabaseClient } from '@supabase/supabase-js'
import { toDayKey } from '@/lib/streak'
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

const PARIS_TIME = new Intl.DateTimeFormat('fr-FR', {
  timeZone: 'Europe/Paris',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23', // jamais « 24:xx » à minuit
})

export function isInCommuteSlot(
  timestamp: string,
  slots: CommuteSlot[],
): boolean {
  const d = new Date(timestamp)
  if (Number.isNaN(d.getTime())) return false
  const [h, m] = PARIS_TIME.format(d).split(':').map(Number)
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

export async function syncAutoHabits(
  supabase: SupabaseClient,
  userId: string,
  habits: Habit[],
  commuteSlots: CommuteSlot[],
): Promise<void> {
  const today = toDayKey(new Date())
  const todayIdx = dayIndexOf(today)
  const autoHabits = habits.filter(
    (h) =>
      (h.habit_catalog?.validation_type === 'auto_revision' ||
        h.habit_catalog?.validation_type === 'auto_commute') &&
      habitDays(h).includes(todayIdx), // seulement si planifiée aujourd'hui
  )
  if (autoHabits.length === 0) return
  const dayStart = `${today}T00:00:00Z`

  // user_id explicite : la RLS le garantit aujourd'hui, mais la couche sociale
  // ouvrira la lecture croisée des sessions — ces comptes doivent rester à soi.
  const [{ data: tests }, { data: studies }, { data: lessons }, { data: challenges }] =
    await Promise.all([
      supabase
        .from('test_sessions')
        .select('created_at')
        .eq('user_id', userId)
        .gte('created_at', dayStart),
      supabase
        .from('study_sessions')
        .select('created_at')
        .eq('user_id', userId)
        .gte('created_at', dayStart),
      supabase
        .from('lesson_completions')
        .select('created_at')
        .eq('user_id', userId)
        .gte('created_at', dayStart),
      supabase
        .from('challenge_sessions')
        .select('created_at')
        .eq('user_id', userId)
        .gte('created_at', dayStart),
    ])

  const sessionsToday =
    (tests?.length ?? 0) +
    (studies?.length ?? 0) +
    (lessons?.length ?? 0) +
    (challenges?.length ?? 0)
  // Quiz OU défi joué pendant un trajet : les deux comptent — l'objectif est
  // « se tester pendant le trajet », peu importe le format.
  const commuteQuizToday = [...(tests ?? []), ...(challenges ?? [])].some((t) =>
    isInCommuteSlot(String(t.created_at), commuteSlots),
  )

  const rows = autoHabits.map((h) => {
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
      auto_validated: true,
    }
  })

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
