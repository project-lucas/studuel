import type { ReactNode } from 'react'
import type { Capsule } from '@/lib/capsules'
import { cn } from '@/lib/utils'

const TAILLES = {
  vignette: 'size-14 rounded-2xl',
  carte: 'h-32 w-full',
  affiche: 'h-40 w-full rounded-3xl',
} as const

const EMOJIS = {
  vignette: 'text-3xl',
  carte: 'text-6xl',
  affiche: 'text-7xl',
} as const

/**
 * La couverture d'une capsule : sa teinte d'emballage (`.capsule-teinte-*`,
 * globals.css) et son emoji en grand. Une seule façon de la dessiner, de la
 * vignette du carnet à l'affiche de la fiche produit.
 */
export default function CouvertureCapsule({
  capsule,
  taille = 'carte',
  className,
  children,
}: {
  capsule: Pick<Capsule, 'emoji' | 'teinte'>
  taille?: keyof typeof TAILLES
  className?: string
  /** Rubans posés sur la couverture (prix, durée, « Nouveau »). */
  children?: ReactNode
}) {
  return (
    <div
      className={cn(
        'capsule-couverture relative flex shrink-0 items-center justify-center overflow-hidden',
        `capsule-teinte-${capsule.teinte}`,
        TAILLES[taille],
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/25 to-transparent"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -bottom-10 size-28 rounded-full bg-white/10"
      />
      <span
        aria-hidden="true"
        className={cn('relative drop-shadow-[0_3px_5px_rgba(0,0,0,0.3)]', EMOJIS[taille])}
      >
        {capsule.emoji}
      </span>
      {children}
    </div>
  )
}
