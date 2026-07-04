'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { CommuteSlot } from '@/lib/types'

async function requireUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return { supabase, userId: user?.id ?? null }
}

// Active une habitude du catalogue (cible = valeurs par défaut du catalogue).
export async function addHabit(catalogId: string): Promise<void> {
  const { supabase, userId } = await requireUser()
  if (!userId) return

  const { data: entry } = await supabase
    .from('habit_catalog')
    .select('id, default_target')
    .eq('id', catalogId)
    .maybeSingle()
  if (!entry) return

  await supabase.from('habits').upsert(
    {
      user_id: userId,
      catalog_id: entry.id,
      target: entry.default_target ?? {},
    },
    { onConflict: 'user_id,catalog_id', ignoreDuplicates: true },
  )
  revalidatePath('/moi')
}

export async function removeHabit(habitId: string): Promise<void> {
  const { supabase, userId } = await requireUser()
  if (!userId) return

  await supabase.from('habits').delete().eq('id', habitId).eq('user_id', userId)
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

// Créneaux de trajet (validation auto des quiz en déplacement).
export async function saveCommuteSlots(formData: FormData): Promise<void> {
  const { supabase, userId } = await requireUser()
  if (!userId) return

  const isTime = (v: string) => /^\d{2}:\d{2}$/.test(v)
  const slots: CommuteSlot[] = []
  for (const i of [1, 2]) {
    const start = String(formData.get(`start${i}`) ?? '')
    const end = String(formData.get(`end${i}`) ?? '')
    if (isTime(start) && isTime(end)) slots.push({ start, end })
  }

  await supabase
    .from('profiles')
    .update({ commute_slots: slots })
    .eq('id', userId)
  revalidatePath('/moi')
}
