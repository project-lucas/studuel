'use client'

import { Clock } from 'lucide-react'
import { useWorkTimer } from './useWorkTimer'

// Chronomètre VISIBLE du Défi : démarre dès l'affichage de la page, ne compte
// que lorsque l'onglet est visible, et verse le temps mesuré au compteur de
// travail. La mécanique est partagée avec Réviser (useWorkTimer) ; ce
// composant n'ajoute que l'affichage.
export default function DefiTimer() {
  const seconds = useWorkTimer()

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')

  return (
    <div
      className="inline-flex w-fit items-center gap-3 rounded-2xl border bg-gradient-to-br from-card to-muted/50 px-3.5 py-2 shadow-sm"
      role="timer"
      aria-label={`Temps de travail de la session : ${mm} minutes ${ss} secondes`}
    >
      {/* Horloge dans une pastille, avec un point qui pulse au coin. */}
      <span className="relative flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Clock className="size-4.5" strokeWidth={2.2} />
        <span className="absolute -top-0.5 -right-0.5 flex size-2.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-highlight opacity-75" />
          <span className="relative inline-flex size-2.5 rounded-full bg-highlight ring-2 ring-card" />
        </span>
      </span>
      <span className="flex flex-col leading-tight">
        <span className="font-mono text-lg font-bold tabular-nums">
          {mm}:{ss}
        </span>
        <span className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
          Temps de travail
        </span>
      </span>
    </div>
  )
}
