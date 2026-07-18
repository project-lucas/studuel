import { Trophy } from 'lucide-react'
import { arenaProgress } from '@/lib/trophies'
import { recordLabel } from '@/lib/defi/duel-record'

interface TrophyBlockProps {
  trophies: number
  // Bilan Victoires/Défaites des duels 1v1 — hors trophées/classement.
  wins?: number
  losses?: number
}

/**
 * Le bloc trophées, au-dessus de « Match classé ». Reconstruit en CSS net (au
 * lieu d'un raster pleine largeur qui « bavait ») : une plaque de marbre ciselée
 * plus petite et centrée — coupe d'or à gauche, nombre au centre, deux gemmes
 * violettes serties en bout — surmontant le fin ruban de progression vers
 * l'arène suivante. Purement présentationnel (`arenaProgress` fait le calcul).
 */
export default function TrophyBlock({
  trophies,
  wins = 0,
  losses = 0,
}: TrophyBlockProps) {
  const p = arenaProgress(trophies)
  const pct = Math.round(p.progress * 100)
  const nextLabel = p.next
    ? `Encore ${p.toNext} pour ${p.next.name}`
    : `Sommet atteint — tu es ${p.arena.name}`
  const v = Math.max(0, Math.floor(wins))
  const d = Math.max(0, Math.floor(losses))

  return (
    <section
      className="mx-auto flex w-full max-w-[17rem] flex-col items-center"
      aria-label="Tes trophées"
    >
      {/* Plaque marbre : coupe or, nombre, gemmes serties aux extrémités. */}
      <div className="trophy-plate w-full">
        <span className="trophy-gem trophy-gem--l" aria-hidden="true" />
        <span
          className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-b from-[#fcd34d] via-[#f9b233] to-[#d97706] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_1px_2px_rgba(0,0,0,0.35)]"
          aria-hidden="true"
        >
          <Trophy
            className="size-5 text-[color:var(--foreground)]"
            strokeWidth={2.4}
            aria-hidden="true"
          />
        </span>
        <span
          className="font-heading flex-1 text-center text-2xl font-extrabold tabular-nums text-[color:var(--foreground)]"
          aria-label={`${trophies} trophées`}
        >
          {trophies}
        </span>
        {/* Contrepoids symétrique à la coupe pour centrer le nombre. */}
        <span className="size-9 shrink-0" aria-hidden="true" />
        <span className="trophy-gem trophy-gem--r" aria-hidden="true" />
      </div>

      {/* Progression vers l'arène suivante — fin ruban doré + caption crème. */}
      <div className="mt-1.5 w-11/12">
        <div
          className="h-2 w-full overflow-hidden rounded-full border border-[color:var(--foreground)]/25 bg-black/25"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={nextLabel}
        >
          <div
            className="bar-fill h-full rounded-full bg-gradient-to-r from-[#fcd34d] to-[#f9b233] shadow-[0_0_10px_color-mix(in_oklch,var(--highlight),transparent_40%)]"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-1 text-center text-xs font-bold text-white [text-shadow:0_1px_2px_rgba(36,48,79,0.9)]">
          {nextLabel}
        </p>
      </div>

      {/* Bilan V/D des duels 1v1 : un flex personnel, indépendant des trophées et
          du classement. Deux pastilles jumelles — victoires en vert, défaites en
          corail — sous le ruban de progression. */}
      <div
        className="mt-2 flex items-center gap-1.5"
        role="img"
        aria-label={`Bilan des duels : ${recordLabel({ wins: v, losses: d })}`}
      >
        <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-extrabold text-emerald-100 ring-1 ring-emerald-400/40 tabular-nums">
          <span aria-hidden="true" className="opacity-90">V</span>
          {v}
        </span>
        <span className="flex items-center gap-1 rounded-full bg-destructive/25 px-2.5 py-0.5 text-xs font-extrabold text-red-100 ring-1 ring-destructive/50 tabular-nums">
          <span aria-hidden="true" className="opacity-90">D</span>
          {d}
        </span>
      </div>
    </section>
  )
}
