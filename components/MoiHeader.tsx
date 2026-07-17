import Link from 'next/link'
import { UserRound, Users, Gem } from 'lucide-react'
import { formatDurationFromSeconds, formatHours } from '@/lib/time'
import { workLevel } from '@/lib/work-level'
import AvatarBadge from '@/components/AvatarBadge'
import type { AvatarConfig } from '@/lib/avatar'

// Flamme (tracé Lucide), remplie en dégradé ambre → orange — comme la série.
const FLAME_PATH =
  'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z'

// Bandeau v5 « compact » : l'onglet Moi devient un dashboard, l'identité se
// ramasse — le cercle AVATAR à cheval sur la carte violette (badge de niveau
// flamme à l'angle), les infos AUTOUR du cercle (temps total à gauche, série à
// droite), prénom + rang dessous, accès coffre/compte en bas. Ni barre de
// progression ni grand décor : le tableau de l'année prend la vedette dessous.
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
  // Série vivante : chip flamme à droite du cercle.
  streak: number
}) {
  const lvl = workLevel(playerSeconds)

  return (
    <section aria-label="Mon profil" className="relative mt-12">
      {/* L'avatar trône au-dessus de la carte ; badge de niveau flamme à l'angle.
          Le <defs> #level-flame vit ici et sert aussi au chip de série. */}
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

      <div className="moi-hero moi-card relative overflow-hidden rounded-3xl px-4 pt-4 pb-3 text-white">
        <span
          aria-hidden="true"
          className="moi-blob absolute -top-8 -left-10 h-24 w-24 rounded-full"
        />

        {/* Les infos autour du cercle : temps total | (avatar) | série. */}
        <div className="relative flex items-center justify-between gap-2">
          <span
            className="flex items-center gap-1 rounded-full bg-white/12 px-2.5 py-1 text-xs font-bold ring-1 ring-white/25"
            aria-label={`Temps de travail total : ${formatHours(playerSeconds)}`}
          >
            Total
            <span className="font-mono font-extrabold tabular-nums">
              {formatHours(playerSeconds)}
            </span>
          </span>
          <span
            className="flex items-center gap-1 rounded-full bg-white/12 px-2.5 py-1 text-xs font-bold ring-1 ring-white/25"
            aria-label={
              streak > 0
                ? `Série de ${streak} jour${streak > 1 ? 's' : ''}`
                : 'Aucune série en cours'
            }
          >
            <svg viewBox="0 0 24 24" className="size-3.5 shrink-0" aria-hidden="true">
              <path d={FLAME_PATH} fill="url(#level-flame)" />
            </svg>
            <span className="font-mono font-extrabold tabular-nums">{streak}</span>
            j
          </span>
        </div>

        {/* Prénom + rang, ramassés sous le cercle. */}
        <div className="relative mt-3 text-center">
          <h1 className="font-heading text-2xl leading-tight font-bold text-balance">
            {name}
          </h1>
          <p className="mt-0.5 text-xs font-semibold text-white/85">
            Niveau {lvl.level} · {lvl.title}
          </p>
        </div>

        {/* Pied de carte : la communauté à gauche, coffre + compte à droite. */}
        <div className="relative mt-3 flex items-center justify-between gap-2">
          {communitySeconds !== null ? (
            <p className="flex min-w-0 items-center gap-1.5 text-[11px] text-white/75">
              <Users
                className="size-3.5 shrink-0 text-highlight"
                aria-hidden="true"
              />
              <span className="truncate">
                Ensemble :{' '}
                <strong className="font-semibold text-white tabular-nums">
                  {formatDurationFromSeconds(communitySeconds)}
                </strong>
              </span>
            </p>
          ) : (
            <span />
          )}
          <div className="flex shrink-0 items-center gap-1.5">
            <Link
              href="/coffre"
              aria-label="Mon coffre"
              className="flex size-8 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition-colors duration-200 hover:bg-white/20 active:translate-y-px"
            >
              <Gem className="size-4 text-highlight" strokeWidth={2.4} aria-hidden="true" />
            </Link>
            <Link
              href="/compte"
              aria-label="Mon compte"
              className="flex size-8 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition-colors duration-200 hover:bg-white/20 active:translate-y-px"
            >
              <UserRound className="size-4" strokeWidth={2.4} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
