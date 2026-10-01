import Image from 'next/image'
import { imageBadge } from '@/lib/illustrations'
import { cn } from '@/lib/utils'

/**
 * Le visuel d'un badge : sa médaille dessinée quand elle est livrée
 * (lib/illustrations, famille des icônes de navigation), son emoji sinon.
 * `className` porte la taille : `text-*` pour l'emoji, `size-*` pour l'image.
 */
export default function BadgeIcone({
  slug,
  icon,
  className,
  tailleImage = 'size-8',
}: {
  slug: string
  icon: string
  className?: string
  tailleImage?: string
}) {
  const src = imageBadge(slug)
  if (src) {
    return (
      <Image
        src={src}
        alt=""
        aria-hidden="true"
        width={96}
        height={96}
        className={cn('select-none object-contain', tailleImage, className)}
      />
    )
  }
  return (
    <span aria-hidden="true" className={cn('leading-none', className)}>
      {icon}
    </span>
  )
}
