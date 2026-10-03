'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
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
import TropheeIcone from '@/components/ui/TropheeIcone'
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
import { useFermeAuMasquage } from '@/components/useFermeAuMasquage'
import { gameScene } from '@/lib/defi/modes-catalog'
import s from './ClassementSheet.module.css'

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
  ouvertAuDepart = false,
}: {
  /**
   * Le total de trophées du profil. À défaut, la somme du plateau — ce que
   * l'écran affiche en tête de toute façon.
   */
  trophees?: number
  /** Mon rang parmi tous les élèves (`national_ranking`), ou null. */
  classement?: { rank: number | null; total: number } | null
  /** Ouvert dès le montage (aperçu /dev/classement). */
  ouvertAuDepart?: boolean
}) {
  const { board, active } = useDuelSubject()
  const [open, setOpen] = useState(ouvertAuDepart)
  // Le portail n'existe qu'une fois hydraté : rendu côté serveur, il ferait
  // un écart d'hydratation (la feuille ouverte dès le montage de l'aperçu).
  const monte = useSyncExternalStore(abonnerRien, () => true, () => false)
  useFermeAuMasquage(setOpen, false)
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
        className="arena-plaque arena-plaque--claire defi2-press relative grid size-[68px] cursor-pointer place-items-center focus-visible:ring-4 focus-visible:ring-highlight/60 focus-visible:outline-none"
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

      {monte
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
                          className="titre-section mb-2 px-1 text-foreground"
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
                      <details className="carte group p-4">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                          <h3 className="titre-section text-foreground">
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

const abonnerRien = () => () => {}

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

/**
 * MOI : la plaque héros (03/10/2026, façon Brawl Stars). Le blason sur ses
 * rayons, le rang en blanc cerné, le total de trophées en grand, la bande
 * parmi tous les élèves, et la barre d'OR épaisse qui mène au blason suivant.
 */
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
  const pct = Math.round(rank.progress * 100)

  return (
    <section aria-label="Mon classement" className={s.plaqueMoi}>
      <span aria-hidden="true" className={s.rayons} />
      <div className="relative flex items-center gap-3">
        <RankBadge rank={rank} size={84} className="drop-shadow-[0_4px_8px_rgba(20,10,40,0.45)]" />

        <div className="min-w-0 flex-1">
          <p className="text-[0.68rem] font-extrabold tracking-wide text-white/75 uppercase">Mon rang</p>
          <p className={cn(s.chiffre, 'text-[1.6rem]')}>{rank.label}</p>
          {classement?.rank ? (
            <p className="mt-1 text-[0.7rem] font-bold text-white/80 tabular-nums">
              {ordinal(classement.rank)} sur {classement.total} élèves
            </p>
          ) : null}
        </div>

        <p className="flex shrink-0 flex-col items-center gap-0.5">
          <TropheeIcone className="size-10 drop-shadow-[0_3px_4px_rgba(20,10,40,0.45)]" />
          <span className={cn(s.chiffre, 'text-3xl tabular-nums')}>{formatTrophees(affiche)}</span>
        </p>
      </div>

      {top !== null ? (
        <p className="relative mt-3">
          <span className="font-heading inline-flex items-center gap-1.5 rounded-full bg-highlight px-3 py-1 text-[0.78rem] font-extrabold text-foreground shadow-[0_2px_0_color-mix(in_oklch,var(--highlight),black_30%)]">
            {libelleTop(top)}
            <span className="font-bold opacity-80">de tous les élèves</span>
          </span>
        </p>
      ) : null}

      <div className="relative mt-3">
        {suivant ? (
          <>
            <div className="flex items-center gap-2">
              <div
                className={cn(s.gorge, 'flex-1')}
                role="progressbar"
                aria-label={`Progression vers ${suivant.label}`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={pct}
              >
                <span className={s.or} style={{ width: `${pct}%` }} />
              </div>
              <RankBadge rank={suivant} size={34} hideDivision />
            </div>
            <p className="mt-1.5 text-xs font-bold text-white/85">
              Encore <strong className="text-white">{rank.toNext}</strong> pour {suivant.label}
              <span className="text-white/60 tabular-nums">
                {' '}
                · {rank.inDivision}/{DIVISION_SPAN}
              </span>
            </p>
          </>
        ) : (
          <p className="text-xs font-bold text-white">Rang maximal — reste Maître 👑</p>
        )}
      </div>
    </section>
  )
}

/** UNE MATIÈRE : son médaillon, son rang, ses trophées, sa barre, ses jeux en tuiles. */
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
  const pct = Math.round(rank.progress * 100)

  return (
    <article
      aria-label={`${entry.subject} — ${entry.trophies} trophées, ${rank.label}`}
      className={s.carteMatiere}
      data-active={active || undefined}
    >
      <div className="flex items-center gap-3">
        <span className={s.medaillon} style={{ background: entry.pastel }} aria-hidden="true">
          {entry.vignette ? (
            <Image
              src={entry.vignette}
              alt=""
              width={112}
              height={112}
              loading="eager"
              className="size-11 object-contain"
            />
          ) : (
            <span className="text-2xl leading-none">{entry.emoji}</span>
          )}
        </span>

        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="font-heading truncate text-lg leading-tight font-extrabold text-foreground">
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
          <div className="mt-0.5 flex items-center gap-1.5 text-xs font-extrabold text-muted-foreground">
            <RankBadge rank={rank} size={26} hideDivision />
            {rank.label}
          </div>
        </div>

        <p className="flex shrink-0 flex-col items-end gap-1">
          <span className={s.pastilleTrophees}>
            <TropheeIcone className="size-5" />
            <span className={cn(s.chiffre, 'text-base tabular-nums')}>{entry.trophies}</span>
          </span>
          {cible ? (
            <span
              className="font-heading text-[0.68rem] font-extrabold text-muted-foreground"
              aria-label={`Prochaine victoire : +${cible.nextWin}`}
            >
              victoire <span className="text-foreground">+{cible.nextWin}</span>
            </span>
          ) : null}
        </p>
      </div>

      <div className="mt-2.5">
        {next ? (
          <>
            <div className="flex items-center gap-2">
              <div
                className={cn(s.gorgeClaire, 'flex-1')}
                role="progressbar"
                aria-label={`Progression vers ${next.label} en ${entry.subject}`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={pct}
              >
                <span className={s.violet} style={{ width: `${pct}%` }} />
              </div>
              <RankBadge rank={next} size={24} hideDivision />
            </div>
            <p className="mt-1 text-[11px] font-medium text-muted-foreground">
              Encore <span className="font-bold text-foreground">{rank.toNext}</span> pour {next.label}
              <span className="text-muted-foreground/70 tabular-nums">
                {' '}
                · {rank.inDivision}/{SUBJECT_DIVISION_SPAN}
              </span>
            </p>
          </>
        ) : (
          <p className="text-[11px] font-bold text-foreground">Rang maximal en {entry.subject} — reste Maître 👑</p>
        )}
      </div>

      {blocked ? (
        <p className="mt-2 flex items-center gap-2 rounded-xl border border-dashed border-border px-3 py-1.5 text-[0.72rem] font-bold text-muted-foreground">
          <Lock className="size-3.5 shrink-0" strokeWidth={2.8} aria-hidden="true" />
          Duel classé : {blocked}
        </p>
      ) : null}

      {/* Les jeux de la matière, en TUILES illustrées par leur scène : leur
          compteur, et ce que vaut leur prochaine victoire — « +10 » sur un jeu
          jamais touché, « +2 » sur un jeu monté. */}
      <details className="group mt-2.5" open={active}>
        <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl bg-secondary px-3 py-1.5 text-xs font-extrabold text-secondary-foreground">
          <span>
            {entry.games.length} jeu{entry.games.length > 1 ? 'x' : ''}
            {jouables < entry.games.length ? ` · ${jouables} jouable${jouables > 1 ? 's' : ''}` : ''}
          </span>
          <ChevronDown className="size-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
        </summary>
        <ul className="mt-2 grid grid-cols-3 gap-2">
          {entry.games.map((game) => (
            <li key={game.gameId}>
              <TuileJeu game={game} entry={entry} conseille={conseil === game.gameId} />
            </li>
          ))}
        </ul>
      </details>
    </article>
  )
}

/** Un jeu, en tuile : sa scène, son compteur, ce que vaut sa prochaine victoire. */
function TuileJeu({ game, entry, conseille }: { game: RosterGame; entry: DuelSubject; conseille: boolean }) {
  const scene = gameScene(game.gameId)
  const corps = (
    <>
      {scene ? (
        <Image src={scene} alt="" fill sizes="120px" loading="eager" className="object-cover" />
      ) : (
        <span className="absolute inset-0 grid place-items-center" style={{ background: entry.pastel }}>
          {entry.vignette ? (
            <Image src={entry.vignette} alt="" width={96} height={96} loading="eager" className="size-12 object-contain" />
          ) : (
            <span className="text-3xl">{game.emoji}</span>
          )}
        </span>
      )}
      <span aria-hidden="true" className={s.tuileVoile} />
      <span className={s.tuileCompte}>
        <TropheeIcone className="size-3.5" />
        <span className="font-heading text-[0.7rem] font-extrabold text-white tabular-nums">{game.trophies}</span>
      </span>
      {game.href ? <span className={s.tuileGain}>+{game.nextWin}</span> : null}
      {conseille ? <span className={s.ruban}>Top</span> : null}
      {game.href ? null : (
        <span className="absolute inset-0 grid place-items-center">
          <Lock className="size-5 text-white drop-shadow" strokeWidth={2.8} aria-hidden="true" />
        </span>
      )}
      <span className={s.tuileNom}>{game.name}</span>
    </>
  )

  if (!game.href) {
    return (
      <div className={s.tuileJeu} data-verrou aria-disabled="true" aria-label={`${game.name} — pas encore jouable`}>
        {corps}
      </div>
    )
  }

  return (
    <Link
      href={game.href}
      onClick={() => sfx.battle()}
      aria-label={`${game.name} — ${game.trophies} trophées, une victoire en rapporte ${game.nextWin}`}
      className={cn(s.tuileJeu, 'focus-visible:ring-4 focus-visible:ring-primary/40 focus-visible:outline-none')}
      data-conseil={conseille || undefined}
    >
      {corps}
    </Link>
  )
}
