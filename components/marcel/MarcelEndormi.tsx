import Image from 'next/image'
import Link from 'next/link'
import { Moon, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Sommeil } from '@/lib/coach/sommeil'
import PoseMarcel from './PoseMarcel'
import tasse from '@/public/images/marcel/cafe/tasse.webp'
import styles from './MarcelEndormi.module.css'

/** Où s'achète le café de Marcel : le rayon de la Boutique. */
export const LIEN_CAFE = '/tresor#recharges'

/**
 * MARCEL DORT (25/10/2026, Lucas : « Marcel qui dort, animé pour qu'il ait
 * vraiment l'air endormi ; en appuyant sur une tasse de café il se réveille »).
 *
 * La pose `dort` RESPIRE (la cage thoracique se soulève, 3 s), trois « z »
 * montent en s'effaçant, une lune et deux étoiles veillent ; à côté, une TASSE
 * fumante tremble d'impatience sous l'étiquette « Réveiller Marcel » : la
 * toucher mène au rayon « Le café de Marcel » (`/tresor#recharges`). Pas de
 * réveil gratuit : le café s'achète, et c'est le serveur qui décide
 * (`coach_ask_allowed`). Au plafond du jour (`repos`), rien ne le réveille — la
 * tasse n'est pas là, il revient demain.
 *
 * Tout est en transform et opacité, valeurs littérales, immobile sous
 * mouvement réduit (MarcelEndormi.module.css).
 */
export default function MarcelEndormi({ sommeil, className }: { sommeil: Sommeil; className?: string }) {
  const tasseVisible = sommeil.recharger
  return (
    <div className={cn('flex items-end gap-2', className)}>
      {/* LA SCÈNE : Marcel contre sa pile de livres, ses z, la lune. */}
      <div className="relative shrink-0 pt-6 pr-5" aria-hidden="true">
        <span className="text-primary absolute top-0 left-0 flex items-start gap-1">
          <Moon className="size-4 fill-current" strokeWidth={0} />
          <Sparkles className={cn(styles.etoile, 'mt-2 size-2.5 fill-current')} strokeWidth={0} />
          <Sparkles className={cn(styles.etoile, '-mt-1 size-2 fill-current')} strokeWidth={0} />
        </span>
        <div className={styles.corps}>
          <PoseMarcel pose="dort" hauteur={104} className="object-contain" />
        </div>
        {/* Les z partent de sa tête, vers le haut à droite. */}
        <span className="font-heading text-primary pointer-events-none absolute top-7 right-1 h-10 w-6 font-extrabold select-none">
          <span className={cn(styles.z, 'bottom-0 left-0 text-[13px]')}>z</span>
          <span className={cn(styles.z, 'bottom-0 left-0 text-[13px]')}>z</span>
          <span className={cn(styles.z, 'bottom-0 left-0 text-[13px]')}>z</span>
        </span>
      </div>

      <div className="min-w-0 flex-1 pb-1 text-left">
        <p className="font-heading text-[17px] leading-tight font-extrabold">{sommeil.titre}</p>
        <p className="text-muted-foreground mt-1 text-[12.5px] leading-snug font-semibold text-balance">{sommeil.phrase}</p>
        {tasseVisible ? (
          <p className="text-muted-foreground mt-1.5 text-[11px] font-semibold">Un café offert ne s’efface pas à la fin du mois.</p>
        ) : null}
      </div>

      {/* LA TASSE : le seul geste de l'écran. Un lien, pas un bouton : le café
          s'achète à la Boutique, rien ne se décide ici. */}
      {tasseVisible ? (
        <Link
          href={LIEN_CAFE}
          className={cn(
            styles.tasseBouton,
            'group flex w-[88px] shrink-0 flex-col items-center gap-1 self-end rounded-2xl pt-1 pb-1.5 text-center transition active:scale-[.96]',
          )}
        >
          <Image
            src={tasse}
            alt=""
            aria-hidden="true"
            width={64}
            height={71}
            sizes="64px"
            className={cn(styles.tasse, 'h-[71px] w-16 object-contain drop-shadow-[0_6px_6px_rgba(36,48,79,.25)]')}
          />
          <span className="bg-primary text-primary-foreground font-heading rounded-full px-2.5 py-1 text-[11px] leading-none font-extrabold shadow-[0_2px_0_color-mix(in_oklch,var(--primary),black_28%)]">
            Réveiller Marcel
          </span>
        </Link>
      ) : null}
    </div>
  )
}

/**
 * MARCEL EST RÉVEILLÉ ! — l'état d'après le café (les cafés du mois sont bus,
 * une recharge le tient debout) : la pose `cafe`, la tasse à la main.
 */
export function MarcelReveille({ sommeil, className }: { sommeil: Sommeil; className?: string }) {
  return (
    <div className={cn('flex items-end gap-2', className)} role="status">
      <PoseMarcel pose="cafe" hauteur={72} className="shrink-0 object-contain" />
      <p className="bg-card mb-1 min-w-0 flex-1 rounded-2xl px-3 py-2 text-[12.5px] leading-snug font-bold shadow-[inset_0_0_0_1.5px_color-mix(in_oklch,var(--primary),transparent_78%)]">
        <span className="font-heading block text-[14px] font-extrabold">{sommeil.titre}</span>
        <span className="text-muted-foreground font-semibold">{sommeil.phrase}</span>
      </p>
    </div>
  )
}
