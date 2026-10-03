'use client'

import { useState, type ReactNode } from 'react'
import Feuille from '@/components/boutique/Feuille'
import { useFermeAuMasquage } from '@/components/useFermeAuMasquage'
import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'
import styles from '@/components/moi/TableauDeBord.module.css'

/**
 * UNE TUILE DU TABLEAU DE BORD QUI OUVRE SON DÉTAIL. La tuile montre un chiffre
 * (`apercu`) ; au toucher, le bloc entier (`children`) s'ouvre dans une
 * feuille : le classement et sa foule, les couronnes, le palmarès. L'écran
 * reste court, et rien de ce que l'onglet montrait n'est perdu.
 *
 * Le détail n'est monté qu'à l'ouverture : l'animation du classement rejoue
 * à chaque fois, et un onglet gardé caché ne garde pas de feuille ouverte.
 */
export default function TuileOuvrante({
  label,
  titreFeuille,
  apercu,
  children,
  className,
  etat,
}: {
  /** Ce que le bouton dit au lecteur d'écran : le chiffre et ce qu'il ouvre. */
  label: string
  /** Le nom de la feuille. */
  titreFeuille: string
  apercu: ReactNode
  children: ReactNode
  className?: string
  /** Posé en `data-etat` sur la tuile (le record battu se cercle d'or). */
  etat?: string
}) {
  const [ouvert, setOuvert] = useState(false)
  useFermeAuMasquage(setOuvert, false)

  return (
    <>
      <button
        type="button"
        onClick={() => {
          sfx.tap()
          setOuvert(true)
        }}
        aria-haspopup="dialog"
        aria-label={label}
        data-etat={etat}
        className={cn('carte', styles.tuile, className)}
      >
        {apercu}
      </button>
      <Feuille open={ouvert} onClose={() => setOuvert(false)} label={titreFeuille}>
        <div className={styles.detail}>{children}</div>
      </Feuille>
    </>
  )
}
