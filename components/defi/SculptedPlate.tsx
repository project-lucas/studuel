import type { ReactNode } from 'react'

interface BadgeProps {
  /** Contenu de la pastille : un compteur ou un signe (« ! »). */
  children: ReactNode
  /**
   * `alert` (corail) : action à réclamer MAINTENANT (coffre prêt, récompense).
   * `neutral` (violet) : information en cours, rien à encaisser.
   */
  tone?: 'alert' | 'neutral'
  className?: string
}

/**
 * Pastille de notification à liseré or + contour encre, posée en haut à
 * droite d'un élément (le parent doit être `relative`). Le corail est réservé
 * au « à réclamer maintenant » ; tout compteur d'avancement passe en neutre.
 *
 * Sur les plaques de bord de l'arène, passer `arena-pastille` dans
 * `className` : 22 px et un contour blanc, à cheval sur l'angle — le compteur
 * de Clash Royale, lisible sur un objet sombre.
 */
export function NotificationBadge({
  children,
  tone = 'alert',
  className = '',
}: BadgeProps) {
  const toneClass = tone === 'alert' ? 'olympe-badge' : 'olympe-badge--neutral'
  return (
    <span
      className={`${toneClass} grid h-5 min-w-5 place-items-center rounded-full px-1 font-heading text-[0.6rem] leading-none font-extrabold [&.arena-pastille]:h-[22px] [&.arena-pastille]:min-w-[22px] [&.arena-pastille]:text-[0.7rem] [&.arena-pastille]:ring-2 [&.arena-pastille]:ring-white ${className}`}
    >
      {children}
    </span>
  )
}
