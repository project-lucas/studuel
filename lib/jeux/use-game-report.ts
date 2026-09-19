'use client'

import { useCallback, useRef, useState } from 'react'
import {
  recordChallenge,
  recordGameTrophies,
  type GameTrophyOutcome,
} from '@/app/defi/actions'
import { programmeSlug } from '@/lib/jeux/programme'
import type { Gain } from '@/lib/gains'
import { recordModeScore } from '@/app/defi/palmares-actions'
import { isJeuId } from '@/lib/palmares/epreuves'
import type { BilanPartie } from '@/lib/palmares/bilan'

// Le COMPTE RENDU d'une partie de salon : ce que le serveur en a RÉELLEMENT
// retiré (les gains versés) et ce qu'elle rapporte sur la Route des trophées
// (le compteur du couple matière × jeu).
//
// Pourquoi un hook. Les trois tables de jeu (GameTable, OrderTable,
// AnatomyTable) portaient le MÊME bloc recopié : deux états,
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
  /**
   * CE QUE LA PARTIE A RAPPORTÉ, tel que la base l'a écrit. Vide tant que le
   * serveur n'a pas répondu, et vide aussi quand il n'y a rien eu.
   *
   * ⚠️ IL N'Y A PLUS D'XP ICI, ET C'EST VOULU. Jouer n'acquiert rien depuis la
   * migration 348 : l'écran affichait un « +85 XP » calculé côté client que le
   * portefeuille ne versait pas. Reste ce qui tombe vraiment — la gemme du
   * palier de série, quand il tombe le jour de la partie.
   */
  gains: Gain[]
  /** Mouvement de trophées, ou null (visiteur, refus serveur, ou en attente). */
  trophies: GameTrophyOutcome
  /**
   * LE BILAN DU PALMARÈS (migration 355) : dernière fois, record, place de
   * la semaine dans ma classe, prochaine marche. Null tant que le serveur n'a
   * pas répondu — ou quand il n'a rien à dire (jeu hors catalogue, migration
   * pas passée, épreuve ultime qui a son propre classement).
   */
  bilan: BilanPartie | null
  /**
   * À appeler à la fin d'une partie. `elapsedMs` est la durée de la partie
   * (la table la tient depuis le GO) : sans elle, pas de score au Palmarès,
   * qui exige une durée plausible. `classe: false` retient le score (l'épreuve
   * ultime : sans plafond, elle a sa cote, cf. 314).
   */
  report: (
    run: { correct: number; answered: number; score: number; status: string },
    options?: { classe?: boolean; elapsedMs?: number | null },
  ) => void
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
  const [gains, setGains] = useState<Gain[]>([])
  const [trophies, setTrophies] = useState<GameTrophyOutcome>(null)
  const [bilan, setBilan] = useState<BilanPartie | null>(null)
  const partieRef = useRef(0)

  const report = useCallback(
    (
      run: { correct: number; answered: number; score: number; status: string },
      options?: { classe?: boolean; elapsedMs?: number | null },
    ) => {
      const partie = partieRef.current
      const fresh = () => partie === partieRef.current

      // LE PALMARÈS : le score de la partie rejoint l'échelle de la semaine
      // (record, place dans la classe, prochaine marche — migration 355).
      // Un aller-retour à part : le serveur peut n'avoir rien à dire sans
      // que la partie cesse de compter pour la série et les trophées.
      const elapsed = options?.elapsedMs ?? null
      if ((options?.classe ?? true) && elapsed !== null && elapsed > 0 && isJeuId(gameId)) {
        recordModeScore(gameId, run.score, elapsed)
          .then((b) => {
            if (fresh()) setBilan(b)
          })
          .catch(() => {
            // Pas de bilan : l'écran de fin n'affiche pas la ligne.
          })
      }

      // Pas de mode passé : les bonus de mode appartiennent à l'Arène, pas aux
      // salons.
      recordChallenge(run.correct, run.answered)
        .then((r) => {
          if (!fresh()) return
          setSaved(r.saved)
          if (r.saved) setGains(r.gains)
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
    setGains([])
    setTrophies(null)
    setBilan(null)
    partieRef.current += 1
  }, [])

  return { saved, gains, trophies, bilan, report, reset }
}
