'use client'

import { useEffect } from 'react'
import { demanderMusique, type Piste } from '@/lib/musique'

/**
 * Demande une musique tant que l'écran est monté (lib/musique : la dernière
 * demande joue). `null` demande le SILENCE — la défaite. Sous `<Activity>`,
 * un onglet masqué démonte ses effets : sa musique s'arrête d'elle-même.
 */
export function useMusique(piste: Piste | null, boucle = true): void {
  useEffect(() => demanderMusique(piste, { boucle }), [piste, boucle])
}

/** La même chose en composant, pour une page serveur. Ne rend rien. */
export default function MusiqueDeFond({ piste, boucle = true }: { piste: Piste | null; boucle?: boolean }) {
  useMusique(piste, boucle)
  return null
}
