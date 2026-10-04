'use client'

import { useState, type ReactNode } from 'react'
import Feuille from '@/components/boutique/Feuille'
import { useFermeAuMasquage } from '@/components/useFermeAuMasquage'
import { sfx } from '@/lib/sounds'
import tableau from '@/components/moi/TableauDeBord.module.css'

/**
 * UN COIN DE PAGE QUI OUVRE SON DÉTAIL. La page du carnet montre l'essentiel ;
 * au toucher, le bloc entier (`detail`) s'ouvre dans une feuille — le rythme
 * des huit semaines, le classement et sa foule, les couronnes, le palmarès.
 * Rien de ce que l'onglet montrait avant le carnet n'est perdu.
 *
 * Un glissé qui tourne la page ne l'ouvre pas : le carnet avale le clic qui
 * suit un geste (Carnet.tsx, `onClickCapture`).
 */
export default function Ouvrir({
  label,
  titre,
  detail,
  className,
  children,
}: {
  /** Ce que le bouton dit au lecteur d'écran : ce qu'il montre et ce qu'il ouvre. */
  label: string
  /** Le nom de la feuille. */
  titre: string
  detail: ReactNode
  className?: string
  children: ReactNode
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
        className={className}
      >
        {children}
      </button>
      <Feuille open={ouvert} onClose={() => setOuvert(false)} label={titre}>
        <div className={tableau.detail}>{detail}</div>
      </Feuille>
    </>
  )
}
