'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { comboLabel, comboTier, comboBreakLabel, COMBO_BREAK_MS } from '@/lib/juice'

// Badge de SÉRIE, partagé par les trois players (quiz, flashcards, révision)
// pour que la récompense ait exactement la même grammaire partout.
//
// Il porte aussi le DEUIL de la série : jusqu'ici, quand la série cassait, le
// badge disparaissait sans bruit — on perdait un « Inarrêtable ×8 » aussi
// discrètement qu'un « ×2 ». Or dans un jeu de série, c'est la peur de casser
// qui crée la tension. On fige donc brièvement un badge corail « Série perdue
// ×8 » à la place, puis on s'efface.
//
// À monter DANS la région `aria-live` du player (et à laisser toujours montée) :
// un lecteur d'écran n'annonce que le changement d'une région déjà présente.
export default function ComboBadge({
  streak,
  variant = 'clair',
}: {
  streak: number
  // 'arene' : sur le violet profond du quiz. 'clair' : sur fond crème.
  variant?: 'arene' | 'clair'
}) {
  const [broken, setBroken] = useState<number | null>(null)
  const [previous, setPrevious] = useState(streak)

  // Ajustement pendant le rendu (motif React documenté pour « réagir au
  // changement d'une prop ») plutôt qu'un effet : la valeur est disponible dès
  // le premier rendu, sans le flash d'un aller-retour d'effet.
  if (streak !== previous) {
    setPrevious(streak)
    // On ne pleure que les séries qui valaient un badge : « Série perdue ×1 »
    // serait du bruit.
    setBroken(streak === 0 && comboBreakLabel(previous) !== null ? previous : null)
  }

  // L'effet ne porte QUE la disparition différée du badge de deuil.
  useEffect(() => {
    if (broken === null) return
    const timer = setTimeout(() => setBroken(null), COMBO_BREAK_MS)
    return () => clearTimeout(timer)
  }, [broken])

  const arene = variant === 'arene'
  const shape = arene
    ? 'px-3 py-1 text-sm shadow-md'
    : 'px-2.5 py-0.5 text-xs'
  const base =
    'animate-in zoom-in-50 font-heading rounded-full font-extrabold duration-300'

  if (broken !== null) {
    return (
      <span
        className={cn(
          base,
          shape,
          arene
            ? 'bg-destructive text-destructive-foreground'
            : 'bg-destructive/10 text-destructive',
        )}
      >
        💔 {comboBreakLabel(broken)}
      </span>
    )
  }

  const label = comboLabel(streak)
  if (!label) return null
  const tier = comboTier(streak)

  return (
    <span
      className={cn(
        base,
        shape,
        arene
          ? tier === 'inarretable'
            ? 'bg-highlight text-foreground ring-2 ring-white/70'
            : tier === 'feu'
              ? 'bg-highlight text-foreground'
              : 'bg-white/20 text-primary-foreground'
          : tier === 'chaud'
            ? 'bg-primary/10 text-primary'
            : 'bg-highlight text-foreground shadow-sm',
      )}
    >
      {arene || tier !== 'chaud' ? '🔥 ' : ''}
      {label}
    </span>
  )
}
