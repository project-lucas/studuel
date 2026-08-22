'use client'

import { useCallback, useRef, useSyncExternalStore } from 'react'
import {
  palierStorageKey,
  parseProgress,
  type PalierProgress,
} from '@/lib/jeux/paliers'

// Instantané SERVEUR : on ne sait rien. `localStorage` n'existe pas au rendu
// serveur, et dessiner trois étoiles pleines d'un côté et vides de l'autre
// serait une divergence d'hydratation. Constante de module → identité stable,
// sans quoi useSyncExternalStore boucle.
const UNKNOWN = null

/**
 * La progression d'un jeu sur l'échelle de paliers, lue dans le stockage local.
 *
 * Même outil que les records (`useRecords`) et pour les mêmes raisons : le
 * stockage local EST un système externe, on le lit avec `useSyncExternalStore`
 * et non avec un effet qui pose un état. Bénéfice concret ici : une étoile
 * décrochée dans un autre onglet apparaît sur la carte sans la recharger.
 *
 * `null` signifie « pas encore su », jamais « aucune étoile » : la carte dessine
 * alors une rangée vide de la bonne hauteur plutôt qu'un faux zéro.
 */
export function usePalierProgress(gameId: string): PalierProgress | null {
  const key = palierStorageKey(gameId)

  // L'instantané doit être STABLE tant que rien n'a bougé : on ne re-parse le
  // JSON que si la chaîne stockée a réellement changé.
  const cache = useRef<{ raw: string | null; value: PalierProgress } | null>(
    null,
  )

  const subscribe = useCallback((onChange: () => void) => {
    window.addEventListener('storage', onChange)
    return () => window.removeEventListener('storage', onChange)
  }, [])

  const getSnapshot = useCallback(() => {
    let raw: string | null = null
    try {
      raw = window.localStorage.getItem(key)
    } catch {
      // stockage indisponible (navigation privée) : aucune étoile à afficher
    }
    const hit = cache.current
    if (hit && hit.raw === raw) return hit.value
    const value = parseProgress(raw)
    cache.current = { raw, value }
    return value
  }, [key])

  return useSyncExternalStore(subscribe, getSnapshot, () => UNKNOWN)
}
