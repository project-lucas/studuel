'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { GRADE_LEVELS } from '@/lib/types'

export async function saveOnboarding(formData: FormData): Promise<void> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const grade = String(formData.get('grade_level') ?? '')
  const goalRaw = Number(formData.get('daily_goal') ?? 1)
  if (!GRADE_LEVELS.includes(grade as (typeof GRADE_LEVELS)[number])) return

  await supabase
    .from('profiles')
    .update({
      grade_level: grade,
      daily_goal: [1, 2, 3].includes(goalRaw) ? goalRaw : 1,
      onboarded: true,
    })
    .eq('id', user.id)

  revalidatePath('/', 'layout')
  redirect('/studio')
}
