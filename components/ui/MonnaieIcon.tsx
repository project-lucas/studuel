import Image from 'next/image'
import { cn } from '@/lib/utils'

/**
 * Le cristal — la monnaie du CONTENU (un cristal = un chapitre, à vie).
 *
 * Chargé d'EMBLÉE, jamais en différé : il est partout (prix de la Boutique,
 * tas des packs de gemmes, bandeau) et une vignette de 64 px ne pèse rien. En
 * différé, un défilement rapide de la Boutique laissait des prix sans leur
 * cristal le temps d'une fraction de seconde (Lucas, 18/09/2026 : « tout le
 * contenu doit être visible, peu importe la vitesse »).
 */
export function CristalIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/images/monnaie/cristal.webp"
      alt=""
      width={64}
      height={64}
      loading="eager"
      className={cn('object-contain', className)}
      aria-hidden="true"
    />
  )
}
