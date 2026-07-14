'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { rightColumnOrder, type Pair } from '@/lib/pair-match'

// Manche « Associe les paires » embarquable dans le Défi : deux colonnes
// (énoncés à gauche, réponses mélangées à droite). On clique un élément de
// chaque côté ; si ça correspond, la paire se verrouille en vert, sinon un bref
// retour rouge et on réessaie. Quand tout est associé, `onSolved(mistakes)` est
// appelé (le Défi en tire les points). La logique de mélange/paires est pure
// (lib/pair-match) ; ici, seul l'état d'interaction.
export default function PairMatch({
  pairs,
  seed,
  onSolved,
}: {
  pairs: Pair[]
  seed: string
  onSolved: (mistakes: number) => void
}) {
  const rightOrder = useMemo(() => rightColumnOrder(pairs, seed), [pairs, seed])

  const [selectedLeft, setSelectedLeft] = useState<number | null>(null)
  const [selectedRight, setSelectedRight] = useState<number | null>(null)
  const [matched, setMatched] = useState<Set<string>>(new Set())
  const [mistakes, setMistakes] = useState(0)
  const [wrong, setWrong] = useState<{ li: number; ri: number } | null>(null)

  // Nettoyage du timer de retour « faux » au démontage (pas de fuite).
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(
    () => () => {
      if (flashTimer.current) clearTimeout(flashTimer.current)
    },
    [],
  )

  const busy = wrong !== null

  const evaluate = (li: number, ri: number) => {
    if (pairs[li].id === pairs[ri].id) {
      sfx.correct()
      const next = new Set(matched)
      next.add(pairs[li].id)
      setMatched(next)
      setSelectedLeft(null)
      setSelectedRight(null)
      if (next.size === pairs.length) onSolved(mistakes)
    } else {
      sfx.wrong()
      setMistakes((m) => m + 1)
      setSelectedLeft(li)
      setSelectedRight(ri)
      setWrong({ li, ri })
      flashTimer.current = setTimeout(() => {
        setWrong(null)
        setSelectedLeft(null)
        setSelectedRight(null)
      }, 650)
    }
  }

  const pick = (side: 'left' | 'right', idx: number) => {
    if (busy || matched.has(pairs[idx].id)) return
    sfx.tap()
    if (side === 'left') {
      if (selectedRight !== null) evaluate(idx, selectedRight)
      else setSelectedLeft((cur) => (cur === idx ? null : idx))
    } else {
      if (selectedLeft !== null) evaluate(selectedLeft, idx)
      else setSelectedRight((cur) => (cur === idx ? null : idx))
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Colonne gauche : les énoncés, dans l'ordre */}
      <ul className="flex flex-col gap-3">
        {pairs.map((p, i) => (
          <li key={p.id}>
            <Tile
              text={p.left}
              matched={matched.has(p.id)}
              selected={selectedLeft === i}
              wrong={wrong?.li === i}
              onClick={() => pick('left', i)}
            />
          </li>
        ))}
      </ul>
      {/* Colonne droite : les réponses, mélangées */}
      <ul className="flex flex-col gap-3">
        {rightOrder.map((ri) => {
          const p = pairs[ri]
          return (
            <li key={p.id}>
              <Tile
                text={p.right}
                matched={matched.has(p.id)}
                selected={selectedRight === ri}
                wrong={wrong?.ri === ri}
                onClick={() => pick('right', ri)}
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function Tile({
  text,
  matched,
  selected,
  wrong,
  onClick,
}: {
  text: string
  matched: boolean
  selected: boolean
  wrong: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={matched}
      aria-pressed={selected}
      className={cn(
        'flex min-h-14 w-full items-center justify-center gap-1.5 rounded-2xl border-2 px-3 py-2.5 text-center text-sm font-medium transition-all',
        matched &&
          'border-green-600 bg-green-600/10 text-green-800 dark:text-green-300',
        !matched && wrong && 'border-destructive bg-destructive/10',
        !matched && !wrong && selected && 'border-primary ring-primary/30 ring-2',
        !matched &&
          !wrong &&
          !selected &&
          'border-border bg-card hover:border-primary/50 cursor-pointer',
      )}
    >
      {matched ? (
        <Check className="size-4 shrink-0" strokeWidth={3} aria-hidden="true" />
      ) : null}
      {text}
    </button>
  )
}
