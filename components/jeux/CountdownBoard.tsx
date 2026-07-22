'use client'

import { useState } from 'react'
import { Undo2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  COUNTDOWN_OPS,
  applyOp,
  type CountdownOp,
  type CountdownPuzzle,
} from '@/lib/jeux/compte-est-bon'

// Une plaque en jeu : la valeur, plus un id STABLE — deux plaques peuvent
// porter le même nombre (deux « 7 »), et les distinguer par leur valeur ferait
// disparaître la mauvaise au moment de la consommer.
type Tile = { id: string; value: number }

type Step = {
  a: number
  op: CountdownOp
  b: number
  result: number
  /** Les plaques consommées, pour pouvoir revenir en arrière. */
  consumed: [Tile, Tile]
  producedId: string
}

/**
 * Le plateau du « compte est bon » : six plaques, une cible, et des opérations
 * à enchaîner. C'est le seul jeu du catalogue où l'élève FABRIQUE sa réponse au
 * lieu de la choisir dans une liste — d'où un plateau à part entière.
 *
 * Le geste : on touche une plaque, un opérateur, une seconde plaque. Les deux
 * plaques disparaissent, leur résultat en devient une nouvelle. On peut annuler
 * autant qu'on veut : se tromper de chemin fait partie du calcul, ce n'est pas
 * une faute.
 */
