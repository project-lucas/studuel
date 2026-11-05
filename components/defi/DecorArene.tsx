'use client'

import { usePathname } from 'next/navigation'
import WorldBackdrop from '@/components/WorldBackdrop'
import ArenaBackdrop from '@/components/ArenaBackdrop'
import FenetreVivante from '@/components/defi/FenetreVivante'

/**
 * Le décor de l'Arène. Porté sur <body> (WorldBackdrop) pour ne jamais être
 * rogné par un ancêtre transformé — sinon, bordures blanches autour de l'arène.
 *
 * DEUX ENDROITS LE POSENT, ET CE N'EST PLUS LE MÊME DÉCOR (05/11/2026) :
 *
 * - L'ONGLET DÉFI (`app/@defi/defi/layout.tsx`) : LA FENÊTRE VIVANTE — l'école
 *   vue du rebord de la fenêtre, les élèves dans la cour, le duel dans l'arène,
 *   le dragon au loin (components/defi/FenetreVivante, lib/arena-fenetre.ts).
 *   Il vit et se cache avec l'onglet (components/OngletsVivants). Le rideau de
 *   recherche d'adversaire rejoue la même fenêtre (MatchmakingOverlay).
 *
 * - Les SOUS-PAGES de /defi (modes, jeux, traque…), par `app/defi/layout.tsx` :
 *   on est descendu dans la cour d'honneur, en SIX variantes qui suivent l'heure
 *   de l'élève (aube → nuit, lib/arena-background.ts ; ArenaBackdrop gère le
 *   timer, le fondu et le préchargement). Ce gabarit enveloppe AUSSI la page
 *   vide `/defi` du contenu ordinaire : `horsOnglet` l'y éteint, sans quoi un
 *   second décor serait construit, caché, derrière l'onglet.
 */
export default function DecorArene({ horsOnglet = false }: { horsOnglet?: boolean }) {
  const pathname = usePathname()
  if (horsOnglet && pathname === '/defi') return null
  if (!horsOnglet) {
    // La fenêtre peint son propre mur de pierre : pas de repli violet.
    return (
      <WorldBackdrop className="">
        <FenetreVivante />
      </WorldBackdrop>
    )
  }
  return (
    <WorldBackdrop className="defi-arena-bg">
      <ArenaBackdrop />
    </WorldBackdrop>
  )
}
