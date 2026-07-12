import Link from 'next/link'
import { UserRound, Users } from 'lucide-react'
import { formatDurationFromSeconds, formatHours } from '@/lib/time'
import { workLevel } from '@/lib/work-level'

// Flamme (tracé Lucide), remplie en dégradé ambre → orange — comme la série.
const FLAME_PATH =
  'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z'

// Bandeau héros de l'onglet Moi, façon carte de jeu : carte violette arrondie
// avec la grande flamme de niveau à cheval sur son bord supérieur (chiffre
// centré dedans), prénom et rang centrés dessous, pilules aux angles (temps
// total à gauche, accès au compte à droite), barre vers le niveau suivant.
export default function MoiHeader({
  name,
  playerSeconds,
  communitySeconds,
}: {
  name: string
  playerSeconds: number
  communitySeconds: number | null
}) {
  const lvl = workLevel(playerSeconds)
  const pct = Math.round(lvl.progress * 100)

  return (
    <section aria-label="Mon profil" className="relative mt-12">
      {/* La flamme de niveau trône au-dessus de la carte, halo ambré. */}
      <div className="absolute -top-12 left-1/2 z-10 -translate-x-1/2">
        <div className="relative flex size-24 items-center justify-center">
          <span aria-hidden="true" className="moi-glow absolute -inset-5" />
          <svg
            viewBox="0 0 24 24"
            className="flame-breathe relative size-24 drop-shadow-md"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="level-flame" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
            </defs>
            <path d={FLAME_PATH} fill="url(#level-flame)" />
          </svg>
          <span className="absolute inset-x-0 top-[52%] text-center font-mono text-2xl leading-none font-extrabold text-white tabular-nums drop-shadow-sm">
            {lvl.level}
          </span>
        </div>
      </div>

      <div className="moi-hero moi-card relative overflow-hidden rounded-3xl px-5 pt-14 pb-6 text-white">
        {/* Capsules décoratives violet clair + étincelles jaunes. */}
        <span
          aria-hidden="true"
          className="moi-blob absolute -top-8 -left-10 h-32 w-32 rounded-full"
        />
        <span
          aria-hidden="true"
          className="moi-blob absolute -right-12 -bottom-10 h-32 w-32 rounded-full"
        />
        <span
          aria-hidden="true"
          className="moi-braise absolute top-16 right-8 size-2 rounded-full"
        />
        <span
          aria-hidden="true"
          className="moi-braise absolute top-24 left-10 size-1.5 rounded-full"
        />

        {/* Les pilules aux angles, de part et d'autre de la flamme. */}
        <div className="absolute inset-x-4 top-4 flex items-start justify-between">
          <span
            className="flex items-center gap-1.5 rounded-full bg-white py-1.5 pr-3 pl-3.5 text-sm font-bold text-primary shadow-sm"
            aria-label={`Temps de travail total : ${formatHours(playerSeconds)}`}
          >
            Total
            <span className="font-mono font-extrabold text-foreground tabular-nums">
              {formatHours(playerSeconds)}
            </span>
          </span>
          <Link
            href="/compte"
            className="flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-white/20 active:translate-y-px"
          >
            <UserRound className="size-4" strokeWidth={2.4} aria-hidden="true" />
            Compte
          </Link>
        </div>

        {/* Prénom + rang, centrés sous la flamme. */}
        <div className="relative mt-2 text-center">
          <h1 className="font-heading text-3xl leading-tight font-bold text-balance">
            {name}
          </h1>
          <p className="mt-1 text-sm font-semibold text-white/85">
            Niveau {lvl.level} · {lvl.title}
          </p>
        </div>

        {/* Vers le niveau suivant : la barre flamme sur le violet. */}
        <div className="relative mt-4">
          <div
            className="h-2.5 w-full overflow-hidden rounded-full bg-white/15"
            role="progressbar"
            aria-label={
              lvl.nextHours !== null
                ? `Progression vers le niveau ${lvl.level + 1}`
                : 'Niveau maximum atteint'
            }
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
          >
            <div
              className="bar-fill h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-600"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-1.5 text-center text-xs font-medium text-white/70">
            {lvl.nextHours !== null
              ? `Niveau ${lvl.level + 1} à ${lvl.nextHours} h de travail`
              : 'Niveau maximum atteint 👑'}
          </p>
        </div>

        {communitySeconds !== null ? (
          <p className="relative mt-3 flex items-center justify-center gap-2 text-xs text-white/75">
            <Users className="size-3.5 shrink-0 text-highlight" aria-hidden="true" />
            <span>
              Ensemble, les élèves ont déjà travaillé{' '}
              <strong className="font-semibold text-white tabular-nums">
                {formatDurationFromSeconds(communitySeconds)}
              </strong>
              .
            </span>
          </p>
        ) : null}
      </div>
    </section>
  )
}
