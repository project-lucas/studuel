'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowLeft, Menu, X } from 'lucide-react'
import { lienActif, sectionsConsole } from '@/lib/console/nav'
import { cn } from '@/lib/utils'
import IconeConsole from './IconeConsole'
import BoutonMessagerie from './BoutonMessagerie'

/**
 * LA CONSOLE — coach et admin dans un seul outil, pensé d'abord pour
 * l'ordinateur (16/10/2026, Lucas : « je bosse toujours sur PC »).
 *
 *   ordinateur (lg+) : une barre latérale fixe à sections (Coaching, puis
 *                      Administration pour l'admin), la page à droite sur
 *                      toute la largeur utile (1 400 px au plus) ;
 *   téléphone        : une barre du haut, le menu dans un tiroir.
 * En haut à droite, toujours : l'icône MESSAGERIE (pastille des non-lus) qui
 * ouvre les conversations et la diffusion. Même grammaire que l'app (crème,
 * cartes blanches, Baloo 2), mais c'est un outil : aucun dessin.
 */
export default function ConsoleShell({
  roles,
  prenom,
  children,
}: {
  roles: { coach: boolean; admin: boolean }
  prenom: string | null
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const sections = useMemo(() => sectionsConsole(roles), [roles])
  const actif = lienActif(pathname, sections)
  const lienCourant = sections.flatMap((s) => s.liens).find((l) => l.href === actif)
  // Le tiroir est ouvert POUR une page : il se referme dès qu'on en change.
  const [tiroirPour, setTiroirPour] = useState<string | null>(null)
  const tiroir = tiroirPour === pathname
  const setTiroir = (ouvert: boolean) => setTiroirPour(ouvert ? pathname : null)

  const nav = (
    <nav aria-label="Console" className="flex flex-col gap-5">
      {sections.map((s) => (
        <div key={s.titre}>
          <p className="surtitre px-3 pb-1.5">{s.titre}</p>
          <ul className="flex flex-col gap-0.5">
            {s.liens.map((l) => {
              const est = l.href === actif
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    title={l.aide}
                    aria-current={est ? 'page' : undefined}
                    className={cn(
                      'flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-bold transition-colors',
                      est ? 'bg-primary text-primary-foreground' : 'text-foreground/80 hover:bg-secondary hover:text-foreground',
                    )}
                  >
                    <IconeConsole nom={l.icone} className="size-4 shrink-0" />
                    <span className="truncate">{l.libelle}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )

  const marque = (
    <Link href={roles.admin ? '/admin/insights' : '/coach'} className="font-heading flex items-center gap-2 px-3 text-lg font-extrabold">
      <span className="grid size-8 place-items-center rounded-xl bg-primary text-sm text-primary-foreground">S</span>
      Console Studuel
    </Link>
  )

  return (
    <div className="min-h-dvh lg:pl-64">
      {/* La barre latérale (ordinateur). */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col gap-6 overflow-y-auto border-r border-primary/10 bg-card px-3 py-5 lg:flex">
        {marque}
        {nav}
        <div className="mt-auto flex flex-col gap-2 px-3 text-xs font-semibold text-muted-foreground">
          {prenom ? <span>Connecté : {prenom}</span> : null}
          <Link href="/reviser" className="inline-flex items-center gap-1.5 hover:text-foreground">
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Retour à l’app
          </Link>
        </div>
      </aside>

      {/* Le tiroir (téléphone et tablette). */}
      {tiroir ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu de la console">
          <button type="button" className="absolute inset-0 bg-foreground/30" aria-label="Fermer le menu" onClick={() => setTiroir(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col gap-6 overflow-y-auto bg-card px-3 py-5 shadow-xl">
            <div className="flex items-center justify-between">
              {marque}
              <button type="button" onClick={() => setTiroir(false)} className="grid size-10 place-items-center rounded-full hover:bg-secondary" aria-label="Fermer le menu">
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            {nav}
            <Link href="/reviser" className="mt-auto px-3 text-sm font-semibold text-muted-foreground">
              ← Retour à l’app
            </Link>
          </div>
        </div>
      ) : null}

      {/* La barre du haut. */}
      <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-primary/10 bg-background/95 px-4 md:px-8">
        <button
          type="button"
          onClick={() => setTiroir(true)}
          className="grid size-10 place-items-center rounded-full hover:bg-secondary lg:hidden"
          aria-label="Ouvrir le menu"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="font-heading truncate text-lg leading-tight font-extrabold">{lienCourant?.libelle ?? 'Console'}</p>
          {lienCourant ? <p className="hidden truncate text-xs font-semibold text-muted-foreground sm:block">{lienCourant.aide}</p> : null}
        </div>
        <BoutonMessagerie admin={roles.admin} />
      </header>

      <main className="mx-auto w-full max-w-[1400px] px-4 py-6 md:px-8">{children}</main>
    </div>
  )
}
