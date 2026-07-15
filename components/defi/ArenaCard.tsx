import Link from 'next/link'
import { arenaProgress } from '@/lib/defi/arena'
import { SwordsIcon, TrophyIcon, ChevronRightIcon } from './icons'

interface ArenaCardProps {
  trophies: number
}

/**
 * Élément central de l'écran : l'arène actuelle, le compteur de trophées, la
 * barre de progression vers l'arène suivante, et le gros CTA « Match classé ».
 * Purement présentationnel — la progression vient de `arenaProgress` (lib).
 */
export default function ArenaCard({ trophies }: ArenaCardProps) {
  const p = arenaProgress(trophies)
  const pct = Math.round(p.ratio * 100)
  const nextLabel =
    p.next && p.remaining !== null
      ? `Encore ${p.remaining} pour ${p.next.name}`
      : 'Sommet atteint — tu es au Grand Oral'

  return (
    <section className="defi2-arena p-5" aria-label="Ton arène">
      {/* En-tête : icône + nom de l'arène, compteur de trophées */}
      <div className="flex items-center gap-3">
        <span
          className="grid size-14 shrink-0 place-items-center rounded-2xl border border-white/15 bg-white/10 text-3xl"
          aria-hidden
        >
          {p.current.icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[0.7rem] font-bold tracking-wide text-white/55 uppercase">
            Arène actuelle
          </p>
          <h2 className="font-heading truncate text-xl leading-tight font-extrabold text-white">
            {p.current.name}
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 rounded-2xl border border-highlight/40 bg-highlight/15 px-3 py-2">
          <TrophyIcon className="size-5 text-highlight" />
          <span
            className="font-heading text-2xl leading-none font-extrabold text-white tabular-nums"
            aria-label={`${trophies} trophées`}
          >
            {trophies}
          </span>
        </div>
      </div>

      {/* Barre de progression vers l'arène suivante */}
      <div className="mt-4">
        <div
          className="h-3.5 w-full overflow-hidden rounded-full border border-white/12 bg-black/30"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={nextLabel}
        >
          <div
            className="bar-fill h-full rounded-full bg-gradient-to-r from-highlight to-[oklch(0.78_0.17_62)] shadow-[0_0_12px_color-mix(in_oklch,var(--highlight),transparent_40%)]"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-sm font-bold text-white/80">
          <TrophyIcon className="size-4 text-highlight" />
          {nextLabel}
        </p>
      </div>

      {/* CTA principal de tout l'écran */}
      <Link
        href="/defi/matchmaking"
        className="defi2-press mt-5 flex w-full items-center justify-center gap-2.5 rounded-2xl border border-[oklch(0.72_0.16_70)] bg-gradient-to-b from-highlight to-[oklch(0.74_0.16_62)] px-5 py-3.5 text-center shadow-[0_14px_30px_-10px_color-mix(in_oklch,var(--highlight),transparent_35%)] focus-visible:ring-4 focus-visible:ring-highlight/50 focus-visible:outline-none"
        aria-label="Lancer un match classé, format BO3"
      >
        <SwordsIcon className="size-6 text-[oklch(0.26_0.06_70)]" />
        <span className="flex flex-col items-start leading-tight">
          <span className="font-heading text-lg font-extrabold text-[oklch(0.24_0.06_70)]">
            MATCH CLASSÉ
          </span>
          <span className="text-[0.7rem] font-bold text-[oklch(0.32_0.06_70)]">
            BO3 · +30 victoire / −20 défaite
          </span>
        </span>
        <ChevronRightIcon className="ml-auto size-5 text-[oklch(0.3_0.06_70)]" />
      </Link>
    </section>
  )
}
