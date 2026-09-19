'use client'

import { useState, useSyncExternalStore } from 'react'

const EVENEMENT = 'studuel:etat-local'

function abonner(rappel: () => void): () => void {
  window.addEventListener('storage', rappel)
  window.addEventListener(EVENEMENT, rappel)
  return () => {
    window.removeEventListener('storage', rappel)
    window.removeEventListener(EVENEMENT, rappel)
  }
}

/**
 * Un état d'outil gardé dans CE navigateur (liste cochée, planning rempli,
 * montants du budget). C'est une commodité : il peut revenir vide (navigation
 * privée, stockage bloqué), et l'outil marche quand même — l'état vit alors
 * en mémoire le temps de la visite.
 *
 * Lu par `useSyncExternalStore` (le stockage est une source EXTERNE) : pas de
 * `setState` dans un effet, et le rendu serveur voit l'état initial.
 */
export function useEtatLocal<T>(
  cle: string,
  initial: T,
  lire: (raw: unknown) => T,
): [T, (valeur: T) => void] {
  const stocke = useSyncExternalStore(
    abonner,
    () => {
      try {
        return window.localStorage.getItem(cle)
      } catch {
        return null
      }
    },
    () => null,
  )
  const [memoire, setMemoire] = useState<string | null>(null)
  const source = stocke ?? memoire

  let valeur = initial
  if (source !== null) {
    try {
      valeur = lire(JSON.parse(source))
    } catch {
      valeur = initial
    }
  }

  const ecrire = (suivante: T) => {
    const texte = JSON.stringify(suivante)
    setMemoire(texte)
    try {
      window.localStorage.setItem(cle, texte)
      window.dispatchEvent(new Event(EVENEMENT))
    } catch {
      // Pas de stockage : la mémoire de la visite suffit.
    }
  }

  return [valeur, ecrire]
}
