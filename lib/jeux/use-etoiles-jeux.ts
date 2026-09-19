'use client'

import { useCallback, useRef, useSyncExternalStore } from 'react'
import { palierStorageKey, parseProgress, totalStars } from '@/lib/jeux/paliers'

// Instantané SERVEUR : on ne sait rien (le stockage local n'existe pas au rendu
// serveur). Constante de module → identité stable.
const INCONNU = null

/**
 * Les étoiles décrochées sur chacun de ces jeux (sur 15 : cinq paliers de trois
 * étoiles), lues dans le stockage local — ce qu'affiche le billet d'un jeu dans
 * « Modes de jeu », comme le compteur d'étoiles d'un mode de Clash Royale.
 *
 * Même outil que les records (`useRecords`) : `useSyncExternalStore`, et `null`
 * tant que le navigateur n'a pas parlé — le billet n'affiche alors aucun
 * compteur plutôt qu'un zéro faux.
 */
export function useEtoilesJeux(gameIds: readonly string[]): Record<string, number> | null {
  const signature = gameIds.join('|')
  const cache = useRef<{ signature: string; brut: string; valeur: Record<string, number> } | null>(
    null,
  )

  const subscribe = useCallback((onChange: () => void) => {
    window.addEventListener('storage', onChange)
    return () => window.removeEventListener('storage', onChange)
  }, [])

  const getSnapshot = useCallback(() => {
    const ids = signature ? signature.split('|') : []
    const valeurs = ids.map((id) => {
      try {
        return totalStars(parseProgress(window.localStorage.getItem(palierStorageKey(id))))
      } catch {
        // Stockage indisponible (navigation privée) : aucune étoile.
        return 0
      }
    })
    const brut = valeurs.join('|')
    const hit = cache.current
    if (hit && hit.signature === signature && hit.brut === brut) return hit.valeur
    const valeur: Record<string, number> = {}
    ids.forEach((id, i) => {
      valeur[id] = valeurs[i]
    })
    cache.current = { signature, brut, valeur }
    return valeur
  }, [signature])

  return useSyncExternalStore(subscribe, getSnapshot, () => INCONNU)
}
