import { notFound } from 'next/navigation'
import Apercu from './Apercu'

export const dynamic = 'force-dynamic'

// L'APERÇU DE « MARCEL DESSINE TON AVATAR » — en développement seulement.
//
//   /dev/avatar-ia                 abonné, 150 crédits restants
//   /dev/avatar-ia?gratuit=1       élève gratuit : ce que Studuel+ ouvrirait
//   /dev/avatar-ia?bientot=1       migration 378 pas encore passée
//   /dev/avatar-ia?credits=10      pas assez de crédits pour un avatar
export default async function ApercuAvatarIaPage({
  searchParams,
}: {
  searchParams: Promise<{ gratuit?: string; bientot?: string; credits?: string }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()
  const q = await searchParams
  const restants = Number.isFinite(Number(q.credits)) && q.credits !== undefined ? Number(q.credits) : 150
  return (
    <Apercu
      abonne={q.gratuit !== '1'}
      initial={
        q.bientot === '1'
          ? { disponible: false, credits: null, avatars: [] }
          : { disponible: true, credits: { mensuels: 200, restants }, avatars: [] }
      }
    />
  )
}
