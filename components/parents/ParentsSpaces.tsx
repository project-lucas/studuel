'use client'

import { type KeyboardEvent, type ReactNode } from 'react'
import { useSearchParams } from 'next/navigation'
import { BookOpenCheck, LineChart, Settings2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'

export type ParentSpaceId = 'suivi' | 'conseils' | 'reglages'

const SPACES: {
  id: ParentSpaceId
  label: string
  icon: typeof LineChart
}[] = [
  { id: 'suivi', label: 'Suivi', icon: LineChart },
  { id: 'conseils', label: 'Conseils', icon: BookOpenCheck },
  { id: 'reglages', label: 'Réglages', icon: Settings2 },
]

function parseSpace(value: string | null): ParentSpaceId {
  return value === 'conseils' || value === 'reglages' ? value : 'suivi'
}

/**
 * L'espace parents en trois volets.
 *
 * POURQUOI DES VOLETS. L'écran était un seul rouleau où le suivi de l'enfant,
 * une liste de vidéos et un formulaire de liaison se succédaient sans lien.
 * Trois contenus qui ne répondent pas à la même question — « comment il va ? »,
 * « comment je l'aide ? », « comment je règle ça ? » — et dont un seul est
 * consulté à chaque visite. Empilés, le premier repoussait les autres hors de
 * l'écran, et le formulaire de liaison passait devant le tableau de bord chez
 * un parent qui avait déjà lié son enfant.
 *
 * Motif onglets WAI-ARIA, identique à TresorSpaces et ReviserSpaces : les trois
 * volets restent MONTÉS (attribut `hidden`) pour conserver leur état — un
 * réglage en cours de saisie ne doit pas disparaître parce qu'on est allé
 * vérifier un chiffre. Flèches gauche/droite au clavier.
 *
 * Le volet actif vit dans l'URL (`?volet=conseils`), seule source de vérité :
 * lien partageable, et bon volet retrouvé au retour d'une Server Action (qui
 * revalide `/parents` avec ses paramètres).
 */
export default function ParentsSpaces({
  suivi,
  conseils,
  reglages,
}: {
  suivi: ReactNode
  conseils: ReactNode
  reglages: ReactNode
}) {
  const params = useSearchParams()
  const space = parseSpace(params.get('volet'))
  const panels: Record<ParentSpaceId, ReactNode> = { suivi, conseils, reglages }

  const select = (id: ParentSpaceId) => {
    if (id === space) return
    sfx.tap()
    const url = new URL(window.location.href)
    if (id === 'suivi') url.searchParams.delete('volet')
    else url.searchParams.set('volet', id)
    window.history.replaceState(null, '', url)
    window.scrollTo({ top: 0 })
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    const i = SPACES.findIndex((s) => s.id === space)
    const step = e.key === 'ArrowRight' ? 1 : -1
    const next = SPACES[(i + step + SPACES.length) % SPACES.length].id
    select(next)
    document.getElementById(`parents-tab-${next}`)?.focus()
  }

  return (
    <div className="flex flex-col gap-5">
      <div
        role="tablist"
        aria-label="Espaces du suivi parental"
        onKeyDown={onKeyDown}
        className="grid grid-cols-3 gap-1 rounded-full bg-white p-1 shadow-sm ring-1 ring-black/5"
      >
        {SPACES.map(({ id, label, icon: Icon }) => {
          const active = id === space
          return (
            <button
              key={id}
              id={`parents-tab-${id}`}
              role="tab"
              type="button"
              aria-selected={active}
              aria-controls={`parents-panel-${id}`}
              tabIndex={active ? 0 : -1}
              onClick={() => select(id)}
              className={cn(
                'font-heading focus-visible:ring-primary/50 flex cursor-pointer items-center justify-center gap-1.5 rounded-full py-2.5 text-sm font-bold transition-colors focus-visible:ring-2 focus-visible:outline-none',
                active
                  ? 'bg-primary text-primary-foreground shadow-[0_6px_14px_-6px_color-mix(in_oklch,var(--primary),transparent_30%)]'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className="size-4.5" strokeWidth={2.2} aria-hidden="true" />
              {label}
            </button>
          )
        })}
      </div>

      {SPACES.map(({ id }) => (
        <div
          key={id}
          id={`parents-panel-${id}`}
          role="tabpanel"
          aria-labelledby={`parents-tab-${id}`}
          hidden={id !== space}
        >
          {panels[id]}
        </div>
      ))}
    </div>
  )
}
