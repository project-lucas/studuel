import Link from 'next/link'
import { UserRound, Users } from 'lucide-react'
import { formatDurationFromSeconds, formatHours } from '@/lib/time'
import { workLevel } from '@/lib/work-level'
import AvatarBadge from '@/components/AvatarBadge'
import type { AvatarConfig } from '@/lib/avatar'

// Flamme (tracé Lucide), remplie en dégradé ambre → orange — comme la série.
const FLAME_PATH =
  'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z'

// Bandeau héros de l'onglet Moi, façon carte de jeu : carte violette arrondie
// avec l'AVATAR personnalisable à cheval sur son bord supérieur (crayon d'édition
// à un angle, badge de niveau flamme à l'autre), prénom et rang centrés dessous,
// pilules aux angles (temps total à gauche, compte à droite), barre de niveau.
export default function MoiHeader({
  name,
  avatarUri,
  avatarConfig,
  playerSeconds,
  communitySeconds,
  streak,
}: {
  name: string
  // Avatar pré-rendu (data-URI) pour un affichage immédiat + sa config éditable.
  avatarUri: string
  avatarConfig: AvatarConfig
  playerSeconds: number
  communitySeconds: number | null
  // Série vivante : ramassée dans le bandeau (plus de bloc « série » à part).
  streak: number
}) {
  const lvl = workLevel(playerSeconds)
  const pct = Math.round(lvl.progress * 100)

  return (
    <section aria-label="Mon profil" className="relative mt-12">
      {/* L'avatar trône au-dessus de la carte ; badge de niveau flamme à l'angle.
          Le <defs> #level-flame vit ici et sert aussi à la pilule de série. */}
      <div className="absolute -top-12 left-1/2 z-10 -translate-x-1/2">
        <div className="relative">
          <span aria-hidden="true" className="moi-glow absolute -inset-3" />
          <AvatarBadge uri={avatarUri} config={avatarConfig} />
          <div
            className="absolute -top-1 -left-4 flex items-center gap-0.5 rounded-full bg-white px-1.5 py-0.5 shadow-sm ring-1 ring-black/5"
            aria-label={`Niveau ${lvl.level}`}
          >
            <svg viewBox="0 0 24 24" className="size-3.5 shrink-0" aria-hidden="true">
              <defs>
                <linearGradient id="level-flame" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>
              </defs>
              <path d={FLAME_PATH} fill="url(#level-flame)" />
            </svg>
            <span className="font-mono text-xs font-extrabold text-foreground tabular-nums">
              {lvl.level}
            </span>
          </div>
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

          {/* La série, ramassée dans l'identité : une pastille flamme, plus
              besoin d'un bloc « série » empilé plus bas. */}
          <div className="mt-3 flex justify-center">
            <span
              className="flex items-center gap-1.5 rounded-full bg-white/12 px-3.5 py-1.5 text-sm font-bold text-white ring-1 ring-white/25"
              aria-label={
                streak > 0
                  ? `Série de ${streak} jour${streak > 1 ? 's' : ''}`
                  : 'Aucune série en cours'
              }
            >
              <svg viewBox="0 0 24 24" className="size-4 shrink-0" aria-hidden="true">
                <path d={FLAME_PATH} fill="url(#level-flame)" />
              </svg>
              {streak > 0 ? (
                <>
                  <span className="font-mono tabular-nums">{streak}</span>
                  jour{streak > 1 ? 's' : ''} de série
                </>
              ) : (
                'Allume ta série'
              )}
            </span>
          </div>
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
