import type { ComponentType, SVGProps } from 'react'
import type { FreeMode, FreeModeAccent } from '@/lib/defi/types'
import { ChevronRightIcon, ClockIcon, ShieldIcon, ZapIcon } from './icons'

interface FreeModesProps {
  modes: FreeMode[]
}

const ACCENT_CLASS: Record<FreeModeAccent, string> = {
  jaune: 'defi2-accent-jaune',
  teal: 'defi2-accent-teal',
  violet: 'defi2-accent-violet',
}

// Picto SVG par mode (clé stable) — évite les emojis d'interface.
const MODE_ICON: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  blitz: ZapIcon,
  chrono: ClockIcon,
  survie: ShieldIcon,
}

/**
 * Modes libres (échauffement) : rangée horizontale scrollable de petites
 * cartes. Volontairement secondaires — le match classé reste le plat principal.
 */
export default function FreeModes({ modes }: FreeModesProps) {
  return (
    <section aria-label="Modes libres">
      <div className="mb-2 flex items-baseline justify-between px-1">
        <h2 className="font-heading text-base font-extrabold text-white">
          Modes libres
        </h2>
        <span className="text-xs font-semibold text-white/55">
          Pour s&apos;échauffer
        </span>
      </div>

      <div className="hide-scrollbar -mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-1">
        {modes.map((mode) => {
          const Icon = MODE_ICON[mode.id] ?? ZapIcon
          return (
            <button
              key={mode.id}
              type="button"
              className={`${ACCENT_CLASS[mode.accent]} defi2-mode-tile defi2-press w-36 shrink-0 cursor-pointer snap-start rounded-2xl p-3 text-left text-white focus-visible:ring-4 focus-visible:ring-highlight/40 focus-visible:outline-none`}
              aria-label={`Jouer ${mode.name}, ${mode.xpLabel}`}
            >
              <span className="grid size-9 place-items-center rounded-xl bg-white/20">
                <Icon className="size-5" />
              </span>
              <p className="font-heading mt-2 text-sm leading-tight font-extrabold">
                {mode.name}
              </p>
              <div className="mt-1 flex items-center justify-between">
                <span className="rounded-full bg-black/25 px-1.5 py-0.5 text-[0.65rem] font-bold">
                  {mode.xpLabel}
                </span>
                <ChevronRightIcon className="size-4 opacity-80" />
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
