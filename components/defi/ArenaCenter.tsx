import Image from 'next/image'
import { arenaProgress } from '@/lib/defi/arena'
import { MASCOT_SKINS, type MascotSkin } from './DefiHero'
import { TrophyIcon } from './icons'

interface ArenaCenterProps {
  trophies: number
  /** Skin de mascotte affiché au centre de l'arène. */
  skin?: MascotSkin
}

/**
 * Le cœur de l'écran Défi : la mascotte plantée dans l'arène courante, le
 * compteur de trophées et la progression vers l'arène suivante. Remplace
 * l'ancienne carte d'arène — le CTA « Match classé » vit désormais en bas
 * d'écran. Purement présentationnel (`arenaProgress` fait le calcul).
 */
export default function ArenaCenter({
  trophies,
  skin = 'classique',
}: ArenaCenterProps) {
  const p = arenaProgress(trophies)
  const pct = Math.round(p.ratio * 100)
  const mascot = MASCOT_SKINS[skin] ?? MASCOT_SKINS.classique
  const nextLabel =
    p.next && p.remaining !== null
      ? `Encore ${p.remaining} pour ${p.next.name}`
      : 'Sommet atteint — tu es au Grand Oral'

  return (
    <section
      className="flex w-full max-w-60 flex-col items-center text-center"
      aria-label="Ton arène"
    >
      {/* La mascotte, en idle, avec un halo doux qui la détache du décor. */}
      <div className="relative flex flex-col items-center">
        <span
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 size-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--highlight),white_30%),transparent_72%)] opacity-45"
        />
        <Image
          src={`/images/mascotte/${mascot.file}`}
          alt={mascot.label}
          width={180}
          height={230}
          priority
          className="defi2-hero-char relative z-10 h-auto w-28 object-contain"
        />
      </div>

      {/* Plaque d'arène. */}
      <div className="relative z-10 mt-1 flex items-center gap-2 rounded-full border border-white/15 bg-[oklch(0.2_0.04_300)]/85 px-4 py-1.5 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.6)] backdrop-blur-sm">
        <span className="text-base leading-none" aria-hidden>
          {p.current.icon}
        </span>
        <span className="font-heading text-sm font-extrabold tracking-wide text-white">
          {p.current.name}
        </span>
      </div>

      {/* Compteur de trophées. */}
      <div className="mt-3 flex items-center gap-2 rounded-2xl border border-highlight/40 bg-highlight/15 px-4 py-1.5">
        <TrophyIcon className="size-5 text-highlight" />
        <span
          className="font-heading text-2xl leading-none font-extrabold text-white tabular-nums"
          aria-label={`${trophies} trophées`}
        >
          {trophies}
        </span>
      </div>

      {/* Progression vers l'arène suivante. */}
      <div className="mt-3 w-full">
        <div
          className="h-3 w-full overflow-hidden rounded-full border border-white/12 bg-black/30"
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
        <p className="mt-1.5 text-xs font-bold text-white/80">{nextLabel}</p>
      </div>
    </section>
  )
}
