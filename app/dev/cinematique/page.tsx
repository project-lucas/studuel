import { notFound } from 'next/navigation'
import { indexDepuisParametre } from '@/lib/welcome/cinematique'
import ApercuCinematique from './Apercu'

export const dynamic = 'force-dynamic'

// L'APERÇU DE LA CINÉMATIQUE D'OUVERTURE — en développement seulement, sans
// compte. Dans l'app, elle se joue une fois, à l'étape `tuto` de /bienvenue.
//
//   /dev/cinematique              depuis le premier tableau
//   /dev/cinematique?tableau=3    ouvre sur le troisième (1 à 5)
export default async function ApercuCinematiquePage({
  searchParams,
}: {
  searchParams: Promise<{ tableau?: string }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()
  const { tableau } = await searchParams
  return <ApercuCinematique tableau={indexDepuisParametre(tableau)} />
}
