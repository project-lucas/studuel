'use client'

import { useEffect } from 'react'
import { toucherLigue } from '@/app/amis/ligue-actions'
import { annoncerBilanLigue, annoncerCoffrePret } from '@/lib/ligue'

/** Pas plus d'un réveil par quart d'heure : la clôture n'a lieu qu'une fois par semaine. */
const INTERVALLE_MS = 15 * 60_000
const CLE = 'studuel-ligue-touchee'

function lire(cle: string): string | null {
  try {
    return sessionStorage.getItem(cle)
  } catch {
    return null
  }
}

function ecrire(cle: string, valeur: string): void {
  try {
    sessionStorage.setItem(cle, valeur)
  } catch {
    // stockage indisponible : on réveillera un peu plus souvent, rien de plus
  }
}

/**
 * LE RÉVEIL DE LA LIGUE. La ligue de la semaine (migration 376) se clôture
 * paresseusement, joueur par joueur : sans ce réveil, un élève qui gagne de
 * l'XP sans ouvrir l'onglet Amis n'entrerait jamais dans son groupe, et le
 * coffre d'équipe de sa semaine ne serait jamais enregistré. Il se lance au
 * chargement et à chaque retour dans l'app, au plus une fois par quart d'heure,
 * et annonce si un bilan attend ou si un coffre est prêt à ouvrir (la pastille
 * de l'onglet Amis, NavAmisBadge). Ne rend rien.
 */
export default function LigueVeille() {
  useEffect(() => {
    const reveiller = () => {
      if (document.visibilityState !== 'visible') return
      const derniere = Number(lire(CLE) ?? 0)
      // Réveil trop récent : l'état annoncé est retenu (lib/ligue), rien à refaire.
      if (Date.now() - derniere < INTERVALLE_MS) return
      ecrire(CLE, String(Date.now()))
      void toucherLigue()
        .then(({ bilan, coffre }) => {
          annoncerBilanLigue(bilan)
          annoncerCoffrePret(coffre)
        })
        .catch(() => {
          // réseau : on retentera au prochain retour
        })
    }
    reveiller()
    document.addEventListener('visibilitychange', reveiller)
    return () => document.removeEventListener('visibilitychange', reveiller)
  }, [])
  return null
}
