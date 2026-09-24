import { cn } from '@/lib/utils'

/**
 * L'ICÔNE D'XP — un éclair d'or cerclé, façon Duolingo (Lucas, 24/09/2026 :
 * « un icône d'expérience comme Duolingo »). Là où l'app écrivait « XP » avec
 * l'étincelle ou l'éclair en trait de lucide, la ligue, le classement des amis
 * et le multiplicateur lisent le même dessin. Couleurs en jetons : l'or de la
 * progression (`--highlight`), le cerne de l'encre.
 */
export default function XpIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn('size-4 shrink-0', className)}>
      <path
        d="M13.7 1.9 4.9 13.3c-.5.6 0 1.4.7 1.4h5.1l-1.5 7.3c-.2.8.9 1.3 1.4.6l8.6-11.3c.5-.6 0-1.4-.7-1.4h-5l1.6-7.4c.2-.8-.9-1.2-1.4-.6Z"
        style={{
          fill: 'var(--highlight)',
          stroke: 'color-mix(in oklch, var(--foreground), black 35%)',
        }}
        strokeWidth={1.7}
        strokeLinejoin="round"
      />
      <path
        d="M12.6 5.6 8.4 11.2"
        style={{ stroke: 'color-mix(in oklch, var(--highlight), white 70%)' }}
        strokeWidth={1.5}
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}
