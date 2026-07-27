'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CircleUser, Gem, Gift, House, Swords, User, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { NAV_TABS, type NavIconName } from '@/lib/nav-tabs'

// Ordre des onglets = ordre de la barre mobile (Défi au centre) et ordre du
// balayage horizontal : les deux lisent NAV_TABS.
const links = NAV_TABS

// Correspondance clé (lib, pure) → dessin (composant). Icônes de TRAIT : un seul
// poids de ligne, aucun détail décoratif, elles restent lisibles à 20 px.
const ICONS: Record<NavIconName, LucideIcon> = {
  gift: Gift,
  users: Users,
  house: House,
  swords: Swords,
  user: User,
  gem: Gem,
}

/**
 * Deux tons hérités de la DA, appliqués à l'icône ACTIVE : le trait prend le
 * violet d'action, le remplissage prend la couleur du rôle de l'onglet — jaune
 * solaire pour ce qu'on gagne (Coffre, Trésor), violet pâle pour le reste.
 * L'onglet inactif est un simple trait gris, sans remplissage.
 */
const ACTIVE_FILL: Record<string, string> = {
  action: 'fill-primary/15',
  recompense: 'fill-highlight/45',
}

export default function Navigation({ userLabel }: { userLabel: string | null }) {
  const pathname = usePathname()

  // Parcours d'accueil plein écran (façon Duolingo) : aucune barre de nav.
  if (pathname === '/bienvenue' || pathname.startsWith('/bienvenue/')) return null

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(`${path}/`)

  // Halo violet unique qui « voyage » vers l'onglet actif (barre mobile) : sa
  // position horizontale se dérive de l'index actif, le CSS anime le glissement.
  const activeIndex = links.findIndex(({ path }) => isActive(path))
  const activeIsCenter = activeIndex >= 0 && Boolean(links[activeIndex].center)

  const accountHref = userLabel ? '/compte' : '/login'
  const accountActive = isActive('/compte') || isActive('/login')

  return (
    <>
      {/* La barre du haut sur mobile (pièces + niveau + compte) est portée par
          TopHud (bandeau de jeu, toujours visible), rendu par le layout. */}

      {/* Barre d'onglets fixée en bas, Défi surélevé au centre */}
      <nav className="tab-bar fixed inset-x-0 bottom-0 z-50 border-t pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
        <ul className="relative flex items-end">
          {/* Halo violet qui suit l'onglet actif — glisse en douceur d'un onglet
              à l'autre à chaque changement de route. */}
          {activeIndex >= 0 && (
            <span
              aria-hidden="true"
              className="tab-glow"
              data-center={activeIsCenter ? '' : undefined}
              style={{ left: `${((activeIndex + 0.5) / links.length) * 100}%` }}
            />
          )}
          {links.map(({ name, path, icon, role, center }) => {
            const active = isActive(path)
            const Icon = ICONS[icon]

            return (
              <li key={path} className="relative z-10 flex-1">
                <Link
                  href={path}
                  onClick={() => sfx.tap()}
                  aria-label={name}
                  aria-current={active ? 'page' : undefined}
                  data-tour={`tab-${path.slice(1)}`}
                  className="flex flex-col items-center justify-end gap-0.5 pt-1 pb-1.5 transition-all active:scale-95"
                >
                  <span
                    className={cn(
                      'flex w-16 items-center justify-center',
                      // Onglet central (Défi) surélevé façon écran d'arène.
                      center ? 'tab-center h-12' : 'h-10',
                    )}
                  >
                    <Icon
                      aria-hidden="true"
                      strokeWidth={active ? 2.25 : 1.75}
                      className={cn(
                        'transition-all',
                        center ? 'size-8' : 'size-6',
                        active
                          ? cn(
                              'scale-110 text-primary',
                              ACTIVE_FILL[role],
                              center && 'tab-center-active',
                            )
                          : 'fill-transparent text-muted-foreground/70',
                      )}
                    />
                  </span>
                  {/* Libellé texte sous chaque icône : l'onglet ne se devine plus,
                      il se lit. L'état actif se marque AUSSI par le texte (violet
                      marqué) en plus de l'icône (couleurs vs grisé) — un repère
                      redondant, jamais porté par la seule couleur de l'icône. */}
                  <span
                    className={cn(
                      'font-heading text-[0.6rem] leading-none font-extrabold tracking-tight transition-colors',
                      active ? 'text-primary' : 'text-muted-foreground/70',
                    )}
                  >
                    {name}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Desktop : sidebar sticky */}
      <nav className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-8 border-r bg-card p-5 md:flex">
        <Link href="/" className="font-heading px-3 text-2xl font-bold">
          Studuel
        </Link>

        <ul className="flex flex-col gap-1">
          {links.map(({ name, path, icon, center }) => {
            const active = isActive(path)
            const Icon = ICONS[icon]

            return (
              <li key={path}>
                <Link
                  href={path}
                  onClick={() => sfx.tap()}
                  aria-current={active ? 'page' : undefined}
                  data-tour={`tab-${path.slice(1)}`}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                    center && !active && 'font-bold text-primary',
                  )}
                >
                  {/* Sur la pastille violette pleine, l'icône passe en trait
                      blanc (currentColor) et son remplissage devient un simple
                      voile clair : le jaune de récompense y serait illisible.
                      `role` ne sert donc qu'à la barre mobile, sur crème. */}
                  <Icon
                    aria-hidden="true"
                    strokeWidth={active ? 2.25 : 1.75}
                    className={cn(
                      'size-5 shrink-0 transition-all',
                      active ? 'fill-primary-foreground/20' : 'fill-transparent',
                    )}
                  />
                  {name}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Compte, en bas de la sidebar */}
        <div className="mt-auto border-t pt-4">
          <Link
            href={accountHref}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              accountActive
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
            )}
          >
            <CircleUser className="size-4 shrink-0" />
            <span className="truncate">{userLabel ?? 'Se connecter'}</span>
          </Link>
        </div>
      </nav>
    </>
  )
}
