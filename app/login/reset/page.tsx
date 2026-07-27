import { redirect } from 'next/navigation'
import PageHeader from '@/components/PageHeader'
import ResetRequestForm from '@/components/ResetRequestForm'
import { getCurrentUser } from '@/lib/supabase/user'

export const metadata = { title: 'Mot de passe oublié — Studuel' }
export const dynamic = 'force-dynamic'

export default async function ResetRequestPage() {
  const user = await getCurrentUser()

  // Déjà connecté → rien à réinitialiser ici.
  if (user) redirect('/compte')

  return (
    <div>
      <PageHeader title="Mot de passe oublié" />
      <ResetRequestForm />
    </div>
  )
}
