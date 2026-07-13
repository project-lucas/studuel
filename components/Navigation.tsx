'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CircleUser } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'

// Ordre des onglets = ordre de la barre mobile, le Défi au centre.
// Icônes dessinées (jaune/violet, liseré encre) : l'onglet inactif est
// grisé, l'actif reprend ses couleurs. Sur mobile, pas de libellé sous
// l'icône : toute la place aux dessins (le nom reste porté par aria-label).
const links = [
  { name: 'Amis', path: '/amis', img: '/images/nav/amis.webp' },
  { name: 'Réviser', path: '/reviser', img: '/images/nav/reviser.webp' },
  { name: 'Défi', path: '/defi', img: '/images/nav/defi-3.webp', center: true },
  { name: 'Moi', path: '/moi', img: '/images/nav/moi.webp' },
  { name: 'Trésor', path: '/tresor', img: '/images/nav/tresor-3.webp' },
] as {
  name: string
  path: string
  img: string
  center?: boolean
}[]

export default function Navigation({ userLabel }: { userLabel: string | null }) {
  const pathname = usePathname()

  // Parcours d'accueil plein écran (façon Duolingo) : aucune barre de nav.
  if (pathname === '/bienvenue' || pathname.startsWith('/bienvenue/')) return null

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(`${path}/`)

  const accountHref = userLabel ? '/compte' : '/login'
  const accountActive = isActive('/compte') || isActive('/login')

  return (
    <>
      {/* Mobile first : barre du haut (marque + compte), verre dépoli… */}
      <header className="fixed inset-x-0 top-0 z-50 flex h-12 items-center justify-between border-b bg-card/85 px-4 backdrop-blur-md md:hidden">
        <Link href="/" className="font-heading text-lg font-bold">
          Studuel
        </Link>
        <Link
          href={accountHref}
          aria-label={userLabel ? 'Mon compte' : 'Se connecter'}
          className={cn(
            'flex items-center gap-2 text-sm font-medium transition-colors',
            accountActive ? 'text-primary' : 'text-muted-foreground',
          )}
        >
          {userLabel ? (
            <span className="max-w-32 truncate">{userLabel}</span>
          ) : (
            <span>Se connecter</span>
          )}
          <CircleUser className="size-5" />
        </Link>
      </header>

      {/* …et barre d'onglets fixée en bas, Défi surélevé au centre */}
      <nav className="tab-bar fixed inset-x-0 bottom-0 z-50 border-t pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
        <ul className="flex items-end">
          {links.map(({ name, path, img }) => {
            const active = isActive(path)

            return (
              <li key={path} className="flex-1">
                <Link
                  href={path}
                  onClick={() => sfx.tap()}
                  aria-label={name}
                  aria-current={active ? 'page' : undefined}
                  className="flex items-center justify-center pt-1.5 pb-2 transition-all active:scale-95"
                >
                  <span className="flex h-12 w-16 items-center justify-center">
                    <Image
                      src={img}
                      alt=""
                      width={40}
                      height={40}
                      className={cn(
                        'size-10 transition-all',
                        active ? 'scale-110' : 'opacity-60 grayscale',
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
