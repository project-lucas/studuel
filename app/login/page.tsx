import { redirect } from 'next/navigation'
import PageHeader from '@/components/PageHeader'
import LoginForm from '@/components/LoginForm'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Connexion — Scolaria' }
export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Déjà connecté → direction le compte.
  if (user) redirect('/compte')

  return (
    <div>
      <PageHeader title="Mon compte" />
      <LoginForm />
    </div>
  )
}
