'use client'

import { useState } from 'react'
import { Trophy } from 'lucide-react'
import ProfileModal from '@/components/defi/ProfileModal'
import RankBadge from '@/components/defi/RankBadge'
import { rankFor, DIVISION_SPAN } from '@/lib/rank'
import { walletLevelInfo } from '@/lib/wallet'
import type { ProfileData } from '@/app/defi/profile-actions'
import { sfx } from '@/lib/sounds'

/**
 * LA PLAQUE D'IDENTITÉ du HUD, en haut-gauche de l'arène : qui je suis, où j'en
 * suis. Disque de niveau, blason de palier, trophées de la division, une jauge.
 * Un tap ouvre la modale de profil (stats, badges, bannières).
 *
 * ELLE EN ÉTAIT DEUX, ET C'ÉTAIT LE DÉFAUT. La pastille de niveau portait sa
 * barre d'XP ; la cartouche de rang, empilée 8 px dessous, portait la sienne.
 * Deux progressions côte à côte se disputent la même lecture — on ne sait plus
 * laquelle compte.
 *
 * ET CHAQUE BARRE RÉPÉTAIT SON PROPRE CHIFFRE : « 63 / 500 » écrit sous une
 * barre remplie à 63/500, « 2 625 / 2 800 XP » sous une barre remplie d'autant.
 * Deux fois la même information, deux fois. Il ne reste donc qu'UNE jauge, et
 * c'est celle du RANG : sur l'écran du jeu, ce sont les trophées qui bougent, et
 * c'est le palier qui décide de ce qui s'ouvre. L'XP n'a pas disparu — elle est
 * dans l'étiquette lue à voix haute et dans la modale, qui est faite pour ça.
 *
 * Le matériau reste le verre de nuit SCULPTÉ, commun à tout le HUD de l'arène.
 */
export default function ProfileChip({
  data,
  trophies,
}: {
  data: ProfileData
  /** Total de trophées — il donne le palier et la position dans la division. */
  trophies: number
}) {
  const [open, setOpen] = useState(false)
  const info = walletLevelInfo(data.summary.totalXp)
  const xpLabel = `${info.currentXp.toLocaleString('fr-FR')} / ${info.nextAt.toLocaleString('fr-FR')} XP`
  const rank = rankFor(trophies)
  const hasDivision = rank.ceiling !== null

  return (
    <>
      <button
        type="button"
        onClick={() => {
          sfx.tap()
          setOpen(true)
        }}
        aria-haspopup="dialog"
        aria-label={`Niveau ${info.level}, ${xpLabel} — rang ${rank.label}, ${rank.inDivision} trophées sur ${DIVISION_SPAN} dans la division, ${trophies} au total. Voir mes stats et badges`}
        className="olympe-glass olympe-glass--sculpte olympe-press flex cursor-pointer items-center gap-2 rounded-[18px] py-1.5 pr-3 pl-1.5 text-left focus-visible:ring-4 focus-visible:ring-highlight/60 focus-visible:outline-none"
      >
        {/* Le disque de niveau : violet marque, liseré or — même vocabulaire
            que l'écusson du bandeau sur les autres écrans. Il porte le NIVEAU
            en chiffre ; le blason à sa droite porte le PALIER. Deux échelles,
            deux objets, et on ne les confond pas. */}
        <span
          className="font-heading grid size-8 shrink-0 place-items-center rounded-full bg-primary text-xs font-extrabold text-primary-foreground ring-2 ring-highlight/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"
          aria-hidden="true"
        >
          {info.level}
        </span>

        <RankBadge
          rank={rank}
          size={34}
          hideDivision
          className="shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]"
        />

        <span className="flex flex-col gap-[3px]">
          <span className="text-[0.62rem] leading-tight font-extrabold tracking-wider text-highlight uppercase">
            {rank.label}
          </span>
          <span className="font-heading flex items-center gap-1 text-sm leading-none font-extrabold text-[#faf6ef]">
            {hasDivision ? (
              <>
                {rank.inDivision}
                <span className="text-[0.65rem] text-white/65">
                  / {DIVISION_SPAN}
                </span>
              </>
            ) : (
              trophies.toLocaleString('fr-FR')
            )}
            <Trophy
              className="size-3.5 shrink-0 text-highlight"
              strokeWidth={2.6}
              aria-hidden="true"
            />
          </span>
          {/* LA jauge — violette, celle du rang. Creusée dans le verre, comme
              la barre de l'écran de chargement. */}
          {hasDivision ? (
            <span
              className="h-1.5 w-24 overflow-hidden rounded-full bg-black/40 ring-1 ring-white/15 ring-inset"
              aria-hidden="true"
            >
              <span
                className="block h-full rounded-full bg-[color-mix(in_oklch,var(--primary),white_30%)]"
                style={{ width: `${Math.round(rank.progress * 100)}%` }}
              />
            </span>
          ) : null}
        </span>
      </button>

      {open ? <ProfileModal data={data} onClose={() => setOpen(false)} /> : null}
    </>
  )
}
