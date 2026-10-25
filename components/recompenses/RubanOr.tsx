import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import s from './RubanOr.module.css'

/**
 * LE RUBAN D'OR — le titre d'une fête (25/10/2026, cadrage « le jeu vivant »).
 *
 * Une bande d'or aux bouts repliés, le titre en Baloo 2 à l'encre prune (la
 * même encre que la pilule DUEL de l'arène : l'or reste la couleur du gain,
 * l'encre dit le texte). Un reflet la balaie en continu et, si on le demande,
 * elle ONDULE — transform seulement, valeurs littérales, figée sous
 * « mouvement réduit ».
 *
 * Partagé par le ruban de récompenses (« Récompenses »), la fête de niveau
 * (« Niveau 7 ! ») et l'écrin d'une fiche qui vient de s'ouvrir.
 */
export default function RubanOr({
  children,
  ondule = false,
  taille = 'grand',
  className,
}: {
  children: ReactNode
  /** Ondule en continu (le ruban plein écran) ; sinon il se pose et reste. */
  ondule?: boolean
  taille?: 'grand' | 'moyen'
  className?: string
}) {
  return (
    <span className={cn(s.cadre, className)} data-ondule={ondule ? '' : undefined} data-taille={taille}>
      <span className={cn(s.queue, s.queueGauche)} aria-hidden="true" />
      <span className={cn(s.queue, s.queueDroite)} aria-hidden="true" />
      <span className={s.bande}>
        <span className={s.eclat} aria-hidden="true">
          <i />
        </span>
        <span className={s.texte}>{children}</span>
      </span>
    </span>
  )
}
