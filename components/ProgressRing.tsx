import { cn } from '@/lib/utils'

// Anneau d'avancement d'une leçon (template « structure des cours ») :
// un cercle qui se remplit à mesure que l'élève consulte les supports
// (cours, fiche, studygram) et améliore son score au quiz. Composant
// serveur-compatible, taille libre, contenu optionnel au centre.
export default function ProgressRing({
  value,
  size = 44,
  strokeWidth = 4,
  className,
  trackClassName = 'stroke-muted-foreground/25',
  fillClassName = 'stroke-highlight',
  label,
  children,
}: {
  value: number // 0..1
  size?: number
  strokeWidth?: number
  className?: string
  trackClassName?: string
  fillClassName?: string
  label?: string
  children?: React.ReactNode
}) {
  const pct = Math.max(0, Math.min(value, 1))
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  return (
    <span
      className={cn('relative inline-flex shrink-0 items-center justify-center', className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={label ?? `Avancement : ${Math.round(pct * 100)} %`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className={trackClassName}
        />
        {pct > 0 ? (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - pct)}
            className={cn('transition-[stroke-dashoffset] duration-500', fillClassName)}
          />
        ) : null}
      </svg>
      {children ? (
        <span className="absolute inset-0 flex items-center justify-center">
          {children}
        </span>
      ) : null}
    </span>
  )
}
