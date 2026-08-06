'use client'

import { Gamepad2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import type { ModeIcon, ModeKey, ModeTab } from '@/lib/subject-template'

// Le catalogue (lib/) ne connaît que le NOM du pictogramme ; la correspondance
// avec l'icône vit ici, au seul endroit qui a le droit de rendre du JSX.
const MODE_ICONS: Record<ModeIcon, typeof Gamepad2> = { manette: Gamepad2 }

// Barre d'onglets du template matière : Programme · Mode de jeu, plus Annales
// pour les années à examen (cf. `modesFor`).
//
// DEUX OU TROIS onglets qui tiennent la largeur, au lieu de sept qui
// débordaient : les deux derniers (« Mes erreurs », « Boss ») vivaient hors
// écran, derrière un scroll horizontal que rien n'annonçait. Ici tout est
// visible d'un coup d'œil, chaque onglet occupe la même part — plus de contenu
// caché, plus de scroll. Actif : fond crème, texte encre ; inactifs : outline
// sur le fond coloré.
export default function ModeTabs({
  modes,
  active,
  onChange,
}: {
  modes: ModeTab[]
  active: ModeKey
  onChange: (mode: ModeKey) => void
}) {
  return (
    <nav
      aria-label="Contenus de la matière"
      className="mt-5 flex items-stretch gap-2"
    >
      {modes.map((mode) => {
        const isActive = mode.key === active
        const Icon = mode.icon ? MODE_ICONS[mode.icon] : null
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
              'flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-2 text-sm transition-colors',
              isActive
                ? 'bg-card font-bold text-foreground shadow-sm'
                : 'border border-white/50 font-semibold text-white hover:bg-white/10',
            )}
          >
            {Icon ? <Icon className="size-4 shrink-0" aria-hidden="true" /> : null}
            <span className="truncate">{mode.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
