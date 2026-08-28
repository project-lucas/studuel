'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Lock, Trophy, X } from 'lucide-react'
import { sfx } from '@/lib/sounds'
import { useDialogFocus } from '@/lib/use-dialog'
import RankBadge from '@/components/defi/RankBadge'
import SubjectRoulette from '@/components/defi/SubjectRoulette'
import TrophyRules from '@/components/defi/TrophyRules'
import { useDuelSubject } from '@/components/defi/DuelSubjectProvider'
import { bestNextGame, type RosterGame } from '@/lib/defi/roster'
import {
  duelTarget,
  rankedBlockedReason,
  type DuelSubject,
} from '@/lib/defi/duel-board'
import { subjectRankFor, SUBJECT_DIVISION_SPAN } from '@/lib/subject-rank'
import { verrouillerDefilement } from '@/lib/scroll-lock'

/**
 * LA ROUTE DES TROPHÉES — où j'en suis, matière par matière, et pourquoi.
 *
 * Elle a AVALÉ le module de rang qui vivait au-dessus du bouton de combat. Les
 * deux disaient la même chose à deux endroits : un blason avec sa division d'un
 * côté, les compteurs par jeu de l'autre — alors que le blason n'est QUE la
 * lecture de ces compteurs. Les séparer obligeait l'élève à faire le lien
 * lui-même, et coûtait à l'arène son bien le plus rare : la hauteur au-dessus du
 * CTA. Elle quitte donc la rangée de combat pour le HUD, sous Studuel+, avec
 * les autres écrans de LECTURE — la rangée du bas est rendue à l'action.
 *
 * TROIS ÉTAGES, dans l'ordre des questions qu'on se pose :
 *   1. où j'en suis (le blason de la matière, sa division, son pic) ;
 *   2. ce que valent mes prochaines parties (les jeux, avec leur « +N ») ;
 *   3. POURQUOI (`TrophyRules`) — le barème et les conditions, écrits en clair.
 *
 * Le troisième étage est le vrai ajout. La colonne « +10 / +2 » était le moteur
 * du système depuis la 238, mais rien ne disait d'où venaient ces chiffres :
 * un barème qu'on ne comprend pas ne fait pas arbitrer, il fait subir.
 */
