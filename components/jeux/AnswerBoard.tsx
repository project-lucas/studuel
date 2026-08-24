'use client'

import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { GameLayout } from '@/lib/jeux/formats'

/**
 * Le plateau de réponses PARTAGÉ par les jeux de salon et les sessions de quiz,
 * dans la disposition que le format demande.
 *
 * Il est né dans les jeux ; le quiz avait le sien, qui virait à l'APLAT vert ou
 * rouge saturé là où celui-ci teinte et cerne. Deux grammaires du même verdict
 * dans la même app, selon la porte par laquelle on entrait. Depuis le 22/08 il
 * n'y en a plus qu'une — et ce qu'on corrige ici profite aux deux écrans.
 *
 * Trois dispositions, parce que trois façons de LIRE :
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
  verrouillerAuChoix = true,
}: {
  options: string[]
  correctIndex: number
  /** Réponse choisie, ou null. */
  selected: number | null
  /** La correction est-elle dévoilée ? (vrai aussi quand le chrono a expiré) */
  revealed: boolean
  layout: GameLayout
  onAnswer: (index: number) => void
  /**
   * Le premier tap FIGE-t-il la réponse ?
   *
   * Vrai pour les jeux de salon, où le geste EST la réponse : on joue vite, et
   * pouvoir se raviser retirerait au chrono tout son sel. Faux pour le quiz
   * depuis qu'il a un bouton « Valider » — la sélection y est un brouillon, et
   * un brouillon qu'on ne peut pas corriger n'est pas un brouillon.
   */
  verrouillerAuChoix?: boolean
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
            disabled={revealed || (verrouillerAuChoix && selected !== null)}
            onClick={() => onAnswer(i)}
            className={cn(
              'relative flex items-center gap-2 rounded-2xl border-2 bg-card font-semibold transition-all',
              // Rythme propre à la disposition.
              grid && 'min-h-20 justify-center px-3 py-4 text-center text-base',
              duo &&
                'min-h-28 justify-center px-4 py-6 text-center text-xl sm:min-h-32 sm:text-2xl',
              layout === 'liste' &&
                'min-h-14 justify-between px-4 py-3 text-left text-sm',
              // REPOS : la plaque a une ÉPAISSEUR.
              // Le liseré était `--jeu-accent` à 25 % d'opacité, avec une ombre
              // douce : sur un fond clair et un accent pâle, il devenait
              // invisible. Les réponses se lisaient alors comme de simples
              // cartes blanches — la même surface que l'énoncé posé au-dessus,
              // et rien qui dise « touche-moi ».
              //
              // C'est le même remède que sur les plaques de l'arène et les
              // pilules de fin de quiz : un contour net, et une tranche pleine
              // sous le bouton. Elle s'enfonce au tap, ce qui donne le retour
              // tactile que `scale` seul ne donnait pas.
              !revealed &&
                selected === null && [
                  'border-black/10 shadow-[0_4px_0_0_rgba(0,0,0,0.07)]',
                  'hover:border-[color:var(--jeu-accent)]/60',
                  'active:translate-y-[3px] active:shadow-[0_1px_0_0_rgba(0,0,0,0.07)]',
                ],
              // CHOISIE, pas encore corrigée : le brouillon de l'élève. Sans
              // cet état, appuyer sur « Valider » se ferait à l'aveugle — rien
              // à l'écran ne disait ce qui allait être validé.
              !revealed &&
                isSelected &&
                'border-[color:var(--jeu-accent)] bg-[color:var(--jeu-accent)]/10 shadow-[0_4px_0_0_color-mix(in_oklab,var(--jeu-accent),black_18%)]',
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
