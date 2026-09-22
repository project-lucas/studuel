import { notFound } from 'next/navigation'
import ApercuCompte from './Apercu'

export const dynamic = 'force-dynamic'

// L'APERÇU DE LA FÊTE DU COMPTE DE TROPHÉES — en développement seulement.
//
// Sur l'arène, le compte ne fête que ce qui a bougé depuis la dernière visite
// (localStorage). Pour la relire à volonté, cette page pose un ancien état en
// mémoire puis rend le compte avec le nouveau : le défilement, le bond de la
// coupe, le « +8 » qui s'envole, la plaque qui s'allume, la bande qui glisse.
//
//   /dev/compte                          22 → 30 trophées, Top 40 % → Top 15 %
//   /dev/compte?de=30&a=28&topDe=15&topA=15   une perte, la bande ne bouge pas
//   /dev/compte?de=30&a=30&topDe=20&topA=15   seule la bande bouge
export default async function ApercuComptePage({
  searchParams,
}: {
  searchParams: Promise<{ de?: string; a?: string; topDe?: string; topA?: string }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()
  const q = await searchParams
  const nombre = (v: string | undefined, defaut: number | null) => {
    if (v === undefined) return defaut
    if (v === 'null') return null
    const n = Number(v)
    return Number.isFinite(n) ? n : defaut
  }
  return (
    <ApercuCompte
      de={nombre(q.de, 22) ?? 22}
      a={nombre(q.a, 30) ?? 30}
      topDe={nombre(q.topDe, 40)}
      topA={nombre(q.topA, 15)}
    />
  )
}
