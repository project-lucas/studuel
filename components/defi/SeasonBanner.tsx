'use client'

import { useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, useReducedMotion } from 'framer-motion'
import { Crown } from 'lucide-react'
import { sfx } from '@/lib/sounds'
import SheetShell from './SheetShell'
import { NotificationBadge } from './SculptedPlate'

/**
 * Le bandeau de saison, LA BANDE DU HAUT de l'arène (centrée entre la pastille
 * de niveau et les pièces, façon Pass Royale) : couronne, numéro de saison,
 * barre du palier en cours et compte à rebours — et LA porte du Pass de saison.
 *
 * Il était collé au bloc CTA, en bas : le rendez-vous du mois se lisait sous le
 * personnage, écrasé entre les jauges de traque et le bouton Duel, alors que
 * c'est l'information de CADRE de l'écran (« où en est la saison »). Monté en
 * haut, il prend le matériau du HUD (verre de nuit) et la place que le départ
 * de l'engrenage a libérée.
 *
 * Avant, la saison était présente DEUX fois sur le même écran : une tuile
 * dorée « Pass » à couronne dans la grappe de droite, et ce bandeau à couronne
 * en bas. Deux couronnes, deux entrées, un seul concept — et le bandeau, lui,
 * n'était même pas cliquable (il affichait une progression sans dire où aller
 * la chercher). La tuile a donc été supprimée : la grappe de droite ne garde
 * que des OBJETS illustrés (coupe, coffre), et la saison vit là où on lit déjà
 * son avancement. Une info, une place.
 */
export default function SeasonBanner({
  number,
  name,
  progress,
  countdown,
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
  /** Compte à rebours de fin de saison (« Plus que 3 jours »). */
  countdown: string
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
        className="olympe-glass olympe-press relative mx-auto flex w-full max-w-80 cursor-pointer items-center gap-2.5 rounded-full px-3 py-1.5 text-[0.68rem] font-extrabold focus-visible:ring-4 focus-visible:ring-highlight/60 focus-visible:outline-none"
      >
        <span className="flex shrink-0 items-center gap-1.5">
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
          className={`shrink-0 ${
            isLastDay ? 'font-extrabold text-destructive' : 'text-[#ffe9b3]'
          }`}
        >
          {countdown}
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
