'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { SupportChip } from '@/lib/subject-template'

/**
 * LA FICHE DÉPLIÉE, et ses supports — l'état du sommaire d'une matière.
 *
 * UNE SEULE FICHE À LA FOIS : laisser tout ouvert ferait une page à rallonge où
 * l'on perdrait la ligne qu'on vient d'ouvrir. Ouvrir une fiche referme la
 * précédente. Les supports déjà chargés sont gardés pour la session : replier
 * puis rouvrir une fiche ne redemande rien au serveur.
 *
 * LA VITESSE (12/10/2026, Lucas : « la fluidité d'ouverture des blocs est un
 * peu lente, la rapidité doit être là ») : les supports sont lus par une ROUTE
 * (`/api/reviser/supports`, en parallèle de tout) et non plus une Server Action
 * (en file derrière toute écriture) ; et ils se PRÉPARENT à l'intention —
 * `preparer(id)` part quand le doigt se pose sur la ligne, une centaine de
 * millisecondes avant le tap, et pour la fiche à reprendre dès l'affichage.
 * Une requête en vol n'est jamais doublée.
 */
export function useSupportsDeFiche(
  subjectSlug: string,
  /** La fiche à préparer dès l'affichage : celle que l'élève reprend. */
  preparerDabord: string | null = null,
) {
  const [fiche, setFiche] = useState<string | null>(null)
  const [supports, setSupports] = useState<Record<string, SupportChip[]>>({})
  const [chargement, setChargement] = useState<string | null>(null)
  const enVol = useRef(new Map<string, Promise<SupportChip[]>>())
  const vivant = useRef(true)
  useEffect(() => {
    vivant.current = true
    return () => {
      vivant.current = false
    }
  }, [])

  /** Lit les supports de la fiche, une seule fois, sans l'ouvrir. */
  const preparer = useCallback(
    (id: string): Promise<SupportChip[]> => {
      const deja = enVol.current.get(id)
      if (deja) return deja
      const promesse = fetch(
        `/api/reviser/supports?matiere=${encodeURIComponent(subjectSlug)}&fiche=${encodeURIComponent(id)}`,
      )
        .then((r) => (r.ok ? (r.json() as Promise<SupportChip[]>) : []))
        .catch(() => [] as SupportChip[])
        .then((chips) => {
          if (vivant.current) setSupports((s) => (s[id] ? s : { ...s, [id]: chips }))
          return chips
        })
      enVol.current.set(id, promesse)
      return promesse
    },
    [subjectSlug],
  )

  useEffect(() => {
    if (preparerDabord) void preparer(preparerDabord)
  }, [preparerDabord, preparer])

  const charger = useCallback(
    (id: string) => {
      if (supports[id]) return
      setChargement(id)
      void preparer(id).then(() => {
        if (vivant.current) setChargement((c) => (c === id ? null : c))
      })
    },
    [supports, preparer],
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

  return { fiche, supports, chargement, basculer, ouvrir, fermer, preparer }
}
