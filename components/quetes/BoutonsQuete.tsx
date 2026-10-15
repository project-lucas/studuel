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
//
// DEPUIS LE 14/10/2026 LES QUÊTES S'ENCAISSENT UNE À UNE (Lucas : « pour le
// côté dopamine ») : la pièce a trois humeurs.
//   · `appel`  — la prochaine à toucher : elle saute et une onde d'or bat
//                autour d'elle ;
//   · `repos`  — les suivantes : immobiles, elles attendent leur tour ;
//   · `charge` — le temps de la réponse du serveur : la pièce se ramasse et
//                ses rayons s'emballent, prête à exploser en éclairs.

export type HumeurPiece = 'appel' | 'repos' | 'charge'

/** Encaisser : l'éclair qui saute, sur ses rayons qui tournent. */
export const BoutonEncaisser = forwardRef<
  HTMLButtonElement,
  {
    xp: number
    onClick: () => void
    disabled?: boolean
    humeur?: HumeurPiece
    /** Le libellé lu par un lecteur d'écran (« Encaisser 30 XP » par défaut). */
    label?: string
    /** La grande pièce, sous le coffre. */
    grande?: boolean
  }
>(function BoutonEncaisser({ xp, onClick, disabled, humeur = 'appel', label, grande }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      disabled={disabled}
      data-humeur={humeur}
      className={cn(s.cristal, grande && s.grande)}
      aria-label={label ?? `Encaisser ${xp} XP`}
      aria-busy={humeur === 'charge' || undefined}
    >
      <span className={s.cristalOnde} aria-hidden="true" />
      <span className={s.cristalRayons} aria-hidden="true" />
      <span className={cn('olympe-gold', s.cristalDisque)}>
        <XpIcon className={grande ? 'size-10' : 'size-8'} />
      </span>
      <span className={s.cristalEtiquette}>+{xp}</span>
    </button>
  )
})
