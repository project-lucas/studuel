'use client'

import { useCallback, useRef, useState } from 'react'
import { recordPalierTime } from '@/app/defi/palier-actions'
import {
  applyRun,
  readPalierProgress,
  writePalierProgress,
  type PalierOutcome,
  type PalierRun,
} from '@/lib/jeux/paliers'
import type { PalierTimeStanding } from '@/lib/jeux/palier-standing'
import type { GameRun } from '@/lib/jeux/run'

/**
 * Le versant CLIENT de l'échelle de paliers : la partie terminée est rangée
 * dans la progression locale, et l'écran de fin apprend ce qu'elle a rapporté —
 * les étoiles, le palier qu'elle vient d'ouvrir, le chrono, et la place que ce
 * chrono donne parmi tous les joueurs.
 *
 * Il vit ici plutôt que dans chaque table de jeu parce que les quatre tables
 * (QCM, ordre, compte, zones) terminent exactement de la même façon — c'est
 * déjà le cas du record personnel, juste à côté.
 *
 * La lecture se fait AU MOMENT d'enregistrer, jamais au montage : entre
 * l'ouverture de la table et la fin de la partie, le même jeu a pu être joué
 * dans un autre onglet.
 *
 * LA GARDE ANTI-RÉPONSE PÉRIMÉE, comme dans `useGameReport` : un élève qui
 * relance aussitôt peut voir la place de la partie PRÉCÉDENTE arriver après le
 * lancement de la suivante. Chaque `reset()` incrémente le numéro de partie et
 * les réponses en retard sont ignorées.
 */
export function usePalierRun(gameId: string, palier: PalierRun | null) {
  const [outcome, setOutcome] = useState<PalierOutcome | null>(null)
  const [standing, setStanding] = useState<PalierTimeStanding | null>(null)
  const partieRef = useRef(0)
  // Éclatées ici plutôt que lues dans le callback : deux nombres ont une
  // identité stable d'un rendu à l'autre, un objet de props non.
  const level = palier?.level ?? null
  const floor = palier?.floor ?? null

  const record = useCallback(
    (run: GameRun, elapsedMs?: number | null) => {
      // Un jeu HORS échelle (le « Programme » d'une matière, dont la difficulté
      // est le programme lui-même) ne compte pas d'étoiles : il n'a pas de
      // carte où les afficher, et en ranger en silence serait de la donnée morte.
      if (level === null || floor === null) return
      const { progress, outcome: next } = applyRun(
        readPalierProgress(gameId),
        floor,
        level,
        run,
        elapsedMs,
      )
      writePalierProgress(gameId, progress)
      setOutcome(next)

      // Le classement de rapidité est le SEUL morceau qui ne puisse pas se
      // calculer en local : il faut la distribution des autres joueurs. On ne
      // l'appelle que sur une partie chronométrée (donc gagnée), et son échec
      // ne coûte qu'une ligne à l'écran.
      if (next.timeMs === null) return
      const partie = partieRef.current
      recordPalierTime(gameId, level, next.timeMs)
        .then((place) => {
          if (partie === partieRef.current) setStanding(place)
        })
        .catch(() => {
          // Migration 313 pas encore passée, ou réseau : pas de pourcentage,
          // le chrono s'affiche seul.
        })
    },
    [gameId, floor, level],
  )

  /** Rejouer : l'écran de fin repart vierge (les étoiles gardées, elles, restent en base locale). */
  const reset = useCallback(() => {
    setOutcome(null)
    setStanding(null)
    partieRef.current += 1
  }, [])

  return { outcome, standing, record, reset }
}
