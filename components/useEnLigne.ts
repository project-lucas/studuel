'use client'

import { useSyncExternalStore } from 'react'

function souscrire(rappel: () => void): () => void {
  window.addEventListener('online', rappel)
  window.addEventListener('offline', rappel)
  return () => {
    window.removeEventListener('online', rappel)
    window.removeEventListener('offline', rappel)
  }
}

/**
 * L'élève est-il en ligne ? `navigator.onLine`, suivi par les événements du
 * navigateur. Au rendu serveur et à l'hydratation : en ligne (le HTML est
 * arrivé, donc le réseau marchait il y a un instant).
 *
 * Sert à la page d'erreur (« tu es hors connexion » plutôt que « ça a cassé »)
 * et au bandeau hors connexion (components/HorsLigne).
 */
export function useEnLigne(): boolean {
  return useSyncExternalStore(
    souscrire,
    () => navigator.onLine,
    () => true,
  )
}
