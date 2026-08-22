'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, useReducedMotion } from 'framer-motion'
import { Check, Lock } from 'lucide-react'
import SheetShell from '@/components/defi/SheetShell'
import { FLANK_CLASS } from '@/components/defi/ArenaActionBar'
import { useDuelSubject } from '@/components/defi/DuelSubjectProvider'
import SubjectIcon from '@/components/SubjectIcon'
import { sfx } from '@/lib/sounds'

/**
 * LE FLANC DROIT DE LA BARRE — la matière du combat, et la feuille qui la change.
 *
 * Il remplace la roulette à tambour. Celle-ci demandait DEUX gestes distincts
 * pour la même chose (deux chevrons de 16 px de haut, ou un balayage vertical),
 * ne montrait qu'une matière à la fois, et obligeait à traverser tout
 * l'alphabet pour aller d'Anglais à SVT — six taps sur une cible haute comme un
 * ongle. Elle imposait surtout au flanc une géométrie de cylindre que les deux
 * autres plaques n'avaient pas : trois formes, trois grammaires, une seule
 * rangée.
 *
 * Un tap, une feuille, toutes les matières visibles, une cible par matière. Le
 * geste est plus court dans le pire cas comme dans le meilleur, et le flanc
 * redevient une plaque comme ses deux voisines.
 *
 * IL MONTRE LA MATIÈRE ACTIVE, pas un cadenas générique : l'icône de trait de
 * la matière (`subjectIcon`, la même que partout dans l'app) et non sa vignette
 * illustrée — celle-ci est dessinée pour le crème des cartes de Réviser, et sur
 * une plaque sombre ses contours d'encre se confondent avec le fond. Le verrou
 * du classé se dit par une pastille de 8 px dans l'angle, qui ne mange pas
 * l'icône.
 */
export default function SubjectPlate() {
  const { board, index, active, select } = useDuelSubject()
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()

  if (board.length === 0 || !active) return null

  const locked = !active.unlocked

  return (
    <>
      <button
        type="button"
        onClick={() => {
          sfx.tap()
          setOpen(true)
        }}
        aria-haspopup="dialog"
        aria-label={`Matière du duel : ${active.subject}, ${active.trophies} trophées${
          locked ? ' — pas encore ouverte au classé' : ''
        }. Appuie pour en choisir une autre.`}
        title={`${active.subject} — ${active.rank.label}`}
        className={`arena-plate arena-plate--dark arena-plate--press ${FLANK_CLASS} relative flex cursor-pointer flex-col items-center justify-center gap-1.5 focus-visible:ring-4 focus-visible:ring-white/60 focus-visible:outline-none`}
      >
        <SubjectIcon slug={active.slug} size={30} strokeWidth={2.3} aria-hidden="true" />
        <span className="arena-plate-label font-heading uppercase">Matière</span>

        {/* La pastille de verrou : elle dit que la matière AFFICHÉE n'est pas
            ouverte au classé, donc que COMBAT repliera sur un jeu. Un point qui
            s'allumerait dès qu'une matière quelconque est fermée serait allumé
            en permanence — c'est-à-dire muet. */}
        {locked ? (
          <span className="arena-plate-dot absolute top-2 right-2" aria-hidden="true" />
        ) : null}
      </button>

      {typeof document !== 'undefined'
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <SheetShell
                  label="Choisir la matière du combat"
                  reduce={reduce}
                  onClose={() => {
                    sfx.back()
                    setOpen(false)
                  }}
                  header={
                    <div className="min-w-0 flex-1">
                      <h2 className="font-heading text-base font-extrabold text-white">
                        Matière du combat
                      </h2>
                      <p className="text-[0.72rem] text-white/60">
                        Le bouton COMBAT lance le duel de la matière choisie.
                      </p>
                    </div>
                  }
                >
                  <ul className="flex flex-col gap-1.5 p-3">
                    {board.map((entry, i) => {
                      const chosen = i === index
                      return (
                        <li key={entry.slug}>
                          <button
                            type="button"
                            onClick={() => {
                              sfx.tap()
                              select(i)
                              setOpen(false)
                            }}
                            aria-current={chosen ? 'true' : undefined}
                            className={`flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none ${
                              chosen
                                ? 'bg-white/15 ring-1 ring-white/25'
                                : 'bg-white/[0.06] hover:bg-white/10'
                            }`}
                          >
                            <SubjectIcon
                              slug={entry.slug}
                              className="size-6 shrink-0 text-white/85"
                              strokeWidth={2.3}
                              aria-hidden="true"
                            />
                            <span className="min-w-0 flex-1">
                              <span className="font-heading block truncate text-sm font-extrabold text-white">
                                {entry.subject}
                              </span>
                              <span className="block text-[0.7rem] text-white/60">
                                {entry.trophies} trophées · {entry.rank.label}
                              </span>
                            </span>

                            {/* Le verrou du classé, dit en toutes lettres ici :
                                la feuille a la place que la plaque n'a pas. */}
                            {entry.unlocked ? null : (
                              <span
                                className="flex shrink-0 items-center gap-1 rounded-full bg-black/35 px-2 py-1 text-[0.62rem] font-bold text-white/70"
                                title="Classé fermé — termine un chapitre"
                              >
                                <Lock className="size-3" strokeWidth={2.8} aria-hidden="true" />
                                Classé fermé
                              </span>
                            )}
                            {chosen ? (
                              <Check
                                className="text-highlight size-5 shrink-0"
                                strokeWidth={3}
                                aria-hidden="true"
                              />
                            ) : null}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </SheetShell>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}

      {/* Le changement de matière est une information, pas seulement une image :
          sans région vivante, un lecteur d'écran ne l'apprendrait qu'en revenant
          sur la plaque. */}
      <span className="sr-only" aria-live="polite">
        {active.subject}
      </span>
    </>
  )
}
