import { notFound } from 'next/navigation'
import ApercuCourrier from './ApercuCourrier'

export const dynamic = 'force-dynamic'

// L'APERÇU DU COURRIER — en développement seulement.
//
// La boîte aux lettres (components/courrier) sur des lettres d'exemple, sans
// base ni compte : lues, non lues, un cadeau à récupérer, un défi d'ami, un
// mot du coach, une nouveauté. Les gestes passent par une porte de démo qui
// répond comme le serveur, pour qu'on puisse jouer le vol des éclairs. Le
// bouton flottant est posé aussi, avec le compte des non-lus.
//
//   /dev/courrier                 la boîte garnie
//   /dev/courrier?e=vide          rien à lire
//   /dev/courrier?e=lues          tout est lu
//   /dev/courrier?e=absente       la migration 602 n'est pas en base
export default async function ApercuCourrierPage({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  if (process.env.NODE_ENV === 'production') notFound()
  const { e = 'garnie' } = await searchParams
  return <ApercuCourrier e={e} />
}
