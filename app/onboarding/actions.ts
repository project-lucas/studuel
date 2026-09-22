'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { GRADE_LEVELS } from '@/lib/types'
import { isDailyGoalMinutes, minutesToSessions } from '@/lib/welcome'

export async function saveOnboarding(formData: FormData): Promise<void> {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const grade = String(formData.get('grade_level') ?? '')
  if (!GRADE_LEVELS.includes(grade as (typeof GRADE_LEVELS)[number])) return

  // L'objectif quotidien s'exprime en MINUTES (3 / 10 / 15 / 30), comme dans
  // le parcours d'accueil ; la colonne legacy `daily_goal` (sessions/jour)
  // en dérive, pour la capacité et la série. L'ancien formulaire envoyait
  // directement des sessions : on le tolère encore.
  const minutesRaw = Number(formData.get('daily_goal_minutes'))
  const minutes = isDailyGoalMinutes(minutesRaw) ? minutesRaw : null
  const sessionsLegacy = Number(formData.get('daily_goal') ?? 1)
  const dailyGoal = minutes
    ? minutesToSessions(minutes)
    : [1, 2, 3].includes(sessionsLegacy)
      ? sessionsLegacy
      : 1

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
      daily_goal: dailyGoal,
      ...(minutes ? { daily_goal_minutes: minutes } : {}),
      selected_subjects: subjects,
      onboarded: true,
    })
    .eq('id', user.id)

  revalidatePath('/', 'layout')
  // Direction l'onglet Moi : le bilan de capacités s'ouvre pour être rempli.
  redirect('/moi?bilan=1')
}
