'use client'

import Link from 'next/link'
import { BookOpenCheck, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { SubjectErrorsData } from '@/lib/subject-template'

// Onglet « Mes erreurs » : les notions de la matière qui attendent dans la
// file de révision espacée (mêmes règles que le bandeau « À revoir »),
// ventilées par chapitre, avec un seul CTA — corriger, tout de suite.
export default function SubjectErrors({
  erreurs,
  subjectSlug,
}: {
  erreurs: SubjectErrorsData
  subjectSlug: string
}) {
  if (erreurs.total === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 pt-8 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-highlight/20 text-3xl">
          <Sparkles className="size-8 text-highlight" aria-hidden="true" />
        </span>
        <h2 className="font-heading text-xl font-bold">Aucune erreur à revoir</h2>
        <p className="text-sm text-muted-foreground">
          Rien dans ta file pour cette matière — soit tu n&apos;as pas encore
          joué, soit tu as tout corrigé. Bravo !
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4">
      <div className="rounded-2xl bg-destructive/10 p-4">
        <p className="font-heading text-lg font-bold">
          {erreurs.total} notion{erreurs.total > 1 ? 's' : ''} à corriger
        </p>
        <p className="text-sm text-muted-foreground">
          Tes erreurs et les notions que ta mémoire s&apos;apprête à oublier,
          reprogrammées au bon moment.
        </p>
      </div>

      <ul className="flex flex-col gap-2">
        {erreurs.byChapter.map((c) => (
          <li
            key={c.title}
            className="flex items-center justify-between gap-3 rounded-2xl border bg-card px-4 py-3"
          >
            <span className="min-w-0 flex-1 truncate text-sm font-medium">
              {c.title}
            </span>
            <span className="shrink-0 rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-bold text-destructive tabular-nums">
              {c.count} à revoir
            </span>
          </li>
        ))}
      </ul>

      <Button asChild size="lg" className="self-center rounded-full px-8">
        <Link href={`/reviser/revoir?matiere=${subjectSlug}`}>
          <BookOpenCheck className="size-4" /> Corriger mes erreurs
        </Link>
      </Button>
    </div>
  )
}
