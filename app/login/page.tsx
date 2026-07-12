import { redirect } from 'next/navigation'
import PageHeader from '@/components/PageHeader'
import LoginForm from '@/components/LoginForm'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Connexion — Scolaria' }
export const dynamic = 'force-dynamic'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Déjà connecté → direction le compte.
  if (user) redirect('/compte')

  const { error } = await searchParams

  return (
    <div>
      <PageHeader title="Connexion" />
      {/* Lien email expiré (retour de /auth/callback sans session). */}
      {error === 'lien-expire' ? (
        <p
          role="alert"
          className="mx-auto mb-4 w-full max-w-md rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
        >
          Ce lien n&apos;est plus valide — reconnecte-toi ou redemande un email
          de réinitialisation.
        </p>
      ) : null}
      <LoginForm />
    </div>
  )
}
