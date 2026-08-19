'use client'

import { useCallback, useRef, useState } from 'react'
import {
  recordChallenge,
  recordGameTrophies,
  type GameTrophyOutcome,
} from '@/app/defi/actions'
import { programmeSlug } from '@/lib/jeux/programme'

// Le COMPTE RENDU d'une partie de salon : ce que le serveur en retient (l'XP)
// et ce qu'elle rapporte sur la Route des trophées (le compteur du couple
// matière × jeu).
//
// Pourquoi un hook. Les quatre tables de jeu (GameTable, OrderTable,
// CountdownTable, AnatomyTable) portaient le MÊME bloc recopié : deux états,
// un compteur de partie, l'appel à `recordChallenge` et sa garde anti-réponse-
// périmée. Y ajouter les trophées aurait fait quatre copies d'un quatrième
// état et d'un second aller-retour. Le bloc vit donc ici, une fois.
//
// LA GARDE ANTI-RÉPONSE PÉRIMÉE. Un élève qui relance immédiatement peut voir
// la réponse serveur de la partie PRÉCÉDENTE arriver après le lancement de la
// suivante : sans le numéro de partie, elle repeindrait l'écran de fin de la
// nouvelle avec les trophées de l'ancienne. Chaque `reset()` incrémente ce
// numéro et les réponses en retard sont ignorées.

export type GameReport = {
  /** Partie enregistrée côté serveur : null tant que la réponse n'est pas là. */
  saved: boolean | null
  /** XP réellement versée, telle que renvoyée par le serveur (null en attente). */
  awardedXp: number | null
  /** Mouvement de trophées, ou null (visiteur, refus serveur, ou en attente). */
  trophies: GameTrophyOutcome
  /** À appeler à la fin d'une partie. */
  report: (run: {
    correct: number
    answered: number
    score: number
    status: string
  }) => void
  /** À appeler au relancement, avant de rejouer. */
  reset: () => void
}

/**
 * @param subject Nom affiché de la matière — converti en slug pour le serveur,
 *   qui n'indexe QUE par slug (cf. migration 238).
 * @param gameId  Id du jeu (`format.id`).
 */
export function useGameReport(subject: string, gameId: string): GameReport {
  const [saved, setSaved] = useState<boolean | null>(null)
  const [awardedXp, setAwardedXp] = useState<number | null>(null)
  const [trophies, setTrophies] = useState<GameTrophyOutcome>(null)
  const partieRef = useRef(0)

  const report = useCallback(
    (run: { correct: number; answered: number; score: number; status: string }) => {
      const partie = partieRef.current
      const fresh = () => partie === partieRef.current

      // L'XP est recalculée côté serveur depuis score/total. Pas de mode passé :
      // les bonus de mode appartiennent à l'Arène, pas aux salons.
      recordChallenge(run.correct, run.answered)
        .then((r) => {
          if (!fresh()) return
          setSaved(r.saved)
          if (r.saved) setAwardedXp(r.xp)
        })
        .catch(() => {
          if (fresh()) setSaved(false)
        })

      // Les trophées sont un aller-retour SÉPARÉ, lancé en parallèle : le
      // serveur peut refuser le mouvement (couple hors catalogue, borne de
      // rythme) sans que la partie cesse de compter pour l'XP et la série.
      recordGameTrophies(
        programmeSlug(subject),
        gameId,
        run.status === 'won',
        run.score,
      )
        .then((outcome) => {
          if (fresh()) setTrophies(outcome)
        })
        .catch(() => {
          // Un échec de trophées n'a rien à dire à l'élève : l'écran de fin
          // n'affiche simplement pas la ligne.
        })
    },
    [subject, gameId],
  )

  const reset = useCallback(() => {
    setSaved(null)
    setAwardedXp(null)
    setTrophies(null)
    partieRef.current += 1
  }, [])

  return { saved, awardedXp, trophies, report, reset }
}
