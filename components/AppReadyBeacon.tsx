'use client'

import { useEffect } from 'react'
import { markAppReady } from '@/lib/app-ready'

/**
 * Balise « le premier écran est peint ».
 *
 * Montée DANS la frontière Suspense du bandeau du haut (layout racine) : React
 * ne révèle le contenu d'une frontière que lorsque TOUS ses enfants sont prêts,
 * donc ce composant se monte exactement au moment où le bandeau streamé
 * apparaît — le premier pixel de vraie interface, pas un squelette. C'est ce
 * signal, et non l'événement `load`, qui autorise l'écran de chargement à
 * lever le rideau (voir lib/splash → isSplashReady).
 *
 * Ne rend rien : c'est un capteur, pas de l'interface.
 */
export default function AppReadyBeacon() {
  useEffect(() => {
    markAppReady()
  }, [])

  return null
}
