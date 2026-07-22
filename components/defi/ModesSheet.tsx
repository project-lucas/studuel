'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Gamepad2, ChevronLeft, ChevronRight, Swords, X } from 'lucide-react'
import { ChevronRightIcon } from '@/components/defi/icons'
import { sfx } from '@/lib/sounds'
import {
  ROULETTE_SUBJECTS,
  subjectGameTickets,
  subjectBossTicket,
  funModeTickets,
  type ModeTicket,
  type ModeTone,
} from '@/lib/defi/modes-catalog'

// Robe de chaque billet selon sa famille — même vocabulaire que l'arène :
// violet = jeu de matière, bleu = mode fun de l'Arène, or = mode du jour.
// Dégradé VERTICAL façon Clash Royale : plus clair en haut, plus foncé en bas.
const TICKET_CLASS: Record<ModeTone, string> = {
  matiere:
    'bg-gradient-to-b from-[oklch(0.62_0.19_300)] to-[oklch(0.41_0.2_302)]',
  fun: 'bg-gradient-to-b from-[oklch(0.66_0.14_255)] to-[oklch(0.44_0.16_262)]',
  featured:
    'bg-gradient-to-b from-[oklch(0.72_0.14_80)] to-[oklch(0.49_0.13_70)]',
}

// Un billet de mode, façon carte « Modes de jeu » de Clash Royale, pleine
// largeur (essai : le talon détachable a été retiré — les encoches demi-lune
// du masque .defi-ticket sont neutralisées via --tk-notch, les coins crantés
// restent). Le billet porte le TITRE cartoon (blanc, contour sombre épais) et
// soit la SCÈNE plein-fond (bannière 16:9, sujet dans le tiers droit,
// désormais visible en entier), soit la GRANDE illustration détourée ancrée
// en bas à droite sur robe unie. Le ruban (« ×2 XP », « Bientôt ») se pose
// discrètement en coin haut-gauche.
function Ticket({ ticket }: { ticket: ModeTicket }) {
  const disabled = !ticket.href

  const inner = (
    <span
      className={`defi-ticket relative flex h-[136px] overflow-hidden rounded-[18px] ${TICKET_CLASS[ticket.tone]}`}
      style={{ '--tk-notch': '0px' } as CSSProperties}
    >
      {/* Corps pleine largeur : titre à gauche, scène plein-fond OU grand art
          ancré en bas à droite. */}
      <span className="relative min-w-0 flex-1">
        {ticket.scene ? (
          /* La SCÈNE plein-fond : elle couvre tout le corps (au-dessus du
             motif losange z-0, sous le biseau z-1 posé après elle dans
             l'arbre), avec un voile dégradé à gauche pour asseoir le titre. */
          <span aria-hidden="true" className="absolute inset-0 z-[1]">
            <Image
              src={ticket.scene}
              alt=""
              fill
              sizes="(max-width: 448px) 92vw, 400px"
              className="object-cover"
            />
            <span className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/15 to-transparent" />
          </span>
        ) : (
          /* La GRANDE illustration : absolue dans la moitié droite du corps,
             ancrée en bas (le bas du perso est coupé net par la carte). */
          <span
            aria-hidden="true"
            className="absolute right-1 bottom-0 z-[5] flex h-[110%] items-end"
          >
            {ticket.image ? (
              <Image
                src={ticket.image}
                alt=""
                width={200}
                height={200}
                className="h-full w-auto object-contain object-bottom drop-shadow-[0_6px_12px_rgba(0,0,0,0.45)]"
              />
            ) : (
              <span className="text-[4.75rem] leading-none drop-shadow-[0_6px_12px_rgba(0,0,0,0.45)]">
                {ticket.emoji}
              </span>
            )}
          </span>
        )}

        {/* Le titre cartoon : très gros, blanc, contour sombre épais, aligné
            à gauche sur 1-2 lignes — et sur une scène, le jeton XP en pastille
            dorée juste dessous. */}
        <span className="relative z-10 flex h-full max-w-[62%] flex-col items-start justify-center gap-1.5 pl-4">
          <span className="defi-ticket-title font-heading line-clamp-2 text-[1.45rem] leading-[1.08] font-extrabold">
            {ticket.name}
          </span>
          {ticket.scene && ticket.chip ? (
            <span className="font-heading rounded-full bg-highlight px-2.5 py-0.5 text-[11px] font-extrabold text-foreground shadow-[0_2px_6px_rgba(0,0,0,0.4)]">
              {ticket.chip}
            </span>
          ) : null}
        </span>
      </span>

      {ticket.badge ? (
        <span
          className={`absolute top-2 left-0 z-20 rounded-r-md px-2 py-0.5 text-[9px] font-extrabold tracking-wide uppercase shadow-[0_2px_4px_rgba(0,0,0,0.35)] ${
            ticket.badge === 'Bientôt'
              ? 'bg-black/45 text-white/85'
              : 'bg-destructive text-white'
          }`}
        >
          {ticket.badge}
        </span>
      ) : null}
    </span>
  )

  // L'anneau de focus vit sur l'élément parent NON masqué (le mask du billet
  // rognerait le ring). Effet « press » : la carte se tasse au tap (scale).
  if (ticket.href) {
    return (
      <Link
        href={ticket.href}
        onClick={() => sfx.tap()}
        className="block rounded-[18px] transition-transform duration-100 ease-out focus-visible:ring-4 focus-visible:ring-highlight/60 focus-visible:outline-none active:scale-[0.97]"
      >
        {inner}
      </Link>
    )
  }
  return <div className={disabled ? 'opacity-55' : undefined}>{inner}</div>
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
  const bossTicket = subjectBossTicket(subject)
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
        aria-label="Modes de jeu — jeux par matière, modes fun et boss"
        className="olympe-gem olympe-press relative isolate flex min-h-14 w-full cursor-pointer items-center gap-2.5 overflow-hidden rounded-2xl px-5 focus-visible:ring-4 focus-visible:ring-white/40 focus-visible:outline-none"
      >
        {/* Scène plein-fond (batch 14) : mascotte manette à droite, voile
            dégradé à gauche pour asseoir le texte — la robe gemme reste le
            cadre et le repli. Même grammaire que les billets. */}
        <span aria-hidden="true" className="absolute inset-0 -z-10">
          <Image
            src="/images/defi/modes-scene.webp"
            alt=""
            fill
            sizes="(max-width: 480px) 94vw, 424px"
            className="object-cover"
          />
          <span className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />
        </span>
        <Gamepad2 className="size-6 text-white" aria-hidden="true" />
        <span className="flex flex-col items-start leading-tight">
          <span className="font-heading text-lg font-extrabold text-white">
            MODES DE JEU
          </span>
          <span className="text-[0.7rem] font-bold text-white/75">
            Jeux par matière · Modes fun · Boss
          </span>
        </span>
        <ChevronRightIcon className="ml-auto size-5 rotate-90 text-white/70" />
      </button>

      {typeof document !== 'undefined'
        ? createPortal(
            <AnimatePresence>
              {open ? (
                // L'espace PLEIN ÉCRAN : opaque, au-dessus de la barre d'onglets
                // (z-[70] > nav en z-50), il monte du bas et couvre tout.
                <motion.div
                  data-no-swipe
                  className="defi-modes-screen fixed inset-0 z-[70] flex flex-col"
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
                        sfx.tap()
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
                      {gameTickets.map((t) => (
                        <Ticket key={t.id} ticket={t} />
                      ))}
                      {/* Le gardien de la matière — mène à l'onglet Boss de
                          sa page matière (combat 100 % matière). */}
                      {bossTicket ? <Ticket ticket={bossTicket} /> : null}

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
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  )
}
