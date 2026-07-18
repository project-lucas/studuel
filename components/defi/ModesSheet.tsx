'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Gamepad2, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { ChevronRightIcon } from '@/components/defi/icons'
import { sfx } from '@/lib/sounds'
import {
  ROULETTE_SUBJECTS,
  subjectGameTickets,
  funModeTickets,
  type ModeTicket,
  type ModeTone,
} from '@/lib/defi/modes-catalog'

// Robe de chaque billet selon sa famille — même vocabulaire que l'arène :
// violet = jeu de matière, bleu = mode fun de l'Arène, or = mode du jour.
const TICKET_CLASS: Record<ModeTone, string> = {
  matiere:
    'border-[oklch(0.62_0.18_300)] bg-gradient-to-b from-[oklch(0.52_0.19_300)] to-[oklch(0.4_0.19_302)]',
  fun: 'border-[oklch(0.7_0.12_255)] bg-gradient-to-b from-[oklch(0.58_0.15_255)] to-[oklch(0.46_0.16_262)]',
  featured:
    'border-[oklch(0.72_0.16_70)] bg-gradient-to-b from-[oklch(0.6_0.14_75)] to-[oklch(0.48_0.13_70)]',
}

// Fond opaque des zones collantes de la feuille : le même mélange que
// .defi3-sheet (globals.css), pour que les billets glissent dessous sans
// transparaître.
const SHEET_BG =
  'bg-[color-mix(in_oklch,var(--primary)_34%,oklch(0.17_0.035_300))]'

// Un billet de mode, façon ticket Clash Royale : le nom et la promesse à
// gauche, l'emoji dans le talon détachable à droite (pointillés), le ruban
// (« ×2 XP », « Bientôt ») en coin.
function Ticket({ ticket }: { ticket: ModeTicket }) {
  const inner = (
    <>
      <span className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 py-2.5 pl-4">
        <span className="font-heading truncate text-base font-extrabold text-white">
          {ticket.name}
        </span>
        <span className="line-clamp-1 text-[11px] font-semibold text-white/70">
          {ticket.tagline}
        </span>
        {ticket.chip ? (
          <span className="mt-1 self-start rounded-full bg-black/35 px-2 py-0.5 text-[10px] font-extrabold text-highlight">
            {ticket.chip}
          </span>
        ) : null}
      </span>
      <span
        aria-hidden="true"
        className="grid w-16 shrink-0 place-items-center self-stretch border-l-2 border-dashed border-white/30 text-3xl"
      >
        {ticket.emoji}
      </span>
      {ticket.badge ? (
        <span
          className={`absolute top-0 right-12 rounded-b-md px-1.5 py-0.5 text-[9px] font-extrabold tracking-wide uppercase ${
            ticket.badge === 'Bientôt'
              ? 'bg-white/20 text-white/80'
              : 'bg-destructive text-white'
          }`}
        >
          {ticket.badge}
        </span>
      ) : null}
    </>
  )

  const base = `relative flex min-h-[64px] overflow-hidden rounded-2xl border ${TICKET_CLASS[ticket.tone]}`

  if (ticket.href) {
    return (
      <Link
        href={ticket.href}
        onClick={() => sfx.tap()}
        className={`${base} defi2-press shadow-[0_10px_24px_-12px_rgba(0,0,0,0.9)] focus-visible:ring-4 focus-visible:ring-white/40 focus-visible:outline-none`}
      >
        {inner}
      </Link>
    )
  }
  return <div className={`${base} opacity-60`}>{inner}</div>
}

/**
 * La roulette de matières : une rangée de crans qui défile (snap-scroll), avec
 * deux chevrons pour la faire tourner cran par cran. Le cran centré est le
 * « sélectionné » — il pilote les jeux affichés dessous. On peut aussi taper un
 * cran directement. La sélection suit le scroll (on lit le cran le plus proche
 * du centre), pour un vrai ressenti de roulette.
 */
