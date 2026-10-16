'use client'

import { usePathname } from 'next/navigation'
import { journeeBouclee } from '@/lib/quests'
import { isHudHidden } from '@/lib/top-hud-routes'
import { cn } from '@/lib/utils'
import PastilleQuetes from './PastilleQuetes'
import { useQuetesDuJour } from './store'

/**
 * LES QUÊTES DU JOUR, EN BOUTON FLOTTANT (15/10/2026, Lucas : « l'icône quêtes
 * devient un icône flottant placé en bas à droite, au-dessus ou dessous de
 * l'icône flottant de Marcel ; une fois faites, le bouton disparaît »).
 *
 * Le grand rond de PastilleQuetes (anneau en tronçons, nombre à encaisser),
 * posé en bas à droite au-dessus de la barre d'onglets — sur tous les écrans
 * qui portent le bandeau. Il s'efface quand la journée est bouclée (tout
 * encaissé, coffre ouvert : `journeeBouclee`) et revient le lendemain.
 *
 * Deux voisins à éviter :
 *   · l'ARÈNE, dont la rangée de combat occupe le bas de l'écran jusqu'à
 *     ~11,5 rem : le bouton monte au-dessus ;
 *   · MARCEL (Studuel+), qui pose sa tête en bas à droite de Réviser et
 *     `html.marcel-fab` tant qu'elle est à l'écran : le bouton se pose
 *     au-dessus d'elle.
 */
export default function BoutonQuetesFlottant() {
  const pathname = usePathname()
  const etat = useQuetesDuJour()
  if (!etat || etat.quetes.length === 0 || journeeBouclee(etat) || isHudHidden(pathname)) return null
  return (
    <div
      className={cn(
        'quetes-fab fixed right-4 z-40 md:bottom-8',
        pathname === '/defi' ? 'bottom-[12.25rem]' : 'bottom-24 [html.marcel-fab_&]:bottom-[10.75rem]',
      )}
    >
      <PastilleQuetes grand />
    </div>
  )
}
