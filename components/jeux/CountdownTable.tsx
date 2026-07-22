'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import ModeStage from '@/components/defi/ModeStage'
import CountdownBoard from '@/components/jeux/CountdownBoard'
import GameHud from '@/components/jeux/GameHud'
import GameOutcome from '@/components/jeux/GameOutcome'
import {
  GameCountdown,
  GameIntro,
  GameQuitLink,
} from '@/components/jeux/GameShell'
import { MECHANIC_ICON } from '@/components/jeux/icons'
import { gameSfx, sfx, buzz } from '@/lib/sounds'
import { recordChallenge } from '@/app/defi/actions'
import type { GameFormat } from '@/lib/jeux/formats'
import type { CountdownPuzzle } from '@/lib/jeux/compte-est-bon'
import {
  answer as applyAnswer,
  questionSeconds,
  startRun,
  timeout as applyTimeout,
  type GameRun,
} from '@/lib/jeux/run'

type Phase = 'intro' | 'countdown' | 'playing' | 'done'

const TICK_MS = 100
const URGENT_FROM = 5
// Temps laissé sur un tirage résolu (ou manqué) avant de passer au suivant :
// assez pour lire la solution affichée quand on est passé à côté.
const REVEAL_MS = 2400

function bestKey(id: string) {
  return `studuel-jeu-${id}-best`
}

function readBest(id: string): number {
  try {
    return Number(window.localStorage.getItem(bestKey(id))) || 0
  } catch {
    return 0
  }
}

/**
 * La table du « compte est bon » — le troisième jeu de Maths, et le seul du
 * catalogue où l'élève CONSTRUIT sa réponse. Il tourne sur la mécanique
 * `expedition` : une suite de tirages, aucun ne peut éliminer, on va au bout et
 * on compte ceux qu'on a trouvés. Le chrono, lui, s'applique par TIRAGE.
 *
 * Ce jeu était marqué « Bientôt » depuis l'ouverture du salon Maths.
 */
