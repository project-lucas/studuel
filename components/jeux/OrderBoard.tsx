'use client'

import { cn } from '@/lib/utils'
import { expectedIndex, type OrderBoard as Board } from '@/lib/jeux/ordering'

/**
 * Le plateau des jeux de REMISE EN ORDRE — le seul du catalogue qui ne soit pas
 * un QCM, et donc le seul qui demande un geste qu'on ne fait nulle part ailleurs
 * dans l'app : toucher des tuiles dans le bon ordre.
 *
 * Deux zones : en haut la LIGNE reconstituée (ce qu'on a déjà posé, avec le
 * repère révélé sous chaque tuile), en bas les tuiles restant à placer. Une
 * tuile mal choisie tremble et reste en bas — on ne perd pas sa place, on
 * recommence. C'est ce qui fait qu'on finit toujours par voir le bon ordre.
 */
export default function OrderBoard({
  board,
  /** Index (dans `board.items`) des tuiles déjà posées, dans l'ordre de pose. */
  placed,
  /** Index de la dernière tuile refusée — elle tremble. */
  rejected,
  onTap,
}: {
  board: Board
  placed: number[]
  rejected: number | null
  onTap: (index: number) => void
}) {
  const remaining = board.items
    .map((_, i) => i)
    .filter((i) => !placed.includes(i))
  const next = expectedIndex(board, placed.length)
  const done = next === null

  return (
    <div className="flex flex-col gap-4">
      {/* La ligne reconstituée. Elle occupe sa hauteur dès le départ (des
          emplacements vides), pour que le plateau ne saute pas à chaque pose. */}
      <ol className="flex flex-col gap-1.5">
        {board.solution.map((itemIndex, rank) => {
          const filled = rank < placed.length
          const item = board.items[itemIndex]
          return (
            <li
              key={rank}
              className={cn(
                'flex items-center gap-3 rounded-2xl border-2 px-3 py-2 transition-all',
                filled
                  ? 'jeu-monte border-success/50 bg-success/8'
                  : 'border-dashed border-black/12 bg-black/[0.02]',
              )}
            >
              <span
                className={cn(
                  'grid size-6 shrink-0 place-items-center rounded-full font-mono text-xs font-bold',
                  filled
                    ? 'bg-success text-white'
                    : 'bg-black/8 text-muted-foreground',
                )}
                aria-hidden="true"
              >
                {rank + 1}
              </span>
              {filled ? (
                <span className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2">
                  <span className="text-sm font-bold">{item.label}</span>
                  {/* Le repère : la date, la fonction grammaticale. C'est ici que
                      le jeu enseigne au lieu de seulement sanctionner. */}
                  <span className="text-xs font-semibold text-muted-foreground">
                    {item.hint}
                  </span>
                </span>
              ) : (
                <span className="text-sm text-muted-foreground/60">
                  {rank === placed.length ? 'à toi de jouer…' : '—'}
                </span>
              )}
            </li>
          )
        })}
      </ol>

      {/* Les tuiles restantes, en vrac. */}
      {!done ? (
        <div className="flex flex-wrap justify-center gap-2">
          {remaining.map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => onTap(i)}
              className={cn(
                'rounded-2xl border-2 border-[color:var(--jeu-accent)]/30 bg-card px-3.5 py-2.5 text-sm font-bold shadow-sm transition-all',
                'hover:border-[color:var(--jeu-accent)]/70 hover:shadow-md active:scale-95',
                rejected === i && 'jeu-secousse border-destructive text-destructive',
              )}
            >
              {board.items[i].label}
            </button>
          ))}
        </div>
      ) : null}

      <p role="status" aria-live="polite" className="sr-only">
        {placed.length} élément{placed.length > 1 ? 's' : ''} placé
        {placed.length > 1 ? 's' : ''} sur {board.solution.length}
      </p>
    </div>
  )
}
