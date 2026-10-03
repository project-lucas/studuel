'use client'

import { useSyncExternalStore } from 'react'
import { BONUS_STEP_ID, type QuetesDuJour } from '@/lib/quests'

// LE MAGASIN DES QUÊTES DU JOUR, CÔTÉ NAVIGATEUR (03/10/2026). Une seule copie
// pour tout l'écran : la pastille du bandeau, la feuille, la tuile de l'arène
// et le bandeau « Quête accomplie » lisent la même chose. Rempli par
// QuetesVeille (relecture de app/api/quetes), corrigé sur place quand
// l'élève encaisse.

type Etat = {
  quetes: QuetesDuJour | null
  feuilleOuverte: boolean
}

let etat: Etat = { quetes: null, feuilleOuverte: false }
const abonnes = new Set<() => void>()

function publier(suite: Etat): void {
  etat = suite
  for (const f of abonnes) f()
}

function abonner(f: () => void): () => void {
  abonnes.add(f)
  return () => abonnes.delete(f)
}

const lire = () => etat
const lireServeur = (): Etat => ({ quetes: null, feuilleOuverte: false })
const ETAT_SERVEUR = lireServeur()

/** Les quêtes du jour (null : pas encore lues, ou élève non connecté). */
export function useQuetesDuJour(): QuetesDuJour | null {
  return useSyncExternalStore(abonner, () => lire().quetes, () => ETAT_SERVEUR.quetes)
}

export function useFeuilleQuetesOuverte(): boolean {
  return useSyncExternalStore(abonner, () => lire().feuilleOuverte, () => false)
}

export function ouvrirFeuilleQuetes(): void {
  if (!etat.feuilleOuverte) publier({ ...etat, feuilleOuverte: true })
}

export function fermerFeuilleQuetes(): void {
  if (etat.feuilleOuverte) publier({ ...etat, feuilleOuverte: false })
}

let enCours: Promise<QuetesDuJour | null> | null = null

/** Relit les quêtes du jour. Deux demandes simultanées n'en font qu'une. */
export function relireQuetes(): Promise<QuetesDuJour | null> {
  if (enCours) return enCours
  enCours = fetch('/api/quetes', { cache: 'no-store' })
    .then(async (r) => {
      if (r.status === 401) {
        publier({ ...etat, quetes: null })
        return null
      }
      if (!r.ok) return etat.quetes
      const corps = (await r.json()) as QuetesDuJour
      publier({ ...etat, quetes: corps })
      return corps
    })
    .catch(() => etat.quetes)
    .finally(() => {
      enCours = null
    })
  return enCours
}

/** Après un encaissement : ces quêtes (et le coffre du jour) sont payées. */
export function marquerEncaissees(ids: readonly string[], coffre: boolean): void {
  const q = etat.quetes
  if (!q) return
  const encaissees = new Set(q.encaissees)
  for (const id of ids) encaissees.add(id)
  if (coffre) encaissees.add(BONUS_STEP_ID)
  publier({ ...etat, quetes: { ...q, encaissees: [...encaissees] } })
}

/** Pose un état d'exemple (pages d'aperçu `/dev/quetes`, tests). */
export function semerQuetes(quetes: QuetesDuJour | null, feuilleOuverte = false): void {
  publier({ quetes, feuilleOuverte })
}
