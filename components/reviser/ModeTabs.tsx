'use client'

import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { MODES, type ModeKey } from '@/lib/subject-template'

// Barre d'onglets horizontale scrollable du template matière : Chapitres
// (défaut) · Quiz · Flashcards · Cartes mentales · Défis. Actif : fond blanc,
// texte encre ; inactifs : outline sur le fond coloré du header.
export default function ModeTabs({
  active,
  onChange,
}: {
  active: ModeKey
  onChange: (mode: ModeKey) => void
}) {
  return (
    <nav
      aria-label="Contenus de la matière"
      className="hide-scrollbar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0"
    >
      {MODES.map((mode) => {
        const isActive = mode.key === active
        return (
          <button
            key={mode.key}
            type="button"
            aria-current={isActive ? 'page' : undefined}
            onClick={() => {
              if (isActive) return
              sfx.tap()
              onChange(mode.key)
            }}
            className={cn(
              'shrink-0 rounded-full px-4 py-1.5 text-sm transition-colors',
              isActive
                ? 'bg-card font-bold text-foreground shadow-sm'
                : 'border border-white/50 font-semibold text-white hover:bg-white/10',
            )}
          >
            {mode.label}
          </button>
        )
      })}
    </nav>
  )
}
