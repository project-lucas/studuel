import { notFound } from 'next/navigation'
import { xpForLevel } from '@/lib/wallet'
import type { OngletVerrouillable } from '@/lib/decouverte/catalogue'
import ApercuDecouverte from './ApercuDecouverte'

export const dynamic = 'force-dynamic'

// L'APERÇU DE LA DÉCOUVERTE PROGRESSIVE — en développement seulement.
//
// La barre d'onglets du layout (la vraie) avec ses cadenas, la feuille « Se
// débloque au niveau N », et les mini-tours, sur un état semé dans le magasin
// (components/decouverte/store) : ni base ni compte.
//
//   /dev/decouverte?niveau=1              Défi, Amis et Boutique fermés
//   /dev/decouverte?niveau=2              Défi ouvert, Amis et Boutique fermés
//   /dev/decouverte?niveau=3              tout ouvert sauf les gardiens
//   /dev/decouverte?niveau=1&xp=40        « encore 60 XP » (défaut : l'XP pile du niveau)
//   /dev/decouverte?niveau=1&feuille=defi la feuille de l'onglet Défi déjà ouverte
//   /dev/decouverte?niveau=2&decouvrir=defi  le mini-tour de l'arène (ancres de la barre seulement)
//   /dev/decouverte?ancien=1              un compte d'avant la 601 : rien n'est fermé
export default async function ApercuDecouvertePage({
  searchParams,
}: {
  searchParams: Promise<{ niveau?: string; xp?: string; feuille?: string; vues?: string; ancien?: string }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()
  const { niveau = '1', xp, feuille, vues, ancien } = await searchParams
  const n = Math.max(1, Number.parseInt(niveau, 10) || 1)
  const xpLu = xp === undefined ? Number.NaN : Number(xp)
  const onglet: OngletVerrouillable | null =
    feuille === 'defi' || feuille === 'amis' || feuille === 'tresor' ? feuille : null
  return (
    <ApercuDecouverte
      niveau={n}
      xp={Number.isFinite(xpLu) ? xpLu : xpForLevel(n)}
      vues={vues ? vues.split(',').filter(Boolean) : []}
      ancien={ancien === '1'}
      feuille={onglet}
    />
  )
}
