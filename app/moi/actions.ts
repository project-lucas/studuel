'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { habitDays, PLANIFIER_CATALOG_ID } from '@/lib/habits'
import { CAPACITY_QUESTIONS, computeCapacity } from '@/lib/capacity'
import { isDebriefOutcome, isDebriefPairId } from '@/lib/debrief'
import { toDayKey } from '@/lib/streak'
import type { CommuteSlot, Habit } from '@/lib/types'

const isTimeStr = (v: unknown): v is string =>
  typeof v === 'string' && /^\d{2}:\d{2}$/.test(v)

// target.times nettoyé : { '0'..'6' → 'HH:MM' }.
function habitTimes(target: Record<string, unknown>): Record<string, string> {
  const raw = target.times
  const clean: Record<string, string> = {}
  if (raw && typeof raw === 'object') {
    for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
      if (isTimeStr(v)) clean[k] = v
    }
  }
  return clean
}

async function requireUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return { supabase, userId: user?.id ?? null }
}

// Durée valide en minutes (1..600), sinon null.
const cleanMinutes = (v: unknown): number | null => {
  const n = Number(v)
  return Number.isFinite(n) && n > 0 && n <= 600 ? Math.round(n) : null
}

// Semaine type : ajoute un événement (mission, jour, heure, durée). Active la
// mission si besoin, sinon ajoute le jour + son heure à sa planification.
export async function addEvent(
  catalogId: string,
  day: number,
  time: string | null,
  duration: number | null = null,
): Promise<void> {
  const { supabase, userId } = await requireUser()
  if (!userId || !Number.isInteger(day) || day < 0 || day > 6) return
  const cleanTime = isTimeStr(time) ? time : null
  const dur = cleanMinutes(duration)

  const { data: existing } = await supabase
    .from('habits')
    .select('id, catalog_id, target, created_at, habit_catalog(*)')
    .eq('user_id', userId)
    .eq('catalog_id', catalogId)
    .maybeSingle<Habit>()

  if (!existing) {
    const { data: entry } = await supabase
      .from('habit_catalog')
      .select('id, default_target')
      .eq('id', catalogId)
      .maybeSingle()
    if (!entry) return
    const target: Record<string, unknown> = {
      ...((entry.default_target as Record<string, unknown> | null) ?? {}),
      days: [day],
    }
    if (cleanTime) target.times = { [String(day)]: cleanTime }
    if (dur !== null) target.duration = dur
    await supabase
      .from('habits')
      .insert({ user_id: userId, catalog_id: catalogId, target })
  } else {
    const target = existing.target as Record<string, unknown>
    const days = Array.from(new Set([...habitDays(existing), day])).sort()
    const times = habitTimes(target)
    if (cleanTime) times[String(day)] = cleanTime
    else delete times[String(day)]
    const next: Record<string, unknown> = { ...target, days, times }
    if (dur !== null) next.duration = dur
    await supabase
      .from('habits')
      .update({ target: next })
      .eq('id', existing.id)
      .eq('user_id', userId)
  }
  revalidatePath('/moi')
}

// Semaine type : change la durée prévue d'un événement (minutes).
export async function setEventDuration(
  habitId: string,
  minutes: number,
): Promise<void> {
  const { supabase, userId } = await requireUser()
  const dur = cleanMinutes(minutes)
  if (!userId || dur === null) return

  const { data: habit } = await supabase
    .from('habits')
    .select('id, target')
    .eq('id', habitId)
    .eq('user_id', userId)
    .maybeSingle<Habit>()
  if (!habit) return

  const target = (habit.target as Record<string, unknown>) ?? {}
  await supabase
    .from('habits')
    .update({ target: { ...target, duration: dur } })
    .eq('id', habitId)
    .eq('user_id', userId)
  revalidatePath('/moi')
}

// Semaine type : retire un événement (un jour d'une mission). Plus aucun jour
// → la mission est désactivée. La mission fixe Scolaria ne bouge pas.
export async function removeEvent(habitId: string, day: number): Promise<void> {
  const { supabase, userId } = await requireUser()
  if (!userId || !Number.isInteger(day)) return

  const { data: habit } = await supabase
    .from('habits')
    .select('id, catalog_id, target, created_at, habit_catalog(*)')
    .eq('id', habitId)
    .eq('user_id', userId)
    .maybeSingle<Habit>()
  if (!habit || habit.catalog_id === PLANIFIER_CATALOG_ID) return

  const days = habitDays(habit).filter((d) => d !== day)
  if (days.length === 0) {
    await supabase
      .from('habits')
      .delete()
      .eq('id', habitId)
      .eq('user_id', userId)
  } else {
    const target = habit.target as Record<string, unknown>
    const times = habitTimes(target)
    delete times[String(day)]
    await supabase
      .from('habits')
      .update({ target: { ...target, days, times } })
      .eq('id', habitId)
      .eq('user_id', userId)
  }
  revalidatePath('/moi')
}

