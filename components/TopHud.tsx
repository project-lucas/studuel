'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Settings, LogIn, Plus } from 'lucide-react'
import type { ReactNode } from 'react'
import { CristalIcon, EcuIcon } from '@/components/ui/MonnaieIcon'
import {
  isHudAccountHidden,
  isHudHidden,
  isHudLevelHidden,
  isHudOverDarkScene,
} from '@/lib/top-hud-routes'
import { cn } from '@/lib/utils'

/**
 * Le bandeau du haut, façon Clash Royale : les infos de jeu que l'élève garde
 * sous les yeux partout — son niveau, ses DEUX monnaies (pièces et gemmes,
 * chacune avec son « + » vers l'endroit où elle se gagne) et l'accès au profil —
 * FLOTTENT au-dessus du fond d'écran de chaque interface. Plus de barre pleine
 * largeur opaque : chaque info est une pastille translucide (backdrop-blur +
 * ombre) posée sur le décor, si bien qu'on voit le fond de l'arène / de l'onglet
 * derrière. Mobile uniquement (`md:hidden`) : sur desktop la sidebar porte déjà
 * l'identité. Les valeurs viennent du serveur (TopHudLoader) ; ce composant ne
 * fait que l'affichage + le masquage sur le parcours d'accueil plein écran.
 */
