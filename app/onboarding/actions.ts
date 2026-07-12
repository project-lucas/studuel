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

  // Matières choisies à l'onboarding (cases cochées à l'étape 2).
  const subjects = Array.from(
    new Set(
      formData
        .getAll('subjects')
        .map((s) => String(s))
        .filter((s) => s.length > 0 && s.length < 64),
    ),
  )

  await supabase
    .from('profiles')
    .update({
      grade_level: grade,
      daily_goal: [1, 2, 3].includes(goalRaw) ? goalRaw : 1,
      selected_subjects: subjects,
      onboarded: true,
    })
    .eq('id', user.id)

  revalidatePath('/', 'layout')
  // Direction l'onglet Moi : le bilan de capacités s'ouvre pour être rempli.
  redirect('/moi?bilan=1')
}
