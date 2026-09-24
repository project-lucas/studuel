import type { ReactNode } from 'react'
import EnTetePage from '@/components/reviser/EnTetePage'
import WorkTimer from '@/components/WorkTimer'

/**
 * Le gabarit des pages d'exercice d'un chapitre : l'en-tête commun de Réviser
 * (`EnTetePage`), puis le contenu posé directement sur le mur crème de l'app.
 * Plus de bandeau aux couleurs de la matière ni de feuille opaque qui le
 * recouvrait (audit du 23/09/2026). Le compteur de révision tourne : résoudre
 * un exercice est du travail.
 */
export default function PageChapitre({
  sousTitre,
  titre,
  retour,
  compact = false,
  children,
}: {
  /** La matière, ou « matière · chapitre » quand le titre ne dit pas le chapitre. */
  sousTitre: string
  titre: string
  retour: string
  /** Espacement réduit sous l'en-tête (le joueur a sa propre barre). */
  compact?: boolean
  children: ReactNode
}) {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <WorkTimer />
      <EnTetePage retour={{ fallback: retour }} titre={titre} sousTitre={sousTitre} />
      <div className={compact ? 'mt-4' : 'mt-6'}>{children}</div>
    </div>
  )
}
