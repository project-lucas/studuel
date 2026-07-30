'use client'

import { useSyncExternalStore } from 'react'

/**
 * Une horloge qui bat, pour les comptes à rebours rendus côté serveur.
 *
 * Le problème : un « il reste 42 min » calculé au rendu serveur se périme à la
 * seconde suivante, et recalculer `Date.now()` pendant le rendu casserait
 * l'hydratation (serveur et client ne voient pas la même milliseconde).
 *
 * La réponse idiomatique n'est pas un `useEffect` qui pose un état (cascade de
 * rendus), c'est un ABONNEMENT à une source externe — ici le temps. Le
 * « snapshot » est quantifié sur le pas de l'horloge pour rester référentiel-
 * lement stable entre deux battements, et vaut `null` côté serveur : le premier
 * rendu affiche la valeur figée du serveur, le client prend le relais ensuite.
 *
 * @param stepMs pas de l'horloge (30 000 = une mise à jour toutes les 30 s).
 */
export function useClock(stepMs: number): number | null {
  return useSyncExternalStore(
    (onChange) => {
      const id = window.setInterval(onChange, stepMs)
      return () => window.clearInterval(id)
    },
    () => Math.floor(Date.now() / stepMs) * stepMs,
    () => null,
  )
}

/** Pas par défaut des comptes à rebours en minutes : une demi-minute. */
export const CLOCK_STEP_MS = 30_000
