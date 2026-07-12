import Image from 'next/image'
import { cn } from '@/lib/utils'
import { stageForStreak } from '@/lib/compagnon'

// La mascotte flamme porte la série partout où elle s'affiche (Moi, Réviser,
// Défi) : c'est le compagnon, à son stade d'évolution du moment, qui rend la
// série vivante — bien plus distrayant qu'un pictogramme. Série à zéro =
// la Braise endormie ; elle grandit avec la régularité.
export default function StreakMascot({
  streak,
  size = 40,
  badge = true,
  className,
}: {
  streak: number
  // Côté du carré en px (les visuels de la mascotte sont transparents).
  size?: number
  // Pastille compteur ambrée accrochée à la mascotte. Sans pastille, la
  // mascotte est purement décorative (le chiffre est affiché à côté).
  badge?: boolean
  className?: string
}) {
  const stage = stageForStreak(streak)

  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center',
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden={badge ? undefined : true}
      aria-label={
        badge ? `Série : ${streak} jour${streak > 1 ? 's' : ''}` : undefined
      }
    >
      <Image
        src={stage.image}
        alt=""
        aria-hidden="true"
        width={size}
        height={size}
        className={cn(
          'size-full object-contain',
          streak > 0 ? 'flame-breathe' : 'opacity-90',
        )}
      />
      {badge ? (
        <span
          aria-hidden="true"
          className="absolute -right-1.5 -bottom-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-600 px-1 font-mono text-[10px] leading-none font-extrabold text-white shadow-sm ring-2 ring-white"
        >
          {streak}
        </span>
      ) : null}
    </span>
  )
}
