'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import ModeStage from '@/components/defi/ModeStage'
import GameHud from '@/components/jeux/GameHud'
import GameOutcome from '@/components/jeux/GameOutcome'
import OrderBoard from '@/components/jeux/OrderBoard'
import {
  GameCountdown,
  GameIntro,
  GameQuitLink,
} from '@/components/jeux/GameShell'
import { MECHANIC_ICON } from '@/components/jeux/icons'
import { gameSfx, sfx, buzz } from '@/lib/sounds'
import type { GameFormat } from '@/lib/jeux/formats'
import { readGameBest, writeGameBest } from '@/lib/jeux/records'
import { usePalierRun } from '@/lib/jeux/use-palier-run'
import type { PalierRun } from '@/lib/jeux/paliers'
import { hasTimeRecord } from '@/lib/jeux/palier-format'
import { useGameReport } from '@/lib/jeux/use-game-report'
import type { GameGhost } from '@/lib/jeux/ghost-server'
import { isNextInOrder, type OrderBoard as Board } from '@/lib/jeux/ordering'
import {
  answer as applyAnswer,
  globalSeconds,
  globalTimeUp,
  startRun,
  type GameRun,
} from '@/lib/jeux/run'

type Phase = 'intro' | 'countdown' | 'playing' | 'done'

const TICK_MS = 100
// Pause après un tableau bouclé : le temps de voir la ligne complète avant que
// la suivante n'arrive. Sans elle, la récompense de la reconstitution est volée.
const BOARD_PAUSE_MS = 1100

/**
 * La table des jeux de REMISE EN ORDRE (Frise folle, Phrase en vrac) — les deux
 * seuls jeux du catalogue qui ne posent pas de QCM. Elle partage le rituel des
 * autres tables (règle, décompte, HUD, écran de fin) mais son cœur est
 * différent : on ne choisit pas parmi des réponses, on RECONSTITUE une suite.
 *
 * Ces deux jeux étaient marqués « Bientôt » depuis toujours, faute d'une table
 * capable d'autre chose qu'un questionnaire.
 */