export default function CountdownBoard({
  puzzle,
  /** Appelé dès qu'une plaque vaut exactement la cible. */
  onSolved,
  /** Le tirage est perdu : on montre la solution de référence. */
  revealSolution,
}: {
  puzzle: CountdownPuzzle
  onSolved: () => void
  revealSolution: boolean
}) {
  const [tiles, setTiles] = useState<Tile[]>(() =>
    puzzle.tiles.map((value, i) => ({ id: `t${i}`, value })),
  )
  const [steps, setSteps] = useState<Step[]>([])
  const [selected, setSelected] = useState<Tile | null>(null)
  const [op, setOp] = useState<CountdownOp | null>(null)
  const [refused, setRefused] = useState(false)

  // La plaque la plus proche de la cible : le vrai retour d'information du jeu,
  // celui qui dit « tu chauffes » sans donner la réponse.
  const closest = tiles.reduce(
    (best, t) =>
      Math.abs(t.value - puzzle.target) < Math.abs(best - puzzle.target)
        ? t.value
        : best,
    tiles[0]?.value ?? 0,
  )
  const gap = Math.abs(closest - puzzle.target)

  const tapTile = (tile: Tile) => {
    if (revealSolution) return
    if (!selected) {
      setSelected(tile)
      return
    }
    if (tile.id === selected.id) {
      setSelected(null)
      setOp(null)
      return
    }
    if (!op) {
      // Deux plaques sans opérateur : on considère que le joueur change d'avis.
      setSelected(tile)
      return
    }
    // Les opérations non commutatives se lisent dans l'ordre choisi.
    const result = applyOp(selected.value, op, tile.value)
    if (result === null) {
      setRefused(true)
      window.setTimeout(() => setRefused(false), 400)
      return
    }
    const produced: Tile = { id: `s${steps.length}`, value: result }
    setTiles((current) => [
      ...current.filter((t) => t.id !== selected.id && t.id !== tile.id),
      produced,
    ])
    setSteps((current) => [
      ...current,
      {
        a: selected.value,
        op,
        b: tile.value,
        result,
        consumed: [selected, tile],
        producedId: produced.id,
      },
    ])
    setSelected(null)
    setOp(null)
    if (result === puzzle.target) onSolved()
  }

  const undo = () => {
    const last = steps[steps.length - 1]
    if (!last || revealSolution) return
    setTiles((current) => [
      ...current.filter((t) => t.id !== last.producedId),
      ...last.consumed,
    ])
    setSteps((current) => current.slice(0, -1))
    setSelected(null)
    setOp(null)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* La cible, énorme : c'est le seul chiffre qui compte. */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
          Cible
        </span>
        <span className="font-mono text-6xl font-extrabold tabular-nums">
          {puzzle.target}
        </span>
        {steps.length > 0 && gap > 0 ? (
          <span className="text-xs font-semibold text-muted-foreground">
            au plus près : {closest} ({gap > 0 ? `à ${gap}` : 'pile'})
          </span>
        ) : null}
      </div>

      {/* Les plaques disponibles. */}
      <div
        className={cn(
          'flex flex-wrap justify-center gap-2',
          refused && 'jeu-secousse',
        )}
      >
        {tiles.map((tile) => (
          <button
            key={tile.id}
            type="button"
            disabled={revealSolution}
            onClick={() => tapTile(tile)}
            className={cn(
              'min-w-16 rounded-2xl border-2 px-3 py-3 font-mono text-xl font-extrabold tabular-nums transition-all',
              selected?.id === tile.id
                ? 'scale-105 border-[color:var(--jeu-accent)] bg-[color:var(--jeu-accent)] text-[color:var(--jeu-ink)] shadow-md'
                : 'border-[color:var(--jeu-accent)]/25 bg-card shadow-sm hover:border-[color:var(--jeu-accent)]/70 active:scale-95',
              tile.value === puzzle.target && 'border-success text-success',
            )}
          >
            {tile.value}
          </button>
        ))}
      </div>

      {/* Les opérateurs. Ils ne s'activent qu'une fois une plaque choisie —
          sinon on propose une action qui ne mène nulle part. */}
      <div className="flex justify-center gap-2">
        {COUNTDOWN_OPS.map((o) => (
          <button
            key={o}
            type="button"
            disabled={!selected || revealSolution}
            onClick={() => setOp(o)}
            className={cn(
              'grid size-12 place-items-center rounded-2xl border-2 text-xl font-extrabold transition-all',
              op === o
                ? 'border-[color:var(--jeu-accent)] bg-[color:var(--jeu-accent)] text-[color:var(--jeu-ink)]'
                : 'border-[color:var(--jeu-accent)]/25 bg-card active:scale-95',
              'disabled:opacity-30',
            )}
            aria-label={`opération ${o}`}
          >
            {o}
          </button>
        ))}
        <button
          type="button"
          onClick={undo}
          disabled={steps.length === 0 || revealSolution}
          className="grid size-12 place-items-center rounded-2xl border-2 border-black/10 bg-card transition-all active:scale-95 disabled:opacity-30"
          aria-label="Annuler la dernière opération"
        >
          <Undo2 className="size-5" aria-hidden="true" />
        </button>
      </div>

      {/* Le fil des opérations posées. */}
      {steps.length > 0 ? (
        <ol className="flex flex-col gap-1 text-center">
          {steps.map((s, i) => (
            <li key={i} className="jeu-monte font-mono text-sm font-semibold">
              {s.a} {s.op} {s.b} = <strong>{s.result}</strong>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-center text-sm text-muted-foreground">
          Touche une plaque, une opération, puis une autre plaque.
        </p>
      )}

      {/* Tirage manqué : on montre UNE solution. Un « compte » qu'on n'a pas
          trouvé et qu'on ne voit jamais résolu n'apprend rien. */}
      {revealSolution ? (
        <div className="animate-in fade-in rounded-2xl bg-card px-4 py-3 text-center shadow-sm">
          <p className="text-xs font-bold text-muted-foreground uppercase">
            Une solution possible
          </p>
          <ol className="mt-1 flex flex-col gap-0.5">
            {puzzle.solution.map((s, i) => (
              <li key={i} className="font-mono text-sm font-semibold">
                {s.a} {s.op} {s.b} = {s.result}
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      <p role="status" aria-live="polite" className="sr-only">
        {selected
          ? `plaque ${selected.value} choisie${op ? `, opération ${op}` : ''}`
          : ''}
      </p>
    </div>
  )
}
