import type { SupabaseClient } from '@supabase/supabase-js'
import { toDayKey } from '@/lib/streak'
import type { Habit, HabitLog, CommuteSlot } from '@/lib/types'

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
  const last7 = new Set<string>()
  for (let i = 0; i < 7; i++) {
    const d = new Date(now)
    d.setUTCDate(d.getUTCDate() - i)
    last7.add(toDayKey(d))
  }
  const byHabit = new Map<string, number>()
  for (const log of logs) {
    if (log.completed && last7.has(log.date)) {
      byHabit.set(log.habit_id, (byHabit.get(log.habit_id) ?? 0) + 1)
    }
  }
  const rates = habits.map((h) => (byHabit.get(h.id) ?? 0) / 7)
  return Math.round((rates.reduce((a, b) => a + b, 0) / habits.length) * 100)
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
  const autoHabits = habits.filter(
    (h) =>
      h.habit_catalog?.validation_type === 'auto_revision' ||
      h.habit_catalog?.validation_type === 'auto_commute',
  )
  if (autoHabits.length === 0) return

  const today = toDayKey(new Date())
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
