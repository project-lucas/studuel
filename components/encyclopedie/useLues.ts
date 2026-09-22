'use client'

import { useSyncExternalStore } from 'react'
import { lireBrut, parserLues } from '@/lib/encyclopedie/lues'

// LES FICHES DÉJÀ LUES, lues depuis le navigateur — via `useSyncExternalStore`
// et non via un `useEffect` qui appellerait `setState`.
//
// Trois raisons, dans l'ordre d'importance :
//   1. `localStorage` EST un système externe : c'est exactement le cas d'usage
//      de ce hook, et l'ESLint du projet refuse le `setState` dans un effet
//      (cascade de rendus).
//   2. Le rendu serveur reçoit un instantané vide et stable, donc aucune
//      divergence d'hydratation à reprocher.
//   3. L'événement `storage` du navigateur nous est offert au passage : lire
//      une fiche dans un onglet coche la carte dans l'autre.
//
// `getSnapshot` DOIT renvoyer la MÊME référence tant que rien n'a changé, sinon
// React boucle à l'infini. D'où le cache comparé sur la chaîne brute : on ne
// refabrique l'ensemble que lorsque le stockage a vraiment bougé.

const VIDE: ReadonlySet<string> = new Set()

let cacheBrut: string | null | undefined
let cacheSet: ReadonlySet<string> = VIDE

function instantane(): ReadonlySet<string> {
  const brut = lireBrut()
  if (brut !== cacheBrut) {
    cacheBrut = brut
    cacheSet = new Set(parserLues(brut))
  }
  return cacheSet
}

function instantaneServeur(): ReadonlySet<string> {
  return VIDE
}

function abonner(prevenir: () => void): () => void {
  window.addEventListener('storage', prevenir)
  return () => window.removeEventListener('storage', prevenir)
}

export function useLues(): ReadonlySet<string> {
  return useSyncExternalStore(abonner, instantane, instantaneServeur)
}
