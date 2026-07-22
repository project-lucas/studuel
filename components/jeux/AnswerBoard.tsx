'use client'

import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { GameLayout } from '@/lib/jeux/formats'

/**
 * Le plateau de réponses d'un jeu de salon, dans la disposition que son format
 * demande. Trois dispositions, parce que trois façons de LIRE :
 *
 * - `grille` : 2×2, réponses courtes (une capitale, un résultat, un symbole) —
 *   le regard balaye les quatre cases d'un coup ;
 * - `liste`  : pleine largeur, réponses longues (une phrase, une définition) —
 *   on lit ligne par ligne, sans coupure ;
 * - `duo`    : deux grandes plaques, choix binaire — on tranche, on ne compare
 *   pas quatre options.
 *
 * La ROBE vient du thème du jeu (`--jeu-accent`), mais le verdict garde les
 * couleurs de l'app : vert = juste, corail = faux, partout et pour toujours.
 * Un élève ne doit jamais avoir à réapprendre ce que veut dire une couleur.
 */
export default function AnswerBoard({
  options,
  correctIndex,
  selected,
  revealed,
  layout,
  onAnswer,
}: {
  options: string[]
  correctIndex: number
  /** Réponse choisie, ou null. */
  selected: number | null
  /** La correction est-elle dévoilée ? (vrai aussi quand le chrono a expiré) */
  revealed: boolean
  layout: GameLayout
  onAnswer: (index: number) => void
}) {
  const grid = layout === 'grille'
  const duo = layout === 'duo'

  return (
    <div
      className={cn(
        'grid gap-2.5',
        grid && 'grid-cols-2',
        duo && 'grid-cols-1 gap-3 sm:grid-cols-2',
        layout === 'liste' && 'grid-cols-1',
      )}
    >
      {options.map((option, i) => {
        const isCorrect = i === correctIndex
        const isSelected = i === selected
        const showGood = revealed && isCorrect
        const showBad = revealed && isSelected && !isCorrect
        const faded = revealed && !isCorrect && !isSelected

        return (
          <button
            key={i}
            type="button"
            disabled={revealed || selected !== null}
            onClick={() => onAnswer(i)}
            className={cn(
              'relative flex items-center gap-2 rounded-2xl border-2 bg-card font-semibold transition-all',
              // Rythme propre à la disposition.
              grid && 'min-h-20 justify-center px-3 py-4 text-center text-base',
              duo &&
                'min-h-28 justify-center px-4 py-6 text-center text-xl sm:min-h-32 sm:text-2xl',
              layout === 'liste' &&
                'min-h-14 justify-between px-4 py-3 text-left text-sm',
              // Repos : liseré dans la couleur du jeu, très discret.
              !revealed &&
                selected === null && [
                  'border-[color:var(--jeu-accent)]/25 shadow-sm',
                  'hover:border-[color:var(--jeu-accent)]/70 hover:shadow-md active:scale-[0.98]',
                ],
              showGood && 'border-success bg-success/10 text-success',
              showBad && 'border-destructive bg-destructive/10 text-destructive',
              faded && 'opacity-45',
              'disabled:cursor-default',
            )}
          >
            <span className="min-w-0 text-balance">{option}</span>
            {showGood ? (
              <Check className="size-5 shrink-0" strokeWidth={3} aria-hidden="true" />
            ) : null}
            {showBad ? (
              <X className="size-5 shrink-0" strokeWidth={3} aria-hidden="true" />
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
