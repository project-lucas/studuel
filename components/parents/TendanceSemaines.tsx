import { Minus, TrendingDown, TrendingUp } from 'lucide-react'
import { formatWorkDuration } from '@/lib/parents'
import {
  trendSentence,
  weekLabel,
  weekLabelShort,
  type WeekTrend,
} from '@/lib/parents-suivi'

/**
 * Le temps de révision des quatre dernières semaines, en quatre barres.
 *
 * POURQUOI. L'écran ne montrait QUE les sept derniers jours. Un enfant qui
 * décroche depuis trois semaines et un enfant qui vient de démarrer y
 * affichaient exactement la même carte — la seule chose qu'un parent veut
 * savoir, le SENS de la pente, était précisément ce qui manquait.
 *
 * Quatre semaines et pas douze : au-delà, on lit une saison scolaire, pas un
 * rythme de travail, et les vacances feraient plonger la courbe sans qu'aucune
 * conclusion utile puisse en être tirée.
 *
 * Les barres sont hautes en proportion de la MEILLEURE des quatre semaines
 * (cf. `weekTrend`), pas de l'objectif : chez un enfant qui n'atteint jamais sa
 * cible, tout rapporter à la cible écraserait les quatre barres au ras du sol —
 * et c'est justement chez lui qu'on cherche à lire une progression.
 */
export default function TendanceSemaines({
  trend,
  today,
}: {
  trend: WeekTrend
  /** Clé UTC du jour, pour nommer les semaines relativement. */
  today: string
}) {
  if (trend.points.length === 0) return null

  const Icon =
    trend.direction === 'hausse'
      ? TrendingUp
      : trend.direction === 'baisse'
        ? TrendingDown
        : Minus

  // Le corail est réservé aux alertes ; une semaine en baisse n'en est pas une
  // (c'est une information, et la vie d'un élève a des semaines creuses).
  // On garde donc l'encre douce, et seule la HAUSSE est mise en valeur.
  const tone =
    trend.direction === 'hausse' ? 'text-highlight' : 'text-muted-foreground'

  return (
    <section className="mb-5">
      <div className="mb-2.5 flex items-center justify-between gap-3">
        <h4 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          Ces 4 semaines
        </h4>
        <span className={`flex items-center gap-1 text-xs font-semibold ${tone}`}>
          <Icon className="size-3.5" strokeWidth={2.6} aria-hidden="true" />
          {trend.deltaPercent === null
            ? '—'
            : `${trend.deltaPercent > 0 ? '+' : ''}${trend.deltaPercent} %`}
        </span>
      </div>

      <div className="flex items-end gap-2">
        {trend.points.map((p, i) => {
          const last = i === trend.points.length - 1
          return (
            <div key={p.start} className="flex flex-1 flex-col items-center gap-1.5">
              {/* Cadre de hauteur fixe : sans lui, quatre semaines à zéro
                  donneraient quatre barres invisibles et un bloc affaissé. */}
              <div className="flex h-16 w-full items-end justify-center">
                <div
                  className={`w-full rounded-t-md ${
                    last ? 'bg-primary' : 'bg-primary/25'
                  }`}
                  style={{
                    // 3 % de socle : une semaine à zéro doit rester une barre
                    // qu'on voit, sinon on ne sait pas si elle est vide ou
                    // absente.
                    height: `${Math.max(3, Math.round(p.ratio * 100))}%`,
                  }}
                  title={`${weekLabel(p.start, today)} : ${formatWorkDuration(p.seconds)}`}
                />
              </div>
              <span
                className={`text-[10px] leading-none font-medium ${
                  last ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {weekLabelShort(p.start, today)}
              </span>
              <span className="text-muted-foreground/80 text-[10px] leading-none tabular-nums">
                {p.seconds > 0 ? formatWorkDuration(p.seconds) : '—'}
              </span>
            </div>
          )
        })}
      </div>

      <p className="text-muted-foreground mt-2.5 text-xs">
        {trendSentence(trend.direction)}
      </p>
    </section>
  )
}
