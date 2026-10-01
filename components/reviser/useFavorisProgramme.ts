'use client'

import { useCallback, useSyncExternalStore } from 'react'
import {
  abonnerFavoris,
  choixServeur,
  ecrireChoix,
  lireChoix,
} from '@/lib/reviser/favoris'
import { basculerFavori, type ChoixFavoris } from '@/lib/reviser/programme'
import type { ChapterExamHint } from '@/lib/subject-template'

/**
 * Les thèmes favoris d'un dossier (matière + classe), lus dans le navigateur.
 *
 * `useSyncExternalStore` : l'instantané serveur est vide, celui du navigateur
 * arrive à l'hydratation sans avertissement de React — et une étoile touchée
 * dans un autre onglet se voit ici aussi.
 */
export function useFavorisProgramme(
  dossier: string,
): [ChoixFavoris, (monde: { cle: string; controle: ChapterExamHint | null }) => void] {
  const choix = useSyncExternalStore(
    abonnerFavoris,
    () => lireChoix(dossier),
    choixServeur,
  )
  const basculer = useCallback(
    (monde: { cle: string; controle: ChapterExamHint | null }) => {
      ecrireChoix(dossier, basculerFavori(monde, lireChoix(dossier)))
    },
    [dossier],
  )
  return [choix, basculer]
}
