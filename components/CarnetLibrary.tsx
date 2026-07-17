'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Library,
  Plus,
  Pencil,
  Trash2,
  X,
  MoreHorizontal,
  FileText,
  ListChecks,
  Network,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import {
  createLibraryItem,
  deleteLibraryItem,
} from '@/app/reviser/bibliotheque/actions'
import { KIND_LABEL, LIBRARY_KINDS, type LibraryKind } from '@/lib/library'
import {
  groupShelf,
  relativeLabel,
  type ShelfItem,
} from '@/lib/library-shelf'

type ShelfFilter = 'tous' | LibraryKind

const FILTER_LABELS: Record<ShelfFilter, string> = {
  tous: 'Tout',
  fiche: 'Fiches',
  quiz: 'Quiz',
  carte: 'Cartes',
}

// Teinte « papier » de l'aperçu, par type — sur un quadrillage léger façon
// cahier (les fiches de la maquette sont des photos de cahier quadrillé).
const PAPER_TINT: Record<LibraryKind, string> = {
  fiche: 'bg-highlight/15',
  quiz: 'bg-primary/10',
  carte: 'bg-primary/5',
}

const PAPER_GRID =
  '[background-image:repeating-linear-gradient(0deg,transparent_0,transparent_15px,color-mix(in_oklch,var(--primary),transparent_90%)_15px,color-mix(in_oklch,var(--primary),transparent_90%)_16px),repeating-linear-gradient(90deg,transparent_0,transparent_15px,color-mix(in_oklch,var(--primary),transparent_90%)_15px,color-mix(in_oklch,var(--primary),transparent_90%)_16px)]'

const KIND_ICON: Record<LibraryKind, typeof FileText> = {
  fiche: FileText,
  quiz: ListChecks,
  carte: Network,
}

