'use client'

import { useEffect } from 'react'

/**
 * Vide le cache des PAGES du service worker (public/sw.js, `vider-pages`).
 * Monté sur la page de connexion : on y arrive déconnecté — après « Se
 * déconnecter », ou une session expirée —, et les pages gardées pour le
 * hors-ligne sont le journal de l'élève précédent. Un autre élève sur le même
 * téléphone ne doit pas y retrouver son dossier. Ne rend rien.
 */
export default function ViderCachePages() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    navigator.serviceWorker.ready
      .then((reg) => reg.active?.postMessage({ type: 'vider-pages' }))
      .catch(() => {
        // Pas de worker : rien en cache, rien à vider.
      })
  }, [])
  return null
}
