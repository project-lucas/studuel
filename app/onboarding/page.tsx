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

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, grade_level, daily_goal')
    .eq('id', user.id)
    .single()

  const firstName = profile?.full_name?.split(' ')[0]

  return (
    <div>
      <PageHeader
        title={firstName ? `Bienvenue, ${firstName} !` : 'Bienvenue !'}
        description="Deux questions pour personnaliser ton espace de travail."
      />
      <OnboardingFlow
        defaultGrade={profile?.grade_level ?? null}
        defaultGoal={profile?.daily_goal ?? 1}
      />
    </div>
  )
}
