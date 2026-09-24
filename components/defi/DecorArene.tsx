'use client'

import { usePathname } from 'next/navigation'
import WorldBackdrop from '@/components/WorldBackdrop'
import ArenaBackdrop from '@/components/ArenaBackdrop'

/**
 * Le décor de l'Arène : l'académie flottante, en SIX variantes qui suivent
 * l'heure de l'élève (aube → nuit, voir lib/arena-background.ts). ArenaBackdrop
 * gère le timer, le fondu et le préchargement. Porté sur <body>
 * (WorldBackdrop) pour ne jamais être rogné par un ancêtre transformé — sinon,
 * bordures blanches autour de l'arène.
 *
 * DEUX ENDROITS LE POSENT. L'onglet Défi a le sien, dans son emplacement
 * (`app/@defi/defi/layout.tsx`) : il vit et se cache avec l'onglet
 * (components/OngletsVivants). Les SOUS-PAGES de /defi (modes, jeux, traque…)
 * ont celui de `app/defi/layout.tsx` — qui enveloppe AUSSI la page vide
 * `/defi` du contenu ordinaire : `horsOnglet` l'y éteint, sans quoi un second
 * décor serait construit, caché, derrière l'onglet.
 */
export default function DecorArene({ horsOnglet = false }: { horsOnglet?: boolean }) {
  const pathname = usePathname()
  if (horsOnglet && pathname === '/defi') return null
  return (
    <WorldBackdrop className="defi-arena-bg">
      <ArenaBackdrop />
    </WorldBackdrop>
  )
}
