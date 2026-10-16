import { notFound, redirect } from 'next/navigation'
import ConsoleShell from '@/components/console/ConsoleShell'
import { lireRolesConsole } from '@/lib/console/server'

export const metadata = { title: 'Coach — Studuel' }
export const dynamic = 'force-dynamic'

/**
 * L'ESPACE COACH (13/10/2026, migration 560), dans LA CONSOLE depuis le
 * 16/10/2026 : une barre latérale pensée pour l'ordinateur, la messagerie en
 * haut à droite. Réservé aux comptes coach et aux admins ; pour les autres, la
 * route n'existe pas (notFound, comme /admin). Les RPC revérifient le lien.
 */
export default async function CoachLayout({ children }: { children: React.ReactNode }) {
  const roles = await lireRolesConsole()
  if (!roles.userId) redirect('/login')
  if (!roles.coach) notFound()

  return (
    <ConsoleShell roles={{ coach: roles.coach, admin: roles.admin }} prenom={roles.prenom}>
      {children}
    </ConsoleShell>
  )
}
