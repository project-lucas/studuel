'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Gamepad2, X } from 'lucide-react'
import { ChevronRightIcon } from '@/components/defi/icons'
import { sfx } from '@/lib/sounds'
import {
  buildModeTickets,
  filterTickets,
  CATEGORY_LABELS,
  MODE_FILTERS,
  type ModeCategory,
  type ModeFilter,
  type ModeTicket,
} from '@/lib/defi/modes-catalog'

// Robe de chaque famille de billets — même vocabulaire que les gros boutons
// de l'arène : or = compétitif, bleu = Arène, violet = salons, vert = à deux.
const TICKET_CLASS: Record<ModeCategory, string> = {
  competitif:
    'border-[oklch(0.72_0.16_70)] bg-gradient-to-b from-[oklch(0.6_0.14_75)] to-[oklch(0.48_0.13_70)]',
  arene:
    'border-[oklch(0.7_0.12_255)] bg-gradient-to-b from-[oklch(0.58_0.15_255)] to-[oklch(0.46_0.16_262)]',
  matieres:
    'border-[oklch(0.62_0.18_300)] bg-gradient-to-b from-[oklch(0.52_0.19_300)] to-[oklch(0.4_0.19_302)]',
  duo: 'border-[oklch(0.68_0.14_150)] bg-gradient-to-b from-[oklch(0.56_0.15_150)] to-[oklch(0.44_0.15_152)]',
}

// Fond opaque des zones collantes de la feuille : le même mélange que
// .defi3-sheet (globals.css), pour que les billets glissent dessous sans
// transparaître.
const SHEET_BG = 'bg-[color-mix(in_oklch,var(--primary)_34%,oklch(0.17_0.035_300))]'

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

  const base = `relative flex min-h-[64px] overflow-hidden rounded-2xl border ${TICKET_CLASS[ticket.category]}`

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
 * Le bouton « MODES DE JEU » de l'arène et sa feuille : au tap, un panneau
 * monte du bas (même mécanique que les feuilles d'orbes) avec TOUS les modes
 * en billets. Comme le catalogue est fourni, une rangée de puces de filtre
 * reste collée en haut — on tape une famille au lieu de scroller longtemps.
 */
export default function ModesSheet({ todayKey }: { todayKey: string }) {
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState<ModeFilter>('tous')
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

  const tickets = buildModeTickets(todayKey)
  const visible = filterTickets(tickets, filter)
  // Sans filtre, la liste est rythmée par ses titres de section (« Modes
  // compétitifs »…) ; filtrée, elle est courte et se passe de titres.
  const grouped =
    filter === 'tous'
      ? MODE_FILTERS.filter((f) => f.id !== 'tous').map(({ id }) => ({
          category: id as ModeCategory,
          tickets: visible.filter((t) => t.category === id),
        }))
      : null

  return (
    <>
      <button
        type="button"
        onClick={() => {
          sfx.tap()
          setOpen(true)
        }}
        aria-haspopup="dialog"
        aria-label="Modes de jeu — tous les modes du Défi"
        className="defi2-press flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-2xl border border-[oklch(0.62_0.18_300)] bg-gradient-to-b from-[oklch(0.56_0.2_300)] to-[oklch(0.44_0.2_302)] px-5 py-3 text-center shadow-[0_14px_30px_-10px_oklch(0.4_0.2_300)] focus-visible:ring-4 focus-visible:ring-white/40 focus-visible:outline-none"
      >
        <Gamepad2 className="size-6 text-white" aria-hidden="true" />
        <span className="flex flex-col items-start leading-tight">
          <span className="font-heading text-lg font-extrabold text-white">
            MODES DE JEU
          </span>
          <span className="text-[0.7rem] font-bold text-white/75">
            Classé · Arène · Salons · 2v2
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
                      {/* Puces de filtre, collées en haut du scroll. */}
                      <div
                        role="tablist"
                        aria-label="Filtrer les modes"
                        className={`sticky top-0 z-10 flex gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${SHEET_BG}`}
                      >
                        {MODE_FILTERS.map(({ id, label }) => (
                          <button
                            key={id}
                            type="button"
                            role="tab"
                            aria-selected={filter === id}
                            onClick={() => {
                              sfx.tap()
                              setFilter(id)
                            }}
                            className={`defi2-press shrink-0 rounded-full border px-3.5 py-2 font-heading text-sm font-extrabold whitespace-nowrap focus-visible:ring-4 focus-visible:ring-white/40 focus-visible:outline-none ${
                              filter === id
                                ? 'border-highlight bg-highlight text-[oklch(0.24_0.05_300)]'
                                : 'border-white/12 bg-white/6 text-white/70'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>

                      <div className="flex flex-col gap-2.5 px-4 pt-1 pb-4">
                        {grouped ? (
                          grouped.map(({ category, tickets: list }) =>
                            list.length > 0 ? (
                              <section
                                key={category}
                                className="flex flex-col gap-2.5"
                                aria-label={CATEGORY_LABELS[category]}
                              >
                                <h3 className="font-heading pt-1 text-center text-sm font-extrabold tracking-wide text-white/80 uppercase">
                                  {CATEGORY_LABELS[category]}
                                </h3>
                                {list.map((t) => (
                                  <Ticket key={t.id} ticket={t} />
                                ))}
                              </section>
                            ) : null,
                          )
                        ) : (
                          visible.map((t) => <Ticket key={t.id} ticket={t} />)
                        )}
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
