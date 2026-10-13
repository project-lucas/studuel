import type { Statut } from '@/lib/coach/statut'
import { cn } from '@/lib/utils'

export const LIBELLE_STATUT: Record<Statut, string> = {
  rouge: 'Décroché',
  orange: 'En baisse',
  vert: 'Régulier',
  nouveau: 'Nouveau',
}

// Le feu tricolore : autorisé sur un écran de BILAN (décision (b) du 23/09/2026),
// et c'en est un. `nouveau` est neutre : on ne juge pas une semaine incomplète.
const ROBE: Record<Statut, string> = {
  rouge: 'bg-(--destructive)',
  orange: 'bg-(--warning)',
  vert: 'bg-(--success)',
  nouveau: 'bg-(--muted-foreground)',
}

export default function PastilleStatut({
  statut,
  texte = false,
  className,
}: {
  statut: Statut
  /** Avec le mot (« Décroché ») à côté du point. */
  texte?: boolean
  className?: string
}) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs font-extrabold', className)}>
      <span
        className={cn('inline-block size-2.5 shrink-0 rounded-full', ROBE[statut])}
        aria-hidden="true"
      />
      <span className={texte ? undefined : 'sr-only'}>{LIBELLE_STATUT[statut]}</span>
    </span>
  )
}
