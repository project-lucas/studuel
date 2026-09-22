'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronDown, Lock, X } from 'lucide-react'
import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'
import { useDialogFocus } from '@/lib/use-dialog'
import { verrouillerDefilement } from '@/lib/scroll-lock'
import RankBadge from '@/components/defi/RankBadge'
import TropheeAnime from '@/components/amis/TropheeAnime'
import TrophyRules from '@/components/defi/TrophyRules'
import { useDuelSubject } from '@/components/defi/DuelSubjectProvider'
import { formatTrophees } from '@/components/defi/CompteTropheesArene'
import { bestNextGame, type RosterGame } from '@/lib/defi/roster'
import {
  duelTarget,
  rankedBlockedReason,
  type DuelSubject,
} from '@/lib/defi/duel-board'
import { subjectRankFor, SUBJECT_DIVISION_SPAN } from '@/lib/subject-rank'
import { DIVISION_SPAN, rankFor, type Rank } from '@/lib/rank'
import { libelleTop, topPourcent } from '@/lib/defi/classement-arene'
import { ordinal } from '@/lib/percentile'

/**
 * LE CLASSEMENT — la plaque de l'angle droit de l'arène, sous Studuel+, et
 * l'écran qu'elle ouvre (Lucas, 22/09/2026 : « fais sortir l'icône classement
 * du burger, place-la sous l'étoile ; le contenu de l'icône trophée sera
 * dorénavant placé dans le bouton classement… au lieu de scroller les
 * matières, aligne-les à la verticale ; c'est trop sombre »).
 *
 * Il a AVALÉ la Route des trophées (le blason par matière, les jeux et leur
 * « +N », le barème), qui vivait derrière une plaque à coupe et sur un fond
 * violet presque noir, avec une roulette de matières à faire défiler. Ici :
 *
 *   · un écran CLAIR — le crème de l'app, des cartes blanches, le violet pour
 *     les progressions de rang, l'or pour ce qui se gagne ;
 *   · MOI d'abord : le blason, le rang, le total, la bande parmi tous les
 *     élèves (« Top 90 % ») et la marche vers la division suivante ;
 *   · puis MES MATIÈRES, les unes sous les autres, dans l'ordre du plateau —
 *     chacune avec son blason, son compteur, ce que vaut sa prochaine
 *     victoire, et ses jeux dépliés d'un tap (dépliés d'office pour la
 *     matière du duel) ;
 *   · le barème et les conditions en dernier, repliés : on les lit une fois.
 *
 * On n'affiche que ce qui est vrai : le rang parmi tous les élèves vient de
 * `national_ranking()` (migration 159) ; sans lui, pas de bande, et le reste
 * de l'écran ne change pas.
 */
