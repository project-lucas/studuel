import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MAX_STARS, type StarCount } from '@/lib/jeux/paliers'

/**
 * Les trois étoiles d'un palier. Partagées par la carte du jeu et l'écran de
 * fin de partie : c'est la MÊME rangée qu'on remplit, et il faut qu'elle se
 * reconnaisse d'un écran à l'autre — sans quoi l'élève ne fait pas le lien
 * entre ce qu'il vient de gagner et ce qui ouvre la suite.
 *
 * L'étoile pleine est en `highlight` (le jaune de la récompense, comme l'XP) ;
 * l'étoile manquante garde son contour, jamais un trou : on montre ce qu'il
 * reste à décrocher, pas ce qui a été raté.
 */
export default function PalierStars({
  stars,
  size = 'md',
  className,
}: {
  stars: StarCount
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const box = size === 'lg' ? 'size-8' : size === 'sm' ? 'size-4' : 'size-5'
  return (
    <span
      className={cn('inline-flex items-center gap-0.5', className)}
      role="img"
      aria-label={`${stars} étoile${stars > 1 ? 's' : ''} sur ${MAX_STARS}`}
    >
      {Array.from({ length: MAX_STARS }, (_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          strokeWidth={2.2}
          className={cn(
            box,
            'transition-colors duration-200',
            i < stars
              ? 'fill-highlight text-highlight drop-shadow-[0_1px_2px_rgba(0,0,0,0.12)]'
              : 'fill-transparent text-foreground/25',
          )}
        />
      ))}
    </span>
  )
}
