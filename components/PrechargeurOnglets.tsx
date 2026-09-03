'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import type { PrefetchOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { isAppReady, onAppReady } from '@/lib/app-ready'
import {
  CADENCE_RONDE_MS,
  DELAI_APRES_INVALIDATION_MS,
  DELAI_APRES_NAVIGATION_MS,
  DELAI_PREMIER_PRECHARGEMENT_MS,
  PRECHARGEMENT_COMPLET,
  doitPrecharger,
  planifierRonde,
} from '@/lib/precharge-onglets'

/**
 * Les options passées au routeur pour un préchargement COMPLET. Le routeur
 * ne précharge par défaut qu'un squelette (`kind: 'auto'`) : pour une page
 * dynamique, c'est le `loading.tsx` seul, et l'élève attendrait quand même le
 * serveur en touchant l'onglet. Le mot est vérifié contre l'énumération de
 * Next par `lib/precharge-onglets.test.ts`.
 */
function optionsCompletes(onInvalidate?: () => void): PrefetchOptions {
  return { kind: PRECHARGEMENT_COMPLET, onInvalidate } as unknown as PrefetchOptions
}

/**
 * Précharge UN onglet, en entier, tout de suite. Sert à la barre d'onglets
 * dès que le doigt se pose (avant même le tap) : si la ronde n'est pas encore
 * passée ou si l'entrée a expiré, on gagne le temps du geste. Quand l'onglet
 * est déjà frais dans le cache du routeur, l'appel ne coûte rien.
 */
export function prechargerOnglet(
  router: ReturnType<typeof useRouter>,
  href: string,
): void {
  router.prefetch(href, optionsCompletes())
}

/** Les gestes qui prouvent que l'élève tient son téléphone. */
const GESTES: Array<keyof WindowEventMap> = [
  'pointerdown',
  'touchstart',
  'keydown',
  'scroll',
]

/**
 * LE PRÉCHARGEUR D'ONGLETS — pour que toucher un onglet l'ouvre sans attendre.
 *
 * Monté une fois dans le layout racine, ne rend rien. Il applique la règle de
 * `lib/precharge-onglets` : une fois le premier écran peint, il demande au
 * routeur les quatre autres onglets, un par un, espacés ; puis il repasse à
 * cadence lente pour rafraîchir ce qui a expiré (le cache du routeur tranche :
 * un onglet frais ne coûte aucune requête). Il s'arrête de lui-même quand
 * l'app n'est pas visible, hors d'un onglet, ou quand l'élève n'a plus touché
 * l'écran depuis un moment.
 *
 * Quand une action serveur invalide le cache (XP gagnée, achat…), le routeur
 * le signale par `onInvalidate` : on relance alors une ronde, après un court
 * délai pour ne pas courir derrière chaque écriture.
 */
export default function PrechargeurOnglets() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    let derniereActivite = Date.now()
    const timers = new Set<ReturnType<typeof setTimeout>>()
    let rondeApresInvalidation: ReturnType<typeof setTimeout> | null = null
    let arrete = false

    const plusTard = (fn: () => void, ms: number) => {
      const id = setTimeout(() => {
        timers.delete(id)
        if (!arrete) fn()
      }, ms)
      timers.add(id)
      return id
    }

    const contexte = () => ({
      pathname,
      visible: document.visibilityState === 'visible',
      derniereActiviteMs: derniereActivite,
      nowMs: Date.now(),
    })

    const surInvalidation = () => {
      // Une seule ronde en attente à la fois, quel que soit le nombre
      // d'entrées invalidées d'un coup.
      if (rondeApresInvalidation !== null) return
      rondeApresInvalidation = plusTard(() => {
        rondeApresInvalidation = null
        ronde(0)
      }, DELAI_APRES_INVALIDATION_MS)
    }

    /** Une ronde : les autres onglets, un par un, à partir de `delaiInitialMs`. */
    const ronde = (delaiInitialMs: number) => {
      if (!doitPrecharger(contexte())) return
      for (const { href, retardMs } of planifierRonde(pathname, delaiInitialMs)) {
        plusTard(() => {
          // Le contexte peut avoir changé entre la planification et l'envoi
          // (app passée en arrière-plan) : on revérifie au dernier moment.
          if (!doitPrecharger(contexte())) return
          router.prefetch(href, optionsCompletes(surInvalidation))
        }, retardMs)
      }
    }

    const noterGeste = () => {
      derniereActivite = Date.now()
    }
    for (const geste of GESTES) {
      window.addEventListener(geste, noterGeste, { passive: true })
    }

    // Revenir sur l'app (autre app, écran verrouillé) : ce qui a expiré entre
    // temps est rafraîchi tout de suite, sans attendre la prochaine ronde.
    const surVisibilite = () => {
      if (document.visibilityState === 'visible') {
        noterGeste()
        ronde(0)
      }
    }
    document.addEventListener('visibilitychange', surVisibilite)

    // Premier passage : après le premier écran peint (rideau compris), puis un
    // délai — la page où l'élève se trouve passe avant celles qu'il n'a pas
    // demandées. Aux navigations suivantes (cet effet se relance à chaque
    // changement de route) le signal est déjà donné et `onAppReady` rappelle
    // immédiatement : le délai est alors celui d'après navigation, plus court.
    const delai = isAppReady()
      ? DELAI_APRES_NAVIGATION_MS
      : DELAI_PREMIER_PRECHARGEMENT_MS
    const desabonner = onAppReady(() => ronde(delai))

    // Ronde de fraîcheur, à cadence lente.
    const cadence = setInterval(() => ronde(0), CADENCE_RONDE_MS)

    return () => {
      arrete = true
      desabonner()
      clearInterval(cadence)
      for (const id of timers) clearTimeout(id)
      timers.clear()
      document.removeEventListener('visibilitychange', surVisibilite)
      for (const geste of GESTES) {
        window.removeEventListener(geste, noterGeste)
      }
    }
  }, [router, pathname])

  return null
}
