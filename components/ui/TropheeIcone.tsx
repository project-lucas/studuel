import Image from 'next/image'
import { cn } from '@/lib/utils'

/**
 * LE TROPHÉE, UNE SEULE ILLUSTRATION PARTOUT (03/10/2026, Lucas : « les
 * trophées traînent un peu partout ; dorénavant on ne verra que cette
 * illustration »). La coupe d'or du compte de trophées de l'arène
 * (`public/images/defi/icones/trophees-v3.webp`) remplace la coupe animée qui
 * se balançait (onglet Moi, classement, duel) et les pictogrammes au trait :
 * partout où l'on compte des trophées, c'est le même objet.
 */
export default function TropheeIcone({ className }: { className?: string }) {
  return (
    <Image
      src="/images/defi/icones/trophees-v3.webp"
      alt=""
      aria-hidden="true"
      width={116}
      height={116}
      draggable={false}
      className={cn('inline-block size-5 shrink-0 object-contain', className)}
    />
  )
}
