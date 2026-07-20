import { Trophy, CalendarCheck, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DebriefPairStat, DebriefYearStats } from '@/lib/debrief'

// -----------------------------------------------------------------------------
// « Mon historique » — la vision claire du parcours sur l'année : trois chiffres
// phares en tête, puis UNE carte par habitude référencée avec sa heatmap
// annuelle (un point par jour : victoire, rechute ou jour sans réponse). Les
// pointages s'additionnent tout seuls au fil des débriefs. Purement
// présentationnel (données calculées dans lib/debrief.ts → debriefYearStats).
// -----------------------------------------------------------------------------

const MONTHS_SHORT = [
  'janv',
  'févr',
  'mars',
  'avr',
  'mai',
  'juin',
  'juil',
  'août',
  'sept',
  'oct',
  'nov',
  'déc',
]

const dayKey = (y: number, m: number, d: number) =>
  `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

const daysInMonth = (y: number, m: number) =>
  new Date(Date.UTC(y, m + 1, 0)).getUTCDate()

// Index lundi = 0 du 1er du mois (semaine commençant lundi, convention projet).
const firstWeekday = (y: number, m: number) =>
  (new Date(Date.UTC(y, m, 1)).getUTCDay() + 6) % 7

function StatTile({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode
  value: string
  label: string
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl bg-muted/60 px-2 py-3 text-center">
      <span className="text-primary" aria-hidden="true">
        {icon}
      </span>
      <span className="font-heading text-xl leading-none font-extrabold tabular-nums">
        {value}
      </span>
      <span className="text-[10px] leading-tight font-semibold text-muted-foreground">
        {label}
      </span>
    </div>
  )
}

// La heatmap annuelle d'une habitude : 12 mini-mois alignés sur la semaine,
// défilables horizontalement. Un point vert = victoire, corail pâle = rechute,
// gris = jour sans réponse, transparent = jour à venir.
function HabitHeatmap({ pair, today }: { pair: DebriefPairStat; today: string }) {
  const year = Number(today.slice(0, 4))
  const yearWins = Object.entries(pair.byDate).filter(
    ([d, o]) => d.slice(0, 4) === String(year) && o === 'good',
  ).length
  const monthWins = Object.entries(pair.byDate).filter(
    ([d, o]) => d.slice(0, 7) === today.slice(0, 7) && o === 'good',
  ).length

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-3">
      <div className="mb-2 flex items-center gap-2.5">
        <span
          aria-hidden="true"
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-green-600/10 text-base"
        >
          {pair.goodEmoji}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold">{pair.good}</p>
          <p className="text-[11px] font-semibold text-muted-foreground">
            <span className="text-green-700 tabular-nums dark:text-green-400">
              {yearWins} victoire{yearWins > 1 ? 's' : ''}
            </span>{' '}
            cette année · {monthWins} ce mois-ci
          </p>
        </div>
      </div>

      <div className="overflow-x-auto pb-1">
        <div className="flex min-w-max gap-2">
          {MONTHS_SHORT.map((label, m) => {
            const blanks = firstWeekday(year, m)
            const nb = daysInMonth(year, m)
            return (
              <div key={m} className="flex flex-col items-center gap-1">
                <span className="text-[9px] font-semibold text-muted-foreground">
                  {label}
                </span>
                <div className="grid grid-cols-7 gap-[2px]">
                  {Array.from({ length: blanks }, (_, i) => (
                    <span key={`b${i}`} className="size-2" aria-hidden="true" />
                  ))}
                  {Array.from({ length: nb }, (_, i) => {
                    const key = dayKey(year, m, i + 1)
                    const outcome = pair.byDate[key]
                    const future = key > today
                    return (
                      <span
                        key={key}
                        title={key}
                        className={cn(
                          'size-2 rounded-[2px]',
                          future
                            ? 'bg-muted/30'
                            : outcome === 'good'
                              ? 'bg-green-600'
                              : outcome === 'bad'
                                ? 'bg-destructive/40'
                                : 'bg-muted',
                        )}
                      />
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function DebriefYearRecap({
  stats,
  today,
}: {
  stats: DebriefYearStats
  today: string
}) {
  if (stats.daysCoached === 0) {
    return (
      <p className="rounded-2xl bg-muted/50 px-4 py-6 text-center text-xs leading-relaxed text-muted-foreground">
        Ton historique s&apos;écrit ici. Fais ton premier débrief du jour et tu
        verras tes victoires s&apos;accumuler, jour après jour. 🌱
      </p>
    )
  }

  const winPct = Math.round(stats.winRate * 100)

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs leading-relaxed text-muted-foreground">
        Chaque habitude a sa carte : tes victoires « tenues » s&apos;additionnent
        tout seules, sur toute l&apos;année.
      </p>

      <div className="grid grid-cols-3 gap-2">
        <StatTile
          icon={<CalendarCheck className="size-5" strokeWidth={2.4} />}
          value={String(stats.daysCoached)}
          label={stats.daysCoached > 1 ? 'jours coachés' : 'jour coaché'}
        />
        <StatTile
          icon={<Trophy className="size-5" strokeWidth={2.4} />}
          value={String(stats.totalWins)}
          label={stats.totalWins > 1 ? 'victoires' : 'victoire'}
        />
        <StatTile
          icon={<Sparkles className="size-5" strokeWidth={2.4} />}
          value={`${winPct} %`}
          label="d'habitudes tenues"
        />
      </div>

      {/* Légende de la heatmap. */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] font-semibold text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-[3px] bg-green-600" aria-hidden="true" />
          Victoire
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="size-2.5 rounded-[3px] bg-destructive/40"
            aria-hidden="true"
          />
          Rechute
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-[3px] bg-muted" aria-hidden="true" />
          Sans réponse
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {stats.perPair.map((p) => (
          <HabitHeatmap key={p.id} pair={p} today={today} />
        ))}
      </div>
    </div>
  )
}
