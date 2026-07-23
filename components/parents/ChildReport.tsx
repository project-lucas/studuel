import { CalendarClock, Clock, Flame, Gauge, Trophy, Unlink } from 'lucide-react'
import { workLevel } from '@/lib/work-level'
import {
  averageDailySeconds,
  formatWorkDuration,
  hasJudgeableSubject,
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
  const avgDaily = averageDailySeconds(
    dashboard.week_seconds,
    dashboard.week_active_days,
  )

  return (
    <article className="bg-card mb-6 rounded-2xl border p-5 shadow-sm">
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-heading text-lg font-semibold">{name}</h3>
          <p className="text-muted-foreground text-sm">
            {/* Le 3e argument est EXACTEMENT ce que compte la grille « Cette
                semaine » plus bas : les deux ne peuvent plus se contredire. */}
            {parentHeadline(
              dashboard.sessions_7,
              streak,
              week.filter((d) => d.done).length,
            )}
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

      {/* Les trois temps mis en avant : total, cette semaine, moyenne/jour */}
      <div className="mb-4 grid grid-cols-3 gap-3">
        <BigStat
          icon={<Clock className="size-4" aria-hidden="true" />}
          label="Temps total"
          value={formatWorkDuration(dashboard.work_seconds)}
          sub={level.title}
        />
        <BigStat
          icon={<CalendarClock className="size-4" aria-hidden="true" />}
          label="7 derniers jours"
          value={formatWorkDuration(dashboard.week_seconds)}
          sub={
            dashboard.week_active_days > 0
              ? `${dashboard.week_active_days} jour${dashboard.week_active_days > 1 ? 's' : ''} travaillé${dashboard.week_active_days > 1 ? 's' : ''}`
              : 'à relancer'
          }
        />
        <BigStat
          icon={<Gauge className="size-4" aria-hidden="true" />}
          label="Moyenne / jour"
          value={avgDaily > 0 ? formatWorkDuration(avgDaily) : '—'}
          sub="par jour travaillé"
        />
      </div>

      {/* Série + réussite, en second plan */}
      <div className="mb-5 grid grid-cols-2 gap-3">
        <Stat
          icon={<Flame className="size-4" aria-hidden="true" />}
          label="Série"
          value={`${streak} j`}
          sub={streak > 0 ? 'en cours' : 'à relancer'}
        />
        {/* « exercices » et non « quiz » : ce compteur inclut aussi la file
            « À revoir » et les examens blancs (test_sessions à quiz_id nul),
            que le score par matière, lui, ne juge pas. */}
        <Stat
          icon={<Trophy className="size-4" aria-hidden="true" />}
          label="Score moyen"
          value={dashboard.sessions_total > 0 ? `${avgPct} %` : '—'}
          sub={`${dashboard.sessions_total} exercices`}
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
            {hasJudgeableSubject(dashboard.per_subject)
              ? 'Aucune matière en difficulté — tout est au vert.'
              : 'Pas encore assez de quiz par matière pour les évaluer.'}
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

// Indicateur mis en avant (les trois temps) : liseré violet, chiffre large.
function BigStat({
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
    <div className="border-primary/25 bg-primary/5 rounded-2xl border p-3 text-center">
      <span className="bg-primary/10 text-primary mx-auto mb-1.5 flex size-8 items-center justify-center rounded-lg">
        {icon}
      </span>
      <span className="font-heading block text-lg leading-none font-bold tabular-nums">
        {value}
      </span>
      <span className="text-muted-foreground mt-1.5 block text-[11px] leading-tight font-medium">
        {label}
      </span>
      <span className="text-muted-foreground/80 block text-[11px]">{sub}</span>
    </div>
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
