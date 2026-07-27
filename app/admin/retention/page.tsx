import Link from 'next/link'
import { AlertTriangle, TrendingUp, Users, Activity } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { cn } from '@/lib/utils'
import {
  HORIZONS,
  HORIZON_LABEL,
  BARS,
  SESSIONS_TARGET,
  MIN_COHORT,
  aggregate,
  averageSessionsPerUser,
  cohortView,
  funnelView,
  headline,
  normalizeDashboard,
  percent,
  worstStep,
  type Horizon,
  type Verdict,
} from '@/lib/retention'

export const metadata = { title: 'Rétention — Studuel' }
export const dynamic = 'force-dynamic'

const VERDICT_STYLE: Record<Verdict, string> = {
  alerte: 'bg-destructive/15 text-destructive border-destructive/40',
  correct: 'bg-muted text-foreground border-border',
  bon: 'bg-primary/15 text-primary border-primary/40',
  inconnu: 'bg-muted/50 text-muted-foreground border-border',
}

/**
 * Tableau de bord de rétention — la page à ouvrir CHAQUE MATIN.
 *
 * Elle n'a qu'un travail : dire si le produit retient, et si non, à quelle
 * marche il perd les gens. Tout le reste de l'app est du pari tant que ces
 * chiffres ne sont pas lus. D'où la hiérarchie : une phrase de verdict en
 * premier, les trois barres ensuite, l'entonnoir après, le détail par cohorte
 * en dernier — personne ne lit un tableau de cohortes en premier.
 */
