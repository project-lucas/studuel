import { Check, Timer, Trophy } from 'lucide-react'
import { CristalIcon } from '@/components/ui/MonnaieIcon'
import { cn } from '@/lib/utils'
import { formatDuration, type PalierLevel, type StarCount } from '@/lib/jeux/paliers'
import { formatAccuracy, pistePalier } from '@/lib/jeux/piste-palier'

/**
 * LA PISTE D'UN PALIER — une ligne, trois jalons de gemmes, un curseur.
 *
 * Elle remplace deux lignes de la carte : les jetons « Gains +3 +3 +3 » et la
 * ligne « Record 6000 ». Les jalons sont les trois étoiles (une par tiers de
 * piste, au tarif du palier), cochés en jaune quand l'étoile est gagnée ; le
 * curseur se place au meilleur taux de réussite (l'axe des étoiles), et porte
 * l'étiquette du record : le score, le taux, et le chrono de bouclage quand il
 * veut dire quelque chose. Voir lib/jeux/piste-palier pour la géométrie.
 *
 * Un palier fermé montre sa piste en retrait : on voit ce qui attend là-haut.
 */
export default function PistePalier({
  level,
  stars,
  acquises,
  accuracy,
  best,
  timeMs,
  speed,
  unlocked,
}: {
  level: PalierLevel
  stars: StarCount
  /** Étoiles à créditer sur les jalons (locales ou déjà payées). */
  acquises: number
  /** Meilleur taux de réussite mémorisé, ou null. */
  accuracy: number | null
  best: number
  /** Meilleur chrono de bouclage, ou null (non gagné, ou format sans chrono). */
  timeMs: number | null
  /** « Top 5 % des joueurs », ou null. */
  speed: string | null
  unlocked: boolean
}) {
  const piste = pistePalier({ level, stars, acquises, accuracy })
  const parEtoile = piste.jalons[0].gemmes
  const joue = piste.accuracy !== null
  const [s1, s2, s3] = piste.jalons.map((j) => formatAccuracy(j.seuil))
  const seuils = `étoiles à ${s1}, ${s2} et ${s3} de bonnes réponses`
  const libelle = joue
    ? `Record ${best}, ${formatAccuracy(piste.accuracy as number)} de réussite. ${acquises} étoile${acquises > 1 ? 's' : ''} sur 3, ${parEtoile} gemme${parEtoile > 1 ? 's' : ''} par étoile, ${seuils}.`
    : `${parEtoile} gemme${parEtoile > 1 ? 's' : ''} par étoile, ${seuils}.`

  return (
    <span className="mt-2.5 block" role="img" aria-label={libelle}>
      {/* De haut en bas, dans une seule boîte de 56 px : les jetons de gemmes,
          la ligne et ses crans, puis SOUS chaque cran le taux de réussite qui
          l'ouvre (Lucas, 24/09/2026 : « supprime le texte en dessous, mets le
          pourcentage sous les checkpoints » — la phrase « 1 gemme par étoile —
          60 %, 80 % et 95 % » prenait deux lignes pour dire ce que les crans
          disent seuls). Les taux viennent de STAR_ACCURACY : jamais écrits à
          la main, ils ne peuvent pas mentir sur la règle. Un peu de marge à
          droite pour que le dernier jeton et le dernier taux ne débordent pas. */}
      <span aria-hidden="true" className="relative mr-4 ml-1 block h-14">
        {piste.jalons.map((j) => (
          <span
            key={j.rang}
            className={cn(
              'absolute top-0 flex -translate-x-1/2 items-center gap-0.5 rounded-full py-0.5 pr-1.5 pl-0.5 text-[11px] font-extrabold tabular-nums',
              j.gagne
                ? 'bg-highlight/25 text-foreground ring-1 ring-highlight/70'
                : unlocked
                  ? 'bg-black/[0.05] text-foreground/75'
                  : 'bg-muted text-foreground/40',
            )}
            style={{ left: `${j.at * 100}%` }}
          >
            <CristalIcon className={cn('size-4', !unlocked && 'opacity-60 grayscale')} />+{j.gemmes}
            {j.gagne ? (
              <Check
                className="absolute -top-1 -right-1 size-3 rounded-full bg-success p-px text-white"
                strokeWidth={4}
              />
            ) : null}
          </span>
        ))}

        {/* La ligne, son remplissage dans la robe du jeu, et les trois crans. */}
        <span
          className={cn(
            'absolute top-7 right-0 left-0 block h-2 overflow-hidden rounded-full',
            unlocked ? 'bg-black/[0.07]' : 'bg-muted',
          )}
        >
          <span
            className={cn(
              'block h-full rounded-full transition-[width] duration-500 ease-out',
              unlocked ? 'bg-[color:var(--jeu-accent)]' : 'bg-foreground/20',
            )}
            style={{ width: `${piste.fill * 100}%` }}
          />
        </span>
        {piste.jalons.map((j) => (
          <span
            key={j.rang}
            className={cn(
              'absolute top-6 block size-4 -translate-x-1/2 rounded-full ring-2 ring-card',
              j.gagne ? 'bg-highlight' : unlocked ? 'bg-black/[0.12]' : 'bg-muted',
            )}
            style={{ left: `${j.at * 100}%` }}
          />
        ))}
        {piste.jalons.map((j) => (
          <span
            key={j.rang}
            className={cn(
              'absolute top-11 -translate-x-1/2 text-[10px] leading-none font-extrabold whitespace-nowrap tabular-nums',
              j.gagne ? 'text-foreground' : unlocked ? 'text-muted-foreground' : 'text-foreground/35',
            )}
            style={{ left: `${j.at * 100}%` }}
          >
            {formatAccuracy(j.seuil)}
          </span>
        ))}

        {/* Le curseur : le trophée, posé au meilleur taux de réussite. */}
        {joue ? (
          <span
            className="absolute top-5 grid size-6 -translate-x-1/2 place-items-center rounded-full bg-card text-foreground shadow-md ring-2 ring-[color:var(--jeu-accent)]"
            style={{ left: `${piste.fill * 100}%` }}
          >
            <Trophy className="size-3.5" strokeWidth={2.6} />
          </span>
        ) : null}
      </span>

      {/* Le record, une fois le palier joué : le score, le taux, le chrono. Rien
          avant — les taux sous les crans disent déjà ce qu'il faut viser. */}
      {joue ? (
        <span
          aria-hidden="true"
          className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold text-muted-foreground"
        >
          <span className="flex items-center gap-1.5 tabular-nums">
            <Trophy className="size-3.5" />
            Record {best}
            <span className="text-foreground/45">·</span>
            {formatAccuracy(piste.accuracy as number)}
          </span>
          {timeMs !== null ? (
            <span className="flex items-center gap-1.5 tabular-nums">
              <Timer className="size-3.5" />
              {formatDuration(timeMs)}
            </span>
          ) : null}
          {timeMs !== null && speed ? <span className="text-primary">{speed}</span> : null}
        </span>
      ) : null}
    </span>
  )
}
