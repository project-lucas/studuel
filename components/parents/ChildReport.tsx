import { CalendarClock, Clock, Flame, Gauge, TriangleAlert, Trophy } from 'lucide-react'
import { GRADE_SHORT_LABELS } from '@/lib/grades'
import { isGradeLevel } from '@/lib/grades'
import { workLevel } from '@/lib/work-level'
import {
  averageDailySeconds,
  formatWorkDuration,
  parentHeadline,
  scorePercent,
  strongestSubject,
  type ChildDashboard,
} from '@/lib/parents'
import {
  controleViews,
  inactivityAlert,
  subjectRows,
  weekTrend,
  type ParentPrefs,
} from '@/lib/parents-suivi'
import ControlesAVenir from '@/components/parents/ControlesAVenir'
import MatieresSuivi from '@/components/parents/MatieresSuivi'
import ObjectifSemaine from '@/components/parents/ObjectifSemaine'
import TendanceSemaines from '@/components/parents/TendanceSemaines'

type WeekDay = { done: boolean; isToday: boolean; isFuture: boolean }

type Props = {
  childId: string
  /**
   * Déjà désambiguïsé par childDisplayNames() : deux enfants sans prénom ne
   * doivent pas afficher la même carte (cf. lib/parents.ts).
   */
  displayName: string
  dashboard: ChildDashboard
  streak: number
  week: WeekDay[]
  prefs: ParentPrefs
  /** slug → nom lisible, pour nommer la matière d'un contrôle. */
  subjectNames: Readonly<Record<string, string>>
  /** Clé UTC du jour (calculée une fois par la page, jamais par bloc). */
  today: string
  /** Lien vers le volet Réglages de cet enfant. */
  reglagesHref: string
}

const DAY_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

/**
 * La carte de suivi d'un enfant.
 *
 * L'ORDRE DES BLOCS EST L'ORDRE DES QUESTIONS. Un parent ouvre cet écran avec
 * une hiérarchie précise en tête, et la carte la suit :
 *
 *   1. Y a-t-il un problème ?     → l'alerte d'inactivité, quand elle existe
 *   2. Qu'est-ce qui est prévu ?  → les contrôles à venir
 *   3. Est-ce qu'il en fait assez ? → l'objectif de la semaine
 *   4. Combien, et à quel rythme ? → les temps, la série, la semaine
 *   5. Ça monte ou ça descend ?   → la tendance sur 4 semaines
 *   6. Sur quoi peut-on l'aider ? → le détail par matière
 *
 * Les chiffres bruts (les temps, le score) passent APRÈS l'agenda et
 * l'objectif : ils décrivent, ils ne se décident pas. Ils étaient en tête
 * jusqu'ici, ce qui donnait un tableau de bord qu'on lit et qu'on referme.
 *
 * TOLÉRANCE À LA MIGRATION 319. Objectif, tendance et contrôles ne s'affichent
 * que si la RPC les a renvoyés. Tant qu'elle n'est pas passée, la carte est
 * exactement celle d'avant — pas une carte trouée de zéros, qu'un parent
 * prendrait pour de vrais zéros.
 */
