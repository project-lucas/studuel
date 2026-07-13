import { Clock, Flame, Trophy, Unlink } from 'lucide-react'
import { workLevel } from '@/lib/work-level'
import {
  formatWorkDuration,
  parentHeadline,
  scorePercent,
  strongestSubject,
  subjectStateLabel,
  weakestSubjects,
  type ChildDashboard,
} from '@/lib/parents'
import { unlinkChild } from '@/app/parents/actions'

type WeekDay = { done: boolean; isToday: boolean; isFuture: boolean }

type Props = {
  childId: string
  dashboard: ChildDashboard
  streak: number
  week: WeekDay[]
}

const DAY_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

export default function ChildReport({
  childId,
  dashboard,
  streak,
  week,
}: Props) {
  const level = workLevel(dashboard.work_seconds)
  const weak = weakestSubjects(dashboard.per_subject)
  const strong = strongestSubject(dashboard.per_subject)
  const avgPct = scorePercent(dashboard.avg_ratio)
  const name = dashboard.full_name?.trim() || 'Votre enfant'

  return (
    <article className="bg-card mb-6 rounded-2xl border p-5 shadow-sm">
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-heading text-lg font-semibold">{name}</h3>
          <p className="text-muted-foreground text-sm">
            {parentHeadline(dashboard.sessions_7, streak)}
          </p>
        </div>
        <form action={unlinkChild}>
          <input type="hidden" name="childId" value={childId} />
          <button
            type="submit"
            className="text-muted-foreground hover:text-destructive flex items-center gap-1 rounded-lg px-2 py-1 text-xs transition-colors"
            aria-label={`Rompre le lien avec ${name}`}
          >
            <Unlink className="size-3.5" aria-hidden="true" />
            Délier
          </button>
        </form>
      </header>

      {/* Trois indicateurs clés */}
      <div className="mb-5 grid grid-cols-3 gap-3">
        <Stat
          icon={<Clock className="size-4" aria-hidden="true" />}
          label="Temps de travail"
          value={formatWorkDuration(dashboard.work_seconds)}
          sub={level.title}
        />
        <Stat
          icon={<Flame className="size-4" aria-hidden="true" />}
          label="Série"
          value={`${streak} j`}
          sub={streak > 0 ? 'en cours' : 'à relancer'}
        />
        <Stat
          icon={<Trophy className="size-4" aria-hidden="true" />}
          label="Score moyen"
          value={dashboard.sessions_total > 0 ? `${avgPct} %` : '—'}
          sub={`${dashboard.sessions_total} quiz`}
        />
      </div>

      {/* Régularité de la semaine */}
      <section className="mb-5">
        <h4 className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
          Cette semaine
        </h4>
        <div className="flex gap-2">
          {week.map((day, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <span
                className={`flex size-8 items-center justify-center rounded-lg text-xs font-semibold ${
                  day.done
                    ? 'bg-highlight text-foreground'
                    : day.isFuture
                      ? 'bg-muted/50 text-muted-foreground'
                      : 'bg-muted text-muted-foreground'
                } ${day.isToday ? 'ring-primary ring-2' : ''}`}
                aria-label={day.done ? 'Jour travaillé' : 'Jour sans activité'}
              >
                {DAY_LABELS[i]}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Matières à renforcer */}
      <section>
        <h4 className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
          Matières à renforcer
        </h4>
        {weak.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            {dashboard.sessions_total > 0
              ? 'Aucune matière en difficulté — tout est au vert.'
              : 'Pas encore assez de quiz pour évaluer les matières.'}
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {weak.map((s) => {
              const pct = scorePercent(s.ratio)
              return (
                <li key={s.subject} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 truncate text-sm font-medium">
                    {s.subject}
                  </span>
                  <span className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
                    <span
                      className="bg-primary block h-full rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </span>
                  <span className="text-muted-foreground w-24 shrink-0 text-right text-xs">
                    {subjectStateLabel(s.ratio)}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
        {strong ? (
          <p className="text-muted-foreground mt-3 text-sm">
            Point fort :{' '}
            <span className="text-foreground font-medium">{strong.subject}</span>{' '}
            ({scorePercent(strong.ratio)} %) — à valoriser.
          </p>
        ) : null}
      </section>
    </article>
  )
}

function Stat({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode
  label: string
  value: string
  sub: string
}) {
  return (
    <div className="bg-background rounded-xl border p-3 text-center">
      <span className="text-primary mb-1 flex justify-center">{icon}</span>
      <span className="block text-base font-bold">{value}</span>
      <span className="text-muted-foreground block text-[11px] leading-tight">
        {label}
      </span>
      <span className="text-muted-foreground/80 block text-[11px]">{sub}</span>
    </div>
  )
}
