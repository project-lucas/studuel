import { cn } from '@/lib/utils'
import { structureLabel } from '@/lib/habits'

// Bloc 1 de Moi — le Score de structure (0-100) : cercle de progression
// calculé sur les habitudes tenues ces 7 derniers jours.
export default function StructureScore({ score }: { score: number }) {
  const R = 52
  const C = 2 * Math.PI * R
  const label = structureLabel(score)

  return (
    <section
      aria-label={`Score de structure : ${score} sur 100 — ${label}`}
      className="flex items-center gap-5 rounded-2xl border bg-card p-5 shadow-sm"
    >
      <span className="relative inline-flex size-28 shrink-0 items-center justify-center">
        <svg viewBox="0 0 120 120" className="absolute inset-0 size-full -rotate-90">
          <circle
            cx="60"
            cy="60"
            r={R}
            fill="none"
            strokeWidth="10"
            className="stroke-muted"
          />
          {score > 0 ? (
            <circle
              cx="60"
              cy="60"
              r={R}
              fill="none"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${(C * score) / 100} ${C}`}
              className={cn(
                'transition-all',
                score >= 60
                  ? 'stroke-highlight'
                  : score >= 40
                    ? 'stroke-amber-500'
                    : 'stroke-destructive',
              )}
            />
          ) : null}
        </svg>
        <span className="font-mono text-3xl font-bold tabular-nums">{score}</span>
      </span>

      <div className="min-w-0">
        <p className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
          Score de structure
        </p>
        <p className="font-heading text-2xl font-bold">{label}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Tes habitudes tenues sur les 7 derniers jours. La structure fait les
          notes.
        </p>
      </div>
    </section>
  )
}
