'use client'

import { useOptimistic, useTransition } from 'react'
import {
  BookOpen,
  Brain,
  Calendar,
  Check,
  Droplet,
  Moon,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import type { DriverKey } from '@/lib/capacite-drivers'
import { toggleLeverAction } from '@/app/moi/actions'

const DAY_LETTERS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'] as const

const LEVER_ICONS: Record<DriverKey, LucideIcon> = {
  sommeil: Moon,
  hydratation: Droplet,
  regularite: BookOpen,
  concentration: Brain,
}

// Chips pastel de la maquette : menthe, orange, lavande, bleu — palette
// Tailwind (pas de hex en dur), une classe par driver.
const LEVER_STYLES: Record<DriverKey, string> = {
  sommeil: 'bg-emerald-100 text-emerald-900',
  hydratation: 'bg-orange-100 text-orange-900',
  regularite: 'bg-purple-100 text-purple-900',
  concentration: 'bg-sky-100 text-sky-900',
}

export type LeverState = {
  catalogId: string
  label: string
  points: number
  driverKey: DriverKey
  doneToday: boolean
}

// « Tes leviers cette semaine » : la rangée L → D (jour courant cerclé violet)
// et les 4 chips à cocher. Un tap bascule le log DU JOUR de l'habitude
// correspondante — habit_logs reste la source unique de vérité.
export default function WeeklyLeversCard({
  levers,
  todayIdx,
  today,
}: {
  levers: LeverState[]
  todayIdx: number
  today: string // clé UTC 'YYYY-MM-DD'
}) {
  const [, startTransition] = useTransition()
  const [optimistic, setOptimistic] = useOptimistic(
    Object.fromEntries(levers.map((l) => [l.catalogId, l.doneToday])),
    (state, update: { catalogId: string; done: boolean }) => ({
      ...state,
      [update.catalogId]: update.done,
    }),
  )

  const toggle = (lever: LeverState) => {
    const next = !optimistic[lever.catalogId]
    sfx.tap()
    startTransition(async () => {
      setOptimistic({ catalogId: lever.catalogId, done: next })
      await toggleLeverAction(lever.catalogId, today, next)
    })
  }

  return (
    <section
      aria-label="Tes leviers cette semaine"
      className="moi-card rounded-3xl bg-white p-4"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-heading text-lg leading-tight font-bold text-foreground">
          Tes leviers cette semaine
        </h2>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Calendar className="size-4.5" aria-hidden="true" />
        </span>
      </div>

      {/* La semaine, lundi → dimanche, jour courant cerclé violet. */}
      <div className="mt-3 flex items-center justify-between px-1" aria-hidden="true">
        {DAY_LETTERS.map((letter, i) => (
          <span
            key={i}
            className={cn(
              'flex size-8 items-center justify-center rounded-full text-sm font-extrabold',
              i === todayIdx
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground',
            )}
          >
            {letter}
          </span>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {levers.map((lever) => {
          const Icon = LEVER_ICONS[lever.driverKey]
          const done = optimistic[lever.catalogId]
          return (
            <button
              key={lever.catalogId}
              type="button"
              aria-pressed={done}
              aria-label={`${lever.label} aujourd'hui : ${done ? 'fait' : 'à faire'} (+${lever.points} pts)`}
              onClick={() => toggle(lever)}
              className={cn(
                'relative flex cursor-pointer flex-col items-center gap-0.5 rounded-2xl px-2 py-2.5 transition-all active:scale-95',
                LEVER_STYLES[lever.driverKey],
                done ? 'ring-2 ring-current' : 'opacity-90 hover:opacity-100',
              )}
            >
              {done ? (
                <span className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-current">
                  <Check
                    className="size-3 text-white"
                    strokeWidth={3.5}
                    aria-hidden="true"
                  />
                </span>
              ) : null}
              <span className="flex items-center gap-1 text-xs font-extrabold">
                <Icon className="size-3.5 shrink-0" aria-hidden="true" />
                {lever.label}
              </span>
              <span className="font-mono text-[11px] font-bold tabular-nums">
                +{lever.points} pts
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
