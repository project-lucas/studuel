import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, Eye } from 'lucide-react'
import Messagerie from '@/components/messagerie/Messagerie'
import { lireFils, lireFilsEnfants } from '@/lib/messagerie/server'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'

export const metadata = { title: 'Messages — Studuel' }
export const dynamic = 'force-dynamic'

/**
 * LA MESSAGERIE DE L'ÉLÈVE ET DU PARENT (16/10/2026, migration 587) : les fils
 * que leur coach a ouverts avec eux, en plein écran comme une application de
 * messagerie. Le parent voit aussi, sans en lire le contenu, les fils que le
 * coach a ouverts avec son enfant (transparence).
 */
export default async function MessagesPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  const supabase = await createClient()
  const [fils, filsEnfants, profil] = await Promise.all([
    lireFils(false),
    lireFilsEnfants(),
    supabase.from('profiles').select('profile_type').eq('id', user.id).maybeSingle<{ profile_type: string | null }>(),
  ])
  const parent = profil.data?.profile_type === 'parent'
  const retour = parent ? '/parents' : '/compte'

  return (
    <div className="mx-auto flex h-dvh w-full max-w-5xl flex-col px-0 md:px-6 md:py-6">
      <header className="flex items-center gap-2 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2 md:px-0">
        <Link href={retour} className="grid size-10 place-items-center rounded-full bg-card shadow-sm ring-1 ring-black/5" aria-label="Retour">
          <ArrowLeft className="size-5" aria-hidden="true" />
        </Link>
        <h1 className="font-heading text-2xl font-extrabold">Messages</h1>
      </header>

      {parent && filsEnfants.length > 0 ? (
        <div className="mx-3 mb-2 flex items-start gap-2 rounded-2xl bg-secondary px-3 py-2 text-sm md:mx-0">
          <Eye className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          <p>
            {filsEnfants.map((f) => `${f.coachPrenom} échange avec ${f.elevePrenom} (${f.messages} message${f.messages > 1 ? 's' : ''})`).join(' · ')}.
            {' '}Ces échanges restent entre eux et sont archivés ; vous pouvez en parler avec le coach ici.
          </p>
        </div>
      ) : null}

      {fils === null ? (
        <p className="carte mx-3 p-6 text-sm text-muted-foreground md:mx-0">La messagerie arrive très bientôt.</p>
      ) : (
        <div className="min-h-0 flex-1 px-0 md:px-0">
          <Suspense>
            <Messagerie filsInitiaux={fils} moi={user.id} mode="utilisateur" hauteur="100%" />
          </Suspense>
        </div>
      )}
    </div>
  )
}
