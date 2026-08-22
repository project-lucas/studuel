'use client'

import { useCallback, useRef, useState } from 'react'
import { recordUltimeRun } from '@/app/defi/ultime-actions'
import type { UltimeStanding } from '@/lib/jeux/ultime-standing'
import type { GameRun } from '@/lib/jeux/run'

export type UltimeResult = {
  /** Niveau atteint (0-based, comme `run.step`). */
  level: number
  /** Cote et rangs, ou null : en attente, ou migration 314 pas encore exécutée. */
  standing: UltimeStanding | null
}

/**
 * Le versant CLIENT de l'épreuve ultime : la partie terminée part au serveur,
 * qui recalcule la cote et rend les deux rangs (mondial, classe).
 *
 * Tout est ici côté serveur, contrairement aux étoiles : une cote n'a de sens
 * QUE comparée aux autres, il n'y a donc rien à garder en local — et un
 * classement mondial calculé dans le navigateur ne voudrait rien dire.
 *
 * Même garde anti-réponse-périmée que `useGameReport` : un élève qui relance
 * aussitôt ne doit pas voir la place de la partie précédente s'afficher sur la
 * suivante.
 */
export function useUltimeRun(gameId: string, active: boolean) {
  const [result, setResult] = useState<UltimeResult | null>(null)
  const partieRef = useRef(0)

  const record = useCallback(
    (run: GameRun, elapsedMs?: number | null) => {
      if (!active) return
      // Le niveau s'affiche TOUT DE SUITE, sans attendre le serveur : c'est le
      // seul chiffre qui compte à l'écran, et il est déjà connu.
      setResult({ level: run.step, standing: null })
      if (!elapsedMs || elapsedMs <= 0) return
      const partie = partieRef.current
      recordUltimeRun(gameId, run.step, elapsedMs)
        .then((standing) => {
          if (partie !== partieRef.current || !standing) return
          setResult({ level: run.step, standing })
        })
        .catch(() => {
          // Migration 314 pas encore passée, ou réseau : le niveau atteint
          // s'affiche seul, sans cote ni classement.
        })
    },
    [gameId, active],
  )

  const reset = useCallback(() => {
    setResult(null)
    partieRef.current += 1
  }, [])

  return { result, record, reset }
}
