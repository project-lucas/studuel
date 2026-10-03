import Image from 'next/image'
import { cn } from '@/lib/utils'
import coffreFerme from '@/public/images/quetes/coffre-ferme.webp'
import coffreOuvert from '@/public/images/quetes/coffre-ouvert.webp'

/**
 * LE COFFRE DU JOUR, DESSINÉ — bois violet, ferrures d'or : celui qui s'ouvre
 * quand les trois quêtes du jour sont bouclées. C'était le coffre d'équipe des
 * Amis jusqu'au 03/10/2026 (ils ont désormais un coffre bleu par niveau,
 * components/amis/CoffreDessin). Fabriqué par scripts/coffre-du-jour.mjs dans
 * un cadrage commun : fermé ou ouvert, il reste à la même place.
 */
export default function CoffreDuJourDessin({ ouvert = false, className }: { ouvert?: boolean; className?: string }) {
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
