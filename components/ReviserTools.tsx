'use client'

import Link from 'next/link'
import { RotateCcw, Library, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'

type Tool = {
  href: string
  label: string
  hint: string
  icon: typeof RotateCcw
  tile: string // classe de fond du médaillon
  badge?: number
}

// « Tes outils » — les deux entrées transverses de Réviser : rejouer ses erreurs
// (file SRS + Revanche) et ouvrir sa bibliothèque (fiches, quiz, flashcards).
// Rangée de cartes, façon « outils de progression » de la maquette.
export default function ReviserTools({
  reviewCount = 0,
}: {
  reviewCount?: number
}) {
  const tools: Tool[] = [
    {
      href: '/reviser/revoir',
      label: 'Revoir mes erreurs',
      hint:
        reviewCount > 0
          ? `${reviewCount} à retravailler`
          : 'Rien à revoir, bravo !',
      icon: RotateCcw,
      tile: 'bg-primary/12 text-primary',
      badge: reviewCount,
    },
    {
      href: '/reviser/bibliotheque',
      label: 'Voir ma bibliothèque',
      hint: 'Fiches, quiz, flashcards',
      icon: Library,
      tile: 'bg-highlight/25 text-foreground',
    },
  ]

  return (
    <section aria-label="Tes outils">
      <h2 className="font-heading mb-2 px-1 text-sm font-bold tracking-wide text-muted-foreground uppercase">
        Tes outils
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {tools.map((tool) => {
          const Icon = tool.icon
          return (
            <Link
              key={tool.href}
              href={tool.href}
              onClick={() => sfx.tap()}
              className="group flex items-center gap-3 rounded-3xl bg-white p-3.5 shadow-sm ring-1 ring-black/5 transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]"
            >
              <span
                className={cn(
                  'relative flex size-11 shrink-0 items-center justify-center rounded-2xl',
                  tool.tile,
                )}
              >
                <Icon className="size-5.5" strokeWidth={2.2} aria-hidden="true" />
                {tool.badge && tool.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-1.5 flex min-w-5 items-center justify-center rounded-full bg-destructive px-1 font-mono text-[10px] font-bold text-white tabular-nums shadow-sm">
                    {tool.badge > 99 ? '99+' : tool.badge}
                  </span>
                ) : null}
              </span>
              <span className="min-w-0 flex-1">
                <span className="font-heading block text-sm leading-tight font-bold text-foreground">
                  {tool.label}
                </span>
                <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                  {tool.hint}
                </span>
              </span>
              <ChevronRight
                className="size-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          )
        })}
      </div>
    </section>
  )
}