export default function OrderTable({
  format,
  palier,
  boards,
  name,
  subject,
  subjectEmoji,
  ghost,
}: {
  format: GameFormat
  /**
   * Palier joué et plancher de classe (lib/jeux/paliers), ou null pour un jeu
   * hors échelle — le « Programme » d'une matière, dont la difficulté est le
   * programme et non un réglage.
   */
  palier: PalierRun | null
  boards: Board[]
  name: string
  subject: string
  subjectEmoji: string
  /** Meilleur score d'un ami sur ce jeu, à battre (lib/jeux/ghost-server). */
  ghost?: GameGhost | null
}) {
  const router = useRouter()
  const audio = useMemo(() => gameSfx(format.timbre), [format.timbre])
  const seconds = globalSeconds(format)

  const [phase, setPhase] = useState<Phase>('intro')
  const [count, setCount] = useState(3)
  const [run, setRun] = useState<GameRun>(() => startRun(format))
  const [boardIndex, setBoardIndex] = useState(0)
  /** Index des tuiles déjà posées, dans l'ordre de pose. */
  const [placed, setPlaced] = useState<number[]>([])
  /** Dernière tuile refusée — elle tremble, puis l'info s'efface. */
  const [rejected, setRejected] = useState<number | null>(null)
  const [best, setBest] = useState(0)
  const [isRecord, setIsRecord] = useState(false)
  // XP, série et trophées : un seul compte rendu partagé par les quatre tables.
  // Les étoiles du palier, rangées dans la progression locale du jeu.
  const {
    outcome: palierOutcome,
    standing: palierStanding,
    record: recordPalier,
    reset: resetPalier,
  } = usePalierRun(format.id, palier)
  const { saved, gains, trophies, report, reset } = useGameReport(
    subject,
    format.id,
  )
  const [globalLeft, setGlobalLeft] = useState<number | null>(null)

  const runRef = useRef(run)
  const globalLeftRef = useRef<number | null>(null)
  // Verrou pendant la pause de fin de tableau : on ne pose rien sur le tableau
  // suivant tant qu'il n'est pas affiché.
  const lockRef = useRef(false)
  const finishedRef = useRef(false)
  // Le CHRONO DE BOUCLAGE : posé au lancement réel de la partie (après le
  // décompte 3·2·1, qui ne doit compter pour personne) et lu à l'arrivée. C'est
  // lui qui alimente le record de temps et le classement de rapidité du palier.
  const startedAtRef = useRef(0)

  useEffect(() => {
    runRef.current = run
  }, [run])

  useEffect(() => {
    const load = () => setBest(readGameBest(format.id))
    load()
  }, [format.id])

  const board = boards.length > 0 ? boards[boardIndex % boards.length] : null

  // ------------------------------------------------------------- fin de partie
  const finish = useCallback(
    (final: GameRun) => {
      if (finishedRef.current) return
      finishedRef.current = true
      runRef.current = final
      setRun(final)
      setPhase('done')

      if (final.status === 'won') audio.win()
      else audio.lose()

      const prev = readGameBest(format.id)
      if (writeGameBest(format.id, final.score)) setIsRecord(true)
      setBest(Math.max(prev, final.score))

      // Les étoiles se comptent ici, au même endroit que le record : c'est le
      // seul moment où l'on tient la partie TERMINÉE, donc son taux de réussite
      // ET son temps. Un chrono jamais parti (partie quittée avant le GO) vaut
      // null plutôt que la durée écoulée depuis l'époque Unix.
      recordPalier(
        final,
        hasTimeRecord(format) && startedAtRef.current
          ? Date.now() - startedAtRef.current
          : null,
      )

      report(final)
    },
    [audio, format, recordPalier, report],
  )

  // -------------------------------------------------------------- une tuile
  const onTap = (index: number) => {
    if (!board || phase !== 'playing' || lockRef.current) return
    const good = isNextInOrder(board, placed.length, index)
    // `boardSize` vient du TABLEAU, pas du format : les tableaux n'ont pas tous
    // la même taille (une phrase anglaise fait 4 à 6 mots).
    const next = applyAnswer(format, runRef.current, {
      good,
      elapsedMs: 0,
      boardSize: board.solution.length,
    })
    const before = runRef.current
    runRef.current = next
    setRun(next)
    buzz(good, next.streak)

    if (!good) {
      // La tuile refusée reste en bas : on retente. Le son dit s'il en a coûté
      // une vie ou seulement du temps.
      const lostLife =
        next.lives !== null && before.lives !== null && next.lives < before.lives
      if (lostLife) audio.lifeLost()
      else audio.wrong()
      setRejected(index)
      window.setTimeout(() => setRejected(null), 400)
      if (next.status !== 'playing') {
        lockRef.current = true
        window.setTimeout(() => finish(next), BOARD_PAUSE_MS)
      }
      return
    }

    setRejected(null)
    setPlaced((p) => [...p, index])

    if (next.stepJustCleared) {
      // Tableau reconstitué : on le laisse admirer, puis on enchaîne (ou on
      // conclut si c'était le dernier).
      lockRef.current = true
      audio.stepCleared()
      window.setTimeout(() => {
        if (next.status !== 'playing') {
          finish(next)
          return
        }
        setBoardIndex((n) => n + 1)
        setPlaced([])
        lockRef.current = false
      }, BOARD_PAUSE_MS)
      return
    }

    audio.correct(next.streak)
  }

  // ------------------------------------------------------------ chrono global
  useEffect(() => {
    if (phase !== 'playing' || globalLeftRef.current === null) return
    const id = window.setInterval(() => {
      if (document.visibilityState !== 'visible') return
      const left = Math.max(0, (globalLeftRef.current ?? 0) - TICK_MS / 1000)
      globalLeftRef.current = left
      setGlobalLeft(left)
      if (left === 0) finish(globalTimeUp(format, runRef.current))
    }, TICK_MS)
    return () => window.clearInterval(id)
  }, [phase, format, finish])

  // ------------------------------------------------------------------ départ
  const launch = useCallback(() => {
    const fresh = startRun(format)
    finishedRef.current = false
    lockRef.current = false
    runRef.current = fresh
    setRun(fresh)
    setPlaced([])
    setRejected(null)
    reset()
    resetPalier()
    startedAtRef.current = Date.now()
    setIsRecord(false)
    setBoardIndex((n) => n + 1) // un autre tableau d'une partie à l'autre
    globalLeftRef.current = seconds
    setGlobalLeft(seconds)
    setPhase('playing')
  }, [format, seconds, reset, resetPalier])

  useEffect(() => {
    if (phase !== 'countdown') return
    audio.countdown(count)
    if (count <= 0) {
      const id = window.setTimeout(launch, 350)
      return () => window.clearTimeout(id)
    }
    const id = window.setTimeout(() => setCount((n) => n - 1), 700)
    return () => window.clearTimeout(id)
  }, [phase, count, audio, launch])

  const startCountdown = () => {
    sfx.tap()
    setCount(3)
    setPhase('countdown')
  }

  // Retour : on remonte d'UN cran, sur la carte des paliers du jeu — c'est de là
  // qu'on est venu. Renvoyer à l'arène faisait retraverser toute la feuille des
  // modes pour rejouer le palier d'à côté. Un jeu hors échelle (le
  // « Programme ») n'a pas de carte : lui rentre bien à l'arène.
  const backHref = palier ? `/defi/jeux/${format.id}` : '/defi'
  const exit = () => router.push(backHref)

  return (
    <ModeStage
      title={name}
      Icon={MECHANIC_ICON[format.params.mechanic]}
      theme={format.theme}
      onExit={exit}
      backLabel={palier ? 'Retour aux paliers' : undefined}
      headerRight={
        <span className="shrink-0 rounded-full bg-[color:var(--jeu-accent)]/12 px-2.5 py-1 text-[11px] font-bold text-[color:var(--jeu-accent)]">
          <span aria-hidden="true">{subjectEmoji}</span> {subject}
        </span>
      }
    >
      <div className="min-h-[70dvh] pt-1 pb-6">
        {phase === 'intro' ? (
          <GameIntro
            format={format}
            best={best}
            empty={boards.length === 0}
            onStart={startCountdown}
            onExit={exit}
          />
        ) : phase === 'countdown' ? (
          <GameCountdown n={count} />
        ) : phase === 'done' ? (
          <GameOutcome
            format={format}
            palier={palier?.level ?? null}
            palierOutcome={palierOutcome}
            palierStanding={palierStanding}
            run={run}
            best={best}
            isRecord={isRecord}
            saved={saved}
            gains={gains}
            trophies={trophies}
            ghost={ghost}
            onReplay={startCountdown}
            onExit={exit}
          />
        ) : board ? (
          <div>
            <GameHud
              format={format}
              run={run}
              questionLeft={null}
              questionTotal={null}
              globalLeft={globalLeft}
            />

            <p className="mt-5 text-xs font-bold tracking-wide text-[color:var(--jeu-accent)] uppercase">
              {format.lexicon.verb}
            </p>
            <h2 className="font-heading mt-1 mb-4 text-xl font-extrabold text-balance">
              {board.prompt}
            </h2>

            <OrderBoard
              board={board}
              placed={placed}
              rejected={rejected}
              onTap={onTap}
            />

            <GameQuitLink onExit={exit} />
          </div>
        ) : null}
      </div>
    </ModeStage>
  )
}
