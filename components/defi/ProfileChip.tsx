'use client'

import { useState } from 'react'
import ProfileModal from '@/components/defi/ProfileModal'
import { walletLevelInfo } from '@/lib/wallet'
import type { ProfileData } from '@/app/defi/profile-actions'
import { sfx } from '@/lib/sounds'

/**
 * La pastille NIVEAU du HUD, en haut-gauche de l'arène — verre de nuit + or,
 * le matériau commun de TOUT le HUD de l'arène (bandeau, rang, jetons) hérité
 * de l'écran de chargement. C'est la SEULE lecture du
 * niveau sur cet écran (le bandeau TopHud replie sa pastille sur /defi, le
 * socle du personnage ne porte que le prénom) : disque de niveau + « Niveau X »
 * + barre d'XP au format « 750 / 1 000 XP ». Le remplissage de la barre est le
 * MÊME ratio que le libellé (xp cumulée / seuil du prochain niveau) — barre et
 * chiffres racontent la même histoire, fini l'anneau à 38 % sous un libellé qui
 * se lisait 75 %. Un tap ouvre la modale de profil (stats, badges, bannières).
 */
export default function ProfileChip({ data }: { data: ProfileData }) {
  const [open, setOpen] = useState(false)
  const info = walletLevelInfo(data.summary.totalXp)
  const pct =
    info.nextAt > 0
      ? Math.min(100, Math.round((info.currentXp / info.nextAt) * 100))
      : 100
  const xpLabel = `${info.currentXp.toLocaleString('fr-FR')} / ${info.nextAt.toLocaleString('fr-FR')} XP`

  return (
    <>
      <button
        type="button"
        onClick={() => {
          sfx.tap()
          setOpen(true)
        }}
        aria-haspopup="dialog"
        aria-label={`Niveau ${info.level}, ${xpLabel} — voir mes stats et badges`}
        className="olympe-glass olympe-press flex cursor-pointer items-center gap-2 rounded-full py-1.5 pr-3 pl-1.5 text-left focus-visible:ring-4 focus-visible:ring-highlight/60 focus-visible:outline-none"
      >
        {/* Le disque de niveau : violet marque, liseré or — même vocabulaire
            que l'écusson du bandeau sur les autres écrans. */}
        <span
          className="font-heading grid size-8 shrink-0 place-items-center rounded-full bg-primary text-xs font-extrabold text-primary-foreground ring-2 ring-highlight/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"
          aria-hidden="true"
        >
          {info.level}
        </span>
        <span className="flex flex-col gap-[3px]">
          <span className="font-heading text-xs leading-none font-extrabold text-[#faf6ef]">
            Niveau {info.level}
          </span>
          {/* Gouttière creusée dans le verre (même grammaire que la barre de
              l'écran de chargement) : l'or n'est plus posé sur du crème, il
              brille dans une rainure sombre. */}
          <span
            className="h-1.5 w-24 overflow-hidden rounded-full bg-black/40 ring-1 ring-white/15 ring-inset"
            aria-hidden="true"
          >
            <span
              className="block h-full rounded-full bg-highlight shadow-[0_0_8px_color-mix(in_oklch,var(--highlight),transparent_45%)]"
              style={{ width: `${pct}%` }}
            />
          </span>
          <span className="text-[0.6rem] leading-none font-bold tracking-wide text-white/70">
            {xpLabel}
          </span>
        </span>
      </button>

      {open ? <ProfileModal data={data} onClose={() => setOpen(false)} /> : null}
    </>
  )
}
