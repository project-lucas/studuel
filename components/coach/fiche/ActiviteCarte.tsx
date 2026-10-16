import { Activity } from 'lucide-react'
import { formaterDuree } from '@/lib/coach/statut'
import { libelleActivite, tendance, type Semaine } from '@/lib/coach/suivi'
import { cn } from '@/lib/utils'

/**
 * L'ACTIVITÉ : huit semaines de travail en barres (avec la tendance), les 28
 * derniers jours en damier, et les derniers gestes de l'élève dans l'app.
 */
export default function ActiviteCarte({
  semaines,
  jours,
  recent,
}: {
  semaines: Semaine[]
  jours: { jour: string; minutes: number }[]
  recent: { source: string; xp: number; quand: string }[]
}) {
  const max = Math.max(1, ...semaines.map((s) => s.minutes))
  const t = tendance(semaines)
  const maxJour = Math.max(1, ...jours.map((j) => j.minutes))
  // Le damier : 4 semaines, du plus ancien au plus récent.
  const damier = [...jours].sort((a, b) => a.jour.localeCompare(b.jour))

  return (
    <section className="carte p-5" aria-labelledby="activite">
      <div className="flex items-center gap-2">
        <Activity className="size-5 text-primary" aria-hidden="true" />
        <h2 id="activite" className="titre-section flex-1">Activité</h2>
        {t.sens !== 'inconnue' ? (
          <span
            className={cn(
              'rounded-full px-2.5 py-1 text-xs font-bold',
              t.sens === 'hausse' ? 'bg-(--success)/15 text-(--success)' : t.sens === 'baisse' ? 'bg-(--destructive)/10 text-(--destructive)' : 'bg-secondary',
            )}
          >
            {t.sens === 'hausse' ? 'En hausse' : t.sens === 'baisse' ? 'En baisse' : 'Stable'}
            {t.ecartPct !== null ? ` ${t.ecartPct > 0 ? '+' : ''}${t.ecartPct} %` : ''}
          </span>
        ) : null}
      </div>

      <p className="mt-3 text-xs font-extrabold tracking-wide text-muted-foreground uppercase">Huit semaines</p>
      <ol className="mt-2 grid grid-cols-8 items-end gap-1.5" aria-label="Minutes de travail par semaine">
        {semaines.map((s, i) => (
          <li key={s.lundi} className="flex flex-col items-center gap-1" title={`Semaine du ${s.lundi} : ${s.minutes} min, ${s.jours} j, ${s.quiz} quiz`}>
            <span className="text-[10px] font-bold tabular-nums">{s.minutes ? formaterDuree(s.minutes * 60) : '—'}</span>
            <span className="flex h-24 w-full items-end rounded-lg bg-secondary/60 p-0.5" aria-hidden="true">
              <span className={cn('block w-full rounded-md', i === semaines.length - 1 ? 'bg-primary' : 'bg-primary/50')} style={{ height: `${Math.max(3, Math.round((s.minutes / max) * 100))}%` }} />
            </span>
            <span className="text-[10px] font-semibold text-muted-foreground">{s.lundi.slice(8, 10)}/{s.lundi.slice(5, 7)}</span>
          </li>
        ))}
      </ol>

      <p className="mt-4 text-xs font-extrabold tracking-wide text-muted-foreground uppercase">28 derniers jours</p>
      <div className="mt-2 grid grid-cols-14 gap-1" aria-label="Minutes par jour">
        {damier.map((j) => {
          const intensite = j.minutes === 0 ? 0 : Math.min(1, 0.25 + (j.minutes / maxJour) * 0.75)
          return (
            <span
              key={j.jour}
              title={`${j.jour} : ${j.minutes} min`}
              className="aspect-square rounded-[4px] bg-secondary"
              style={intensite ? { backgroundColor: `color-mix(in oklch, var(--primary) ${Math.round(intensite * 100)}%, var(--secondary))` } : undefined}
            />
          )
        })}
      </div>

      <p className="mt-4 text-xs font-extrabold tracking-wide text-muted-foreground uppercase">Derniers gestes</p>
      {recent.length === 0 ? (
        <p className="mt-1 text-sm text-muted-foreground">Rien pour l’instant.</p>
      ) : (
        <ul className="mt-2 flex max-h-64 flex-col gap-1 overflow-y-auto text-sm">
          {recent.map((r, i) => (
            <li key={i} className="flex items-center justify-between gap-2 rounded-lg px-2 py-1 odd:bg-secondary/40">
              <span className="font-bold">{libelleActivite(r.source)}</span>
              <span className="text-xs font-semibold text-muted-foreground tabular-nums">
                +{r.xp} XP · {new Date(r.quand).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' })}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