function SubjectRoulette({
  activeIndex,
  onSelect,
}: {
  activeIndex: number
  onSelect: (index: number) => void
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([])
  const rafRef = useRef<number | null>(null)

  // Centre le cran d'index donné dans la piste (scroll horizontal contrôlé,
  // jamais scrollIntoView qui ferait aussi bouger la page verticalement).
  const centerCard = useCallback((index: number) => {
    const track = trackRef.current
    const card = cardRefs.current[index]
    if (!track || !card) return
    const left =
      card.offsetLeft - (track.clientWidth - card.clientWidth) / 2
    track.scrollTo({ left, behavior: 'smooth' })
  }, [])

  // Au scroll, on élit le cran dont le centre est le plus proche du centre de
  // la piste et on le sélectionne (throttlé à un rAF).
  const onScroll = useCallback(() => {
    if (rafRef.current !== null) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      const track = trackRef.current
      if (!track) return
      const mid = track.scrollLeft + track.clientWidth / 2
      let best = 0
      let bestDist = Infinity
      cardRefs.current.forEach((card, i) => {
        if (!card) return
        const center = card.offsetLeft + card.clientWidth / 2
        const dist = Math.abs(center - mid)
        if (dist < bestDist) {
          bestDist = dist
          best = i
        }
      })
      onSelect(best)
    })
  }, [onSelect])

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const step = (delta: number) => {
    const next = Math.max(
      0,
      Math.min(ROULETTE_SUBJECTS.length - 1, activeIndex + delta),
    )
    if (next === activeIndex) return
    sfx.tap()
    onSelect(next)
    centerCard(next)
  }

  return (
    <div className="flex items-center gap-1 px-2">
      <button
        type="button"
        onClick={() => step(-1)}
        disabled={activeIndex === 0}
        aria-label="Matière précédente"
        className="grid size-9 shrink-0 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/10 disabled:opacity-30 active:scale-90"
      >
        <ChevronLeft className="size-5" strokeWidth={2.6} aria-hidden="true" />
      </button>

      <div
        ref={trackRef}
        onScroll={onScroll}
        role="tablist"
        aria-label="Choisis ta matière"
        className="flex flex-1 snap-x snap-mandatory gap-2.5 overflow-x-auto scroll-px-4 px-[38%] py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {ROULETTE_SUBJECTS.map((s, i) => {
          const isActive = i === activeIndex
          return (
            <button
              key={s.subject}
              ref={(el) => {
                cardRefs.current[i] = el
              }}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                sfx.tap()
                onSelect(i)
                centerCard(i)
              }}
              className={`flex aspect-square w-[4.75rem] shrink-0 snap-center flex-col items-center justify-center gap-1 rounded-2xl border p-1 transition-all ${
                isActive
                  ? 'scale-105 border-highlight bg-highlight/15 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.8)]'
                  : 'scale-90 border-white/10 bg-white/5 opacity-70'
              }`}
            >
              <span className="text-2xl leading-none" aria-hidden="true">
                {s.emoji}
              </span>
              <span
                className={`font-heading line-clamp-1 text-[10px] font-extrabold ${
                  isActive ? 'text-white' : 'text-white/70'
                }`}
              >
                {s.subject}
              </span>
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() => step(1)}
        disabled={activeIndex === ROULETTE_SUBJECTS.length - 1}
        aria-label="Matière suivante"
        className="grid size-9 shrink-0 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/10 disabled:opacity-30 active:scale-90"
      >
        <ChevronRight className="size-5" strokeWidth={2.6} aria-hidden="true" />
      </button>
    </div>
  )
}

/**
 * Le bouton « MODES DE JEU » de l'arène et sa feuille. Au tap, un panneau monte
 * du bas (même mécanique que les feuilles d'orbes). En haut, la ROULETTE de
 * matières ; en dessous, les JEUX de la matière choisie, puis les MODES FUN de
 * l'Arène (communs à toutes les matières). Le compétitif (Match classé, Duel en
 * direct) n'est PAS repris ici : il a ses propres boutons sur l'écran d'arène.
 */
