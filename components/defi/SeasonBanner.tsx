'use client'

import { useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, useReducedMotion } from 'framer-motion'
import { Crown } from 'lucide-react'
import { sfx } from '@/lib/sounds'
import SheetShell from './SheetShell'
import { NotificationBadge } from './SculptedPlate'

/**
 * La bande de saison — le second cran de la colonne d'identité, JUSTE SOUS la
 * plaque du joueur : couronne, numéro de saison, jauge du palier en cours et
 * compte à rebours — et LA porte du Pass de saison.
 *
 * Elle prend exactement la LARGEUR de la plaque au-dessus (`w-[12.5rem]`) et
 * son rayon : les deux objets font une colonne aux bords alignés. Avant, une
 * pilule plus large que la plaque, arrondie autrement, avec « 26 jours
 * restants » en toutes lettres qui laissait dix pixels à la jauge — elle se
 * lisait comme un troisième objet posé là, pas comme la suite de la carte.
 * Le compte à rebours passe en forme courte (« 26 j ») ; le long vit dans
 * l'étiquette lue à voix haute et dans la feuille.
 *
 * Une info, une place : la saison n'existe qu'ici sur l'arène (la tuile dorée
 * « Pass » de la grappe de droite a été supprimée en juillet).
 */
export default function SeasonBanner({
  number,
  name,
  progress,
  countdown,
  countdownShort,
  isLastDay,
  claimable,
  children,
}: {
  /** Numéro de la saison en cours. */
  number: number
  /** Nom de la saison (titre de la feuille). */
  name: string
  /** Avancement dans le palier en cours (0..1). */
  progress: number
  /** Compte à rebours en toutes lettres (« 26 jours restants »), lu à voix haute. */
  countdown: string
  /** Compte à rebours court (« 26 j »), affiché. */
  countdownShort: string
  /** Dernier jour : le compte à rebours passe en corail. */
  isLastDay: boolean
  /** Nombre de récompenses de palier à réclamer (0 = aucune pastille). */
  claimable: number
  /** Le contenu de la feuille (SeasonTrack, rendu côté serveur). */
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()

  return (
    <>
      <button
        type="button"
        onClick={() => {
          sfx.tap()
          setOpen(true)
        }}
        aria-haspopup="dialog"
        aria-label={`Saison ${number} : ${name}. ${countdown}.${
          claimable > 0
            ? ` ${claimable} récompense${claimable > 1 ? 's' : ''} à réclamer.`
            : ''
        } Ouvrir le Pass de saison`}
        className="olympe-glass olympe-glass--sculpte olympe-press relative flex w-[12.5rem] cursor-pointer items-center gap-2 rounded-[14px] px-2.5 py-1.5 text-[0.66rem] font-extrabold focus-visible:ring-4 focus-visible:ring-highlight/60 focus-visible:outline-none"
      >
        <span className="flex shrink-0 items-center gap-1 whitespace-nowrap">
          <Crown
            className="size-3.5 shrink-0 text-highlight"
            strokeWidth={2.4}
            aria-hidden="true"
          />
          Saison {number}
        </span>
        <span
          className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-black/40 ring-1 ring-white/15 ring-inset"
          aria-hidden="true"
        >
          <span
            className="block h-full rounded-full bg-highlight"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </span>
        <span
          className={`shrink-0 whitespace-nowrap tabular-nums ${
            isLastDay ? 'font-extrabold text-destructive' : 'text-[#ffe9b3]'
          }`}
        >
          {countdownShort}
        </span>
        {/* Le dû se voit sans ouvrir : même pastille corail que les tuiles des
            rails — un seul style de compteur pour tout l'écran. */}
        {claimable > 0 ? (
          <NotificationBadge tone="alert" className="absolute -top-2 -right-1.5">
            {claimable}
          </NotificationBadge>
        ) : null}
      </button>

      {typeof document !== 'undefined'
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <SheetShell
                  label={`Saison ${number} · ${name}`}
                  reduce={reduce}
                  onClose={() => setOpen(false)}
                  header={
                    <>
                      <span
                        className="grid size-9 shrink-0 place-items-center rounded-xl border border-white/12 bg-white/8"
                        aria-hidden="true"
                      >
                        <Crown
                          className="size-5 text-highlight"
                          strokeWidth={2.4}
                        />
                      </span>
                      <h2 className="font-heading min-w-0 flex-1 truncate text-lg font-extrabold text-white">
                        Saison {number} · {name}
                      </h2>
                    </>
                  }
                >
                  {children}
                </SheetShell>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  )
}
