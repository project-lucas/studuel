'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Gamepad2, Swords, X } from 'lucide-react'
import ModeTicketCard from '@/components/defi/ModeTicket'
import { FLANK_CLASS } from '@/components/defi/ArenaActionBar'
import SubjectRoulette from '@/components/defi/SubjectRoulette'
import { sfx } from '@/lib/sounds'
import { useDialogFocus } from '@/lib/use-dialog'
import { useRecords } from '@/lib/jeux/use-records'
import {
  ROULETTE_SUBJECTS,
  subjectGameTickets,
  funModeTickets,
  type ModeTicket,
} from '@/lib/defi/modes-catalog'

/**
 * La LISTE de billets d'une section, avec le record personnel de chacun. Les
 * records se lisent en une fois (localStorage, après montage) : chaque billet
 * annonce ainsi le chiffre à battre avant même qu'on tape dessus.
 */
function TicketList({ tickets }: { tickets: ModeTicket[] }) {
  const records = useRecords(
    tickets.flatMap((t) => (t.recordKey ? [t.recordKey] : [])),
  )
  return (
    <>
      {tickets.map((t) => (
        <ModeTicketCard
          key={t.id}
          ticket={t}
          record={
            records && t.recordKey ? (records[t.recordKey] ?? 0) : null
          }
        />
      ))}
    </>
  )
}

/**
 * Le bouton « MODES DE JEU » de l'arène et sa feuille. Au tap, un panneau monte
 * du bas (même mécanique que les feuilles d'orbes). En haut, la ROULETTE de
 * matières ; en dessous, les JEUX de la matière choisie, puis les MODES FUN de
 * l'Arène (communs à toutes les matières). Le « Duel en direct » (QR) vit ici en
 * icône flottante (en-tête, haut à droite) ; le Match classé garde son CTA sur
 * l'écran d'arène.
 */