export default function ModesSheet({ todayKey }: { todayKey: string }) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const reduce = useReducedMotion()

  // Fermeture au clavier (Échap), comme les autres feuilles de l'arène.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const subject = ROULETTE_SUBJECTS[activeIndex]?.subject ?? ''
  const gameTickets = subjectGameTickets(subject)
  const funTickets = funModeTickets(todayKey)

  return (
    <>
      <button
        type="button"
        onClick={() => {
          sfx.tap()
          setOpen(true)
        }}
        aria-haspopup="dialog"
        aria-label="Modes de jeu — choisis ta matière et tes modes"
        className="olympe-gem olympe-press flex min-h-14 w-full cursor-pointer items-center gap-2.5 rounded-2xl px-5 focus-visible:ring-4 focus-visible:ring-white/40 focus-visible:outline-none"
      >
        <Gamepad2 className="size-6 text-white" aria-hidden="true" />
        <span className="flex flex-col items-start leading-tight">
          <span className="font-heading text-lg font-extrabold text-white">
            MODES DE JEU
          </span>
          <span className="text-[0.7rem] font-bold text-white/75">
            Choisis ta matière · Modes fun
          </span>
        </span>
        <ChevronRightIcon className="ml-auto size-5 rotate-90 text-white/70" />
      </button>

      {typeof document !== 'undefined'
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <motion.div
                  className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 sm:items-center sm:p-4"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Modes de jeu"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  onClick={() => setOpen(false)}
                >
                  {/* data-no-swipe : le geste d'onglets ne vole pas les taps
                      dans la feuille (SwipeTabs écoute window). */}
                  <motion.div
                    data-no-swipe
                    className="defi3-sheet w-full max-w-md"
                    initial={reduce ? { opacity: 0 } : { y: '100%' }}
                    animate={reduce ? { opacity: 1 } : { y: 0 }}
                    exit={reduce ? { opacity: 0 } : { y: '100%' }}
                    transition={{ type: 'tween', duration: 0.26, ease: 'easeOut' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
                      <span
                        className="grid size-9 shrink-0 place-items-center rounded-xl border border-white/12 bg-white/8 leading-none"
                        aria-hidden="true"
                      >
                        <Gamepad2 className="size-5 text-white" />
                      </span>
                      <h2 className="font-heading min-w-0 flex-1 truncate text-lg font-extrabold text-white">
                        Modes de jeu
                      </h2>
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        aria-label="Fermer"
                        className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 active:scale-90"
                      >
                        <X className="size-5" strokeWidth={2.4} aria-hidden="true" />
                      </button>
                    </div>

                    <div className="max-h-[72dvh] overflow-y-auto overscroll-contain pb-[env(safe-area-inset-bottom)]">
                      {/* La roulette de matières, collée en haut du scroll. */}
                      <div
                        className={`sticky top-0 z-10 border-b border-white/8 pb-2 pt-1 ${SHEET_BG}`}
                      >
                        <SubjectRoulette
                          activeIndex={activeIndex}
                          onSelect={setActiveIndex}
                        />
                      </div>

                      <div className="flex flex-col gap-2.5 px-4 pt-3 pb-4">
                        {/* Les jeux de la matière choisie. */}
                        <h3 className="font-heading flex items-center gap-2 text-center text-sm font-extrabold tracking-wide text-white/80 uppercase">
                          <span className="text-lg" aria-hidden="true">
                            {ROULETTE_SUBJECTS[activeIndex]?.emoji}
                          </span>
                          Jeux · {subject}
                        </h3>
                        {gameTickets.map((t) => (
                          <Ticket key={t.id} ticket={t} />
                        ))}

                        {/* Les modes fun de l'Arène, communs à toutes les
                            matières. */}
                        <h3 className="font-heading mt-3 border-t border-white/10 pt-4 text-center text-sm font-extrabold tracking-wide text-white/80 uppercase">
                          Modes fun de l’Arène
                        </h3>
                        {funTickets.map((t) => (
                          <Ticket key={t.id} ticket={t} />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  )
}
