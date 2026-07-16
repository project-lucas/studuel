'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  FileText,
  ListChecks,
  Network,
  Plus,
  Trash2,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import BackButton from '@/components/BackButton'
import { createLibraryItem, deleteLibraryItem } from '@/app/reviser/bibliotheque/actions'
import { KIND_LABEL, type LibraryKind } from '@/lib/library'

export type LibraryRow = {
  id: string
  kind: LibraryKind
  title: string
  ready: boolean
}

const KIND_META: Record<
  LibraryKind,
  { Icon: typeof FileText; tile: string; blurb: string }
> = {
  fiche: {
    Icon: FileText,
    tile: 'bg-primary/12 text-primary',
    blurb: 'Résume un chapitre à ta façon.',
  },
  quiz: {
    Icon: ListChecks,
    tile: 'bg-highlight/25 text-foreground',
    blurb: 'Teste-toi avec tes propres questions.',
  },
  carte: {
    Icon: Network,
    tile: 'bg-primary/12 text-primary',
    blurb: 'Relie les idées d’un thème.',
  },
}

const ORDER: LibraryKind[] = ['fiche', 'quiz', 'carte']

export default function LibraryHub({ items }: { items: LibraryRow[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState(false)

  const create = (kind: LibraryKind) => {
    if (pending) return
    sfx.tap()
    setError(false)
    startTransition(async () => {
      const res = await createLibraryItem(kind)
      if (res.ok && res.id) router.push(`/reviser/bibliotheque/${res.id}`)
      else setError(true)
    })
  }

  const remove = (id: string) => {
    if (pending) return
    setError(false)
    startTransition(async () => {
      const res = await deleteLibraryItem(id)
      if (!res.ok) setError(true)
      else router.refresh()
    })
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <BackButton fallback="/reviser" label="Retour aux révisions" />

      <header className="mt-4 mb-5">
        <h1 className="font-heading text-2xl font-extrabold text-foreground">
          Ma bibliothèque
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Crée tes propres fiches, quiz et cartes mentales — et retrouve-les ici.
        </p>
      </header>

      {error ? (
        <p
          role="alert"
          className="mb-4 rounded-2xl bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive"
        >
          Une action a échoué. Réessaie dans un instant.
        </p>
      ) : null}

      <div className="flex flex-col gap-5">
        {ORDER.map((kind) => {
          const { Icon, tile, blurb } = KIND_META[kind]
          const list = items.filter((i) => i.kind === kind)
          return (
            <section key={kind} aria-label={KIND_LABEL[kind]}>
              <div className="mb-2 flex items-center gap-3">
                <span
                  className={cn(
                    'flex size-10 shrink-0 items-center justify-center rounded-2xl',
                    tile,
                  )}
                >
                  <Icon className="size-5" strokeWidth={2.2} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-heading text-base font-bold text-foreground">
                    {KIND_LABEL[kind]}
                  </h2>
                  <p className="truncate text-xs text-muted-foreground">{blurb}</p>
                </div>
                <button
                  type="button"
                  onClick={() => create(kind)}
                  disabled={pending}
                  className={cn(
                    'flex shrink-0 items-center gap-1 rounded-full bg-primary px-3 py-2 font-heading text-xs font-extrabold text-primary-foreground shadow-sm transition active:translate-y-px',
                    pending && 'opacity-60',
                  )}
                >
                  <Plus className="size-4" strokeWidth={2.8} aria-hidden="true" />
                  Créer
                </button>
              </div>

              {list.length > 0 ? (
                <ul className="flex flex-col gap-2">
                  {list.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-2 rounded-2xl bg-white p-2 pl-3 shadow-sm ring-1 ring-black/5"
                    >
                      <Link
                        href={`/reviser/bibliotheque/${item.id}`}
                        onClick={() => sfx.tap()}
                        className="flex min-w-0 flex-1 items-center gap-2"
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-foreground">
                            {item.title}
                          </span>
                          <span
                            className={cn(
                              'text-xs font-medium',
                              item.ready ? 'text-primary' : 'text-muted-foreground',
                            )}
                          >
                            {item.ready ? 'Prêt' : 'Brouillon'}
                          </span>
                        </span>
                        <ChevronRight
                          className="size-4 shrink-0 text-muted-foreground"
                          aria-hidden="true"
                        />
                      </Link>
                      <button
                        type="button"
                        onClick={() => remove(item.id)}
                        disabled={pending}
                        aria-label={`Supprimer ${item.title}`}
                        className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive active:scale-90"
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rounded-2xl bg-muted/40 px-3 py-2.5 text-center text-xs text-muted-foreground">
                  Rien pour l’instant — touche « Créer » pour commencer.
                </p>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
