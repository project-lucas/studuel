import { redirect } from 'next/navigation'
import PageHeader from '@/components/PageHeader'
import OnboardingFlow from '@/components/OnboardingFlow'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Bienvenue — Scolaria' }
export const dynamic = 'force-dynamic'

export default async function OnboardingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: subjects }] = await Promise.all([
    supabase
      .from('profiles')
      .select('full_name, grade_level, daily_goal, selected_subjects')
      .eq('id', user.id)
      .single(),
    supabase.from('subjects').select('*').order('name'),
  ])

  const firstName = profile?.full_name?.split(' ')[0]
  const selected = Array.isArray(profile?.selected_subjects)
    ? (profile.selected_subjects as string[])
    : null

  return (
    <div>
      <PageHeader
        title={firstName ? `Bienvenue, ${firstName} !` : 'Bienvenue !'}
        description="Trois questions pour personnaliser ton espace de travail."
      />
      <OnboardingFlow
        subjects={subjects ?? []}
        defaultGrade={profile?.grade_level ?? null}
        defaultGoal={profile?.daily_goal ?? 1}
        defaultSelected={selected}
      />
    </div>
  )
}