export default function ChildReport({
  childId,
  displayName,
  dashboard,
  streak,
  week,
  prefs,
  subjectNames,
  today,
  reglagesHref,
}: Props) {
  const level = workLevel(dashboard.work_seconds)
  const strong = strongestSubject(dashboard.per_subject)
  const avgPct = scorePercent(dashboard.avg_ratio)
  const avgDaily = averageDailySeconds(
    dashboard.week_seconds,
    dashboard.week_active_days,
  )
  const joursActifs = week.filter((d) => d.done).length

  // Les trois blocs de la 319. `undefined` = migration pas encore passée : on
  // se tait. `[]` = migration passée et rien à montrer : on le dit.
  const trend = dashboard.weeks ? weekTrend(dashboard.weeks) : null
  const controles = dashboard.controles
    ? controleViews(dashboard.controles, subjectNames, today)
    : null
  const alerte = inactivityAlert(
    dashboard.last_activity,
    prefs.alertAfterDays,
    today,
  )
  const grade =
    dashboard.grade_level && isGradeLevel(dashboard.grade_level)
      ? GRADE_SHORT_LABELS[dashboard.grade_level]
      : null

  return (
    <article
      className="bg-card mb-6 rounded-2xl border p-5 shadow-sm"
      aria-labelledby={`enfant-${childId}`}
    >
      <header className="mb-4">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <h3 id={`enfant-${childId}`} className="font-heading text-lg font-semibold">
            {displayName}
          </h3>
          {grade ? (
            <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[11px] font-bold">
              {grade}
            </span>
          ) : null}
        </div>
        <p className="text-muted-foreground mt-0.5 text-sm">
          {/* Le 3e argument est EXACTEMENT ce que compte la grille « Cette
              semaine » plus bas : les deux ne peuvent pas se contredire. */}
          {parentHeadline(dashboard.sessions_7, streak, joursActifs)}
        </p>
      </header>

      {/* 1. L'alerte, quand il y en a une. Elle passe avant tout le reste :
             c'est la seule raison pour laquelle un parent doit agir AUJOURD'HUI. */}
      {alerte ? (
        <p
          role="status"
          className="border-destructive/35 bg-destructive/[0.05] mb-4 flex items-start gap-2.5 rounded-xl border p-3 text-sm"
        >
          <TriangleAlert
            className="text-destructive mt-0.5 size-4 shrink-0"
            strokeWidth={2.4}
            aria-hidden="true"
          />
          <span>
            <span className="font-semibold">{alerte.message}</span>{' '}
            <span className="text-muted-foreground">
              Un mot d’encouragement suffit souvent à relancer la série.
            </span>
          </span>
        </p>
      ) : null}

      {/* 2. Ce qui est prévu. */}
      {controles ? (
        <ControlesAVenir controles={controles} childName={displayName} />
      ) : null}

      {/* 3. Le repère du parent. */}
      {dashboard.weeks ? (
        <div className="mb-5">
          <ObjectifSemaine
            weekSeconds={dashboard.week_seconds}
            goalMinutes={prefs.weeklyGoalMinutes}
            reglagesHref={reglagesHref}
          />
        </div>
      ) : null}

      {/* 4. Les temps. */}
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

      <div className="mb-5 grid grid-cols-2 gap-3">
        <Stat
          icon={<Flame className="size-4" aria-hidden="true" />}
          label="Série"
          value={`${streak} j`}
          sub={streak > 0 ? 'en cours' : 'à relancer'}
        />
        {/* « exercices » et non « quiz » : ce compteur inclut aussi la file
            « À revoir » et les examens blancs (test_sessions à quiz_id nul),
            que le score par matière, lui, ne juge pas.
            La valeur suit `avg_ratio` et NON le nombre d'exercices : un élève
            n'ayant fait que des exercices non notés par matière affichait
            « 0 % » sur 30 exercices — le pire contresens possible sur un écran
            de suivi. */}
        <Stat
          icon={<Trophy className="size-4" aria-hidden="true" />}
          label="Score moyen"
          value={dashboard.avg_ratio != null ? `${avgPct} %` : '—'}
          sub={`${dashboard.sessions_total} exercices`}
        />
      </div>

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

      {/* 5. La pente. */}
      {trend ? <TendanceSemaines trend={trend} today={today} /> : null}

      {/* 6. Le détail. */}
      <MatieresSuivi rows={subjectRows(dashboard.per_subject)} />

      {strong ? (
        <p className="text-muted-foreground mt-3 text-sm">
          Point fort :{' '}
          <span className="text-foreground font-medium">{strong.subject}</span> (
          {scorePercent(strong.ratio)} %) — à valoriser.
        </p>
      ) : null}
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
