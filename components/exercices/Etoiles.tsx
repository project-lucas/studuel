import { Star } from 'lucide-react'
import { libelleEtoiles } from '@/lib/exercices/progression'
import type { Etoiles as NombreEtoiles } from '@/lib/exercices/types'
import { cn } from '@/lib/utils'
import s from './manuel.module.css'

/** Les étoiles d'un exercice : sa DIFFICULTÉ, pas une note. */
export function Etoiles({ n, className }: { n: NombreEtoiles; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-0.5', className)} role="img" aria-label={libelleEtoiles(n)}>
      {[1, 2, 3].map((k) => (
        <Star key={k} className={cn('size-4', k <= n ? s.etoile : s.etoileVide)} fill="currentColor" strokeWidth={0} aria-hidden="true" />
      ))}
    </span>
  )
}
