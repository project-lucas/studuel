'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CircleUser } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { NAV_TABS } from '@/lib/nav-tabs'

// Ordre des onglets = ordre de la barre mobile (Défi au centre) et ordre du
// balayage horizontal : les deux lisent NAV_TABS. Icônes dessinées
// (jaune/violet, liseré encre) : l'onglet inactif est grisé, l'actif reprend
// ses couleurs. Sur mobile, pas de libellé sous l'icône : toute la place aux
// dessins (le nom reste porté par aria-label).
const links = NAV_TABS

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
          {links.map(({ name, path, img, center }) => {
            const active = isActive(path)

            return (
              <li key={path} className="relative z-10 flex-1">
                <Link
                  href={path}
                  onClick={() => sfx.tap()}
                  aria-label={name}
                  aria-current={active ? 'page' : undefined}
                  data-tour={`tab-${path.slice(1)}`}
                  className="flex items-center justify-center pt-1.5 pb-2 transition-all active:scale-95"
                >
                  <span
                    className={cn(
                      'flex w-16 items-center justify-center',
                      // Onglet central (Défi) surélevé façon écran d'arène.
                      center ? 'tab-center h-14' : 'h-12',
                    )}
                  >
                    <Image
                      src={img}
                      alt=""
                      width={center ? 56 : 40}
                      height={center ? 56 : 40}
                      className={cn(
                        'transition-all',
                        center ? 'size-14' : 'size-10',
                        active
                          ? cn('scale-110', center && 'tab-center-active')
                          : 'opacity-60 grayscale',
                      )}
                    />
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
          {links.map(({ name, path, img, center }) => (
            <li key={path}>
              <Link
                href={path}
                onClick={() => sfx.tap()}
                aria-current={isActive(path) ? 'page' : undefined}
                data-tour={`tab-${path.slice(1)}`}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive(path)
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  center && !isActive(path) && 'font-bold text-primary',
                )}
              >
                <Image
                  src={img}
                  alt=""
                  width={20}
                  height={20}
                  className={cn(
                    'size-5 shrink-0 transition-all',
                    !isActive(path) && 'opacity-70 grayscale-50',
                  )}
                />
                {name}
              </Link>
            </li>
          ))}
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