export default function ClassementSheet({
  trophees,
  classement = null,
}: {
  /**
   * Le total de trophées du profil. À défaut, la somme du plateau — ce que
   * l'écran affiche en tête de toute façon.
   */
  trophees?: number
  /** Mon rang parmi tous les élèves (`national_ranking`), ou null. */
  classement?: { rank: number | null; total: number } | null
}) {
  const { board, active } = useDuelSubject()
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
  const compte = trophees ?? total
  const rank = rankFor(compte)
  const top = topPourcent(classement?.rank, classement?.total)
  const conseil = bestNextGame(board)
  // Le jeu que lance DUEL sur la matière courante : il marque « toi » dans le barème.
  const cible = active ? duelTarget(active) : null
  const jeuCible = active?.games.find((g) => g.name === cible?.label) ?? null

  const libelle = `Classement — ${compte} trophées, rang ${rank.label}${
    top !== null ? `, top ${top} % de tous les élèves` : ''
  } — tes matières et le barème`

  return (
    <>
      {/* La plaque de l'angle droit, sous Studuel+ : la liste ordonnée du
          classement, sur la plaque sculptée des voisines. */}
      <button
        type="button"
        onClick={() => {
          sfx.tap()
          setOpen(true)
        }}
        aria-haspopup="dialog"
        aria-label={libelle}
        title="Classement"
        className="arena-plaque defi2-press relative grid size-[68px] cursor-pointer place-items-center focus-visible:ring-4 focus-visible:ring-highlight/60 focus-visible:outline-none"
      >
        <Image
          src="/images/defi/icones/classement-v3.webp"
          alt=""
          aria-hidden="true"
          width={116}
          height={116}
          className="size-[58px] object-contain drop-shadow-[0_3px_4px_rgba(23,16,48,0.55)]"
        />
      </button>

      {typeof document !== 'undefined'
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <motion.div
                  ref={panel}
                  className="fixed inset-0 z-[70] flex flex-col bg-background outline-none"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Classement"
                  initial={reduce ? { opacity: 0 } : { y: '100%' }}
                  animate={reduce ? { opacity: 1 } : { y: 0 }}
                  exit={reduce ? { opacity: 0 } : { y: '100%' }}
                  transition={{ type: 'tween', duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
                >
                  <header className="flex shrink-0 items-center justify-between gap-3 px-4 pt-[calc(env(safe-area-inset-top)+0.75rem)] pb-2">
                    <h2 className="font-heading text-2xl font-extrabold text-foreground">
                      Classement
                    </h2>
                    <button
                      type="button"
                      onClick={() => {
                        sfx.back()
                        setOpen(false)
                      }}
                      aria-label="Fermer le classement"
                      className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full bg-card text-foreground shadow-sm ring-1 ring-black/5 transition active:scale-95 focus-visible:ring-4 focus-visible:ring-primary/40 focus-visible:outline-none"
                    >
                      <X className="size-6" strokeWidth={2.6} aria-hidden="true" />
                    </button>
                  </header>

                  <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                    <div className="mx-auto flex w-full max-w-md flex-col gap-3 px-4 pt-1 pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
                      <CarteMoi
                        compte={compte}
                        rank={rank}
                        top={top}
                        classement={classement}
                        reduce={!!reduce}
                      />

                      <section aria-labelledby="classement-matieres">
                        <h3
                          id="classement-matieres"
                          className="font-heading mb-2 px-1 text-base font-extrabold text-foreground"
                        >
                          Mes matières
                        </h3>
                        <ol className="flex flex-col gap-2.5">
                          {board.map((entry, index) => (
                            <motion.li
                              key={entry.slug}
                              initial={reduce ? false : { opacity: 0, y: 10 }}
                              animate={reduce ? undefined : { opacity: 1, y: 0 }}
                              transition={{ duration: 0.22, delay: 0.05 + index * 0.04 }}
                            >
                              <CarteMatiere
                                entry={entry}
                                active={active?.slug === entry.slug}
                                conseil={
                                  conseil?.subject.slug === entry.slug ? conseil.game.gameId : null
                                }
                              />
                            </motion.li>
                          ))}
                        </ol>
                      </section>

                      {/* Le barème, replié : on le lit une fois, puis il gêne. */}
                      <details className="group rounded-3xl bg-card p-4 shadow-sm ring-1 ring-black/5">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                          <h3 className="font-heading text-base font-extrabold text-foreground">
                            Comment on gagne des trophées
                          </h3>
                          <ChevronDown
                            className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                            aria-hidden="true"
                          />
                        </summary>
                        <div className="mt-3">
                          <TrophyRules
                            currentTrophies={jeuCible?.trophies}
                            currentGame={jeuCible?.name}
                            sansTitre
                          />
                        </div>
                      </details>
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
 * Le score qui MONTE de zéro à sa valeur à l'ouverture (700 ms) — coupé par
 * « moins de mouvement ». Un nombre posé d'un coup se lit ; un nombre qui
 * monte se ressent.
 */
function useCompteur(cible: number, reduce: boolean): number {
  const [valeur, setValeur] = useState(0)
  useEffect(() => {
    // Sans mouvement (ou rien à compter), la valeur se dérive : aucun état posé.
    if (reduce || cible <= 0) return
    let debut: number | null = null
    let raf = 0
    const pas = (t: number) => {
      if (debut === null) debut = t
      const k = Math.min(1, (t - debut) / 700)
      const ease = 1 - Math.pow(1 - k, 3)
      setValeur(Math.round(cible * ease))
      if (k < 1) raf = requestAnimationFrame(pas)
    }
    raf = requestAnimationFrame(pas)
    return () => cancelAnimationFrame(raf)
  }, [cible, reduce])
  return reduce || cible <= 0 ? cible : valeur
}

/** MOI : le blason, le rang, le total, la bande parmi tous, la marche suivante. */
function CarteMoi({
  compte,
  rank,
  top,
  classement,
  reduce,
}: {
  compte: number
  rank: Rank
  top: number | null
  classement: { rank: number | null; total: number } | null
  reduce: boolean
}) {
  const affiche = useCompteur(compte, reduce)
  const suivant = rank.ceiling !== null ? rankFor(rank.ceiling) : null

  return (
    <section
      aria-label="Mon classement"
      className="rounded-3xl bg-card p-4 shadow-sm ring-1 ring-black/5"
    >
      <div className="flex items-center gap-3">
        <RankBadge rank={rank} size={68} className="drop-shadow-[0_3px_6px_rgba(36,48,79,0.25)]" />

        <div className="min-w-0 flex-1">
          <p className="text-[0.66rem] font-extrabold tracking-wider text-muted-foreground uppercase">
            Mon rang
          </p>
          <p className="font-heading text-xl leading-tight font-extrabold text-foreground">
            {rank.label}
          </p>
        </div>

        <p className="flex shrink-0 flex-col items-end">
          <span className="flex items-center gap-1.5 font-mono text-3xl leading-none font-extrabold text-foreground tabular-nums">
            <TropheeAnime className="size-7" />
            {formatTrophees(affiche)}
          </span>
          {classement?.rank ? (
            <span className="mt-1 text-[0.66rem] font-bold text-muted-foreground tabular-nums">
              {ordinal(classement.rank)} sur {classement.total} élèves
            </span>
          ) : null}
        </p>
      </div>

      {/* La bande parmi TOUS les élèves — celle du compte de l'arène, en toutes
          lettres. Sur sa propre ligne : entre le blason et le total, elle se
          cassait en deux. */}
      {top !== null ? (
        <p className="mt-3">
          <span className="font-heading inline-flex items-center gap-1.5 rounded-full bg-highlight px-3 py-1 text-[0.78rem] font-extrabold text-foreground">
            {libelleTop(top)}
            <span className="font-bold opacity-80">de tous les élèves</span>
          </span>
        </p>
      ) : null}

      <div className="mt-3">
        {suivant ? (
          <>
            <span
              className="block h-2 w-full overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-label={`Progression vers ${suivant.label}`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(rank.progress * 100)}
            >
              {/* Violet : c'est une progression de RANG. Le jaune veut dire XP
                  partout ailleurs dans l'app — deux compteurs, deux couleurs. */}
              <span
                className="block h-full rounded-full bg-primary transition-[width] duration-500"
                style={{ width: `${Math.round(rank.progress * 100)}%` }}
              />
            </span>
            <p className="mt-1.5 text-xs font-medium text-muted-foreground">
              Encore <strong className="font-bold text-foreground">{rank.toNext}</strong> pour{' '}
              {suivant.label}
              <span className="text-muted-foreground/70">
                {' '}
                · {rank.inDivision}/{DIVISION_SPAN}
              </span>
            </p>
          </>
        ) : (
          <p className="text-xs font-bold text-foreground">Rang maximal — reste Maître 👑</p>
        )}
      </div>
    </section>
  )
}

/** UNE MATIÈRE : son blason, son compteur, sa prochaine victoire, ses jeux. */
function CarteMatiere({
  entry,
  active,
  conseil,
}: {
  entry: DuelSubject
  /** La matière du duel (celle de la plaque de l'arène) : dépliée, cerclée de violet. */
  active: boolean
  /** L'identifiant du jeu le plus rentable du plateau, s'il est dans cette matière. */
  conseil: string | null
}) {
  const rank = entry.rank
  const next = rank.ceiling !== null ? subjectRankFor(rank.ceiling) : null
  const blocked = rankedBlockedReason(entry)
  const cible = duelTarget(entry)
  const jouables = entry.games.filter((g) => g.href).length

  return (
    <article
      aria-label={`${entry.subject} — ${entry.trophies} trophées, ${rank.label}`}
      className={cn(
        'rounded-3xl bg-card p-3.5 shadow-sm',
        active ? 'ring-2 ring-primary' : 'ring-1 ring-black/5',
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className="grid size-12 shrink-0 place-items-center rounded-2xl bg-secondary"
          aria-hidden="true"
        >
          {entry.vignette ? (
            <Image
              src={entry.vignette}
              alt=""
              width={96}
              height={96}
              className="size-10 object-contain"
            />
          ) : (
            <span className="text-2xl leading-none">{entry.emoji}</span>
          )}
        </span>

        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="font-heading truncate text-base leading-tight font-extrabold text-foreground">
              {entry.subject}
            </span>
            {active ? (
              <span className="font-heading rounded-full bg-primary px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-primary-foreground uppercase">
                Matière du duel
              </span>
            ) : null}
            {conseil ? (
              <span className="font-heading rounded-full bg-highlight px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-foreground uppercase">
                Le plus rentable
              </span>
            ) : null}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
            <RankBadge rank={rank} size={22} hideDivision />
            {rank.label}
          </p>
        </div>

        <p className="flex shrink-0 flex-col items-end gap-1">
          <span className="flex items-center gap-1 font-mono text-lg leading-none font-extrabold text-foreground tabular-nums">
            <TropheeAnime className="size-5" />
            {entry.trophies}
          </span>
          {cible ? (
            <span
              className="rounded-full bg-accent px-2 py-0.5 font-mono text-[0.7rem] font-extrabold text-accent-foreground tabular-nums"
              aria-label={`Prochaine victoire : +${cible.nextWin}`}
            >
              +{cible.nextWin}
            </span>
          ) : null}
        </p>
      </div>

      <div className="mt-2.5">
        {next ? (
          <>
            <span
              className="block h-1.5 w-full overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-label={`Progression vers ${next.label} en ${entry.subject}`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(rank.progress * 100)}
            >
              <span
                className="block h-full rounded-full bg-primary transition-[width] duration-500"
                style={{ width: `${Math.round(rank.progress * 100)}%` }}
              />
            </span>
            <p className="mt-1 text-[11px] font-medium text-muted-foreground">
              Encore <span className="font-bold text-foreground">{rank.toNext}</span> pour{' '}
              {next.label}
              <span className="text-muted-foreground/70">
                {' '}
                · {rank.inDivision}/{SUBJECT_DIVISION_SPAN}
              </span>
            </p>
          </>
        ) : (
          <p className="text-[11px] font-bold text-foreground">
            Rang maximal en {entry.subject} — reste Maître 👑
          </p>
        )}
      </div>

      {blocked ? (
        <p className="mt-2 flex items-center gap-2 rounded-xl border border-dashed border-border px-3 py-1.5 text-[0.72rem] font-bold text-muted-foreground">
          <Lock className="size-3.5 shrink-0" strokeWidth={2.8} aria-hidden="true" />
          Duel classé : {blocked}
        </p>
      ) : null}

      {/* Les jeux de la matière : leur compteur et ce que vaut leur prochaine
          victoire — « +10 » sur un jeu jamais touché, « +2 » sur un jeu monté :
          c'est l'écart que l'élève doit lire d'un coup d'œil. */}
      <details className="group mt-2.5" open={active}>
        <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl bg-secondary px-3 py-1.5 text-xs font-extrabold text-secondary-foreground">
          <span>
            {entry.games.length} jeu{entry.games.length > 1 ? 'x' : ''}
            {jouables < entry.games.length
              ? ` · ${jouables} jouable${jouables > 1 ? 's' : ''}`
              : ''}
          </span>
          <ChevronDown
            className="size-4 shrink-0 transition-transform group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <ul className="mt-1.5 flex flex-col gap-1.5">
          {entry.games.map((game) => (
            <li key={game.gameId}>
              <LigneJeu game={game} conseille={conseil === game.gameId} />
            </li>
          ))}
        </ul>
      </details>
    </article>
  )
}

/** Un jeu : son compteur, et ce que vaut sa prochaine victoire. */
function LigneJeu({ game, conseille }: { game: RosterGame; conseille: boolean }) {
  const body = (
    <>
      <span className="text-base leading-none" aria-hidden="true">
        {game.emoji}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[0.8rem] font-bold text-foreground">{game.name}</span>
        {conseille ? (
          <span className="font-heading block text-[0.62rem] font-extrabold tracking-wide text-primary uppercase">
            Le plus rentable en ce moment
          </span>
        ) : null}
      </span>
      <span className="shrink-0 font-mono text-[0.85rem] font-extrabold text-foreground tabular-nums">
        {game.trophies}
      </span>
      <span
        className={cn(
          'w-10 shrink-0 rounded-full py-0.5 text-center font-mono text-[0.72rem] font-extrabold tabular-nums',
          game.href ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground',
        )}
      >
        {game.href ? `+${game.nextWin}` : '—'}
      </span>
    </>
  )

  const shell = 'flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left'

  if (!game.href) {
    return (
      <div className={cn(shell, 'bg-muted/40 opacity-60')} aria-disabled="true">
        {body}
      </div>
    )
  }

  return (
    <Link
      href={game.href}
      onClick={() => sfx.battle()}
      aria-label={`${game.name} — ${game.trophies} trophées, une victoire en rapporte ${game.nextWin}`}
      className={cn(
        shell,
        'bg-background/70 ring-1 ring-black/5 transition-colors hover:bg-secondary active:scale-[0.99] focus-visible:ring-4 focus-visible:ring-primary/40 focus-visible:outline-none',
      )}
    >
      {body}
    </Link>
  )
}
