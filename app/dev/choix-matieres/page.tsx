import { notFound } from 'next/navigation'
import { getSubjectsCached } from '@/lib/catalog'
import { GRADE_LEVELS } from '@/lib/types'
import Apercu from './Apercu'

export const dynamic = 'force-dynamic'

// L'APERÇU DU CHOIX DES MATIÈRES DE L'ONBOARDING — en développement seulement.
// Les vraies matières de la base, croisées avec le programme officiel.
//
//   /dev/choix-matieres?classe=6e|4e|2de|1re|Tle|Tle techno…

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ classe?: string }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()
  const demandee = (await searchParams).classe ?? 'Tle'
  const classe = (GRADE_LEVELS as readonly string[]).includes(demandee) ? demandee : 'Tle'
  return <Apercu subjects={await getSubjectsCached()} classe={classe} />
}
