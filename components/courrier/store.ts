'use client'

import { useSyncExternalStore } from 'react'

// LE COMPTE DU COURRIER NON LU, CÔTÉ NAVIGATEUR (25/10/2026, migration 602).
// Une seule copie pour tout l'écran : le bouton flottant la lit, la boîte aux
// lettres la corrige sur place quand l'élève lit ou récupère. Remplie par le
// bouton lui-même (relecture de `/api/courrier` au lancement et au retour dans
// l'app), comme les quêtes. `null` : pas encore lu, ou pas de session.

type Etat = { nonLus: number | null }

let etat: Etat = { nonLus: null }
const abonnes = new Set<() => void>()

function publier(suite: Etat): void {
  etat = suite
  for (const f of abonnes) f()
}

function abonner(f: () => void): () => void {
  abonnes.add(f)
  return () => abonnes.delete(f)
}

const ETAT_SERVEUR: Etat = { nonLus: null }

export function useNonLusCourrier(): number | null {
  return useSyncExternalStore(abonner, () => etat.nonLus, () => ETAT_SERVEUR.nonLus)
}

/** Pose le compte (la boîte, après un geste ; l'aperçu `/dev/courrier`). */
export function poserNonLusCourrier(n: number | null): void {
  const propre = n === null ? null : Math.max(0, Math.floor(n))
  if (propre !== etat.nonLus) publier({ nonLus: propre })
}

let enCours: Promise<number | null> | null = null

/** Relit le compte. Deux demandes simultanées n'en font qu'une. */
export function relireCourrier(): Promise<number | null> {
  if (enCours) return enCours
  enCours = fetch('/api/courrier', { cache: 'no-store' })
    .then(async (r) => {
      if (r.status === 401) {
        poserNonLusCourrier(null)
        return null
      }
      if (!r.ok) return etat.nonLus
      const corps = (await r.json()) as { nonLus?: unknown }
      const n = Number(corps.nonLus)
      poserNonLusCourrier(Number.isFinite(n) ? n : 0)
      return etat.nonLus
    })
    .catch(() => etat.nonLus)
    .finally(() => {
      enCours = null
    })
  return enCours
}
