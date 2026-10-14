'use client'

import { forwardRef } from 'react'
import XpIcon from '@/components/ui/XpIcon'
import { cn } from '@/lib/utils'
import s from './BoutonsQuete.module.css'

// LE BOUTON D'UNE QUÊTE (03/10/2026, choisi par Lucas sur maquettes) :
// « Encaisser » est une pièce d'or qui saute devant ses rayons, l'ÉCLAIR
// d'XP dedans et « +N » dessous (la gemme jusqu'au 04/10/2026 : les quêtes ne
// paient plus qu'en XP, 557). Animations en transform et opacité seulement.
// « Y aller » (un rond violet à flèche) a disparu le 14/10/2026 : dans la
// feuille « le coffre d'abord », toute la ligne d'une quête est le lien.

/** Encaisser : l'éclair qui saute, sur ses rayons qui tournent. */
export const BoutonEncaisser = forwardRef<
  HTMLButtonElement,
  { xp: number; onClick: () => void; disabled?: boolean }
>(function BoutonEncaisser({ xp, onClick, disabled }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={s.cristal}
      aria-label={`Encaisser ${xp} XP`}
    >
      <span className={s.cristalRayons} aria-hidden="true" />
      <span className={cn('olympe-gold', s.cristalDisque)}>
        <XpIcon className="size-8" />
      </span>
      <span className={s.cristalEtiquette}>+{xp}</span>
    </button>
  )
})