export default function ModesSheet({
  todayKey,
  liveDuel = false,
}: {
  todayKey: string
  /** Élève connecté : affiche l'icône flottante « Duel en direct » (QR). */
  liveDuel?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const reduce = useReducedMotion()
  const panel = useRef<HTMLDivElement>(null)
  useDialogFocus(panel, open)

  // Fermeture au clavier (Échap) + verrou du défilement de la page tant que
  // l'espace plein écran est ouvert (il couvre tout, la page derrière ne doit
  // pas glisser).
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  const subject = ROULETTE_SUBJECTS[activeIndex]?.subject ?? ''
  const gameTickets = subjectGameTickets(subject)
  const funTickets = funModeTickets(todayKey)

  return (
    <>
      {/* Le déclencheur : PLAQUE DE FLANC, jumelle de celle qui tient l'autre
          bord — même largeur, même biseau, même rayon, même ombre portée, et la
          même grammaire interne : une icône de 30 px, puis le mot qui nomme la
          plaque. Deux jumelles encadrent ; deux accessoires dépareillés, non.

          Sombre exprès : dans la barre, seul l'or de COMBAT appelle. La gemme
          violette ronde qui occupait ce cadre est partie avec le reste des
          formes rondes — une icône nue sur la plaque suffit, et elle laisse à la
          plaque son rôle de bouton. La liste des modes (Blitz · Chrono · Survie)
          ne tient pas dans 92 px : elle vit dans l'`aria-label` et l'infobulle. */}
      <button
        type="button"
        onClick={() => {
          sfx.tap()
          setOpen(true)
        }}
        aria-haspopup="dialog"
        aria-label="Modes de jeu — jeux par matière, Blitz, Chrono, Survie et boss"
        title="Modes de jeu — Blitz, Chrono, Survie, Boss"
        className={`arena-plate arena-plate--dark arena-plate--press ${FLANK_CLASS} flex cursor-pointer flex-col items-center justify-center gap-1.5 focus-visible:ring-4 focus-visible:ring-white/60 focus-visible:outline-none`}
      >
        <Gamepad2 size={30} strokeWidth={2.3} aria-hidden="true" />
        <span className="arena-plate-label font-heading uppercase">Modes</span>
      </button>

      {typeof document !== 'undefined'
        ? createPortal(
            <AnimatePresence>
              {open ? (
                // L'espace PLEIN ÉCRAN : opaque, au-dessus de la barre d'onglets
                // (z-[70] > nav en z-50), il monte du bas et couvre tout.
                <motion.div
                  ref={panel}
                  data-no-swipe
                  className="defi-modes-screen fixed inset-0 z-[70] flex flex-col outline-none"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Modes de jeu"
                  initial={reduce ? { opacity: 0 } : { y: '100%' }}
                  animate={reduce ? { opacity: 1 } : { y: 0 }}
                  exit={reduce ? { opacity: 0 } : { y: '100%' }}
                  transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
                >
                  {/* En-tête : gros bouton FERMER (croix, imposante et claire,
                      cohérente avec les autres modales) + bandeau-titre en
                      pierre, façon écran de modes. */}
                  <header className="relative flex shrink-0 flex-col items-center gap-3 px-4 pt-[calc(env(safe-area-inset-top)+0.75rem)] pb-3">
                    <button
                      type="button"
                      onClick={() => {
                        sfx.back()
                        setOpen(false)
                      }}
                      aria-label="Fermer les modes de jeu"
                      className="olympe-gem olympe-press grid size-14 cursor-pointer place-items-center rounded-2xl focus-visible:ring-4 focus-visible:ring-highlight/60 focus-visible:outline-none"
                    >
                      <X
                        className="size-8 text-white"
                        strokeWidth={3}
                        aria-hidden="true"
                      />
                    </button>

                    {/* « Duel en direct » (QR) : icône flottante en haut à droite
                        de l'écran des modes — remplace l'ancien bouton pleine
                        largeur de l'arène. Uniquement pour l'élève connecté. */}
                    {liveDuel ? (
                      <Link
                        href="/defi/duel-rapide"
                        onClick={() => sfx.tap()}
                        aria-label="Duel en direct — invite un ami par QR"
                        title="Duel en direct"
                        className="olympe-gem olympe-press absolute top-[calc(env(safe-area-inset-top)+0.75rem)] right-4 z-10 grid size-14 cursor-pointer place-items-center rounded-2xl focus-visible:ring-4 focus-visible:ring-highlight/60 focus-visible:outline-none"
                      >
                        <Swords className="size-7 text-white" aria-hidden="true" />
                        <span
                          aria-hidden="true"
                          className="font-heading absolute -bottom-2.5 left-1/2 -translate-x-1/2 rounded-full bg-highlight px-1.5 py-0.5 text-[9px] font-extrabold tracking-wide text-foreground uppercase shadow-sm"
                        >
                          Direct
                        </span>
                      </Link>
                    ) : null}

                    <div className="defi-modes-banner flex w-full max-w-md items-center justify-center gap-2 rounded-2xl px-5 py-2.5">
                      <Gamepad2
                        className="size-6 text-highlight"
                        aria-hidden="true"
                      />
                      <h2 className="font-heading text-center text-2xl font-extrabold tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                        Modes de jeu
                      </h2>
                    </div>
                  </header>

                  {/* La roulette de matières, collée sous l'en-tête. */}
                  <div className="shrink-0 border-y border-white/10 bg-black/15 py-1">
                    <div className="mx-auto w-full max-w-md">
                      <SubjectRoulette
                        items={ROULETTE_SUBJECTS}
                        activeIndex={activeIndex}
                        onSelect={setActiveIndex}
                      />
                    </div>
                  </div>

                  {/* Le corps défilant : jeux de la matière, puis modes fun. */}
                  <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                    <div className="mx-auto flex w-full max-w-md flex-col gap-4 px-4 pt-4 pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
                      {/* Les jeux de la matière choisie. */}
                      <h3 className="font-heading flex items-center justify-center gap-2 text-sm font-extrabold tracking-wide text-white/80 uppercase">
                        <span className="text-lg" aria-hidden="true">
                          {ROULETTE_SUBJECTS[activeIndex]?.emoji}
                        </span>
                        Jeux · {subject}
                      </h3>
                      <TicketList tickets={gameTickets} />
                      {/* Le billet « Boss de la matière » a QUITTÉ cette
                          feuille (La Traque, lib/traque) : un gardien ne se
                          choisit plus dans un menu, il se débusque en
                          révisant. Il vit désormais dans la tuile Boss du rail
                          — et Modes redevient une famille cohérente : des
                          modes fun, tous jouables tout de suite. */}

                      {/* Les modes fun de l'Arène, communs à toutes les
                          matières. */}
                      <h3 className="font-heading mt-3 border-t border-white/10 pt-4 text-center text-sm font-extrabold tracking-wide text-white/80 uppercase">
                        Modes fun de l’Arène
                      </h3>
                      <TicketList tickets={funTickets} />
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  )
}
