import type { ReactNode } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import styles from './ModeHero.module.css'

/**
 * LE BANDEAU D'AMBIANCE d'un mode de jeu — le haut de l'écran qu'on découvre
 * après avoir touché un billet de « Modes de jeu » (la carte des paliers d'un
 * jeu de salon, l'accueil du Blitz, du Chrono…).
 *
 * Il ne réinvente rien : il reprend la SCÈNE du billet, la robe du jeu
 * (`.jeu-*`, posée par ModeStage) et le titre cartoon, et fond la scène dans
 * la surface du jeu. Sans scène (jeu encore sans illustration), la robe du jeu
 * prend le motif losange des billets et la VIGNETTE de la matière — la même
 * que dans son dossier de Réviser.
 *
 * À poser en PREMIER dans le contenu d'un ModeStage : il sort de son padding
 * pour occuper toute la largeur.
 */
export default function ModeHero({
  scene,
  titre,
  sousTitre,
  matiere,
  dansIntro = false,
  children,
}: {
  /** La scène du billet (`/images/defi/...-scene.webp`), ou null. */
  scene?: string | null
  titre: string
  sousTitre?: string
  /** La matière du jeu, avec la vignette de son dossier (null pour un mode de l'Arène). */
  matiere?: { nom: string; vignette: string | null } | null
  /**
   * Posé dans la colonne centrée de l'accueil d'un mode de l'Arène plutôt
   * qu'en tête de la scène : il s'y étire et remonte jusqu'à l'en-tête.
   */
  dansIntro?: boolean
  /** Une rangée de pastilles sous le titre (record, règle…). */
  children?: ReactNode
}) {
  return (
    <div
      className={styles.hero}
      data-repli={scene ? undefined : ''}
      data-intro={dansIntro ? '' : undefined}
    >
      {scene ? (
        <Image
          src={scene}
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="(max-width: 640px) 100vw, 576px"
          className="-z-10 object-cover object-[70%_40%]"
        />
      ) : matiere?.vignette ? (
        <span className={cn(styles.vignette, '-z-10')} aria-hidden="true">
          <Image src={matiere.vignette} alt="" fill sizes="176px" className="object-contain" />
        </span>
      ) : null}

      {matiere ? (
        <span
          className={cn(
            styles.matiere,
            'font-heading absolute top-3 left-4 z-10 inline-flex items-center gap-1.5 rounded-full py-1 pr-3 pl-1 text-xs font-extrabold text-white',
          )}
        >
          {matiere.vignette ? (
            <Image
              src={matiere.vignette}
              alt=""
              aria-hidden="true"
              width={48}
              height={48}
              className="size-6 object-contain"
            />
          ) : null}
          {matiere.nom}
        </span>
      ) : null}

      <div className="absolute inset-x-4 bottom-5 z-10 flex flex-col items-start gap-1">
        <h1
          className={cn(
            styles.titre,
            'font-heading line-clamp-2 text-left text-[1.9rem] leading-[1.05] font-extrabold text-balance',
          )}
        >
          {titre}
        </h1>
        {sousTitre ? (
          <p className="line-clamp-2 max-w-[34ch] text-left text-sm font-bold text-white [text-shadow:0_1px_3px_rgb(0_0_0/0.75)]">
            {sousTitre}
          </p>
        ) : null}
        {children}
      </div>
    </div>
  )
}
