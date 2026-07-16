import { CalendarCheck, Flame, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { WeeklyRecap } from '@/lib/weekly-recap'

const DAY_NAMES = [
  'lundi',
  'mardi',
  'mercredi',
  'jeudi',
  'vendredi',
  'samedi',
  'dimanche',
]

// Une tuile-chiffre du bilan : grand nombre + libellé, dans le style « jouet ».
function StatTile({
  value,
  label,
  sub,
}: {
  value: string
  label: string
  sub?: string
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-highlight/12 px-2 py-3 text-center">
      <span className="font-heading text-2xl font-extrabold text-foreground tabular-nums">
        {value}
      </span>
      <span className="mt-0.5 text-[0.7rem] font-semibold text-muted-foreground">
        {label}
      </span>
      {sub ? (
        <span className="mt-0.5 text-[0.65rem] font-medium text-primary">
          {sub}
        </span>
      ) : null}
    </div>
  )
}

// « Ta semaine » — rétro hebdo de l'onglet Moi : les chiffres marquants de la
// semaine en cours + une accroche qui s'adapte (cf. lib/weekly-recap).
export default function WeeklyRecapCard({ recap }: { recap: WeeklyRecap }) {
  const deltaLabel =
    recap.sessionsDelta > 0
      ? `+${recap.sessionsDelta} vs sem. dernière`
      : recap.sessionsDelta < 0
        ? `${recap.sessionsDelta} vs sem. dernière`
        : undefined

  return (
    <section
      aria-label="Bilan de la semaine"
      className="moi-card rounded-[1.75rem] bg-white p-5"
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CalendarCheck className="size-4.5" strokeWidth={2.2} aria-hidden="true" />
        </span>
        <h2 className="font-heading text-lg font-extrabold text-foreground">
          Ta semaine
        </h2>
      </div>

      <p className="mb-4 flex items-start gap-1.5 text-sm font-medium text-foreground/80">
        <TrendingUp
          className="mt-0.5 size-4 shrink-0 text-primary"
          aria-hidden="true"
        />
        <span>{recap.headline}</span>
      </p>

      <div className="grid grid-cols-3 gap-2">
        <StatTile
          value={String(recap.sessions)}
          label={recap.sessions > 1 ? 'sessions' : 'session'}
          sub={deltaLabel}
        />
        <StatTile value={`${recap.activeDays}/7`} label="jours actifs" />
        <StatTile
          value={recap.quizAvg === null ? '—' : `${recap.quizAvg}%`}
          label={
            recap.quizCount > 0
              ? `moyenne · ${recap.quizCount} quiz`
              : 'moyenne quiz'
          }
        />
      </div>

      {recap.bestDay ? (
        <p
          className={cn(
            'mt-3 flex items-center justify-center gap-1.5 rounded-full bg-muted/50 px-3 py-1.5',
            'text-xs font-semibold text-muted-foreground',
          )}
        >
          <Flame className="size-3.5 text-highlight" aria-hidden="true" />
          Ton jour le plus actif : {DAY_NAMES[recap.bestDay.index]}
        </p>
      ) : null}
    </section>
  )
}
