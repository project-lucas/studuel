'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  PlaySquare,
  Sparkles,
  FlaskConical,
  CalendarDays,
  Flame,
  CircleUser,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Ordre des onglets = ordre de la barre mobile (Formation tout à gauche).
const links = [
  { name: 'Formation', path: '/formation', icon: PlaySquare },
  { name: 'Studio', path: '/studio', icon: Sparkles },
  { name: 'Test', path: '/test', icon: FlaskConical },
  { name: 'Planning', path: '/planning', icon: CalendarDays },
  { name: 'Habitude', path: '/habitude', icon: Flame },
]

export default function Navigation({ userLabel }: { userLabel: string | null }) {
  const pathname = usePathname()

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(`${path}/`)

  const accountHref = userLabel ? '/compte' : '/login'
  const accountActive = isActive('/compte') || isActive('/login')

  return (
    <>
      {/* Mobile first : barre du haut (marque + compte), verre dépoli… */}
      <header className="fixed inset-x-0 top-0 z-50 flex h-12 items-center justify-between border-b bg-card/85 px-4 backdrop-blur-md md:hidden">
        <Link href="/" className="font-heading text-lg font-bold">
          Scolaria
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

      {/* …et barre d'onglets fixée en bas — l'onglet actif est « surligné » */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-card/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
        <ul className="flex">
          {links.map(({ name, path, icon: Icon }) => {
            const active = isActive(path)
            return (
              <li key={path} className="flex-1">
                <Link
                  href={path}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex flex-col items-center gap-0.5 pt-1.5 pb-2 text-[11px] font-medium transition-all active:scale-95',
                    active
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-7 w-12 items-center justify-center rounded-full transition-colors',
                      active && 'bg-accent text-accent-foreground',
                    )}
                  >
                    <Icon className="size-5" />
                  </span>
                  {name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Desktop : sidebar sticky (ne défile pas avec le contenu) */}
      <nav className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-8 border-r bg-card p-5 md:flex">
        <Link href="/" className="font-heading px-3 text-2xl font-bold">
          Scolaria
        </Link>

        <ul className="flex flex-col gap-1">
          {links.map(({ name, path, icon: Icon }) => (
            <li key={path}>
              <Link
                href={path}
                aria-current={isActive(path) ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive(path)
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )}
              >
                <Icon className="size-4 shrink-0" />
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
