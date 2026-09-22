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
  const libelle = joue
    ? `Record ${best}, ${formatAccuracy(piste.accuracy as number)} de réussite. ${acquises} étoile${acquises > 1 ? 's' : ''} sur 3, ${parEtoile} gemme${parEtoile > 1 ? 's' : ''} par étoile.`
    : `${parEtoile} gemme${parEtoile > 1 ? 's' : ''} par étoile, trois étoiles à décrocher.`

  return (
    <span className="mt-2.5 block" role="img" aria-label={libelle}>
      {/* Les jetons, au-dessus de la ligne, chacun à son tiers. Un peu de marge
          à droite pour que le dernier ne déborde pas de la carte. */}
      <span aria-hidden="true" className="relative mr-4 ml-1 block h-11">
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
            'absolute right-0 bottom-3 left-0 block h-2 overflow-hidden rounded-full',
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
              'absolute bottom-2 block size-4 -translate-x-1/2 rounded-full ring-2 ring-card',
              j.gagne ? 'bg-highlight' : unlocked ? 'bg-black/[0.12]' : 'bg-muted',
            )}
            style={{ left: `${j.at * 100}%` }}
          />
        ))}

        {/* Le curseur : le trophée, posé au meilleur taux de réussite. */}
        {joue ? (
          <span
            className="absolute bottom-[3px] grid size-6 -translate-x-1/2 place-items-center rounded-full bg-card text-foreground shadow-md ring-2 ring-[color:var(--jeu-accent)]"
            style={{ left: `${piste.fill * 100}%` }}
          >
            <Trophy className="size-3.5" strokeWidth={2.6} />
          </span>
        ) : null}
      </span>

      {/* L'étiquette du curseur : le record en chiffres, et le chrono. */}
      <span
        aria-hidden="true"
        className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold text-muted-foreground"
      >
        {joue ? (
          <span className="flex items-center gap-1.5 tabular-nums">
            <Trophy className="size-3.5" />
            Record {best}
            <span className="text-foreground/45">·</span>
            {formatAccuracy(piste.accuracy as number)}
            {piste.prochainSeuil !== null ? (
              <span className="text-foreground/45">
                · prochain jalon à {formatAccuracy(piste.prochainSeuil)}
              </span>
            ) : null}
          </span>
        ) : (
          <span>
            {unlocked
              ? `${parEtoile} gemme${parEtoile > 1 ? 's' : ''} par étoile — 60 %, 80 % et 95 % de bonnes réponses`
              : `${parEtoile} gemme${parEtoile > 1 ? 's' : ''} par étoile`}
          </span>
        )}
        {timeMs !== null ? (
          <span className="flex items-center gap-1.5 tabular-nums">
            <Timer className="size-3.5" />
            {formatDuration(timeMs)}
          </span>
        ) : null}
        {timeMs !== null && speed ? <span className="text-primary">{speed}</span> : null}
      </span>
    </span>
  )
}
