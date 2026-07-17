import { arenaProgress } from '@/lib/defi/arena'
import { TrophyIcon } from './icons'

interface ArenaCenterProps {
  trophies: number
}

/**
 * Le cœur de l'écran Défi : le compteur de trophées et la progression vers
 * l'arène suivante, plantés au centre de l'arène. La mascotte et la plaque
 * d'arène ont été retirées pour dégager le décor. Purement présentationnel
 * (`arenaProgress` fait le calcul).
 */
export default function ArenaCenter({ trophies }: ArenaCenterProps) {
  const p = arenaProgress(trophies)
  const pct = Math.round(p.ratio * 100)
  const nextLabel =
    p.next && p.remaining !== null
      ? `Encore ${p.remaining} pour ${p.next.name}`
      : 'Sommet atteint — tu es au Grand Oral'

  return (
    <section
      className="flex w-full max-w-60 flex-col items-center text-center"
      aria-label="Ton arène"
    >
      {/* Cartouche « marbre » horizontal : gemme en losange à chaque extrémité
          (pseudo-éléments .olympe-cartouche), Trophy or + nombre encre. */}
      <div className="olympe-glass olympe-cartouche flex w-44 items-center justify-center gap-2.5 rounded-2xl px-6 py-2.5">
        <TrophyIcon className="size-6 shrink-0 text-[#fcd34d]" />
        <span
          className="font-heading text-2xl leading-none font-extrabold tabular-nums"
          aria-label={`${trophies} trophées`}
        >
          {trophies}
        </span>
      </div>

      {/* Progression vers l'arène suivante — fin ruban doré, caption crème. */}
      <div className="mt-3 w-full">
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
        <p className="mt-1.5 text-xs font-bold text-white [text-shadow:0_1px_2px_rgba(36,48,79,0.9)]">
          {nextLabel}
        </p>
      </div>
    </section>
  )
}
