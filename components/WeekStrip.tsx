import { Flame, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const DAY_LETTERS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

// Bloc 1 de Réviser — bandeau de série hebdomadaire façon Duolingo :
// jour validé (coche), manqué (croix pâle), à venir (pointillé),
// jour courant en surbrillance. Compteur de série à droite.
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
      className="flex items-center justify-between gap-3 rounded-2xl border bg-card p-4 shadow-sm"
    >
      <ol className="flex flex-1 items-start justify-between gap-1 sm:justify-start sm:gap-3">
        {week.map((day, i) => {
          const missed = !day.done && !day.isToday && !day.isFuture
          return (
            <li
              key={i}
              className="pop-in flex flex-col items-center gap-1"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <span
                className={cn(
                  'text-[10px] font-bold',
                  day.isToday ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                {DAY_LETTERS[i]}
              </span>
              <span
                className={cn(
                  'flex size-8 items-center justify-center rounded-full transition-colors sm:size-9',
                  day.done && 'bg-highlight text-foreground',
                  missed && 'bg-muted text-muted-foreground/50',
                  day.isFuture && 'border-2 border-dashed border-muted-foreground/25',
                  day.isToday && !day.done && 'border-2 border-primary bg-primary/10',
                  day.isToday && 'ring-2 ring-primary/40 ring-offset-2 ring-offset-card',
                )}
              >
                {day.done ? (
                  <Check className="size-4" strokeWidth={3} />
                ) : missed ? (
                  <X className="size-3.5" />
                ) : null}
              </span>
            </li>
          )
        })}
      </ol>

      <div className="flex shrink-0 flex-col items-center border-l pl-3 sm:pl-5">
        <span className="flex items-center gap-1">
          <Flame className={cn('size-5 text-highlight', streak > 0 && 'animate-pulse')} />
          <span className="font-mono text-2xl font-bold tabular-nums">
            {streak}
          </span>
        </span>
        <span className="text-[10px] font-medium text-muted-foreground">
          jour{streak > 1 ? 's' : ''} de série
        </span>
      </div>
    </section>
  )
}
