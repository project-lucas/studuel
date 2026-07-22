'use client'

import { Heart, Flame } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { GameFormat } from '@/lib/jeux/formats'
import {
  comboMultiplier,
  globalSeconds,
  type GameRun,
} from '@/lib/jeux/run'

/**
 * Le tableau de bord d'une partie — et le premier endroit où deux jeux doivent
 * cesser de se ressembler. Un sprint affiche un chrono qui fond ; une chasse
 * affiche des cœurs ; une expédition affiche une route et des escales ; une
 * ascension affiche une échelle. Ce ne sont pas des décorations : c'est ce qui
 * dit au joueur, en un coup d'œil, à quoi il joue et ce qui va le tuer.
 *
 * Tout est piloté par le format ; ce composant ne décide de rien.
 */
export default function GameHud({
  format,
  run,
  /** Secondes restantes sur la question (mécaniques à chrono par question). */
  questionLeft,
  /** Chrono total de la question, pour la jauge. */
  questionTotal,
  /** Secondes restantes sur la course (sprint uniquement). */
  globalLeft,
}: {
  format: GameFormat
  run: GameRun
  questionLeft: number | null
  questionTotal: number | null
  globalLeft: number | null
}) {
  const total = globalSeconds(format)

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-3">
        <Progression format={format} run={run} />
        <div className="flex items-center gap-2">
          {run.streak >= 2 ? (
            <span
              key={run.streak}
              className="jeu-monte flex items-center gap-1 rounded-full bg-[color:var(--jeu-accent)] px-2.5 py-1 text-xs font-bold text-[color:var(--jeu-ink)]"
            >
              <Flame className="size-3.5" aria-hidden="true" />×
              {comboMultiplier(run.streak)}
            </span>
          ) : null}
          <span
            key={run.score}
            className="animate-in zoom-in-75 font-mono text-2xl font-extrabold duration-150 tabular-nums"
            aria-label={`${run.score} points`}
          >
            {run.score}
          </span>
        </div>
      </div>

      {/* Le chrono : global quand le format en a un (sprint, phrase en vrac),
          par question partout ailleurs. Jamais les deux — deux barres qui
          descendent en même temps ne veulent plus rien dire. */}
      {total !== null && globalLeft !== null ? (
        <Gauge
          ratio={globalLeft / total}
          urgent={globalLeft <= 10}
          label={`0:${String(Math.ceil(globalLeft)).padStart(2, '0')}`}
        />
      ) : questionLeft !== null && questionTotal ? (
        <Gauge
          ratio={questionLeft / questionTotal}
          urgent={questionLeft <= 2}
          label={null}
        />
      ) : null}
    </div>
  )
}

