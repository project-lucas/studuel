'use client'

import { useEffect } from 'react'
import { WifiOff } from 'lucide-react'
import { useEnLigne } from '@/components/useEnLigne'

/**
 * LE HORS-LIGNE (12/10/2026) — deux choses, montées une fois dans le layout :
 *
 *   1. l'ENREGISTREMENT du service worker (`public/sw.js`), au chargement de
 *      la page, pour tout le monde — jusque-là il ne s'enregistrait qu'au
 *      moment d'activer les rappels push. C'est lui qui garde les pages
 *      ouvertes et les sert sans réseau ;
 *   2. la PASTILLE « Hors connexion », sous le bandeau, tant que le réseau
 *      manque. Elle dit ce qui reste possible (« les cours déjà ouverts
 *      restent lisibles ») et disparaît d'elle-même au retour du réseau.
 *
 * Ne rend rien en ligne. Transform et opacité seulement (`pop-in`).
 */
export default function HorsLigne() {
  const enLigne = useEnLigne()

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    const enregistrer = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Sans worker, l'app marche comme avant : seulement pas de hors-ligne.
      })
    }
    // Après `load` : l'enregistrement ne doit pas concurrencer le premier
    // écran (le worker télécharge sa coquille à l'installation).
    if (document.readyState === 'complete') enregistrer()
    else window.addEventListener('load', enregistrer, { once: true })
    return () => window.removeEventListener('load', enregistrer)
  }, [])

  if (enLigne) return null

  return (
    <div
      role="status"
      aria-live="polite"
      data-hors-ligne=""
      // z-[60] : au-dessus du bandeau et des mondes plein écran (l'onboarding
      // est `fixed inset-0 z-50`, la pastille y passait dessous).
      className="pointer-events-none fixed inset-x-0 top-[calc(4rem+env(safe-area-inset-top))] z-[60] flex justify-center px-4"
    >
      <span className="pop-in pointer-events-auto flex max-w-sm items-center gap-2.5 rounded-2xl bg-foreground px-4 py-2 text-sm font-bold text-background shadow-lg">
        <WifiOff className="size-4 shrink-0 text-highlight" aria-hidden="true" />
        <span className="min-w-0 leading-snug">
          Hors connexion
          <span className="block text-xs font-semibold text-background/80">Les cours déjà ouverts restent lisibles</span>
        </span>
      </span>
    </div>
  )
}
