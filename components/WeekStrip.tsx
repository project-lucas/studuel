import { Fragment } from 'react'
import { cn } from '@/lib/utils'

const DAY_LETTERS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

// Chemin de flamme (tracé Lucide), rempli en dégradé violet → rose.
const FLAME_PATH =
  'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z'

// Bloc « Ta série » : flamme qui respire + chaîne de 7 jours reliés.
// Chaque segment entre deux jours complétés se remplit — ne brise pas la chaîne.
export default function WeekStrip({
  week,
  streak,
}: {
  week: { done: boolean; isToday: boolean; isFuture: boolean }[]
  streak: number
}) {
  return (
    <section
      aria-label={`Série de ${streak} jour${streak > 1 ? 's' : ''}`}
      className="rounded-2xl border bg-card p-4 shadow-sm"
    >
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="font-heading text-lg font-bold">Ta série</h2>
        <span className="text-xs text-muted-foreground">
          {week.filter((d) => d.done).length}/7 cette semaine
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Flamme dégradé violet/rose, compteur au centre */}
        <div className="flame-breathe relative flex size-16 shrink-0 items-center justify-center">
          <svg viewBox="0 0 24 24" className="size-16" aria-hidden="true">
            <defs>
              <linearGradient id="flame-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
            <path d={FLAME_PATH} fill="url(#flame-grad)" />
          </svg>
          <span className="absolute inset-x-0 top-[54%] text-center font-mono text-lg leading-none font-extrabold text-white tabular-nums drop-shadow-sm">
            {streak}
          </span>
        </div>

        {/* La chaîne : cercles reliés par une ligne segmentée */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center">
            {week.map((day, i) => {
              const missed = !day.done && !day.isToday && !day.isFuture
              const linked = i > 0 && week[i - 1].done && day.done
              return (
                <Fragment key={i}>
                  {i > 0 ? (
                    <span className="relative -mx-1 h-1.5 min-w-2 flex-1 overflow-hidden rounded-full bg-muted">
                      {linked ? (
                        <span
                          className="seg-fill absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-pink-500"
                          style={{ animationDelay: `${(i - 1) * 100 + 150}ms` }}
                        />
                      ) : null}
                    </span>
                  ) : null}

                  <span
                    style={day.done ? { animationDelay: `${i * 100}ms` } : undefined}
                    className={cn(
                      'relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full transition-colors',
                      day.done &&
                        'pop-spring bg-gradient-to-br from-violet-500 to-pink-500 text-white shadow-md shadow-violet-500/30',
                      missed && 'bg-muted',
                      day.isFuture &&
                        'border-2 border-dashed border-muted-foreground/25 bg-card',
                      day.isToday &&
                        !day.done &&
                        'border-2 border-violet-400 bg-violet-500/10',
                      day.isToday &&
                        'ring-2 ring-violet-400/50 ring-offset-2 ring-offset-card',
                    )}
                  >
                    {day.done ? (
                      <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
                        <path
                          d="M5 13l4 4 10-10"
                          pathLength={24}
                          stroke="white"
                          strokeWidth={3.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="check-draw"
                          style={{ animationDelay: `${i * 100 + 250}ms` }}
                        />
                      </svg>
                    ) : null}
                  </span>
                </Fragment>
              )
            })}
          </div>

          {/* Lettres des jours, alignées sous les cercles */}
          <div className="mt-1.5 flex">
            {week.map((day, i) => (
              <Fragment key={i}>
                {i > 0 ? <span className="-mx-1 min-w-2 flex-1" /> : null}
                <span
                  className={cn(
                    'w-9 shrink-0 text-center text-[10px] font-bold',
                    day.isToday ? 'text-violet-500' : 'text-muted-foreground',
                  )}
                >
                  {DAY_LETTERS[i]}
                </span>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
