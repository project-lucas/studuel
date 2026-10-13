import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { Users, LayoutList } from 'lucide-react'
import { getCurrentUser } from '@/lib/supabase/user'
import { estCoach } from '@/lib/coach/server'

export const metadata = { title: 'Coach — Studuel' }
export const dynamic = 'force-dynamic'

/**
 * L'ESPACE COACH (13/10/2026, migration 560) — un tableau de bord pensé pour
 * un écran d'ordinateur et des centaines d'élèves. Réservé aux comptes coach
 * (`profile_type = 'coach'`) et aux admins ; pour les autres, la route n'existe
 * pas (notFound, comme /admin). Les RPC revérifient le lien de toute façon.
 *
 * Même grammaire que Réviser (mur crème, cartes blanches, Baloo 2), pas de
 * dessin : c'est un outil. L'or n'y sert qu'au seul bouton principal.
 */
export default async function CoachLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  if (!(await estCoach())) notFound()

  return (
    // Sans chrome (lib/quiz-chrome) : la page pose ses propres marges.
    <div className="mx-auto w-full max-w-6xl p-4 md:p-6">
      <div className="mb-5 flex flex-wrap items-center gap-2 rounded-2xl border bg-card px-4 py-3 shadow-sm">
        <Link href="/coach" className="font-heading flex items-center gap-2 text-base font-extrabold">
          <Users className="size-5 text-primary" aria-hidden="true" />
          Coach Studuel
        </Link>
        <nav className="ml-3 flex items-center gap-1 text-sm font-bold" aria-label="Espace coach">
          <Link href="/coach" className="rounded-full px-3 py-1.5 hover:bg-secondary">
            Tableau
          </Link>
          <Link href="/coach/groupes" className="flex items-center gap-1.5 rounded-full px-3 py-1.5 hover:bg-secondary">
            <LayoutList className="size-4" aria-hidden="true" />
            Groupes et codes
          </Link>
        </nav>
        <Link
          href="/reviser"
          className="ml-auto text-sm text-muted-foreground underline underline-offset-4"
        >
          Retour à l’app
        </Link>
      </div>
      {children}
    </div>
  )
}
