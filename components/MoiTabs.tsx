'use client'

import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { CalendarDays, PawPrint, ChartLine, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'

// -----------------------------------------------------------------------------
// Tableau de bord de l'onglet Moi : au lieu d'empiler cinq cartes qui obligent
// à scroller sans fin (semaine, compagnon, capacités, débrief, extras), on
// range tout derrière trois onglets — une seule section visible à la fois.
// Les cartes existantes sont passées telles quelles en slots ; tous les
// panneaux restent montés (leur état survit au changement d'onglet).
// -----------------------------------------------------------------------------
type TabDef = { id: string; label: string; icon: LucideIcon; panel: ReactNode }

export default function MoiTabs({
  semaine,
  compagnon,
  progres,
}: {
  semaine: ReactNode
  compagnon: ReactNode
  progres: ReactNode
}) {
  const tabs: TabDef[] = [
    { id: 'semaine', label: 'Ma semaine', icon: CalendarDays, panel: semaine },
    { id: 'compagnon', label: 'Compagnon', icon: PawPrint, panel: compagnon },
    { id: 'progres', label: 'Progrès', icon: ChartLine, panel: progres },
  ]
  const [active, setActive] = useState(tabs[0].id)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Navigation clavier ← / → entre les onglets (motif ARIA tablist).
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const dir = e.key === 'ArrowRight' ? 1 : -1
    const nextIdx = (i + dir + tabs.length) % tabs.length
    setActive(tabs[nextIdx].id)
    tabRefs.current[nextIdx]?.focus()
  }

  return (
    <div className="mt-5">
      {/* Sélecteur segmenté, collant en haut : il reste sous la main même quand
          la section (planning) est longue. */}
      <div
        role="tablist"
        aria-label="Sections de mon profil"
        className="moi-card sticky top-2 z-20 grid grid-cols-3 gap-1 rounded-full bg-white p-1"
      >
        {tabs.map((t, i) => {
          const selected = active === t.id
          const Icon = t.icon
          return (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[i] = el
              }}
              type="button"
              role="tab"
              id={`moi-tab-${t.id}`}
              aria-controls={`moi-panel-${t.id}`}
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              onKeyDown={(e) => onKeyDown(e, i)}
              onClick={() => {
                sfx.tap()
                setActive(t.id)
              }}
              className={cn(
                'flex items-center justify-center gap-1.5 rounded-full py-2 font-heading text-xs font-extrabold tracking-wide transition-all active:scale-95',
                selected
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className="size-4 shrink-0" strokeWidth={2.4} aria-hidden="true" />
              <span className="truncate">{t.label}</span>
            </button>
          )
        })}
      </div>

      {tabs.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`moi-panel-${t.id}`}
          aria-labelledby={`moi-tab-${t.id}`}
          hidden={active !== t.id}
          className="mt-4 flex flex-col gap-5"
        >
          {t.panel}
        </div>
      ))}
    </div>
  )
}
