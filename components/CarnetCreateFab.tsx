'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, FileText, ListChecks, Network } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { createLibraryItem } from '@/app/reviser/bibliotheque/actions'
import { type LibraryKind } from '@/lib/library'

// Les trois créations, dans l'ordre de la maquette (fiche quiz, flash cards,
// carte mentale). Chaque entrée = un type de la bibliothèque.
const ACTIONS: { kind: LibraryKind; label: string; icon: typeof FileText }[] = [
  { kind: 'quiz', label: 'Fiche quiz', icon: ListChecks },
  { kind: 'fiche', label: 'Flash cards', icon: FileText },
  { kind: 'carte', label: 'Carte mentale', icon: Network },
]

/**
 * Bouton flottant « + » de Mon carnet (bas à droite) : déplie trois créations
 * — fiche quiz, flash cards, carte mentale. Monté dans le volet carnet, il
 * n'apparaît que sur cet espace (le volet masqué coupe tout son sous-arbre).
 */
export default function CarnetCreateFab() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
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

  return (
    <div className="fixed right-4 bottom-20 z-40 flex flex-col items-end gap-2.5 md:bottom-8">
      {failed ? (
        <p
          role="alert"
          className="rounded-full bg-destructive px-3 py-1.5 text-xs font-semibold text-white shadow-lg"
        >
          Échec — réessaie.
        </p>
      ) : null}

      {/* Les trois créations, en éventail au-dessus du bouton. */}
      {open ? (
        <ul className="flex flex-col items-end gap-2">
          {ACTIONS.map(({ kind, label, icon: Icon }, i) => (
            <li key={kind}>
              <button
                type="button"
                disabled={pending}
                onClick={() => create(kind)}
                style={{ animationDelay: `${i * 45}ms` }}
                className="pop-in flex items-center gap-2 rounded-full bg-card py-2 pr-4 pl-2 shadow-lg ring-1 ring-black/5 transition active:scale-95 disabled:opacity-60"
              >
                <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-4" strokeWidth={2.3} aria-hidden="true" />
                </span>
                <span className="text-sm font-bold text-foreground">{label}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <button
        type="button"
        onClick={() => {
          sfx.tap()
          setOpen((v) => !v)
        }}
        aria-expanded={open}
        aria-label={open ? 'Fermer le menu de création' : 'Créer une fiche, un quiz ou une carte mentale'}
        className="press-3d-deep flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg transition-transform"
      >
        <Plus
          className={cn('size-7 transition-transform', open && 'rotate-45')}
          strokeWidth={2.6}
          aria-hidden="true"
        />
      </button>
    </div>
  )
}
