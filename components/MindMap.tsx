import { cn } from '@/lib/utils'
import type { MindMapData } from '@/lib/types'

// Carte mentale d'un chapitre (chapters.mind_map, migration 029) ET aperçu de
// l'éditeur de la bibliothèque. Rendu « vraie carte mentale » : la notion
// centrale au milieu, les branches qui rayonnent de part et d'autre (moitié à
// gauche, moitié à droite), reliées au cœur par des rameaux colorés — au lieu
// d'une pile verticale de blocs. Composant serveur pur. Sur mobile, le canevas
// défile horizontalement (une carte mentale est intrinsèquement en 2D).

// Classes statiques (compilateur Tailwind), mêmes familles pastel que
// lib/subject-style.ts — on cycle sur 5 teintes pour distinguer les branches.
const BRANCH_STYLES = [
  {
    card: 'border-sky-300 bg-sky-50 dark:border-sky-800 dark:bg-sky-950/40',
    dot: 'bg-sky-500',
    twig: 'bg-sky-400',
    chip: 'bg-sky-100 text-sky-950 dark:bg-sky-900/60 dark:text-sky-100',
  },
  {
    card: 'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40',
    dot: 'bg-emerald-500',
    twig: 'bg-emerald-400',
    chip: 'bg-emerald-100 text-emerald-950 dark:bg-emerald-900/60 dark:text-emerald-100',
  },
  {
    card: 'border-violet-300 bg-violet-50 dark:border-violet-800 dark:bg-violet-950/40',
    dot: 'bg-violet-500',
    twig: 'bg-violet-400',
    chip: 'bg-violet-100 text-violet-950 dark:bg-violet-900/60 dark:text-violet-100',
  },
  {
    card: 'border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40',
    dot: 'bg-amber-500',
    twig: 'bg-amber-400',
    chip: 'bg-amber-100 text-amber-950 dark:bg-amber-900/60 dark:text-amber-100',
  },
  {
    card: 'border-rose-300 bg-rose-50 dark:border-rose-800 dark:bg-rose-950/40',
    dot: 'bg-rose-500',
    twig: 'bg-rose-400',
    chip: 'bg-rose-100 text-rose-950 dark:bg-rose-900/60 dark:text-rose-100',
  },
]

type Branch = MindMapData['branches'][number]

// Une branche = une carte colorée reliée au cœur par un rameau horizontal.
// `side` place la carte à gauche ou à droite du tronc central.
function BranchCard({
  branch,
  index,
  side,
}: {
  branch: Branch
  index: number
  side: 'left' | 'right'
}) {
  const style = BRANCH_STYLES[index % BRANCH_STYLES.length]
  const twig = (
    <span
      aria-hidden="true"
      className={cn('h-1 w-6 shrink-0 rounded-full sm:w-10', style.twig)}
    />
  )
  return (
    <li
      className={cn(
        'flex items-center',
        side === 'left' ? 'flex-row' : 'flex-row-reverse',
      )}
    >
      <div
        className={cn(
          'w-52 rounded-2xl border-2 p-3 shadow-sm sm:w-60',
          style.card,
        )}
      >
        <p
          className={cn(
            'font-heading flex items-center gap-2 font-bold',
            side === 'left' && 'flex-row-reverse text-right',
          )}
        >
          <span
            className={cn('size-2.5 shrink-0 rounded-full', style.dot)}
            aria-hidden="true"
          />
          {branch.titre}
        </p>
        {branch.enfants.length > 0 ? (
          <ul
            className={cn(
              'mt-2 flex flex-wrap gap-1.5',
              side === 'left' && 'justify-end',
            )}
          >
            {branch.enfants.map((enfant) => (
              <li
                key={enfant}
                className={cn(
                  'rounded-full px-2.5 py-1 text-xs font-medium',
                  style.chip,
                )}
              >
                {enfant}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      {twig}
    </li>
  )
}

export default function MindMap({
  data,
  className,
}: {
  data: MindMapData
  className?: string
}) {
  const branches = data.branches
  // Répartition équilibrée autour du tronc : les branches de rang pair partent
  // à droite, celles de rang impair à gauche — dans l'ordre, de haut en bas.
  const right = branches.filter((_, i) => i % 2 === 0)
  const left = branches.filter((_, i) => i % 2 === 1)
  // Retrouve le rang d'origine d'une branche (pour garder sa couleur stable).
  const rankOf = (b: Branch) => branches.indexOf(b)

  return (
    <div className={cn('overflow-x-auto overscroll-x-contain', className)}>
      <div className="flex min-w-max items-stretch justify-center gap-0 px-1 py-2">
        {/* Colonne gauche : branches alignées vers le tronc. */}
        <ul className="flex flex-col justify-center gap-3">
          {left.map((branch) => (
            <BranchCard
              key={branch.titre}
              branch={branch}
              index={rankOf(branch)}
              side="left"
            />
          ))}
        </ul>

        {/* Le cœur : notion centrale, avec un tronc vertical qui relie les
            branches des deux côtés. */}
        <div className="relative flex flex-col items-center justify-center px-1">
          <span
            aria-hidden="true"
            className="absolute inset-y-6 w-1 rounded-full bg-primary/20"
          />
          <div className="bg-primary text-primary-foreground relative z-10 max-w-[13rem] rounded-3xl px-6 py-4 text-center shadow-lg">
            <p className="font-heading text-lg font-bold text-balance md:text-xl">
              {data.centre}
            </p>
          </div>
        </div>

        {/* Colonne droite. */}
        <ul className="flex flex-col justify-center gap-3">
          {right.map((branch) => (
            <BranchCard
              key={branch.titre}
              branch={branch}
              index={rankOf(branch)}
              side="right"
            />
          ))}
        </ul>
      </div>
    </div>
  )
}
