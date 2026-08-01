'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import {
  CircleUser,
  Crown,
  GraduationCap,
  House,
  Swords,
  User,
  Users,
} from 'lucide-react'
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
  users: Users,
  house: House,
  cap: GraduationCap,
  swords: Swords,
  user: User,
  crown: Crown,
}

/**
 * Deux tons hérités de la DA, appliqués à l'icône ACTIVE : le trait prend le
 * violet d'action, le remplissage prend la couleur du rôle de l'onglet — jaune
 * solaire pour ce qu'on gagne (Trésor), violet pâle pour le reste.
 * L'onglet inactif est un simple trait gris, sans remplissage.
 */
const ACTIVE_FILL: Record<string, string> = {
  action: 'fill-primary/15',
  recompense: 'fill-highlight/45',
}

export default function Navigation({
  userLabel,
  // Pastille d'appel du Coffre (façon Clash Royale), rendue côté SERVEUR par le
  // layout sous <Suspense> : la barre s'affiche tout de suite, la pastille se
  // pose quand la réponse arrive. `null` quand il n'y a rien à récupérer.
  chestBadge = null,
}: {
  userLabel: string | null
  chestBadge?: ReactNode
}) {
  const pathname = usePathname()

  // Parcours d'accueil plein écran (façon Duolingo) : aucune barre de nav.
  if (pathname === '/bienvenue' || pathname.startsWith('/bienvenue/')) return null

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(`${path}/`)

  // Halo violet unique qui « voyage » vers l'onglet actif (barre mobile) : sa
  // position horizontale se dérive de l'index actif, le CSS anime le glissement.
  const activeIndex = links.findIndex(({ path }) => isActive(path))

  const accountHref = userLabel ? '/compte' : '/login'
  const accountActive = isActive('/compte') || isActive('/login')

  return (
    <>
      {/* La barre du haut sur mobile (pièces + niveau + compte) est portée par
          TopHud (bandeau de jeu, toujours visible), rendu par le layout. */}

      {/* Barre d'onglets fixée en bas — modèle Clash Royale : tous les onglets
          sont de simples icônes sur le socle crème, SEUL l'onglet sélectionné
          porte une plaque violette et affiche son mot. Plus d'orbe central : le
          Défi est un onglet comme les autres, c'est la sélection qui parle. */}
      <nav className="tab-bar fixed inset-x-0 bottom-0 z-50 border-t pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
        {/* `overflow-hidden` = garde-fou : la plaque ne peut pas déborder
            au-dessus du liseré doré de la barre. */}
        <ul className="relative flex h-14 items-stretch overflow-hidden">
          {/* Plaque violette qui suit l'onglet actif — elle GLISSE d'un onglet
              à l'autre (une seule plaque animée, pas six fondus). Elle occupe la
              cellule entière ; le retrait visuel est dessiné par ::before. */}
          {activeIndex >= 0 && (
            <span
              aria-hidden="true"
              className="tab-plate"
              style={{
                left: `${(activeIndex / links.length) * 100}%`,
                width: `${100 / links.length}%`,
              }}
            />
          )}
          {links.map(({ name, path, icon, role }) => {
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
                  className="flex h-full flex-col items-center justify-center transition-transform active:scale-95"
                >
                  {/* Boîte au plus juste autour du dessin : la pastille du
                      coffre se cale sur le COIN de l'icône, pas sur la zone
                      tactile. */}
                  <span className="relative flex">
                    <Icon
                      aria-hidden="true"
                      strokeWidth={active ? 2.25 : 1.75}
                      className={cn(
                        'size-7 transition-transform duration-200',
                        active
                          ? // L'agrandissement, c'est LE signal de sélection :
                            // l'icône enfle d'un tiers sur sa plaque.
                            cn('scale-[1.3] text-primary', ACTIVE_FILL[role])
                          : // Encre atténuée, PAS muted-foreground : sur la
                            // barre crème, le gris chaud passait sous 3:1.
                            'fill-transparent text-foreground/70',
                      )}
                    />
                    {icon === 'crown' ? chestBadge : null}
                  </span>
                  {/* Le mot n'apparaît que sous l'onglet actif. On le garde
                      TOUJOURS dans le DOM, replié à hauteur nulle : l'icône
                      glisse au lieu de sauter quand on change d'onglet. Les
                      lecteurs d'écran lisent l'aria-label du lien. */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'font-heading overflow-hidden text-[10px] leading-none font-bold text-primary transition-all duration-200',
                      active ? 'mt-1.5 max-h-3 opacity-100' : 'mt-0 max-h-0 opacity-0',
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
                      : 'text-foreground/70 hover:bg-accent hover:text-accent-foreground',
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
                : 'text-foreground/70 hover:bg-accent hover:text-accent-foreground',
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
