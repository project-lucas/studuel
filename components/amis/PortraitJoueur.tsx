import Image from 'next/image'
import { PORTRAIT_FACE_CROP, portraitDe, portraitSrc } from '@/lib/portraits'
import { cn } from '@/lib/utils'

/**
 * LE VISAGE D'UN ÉLÈVE DANS LES LISTES DE L'ONGLET AMIS.
 *
 * Le blason peint (lib/portraits), cadré sur le visage dans un rond — plus
 * d'emoji d'animal. `portrait` est le choix de l'élève (clé, '' ou absent) ;
 * à défaut, un blason fixe déduit de `id`. La taille vient de `className`.
 */
export default function PortraitJoueur({
  id,
  portrait,
  className,
}: {
  id: string
  portrait?: string
  className?: string
}) {
  const src = portraitSrc(portraitDe(portrait, id))
  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative block shrink-0 overflow-hidden rounded-full bg-primary/10',
        className,
      )}
    >
      <Image
        src={src}
        alt=""
        width={120}
        height={120}
        // L'image fait 180 % de la case (cadrage visage) : ~100 px à l'écran
        // pour la plus grande case de l'onglet.
        sizes="100px"
        className="absolute max-w-none object-contain select-none"
        style={PORTRAIT_FACE_CROP}
      />
    </span>
  )
}
