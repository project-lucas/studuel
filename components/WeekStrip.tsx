'use client'

import { useEffect } from 'react'
import { CalendarDays } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { toDayKey } from '@/lib/streak'
import StreakMascot from '@/components/StreakMascot'

const DAY_LETTERS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

// Chemin de flamme (tracé Lucide) — les jetons s'embrasent en semaine parfaite.
const FLAME_PATH =
  'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z'

function mondayKey(now = new Date()): string {
  const monday = new Date(now)
  monday.setUTCDate(monday.getUTCDate() - ((monday.getUTCDay() + 6) % 7))
  return toDayKey(monday)
}

// Bloc « 7 jours » : jetons L→D (lettre dans le jeton, violet quand la journée
// est validée), et à droite le compteur de série porté par la mascotte —
// « N jours de suite ». Semaine parfaite → les jetons s'embrasent, célébration.
const DAY_NAMES = [
  'lundi',
  'mardi',
  'mercredi',
  'jeudi',
  'vendredi',
  'samedi',
  'dimanche',
]

export default function WeekStrip({
  week,
  streak,
  selectedIdx,
  onSelectDay,
  onOpenCalendar,
}: {
  week: { done: boolean; isToday: boolean; isFuture: boolean }[]
  streak: number
  // Jour sélectionné (0 = lundi) : cliquer un jeton affiche son planning.
  selectedIdx?: number
  onSelectDay?: (day: number) => void
  // Icône agenda (angle droit) : ouvre le calendrier « Ma discipline ».
  onOpenCalendar?: () => void
}) {
  const doneCount = week.filter((d) => d.done).length
  const perfect = doneCount === 7

  // Sons : une seule fois par journée validée / par semaine parfaite.
  useEffect(() => {
    const today = week.find((d) => d.isToday)
    const dayKey = toDayKey(new Date())

    if (today?.done && localStorage.getItem('scolaria-day-jingle') !== dayKey) {
      localStorage.setItem('scolaria-day-jingle', dayKey)
      // Après la cascade des jetons.
      const t = setTimeout(() => sfx.dayComplete(), 800)
      return () => clearTimeout(t)
    }
  }, [week])

  useEffect(() => {
    if (!perfect) return
    const weekKey = mondayKey()
    if (localStorage.getItem('scolaria-week-jingle') !== weekKey) {
      localStorage.setItem('scolaria-week-jingle', weekKey)
      // Synchronisé avec la cascade des flammes.
      const t = setTimeout(() => sfx.weekComplete(), 1300)
      return () => clearTimeout(t)
    }
  }, [perfect])

  return (
    <section
      aria-label={`Série de ${streak} jour${streak > 1 ? 's' : ''}`}
      className="relative"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-heading text-lg font-bold">7 jours</h2>
        {onOpenCalendar ? (
          <button
            type="button"
            aria-label="Voir mon calendrier « Ma discipline »"
            title="Ma discipline — mon calendrier"
            onClick={() => {
              sfx.tap()
              onOpenCalendar()
            }}
            className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all hover:bg-primary/20 active:scale-90"
          >
            <CalendarDays className="size-4" strokeWidth={2.2} />
          </button>
        ) : null}
      </div>

      {/* Célébration de semaine parfaite */}
      {perfect ? (
        <div
          className="pop-spring absolute -top-3 left-1/2 z-20 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-400 to-orange-600 px-4 py-1 text-xs font-bold whitespace-nowrap text-white shadow-lg shadow-orange-500/30"
          style={{ animationDelay: '1500ms' }}
        >
          🎉 Semaine parfaite !
        </div>
      ) : null}

      <div className="flex items-stretch gap-3">
        {/* Les 7 jetons, lettre dans le jeton. */}
        <div className="flex min-w-0 flex-1 items-center justify-between gap-1">
          {week.map((day, i) => {
            const missed = !day.done && !day.isToday && !day.isFuture
            return (
              <button
                key={i}
                type="button"
                disabled={!onSelectDay}
                aria-label={`Voir mon planning de ${DAY_NAMES[i]}`}
                aria-pressed={selectedIdx === i}
                onClick={() => {
                  sfx.tap()
                  onSelectDay?.(i)
                }}
                style={day.done ? { animationDelay: `${i * 100}ms` } : undefined}
                className={cn(
                  'relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-extrabold transition-colors',
                  onSelectDay && 'cursor-pointer active:scale-90',
                  day.done && 'pop-spring moi-token-done text-white',
                  missed && 'bg-muted text-muted-foreground/60',
                  day.isFuture &&
                    'border-2 border-dashed border-muted-foreground/25 bg-card text-muted-foreground/60',
                  day.isToday &&
                    !day.done &&
                    'border-2 border-orange-400 bg-orange-500/10 text-foreground',
                  day.isToday &&
                    'ring-2 ring-orange-400/50 ring-offset-2 ring-offset-card',
                  selectedIdx === i &&
                    !day.isToday &&
                    'ring-2 ring-primary/60 ring-offset-2 ring-offset-card',
                )}
              >
                {day.done && perfect ? (
                  // Semaine parfaite : chaque jeton s'embrase, un à un.
                  <svg
                    viewBox="0 0 24 24"
                    className="pop-spring size-5"
                    style={{ animationDelay: `${700 + i * 120}ms` }}
                    aria-hidden="true"
                  >
                    <path d={FLAME_PATH} fill="white" />
                  </svg>
                ) : (
                  DAY_LETTERS[i]
                )}
              </button>
            )
          })}
        </div>

        {/* Le compteur, porté par la mascotte. */}
        <span aria-hidden="true" className="w-px self-stretch bg-border" />
        <div className="flex shrink-0 flex-col items-center justify-center px-0.5">
          <div className="flex items-center gap-0.5">
            <span className="font-mono text-2xl leading-none font-extrabold tabular-nums">
              {streak}
            </span>
            <StreakMascot streak={streak} size={30} badge={false} />
          </div>
          <p className="mt-0.5 text-[10px] leading-none font-bold text-muted-foreground">
            jours de suite
          </p>
        </div>
      </div>
    </section>
  )
}
