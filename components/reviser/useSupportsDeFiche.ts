'use client'

import { useCallback, useState, useTransition } from 'react'
import { chapterSupports } from '@/app/reviser/[subject]/supports-actions'
import type { SupportChip } from '@/lib/subject-template'

/**
 * LA FICHE DÉPLIÉE, et ses supports — l'état commun à la liste du programme
 * (`ChapterList`) et à la grille des thèmes (`ProgrammeMondes`).
 *
 * UNE SEULE FICHE À LA FOIS : laisser tout ouvert ferait une page à rallonge où
 * l'on perdrait la ligne qu'on vient d'ouvrir. Ouvrir une fiche referme la
 * précédente. Les supports déjà chargés sont gardés pour la session : replier
 * puis rouvrir une fiche ne redemande rien au serveur.
 */
export function useSupportsDeFiche(subjectSlug: string) {
  const [fiche, setFiche] = useState<string | null>(null)
  const [supports, setSupports] = useState<Record<string, SupportChip[]>>({})
  const [chargement, setChargement] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  const charger = useCallback(
    (id: string) => {
      if (supports[id]) return
      setChargement(id)
      startTransition(async () => {
        const chips = await chapterSupports(subjectSlug, id)
        setSupports((s) => ({ ...s, [id]: chips }))
        setChargement((c) => (c === id ? null : c))
      })
    },
    [supports, subjectSlug],
  )

  /** Déplie la fiche, ou la replie si c'est déjà elle. */
  const basculer = useCallback(
    (id: string) => {
      if (fiche === id) {
        setFiche(null)
        return
      }
      setFiche(id)
      charger(id)
    },
    [fiche, charger],
  )

  /** Déplie la fiche sans jamais la replier (la carte « Reprendre » y conduit). */
  const ouvrir = useCallback(
    (id: string) => {
      setFiche(id)
      charger(id)
    },
    [charger],
  )

  const fermer = useCallback(() => setFiche(null), [])

  return { fiche, supports, chargement, basculer, ouvrir, fermer }
}
