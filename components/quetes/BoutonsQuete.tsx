'use client'

import Link from 'next/link'
import { forwardRef } from 'react'
import { ArrowRight } from 'lucide-react'
import XpIcon from '@/components/ui/XpIcon'
import { cn } from '@/lib/utils'
import s from './BoutonsQuete.module.css'

// LES BOUTONS D'UNE QUÊTE (03/10/2026, choisis par Lucas sur maquettes) :
// « Y aller » est un rond violet dont la flèche pousse vers la droite ;
// « Encaisser » est une pièce d'or qui saute devant ses rayons, l'ÉCLAIR
// d'XP dedans et « +N » dessous (la gemme jusqu'au 04/10/2026 : les quêtes ne
// paient plus qu'en XP, 557). Animations en transform et opacité seulement.

/** Y aller : un rond violet, la flèche qui pousse. Le texte part dans l'aria-label. */
export function BoutonAller({ href, titre, onClick }: { href: string; titre: string; onClick?: () => void }) {
  return (
    <Link href={href} onClick={onClick} className={s.aller} aria-label={`Y aller : ${titre}`}>
      <ArrowRight className={cn('size-5', s.allerFleche)} strokeWidth={3} aria-hidden="true" />
    </Link>
  )
}

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
