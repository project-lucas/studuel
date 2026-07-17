import type { ReactNode } from 'react'

// Langage visuel « objet sculpté Olympe » factorisé : trois plaques forgées
// (or ciselé, gemme violette, marbre) + la pastille de notification et le jeton
// d'aperçu. Les effets vivent dans globals.css (.olympe-*) ; ces composants ne
// font qu'assembler la classe et les enfants, pour resservir sur d'autres
// écrans sans dupliquer les recettes.

interface PlateProps {
  children: ReactNode
  /** Classes utilitaires de mise en page (padding, layout, radius…). */
  className?: string
}

/** Plaque « or ciselé » — l'action la plus proéminente (ex. Match classé). */
export function GoldPlate({ children, className = '' }: PlateProps) {
  return <div className={`olympe-gold ${className}`}>{children}</div>
}

/** Plaque « gemme violette » — actions secondaires marquées (Duel, Modes). */
export function GemPlate({ children, className = '' }: PlateProps) {
  return <div className={`olympe-gem ${className}`}>{children}</div>
}

/** Carte « marbre » — surfaces d'information calmes (cartouche, pilule). */
export function MarbleCard({ children, className = '' }: PlateProps) {
  return <div className={`olympe-marble ${className}`}>{children}</div>
}

interface BadgeProps {
  /** Contenu de la pastille : un compteur ou un signe (« ! »). */
  children: ReactNode
  className?: string
}

/**
 * Pastille de notification corail à liseré or + contour encre, posée en haut à
 * droite d'un élément (le parent doit être `relative`).
 */
export function NotificationBadge({ children, className = '' }: BadgeProps) {
  return (
    <span
      className={`olympe-badge grid h-5 min-w-5 place-items-center rounded-full px-1 font-heading text-[0.6rem] leading-none font-extrabold ${className}`}
    >
      {children}
    </span>
  )
}
