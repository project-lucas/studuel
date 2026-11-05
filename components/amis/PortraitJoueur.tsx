import type { AvatarAffiche } from '@/lib/avatar-affiche'
import { herosVisageSrc } from '@/lib/heros/eleves'
import { PORTRAIT_FACE_CROP, portraitDe } from '@/lib/portraits'
import { idAvatarIa, srcAvatarIa } from '@/lib/avatar-ia'
import { imagePersonnage, personnageDuPortrait } from '@/lib/personnages-historiques'
import { cn } from '@/lib/utils'

/**
 * LE VISAGE D'UN ÉLÈVE DANS LES LISTES DE L'ONGLET AMIS.
 *
 * Le blason peint (lib/portraits), cadré sur le visage dans un rond — plus
 * d'emoji d'animal. `portrait` est le choix de l'élève (clé, '' ou absent) ;
 * à défaut, un blason fixe déduit de `id`. La taille vient de `className`.
 * Depuis le 05/11/2026, un blason devient son HÉROS et un élève sans choix
 * reçoit un héros fixe (lib/portraits : portraitDe) — plus d'élève humain.
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
  // Un personnage historique débloqué (`perso:<id>`) : son portrait entier.
  const perso = personnageDuPortrait(portrait)
  const affiche: AvatarAffiche =
    avatar ??
    (ia
      ? { src: srcAvatarIa(ia), visage: false }
      : perso
        ? { src: imagePersonnage(perso.id), visage: false }
        : // Un héros : son visage est déjà recadré, on ne zoome pas dessus.
          { src: herosVisageSrc(portraitDe(portrait, id)), visage: false })
  return (
    <span
      aria-hidden="true"
      className={cn('relative block shrink-0 overflow-hidden rounded-full bg-primary/10', className)}
    >
      {/* L'image telle quelle, en pleine définition (384 px pour un héros). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={affiche.src}
        alt=""
        className={affiche.visage ? 'absolute max-w-none object-contain select-none' : 'size-full object-cover select-none'}
        style={affiche.visage ? PORTRAIT_FACE_CROP : undefined}
      />
    </span>
  )
}
