import { redirect } from 'next/navigation'
import OnboardingCompte from '@/components/onboarding/OnboardingCompte'
import { getSubjectsCached } from '@/lib/catalog'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'

export const metadata = { title: 'Bienvenue — Studuel' }
export const dynamic = 'force-dynamic'

// L'onboarding d'un compte connecté : trois questions, dans le monde visuel
// du parcours d'accueil (/bienvenue). Voir components/onboarding/OnboardingCompte
// pour qui arrive ici et pourquoi il n'y a plus deux designs d'onboarding.
export default async function OnboardingPage() {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const [{ data: profile }, subjects] = await Promise.all([
    supabase
      .from('profiles')
      .select(
        'full_name, grade_level, daily_goal_minutes, selected_subjects, onboarded, profile_type',
      )
      .eq('id', user.id)
      .maybeSingle<{
        full_name: string | null
        grade_level: string | null
        daily_goal_minutes: number | null
        selected_subjects: unknown
        onboarded: boolean | null
        profile_type: string | null
      }>(),
    getSubjectsCached(),
  ])

  // Un parent n'a pas de classe : ces trois questions ne le concernent pas.
  if (profile?.profile_type === 'parent') redirect('/parents')

  const firstName = profile?.full_name?.split(' ')[0] ?? null
  const selected = Array.isArray(profile?.selected_subjects)
    ? (profile.selected_subjects as string[])
    : null

  return (
    <OnboardingCompte
      subjects={subjects}
      firstName={firstName}
      defaultGrade={profile?.grade_level ?? null}
      defaultGoalMinutes={profile?.daily_goal_minutes ?? null}
      defaultSelected={selected}
      modification={profile?.onboarded === true && Boolean(profile?.grade_level)}
    />
  )
}