export default function TopHud({
  coins,
  gems,
  level,
  levelTitle,
  progress,
  userLabel,
}: {
  /** Solde de pièces, ou null pour un visiteur non connecté. */
  coins: number | null
  /** Solde de gemmes, ou null pour un visiteur non connecté. */
  gems: number | null
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
  // Sur l'arène, le niveau est porté par le ProfileChip du HUD : la pastille
  // du bandeau se replie pour ne pas afficher le niveau en double.
  const levelHidden = isHudLevelHidden(pathname)
  // Scène sombre (arène) : les pastilles prennent le verre de nuit du HUD de
  // jeu au lieu du crème des onglets clairs. Un seul matériau par écran.
  const dark = isHudOverDarkScene(pathname)
  // Sur l'arène, l'engrenage est passé DANS le burger (avec l'historique, les
  // classements, le tournoi…) : le bandeau ne garde que les pièces, et le haut
  // de l'écran laisse la place au bandeau de saison, au centre.
  const accountHidden = isHudAccountHidden(pathname)
  // Le fond commun des pastilles : verre de nuit sur l'arène, carte crème
  // ailleurs. Écrit une fois, appliqué aux trois pastilles du bandeau.
  const pillSurface = dark
    ? 'olympe-glass'
    : 'bg-card/85 ring-1 ring-black/5 shadow-lg backdrop-blur-md'

  // Le bandeau ne capte plus les taps : seules les pastilles sont cliquables,
  // le reste de la bande laisse passer vers le décor derrière.
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex h-14 items-center gap-2 px-3 md:hidden">
      {connected ? (
        <>
          {/* Niveau : écusson de jeu flottant — disque violet ciselé (dégradé,
              reflet haut + liseré or, façon médaillon d'arène en miniature),
              libellé violet marqué, et ruban doré de progression surmonté du
              pourcentage pour rendre l'avancée lisible d'un coup d'œil.
              Replié sur /defi (le ProfileChip de l'arène est LA source). */}
          {levelHidden ? null : (
          <div
            className={cn(
              'pointer-events-auto flex min-w-0 items-center gap-2.5 rounded-full py-1 pr-3.5 pl-1',
              pillSurface,
            )}
            title={levelTitle ?? undefined}
          >
            <span
              className="font-heading flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-primary to-[color-mix(in_oklch,var(--primary),black_24%)] text-sm font-extrabold text-primary-foreground tabular-nums ring-2 ring-highlight/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_2px_5px_rgba(0,0,0,0.3)]"
              aria-hidden="true"
            >
              {level}
            </span>
            <div className="min-w-0">
              <p
                className={cn(
                  'font-heading text-[10px] leading-none font-extrabold tracking-wide uppercase',
                  dark ? 'text-[#faf6ef]' : 'text-primary',
                )}
              >
                Niveau {level}
              </p>
              <div className="mt-1 flex items-center gap-1.5">
                <div
                  className={cn(
                    'h-2 w-16 overflow-hidden rounded-full',
                    dark
                      ? 'bg-black/35 ring-1 ring-white/15'
                      : 'bg-muted ring-1 ring-black/[0.06]',
                  )}
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
                <span
                  className={cn(
                    'hidden min-[360px]:inline font-mono text-[9px] leading-none font-bold tabular-nums',
                    dark ? 'text-white/70' : 'text-muted-foreground',
                  )}
                >
                  {pct}%
                </span>
              </div>
            </div>
          </div>
          )}

          {/* LA BANDE DE RESSOURCES, façon Clash Royale : les soldes ne sont
              pas rangés dans une boutique qu'on pense à ouvrir, ils sont sous
              les yeux en permanence — et chacun porte son « + », qui est
              exactement ce qui transforme un compteur passif en PORTE. Chaque
              monnaie mène là où elle se gagne : les pièces au Trésor (la
              boutique), les gemmes chez les Amis (elles ne s'achètent pas, elles
              se gagnent en parrainant — cf. lib/gems).

              Sur crème, la pastille des pièces EST dorée (elle doit ressortir du
              fond clair) ; sur la scène sombre, elle prend le verre de nuit
              comme ses voisines et c'est le CHIFFRE qui devient or — l'or dit la
              valeur, pas le contenant. */}
          <div className="ml-auto flex shrink-0 items-center gap-1.5">
            <ResourcePill
              href="/tresor"
              label={`${coins} pièces — voir le Trésor`}
              value={coins}
              icon={<EcuIcon className="size-5" />}
              className={
                dark
                  ? 'olympe-glass text-highlight'
                  : // L'écu illustré est DORÉ : la pastille dorée qui le portait
                    // sur crème le noyait. C'est désormais l'objet qui ressort du
                    // fond clair, pas son contenant — et le chiffre reprend
                    // l'encre. L'or reste la couleur de la valeur.
                    'bg-card/90 text-foreground shadow-lg ring-1 ring-black/10 backdrop-blur-md'
              }
              plusClassName={
                dark
                  ? 'bg-highlight text-foreground'
                  : 'bg-highlight/25 text-foreground'
              }
            />
            {/* Sous 360 px de large, la bande céderait sur l'écusson de niveau :
                la seconde monnaie s'efface plutôt que d'écraser ses voisines
                (même arbitrage que le pourcentage du niveau, juste au-dessus). */}
            {gems !== null ? (
              <ResourcePill
                href="/amis"
                label={`${gems} gemmes — les gagner en invitant tes amis`}
                value={gems}
                icon={<CristalIcon className="size-5" />}
                className={cn(
                  'max-[359px]:hidden',
                  dark
                    ? 'olympe-glass text-[#d8c9ff]'
                    : 'bg-card/85 text-primary shadow-lg ring-1 ring-black/5 backdrop-blur-md',
                )}
                plusClassName={
                  dark
                    ? 'bg-white/18 text-[#faf6ef]'
                    : 'bg-primary/15 text-primary'
                }
              />
            ) : null}
          </div>
        </>
      ) : (
        <Link
          href="/"
          className={cn(
            'pointer-events-auto font-heading rounded-full px-3 py-1.5 text-lg font-bold',
            pillSurface,
          )}
        >
          Studuel
        </Link>
      )}

      {/* Réglages du compte — pastille ronde flottante à l'extrême droite. Ce
          n'est PAS l'entrée « profil de jeu » (avatar, stats, badges) : celle-ci
          est la carte joueur en haut à gauche de l'arène. Pour lever la
          confusion des deux entrées jumelles, on affiche ici un engrenage
          (réglages du compte : /compte), pas une silhouette qui se lisait comme
          un second bouton profil. Visiteur non connecté → icône « entrer ». */}
      {accountHidden ? null : (
      <Link
        href={accountHref}
        aria-label={userLabel ? `Réglages du compte — ${userLabel}` : 'Se connecter'}
        title={userLabel ? 'Réglages du compte' : 'Se connecter'}
        className={cn(
          'pointer-events-auto flex size-10 shrink-0 items-center justify-center rounded-full transition active:scale-95',
          pillSurface,
          connected ? '' : 'ml-auto',
          dark
            ? accountActive
              ? 'text-highlight'
              : 'text-[#faf6ef]'
            : accountActive
              ? 'text-primary'
              : 'text-foreground',
        )}
      >
        {userLabel ? (
          <Settings className="size-6" strokeWidth={2.1} aria-hidden="true" />
        ) : (
          <LogIn className="size-6" strokeWidth={2.1} aria-hidden="true" />
        )}
      </Link>
      )}
    </header>
  )
}

/**
 * Une pastille de ressource de la bande du haut : le picto, le solde, et le
 * « + » qui mène là où cette monnaie se gagne. Le « + » n'est PAS un second
 * bouton — toute la pastille est le lien ; il est là pour dire « on peut en
 * avoir plus », ce qu'un nombre seul ne dit jamais.
 */
function ResourcePill({
  href,
  label,
  value,
  icon,
  className,
  plusClassName,
}: {
  href: string
  label: string
  value: number
  icon: ReactNode
  /** Robe de la pastille (verre de nuit sur l'arène, crème ailleurs). */
  className: string
  /** Robe du disque « + ». */
  plusClassName: string
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        'pointer-events-auto flex min-h-11 shrink-0 items-center gap-1.5 rounded-full py-1.5 pr-1.5 pl-3 font-mono text-sm font-extrabold tabular-nums transition active:scale-95',
        className,
      )}
    >
      {icon}
      {value.toLocaleString('fr-FR')}
      <span
        className={cn(
          'grid size-5 shrink-0 place-items-center rounded-full',
          plusClassName,
        )}
        aria-hidden="true"
      >
        <Plus className="size-3.5" strokeWidth={3.2} />
      </span>
    </Link>
  )
}
