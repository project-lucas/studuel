'use client'

import { useSyncExternalStore } from 'react'
import { ETAT_TOUT_OUVERT, type EtatDecouverte } from '@/lib/decouverte/etat'
import type { OngletVerrouillable } from '@/lib/decouverte/catalogue'

// LE MAGASIN DE LA DÉCOUVERTE PROGRESSIVE, CÔTÉ NAVIGATEUR (25/10/2026). Une
// seule copie pour tout l'écran : la barre d'onglets (les cadenas), la feuille
// de verrou et le lanceur de mini-tours lisent la même chose. Rempli par
// DecouverteVeille, que TopHudLoader rend avec l'état lu au serveur dans la
// vague du bandeau ; corrigé sur place quand un mini-tour vient d'être joué.
//
// Au départ : TOUT OUVERT. Tant que le serveur n'a rien dit, aucun cadenas —
// jamais un verrou par accident.

type Etat = {
  decouverte: EtatDecouverte
  /** L'onglet dont la feuille « Se débloque au niveau N » est ouverte. */
  verrouOuvert: OngletVerrouillable | null
  /** Posé par une page d'aperçu (/dev) : le serveur ne reprend plus la main. */
  fige: boolean
}

let etat: Etat = { decouverte: ETAT_TOUT_OUVERT, verrouOuvert: null, fige: false }
const abonnes = new Set<() => void>()

function publier(suite: Etat): void {
  etat = suite
  for (const f of abonnes) f()
}

function abonner(f: () => void): () => void {
  abonnes.add(f)
  return () => abonnes.delete(f)
}

export function useEtatDecouverte(): EtatDecouverte {
  return useSyncExternalStore(abonner, () => etat.decouverte, () => ETAT_TOUT_OUVERT)
}

export function useVerrouOuvert(): OngletVerrouillable | null {
  return useSyncExternalStore(abonner, () => etat.verrouOuvert, () => null)
}

/** Ce que le serveur a lu (DecouverteVeille). Ignoré si une page d'aperçu a figé l'état. */
export function poserEtatDecouverte(decouverte: EtatDecouverte): void {
  if (etat.fige) return
  publier({ ...etat, decouverte })
}

/** Un mini-tour vient d'être joué : l'onglet s'ouvre tout de suite, sans attendre la base. */
export function marquerVueEnLocal(cle: string): void {
  const vues = etat.decouverte.vues
  if (vues.includes(cle)) return
  publier({ ...etat, decouverte: { ...etat.decouverte, vues: [...vues, cle] } })
}

export function ouvrirVerrou(onglet: OngletVerrouillable): void {
  if (etat.verrouOuvert !== onglet) publier({ ...etat, verrouOuvert: onglet })
}

export function fermerVerrou(): void {
  if (etat.verrouOuvert !== null) publier({ ...etat, verrouOuvert: null })
}

/** Pose un état d'exemple et le fige (pages d'aperçu `/dev/decouverte`, tests). */
export function semerEtatDecouverte(
  decouverte: EtatDecouverte,
  verrouOuvert: OngletVerrouillable | null = null,
): void {
  publier({ decouverte, verrouOuvert, fige: true })
}

/** Rend la main au serveur (tests). */
export function reinitialiserEtatDecouverte(): void {
  publier({ decouverte: ETAT_TOUT_OUVERT, verrouOuvert: null, fige: false })
}