// Check manuel du jour (sommeil, sport, lecture…).
export async function toggleHabitLog(
  habitId: string,
  date: string,
  completed: boolean,
): Promise<void> {
  const { supabase, userId } = await requireUser()
  if (!userId || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return

  // L'habitude doit appartenir à l'utilisateur (la RLS de habit_logs ne
  // contrôle que user_id, pas la propriété de habit_id).
  const { data: habit } = await supabase
    .from('habits')
    .select('id')
    .eq('id', habitId)
    .eq('user_id', userId)
    .maybeSingle()
  if (!habit) return

  await supabase.from('habit_logs').upsert(
    {
      habit_id: habitId,
      user_id: userId,
      date,
      completed,
      auto_validated: false,
    },
    { onConflict: 'habit_id,date' },
  )
  revalidatePath('/moi')
}

// Bilan de capacités : réponses du questionnaire (0 = Jamais … 3 = Toujours),
// score en % stocké sur le profil. Voir supabase/013_capacite.sql.
export async function saveCapacityQuiz(
  answers: Record<string, number>,
): Promise<void> {
  const { supabase, userId } = await requireUser()
  if (!userId) return

  const clean: Record<string, number> = {}
  for (const q of CAPACITY_QUESTIONS) {
    const v = answers[q.id]
    if (Number.isInteger(v) && v >= 0 && v <= 3) clean[q.id] = v
  }
  if (Object.keys(clean).length === 0) return

  const { error } = await supabase
    .from('profiles')
    .update({
      capacity_quiz: {
        answers: clean,
        score: computeCapacity(clean),
        date: toDayKey(new Date()),
      },
    })
    .eq('id', userId)
  // Un GRANT UPDATE manquant (cf. 016_capacite_grant.sql) échoue sans throw :
  // on le loggue pour ne plus jamais perdre un bilan en silence.
  if (error) console.error('[moi] bilan de capacités non enregistré:', error.message)
  revalidatePath('/moi')
}

// Débrief d'habitudes : remplace la sélection des habitudes-freins référencées
// par l'élève (catalogue fermé lib/debrief.ts). Les logs des jours passés
// restent — l'historique n'est pas réécrit. Voir supabase/027_debrief.sql.
export async function saveDebriefHabits(pairIds: string[]): Promise<void> {
  const { supabase, userId } = await requireUser()
  if (!userId || !Array.isArray(pairIds)) return

  const valid = [...new Set(pairIds.filter((id) => isDebriefPairId(id)))]
  await supabase.from('debrief_habits').delete().eq('user_id', userId)
  if (valid.length > 0) {
    const { error } = await supabase
      .from('debrief_habits')
      .insert(valid.map((pair_id) => ({ user_id: userId, pair_id })))
    if (error) console.error('[moi] débrief non enregistré:', error.message)
  }
  revalidatePath('/moi')
}

// Débrief du jour : victoire ('good'), rechute ('bad') ou effacement (null).
export async function logDebrief(
  pairId: string,
  outcome: 'good' | 'bad' | null,
): Promise<void> {
  const { supabase, userId } = await requireUser()
  if (!userId || !isDebriefPairId(pairId)) return
  const date = toDayKey(new Date())

  if (outcome === null) {
    await supabase
      .from('debrief_logs')
      .delete()
      .match({ user_id: userId, pair_id: pairId, date })
  } else if (isDebriefOutcome(outcome)) {
    await supabase.from('debrief_logs').upsert(
      { user_id: userId, pair_id: pairId, date, outcome },
      { onConflict: 'user_id,pair_id,date' },
    )
  }
  revalidatePath('/moi')
}

// Créneaux de trajet (validation auto des quiz en déplacement).
export async function saveCommuteSlots(formData: FormData): Promise<void> {
  const { supabase, userId } = await requireUser()
  if (!userId) return

  const isTime = (v: string) => /^\d{2}:\d{2}$/.test(v)
  const slots: CommuteSlot[] = []
  for (const i of [1, 2]) {
    const start = String(formData.get(`start${i}`) ?? '')
    const end = String(formData.get(`end${i}`) ?? '')
    // Un créneau inversé (fin avant début) ne matcherait jamais rien.
    if (isTime(start) && isTime(end) && start < end) slots.push({ start, end })
  }

  const { error } = await supabase
    .from('profiles')
    .update({ commute_slots: slots })
    .eq('id', userId)
  if (error) console.error('[moi] créneaux de trajet non enregistrés:', error.message)
  revalidatePath('/moi')
}
