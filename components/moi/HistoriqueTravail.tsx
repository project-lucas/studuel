'use client'

import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { cheminArrondi, cheminRempli, pointsDeSerie } from '@/lib/moi/courbe'
import {
  PORTEES,
  formatDuree,
  serieTravail,
  totalSerie,
  type JourTravail,
  type Portee,
} from '@/lib/moi/temps'

// L'HISTORIQUE DE TRAVAIL — la vague, et la lunette pour la régler.
//
// Deux emprunts assumés aux maquettes du 06/08 :
//
// 1. LA VAGUE. Trait épais aux angles arrondis, halo dégradé, lignes de repère
//    en pointillés, un point au bout portant sa valeur dans une bulle. Un
//    graphique de tableur (angles vifs, axes chiffrés) dirait la même chose et
//    ne serait pas regardé.
//
// 2. LE SÉLECTEUR DE PÉRIODE. Semaine · Mois · 3 mois · Année, en segments. Il
//    ne change PAS de source : `work_daily` est lu une fois sur un an et
//    regroupé côté client (lib/moi/temps) — changer de lunette est instantané,
//    sans aller-retour serveur.
//
// Client parce qu'il y a un état (la portée choisie) ; le calcul, lui, reste
// dans les fonctions pures et testées.

const L = 320
const H = 120
const MARGE = 10

export default function HistoriqueTravail({
  jours,
  today,
  phrase,
}: {
  /** Le journal quotidien, sur un an (migration 084). */
  jours: JourTravail[]
  /** Clé de jour UTC 'YYYY-MM-DD'. */
  today: string
  /** La lecture à voix haute du rythme, calculée côté serveur. */
  phrase: string
}) {
  const [portee, setPortee] = useState<Portee>('mois')

  const { points, total, ligne, surface, bout, repere } = useMemo(() => {
    const points = serieTravail(jours, today, portee)
    const p = pointsDeSerie(
      points.map((pt) => pt.secondes),
      L,
      H,
      MARGE,
    )
    const ligne = cheminArrondi(p, 9)
    return {
      points,
      total: totalSerie(points),
      ligne,
      surface: cheminRempli(ligne, p, H),
      bout: p[p.length - 1] ?? { x: L, y: H / 2 },
      repere: points[points.length - 1] ?? null,
    }
  }, [jours, today, portee])

  // Trois repères sous la courbe : le début, le milieu, la fin. Étiqueter les
  // trente points d'un mois donnerait une bouillie illisible sur téléphone.
  const jalons = [0, Math.floor((points.length - 1) / 2), points.length - 1]

  // Le point de fin est-il dans le tiers haut du cadre ? (Voir la bulle.)
  const bulleEnDessous = bout.y < H / 3

  return (
    <section
      aria-label="Mon historique de travail"
      className="moi-card rounded-3xl bg-white p-4"
    >
      {/* Le total EST le titre. « Mon rythme » en gras au-dessus d'un chiffre
          plus petit, avec une pastille d'icône dans l'angle, c'était le gabarit
          de carte que les quatre blocs de l'écran répétaient à l'identique — et
          c'est ce qui rendait la page illisible : rien n'y dominait rien. */}
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-heading text-3xl leading-none font-extrabold whitespace-nowrap text-foreground tabular-nums">
          {formatDuree(total)}
        </p>
        <h2 className="text-xs font-extrabold tracking-wide text-muted-foreground uppercase">
          Mon rythme
        </h2>
      </div>

      {/* La courbe touche les bords de la carte : une vague qui s'arrête à
          16 px du bord est un graphique dans une boîte, pas un paysage. */}
      <div className="relative mt-4 -mr-4 -ml-4">
        <svg
          viewBox={`0 0 ${L} ${H}`}
          preserveAspectRatio="none"
          className="block h-32 w-full text-primary"
          role="img"
          aria-label={`Temps de travail par période : ${points
            .map((p) => `${p.label} ${formatDuree(p.secondes)}`)
            .join(', ')}`}
        >
          <defs>
            <linearGradient id="historique-halo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.24" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Lignes de repère en pointillés — elles situent sans chiffrer. */}
          {[0.25, 0.5, 0.75].map((r) => (
            <line
              key={r}
              x1="0"
              x2={L}
              y1={H * r}
              y2={H * r}
              stroke="currentColor"
              strokeOpacity="0.14"
              strokeDasharray="2 6"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          {/* `key={portee}` : changer de lunette REMONTE le tracé, donc le
              rejoue. C'est l'accusé de réception du sélecteur — sans lui, on
              tape sur « Année » et l'écran se contente de sauter. */}
          <path
            key={`halo-${portee}`}
            d={surface}
            fill="url(#historique-halo)"
            className="moi-trace-halo"
          />
          <path
            key={`ligne-${portee}`}
            d={ligne}
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            vectorEffect="non-scaling-stroke"
            className="moi-trace"
          />
        </svg>

        {/* Le point du bout et sa bulle, en HTML : dans un cadre étiré, un
            <circle> sortirait en ovale et le texte serait déformé. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${(bout.x / L) * 100}%`, top: `${(bout.y / H) * 100}%` }}
        >
          <span className="block size-2.5 rounded-full bg-primary ring-2 ring-white" />
        </span>
        {repere ? (
          <span
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute -translate-x-full',
              // La bulle se pose SOUS le point quand celui-ci est haut : posée
              // au-dessus, elle sortait de la carte et venait chevaucher le
              // titre dès que la dernière période était la meilleure — c'est-à-
              // dire précisément le jour où l'élève a envie de la regarder.
              bulleEnDessous ? 'translate-y-0' : '-translate-y-full',
            )}
            style={{
              left: `${(bout.x / L) * 100}%`,
              top: `${(bout.y / H) * 100}%`,
            }}
          >
            <span
              className={cn(
                'mr-2 block rounded-full bg-foreground px-2 py-0.5 font-mono text-[11px] font-extrabold whitespace-nowrap text-white tabular-nums',
                bulleEnDessous ? 'mt-1.5' : 'mb-1.5',
              )}
            >
              {formatDuree(repere.secondes)}
            </span>
          </span>
        ) : null}
      </div>

      {/* Trois jalons de date, pas trente. */}
      <div className="mt-1.5 flex justify-between">
        {jalons.map((i, rang) => (
          <span
            key={`${points[i]?.cle ?? rang}`}
            className="text-[10px] font-bold text-muted-foreground"
          >
            {points[i]?.label ?? ''}
          </span>
        ))}
      </div>

      <p className="font-heading mt-2.5 text-[15px] leading-snug font-extrabold text-balance text-foreground">
        {phrase}
      </p>

      {/* Le sélecteur de lunette. */}
      <div
        role="tablist"
        aria-label="Période de l’historique"
        className="mt-3 flex gap-1 rounded-full bg-muted p-1"
      >
        {PORTEES.map((p) => {
          const actif = p.cle === portee
          return (
            <button
              key={p.cle}
              type="button"
              role="tab"
              aria-selected={actif}
              onClick={() => {
                sfx.tap()
                setPortee(p.cle)
              }}
              className={cn(
                'flex-1 cursor-pointer rounded-full px-2 py-1.5 text-xs font-extrabold transition-colors',
                actif
                  ? 'bg-white text-foreground shadow-sm'
                  : 'text-muted-foreground',
              )}
            >
              {p.label}
            </button>
          )
        })}
      </div>
    </section>
  )
}