export default function CountdownTable({
  format,
  puzzles,
  name,
  subject,
  subjectEmoji,
}: {
  format: GameFormat
  puzzles: CountdownPuzzle[]
  name: string
  subject: string
  subjectEmoji: string
}) {
  const router = useRouter()
  const audio = useMemo(() => gameSfx(format.timbre), [format.timbre])

  const [phase, setPhase] = useState<Phase>('intro')
  const [count, setCount] = useState(3)
  const [run, setRun] = useState<GameRun>(() => startRun(format))
  const [index, setIndex] = useState(0)
  /** Tirage manqué : on dévoile la solution avant d'enchaîner. */
  const [revealed, setRevealed] = useState(false)
  const [best, setBest] = useState(0)
  const [isRecord, setIsRecord] = useState(false)
  const [saved, setSaved] = useState<boolean | null>(null)
  const [left, setLeft] = useState<number | null>(null)

  const runRef = useRef(run)
  const leftRef = useRef<number | null>(null)
  const lastBipRef = useRef(-1)
  const lockRef = useRef(false)
  const finishedRef = useRef(false)

  useEffect(() => {
    runRef.current = run
  }, [run])

  useEffect(() => {
    const load = () => setBest(readBest(format.id))
    load()
  }, [format.id])

  const puzzle = puzzles.length > 0 ? puzzles[index % puzzles.length] : null
  const perPuzzle = questionSeconds(format, run)

  const finish = useCallback(
    (final: GameRun) => {
      if (finishedRef.current) return
      finishedRef.current = true
      runRef.current = final
      setRun(final)
      setPhase('done')

      if (final.status === 'won') audio.win()
      else audio.lose()

      const prev = readBest(format.id)
      if (final.score > prev) {
        setIsRecord(true)
        try {
          window.localStorage.setItem(bestKey(format.id), String(final.score))
        } catch {
          // stockage indisponible : tant pis pour le record local
        }
      }
      setBest(Math.max(prev, final.score))

      recordChallenge(final.correct, final.answered)
        .then((r) => setSaved(r.saved))
        .catch(() => setSaved(false))
    },
    [audio, format.id],
  )

  // Un tirage se termine : trouvé, ou temps écoulé. Dans les deux cas on marque
  // une pause avant le suivant (la solution s'affiche quand c'est manqué).
  const closePuzzle = useCallback(
    (good: boolean) => {
      if (lockRef.current) return
      lockRef.current = true
      const next = applyAnswer(format, runRef.current, { good, elapsedMs: 0 })
      runRef.current = next
      setRun(next)
      buzz(good, next.streak)
      if (good) audio.correct(next.streak)
      else {
        audio.wrong()
        setRevealed(true)
      }

      window.setTimeout(
        () => {
          if (next.status !== 'playing') {
            finish(next)
            return
          }
          setIndex((n) => n + 1)
          setRevealed(false)
          lastBipRef.current = -1
          leftRef.current = questionSeconds(format, next)
          setLeft(leftRef.current)
          lockRef.current = false
        },
        good ? REVEAL_MS / 2 : REVEAL_MS,
      )
    },
    [audio, finish, format],
  )

  // Le chrono du tirage.
  useEffect(() => {
    if (phase !== 'playing') return
    const id = window.setInterval(() => {
      if (document.visibilityState !== 'visible') return
      if (leftRef.current === null || lockRef.current) return
      const next = Math.max(0, leftRef.current - TICK_MS / 1000)
      leftRef.current = next
      setLeft(next)

      const whole = Math.ceil(next)
      if (next > 0 && whole <= URGENT_FROM && whole !== lastBipRef.current) {
        lastBipRef.current = whole
        audio.tick(1 - (whole - 1) / URGENT_FROM)
      }
      if (next === 0) {
        // Le temps a parlé : on passe par le moteur pour que le compteur
        // d'escales avance exactement comme sur un tirage trouvé.
        lockRef.current = true
        setRevealed(true)
        const after = applyTimeout(format, runRef.current)
        runRef.current = after
        setRun(after)
        audio.wrong()
        window.setTimeout(() => {
          if (after.status !== 'playing') {
            finish(after)
            return
          }
          setIndex((n) => n + 1)
          setRevealed(false)
          lastBipRef.current = -1
          leftRef.current = questionSeconds(format, after)
          setLeft(leftRef.current)
          lockRef.current = false
        }, REVEAL_MS)
      }
    }, TICK_MS)
    return () => window.clearInterval(id)
  }, [phase, format, audio, finish])

  const launch = useCallback(() => {
    const fresh = startRun(format)
    finishedRef.current = false
    lockRef.current = false
    lastBipRef.current = -1
    runRef.current = fresh
    setRun(fresh)
    setRevealed(false)
    setSaved(null)
    setIsRecord(false)
    setIndex((n) => n + 1)
    leftRef.current = questionSeconds(format, fresh)
    setLeft(leftRef.current)
    setPhase('playing')
  }, [format])

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

  const exit = () => router.push('/defi')

  return (
    <ModeStage
      title={name}
      Icon={MECHANIC_ICON[format.params.mechanic]}
      theme={format.theme}
      onExit={exit}
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
            empty={puzzles.length === 0}
            onStart={startCountdown}
            onExit={exit}
          />
        ) : phase === 'countdown' ? (
          <GameCountdown n={count} />
        ) : phase === 'done' ? (
          <GameOutcome
            format={format}
            run={run}
            best={best}
            isRecord={isRecord}
            saved={saved}
            onReplay={startCountdown}
            onExit={exit}
          />
        ) : puzzle ? (
          <div>
            <GameHud
              format={format}
              run={run}
              questionLeft={left}
              questionTotal={perPuzzle}
              globalLeft={null}
            />

            <p className="mt-5 mb-3 text-xs font-bold tracking-wide text-[color:var(--jeu-accent)] uppercase">
              {format.lexicon.verb}
            </p>

            {/* `key` : chaque tirage repart d'un plateau vierge — sans elle, les
                plaques du tirage précédent resteraient en jeu. */}
            <CountdownBoard
              key={`${puzzle.id}-${index}`}
              puzzle={puzzle}
              revealSolution={revealed}
              onSolved={() => closePuzzle(true)}
            />

            <GameQuitLink onExit={exit} />
          </div>
        ) : null}
      </div>
    </ModeStage>
  )
}