// La jauge de temps — la même barre partout, mais jamais la même durée, donc
// jamais le même ressenti. Elle bat quand il ne reste presque rien.
function Gauge({
  ratio,
  urgent,
  label,
}: {
  ratio: number
  urgent: boolean
  label: string | null
}) {
  const pct = Math.max(0, Math.min(1, ratio)) * 100
  return (
    <div className="flex items-center gap-2">
      {label ? (
        <span
          role="timer"
          className={cn(
            'font-mono text-lg font-bold tabular-nums',
            urgent && 'text-destructive',
          )}
        >
          {label}
        </span>
      ) : null}
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-black/8">
        <div
          className={cn(
            'h-full rounded-full transition-[width] duration-200 ease-linear',
            urgent
              ? 'jeu-urgence bg-destructive'
              : 'bg-[color:var(--jeu-accent)]',
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

// L'avancement, dans la langue de la mécanique. C'est ici que le jeu se nomme.
// Le type de retour est EXPLICITE : sans lui, oublier une mécanique passe la
// compilation (la fonction renvoie `undefined`) et le HUD se vide en silence.
function Progression({
  format,
  run,
}: {
  format: GameFormat
  run: GameRun
}): React.ReactElement {
  const p = format.params
  const l = format.lexicon

  switch (p.mechanic) {
    // Course : rien à « atteindre », juste des mots avalés. On affiche le
    // compte, pas une barre de progression — il n'y a pas de ligne d'arrivée.
    case 'sprint':
      return (
        <Tag>
          {run.correct} {run.correct > 1 ? l.steps : l.step}
        </Tag>
      )

    // Vies : des cœurs, et l'objectif à portée de regard.
    case 'vies':
      return (
        <div className="flex items-center gap-2.5">
          <Hearts left={run.lives ?? 0} total={p.vies.lives} />
          <Tag>
            {run.correct}/{p.vies.target}
          </Tag>
        </div>
      )

    // Paliers : la vague en cours, les vies, et les vagues restantes en pastilles.
    case 'paliers':
      return (
        <div className="flex items-center gap-2.5">
          <Pips done={run.step} total={p.paliers.waves} />
          <Tag>
            {l.step} {Math.min(run.step + 1, p.paliers.waves)}/{p.paliers.waves}
          </Tag>
          <Hearts left={run.lives ?? 0} total={p.paliers.lives} />
        </div>
      )

    // Expédition : la route. Chaque escale franchie s'allume — on VOIT le
    // chemin parcouru, et qu'aucun piège ne peut faire reculer.
    case 'expedition':
      return (
        <div className="flex items-center gap-2.5">
          <Pips done={run.step} total={p.expedition.stops} />
          <Tag>
            {run.step}/{p.expedition.stops} {l.steps}
          </Tag>
        </div>
      )

    // Ascension : l'échelle. La hauteur atteinte est la seule chose qui compte,
    // et elle peut redescendre — c'est toute la tension du mode.
    case 'ascension':
      return (
        <div className="flex items-center gap-2.5">
          <Ladder floor={run.step} floors={p.ascension.floors} />
          <Tag>
            {l.step} {run.step}/{p.ascension.floors}
          </Tag>
        </div>
      )

    // Ordre : les tableaux reconstitués. Deux affichages, selon que le jeu vise
    // un nombre de tableaux (la frise) ou joue au chrono (la phrase en vrac) —
    // afficher « 3/null » serait pire que ne rien afficher.
    case 'ordre':
      return (
        <div className="flex items-center gap-2.5">
          {p.ordre.lives !== null ? (
            <Hearts left={run.lives ?? 0} total={p.ordre.lives} />
          ) : null}
          {p.ordre.boards !== null ? (
            <Pips done={run.step} total={p.ordre.boards} />
          ) : null}
          <Tag>
            {p.ordre.boards !== null
              ? `${l.step} ${Math.min(run.step + 1, p.ordre.boards)}/${p.ordre.boards}`
              : `${run.step} ${run.step > 1 ? l.steps : l.step}`}
          </Tag>
        </div>
      )
  }
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-black/6 px-2.5 py-1 text-xs font-bold whitespace-nowrap">
      {children}
    </span>
  )
}

function Hearts({ left, total }: { left: number; total: number }) {
  return (
    <span
      className="flex items-center gap-0.5"
      aria-label={`${left} vie${left > 1 ? 's' : ''} sur ${total}`}
    >
      {Array.from({ length: total }, (_, i) => (
        <Heart
          key={i}
          aria-hidden="true"
          className={cn(
            'size-4 transition-all',
            i < left
              ? 'fill-destructive text-destructive'
              : 'scale-90 text-black/15',
          )}
        />
      ))}
    </span>
  )
}

// Pastilles d'étapes. Au-delà de 10 étapes on n'affiche plus que la barre : une
// rangée de 20 points minuscules ne se lit pas.
function Pips({ done, total }: { done: number; total: number }) {
  if (total > 10) {
    return (
      <span className="h-1.5 w-16 overflow-hidden rounded-full bg-black/10">
        <span
          className="block h-full rounded-full bg-[color:var(--jeu-accent)] transition-[width] duration-300"
          style={{ width: `${Math.min(1, done / total) * 100}%` }}
        />
      </span>
    )
  }
  return (
    <span className="flex items-center gap-1" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={cn(
            'size-2 rounded-full transition-all',
            i < done
              ? 'scale-110 bg-[color:var(--jeu-accent)]'
              : 'bg-black/12',
          )}
        />
      ))}
    </span>
  )
}

// L'échelle de l'ascension : un mât vertical qui se remplit. Compact exprès —
// il vit dans la barre du HUD, la vraie mise en scène est dans la scène.
function Ladder({ floor, floors }: { floor: number; floors: number }) {
  return (
    <span
      className="flex h-6 w-2.5 flex-col-reverse overflow-hidden rounded-full bg-black/10"
      aria-label={`étage ${floor} sur ${floors}`}
    >
      <span
        className="block w-full rounded-full bg-[color:var(--jeu-accent)] transition-[height] duration-300 ease-out"
        style={{ height: `${Math.min(1, floor / floors) * 100}%` }}
      />
    </span>
  )
}
