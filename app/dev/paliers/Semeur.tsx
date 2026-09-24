'use client'

import { useState, type ReactNode } from 'react'
import { palierStorageKey, type PalierProgress } from '@/lib/jeux/paliers'

/** Une progression de démonstration : un palier fini, un en cours, un entamé. */
const PROGRESSION_JOUEE: PalierProgress = {
  1: { stars: 3, best: 5200, accuracy: 1, timeMs: 62_000 },
  2: { stars: 2, best: 3100, accuracy: 0.86, timeMs: 81_500 },
  3: { stars: 0, best: 900, accuracy: 0.4 },
}

/**
 * Pose (ou efface) la progression du jeu dans le stockage local AVANT que la
 * carte ne la lise — aperçu de développement seulement.
 */
export default function Semeur({
  jeu,
  joue,
  children,
}: {
  jeu: string
  joue: boolean
  children: ReactNode
}) {
  useState(() => {
    if (typeof window === 'undefined') return null
    try {
      if (joue) window.localStorage.setItem(palierStorageKey(jeu), JSON.stringify(PROGRESSION_JOUEE))
      else window.localStorage.removeItem(palierStorageKey(jeu))
    } catch {
      // stockage indisponible : la carte s'affiche vierge
    }
    return null
  })
  return children
}
