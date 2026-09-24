'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { ChevronRight, type LucideIcon } from 'lucide-react'
import { sfx } from '@/lib/sounds'

/**
 * Un rayon vide, en UNE ligne : ce qu'on y rangera et où l'obtenir.
 */
export function Invitation({
  href,
  icone: Icone,
  titre,
  texte,
}: {
  href: string
  icone: LucideIcon
  titre: string
  texte: string
}) {
  return (
    <Link
      href={href}
      onClick={() => sfx.tap()}
      className="carte flex items-center gap-3 p-3 transition active:scale-[0.99]"
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
        <Icone className="size-5" strokeWidth={2.4} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1 text-sm">
        <span className="font-heading block font-extrabold">{titre}</span>
        <span className="block text-[12.5px] leading-snug font-semibold text-muted-foreground">{texte}</span>
      </span>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
    </Link>
  )
}

/** Le lien discret qui clôt un rayon filtré : aller chercher la suite. */
export function LienSuite({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      onClick={() => sfx.tap()}
      className="mx-auto flex items-center gap-1 rounded-full px-3 py-2 text-xs font-extrabold text-primary"
    >
      {children}
      <ChevronRight className="size-3.5" strokeWidth={2.6} aria-hidden="true" />
    </Link>
  )
}
