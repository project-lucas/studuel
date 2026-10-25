import { notFound } from 'next/navigation'
import { rouleauFiche } from '@/lib/fiche-ecrin-server'
import ApercuFicheDebloquer from './Apercu'

export const dynamic = 'force-dynamic'

// L'APERÇU DE L'ÉCRIN DE DÉBLOCAGE D'UNE FICHE — en développement seulement.
//
// L'écran de la fiche d'un chapitre verrouillé, sans compte ni base : l'écrin,
// la confirmation en pop-up, l'ouverture. La dépense est une démonstration :
//
//   /dev/fiche-debloquer                 45 gemmes : on peut payer, succès
//   /dev/fiche-debloquer?gemmes=10       il en manque 20
//   /dev/fiche-debloquer?reponse=refus   le serveur refuse (l'erreur reste dans le pop-up)
//   /dev/fiche-debloquer?repli=1         sans le rouleau dessiné, même s'il est là
export default async function ApercuFicheDebloquerPage({
  searchParams,
}: {
  searchParams: Promise<{ gemmes?: string; reponse?: string; repli?: string }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()
  const q = await searchParams
  const gemmes = Math.max(0, Math.floor(Number(q.gemmes ?? 45)) || 0)
  const rouleau = q.repli === '1' ? null : rouleauFiche()
  return <ApercuFicheDebloquer gemmes={gemmes} refus={q.reponse === 'refus'} rouleau={rouleau} />
}
