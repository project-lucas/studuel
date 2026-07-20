'use client'

import { useState, type ReactNode } from 'react'
import { BookOpen, NotebookPen, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { useTablist } from '@/components/useTablist'

// Sélecteur à deux pills de l'onglet Moi refondu : « Ma progression » (le
// miroir motivant) et « Mes habitudes » (le détail, à venir). Tous les panneaux
// restent montés — leur état survit au changement d'onglet.
type TabDef = { id: string; label: string; icon: LucideIcon; panel: ReactNode }

export default function MoiTabSwitcher({
  progression,
  habitudes,
}: {
  progression: ReactNode
  habitudes: ReactNode
}) {
  const tabs: TabDef[] = [
    { id: 'progression', label: 'Ma progression', icon: BookOpen, panel: progression },
    { id: 'habitudes', label: 'Mes habitudes', icon: NotebookPen, panel: habitudes },
  ]
  const [active, setActive] = useState(tabs[0].id)
  const tabNav = useTablist(tabs.length, (i) => setActive(tabs[i].id))

  return (
    <div>
      <div
        role="tablist"
        aria-label="Sections de mon profil"
        className="grid grid-cols-2 gap-1 rounded-full bg-white p-1 shadow-sm ring-1 ring-black/5"
      >
        {tabs.map((t, i) => {
          const selected = active === t.id
          const Icon = t.icon
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`moi-tab-${t.id}`}
              aria-selected={selected}
              aria-controls={`moi-panel-${t.id}`}
              {...tabNav.props(i, selected)}
              onClick={() => {
                sfx.tap()
                setActive(t.id)
              }}
              className={cn(
                'flex cursor-pointer items-center justify-center gap-1.5 rounded-full px-3 py-2 text-sm font-extrabold transition-colors',
                selected
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-foreground/70 hover:bg-muted',
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
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
          className="mt-4"
        >
          {t.panel}
        </div>
      ))}
    </div>
  )
}
