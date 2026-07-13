import PageHeader from '@/components/PageHeader'
import AmisHome from '@/components/AmisHome'
import { createClient } from '@/lib/supabase/server'
import { toDayKey } from '@/lib/streak'
import {
  getMockLive,
  getMockDuels,
  getMockLeague,
  getMockFriends,
  getMockSchool,
  MOCK_PRIORITY_SUBJECT,
} from '@/lib/social'

export const metadata = { title: 'Amis — Studuel' }
export const dynamic = 'force-dynamic'

// Onglet social (extrême gauche). Amis, duels et ligue sont encore des
// données de démonstration ; le classement de l'école, lui, bouge déjà avec
// le vrai temps de travail de l'élève (profiles.work_seconds).
export default async function AmisPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let mySeconds = 0
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('work_seconds')
      .eq('id', user.id)
      .maybeSingle()
    mySeconds = Number(profile?.work_seconds ?? 0) || 0
  }

  return (
    <div>
      <PageHeader
        title="Amis"
        description="Défie, rejoins, grimpe — ton cerveau contre les leurs."
      />
      <AmisHome
        live={getMockLive()}
        duels={getMockDuels()}
        league={getMockLeague()}
        school={getMockSchool(mySeconds)}
        friends={getMockFriends()}
        prioritySubject={MOCK_PRIORITY_SUBJECT}
        todayKey={toDayKey(new Date())}
      />
    </div>
  )
}
