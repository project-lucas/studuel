'use client'

import { useState, type ReactNode } from 'react'
import { ChartLine, Medal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'

// -----------------------------------------------------------------------------
// Blocs « en plus » de Moi (structure vs notes, records & badges) : masqués
// par défaut pour ne pas surcharger l'onglet. Deux icônes sous « Ta série »
// les déplient / replient à la demande.
// -----------------------------------------------------------------------------
export default function MoiExtras({
  chart,
  badges,
}: {
  chart: ReactNode
  badges: ReactNode
}) {
  const [showChart, setShowChart] = useState(false)
  const [showBadges, setShowBadges] = useState(false)

  const toggles = [
    {
      icon: ChartLine,
      label: 'Structure & notes',
      active: showChart,
      flip: () => setShowChart((v) => !v),
    },
    {
      icon: Medal,
      label: 'Records & badges',
      active: showBadges,
      flip: () => setShowBadges((v) => !v),
    },
  ]

  return (
    <>
      <div className="flex items-center justify-center gap-3 font-heading">
        {toggles.map(({ icon: Icon, label, active, flip }) => (
          <button
            key={label}
            type="button"
            title={label}
            aria-label={label}
            aria-pressed={active}
            onClick={() => {
              sfx.tap()
              flip()
            }}
            className={cn(
              'moi-card flex size-11 items-center justify-center rounded-full transition-all active:scale-90',
              active
                ? 'bg-primary text-primary-foreground'
                : 'bg-white text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="size-5" strokeWidth={2.2} />
          </button>
        ))}
      </div>

      {showChart ? <div className="pop-in">{chart}</div> : null}
      {showBadges ? <div className="pop-in">{badges}</div> : null}
    </>
  )
}
