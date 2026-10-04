import Image from 'next/image'
import { cn } from '@/lib/utils'
import { portraitBoss, type Boss } from '@/lib/bosses'

/**
 * LE BOSS EN PIED — son illustration verticale (tête, pieds, décor), cadrée
 * pour remplir la boîte que lui donne le parent (`className` : taille, coins).
 * Le bas se fond dans `fondu` (la couleur sous le texte qui suit), pour que le
 * nom et la suite se posent dans l'image plutôt que sous un cadre.
 *
 * Repli : la scène 16:9 cadrée sur la droite (où se tiennent tous les boss),
 * puis le buste, puis l'emoji — jamais une case vide.
 */
export default function BossPortrait({
  boss,
  className,
  priority = false,
  fondu = 'from-[#0f0820]',
  sizes = '(min-width: 640px) 28rem, 100vw',
}: {
  boss: Boss
  className?: string
  priority?: boolean
  /** Classe Tailwind de départ du dégradé du bas (`from-…`), `null` sans fondu. */
  fondu?: string | null
  sizes?: string
}) {
  const portrait = portraitBoss(boss)
  const src = portrait ?? boss.scene ?? boss.image ?? null

  return (
    <div className={cn('relative overflow-hidden', className)} aria-hidden="true">
      {src ? (
        <Image
          src={src}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          className={cn(
            'object-cover',
            portrait ? 'object-[50%_35%]' : boss.scene ? 'object-[78%_50%]' : 'object-contain object-bottom',
          )}
        />
      ) : (
        <span className="grid size-full place-items-center text-[6rem]">{boss.emoji}</span>
      )}
      {fondu ? (
        <span className={cn('absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t to-transparent', fondu)} />
      ) : null}
    </div>
  )
}
