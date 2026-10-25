'use client'

import { useState } from 'react'
import ChoixPortrait from '@/components/avatar/ChoixPortrait'
import type { PortraitKey } from '@/lib/portraits'
import { toast } from '@/lib/toast'

/**
 * L'aperçu du gabarit de choix de portrait, sans compte : le choix vit dans
 * l'état local, « Confirmer » ne fait qu'un toast. `initial` : le portrait
 * déjà choisi (null → l'écran vide, celui du premier passage de l'onboarding).
 */
export default function ApercuChoix({ initial }: { initial: PortraitKey | null }) {
  const [choisi, setChoisi] = useState<PortraitKey | null>(initial)
  return (
    <ChoixPortrait
      choisi={choisi}
      onChoisir={setChoisi}
      onConfirmer={() => toast(`Portrait ${choisi} confirmé (aperçu).`)}
    />
  )
}
