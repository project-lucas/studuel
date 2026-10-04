import { notFound } from 'next/navigation'
import ApercuNiveau from './Apercu'

export const dynamic = 'force-dynamic'

// L'APERÇU DE LA FÊTE DE NIVEAU — en développement seulement.
//
// Dans l'app, la fête ne s'ouvre que quand le bandeau affiche un niveau plus
// haut que le dernier fêté (localStorage). Ici, on la rejoue à volonté :
//
//   /dev/niveau                    8 → 9, la distance au prochain coffre
//   /dev/niveau?de=4&a=5           un palier : le coffre à ouvrir
//   /dev/niveau?de=6&a=8           deux niveaux d'un coup
//   /dev/niveau?part=0.4           déjà 40 % du niveau suivant
//   /dev/niveau?ouverts=5          coffres déjà ouverts : la distance au prochain
export default async function ApercuNiveauPage({
  searchParams,
}: {
  searchParams: Promise<{ de?: string; a?: string; part?: string; ouverts?: string }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()
  const q = await searchParams
  const entier = (v: string | undefined, defaut: number) => {
    const n = Math.floor(Number(v))
    return Number.isFinite(n) && n >= 1 ? n : defaut
  }
  const a = entier(q.a, 9)
  const de = Math.min(entier(q.de, a - 1), a - 1)
  const part = Math.min(1, Math.max(0, Number(q.part) || 0.08))
  const ouverts = (q.ouverts ?? '').split(',').map(Number).filter((n) => Number.isInteger(n) && n > 0)
  return <ApercuNiveau de={Math.max(1, de)} a={a} part={part} ouverts={ouverts} />
}
