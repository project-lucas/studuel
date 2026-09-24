import type { CSSProperties } from 'react'
import {
  BOUCLE_DE,
  CENTRE_DE,
  COTE_DE,
  FACES_DE,
  PISTES_OMBRE,
  PISTE_CORPS,
  PISTE_CUBE,
  PISTE_SOL,
  POINTS_DE,
  POINT_DE,
  RETRAIT_NOYAU,
  SCENE_DE,
  SOL_DE,
  feuilleDuDe,
  imageDeDepart,
  placePoint,
  placementNoyau,
  placementPeinte,
  type PisteDe,
} from '@/lib/defi/de-anime'
import { cn } from '@/lib/utils'
import styles from './DeAnime.module.css'

/**
 * LE DÉ QUI ROULE : l'icône du bouton « Modes de jeu » de l'arène, animée par
 * Lucas (lib/defi/de-anime.ts).
 *
 * Un vrai cube CSS : six faces peintes placées par leur repère, un noyau
 * d'encre derrière, une ombre au sol. Chaque couche animée porte en ligne SA
 * PREMIÈRE IMAGE (le dé figé — mouvement réduit — est l'instant zéro de la
 * boucle) et l'`animation` qui joue ses images-clés ; la feuille est écrite
 * une fois et remonte dans le `<head>` (`precedence`), même si le dé est
 * posé dans un bouton.
 *
 * Aucun état, aucun effet : le navigateur joue tout. Décoratif (`aria-hidden`)
 * — le bouton qui le porte dit ce qu'il fait.
 */
export default function DeAnime({ className }: { className?: string }) {
  const demi = COTE_DE / 2
  const noyau = demi - RETRAIT_NOYAU
  return (
    <span aria-hidden="true" className={cn(styles.scene, className)}>
      <style href="de-anime" precedence="default">
        {feuille()}
      </style>
      <span
        className={styles.sol}
        style={joue(PISTE_SOL, {
          left: u(SOL_DE.x),
          top: u(SOL_DE.y),
          width: u(SOL_DE.w),
          height: u(SOL_DE.h),
        })}
      />
      <span
        className={styles.corps}
        style={joue(PISTE_CORPS, {
          transformOrigin: `50% ${(100 * CENTRE_DE.y) / SCENE_DE}%`,
        })}
      >
        <span
          className={styles.cube}
          style={joue(PISTE_CUBE, { left: u(CENTRE_DE.x), top: u(CENTRE_DE.y) })}
        >
          {FACES_DE.map((face) => (
            <span
              key={`noyau-${face.n}`}
              className={styles.noyau}
              style={{ ...carre(noyau), transform: placementNoyau(face) }}
            />
          ))}
          {FACES_DE.map((face, i) => (
            <span
              key={face.n}
              className={styles.face}
              style={{ ...carre(demi), transform: placementPeinte(face) }}
            >
              {POINTS_DE[face.n].map((point) => {
                const { x, y } = placePoint(point)
                return (
                  <span
                    key={`${point[0]}-${point[1]}`}
                    className={styles.point}
                    style={{ left: u(x), top: u(y), width: u(POINT_DE.w), height: u(POINT_DE.h) }}
                  />
                )
              })}
              <span className={styles.ombre} style={joue(PISTES_OMBRE[i])} />
            </span>
          ))}
        </span>
      </span>
    </span>
  )
}

/** La feuille d'images-clés du dé, écrite une fois : elle ne change jamais. */
let FEUILLE: string | undefined
function feuille(): string {
  FEUILLE ??= feuilleDuDe()
  return FEUILLE
}

/** Une couche animée : sa première image, puis l'animation de sa piste. */
function joue(piste: PisteDe, style?: CSSProperties): CSSProperties {
  return {
    ...style,
    ...imageDeDepart(piste),
    animation: `${piste.nom} ${BOUCLE_DE}s linear infinite`,
  }
}

/** `n` pixels de scène, en pixels d'écran. */
function u(n: number): string {
  return `calc(${n} * var(--u))`
}

/** Un carré de demi-côté `demi`, centré sur le centre du cube. */
function carre(demi: number): CSSProperties {
  return { left: u(-demi), top: u(-demi), width: u(2 * demi), height: u(2 * demi) }
}
