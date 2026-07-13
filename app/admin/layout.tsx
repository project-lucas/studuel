import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { Wrench } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Studio de contenu — Studuel' }
export const dynamic = 'force-dynamic'

// Espace admin : édition du catalogue (matières → chapitres → leçons → quiz).
// Réservé aux comptes is_admin (migration 028) — pour les autres, la route
// n'existe pas (notFound plutôt que redirect : on ne révèle rien).
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle<{ is_admin: boolean }>()
  if (!profile?.is_admin) notFound()

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border bg-card px-4 py-3 shadow-sm">
        <Link
          href="/admin"
          className="font-heading flex items-center gap-2 text-sm font-bold"
        >
          <Wrench className="size-4 text-primary" aria-hidden="true" />
          Studio de contenu
        </Link>
        <Link
          href="/reviser"
          className="text-sm text-muted-foreground underline underline-offset-4"
        >
          Retour à l’app
        </Link>
      </div>
      {children}
    </div>
  )
}
