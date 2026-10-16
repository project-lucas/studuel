'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AppWindow, ArrowLeft, ChevronRight, GraduationCap, Menu, X } from 'lucide-react'
import { espaceActif, espacesConsole, lienActif, type EspaceConsole, type EspaceId } from '@/lib/console/nav'
import { cn } from '@/lib/utils'
import IconeConsole from './IconeConsole'
import BoutonMessagerie from './BoutonMessagerie'

const ICONE_ESPACE: Record<EspaceId, typeof GraduationCap> = { scolaria: GraduationCap, studuel: AppWindow }

/**
 * LA CONSOLE — deux espaces, pensée d'abord pour l'ordinateur (16/10/2026).
 *
 *   SCOLARIA · le coaching  et  STUDUEL · l'app (lib/console/nav) : un
 *   sélecteur en haut de la barre latérale passe de l'un à l'autre, chaque
 *   espace range ses pages en petites sections (Suivi, Organisation… /
 *   Pilotage, Contenu, Communication, Business, Technique).
 *   ordinateur (lg+) : barre latérale fixe, page à droite (1 400 px au plus) ;
 *   téléphone        : barre du haut, menu dans un tiroir.
 * En haut à droite, toujours : l'icône MESSAGERIE (non-lus). Même grammaire que
 * l'app (crème, cartes blanches, Baloo 2), mais c'est un outil : aucun dessin.
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
  const espaces = useMemo(() => espacesConsole(roles), [roles])
  const espace = espaceActif(pathname, espaces)
  const actif = lienActif(pathname, espaces.flatMap((e) => e.sections))
  const lienCourant = espaces.flatMap((e) => e.sections.flatMap((s) => s.liens)).find((l) => l.href === actif)
  // Le tiroir est ouvert POUR une page : il se referme dès qu'on en change.
  const [tiroirPour, setTiroirPour] = useState<string | null>(null)
  const tiroir = tiroirPour === pathname
  const setTiroir = (ouvert: boolean) => setTiroirPour(ouvert ? pathname : null)

  const selecteur =
    espaces.length > 1 ? (
      <div className="grid grid-cols-2 gap-1 rounded-2xl bg-secondary p-1" role="tablist" aria-label="Espace">
        {espaces.map((e) => {
          const Icone = ICONE_ESPACE[e.id]
          const est = e.id === espace?.id
          return (
            <Link
              key={e.id}
              href={e.accueil}
              role="tab"
              aria-selected={est}
              className={cn(
                'flex flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-center transition-colors',
                est ? 'bg-card shadow-sm ring-1 ring-primary/20' : 'text-foreground/70 hover:bg-card/60',
              )}
            >
              <Icone className={cn('size-5', est ? 'text-primary' : 'text-muted-foreground')} aria-hidden="true" />
              <span className="font-heading text-sm leading-tight font-extrabold">{e.nom}</span>
              <span className="text-[10px] leading-tight font-semibold text-muted-foreground">{e.role}</span>
            </Link>
          )
        })}
      </div>
    ) : espace ? (
      <EnTeteEspace espace={espace} />
    ) : null

  const nav = espace ? (
    <nav aria-label={`Espace ${espace.nom}`} className="flex flex-col gap-4">
      {espace.sections.map((s) => (
        <div key={s.titre}>
          <p className="surtitre px-3 pb-1">{s.titre}</p>
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
                    <IconeConsole nom={l.icone} className="size-[18px] shrink-0" />
                    <span className="truncate">{l.libelle}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  ) : null

  const marque = (
    <Link href={espace?.accueil ?? '/coach'} className="font-heading flex items-center gap-2 px-1 text-lg font-extrabold">
      <span className="grid size-8 place-items-center rounded-xl bg-primary text-sm text-primary-foreground">S</span>
      Console
    </Link>
  )

  const pied = (
    <div className="mt-auto flex flex-col gap-2 px-3 pt-4 text-xs font-semibold text-muted-foreground">
      {prenom ? <span>Connecté : {prenom}</span> : null}
      <Link href="/reviser" className="inline-flex items-center gap-1.5 hover:text-foreground">
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Retour à l’app
      </Link>
    </div>
  )

  return (
    <div className="min-h-dvh lg:pl-64">
      {/* La barre latérale (ordinateur). */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col gap-5 overflow-y-auto border-r border-primary/10 bg-card px-3 py-5 lg:flex">
        {marque}
        {selecteur}
        {nav}
        {pied}
      </aside>

      {/* Le tiroir (téléphone et tablette). */}
      {tiroir ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu de la console">
          <button type="button" className="absolute inset-0 bg-foreground/30" aria-label="Fermer le menu" onClick={() => setTiroir(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col gap-5 overflow-y-auto bg-card px-3 py-5 shadow-xl">
            <div className="flex items-center justify-between">
              {marque}
              <button type="button" onClick={() => setTiroir(false)} className="grid size-10 place-items-center rounded-full hover:bg-secondary" aria-label="Fermer le menu">
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            {selecteur}
            {nav}
            {pied}
          </div>
        </div>
      ) : null}

      {/* La barre du haut : l'espace › la page, et la messagerie. */}
      <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-primary/10 bg-background/95 px-4 md:px-8">
        <button type="button" onClick={() => setTiroir(true)} className="grid size-10 place-items-center rounded-full hover:bg-secondary lg:hidden" aria-label="Ouvrir le menu">
          <Menu className="size-5" aria-hidden="true" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 truncate">
            {espace ? (
              <>
                <span className="text-sm font-bold text-muted-foreground">{espace.nom}</span>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              </>
            ) : null}
            <span className="font-heading truncate text-lg leading-tight font-extrabold">{lienCourant?.libelle ?? 'Console'}</span>
          </p>
          {lienCourant ? <p className="hidden truncate text-xs font-semibold text-muted-foreground sm:block">{lienCourant.aide}</p> : null}
        </div>
        <BoutonMessagerie admin={roles.admin} />
      </header>

      <main className="mx-auto w-full max-w-[1400px] px-4 py-6 md:px-8">{children}</main>
    </div>
  )
}

/** Un seul espace (un coach) : son nom en tête, sans sélecteur. */
function EnTeteEspace({ espace }: { espace: EspaceConsole }) {
  const Icone = ICONE_ESPACE[espace.id]
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-secondary px-3 py-2.5">
      <Icone className="size-5 text-primary" aria-hidden="true" />
      <span>
        <span className="font-heading block text-sm leading-tight font-extrabold">{espace.nom}</span>
        <span className="block text-[11px] font-semibold text-muted-foreground">{espace.role}</span>
      </span>
    </div>
  )
}
