import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Une ligne de réglage à interrupteur (page Compte) : pastille d'icône,
 * libellé, état en phrase, et l'interrupteur dessiné — le geste qu'un élève
 * connaît de son téléphone, qui dit son état sans être lu.
 */
export default function LigneInterrupteur({
  on,
  onBasculer,
  icone,
  titre,
  etat,
  className,
}: {
  on: boolean
  onBasculer: () => void
  icone: ReactNode
  titre: string
  etat: string
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onBasculer}
      aria-pressed={on}
      className={cn(
        'carte focus-visible:ring-primary/50 flex w-full cursor-pointer items-center gap-3 p-4 text-left focus-visible:ring-2 focus-visible:outline-none',
        className,
      )}
    >
      <span
        className={cn(
          'flex size-9 shrink-0 items-center justify-center rounded-lg',
          on ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground',
        )}
      >
        {icone}
      </span>
      <span className="min-w-0 flex-1">
        <span className="titre-section block">{titre}</span>
        <span className="text-muted-foreground mt-0.5 block text-sm font-semibold">{etat}</span>
      </span>
      <span
        aria-hidden="true"
        className={cn(
          'flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors',
          on ? 'bg-primary' : 'bg-muted-foreground/30',
        )}
      >
        <span className={cn('size-5 rounded-full bg-white shadow-sm transition-transform', on && 'translate-x-5')} />
      </span>
    </button>
  )
}
