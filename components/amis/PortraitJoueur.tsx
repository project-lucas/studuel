import Image from 'next/image'
import type { AvatarAffiche } from '@/lib/avatar-affiche'
import { PORTRAIT_FACE_CROP, portraitDe, portraitSrc } from '@/lib/portraits'
import { idAvatarIa, srcAvatarIa } from '@/lib/avatar-ia'
import { cn } from '@/lib/utils'

/**
 * LE VISAGE D'UN ÉLÈVE DANS LES LISTES DE L'ONGLET AMIS.
 *
 * Le blason peint (lib/portraits), cadré sur le visage dans un rond — plus
 * d'emoji d'animal. `portrait` est le choix de l'élève (clé, '' ou absent) ;
 * à défaut, un blason fixe déduit de `id`. La taille vient de `className`.
 *
 * `avatar` (déjà résolu par le serveur, lib/avatar-affiche) l'emporte : c'est
 * MON avatar, tel que l'onglet Moi le montre — un avatar composé n'est pas un
 * blason, et on ne doit pas me montrer celui d'un autre.
 */
export default function PortraitJoueur({
  id,
  portrait,
  avatar = null,
  className,
}: {
  id: string
  portrait?: string
  avatar?: AvatarAffiche | null
  className?: string
}) {
  // Un avatar dessiné par Marcel, venu d'une liste (`ia:<uuid>`) : l'image
  // entière, comme mon propre avatar résolu par le serveur.
  const ia = idAvatarIa(portrait)
  const affiche = avatar ?? (ia ? { src: srcAvatarIa(ia), visage: false } : null)
  return (
    <span
      aria-hidden="true"
      className={cn('relative block shrink-0 overflow-hidden rounded-full bg-primary/10', className)}
    >
      {affiche ? (
        // L'image telle quelle, en pleine définition (384 px pour un blason).
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={affiche.src}
          alt=""
          className={affiche.visage ? 'absolute max-w-none object-contain select-none' : 'size-full object-cover select-none'}
          style={affiche.visage ? PORTRAIT_FACE_CROP : undefined}
        />
      ) : (
        <Image
          src={portraitSrc(portraitDe(portrait, id))}
          alt=""
          width={120}
          height={120}
          // Le cadrage visage affiche l'image à 180 % de la case : 144 px pour
          // la plus grande (80 px, la fenêtre « Fais équipe »). Servie à 100 px,
          // elle était floue (24/09/2026).
          sizes="160px"
          className="absolute max-w-none object-contain select-none"
          style={PORTRAIT_FACE_CROP}
        />
      )}
    </span>
  )
}
