'use client'

import { useEffect, useSyncExternalStore } from 'react'
import { demanderMusique, musiqueDansOnglet, subscribeMusique, type OngletMusique, type Piste } from '@/lib/musique'

/**
 * Demande une musique tant que l'écran est monté (lib/musique : la dernière
 * demande joue). `null` demande le SILENCE — la défaite. Sous `<Activity>`,
 * un onglet masqué démonte ses effets : sa musique s'arrête d'elle-même.
 * `actif` à faux : aucune demande du tout (ni musique ni silence).
 */
export function useMusique(piste: Piste | null, boucle = true, actif = true): void {
  useEffect(() => (actif ? demanderMusique(piste, { boucle }) : undefined), [piste, boucle, actif])
}

/**
 * La même chose en composant, pour une page serveur. Ne rend rien. Avec
 * `onglet`, la musique ne joue que si l'élève l'a laissée allumée pour cet
 * onglet (la rangée d'icônes de Paramètres, 05/11/2026).
 */
export default function MusiqueDeFond({
  piste,
  boucle = true,
  onglet,
}: {
  piste: Piste | null
  boucle?: boolean
  onglet?: OngletMusique
}) {
  const permise = useSyncExternalStore(
    subscribeMusique,
    () => (onglet ? musiqueDansOnglet(onglet) : true),
    () => false,
  )
  useMusique(piste, boucle, permise)
  return null
}
