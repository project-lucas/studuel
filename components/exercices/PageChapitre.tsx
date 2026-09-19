import type { ReactNode } from 'react'
import BackButton from '@/components/BackButton'
import WorkTimer from '@/components/WorkTimer'
import { cn } from '@/lib/utils'
import { GRID_PATTERN, subjectTheme } from '@/lib/subject-style'

/**
 * Le gabarit des pages d'exercice d'un chapitre : l'en-tête aux couleurs de la
 * matière (celui de l'écran de chapitre), puis la feuille crème qui remonte
 * dessus. Le compteur de révision tourne : résoudre un exercice est du travail.
 */
export default function PageChapitre({
  couleur,
  surtitre,
  titre,
  retour,
  compact = false,
  children,
}: {
  couleur: string
  surtitre: string
  titre: string
  retour: string
  /** En-tête réduit (le joueur a sa propre barre). */
  compact?: boolean
  children: ReactNode
}) {
  const theme = subjectTheme(couleur)
  return (
    <div className="-mx-4 -mt-16 md:-mx-8 md:-mt-10">
      <WorkTimer />
      <header className={cn('relative overflow-hidden px-4 md:px-8', compact ? 'pt-16 pb-9 md:pt-10' : 'pt-20 pb-10 md:pt-12', theme.header)}>
        <div className="pointer-events-none absolute inset-0 opacity-[0.08]" style={GRID_PATTERN} aria-hidden="true" />
        <div className="relative mx-auto w-full max-w-2xl">
          <BackButton fallback={retour} />
          <p className={cn('text-center text-sm font-semibold opacity-70', compact ? 'mt-1' : 'mt-4')}>{surtitre}</p>
          <h1 className={cn('font-heading mt-0.5 text-center font-bold text-balance', compact ? 'text-xl' : 'text-2xl md:text-3xl')}>{titre}</h1>
        </div>
      </header>
      <div className="relative -mt-6 rounded-t-3xl bg-background">
        <div className="mx-auto w-full max-w-2xl px-4 pt-6 pb-24 md:px-8">{children}</div>
      </div>
    </div>
  )
}
