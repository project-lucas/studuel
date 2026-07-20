'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CircleUser } from 'lucide-react'
import CoinIcon from '@/components/ui/CoinIcon'
import { isHudHidden } from '@/lib/top-hud-routes'
import { cn } from '@/lib/utils'

/**
 * Le bandeau du haut, façon Clash Royale : les infos de jeu que l'élève garde
 * sous les yeux partout — son niveau, sa monnaie (pièces) et l'accès au profil —
 * FLOTTENT au-dessus du fond d'écran de chaque interface. Plus de barre pleine
 * largeur opaque : chaque info est une pastille translucide (backdrop-blur +
 * ombre) posée sur le décor, si bien qu'on voit le fond de l'arène / de l'onglet
 * derrière. Mobile uniquement (`md:hidden`) : sur desktop la sidebar porte déjà
 * l'identité. Les valeurs viennent du serveur (TopHudLoader) ; ce composant ne
 * fait que l'affichage + le masquage sur le parcours d'accueil plein écran.
 */
export default function TopHud({
  coins,
  level,
  levelTitle,
  progress,
  userLabel,
}: {
  /** Solde de pièces, ou null pour un visiteur non connecté. */
  coins: number | null
  /** Niveau (1..10), ou null pour un visiteur. */
  level: number | null
  levelTitle: string | null
  /** Progression vers le niveau suivant (0..1). */
  progress: number
  userLabel: string | null
}) {
  const pathname = usePathname()
  // Parcours d'accueil plein écran (façon Duolingo) : aucun bandeau. Garde
  // indispensable même si le serveur filtre déjà : en navigation CLIENT, le
  // layout racine n'est pas re-rendu, donc ce composant reste monté.
  if (isHudHidden(pathname)) {
    return null
  }

  const accountHref = userLabel ? '/compte' : '/login'
  const accountActive = pathname === '/compte' || pathname.startsWith('/login')
  const connected = coins !== null && level !== null
  const pct = Math.round(progress * 100)

  // Le bandeau ne capte plus les taps : seules les pastilles sont cliquables,
  // le reste de la bande laisse passer vers le décor derrière.
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex h-14 items-center gap-2 px-3 md:hidden">
      {connected ? (
        <>
          {/* Niveau : écusson de jeu flottant — disque violet ciselé (dégradé,
              reflet haut + liseré or, façon médaillon d'arène en miniature),
              libellé violet marqué, et ruban doré de progression surmonté du
              pourcentage pour rendre l'avancée lisible d'un coup d'œil. */}
          <div
            className="pointer-events-auto flex min-w-0 items-center gap-2.5 rounded-full bg-card/85 py-1 pr-3.5 pl-1 shadow-lg ring-1 ring-black/5 backdrop-blur-md"
            title={levelTitle ?? undefined}
          >
            <span
              className="font-heading flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-primary to-[color-mix(in_oklch,var(--primary),black_24%)] text-sm font-extrabold text-primary-foreground tabular-nums ring-2 ring-highlight/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_2px_5px_rgba(0,0,0,0.3)]"
              aria-hidden="true"
            >
              {level}
            </span>
            <div className="min-w-0">
              <p className="font-heading text-[10px] leading-none font-extrabold tracking-wide text-primary uppercase">
                Niveau {level}
              </p>
              <div className="mt-1 flex items-center gap-1.5">
                <div
                  className="h-2 w-16 overflow-hidden rounded-full bg-muted ring-1 ring-black/[0.06]"
                  role="progressbar"
                  aria-label={`Progression vers le niveau ${level + 1}`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={pct}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-highlight to-accent shadow-[0_0_6px_color-mix(in_oklch,var(--highlight),transparent_45%)] transition-[width] duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="hidden min-[360px]:inline font-mono text-[9px] leading-none font-bold tabular-nums text-muted-foreground">
                  {pct}%
                </span>
              </div>
            </div>
          </div>

          {/* Pièces : la monnaie du jeu, pastille dorée flottante qui route vers
              le coffre. */}
          <Link
            href="/coffre"
            aria-label={`${coins} pièces — voir le coffre`}
            className="pointer-events-auto ml-auto flex min-h-11 shrink-0 items-center gap-1.5 rounded-full bg-highlight px-3 py-1.5 font-mono text-sm font-extrabold text-foreground shadow-lg ring-1 ring-black/10 tabular-nums transition active:scale-95"
          >
            <CoinIcon className="size-4" strokeWidth={2.2} />
            {coins.toLocaleString('fr-FR')}
          </Link>
        </>
      ) : (
        <Link
          href="/"
          className="pointer-events-auto font-heading rounded-full bg-card/80 px-3 py-1.5 text-lg font-bold shadow-lg ring-1 ring-black/5 backdrop-blur-md"
        >
          Studuel
        </Link>
      )}

      {/* Profil — pastille ronde flottante à l'extrême droite (icône seule, plus
          de nom en clair : l'info se réduit à un bouton profil net). */}
      <Link
        href={accountHref}
        aria-label={userLabel ? `Mon profil — ${userLabel}` : 'Se connecter'}
        className={cn(
          'pointer-events-auto flex size-10 shrink-0 items-center justify-center rounded-full bg-card/80 shadow-lg ring-1 ring-black/5 backdrop-blur-md transition active:scale-95',
          connected ? '' : 'ml-auto',
          accountActive ? 'text-primary' : 'text-foreground',
        )}
      >
        <CircleUser className="size-6" strokeWidth={2.1} aria-hidden="true" />
      </Link>
    </header>
  )
}