export default async function RetentionPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('retention_dashboard', { p_days: 60 })

  if (error || data === null) {
    return (
      <section className="rounded-2xl border bg-card p-6">
        <h1 className="font-heading text-xl font-bold">Rétention</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {error
            ? 'La migration 206 n’a pas encore été exécutée (SQL Editor Supabase).'
            : 'Accès refusé.'}
        </p>
      </section>
    )
  }

  const dashboard = normalizeDashboard(data)
  const funnel = funnelView(dashboard.funnel)
  const worst = worstStep(funnel)
  const avgSessions = averageSessionsPerUser(dashboard.activity)
  const cohorts = dashboard.cohorts.map(cohortView)
  const verdict = aggregate(dashboard.cohorts, 'd1').verdict

  return (
    <div className="space-y-6">
      <header className="flex items-baseline justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold">Rétention</h1>
        <p className="text-sm text-muted-foreground">
          {dashboard.totalUsers.toLocaleString('fr-FR')} comptes · 60 derniers jours
        </p>
      </header>

      {/* LE verdict. Une phrase, en gros, qui nomme le chantier prioritaire. */}
      <section
        className={cn(
          'rounded-2xl border-2 p-5',
          verdict === 'alerte'
            ? 'border-destructive/50 bg-destructive/10'
            : 'border-primary/40 bg-primary/10',
        )}
      >
        <p className="flex items-start gap-3 font-heading text-lg font-bold">
          {verdict === 'alerte' ? (
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" />
          ) : (
            <TrendingUp className="mt-0.5 size-5 shrink-0 text-primary" />
          )}
          {headline(dashboard)}
        </p>
      </section>

      {/* Les trois barres. Chacune affiche sa cible : un chiffre sans sa barre
          ne dit pas s'il est bon. */}
      <section className="grid gap-3 sm:grid-cols-3">
        {HORIZONS.map((h) => (
          <HorizonCard key={h} horizon={h} cohorts={dashboard.cohorts} />
        ))}
      </section>

      {/* Engagement : la rétention seule décrit une corvée si on ne revient
          qu'une fois par jour. */}
      <section className="rounded-2xl border bg-card p-4">
        <h2 className="flex items-center gap-2 font-heading text-lg font-bold">
          <Activity className="size-4 text-primary" />
          Engagement
        </h2>
        <p className="mt-2 text-sm">
          <span className="font-mono text-2xl font-bold tabular-nums">
            {avgSessions === null ? '—' : avgSessions.toFixed(1)}
          </span>{' '}
          <span className="text-muted-foreground">
            sessions par élève actif (cible {SESSIONS_TARGET})
          </span>
        </p>
        <Sparkline activity={dashboard.activity} />
      </section>

      {/* L'entonnoir d'arrivée : la marche qui saigne le plus est l'écran à
          refaire en premier. */}
      <section className="rounded-2xl border bg-card p-4">
        <h2 className="flex items-center gap-2 font-heading text-lg font-bold">
          <Users className="size-4 text-primary" />
          Arrivée
        </h2>
        {worst ? (
          <p className="mt-1 text-sm text-muted-foreground">
            Plus grosse perte :{' '}
            <span className="font-semibold text-destructive">{worst.label}</span> (−
            {worst.lost.toLocaleString('fr-FR')})
          </p>
        ) : null}
        <ol className="mt-3 space-y-2">
          {funnel.map((s) => (
            <li key={s.id}>
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <span className={cn(worst?.id === s.id && 'font-bold text-destructive')}>
                  {s.label}
                </span>
                <span className="font-mono tabular-nums">
                  {s.count.toLocaleString('fr-FR')}
                  <span className="ml-2 text-muted-foreground">
                    {percent(s.ofTotal)}
                  </span>
                </span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    'h-full rounded-full',
                    worst?.id === s.id ? 'bg-destructive' : 'bg-primary',
                  )}
                  style={{ width: `${Math.round((s.ofTotal ?? 0) * 100)}%` }}
                />
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Le détail, pour qui veut voir si une journée précise a dérapé. */}
      <section className="rounded-2xl border bg-card p-4">
        <h2 className="font-heading text-lg font-bold">Cohortes</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          « — » = l’horizon n’est pas encore atteint. En dessous de {MIN_COHORT}{' '}
          inscrits, un taux ne veut rien dire.
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[26rem] text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="py-2 font-medium">Jour</th>
                <th className="py-2 text-right font-medium">Inscrits</th>
                {HORIZONS.map((h) => (
                  <th key={h} className="py-2 text-right font-medium">
                    {HORIZON_LABEL[h]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cohorts.map((c) => (
                <tr key={c.day} className="border-b last:border-0">
                  <td className="py-2 font-mono text-xs tabular-nums">{c.day}</td>
                  <td className="py-2 text-right font-mono tabular-nums">{c.size}</td>
                  {HORIZONS.map((h) => (
                    <td
                      key={h}
                      className={cn(
                        'py-2 text-right font-mono tabular-nums',
                        c.verdicts[h] === 'alerte' && 'text-destructive',
                        c.verdicts[h] === 'bon' && 'text-primary',
                        c.verdicts[h] === 'inconnu' && 'text-muted-foreground',
                      )}
                    >
                      {percent(c.rates[h])}
                    </td>
                  ))}
                </tr>
              ))}
              {cohorts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-muted-foreground">
                    Aucune inscription sur la période.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <Link
        href="/admin"
        className="inline-block text-sm text-muted-foreground underline underline-offset-4"
      >
        Retour au studio
      </Link>
    </div>
  )
}

function HorizonCard({
  horizon,
  cohorts,
}: {
  horizon: Horizon
  cohorts: Parameters<typeof aggregate>[0]
}) {
  const agg = aggregate(cohorts, horizon)
  const bar = BARS[horizon]
  return (
    <div className={cn('rounded-2xl border-2 p-4', VERDICT_STYLE[agg.verdict])}>
      <p className="text-xs font-semibold opacity-70">
        Rétention {HORIZON_LABEL[horizon]}
      </p>
      <p className="font-mono text-4xl font-bold tabular-nums">{percent(agg.rate)}</p>
      <p className="mt-1 text-xs opacity-70">
        {agg.retained.toLocaleString('fr-FR')} / {agg.size.toLocaleString('fr-FR')}{' '}
        élèves
      </p>
      <p className="mt-2 text-xs font-semibold">
        Alerte &lt; {Math.round(bar.alerte * 100)} % · Cible ≥{' '}
        {Math.round(bar.bon * 100)} %
      </p>
    </div>
  )
}

/** Courbe des actifs quotidiens sur 14 jours. Volontairement minuscule : elle
 *  sert à repérer une chute, pas à lire une valeur. */
function Sparkline({
  activity,
}: {
  activity: { day: string; activeUsers: number }[]
}) {
  if (activity.length === 0) return null
  const max = Math.max(...activity.map((a) => a.activeUsers), 1)
  return (
    <div className="mt-3">
      <div className="flex h-16 items-end gap-1">
        {activity.map((a) => (
          <div
            key={a.day}
            title={`${a.day} — ${a.activeUsers} actifs`}
            className="flex-1 rounded-t bg-primary/60"
            style={{ height: `${Math.max(4, (a.activeUsers / max) * 100)}%` }}
          />
        ))}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Élèves actifs par jour · 14 derniers jours (max {max})
      </p>
    </div>
  )
}
