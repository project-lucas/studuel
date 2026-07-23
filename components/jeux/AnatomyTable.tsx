'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import ModeStage from '@/components/defi/ModeStage'
import AnatomyBoard from '@/components/jeux/AnatomyBoard'
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
import type { Organ, OrganRound } from '@/lib/jeux/anatomie'
import {
  answer as applyAnswer,
  questionSeconds,
  startRun,
  timeout as applyTimeout,
  type GameRun,
} from '@/lib/jeux/run'

type Phase = 'intro' | 'countdown' | 'playing' | 'done'

const TICK_MS = 100
const URGENT_FROM = 4
// La correction reste affichée plus longtemps qu'ailleurs : c'est une planche
// d'anatomie, l'intérêt est de VOIR où était l'organe.
const REVEAL_MS = 2000

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
 * La table d'« Anatomie express » — le seul jeu où l'on répond en désignant un
 * endroit sur un schéma. Il tourne sur la mécanique `expedition` : 8 escales,
 * personne n'élimine personne, on va au bout et on compte ses trouvailles.
 *
 * Ce jeu était marqué « Bientôt » depuis l'ouverture du salon SVT.
 */
export default function AnatomyTable({
  format,
  rounds,
  name,
  subject,
  subjectEmoji,
}: {
  format: GameFormat
  rounds: OrganRound[]
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
  const [picked, setPicked] = useState<Organ | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [best, setBest] = useState(0)
  const [isRecord, setIsRecord] = useState(false)
  const [saved, setSaved] = useState<boolean | null>(null)
  // XP réellement versée, renvoyée par le serveur (null tant qu'il n'a pas répondu).
  const [awardedXp, setAwardedXp] = useState<number | null>(null)
  // Numéro de la partie en cours. Une réponse serveur qui arrive APRÈS le
  // lancement de la partie suivante ne doit pas repeindre son écran de fin.
  const partieRef = useRef(0)
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

  const round = rounds.length > 0 ? rounds[index % rounds.length] : null
  const perRound = questionSeconds(format, run)

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

      const partie = partieRef.current
      recordChallenge(final.correct, final.answered)
        .then((r) => {
          if (partie !== partieRef.current) return
          setSaved(r.saved)
          if (r.saved) setAwardedXp(r.xp)
        })
        .catch(() => {
          if (partie === partieRef.current) setSaved(false)
        })
    },
    [audio, format.id],
  )

  // Enchaîne après la correction (organe trouvé, raté, ou temps écoulé).
  const advance = useCallback(
    (next: GameRun) => {
      window.setTimeout(() => {
        if (next.status !== 'playing') {
          finish(next)
          return
        }
        setIndex((n) => n + 1)
        setPicked(null)
        setRevealed(false)
        lastBipRef.current = -1
        leftRef.current = questionSeconds(format, next)
        setLeft(leftRef.current)
        lockRef.current = false
      }, REVEAL_MS)
    },
    [finish, format],
  )

  const onPick = (organ: Organ | null) => {
    if (!round || phase !== 'playing' || lockRef.current) return
    // Un tap hors de toute zone n'est pas une réponse : on ne punit pas un
    // doigt qui glisse à côté de la silhouette.
    if (organ === null) return
    lockRef.current = true
    setPicked(organ)
    setRevealed(true)
    const good = organ.id === round.target.id
    const next = applyAnswer(format, runRef.current, { good, elapsedMs: 0 })
    runRef.current = next
    setRun(next)
    buzz(good, next.streak)
    if (good) audio.correct(next.streak)
    else audio.wrong()
    advance(next)
  }

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
        lockRef.current = true
        setRevealed(true)
        const after = applyTimeout(format, runRef.current)
        runRef.current = after
        setRun(after)
        audio.wrong()
        advance(after)
      }
    }, TICK_MS)
    return () => window.clearInterval(id)
  }, [phase, format, audio, advance])

  const launch = useCallback(() => {
    const fresh = startRun(format)
    finishedRef.current = false
    lockRef.current = false
    lastBipRef.current = -1
    runRef.current = fresh
    setRun(fresh)
    setPicked(null)
    setRevealed(false)
    setSaved(null)
    setAwardedXp(null)
    partieRef.current += 1
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
            empty={rounds.length === 0}
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
            awardedXp={awardedXp}
            onReplay={startCountdown}
            onExit={exit}
          />
        ) : round ? (
          <div>
            <GameHud
              format={format}
              run={run}
              questionLeft={left}
              questionTotal={perRound}
              globalLeft={null}
            />

            <p className="mt-5 text-xs font-bold tracking-wide text-[color:var(--jeu-accent)] uppercase">
              {format.lexicon.verb}
            </p>
            <h2 className="font-heading mt-1 mb-3 text-2xl font-extrabold text-balance">
              Où se trouve {round.target.name} ?
            </h2>

            <AnatomyBoard
              target={round.target}
              picked={picked}
              revealed={revealed}
              onPick={onPick}
            />

            {/* Le repère ne tombe qu'APRÈS la réponse : avant, il donnerait
                l'organe. C'est ici que le jeu enseigne au lieu de tester. */}
            {revealed ? (
              <p className="animate-in fade-in mt-3 rounded-2xl bg-card px-4 py-3 text-center text-sm shadow-sm">
                <strong>{round.target.name}</strong> — {round.target.hint}
              </p>
            ) : null}

            <p role="status" aria-live="polite" className="sr-only">
              {revealed
                ? picked?.id === round.target.id
                  ? 'Bien localisé'
                  : `Raté — c'était ${round.target.name}`
                : ''}
            </p>

            <GameQuitLink onExit={exit} />
          </div>
        ) : null}
      </div>
    </ModeStage>
  )
}
