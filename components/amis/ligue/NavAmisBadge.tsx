'use client'

import { useSyncExternalStore } from 'react'
import { bilanLigueEnAttente, coffrePretEnAttente, ecouterBilanLigue, ecouterCoffrePret } from '@/lib/ligue'

const sAbonnerBilan = (prevenir: () => void) => ecouterBilanLigue(prevenir)
const sAbonnerCoffre = (prevenir: () => void) => ecouterCoffrePret(prevenir)

/**
 * La pastille de l'onglet Amis : le bilan de la semaine attend d'être joué
 * (montée, gemmes), ou le coffre d'équipe d'une semaine finie attend d'être
 * ouvert (migration 379). Même dessin que celle de la Boutique. Elle suit les
 * signaux du réveil de la ligue (components/LigueVeille) et s'éteint quand
 * l'élève a touché « Continuer » sur l'écran de fin de semaine ET ouvert son
 * coffre. Elle lit les états RETENUS (sessionStorage) : une annonce faite avant
 * son montage n'est pas perdue. Éteinte au rendu serveur et à l'hydratation.
 */
export default function NavAmisBadge() {
  const bilan = useSyncExternalStore(sAbonnerBilan, bilanLigueEnAttente, () => false)
  const coffre = useSyncExternalStore(sAbonnerCoffre, coffrePretEnAttente, () => false)
  if (!bilan && !coffre) return null
  return (
    <span aria-hidden="true" className="absolute -top-1 -right-1.5 flex size-2.5">
      <span className="bg-destructive/70 absolute inline-flex size-full animate-ping rounded-full motion-reduce:hidden" />
      <span className="bg-destructive relative inline-flex size-2.5 rounded-full ring-2 ring-white" />
    </span>
  )
}
