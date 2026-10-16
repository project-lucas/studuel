import { notFound, redirect } from 'next/navigation'
import ConsoleShell from '@/components/console/ConsoleShell'
import { lireRolesConsole } from '@/lib/console/server'

export const metadata = { title: 'Console — Studuel' }
export const dynamic = 'force-dynamic'

// L'ESPACE ADMIN, dans LA CONSOLE depuis le 16/10/2026 (barre latérale pour
// l'ordinateur, sans le chrome de l'app : lib/quiz-chrome). Réservé aux comptes
// is_admin (migration 028) — pour les autres, la route n'existe pas (notFound
// plutôt que redirect : on ne révèle rien).
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const roles = await lireRolesConsole()
  if (!roles.userId) redirect('/login')
  if (!roles.admin) notFound()

  return (
    <ConsoleShell roles={{ coach: roles.coach, admin: roles.admin }} prenom={roles.prenom}>
      {children}
    </ConsoleShell>
  )
}
