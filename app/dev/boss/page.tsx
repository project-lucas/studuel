import { notFound } from 'next/navigation'
import Apercu from './Apercu'

export const dynamic = 'force-dynamic'

// L'APERÇU DES ÉCRANS DE BOSS — en développement seulement, sans base ni compte.
//
//   /dev/boss?e=apparition   le rideau quand le boss sort de sa tanière
//   /dev/boss                l'accueil du combat de La Traque (puis la fin, en jouant)
//   /dev/boss?e=serie        la célébration de série (Marcel félicite)
//   &boss=<id>               un autre boss (bigben par défaut)

export default async function ApercuBossPage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string; boss?: string }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()
  const { e = 'intro', boss = 'bigben' } = await searchParams
  return <Apercu ecran={e} bossId={boss} />
}
