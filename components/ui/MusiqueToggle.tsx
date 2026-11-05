'use client'

import { useSyncExternalStore } from 'react'
import { Music, Music2 } from 'lucide-react'
import LigneInterrupteur from '@/components/ui/LigneInterrupteur'
import { getMusiqueOnServer, isMusiqueOn, setMusiqueOn, subscribeMusique } from '@/lib/musique'

/**
 * Le réglage « Musique » (05/11/2026), à part des effets : on peut garder les
 * sons des réponses et couper la musique de l'arène et des combats, ou
 * l'inverse (lib/musique).
 */
export default function MusiqueToggle({ className }: { className?: string }) {
  const on = useSyncExternalStore(subscribeMusique, isMusiqueOn, getMusiqueOnServer)
  return (
    <LigneInterrupteur
      on={on}
      onBasculer={() => setMusiqueOn(!on)}
      icone={on ? <Music className="size-4" strokeWidth={2.4} aria-hidden="true" /> : <Music2 className="size-4 opacity-50" strokeWidth={2.4} aria-hidden="true" />}
      titre="Musique"
      etat={on ? 'Activée — l’arène, les combats et la victoire.' : 'Coupée — aucune musique, les effets restent.'}
      className={className}
    />
  )
}
