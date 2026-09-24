import Image from 'next/image'
import { cn } from '@/lib/utils'
import coffreFerme from '@/public/images/amis/coffre/ferme.webp'
import coffreOuvert from '@/public/images/amis/coffre/ouvert.webp'

/**
 * LE COFFRE D'ÉQUIPE, DESSINÉ — bois violet, ferrures d'or, serrure : le
 * coffre de Clash Royale aux couleurs de l'app (violet = la marque, or = ce
 * qui se gagne). Deux illustrations de Lucas (24/09/2026), détourées par
 * scripts/coffre-equipe.mjs dans un cadrage COMMUN : fermé ou ouvert, le
 * coffre reste à la même place et à la même taille. Elles ont remplacé le
 * coffre en SVG du premier jour.
 *
 * Partout où passe le coffre : sa plaque et ses feuilles (onglet Amis), le
 * badge du bandeau (25 px) et de la carte du joueur, la fenêtre d'invitation.
 * `ouvert` : le coffre d'une semaine finie, gemmes en vue.
 */
export default function CoffreDessin({ ouvert = false, className }: { ouvert?: boolean; className?: string }) {
  return (
    <Image
      src={ouvert ? coffreOuvert : coffreFerme}
      alt=""
      aria-hidden="true"
      width={256}
      height={256}
      draggable={false}
      className={cn('select-none object-contain', className)}
    />
  )
}
