import { Trophy, CalendarCheck, Sparkles } from 'lucide-react'
import type { DebriefYearStats } from '@/lib/debrief'

// -----------------------------------------------------------------------------
// « Mon année de coaching » — la vision claire du parcours demandée : ce que
// l'élève a coaché sur l'année, habitude par habitude (victoires / réponses),
// plus trois chiffres phares en tête. Purement présentationnel (stats calculées
// dans lib/debrief.ts → debriefYearStats).
// -----------------------------------------------------------------------------

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
      <span className="font-heading text-xl font-extrabold tabular-nums leading-none">
        {value}
      </span>
      <span className="text-[10px] leading-tight font-semibold text-muted-foreground">
        {label}
      </span>
    </div>
  )
}

export default function DebriefYearRecap({ stats }: { stats: DebriefYearStats }) {
  if (stats.daysCoached === 0) {
    return (
      <p className="rounded-2xl bg-muted/50 px-4 py-6 text-center text-xs leading-relaxed text-muted-foreground">
        Ton année de coaching s&apos;écrit ici. Fais ton premier débrief du jour
        et tu verras tes victoires s&apos;accumuler. 🌱
      </p>
    )
  }

  const winPct = Math.round(stats.winRate * 100)

  return (
    <div className="flex flex-col gap-4">
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

      <ul className="flex flex-col gap-2.5">
        {stats.perPair.map((p) => {
          const pct = p.answered > 0 ? Math.round((p.wins / p.answered) * 100) : 0
          return (
            <li key={p.id} className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-green-600/10 text-base"
              >
                {p.goodEmoji}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-xs font-semibold">{p.good}</span>
                  <span className="shrink-0 text-[11px] font-bold text-muted-foreground tabular-nums">
                    {p.wins}/{p.answered}
                  </span>
                </div>
                <div
                  className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted"
                  role="progressbar"
                  aria-label={`${p.good} : ${p.wins} victoires sur ${p.answered} réponses`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={pct}
                >
                  <div
                    className="h-full rounded-full bg-green-600"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
