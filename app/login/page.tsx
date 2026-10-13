import { redirect } from 'next/navigation'
import PageHeader from '@/components/PageHeader'
import LoginForm from '@/components/LoginForm'
// Déconnecté : les pages gardées pour le hors-ligne sont celles de l'élève
// précédent, on les vide (public/sw.js).
import ViderCachePages from '@/components/ViderCachePages'
import { getCurrentUser } from '@/lib/supabase/user'
import { getPortesOAuthCached } from '@/lib/supabase/portes-oauth'

export const metadata = { title: 'Connexion — Studuel' }
export const dynamic = 'force-dynamic'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const [user, portes, { error }] = await Promise.all([
    getCurrentUser(),
    getPortesOAuthCached(),
    searchParams,
  ])

  // Déjà connecté → direction le compte.
  if (user) redirect('/compte')

  // Deux retours possibles avec message : le lien e-mail périmé (retour de
  // /auth/callback sans session) et le fournisseur OAuth qui n'a pas démarré.
  const message =
    error === 'lien-expire'
      ? 'Ce lien n’est plus valide — reconnecte-toi ou redemande un email de réinitialisation.'
      : error === 'oauth'
        ? 'La connexion avec ce service n’a pas pu démarrer. Réessaie, ou connecte-toi avec ton e-mail.'
        : null

  return (
    <div>
      <ViderCachePages />
      <PageHeader title="Connexion" />
      {message ? (
        <p
          role="alert"
          className="mx-auto mb-4 w-full max-w-md rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
        >
          {message}
        </p>
      ) : null}
      <LoginForm portes={portes} />
    </div>
  )
}
