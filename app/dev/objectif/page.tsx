import { notFound } from 'next/navigation'
import { isDailyGoalMinutes } from '@/lib/welcome'
import Apercu from './Apercu'

export const dynamic = 'force-dynamic'

// L'APERÇU DE L'ÉCRAN « OBJECTIF QUOTIDIEN » DE L'ONBOARDING — en développement seulement.
//
//   /dev/objectif?min=3|10|15|30

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ min?: string }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()
  const min = Number((await searchParams).min ?? 10)
  return <Apercu depart={isDailyGoalMinutes(min) ? min : 10} />
}