// Une carte de l'étagère : l'aperçu du contenu en miniature sur papier
// quadrillé, puis le pied « type + il y a X min + menu ⋯ » (Modifier /
// Supprimer). Prêt → tap ouvre la lecture/le jeu ; brouillon → l'éditeur.
function ShelfCard({
  item,
  now,
  menuOpen,
  onMenu,
  onDelete,
  deleting,
}: {
  item: ShelfItem
  now: Date
  menuOpen: boolean
  onMenu: (id: string | null) => void
  onDelete: (id: string) => void
  deleting: boolean
}) {
  const href = item.ready
    ? `/reviser/bibliotheque/${item.id}/jouer`
    : `/reviser/bibliotheque/${item.id}`

  return (
    <article className="mb-2.5 break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
      <Link
        href={href}
        onClick={() => sfx.tap()}
        className="block active:scale-[0.99]"
      >
        <div
          className={cn(
            'relative min-h-24 p-3',
            PAPER_TINT[item.kind],
            PAPER_GRID,
          )}
        >
          {!item.ready ? (
            <span className="absolute top-2 right-2 rounded-full bg-white/85 px-2 py-0.5 text-[9px] font-extrabold tracking-wide text-muted-foreground uppercase">
              Brouillon
            </span>
          ) : null}
          <p className="font-heading pr-14 text-xs leading-snug font-extrabold text-foreground underline decoration-primary/40 underline-offset-2">
            {item.title}
          </p>
          {item.lines.length > 0 ? (
            <ul className="mt-1.5 flex flex-col gap-0.5">
              {item.lines.map((line, i) => (
                <li
                  key={i}
                  className="truncate text-[10px] leading-relaxed font-medium text-foreground/75"
                >
                  {line}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1.5 text-[10px] text-muted-foreground italic">
              Encore vide — touche pour compléter.
            </p>
          )}
          {item.meta ? (
            <span className="mt-2 inline-block rounded-full bg-white/80 px-2 py-0.5 text-[9px] font-extrabold text-foreground/70">
              {item.meta}
            </span>
          ) : null}
        </div>
      </Link>

      {menuOpen ? (
        <div className="flex items-center gap-1 px-2 py-1.5">
          <Link
            href={`/reviser/bibliotheque/${item.id}`}
            onClick={() => sfx.tap()}
            className="flex flex-1 items-center justify-center gap-1 rounded-full bg-muted px-2 py-1.5 text-[11px] font-bold text-foreground"
          >
            <Pencil className="size-3.5" aria-hidden="true" /> Modifier
          </Link>
          <button
            type="button"
            disabled={deleting}
            onClick={() => onDelete(item.id)}
            className="flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-full bg-destructive/10 px-2 py-1.5 text-[11px] font-bold text-destructive disabled:opacity-50"
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
            {deleting ? '…' : 'Supprimer'}
          </button>
          <button
            type="button"
            onClick={() => onMenu(null)}
            aria-label="Fermer le menu"
            className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
          >
            <X className="size-3.5" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 px-2.5 py-1.5">
          <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-extrabold text-foreground ring-1 ring-black/10">
            {KIND_LABEL[item.kind].replace(' de révision', '').replace(' mentale', '')}
          </span>
          <span className="min-w-0 flex-1 truncate text-[10px] font-semibold text-muted-foreground">
            {relativeLabel(item.updatedAt, now)}
          </span>
          <button
            type="button"
            onClick={() => {
              sfx.tap()
              onMenu(item.id)
            }}
            aria-label={`Options de ${item.title}`}
            aria-haspopup="menu"
            className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
          >
            <MoreHorizontal className="size-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </article>
  )
}

/**
 * « Bibliothèque » — le bloc à part entière de Mon carnet : tous les contenus
 * créés par l'élève (fiches, quiz, cartes mentales) visibles directement en
 * cartes-aperçus, filtrables par type et groupés par récence (« Aujourd'hui »,
 * « Cette semaine »…). La liste défile dans le bloc pour ne pas engloutir le
 * reste du carnet. « + Créer » propose les trois types, comme la maquette.
 */
export default function CarnetLibrary({
  items,
  now: nowIso,
}: {
  items: ShelfItem[]
  /** ISO du rendu serveur : libellés relatifs déterministes (hydratation). */
  now: string
}) {
  const router = useRouter()
  const now = new Date(nowIso)
  const [filter, setFilter] = useState<ShelfFilter>('tous')
  const [creating, setCreating] = useState(false)
  const [menuId, setMenuId] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const [failed, setFailed] = useState(false)

  const create = (kind: LibraryKind) => {
    if (pending) return
    sfx.tap()
    setFailed(false)
    startTransition(async () => {
      const res = await createLibraryItem(kind)
      if (res.ok && res.id) router.push(`/reviser/bibliotheque/${res.id}`)
      else setFailed(true)
    })
  }

  const remove = (id: string) => {
    if (pending) return
    sfx.tap()
    setFailed(false)
    startTransition(async () => {
      const res = await deleteLibraryItem(id)
      if (res.ok) {
        setMenuId(null)
        router.refresh()
      } else setFailed(true)
    })
  }

  const visible =
    filter === 'tous' ? items : items.filter((i) => i.kind === filter)
  const groups = groupShelf(visible, now)

  return (
    <section
      aria-label="Bibliothèque"
      className="rev-card rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5"
    >
      {/* En-tête : titre + « Créer » (qui déplie le choix du type). */}
      <div className="mb-3 flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-highlight/25 text-foreground">
          <Library className="size-5" strokeWidth={2.2} aria-hidden="true" />
        </span>
        <h2 className="font-heading min-w-0 flex-1 truncate text-lg font-extrabold text-foreground">
          Bibliothèque
        </h2>
        <button
          type="button"
          onClick={() => {
            sfx.tap()
            setCreating((v) => !v)
          }}
          aria-expanded={creating}
          className="font-heading flex shrink-0 cursor-pointer items-center gap-1 rounded-full bg-primary px-3.5 py-2 text-xs font-extrabold text-primary-foreground shadow-sm transition active:translate-y-px"
        >
          {creating ? (
            <X className="size-4" strokeWidth={2.8} aria-hidden="true" />
          ) : (
            <Plus className="size-4" strokeWidth={2.8} aria-hidden="true" />
          )}
          Créer
        </button>
      </div>

      {creating ? (
        <div className="mb-3 grid grid-cols-3 gap-2">
          {LIBRARY_KINDS.map((kind) => {
            const Icon = KIND_ICON[kind]
            return (
              <button
                key={kind}
                type="button"
                disabled={pending}
                onClick={() => create(kind)}
                className="flex cursor-pointer flex-col items-center gap-1 rounded-2xl bg-muted/60 p-3 text-center transition-colors hover:bg-muted disabled:opacity-60"
              >
                <Icon
                  className="size-5 text-primary"
                  strokeWidth={2.2}
                  aria-hidden="true"
                />
                <span className="text-[11px] leading-tight font-bold text-foreground">
                  {KIND_LABEL[kind]}
                </span>
              </button>
            )
          })}
        </div>
      ) : null}

      {failed ? (
        <p
          role="alert"
          className="mb-3 rounded-2xl bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive"
        >
          Une action a échoué. Réessaie dans un instant.
        </p>
      ) : null}

      {/* Puces de filtre — comme la maquette : Tout / Fiches / Quiz / Cartes. */}
      <div
        role="tablist"
        aria-label="Filtrer la bibliothèque"
        className="-mx-1 mb-3 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {(Object.keys(FILTER_LABELS) as ShelfFilter[]).map((id) => {
          const count =
            id === 'tous'
              ? items.length
              : items.filter((i) => i.kind === id).length
          const active = filter === id
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                sfx.tap()
                setFilter(id)
              }}
              className={cn(
                'font-heading flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-bold whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none',
                active
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted/60 text-muted-foreground hover:text-foreground',
              )}
            >
              {FILTER_LABELS[id]}
              {count > 0 ? (
                <span
                  className={cn(
                    'rounded-full px-1.5 text-[10px] font-extrabold tabular-nums',
                    active
                      ? 'bg-white/20'
                      : 'bg-foreground/5 text-muted-foreground',
                  )}
                >
                  {count}
                </span>
              ) : null}
            </button>
          )
        })}
      </div>

      {/* L'étagère : tout est visible et défile DANS le bloc. */}
      {items.length === 0 ? (
        <p className="rounded-2xl bg-muted/40 px-3 py-4 text-center text-sm text-muted-foreground">
          Ta bibliothèque est vide — touche « Créer » pour ta première fiche,
          ton premier quiz ou ta première carte mentale ✍️
        </p>
      ) : visible.length === 0 ? (
        <p className="rounded-2xl bg-muted/40 px-3 py-3 text-center text-xs text-muted-foreground">
          Rien dans « {FILTER_LABELS[filter]} » pour l’instant.
        </p>
      ) : (
        <div className="max-h-[30rem] overflow-y-auto overscroll-contain">
          {groups.map((group) => (
            <section key={group.id} aria-label={group.label}>
              <h3 className="font-heading mb-2 pt-1 text-sm font-extrabold tracking-wide text-foreground/70 uppercase">
                {group.label}
              </h3>
              <div className="columns-2 gap-2.5">
                {group.items.map((item) => (
                  <ShelfCard
                    key={item.id}
                    item={item}
                    now={now}
                    menuOpen={menuId === item.id}
                    onMenu={setMenuId}
                    onDelete={remove}
                    deleting={pending}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </section>
  )
}
