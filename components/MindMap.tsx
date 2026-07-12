import { cn } from '@/lib/utils'
import type { MindMapData } from '@/lib/types'

// Carte mentale d'un chapitre (chapters.mind_map, migration 029).
// Rendu « éventail » : notion centrale en tête, branches colorées en grille —
// lisible sur mobile là où un rendu radial ne l'est pas. Composant serveur pur.

// Classes statiques (compilateur Tailwind), mêmes familles pastel que
// lib/subject-style.ts — on cycle sur 5 teintes pour distinguer les branches.
const BRANCH_STYLES = [
  {
    card: 'border-sky-300 bg-sky-50 dark:border-sky-800 dark:bg-sky-950/40',
    dot: 'bg-sky-500',
    chip: 'bg-sky-100 text-sky-950 dark:bg-sky-900/60 dark:text-sky-100',
  },
  {
    card: 'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40',
    dot: 'bg-emerald-500',
    chip: 'bg-emerald-100 text-emerald-950 dark:bg-emerald-900/60 dark:text-emerald-100',
  },
  {
    card: 'border-violet-300 bg-violet-50 dark:border-violet-800 dark:bg-violet-950/40',
    dot: 'bg-violet-500',
    chip: 'bg-violet-100 text-violet-950 dark:bg-violet-900/60 dark:text-violet-100',
  },
  {
    card: 'border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40',
    dot: 'bg-amber-500',
    chip: 'bg-amber-100 text-amber-950 dark:bg-amber-900/60 dark:text-amber-100',
  },
  {
    card: 'border-rose-300 bg-rose-50 dark:border-rose-800 dark:bg-rose-950/40',
    dot: 'bg-rose-500',
    chip: 'bg-rose-100 text-rose-950 dark:bg-rose-900/60 dark:text-rose-100',
  },
]

export default function MindMap({
  data,
  className,
}: {
  data: MindMapData
  className?: string
}) {
  return (
    <div className={cn('flex flex-col items-center', className)}>
      {/* Notion centrale */}
      <div className="bg-primary text-primary-foreground rounded-3xl px-6 py-4 text-center shadow-lg">
        <p className="font-heading text-lg font-bold text-balance md:text-xl">
          {data.centre}
        </p>
      </div>

      {/* Tronc reliant le centre aux branches */}
      <div className="bg-border h-6 w-0.5" aria-hidden="true" />

      <ul className="grid w-full gap-4 md:grid-cols-2">
        {data.branches.map((branch, i) => {
          const style = BRANCH_STYLES[i % BRANCH_STYLES.length]
          return (
            <li
              key={branch.titre}
              className={cn('rounded-2xl border-2 p-4 shadow-sm', style.card)}
            >
              <p className="flex items-center gap-2 font-heading font-bold">
                <span
                  className={cn('size-2.5 shrink-0 rounded-full', style.dot)}
                  aria-hidden="true"
                />
                {branch.titre}
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {branch.enfants.map((enfant) => (
                  <li
                    key={enfant}
                    className={cn(
                      'rounded-full px-3 py-1 text-sm font-medium',
                      style.chip,
                    )}
                  >
                    {enfant}
                  </li>
                ))}
              </ul>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
