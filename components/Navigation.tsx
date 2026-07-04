'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CircleUser, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'

// Ordre des onglets = ordre de la barre mobile. Le Défi est au centre,
// surélevé — c'est LE geste quotidien. Langage d'icônes : émojis stickers.
const links = [
  { name: 'IA', path: '/ia', emoji: '✨' },
  { name: 'Réviser', path: '/reviser', emoji: '🏠' },
  { name: 'Défi', path: '/defi', center: true },
  { name: 'Moi', path: '/moi', emoji: '🧑' },
  { name: 'Coaching', path: '/planning', emoji: '🤝' },
] as {
  name: string
  path: string
  emoji?: string
  center?: boolean
}[]

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

      {/* …et barre d'onglets fixée en bas, Défi surélevé au centre */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-card/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
        <ul className="flex items-end">
          {links.map(({ name, path, emoji, center }) => {
            const active = isActive(path)

            if (center) {
              return (
                <li key={path} className="flex-1">
                  <Link
                    href={path}
                    onClick={() => sfx.tap()}
                    aria-current={active ? 'page' : undefined}
                    className="flex flex-col items-center gap-0.5 pb-2 text-[11px] font-medium"
                  >
                    <span
                      className={cn(
                        '-mt-5 flex size-14 items-center justify-center rounded-full border-4 border-background bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-all active:scale-90',
                        active && 'ring-2 ring-highlight',
                      )}
                    >
                      <Zap className="size-6" />
                    </span>
                    <span className={active ? 'text-primary' : 'text-muted-foreground'}>
                      {name}
                    </span>
                  </Link>
                </li>
              )
            }

            return (
              <li key={path} className="flex-1">
                <Link
                  href={path}
                  onClick={() => sfx.tap()}
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
                    {emoji ? (
                      <span className="text-[17px] leading-none">{emoji}</span>
                    ) : null}
                  </span>
                  {name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Desktop : sidebar sticky */}
      <nav className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-8 border-r bg-card p-5 md:flex">
        <Link href="/" className="font-heading px-3 text-2xl font-bold">
          Scolaria
        </Link>

        <ul className="flex flex-col gap-1">
          {links.map(({ name, path, emoji, center }) => (
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
                {center ? (
                  <Zap className="size-4 shrink-0" />
                ) : emoji ? (
                  <span className="w-4 shrink-0 text-center text-[15px] leading-none">
                    {emoji}
                  </span>
                ) : null}
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
