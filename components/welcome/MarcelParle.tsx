import Image, { type StaticImageData } from 'next/image'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import salut from '@/public/images/onboarding/marcel-salut.webp'
import jeu from '@/public/images/onboarding/marcel-jeu.webp'
import trophee from '@/public/images/onboarding/marcel-trophee.webp'
import plan from '@/public/images/onboarding/marcel-plan.webp'
import classe from '@/public/images/onboarding/marcel-classe.webp'
import cadre from '@/public/images/onboarding/marcel-cadre.webp'
import flamme from '@/public/images/onboarding/marcel-flamme.webp'
import cle from '@/public/images/onboarding/marcel-cle.webp'
import fete from '@/public/images/onboarding/marcel-fete.webp'

/**
 * MARCEL PARLE — l'onboarding façon Duolingo (13/10/2026, Lucas : « tout doit
 * être tourné via des illustrations de Marcel, inspire-toi de Duolingo sans le
 * côté question »). Comme Duo, Marcel est sur CHAQUE écran, dans une pose qui
 * dit l'écran, et c'est lui qui parle : la bulle porte le titre de l'écran (un
 * h1, pour le lecteur d'écran) et sa phrase. Deux mises : en RANGÉE (Marcel à
 * gauche, la bulle à droite — les écrans de choix) et en GRAND (la bulle
 * au-dessus, Marcel en pied — l'accueil, le tuto, la bienvenue).
 *
 * Les poses sont des dessins détourés (scripts/marcel-onboarding.mjs),
 * importés pour l'empreinte de contenu.
 */
export const POSES: Record<MarcelPose, StaticImageData> = { salut, jeu, trophee, plan, classe, cadre, flamme, cle, fete }

export type MarcelPose = 'salut' | 'jeu' | 'trophee' | 'plan' | 'classe' | 'cadre' | 'flamme' | 'cle' | 'fete'

export default function MarcelParle({
  pose,
  titre,
  sous,
  grand = false,
  clair = false,
  className,
}: {
  pose: MarcelPose
  /** Ce que dit Marcel : le titre de l'écran. */
  titre: ReactNode
  /** La phrase sous le titre, dans la même bulle. */
  sous?: ReactNode
  /** Bulle au-dessus et Marcel en pied, grand — l'accueil, le tuto, la fin. */
  grand?: boolean
  /** Sur un fond sombre (l'académie) : la bulle garde son blanc, l'ombre s'adoucit. */
  clair?: boolean
  className?: string
}) {
  const bulle = (
    <div
      className={cn(
        'relative rounded-[20px] border-[2.5px] bg-white px-4 py-3 text-left',
        grand ? 'mx-auto max-w-[340px] text-center' : 'min-w-0 flex-1',
      )}
      style={{ borderColor: 'var(--onb-ink)', boxShadow: clair ? '0 4px 0 rgba(43,35,80,0.35)' : '0 4px 0 var(--onb-line-d)' }}
    >
      <h1 className="onb-title text-[20px] leading-[1.15]">{titre}</h1>
      {sous ? (
        <p className="mt-1 text-[14px] leading-snug font-bold" style={{ color: 'var(--onb-mut)' }}>
          {sous}
        </p>
      ) : null}
      {/* La queue de la bulle : vers Marcel — en bas pour le grand format, à gauche en rangée. */}
      <span
        aria-hidden="true"
        className={cn(
          'absolute size-4 rotate-45 border-[2.5px] bg-white',
          grand
            ? 'bottom-[-10px] left-1/2 -ml-2 border-t-0 border-l-0'
            : 'top-1/2 left-[-10px] -mt-2 border-t-0 border-r-0',
        )}
        style={{ borderColor: 'var(--onb-ink)' }}
      />
    </div>
  )

  if (grand) {
    return (
      <div className={cn('flex flex-col items-center', className)}>
        {bulle}
        <Image
          src={POSES[pose]}
          alt=""
          aria-hidden="true"
          priority
          sizes="240px"
          className="onb-pop mt-5 h-[240px] w-auto select-none drop-shadow-[0_10px_18px_rgba(43,35,80,0.28)]"
        />
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Image
        src={POSES[pose]}
        alt=""
        aria-hidden="true"
        priority
        sizes="120px"
        className="onb-pop h-[132px] w-auto shrink-0 select-none drop-shadow-[0_8px_14px_rgba(43,35,80,0.25)]"
      />
      {bulle}
    </div>
  )
}
