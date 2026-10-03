import Image, { type StaticImageData } from 'next/image'
import { cn } from '@/lib/utils'
import n1f from '@/public/images/amis/coffre/niveau-1-ferme.webp'
import n1o from '@/public/images/amis/coffre/niveau-1-ouvert.webp'
import n2f from '@/public/images/amis/coffre/niveau-2-ferme.webp'
import n2o from '@/public/images/amis/coffre/niveau-2-ouvert.webp'
import n3f from '@/public/images/amis/coffre/niveau-3-ferme.webp'
import n3o from '@/public/images/amis/coffre/niveau-3-ouvert.webp'
import n4f from '@/public/images/amis/coffre/niveau-4-ferme.webp'
import n4o from '@/public/images/amis/coffre/niveau-4-ouvert.webp'
import n5f from '@/public/images/amis/coffre/niveau-5-ferme.webp'
import n5o from '@/public/images/amis/coffre/niveau-5-ouvert.webp'

/** [fermé, ouvert] par niveau du coffre d'équipe (1 → 5). */
const COFFRES: readonly (readonly [StaticImageData, StaticImageData])[] = [
  [n1f, n1o],
  [n2f, n2o],
  [n3f, n3o],
  [n4f, n4o],
  [n5f, n5o],
]

/**
 * LE COFFRE D'ÉQUIPE, DESSINÉ — UN PAR NIVEAU (03/10/2026). Bois bleu ; le
 * niveau 1 est cerclé de fer, le 2 gagne une gemme sur la serrure, le 3 passe
 * à l'or, le 4 et le 5 se couvrent de gemmes violettes (Lucas : « une
 * amélioration sobre », dessinés sur une seule planche pour garder l'échelle).
 * Ouvert, il montre ce qu'il rend : des éclairs d'XP et des gemmes, plus
 * nombreux de niveau en niveau. Fabriqués par scripts/coffres-amis.mjs dans un
 * cadrage COMMUN : fermé ou ouvert, de niveau en niveau, le coffre reste à la
 * même place et à la même taille.
 *
 * Le coffre violet d'avant est devenu le coffre du jour des quêtes
 * (components/quetes/CoffreDuJour).
 *
 * `niveau` : le niveau atteint (0 = pas encore de niveau → le coffre de
 * niveau 1, celui qu'on vise).
 */
export default function CoffreDessin({
  niveau = 1,
  ouvert = false,
  className,
}: {
  niveau?: number
  ouvert?: boolean
  className?: string
}) {
  const i = Math.min(COFFRES.length, Math.max(1, Math.round(Number.isFinite(niveau) ? niveau : 1))) - 1
  return (
    <Image
      src={COFFRES[i][ouvert ? 1 : 0]}
      alt=""
      aria-hidden="true"
      width={256}
      height={256}
      draggable={false}
      className={cn('select-none object-contain', className)}
    />
  )
}
