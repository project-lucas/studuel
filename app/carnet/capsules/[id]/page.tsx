import { notFound, redirect } from 'next/navigation'
import LecteurCapsule from '@/components/capsules/LecteurCapsule'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { lireCapsuleComplete } from '@/lib/capsules-server'

export const metadata = { title: 'Capsule — Studuel' }
export const dynamic = 'force-dynamic'

/**
 * Une capsule, lue dans le carnet (migration 366). Elle n'est lisible qu'une
 * fois à l'élève : sinon, direction sa fiche dans la Boutique.
 */
export default async function CapsuleCarnetPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getCurrentUser()
  if (!user) redirect(`/login?next=${encodeURIComponent(`/carnet/capsules/${id}`)}`)

  const supabase = await createClient()
  const { capsule, achat, contenu } = await lireCapsuleComplete(supabase, user.id, id)
  if (!capsule) notFound()
  if (!achat || achat.statut !== 'active') redirect('/tresor#capsules')

  return (
    <>
      <LecteurCapsule
        capsule={capsule}
        contenu={contenu}
        dejaOuverte={achat.ouverteLe !== null}
        terminee={achat.termineeLe !== null}
      />
    </>
  )
}
