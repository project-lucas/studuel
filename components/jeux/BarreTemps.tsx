import { Fragment } from 'react'
import { Timer } from 'lucide-react'
import XpIcon from '@/components/ui/XpIcon'
import { formatDuration } from '@/lib/jeux/paliers'
import type { PalierTimeStanding } from '@/lib/jeux/palier-standing'
import { barreTemps, phrasePlace } from '@/lib/jeux/palier-temps'
import { cn } from '@/lib/utils'
import styles from './BarreTemps.module.css'

/**
 * LA BARRE DE RAPIDITÉ D'UN PALIER (26/10/2026, Lucas : « rappeler le précédent
 * record de temps sur ce palier et une barre horizontale qui irait d'un côté à
 * l'autre et montrerait où il se situe sur l'ensemble des users ; curseur animé
 * vers le top 1 % ; chaque palier atteint serait du gain d'XP ; ne montre pas
 * tous les paliers »).
 *
 * Une ligne au-dessus : le record (⏱ 1 min 24 s) et la phrase du classement
 * (« Top 15 % des joueurs » = le cap le plus serré franchi, « 3e sur 12 joueurs »
 * sous cent joueurs — ou « Pas encore classé »).
 * La barre : trois crans seulement (top 50 %, 15 %, 1 % — la géométrie est
 * dans lib/jeux/palier-temps, échelle log), en or quand le cap est pris ; le
 * curseur glisse de la gauche jusqu'à sa place à l'arrivée, puis POUSSE vers
 * la droite, doucement, sans fin — la direction à prendre. Dessous : « Prochain
 * cap : top 5 % · +25 XP ». Transform et opacité seulement (BarreTemps.module.css).
 *
 * Posée par PalierRow (components/jeux/PalierMap) sous la piste des étoiles,
 * sur les formats qui ont un chrono (`hasTimeRecord`), une fois le palier gagné.
 */
export default function BarreTemps({
  timeMs,
  standing,
}: {
  /** Mon meilleur temps de bouclage (serveur ou local), en millisecondes. */
  timeMs: number
  /** Ma place et les caps payés (603), ou null : classé nulle part. */
  standing: PalierTimeStanding | null
}) {
  const etat = barreTemps(standing)
  const phrase = phrasePlace(standing)
  const libelle = `Record ${formatDuration(timeMs)}${phrase ? `, ${phrase.toLowerCase()}` : ', pas encore classé'}. ${
    etat.prochain
      ? `Prochain cap : top ${etat.prochain.pct} % des joueurs, ${etat.prochain.xp} XP.`
      : 'Top 1 % atteint : tous les caps sont pris.'
  }`

  return (
    <span className="mt-2.5 block rounded-2xl bg-black/[0.04] px-3 pt-2 pb-2.5" role="img" aria-label={libelle}>
      <span aria-hidden="true" className="flex items-center justify-between gap-2 text-xs font-bold">
        <span className="flex items-center gap-1.5 text-foreground tabular-nums">
          <Timer className="size-3.5" strokeWidth={2.6} />
          Record {formatDuration(timeMs)}
        </span>
        {phrase ? (
          <span className="truncate text-primary">{phrase}</span>
        ) : (
          <span className="text-muted-foreground">Pas encore classé</span>
        )}
      </span>

      <span aria-hidden="true" className="relative mt-2 block h-9">
        {/* La piste, et son remplissage dans la robe du jeu (scaleX, jamais width). */}
        <span className="absolute top-1 right-0 left-0 block h-2.5 overflow-hidden rounded-full bg-black/[0.08]">
          {etat.position !== null ? (
            <span
              className={cn(styles.remplissage, 'block h-full w-full rounded-full bg-[color:var(--jeu-accent)]')}
              style={{ transform: `scaleX(${etat.position})` }}
            />
          ) : null}
        </span>

        {/* Les trois crans, et leur étiquette dessous. Le dernier est calé à droite. */}
        {etat.crans.map((c) => (
          <Fragment key={c.pct}>
            <span
              className={cn(
                'absolute top-0.5 block size-3.5 -translate-x-1/2 rounded-full ring-2 ring-card',
                c.atteint ? 'bg-highlight' : 'bg-black/[0.14]',
              )}
              style={{ left: `${c.at * 100}%` }}
            />
            <span
              className={cn(
                'absolute top-5 text-[10px] leading-none font-extrabold whitespace-nowrap',
                c.at > 0.9 ? '-translate-x-full' : c.at < 0.1 ? '' : '-translate-x-1/2',
                c.atteint ? 'text-foreground' : 'text-muted-foreground',
              )}
              style={{ left: `${c.at * 100}%` }}
            >
              Top {c.pct} %
            </span>
          </Fragment>
        ))}

        {/* Le curseur, sur un rail de la largeur de la piste : le rail glisse
            de la gauche à sa place (translateX en % de sa propre largeur), le
            curseur pousse ensuite vers la droite. */}
        {etat.position !== null ? (
          <span
            className={cn(styles.rail, 'absolute inset-x-0 top-0 block h-4')}
            style={{ transform: `translateX(${etat.position * 100}%)` }}
          >
            <span className="absolute top-0 left-0 block -translate-x-1/2">
              <span
                className={cn(
                  styles.curseur,
                  'grid size-4 place-items-center rounded-full bg-card shadow-md ring-2 ring-[color:var(--jeu-accent)]',
                )}
              >
                <span className="block size-1.5 rounded-full bg-[color:var(--jeu-accent)]" />
              </span>
            </span>
          </span>
        ) : null}
      </span>

      <span aria-hidden="true" className="mt-1 flex items-center gap-1 text-[11px] font-bold text-muted-foreground">
        {etat.prochain ? (
          <>
            Prochain cap : <span className="text-foreground">top {etat.prochain.pct} %</span>
            <span className="text-foreground/45">·</span>
            <XpIcon className="size-4" />
            <span className="text-foreground tabular-nums">+{etat.prochain.xp} XP</span>
          </>
        ) : (
          <>
            <span className="text-foreground">Top 1 % atteint</span>
            <span className="text-foreground/45">·</span>
            tous les caps sont pris
          </>
        )}
      </span>
    </span>
  )
}
