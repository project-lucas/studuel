import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { RankTierId } from '@/lib/rank'
import { cadreDeRang, divisionRomaine, PLAQUE_CADRE_Y, TROU_CADRE } from '@/lib/rang-visuel'
import s from './AvatarRang.module.css'

/**
 * L'AVATAR DANS L'ANNEAU DE SON RANG DE LIGUE (16/10/2026, Lucas : « le cadre
 * dans le profil est toujours moche, il faut que le cadre de la barre de niveau
 * et celui de l'onglet profil soient similaires »). Le même dessin que le
 * bandeau du haut (lib/rang-visuel : le métal dit le rang, la plaque du bas la
 * division en chiffres romains), à la taille qu'on lui donne (`className`).
 */
export default function AvatarRang({
  photo,
  rang,
  className,
}: {
  photo: ReactNode
  /** Le rang de ligue ; `null` avant la première XP (un anneau blanc). */
  rang: { id: RankTierId; division: number | null } | null
  className?: string
}) {
  return (
    <span className={cn(s.anneau, 'block', className)}>
      <span
        className={cn(s.photo, !rang && s.sansRang)}
        style={rang ? { width: `${TROU_CADRE * 100}%`, height: `${TROU_CADRE * 100}%` } : undefined}
      >
        {photo}
      </span>
      {rang ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- dessin servi tel quel (192 px) */}
          <img src={cadreDeRang(rang.id, rang.division)} alt="" className={s.cadre} draggable={false} />
          {rang.division !== null ? (
            <span aria-hidden="true" className={s.division} style={{ top: `${PLAQUE_CADRE_Y * 100}%` }}>
              {divisionRomaine(rang.division)}
            </span>
          ) : null}
        </>
      ) : null}
    </span>
  )
}
