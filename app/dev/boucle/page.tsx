import { notFound } from 'next/navigation'
import ApercuBoucle from './ApercuBoucle'

export const dynamic = 'force-dynamic'

// L'APERÇU DES BOUCLES OUVERTES (effet Zeigarnik, 28/10/2026) — en
// développement seulement, sans base ni compte.
//
//   /dev/boucle                  la carte « Tu t'étais arrêté là » : quiz passé
//                                la moitié, quiz à peine commencé, cours entamé
//   /dev/boucle?reprise=1        la proposition « Reprendre à la question 7 »
//   /dev/boucle?jouer=1          un VRAI quiz de 6 questions : répondre, recharger
//                                la page, la manche est proposée à la reprise
//                                (le brouillon vit dans le navigateur ; sans
//                                session, la recopie en base répond 401)
export default async function ApercuBouclePage({
  searchParams,
}: {
  searchParams: Promise<{ reprise?: string; jouer?: string }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()
  const { reprise, jouer } = await searchParams
  return <ApercuBoucle reprise={reprise === '1'} jouer={jouer === '1'} />
}