export default function TrophyRoadSheet() {
  const { board, index, active, select } = useDuelSubject()
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()
  const panel = useRef<HTMLDivElement>(null)
  useDialogFocus(panel, open)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    const libererDefilement = verrouillerDefilement()
    return () => {
      window.removeEventListener('keydown', onKey)
      libererDefilement()
    }
  }, [open])

  const total = board.reduce((sum, entry) => sum + entry.trophies, 0)
  const advice = bestNextGame(board)
  const target = active ? duelTarget(active) : null
  const targetGame = active?.games.find((g) => g.name === target?.label) ?? null

  return (
    <>
      {/* Le déclencheur : jeton rond de verre de nuit, sous la pastille
          Studuel+ — la robe des COMMANDES du HUD. Rien d'or ici : sur cet écran
          l'or appartient au bouton COMBAT, et un second objet doré aurait
          banalisé la dérogation. */}
      <button
        type="button"
        onClick={() => {
          sfx.tap()
          setOpen(true)
        }}
        aria-haspopup="dialog"
        aria-label={`Route des trophées — ${total} trophées, ton rang et le barème matière par matière`}
        title="Route des trophées"
        className="olympe-glass defi2-press relative grid size-11 cursor-pointer place-items-center rounded-full focus-visible:ring-4 focus-visible:ring-highlight/60 focus-visible:outline-none"
      >
        <Trophy
          className="size-5 text-highlight"
          strokeWidth={2.6}
          aria-hidden="true"
        />
      </button>

      {typeof document !== 'undefined'
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <motion.div
                  ref={panel}
                  data-no-swipe
                  className="defi-modes-screen fixed inset-0 z-[70] flex flex-col outline-none"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Route des trophées"
                  initial={reduce ? { opacity: 0 } : { y: '100%' }}
                  animate={reduce ? { opacity: 1 } : { y: 0 }}
                  exit={reduce ? { opacity: 0 } : { y: '100%' }}
                  transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
                >
                  <header className="flex shrink-0 flex-col items-center gap-3 px-4 pt-[calc(env(safe-area-inset-top)+0.75rem)] pb-3">
                    <button
                      type="button"
                      onClick={() => {
                        sfx.back()
                        setOpen(false)
                      }}
                      aria-label="Fermer la route des trophées"
                      className="olympe-gem olympe-press grid size-14 cursor-pointer place-items-center rounded-2xl focus-visible:ring-4 focus-visible:ring-highlight/60 focus-visible:outline-none"
                    >
                      <X className="size-8 text-white" strokeWidth={3} aria-hidden="true" />
                    </button>

                    <div className="defi-modes-banner flex w-full max-w-md items-center justify-center gap-2 rounded-2xl px-5 py-2.5">
                      <Trophy className="size-6 text-highlight" aria-hidden="true" />
                      <h2 className="font-heading text-center text-2xl font-extrabold tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                        {total} trophées
                      </h2>
                    </div>
                  </header>

                  {/* La MÊME roulette que sur l'arène, et le même état : changer
                      de matière ici la change aussi sous le bouton COMBAT. */}
                  <div className="shrink-0 border-y border-white/10 bg-black/15 py-1">
                    <div className="mx-auto w-full max-w-md">
                      <SubjectRoulette
                        items={board.map((entry) => ({
                          subject: entry.subject,
                          emoji: entry.emoji,
                          image: entry.vignette ?? undefined,
                          tint: entry.pastel,
                          badge: String(entry.trophies),
                        }))}
                        activeIndex={index}
                        onSelect={select}
                      />
                    </div>
                  </div>

                  <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                    <div className="mx-auto flex w-full max-w-md flex-col gap-3 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
                      {active ? <SubjectRankCard entry={active} /> : null}

                      {advice ? (
                        <p className="text-center text-[0.72rem] text-white/60">
                          Le plus rentable en ce moment :{' '}
                          <strong className="font-bold text-highlight">
                            {advice.subject.subject} · {advice.game.name}
                          </strong>{' '}
                          — une victoire y vaut +{advice.game.nextWin}.
                        </p>
                      ) : null}

                      {active ? (
                        <section className="rounded-2xl border border-white/10 bg-white/5 p-3">
                          <h3 className="font-heading mb-2 text-sm font-extrabold text-white">
                            Les jeux de {active.subject}
                          </h3>
                          <div className="flex flex-col gap-1.5">
                            {active.games.map((game) => (
                              <GameLine key={game.gameId} game={game} />
                            ))}
                          </div>
                        </section>
                      ) : null}

                      <TrophyRules
                        currentTrophies={targetGame?.trophies}
                        currentGame={targetGame?.name}
                      />
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

/**
 * Le blason de la matière et sa division — ce qui vivait au-dessus du bouton de
 * combat, rendu à l'écran qui l'explique. Le rang n'est pas un second compteur :
 * c'est la lecture du total affiché juste à côté, et les deux se voient
 * maintenant d'un seul coup d'œil.
 */
function SubjectRankCard({ entry }: { entry: DuelSubject }) {
  const rank = entry.rank
  // Le rang juste au-dessus : on relit le rang au seuil de fin de division.
  // (null au sommet, Maître — échelle ouverte.)
  const next = rank.ceiling !== null ? subjectRankFor(rank.ceiling) : null
  const blocked = rankedBlockedReason(entry)

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <div className="flex items-center gap-3">
        <RankBadge
          rank={rank}
          size={52}
          className="drop-shadow-[0_3px_6px_rgba(0,0,0,0.45)]"
        />

        <div className="min-w-0 flex-1">
          <p className="font-heading truncate text-[0.68rem] leading-tight font-extrabold tracking-wider text-white/70 uppercase">
            {entry.subject}
          </p>
          <p className="font-heading text-xl leading-tight font-extrabold tracking-wide text-highlight uppercase italic">
            {rank.label}
          </p>
        </div>

        <p className="flex shrink-0 flex-col items-end">
          <span className="flex items-center gap-1.5 font-mono text-2xl leading-none font-extrabold text-[#faf6ef] tabular-nums">
            {entry.trophies}
            <Trophy className="size-4 shrink-0 text-highlight" strokeWidth={2.6} aria-hidden="true" />
          </span>
          <span className="mt-1 text-[0.6rem] font-bold text-white/45 tabular-nums">
            record {entry.peakTrophies}
          </span>
        </p>
      </div>

      <div className="mt-2.5">
        {next ? (
          <>
            <span
              className="block h-2 w-full overflow-hidden rounded-full bg-black/40 ring-1 ring-white/12 ring-inset"
              role="progressbar"
              aria-label={`Progression vers ${next.label} en ${entry.subject}`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(rank.progress * 100)}
            >
              {/* Violet : c'est une progression de RANG. Le jaune veut dire XP
                  partout ailleurs dans l'app — deux compteurs, deux couleurs. */}
              <span
                className="block h-full rounded-full bg-[color-mix(in_oklch,var(--primary),white_30%)] transition-[width] duration-500"
                style={{ width: `${Math.round(rank.progress * 100)}%` }}
              />
            </span>
            <p className="mt-1.5 text-[11px] font-medium text-white/65">
              Encore <span className="font-bold text-white">{rank.toNext}</span>{' '}
              pour {next.label}
              <span className="text-white/40">
                {' '}
                · {rank.inDivision}/{SUBJECT_DIVISION_SPAN}
              </span>
            </p>
          </>
        ) : (
          <p className="text-[11px] font-bold text-highlight">
            Rang maximal en {entry.subject} — reste Maître 👑
          </p>
        )}
      </div>

      {blocked ? (
        <p className="mt-2.5 flex items-center gap-2 rounded-xl border border-dashed border-white/20 px-3 py-2 text-[0.7rem] font-bold text-white/70">
          <Lock className="size-3.5 shrink-0" strokeWidth={2.8} aria-hidden="true" />
          Duel classé : {blocked}
        </p>
      ) : null}
    </section>
  )
}

/**
 * Une ligne de jeu : son compteur, et ce que vaut sa prochaine victoire. Cette
 * dernière colonne est l'écran à elle seule — le jeu jamais touché y montre
 * « +10 » quand le jeu monté à 890 montre « +2 », et l'élève fait le calcul
 * tout seul. Un jeu pas encore servi reste visible mais éteint : une ligne
 * absente ferait croire que la matière est plus pauvre qu'elle ne l'est.
 */
function GameLine({ game }: { game: RosterGame }) {
  const body = (
    <>
      <span className="text-base leading-none" aria-hidden="true">
        {game.emoji}
      </span>
      <span className="min-w-0 flex-1 truncate text-[0.75rem] font-semibold text-white/85">
        {game.name}
      </span>
      <span className="shrink-0 font-mono text-[0.78rem] font-extrabold text-white tabular-nums">
        {game.trophies}
      </span>
      <span className="w-9 shrink-0 text-right font-mono text-[0.72rem] font-bold text-highlight tabular-nums">
        {game.href ? `+${game.nextWin}` : '—'}
      </span>
    </>
  )

  const shell =
    'flex w-full items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2.5 py-2 text-left'

  if (!game.href) {
    return (
      <div className={`${shell} opacity-45`} aria-disabled="true">
        {body}
      </div>
    )
  }

  return (
    <Link
      href={game.href}
      onClick={() => sfx.battle()}
      aria-label={`${game.name} — ${game.trophies} trophées, une victoire en rapporte ${game.nextWin}`}
      className={`${shell} olympe-press transition-colors hover:bg-white/10 focus-visible:ring-4 focus-visible:ring-highlight/60 focus-visible:outline-none`}
    >
      {body}
    </Link>
  )
}
