'use client'

import { BossFace } from '@/components/reviser/BossArena'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import type { GardienVue } from '@/lib/reviser/gardien'

/**
 * L'ÉCUSSON DU GARDIEN — l'anneau d'angle qui se remplit pendant qu'on révise.
 *
 * Il vit dans le header de la matière, à côté des gemmes et de la série, et il
 * reste là quel que soit l'onglet ouvert : la jauge se remplit avec le travail
 * fait sur l'onglet Programme, elle doit donc se lire depuis l'onglet Programme.
 * Il est repris en petit dans la barre collante, sans quoi il s'évaporerait dès
 * qu'on descend dans les chapitres — c'est-à-dire pendant tout le travail.
 *
 * CE QU'IL MONTRE, ET DANS CET ORDRE :
 *  · une SILHOUETTE tant que le gardien rôde — on ne sait pas encore qui c'est ;
 *  · un anneau qui se remplit, en jaune de progression ;
 *  · le BUSTE en couleur, l'anneau plein et un halo dès qu'il est sorti.
 *
 * L'apparition n'est donc pas un changement de couleur, c'est une révélation.
 * Elle ne coûte rien : les bustes existent déjà (public/images/boss).
 */
export default function GardienBadge({
  vue,
  size = 'md',
  tone = 'dark',
  onSelect,
  decoratif = false,
  className,
}: {
  vue: GardienVue
  /** `md` dans le header, `sm` dans la barre collante. */
  size?: 'sm' | 'md'
  /**
   * Le fond sur lequel il est posé. Le header de matière est un décor SOMBRE,
   * la barre collante est crème : une silhouette blanche disparaîtrait sur l'une
   * et une silhouette noire sur l'autre.
   */
  tone?: 'dark' | 'light'
  /** Tap : on va au billet du gardien (onglet « Mode de jeu »). */
  onSelect?: () => void
  /**
   * Rendu DÉCORATIF : ni bouton, ni annonce. C'est le cas dans le billet du
   * gardien, où le texte juste à côté dit déjà tout — un second bouton portant
   * la même phrase ajouterait une tabulation morte et ferait répéter la
   * nouvelle deux fois au lecteur d'écran.
   */
  decoratif?: boolean
  className?: string
}) {
  const px = size === 'sm' ? 34 : 46
  // Rayon et épaisseur du trait dans un repère 0→100, indépendants de la taille
  // rendue : l'anneau reste net à 34 comme à 46 px.
  const R = 44
  const CIRC = 2 * Math.PI * R
  const sorti = vue.revele
  const sombre = tone === 'dark'

  const contenu = (
    <>
      {/* Le halo du gardien sorti : il déborde l'anneau et signale de loin que
          quelque chose attend. Absent tant qu'il rôde — un écusson qui brille en
          permanence cesse d'être vu en deux jours. */}
      {sorti ? (
        <span
          aria-hidden="true"
          className="absolute inset-[-6px] animate-pulse rounded-full bg-highlight/30 blur-[6px] motion-reduce:animate-none"
        />
      ) : null}

      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 -rotate-90"
        aria-hidden="true"
      >
        <circle
          cx="50"
          cy="50"
          r={R}
          fill={sombre ? 'rgba(0,0,0,0.35)' : 'transparent'}
          stroke={sombre ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.12)'}
          strokeWidth="8"
        />
        {vue.ratio > 0 ? (
          <circle
            cx="50"
            cy="50"
            r={R}
            fill="none"
            stroke="var(--highlight)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC * (1 - Math.min(1, Math.max(0, vue.ratio)))}
            className="transition-[stroke-dashoffset] duration-700 ease-out"
          />
        ) : null}
      </svg>

      {vue.boss ? (
        <span
          className={cn(
            'relative grid place-items-center overflow-hidden rounded-full',
            // La silhouette : le buste passé au noir, puis inversé en blanc sur
            // fond sombre. Illisible comme portrait, parfaitement lisible comme
            // forme — c'est exactement ce qu'on veut avant l'apparition.
            sorti
              ? 'opacity-100'
              : sombre
                ? 'opacity-45 brightness-0 invert'
                : 'opacity-30 brightness-0',
          )}
          style={{ width: px - 14, height: px - 14 }}
        >
          <BossFace boss={vue.boss} px={px - 14} className="size-full" />
        </span>
      ) : null}
    </>
  )

  const taille = { width: px, height: px }

  if (decoratif) {
    return (
      <span
        aria-hidden="true"
        className={cn(
          'relative grid shrink-0 place-items-center rounded-full',
          className,
        )}
        style={taille}
      >
        {contenu}
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={() => {
        sfx.tap()
        onSelect?.()
      }}
      aria-label={vue.aria}
      title={vue.phrase}
      className={cn(
        'relative grid shrink-0 cursor-pointer place-items-center rounded-full transition-transform duration-200 active:scale-95 focus-visible:ring-4 focus-visible:ring-highlight/60 focus-visible:outline-none',
        className,
      )}
      style={taille}
    >
      {contenu}
    </button>
  )
}
