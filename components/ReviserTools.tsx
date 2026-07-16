'use client'

import Link from 'next/link'
import { Library, ChevronRight } from 'lucide-react'
import { sfx } from '@/lib/sounds'

// « Ma bibliothèque » — l'entrée transverse de Réviser vers les fiches, quiz et
// flashcards créés par l'élève. L'ancienne tuile jumelle « Revoir mes erreurs »
// a été retirée : la file SRS a UNE seule entrée, la carte « À revoir
// aujourd'hui » (ReviewQueueCard), pour ne pas proposer deux fois le même geste.
export default function ReviserTools() {
  return (
    <Link
      href="/reviser/bibliotheque"
      onClick={() => sfx.tap()}
      className="group flex items-center gap-3 rounded-3xl bg-white p-3.5 shadow-sm ring-1 ring-black/5 transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]"
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-highlight/25 text-foreground">
        <Library className="size-5.5" strokeWidth={2.2} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="font-heading block text-sm leading-tight font-bold text-foreground">
          Ma bibliothèque
        </span>
        <span className="mt-0.5 block truncate text-xs text-muted-foreground">
          Crée fiches, quiz, cartes
        </span>
      </span>
      <ChevronRight
        className="size-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </Link>
  )
}
