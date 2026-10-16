import Image from 'next/image'
import dort from '@/public/images/marcel/poses/dort.webp'
import ecoute from '@/public/images/marcel/poses/ecoute.webp'
import invite from '@/public/images/marcel/poses/invite.webp'
import lit from '@/public/images/marcel/poses/lit.webp'
import recharge from '@/public/images/marcel/poses/recharge.webp'
import soir from '@/public/images/marcel/poses/soir.webp'
import salut from '@/public/images/mascotte/reaction-bonne.webp'

/**
 * LES POSES DE MARCEL (16/10/2026) — la critique du bureau classait en P0
 * « Marcel absent de son propre bureau : figé, il ne réagit à rien ». Six
 * poses dessinées par Nano Banana 2.1 d’après Marcel qui salue (commande :
 * assets-sources/marcel-bureau/commande.md ; fabrication :
 * scripts/marcel-illustrations.mjs) :
 *   soir      il bâille, un chocolat chaud à la main — la séance express du soir
 *   dort      il dort contre une pile de livres — crédits épuisés
 *   ecoute    la main à l’oreille — le micro, l’oral
 *   lit       il lit une copie, la main au menton — pendant qu’il répond
 *   invite    la main tendue — la première rencontre, le gratuit
 *   recharge  il brandit une batterie — les recharges
 * `salut` est le Marcel d’avant, la pose par défaut.
 */
export const POSES = { salut, soir, dort, ecoute, lit, invite, recharge } as const
export type Pose = keyof typeof POSES

export default function PoseMarcel({
  pose,
  hauteur,
  className,
  priority,
}: {
  pose: Pose
  /** La hauteur affichée, en pixels ; la largeur suit le dessin. */
  hauteur: number
  className?: string
  priority?: boolean
}) {
  const img = POSES[pose]
  const largeur = Math.round((img.width / img.height) * hauteur)
  return (
    <Image
      src={img}
      alt=""
      aria-hidden="true"
      priority={priority}
      sizes={`${largeur}px`}
      style={{ width: largeur, height: hauteur }}
      className={className}
    />
  )
}
