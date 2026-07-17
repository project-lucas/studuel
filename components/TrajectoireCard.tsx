import { Target, Rocket } from 'lucide-react'
import ProgressRing from '@/components/ProgressRing'
import { cn } from '@/lib/utils'
import { monthLabelFr, type Trajectoire } from '@/lib/trajectoire'

// « Ma trajectoire » — la carte macro de l'onglet Moi (onglet Progrès) : la
// préparation globale de l'année en un anneau, le rythme réel de l'élève, et
// une projection honnête face à l'échéance (brevet/bac/fin d'année). Toute la
// logique vit dans lib/trajectoire ; ici, uniquement l'affichage.
export default function TrajectoireCard({
  trajectoire,
}: {
  trajectoire: Trajectoire
}) {
  const t = trajectoire
  // Pas de classe/chapitres suivis : rien à projeter, la carte s'efface.
  if (t.chaptersTotal === 0) return null

  const pct = Math.round(t.readiness * 100)
  const perWeekLabel =
    t.perWeek !== null && t.perWeek > 0
      ? `${t.perWeek.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} chap./sem.`
      : null

  // La phrase de projection — toujours au conditionnel du rythme observé,
  // jamais une promesse.
  let phrase: string
  let late = false
  if (t.chaptersDone === t.chaptersTotal) {
    phrase = `Programme complet — tu es prêt pour ${t.target.label}. 👑`
  } else if (t.projectedKey === null) {
    phrase = `Valide ton premier chapitre pour voir ta projection vers ${t.target.label}.`
  } else if (t.onTrack) {
    phrase = `À ton rythme actuel, prêt vers ${monthLabelFr(t.projectedKey)} — avant ${t.target.label}. 💪`
  } else {
    late = true
    phrase = `À ton rythme actuel, prêt vers ${monthLabelFr(t.projectedKey)} — accélère un peu pour ${t.target.label}.`
  }

  return (
    <section
      aria-label="Ma trajectoire"
      className="moi-card rounded-[1.75rem] bg-white p-5"
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Target className="size-4.5" strokeWidth={2.2} aria-hidden="true" />
        </span>
        <h2 className="font-heading text-lg font-extrabold text-foreground">
          Ma trajectoire
        </h2>
        <span className="ml-auto rounded-full bg-highlight/15 px-2.5 py-1 text-[0.65rem] font-extrabold tracking-wide text-foreground/70 uppercase">
          {t.target.isExam ? t.target.label : 'année'} ·{' '}
          {monthLabelFr(t.target.dateKey)}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <ProgressRing
          value={t.readiness}
          size={84}
          strokeWidth={8}
          label={`Préparation globale : ${pct} %`}
          trackClassName="stroke-muted"
          fillClassName="stroke-primary"
        >
          <span className="font-heading text-xl font-extrabold text-foreground tabular-nums">
            {pct}%
          </span>
        </ProgressRing>

        <div className="min-w-0 flex-1">
          <p className="text-sm leading-snug font-semibold text-foreground/85">
            {phrase}
          </p>
          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-muted-foreground">
            <span className="tabular-nums">
              {t.chaptersDone}/{t.chaptersTotal} chapitres validés
            </span>
            {perWeekLabel ? (
              <span
                className={cn(
                  'flex items-center gap-1 tabular-nums',
                  late ? 'text-destructive' : 'text-primary',
                )}
              >
                <Rocket className="size-3.5" aria-hidden="true" />
                {perWeekLabel}
              </span>
            ) : null}
          </p>
        </div>
      </div>
    </section>
  )
}
