'use client'

import { useCallback, useRef, useSyncExternalStore } from 'react'
import { readRecordAt } from '@/lib/jeux/records'

// Instantané SERVEUR : aucun record. `localStorage` n'existe pas au rendu
// serveur, et rendre « Record 1 250 » d'un côté et rien de l'autre serait une
// divergence d'hydratation. Constante de module → identité stable, sans quoi
// useSyncExternalStore boucle.
const NO_RECORDS = null

/**
 * Les records personnels rangés sous ces clés, lus dans le stockage local.
 *
 * Le stockage local EST un système externe : on le lit avec l'outil prévu
 * (`useSyncExternalStore`), pas avec un effet qui pose un état. Bénéfice
 * concret : un record battu dans un autre onglet se répercute ici (événement
 * `storage`), et le rendu serveur reste honnête (`null` = on ne sait pas
 * encore, l'appelant n'affiche alors aucune pastille plutôt qu'un zéro faux).
 */
export function useRecords(keys: string[]): Record<string, number> | null {
  // Les clés changent d'identité à chaque rendu (tableau reconstruit) : on ne
  // travaille que sur leur CONTENU, qui lui ne bouge qu'au changement de
  // matière dans la roulette.
  const signature = keys.join('|')

  // L'instantané doit être STABLE tant que rien n'a bougé : on ne reconstruit
  // l'objet que si une valeur lue a réellement changé.
  const cache = useRef<{
    signature: string
    raw: string
    value: Record<string, number>
  } | null>(null)

  const subscribe = useCallback((onChange: () => void) => {
    // Les records posés par CET onglet ne déclenchent pas d'événement
    // `storage` (le navigateur ne se notifie pas lui-même) : les tables de jeu
    // remontent déjà leur propre record à l'écran de fin. Ici on ne capte que
    // les parties jouées dans un autre onglet.
    window.addEventListener('storage', onChange)
    return () => window.removeEventListener('storage', onChange)
  }, [])

  const getSnapshot = useCallback(() => {
    const list = signature ? signature.split('|') : []
    const values = list.map((key) => readRecordAt(key))
    const raw = values.join('|')
    const hit = cache.current
    if (hit && hit.signature === signature && hit.raw === raw) return hit.value
    const value: Record<string, number> = {}
    list.forEach((key, i) => {
      value[key] = values[i]
    })
    cache.current = { signature, raw, value }
    return value
  }, [signature])

  return useSyncExternalStore(subscribe, getSnapshot, () => NO_RECORDS)
}
