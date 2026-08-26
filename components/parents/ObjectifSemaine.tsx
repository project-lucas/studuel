import Link from 'next/link'
import { Check, Target } from 'lucide-react'
import { formatWorkDuration } from '@/lib/parents'
import { goalProgress } from '@/lib/parents-suivi'

/**
 * L'objectif de la semaine, en une jauge.
 *
 * POURQUOI. « 1 h 20 cette semaine » ne veut rien dire pour un parent : c'est
 * beaucoup ou c'est peu ? Le chiffre existait déjà à l'écran, mais sans repère
 * il ne se transformait en aucune décision. La jauge donne ce repère, et le
 * repère est CELUI DU PARENT (réglé dans le volet Réglages) — pas une norme
 * que l'app aurait décrétée pour tous les enfants de France.
 *
 * Quand l'objectif est atteint, la jauge passe au jaune solaire : c'est la
 * couleur de la progression et de la récompense dans toute l'app, et un objectif
 * tenu est exactement cela. En cours, elle reste violette.
 */
export default function ObjectifSemaine({
  weekSeconds,
  goalMinutes,
  reglagesHref,
}: {
  weekSeconds: number
  goalMinutes: number
  /** Lien vers le volet Réglages — l'objectif se change là où il se règle. */
  reglagesHref: string
}) {
  const p = goalProgress(weekSeconds, goalMinutes)

  return (
    <section className="border-primary/20 bg-primary/[0.04] rounded-2xl border p-4">
      <div className="mb-2.5 flex items-baseline justify-between gap-3">
        <h4 className="font-heading flex items-center gap-1.5 text-sm font-bold">
          {p.reached ? (
            <Check className="text-highlight size-4" strokeWidth={3} aria-hidden="true" />
          ) : (
            <Target className="text-primary size-4" strokeWidth={2.4} aria-hidden="true" />
          )}
          Objectif de la semaine
        </h4>
        <Link
          href={reglagesHref}
          className="text-muted-foreground hover:text-primary shrink-0 text-xs font-medium underline underline-offset-4"
        >
          {formatWorkDuration(goalMinutes * 60)}
        </Link>
      </div>

      <div
        className="bg-muted h-2.5 overflow-hidden rounded-full"
        role="progressbar"
        aria-valuenow={p.percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Objectif de la semaine : ${p.percent} %`}
      >
        <div
          className={`h-full rounded-full transition-[width] ${
            p.reached ? 'bg-highlight' : 'bg-primary'
          }`}
          style={{ width: `${Math.max(p.percent, p.percent > 0 ? 4 : 0)}%` }}
        />
      </div>

      <p className="text-muted-foreground mt-2 text-xs">
        {p.reached ? (
          <span className="text-foreground font-medium">
            Objectif atteint — {formatWorkDuration(weekSeconds)} cette semaine. À
            féliciter.
          </span>
        ) : weekSeconds > 0 ? (
          <>
            <span className="text-foreground font-medium">
              {formatWorkDuration(weekSeconds)}
            </span>{' '}
            faites — il reste {formatWorkDuration(p.remainingSeconds)} d’ici
            dimanche.
          </>
        ) : (
          <>Rien cette semaine pour l’instant — l’objectif est de {formatWorkDuration(goalMinutes * 60)}.</>
        )}
      </p>
    </section>
  )
}
