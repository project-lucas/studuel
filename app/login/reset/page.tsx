import { redirect } from 'next/navigation'
import PageHeader from '@/components/PageHeader'
import ResetRequestForm from '@/components/ResetRequestForm'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Mot de passe oublié — Scolaria' }
export const dynamic = 'force-dynamic'

export default async function ResetRequestPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Déjà connecté → rien à réinitialiser ici.
  if (user) redirect('/compte')

  return (
    <div>
      <PageHeader title="Mot de passe oublié" />
      <ResetRequestForm />
    </div>
  )
}
