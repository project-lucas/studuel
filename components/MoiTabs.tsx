'use client'

import { useState, type ReactNode } from 'react'
import { CalendarHeart, ChartLine, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { useTablist } from '@/components/useTablist'

// -----------------------------------------------------------------------------
// Tableau de bord de l'onglet Moi : au lieu d'empiler des cartes qui obligent à
// scroller sans fin, on range tout derrière deux onglets denses — Ma semaine
// (rituels, objectifs, compagnon) et Ma progression (trajectoire, graphiques,
// badges). Une seule section visible à la fois ; tous les panneaux restent
// montés (leur état survit au changement d'onglet).
// -----------------------------------------------------------------------------
type TabDef = { id: string; label: string; icon: LucideIcon; panel: ReactNode }

export default function MoiTabs({
  semaine,
  progres,
}: {
  semaine: ReactNode
  progres: ReactNode
}) {
  const tabs: TabDef[] = [
    { id: 'semaine', label: 'Ma semaine', icon: CalendarHeart, panel: semaine },
    { id: 'progres', label: 'Ma progression', icon: ChartLine, panel: progres },
  ]
  const [active, setActive] = useState(tabs[0].id)

  // Navigation clavier du motif ARIA tablist — mutualisée avec les autres
  // groupes d'onglets (elle ajoute au passage Origine/Fin, qui manquaient ici).
  const tabNav = useTablist(tabs.length, (i) => setActive(tabs[i].id))

  return (
    <div className="mt-5">
      {/* Sélecteur segmenté, collant en haut : il reste sous la main même quand
          la section (planning) est longue. */}
      <div
        role="tablist"
        aria-label="Sections de mon profil"
        className="moi-card sticky top-2 z-20 grid grid-cols-2 gap-1 rounded-full bg-white p-1"
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
              aria-controls={`moi-panel-${t.id}`}
              aria-selected={selected}
              {...tabNav.props(i, selected)}
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
