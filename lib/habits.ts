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

// Index du jour (0 = lundi) pour une clé 'YYYY-MM-DD'.
export function dayIndexOf(dayKey: string): number {
  return (new Date(`${dayKey}T12:00:00Z`).getUTCDay() + 6) % 7
}

// -----------------------------------------------------------------------------
// Score de structure : moyenne des taux de complétion des habitudes actives
// sur les 7 derniers jours (0-100).
// -----------------------------------------------------------------------------

export function structureScore(
  habits: Habit[],
  logs: HabitLog[],
  now = new Date(),
): number {
  if (habits.length === 0) return 0
  const last7: string[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(now)
    d.setUTCDate(d.getUTCDate() - i)
    last7.push(toDayKey(d))
  }
  const completed = new Set(
    logs.filter((l) => l.completed).map((l) => `${l.habit_id}|${l.date}`),
  )

  // Taux = jours réussis / jours PLANIFIÉS sur la semaine écoulée.
  const rates: number[] = []
  for (const habit of habits) {
    const days = habitDays(habit)
    const scheduled = last7.filter((key) => days.includes(dayIndexOf(key)))
    if (scheduled.length === 0) continue
    const done = scheduled.filter((key) =>
      completed.has(`${habit.id}|${key}`),
    ).length
    rates.push(done / scheduled.length)
  }
  if (rates.length === 0) return 0
  return Math.round((rates.reduce((a, b) => a + b, 0) / rates.length) * 100)
}

export function structureLabel(score: number): string {
  if (score >= 80) return 'Structure solide'
  if (score >= 60) return 'Bonne base'
  if (score >= 40) return 'À renforcer'
  if (score > 0) return 'En construction'
  return 'On commence ?'
}

// -----------------------------------------------------------------------------
// Créneaux de trajet : un horodatage tombe-t-il dans un créneau (heure locale) ?
// -----------------------------------------------------------------------------

export function isInCommuteSlot(
  timestamp: string,
  slots: CommuteSlot[],
): boolean {
  const d = new Date(timestamp)
  const minutes = d.getHours() * 60 + d.getMinutes()
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

  const [{ data: tests }, { data: studies }, { data: lessons }, { data: challenges }] =
    await Promise.all([
      supabase
        .from('test_sessions')
        .select('created_at')
        .gte('created_at', dayStart),
      supabase
        .from('study_sessions')
        .select('created_at')
        .gte('created_at', dayStart),
      supabase
        .from('lesson_completions')
        .select('created_at')
        .gte('created_at', dayStart),
      supabase
        .from('challenge_sessions')
        .select('created_at')
        .gte('created_at', dayStart),
    ])

  const sessionsToday =
    (tests?.length ?? 0) +
    (studies?.length ?? 0) +
    (lessons?.length ?? 0) +
    (challenges?.length ?? 0)
  const commuteQuizToday = (tests ?? []).some((t) =>
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
