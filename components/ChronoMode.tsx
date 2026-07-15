'use client'

import { useEffect, useRef, useState } from 'react'
import { Hourglass, Zap, Check, X, RotateCcw, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { XP_RULES } from '@/lib/xp'
import { recordChallenge } from '@/app/defi/actions'
import { recordReviewAnswers } from '@/app/reviser/actions'
import type { ReviewAnswer } from '@/lib/srs'
import {
  CHRONO_START_SECONDS,
  CHRONO_GAIN_SECONDS,
  CHRONO_LOSS_SECONDS,
  CHRONO_MAX_SECONDS,
  CHRONO_BEST_STORAGE_KEY,
  MODE_XP_BONUS,
  chronoAfterAnswer,
  type ModeQuestion,
} from '@/lib/defi-modes'

type Phase = 'intro' | 'playing' | 'done'

function readBest(): number {
  try {
    return Number(window.localStorage.getItem(CHRONO_BEST_STORAGE_KEY)) || 0
  } catch {
    return 0
  }
}

// Contre-la-montre : on part avec 20 s, chaque bonne réponse en rend 5,
// chaque erreur en coûte 3. La précision prolonge la partie.
export default function ChronoMode({
  pool,
  onExit,
}: {
  pool: ModeQuestion[]
  onExit: () => void
}) {
  const [phase, setPhase] = useState<Phase>('intro')
  const [secondsLeft, setSecondsLeft] = useState(CHRONO_START_SECONDS)
  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [correct, setCorrect] = useState(0)
  const [answeredCount, setAnsweredCount] = useState(0)
  const [lastDelta, setLastDelta] = useState<number | null>(null)
  const [best, setBest] = useState(0)
  const [isRecord, setIsRecord] = useState(false)
  const [saved, setSaved] = useState<boolean | null>(null)
  const statsRef = useRef({ correct: 0, answered: 0 })
  const secondsRef = useRef(CHRONO_START_SECONDS)
  const finishedRef = useRef(false)
  // Réponses de la partie pour la répétition espacée (SRS + Revanche).
  const reviewsRef = useRef<ReviewAnswer[]>([])
  // Verrou synchrone anti-double-tap : deux taps rapprochés franchissent sinon
  // la garde `answered` (en retard d'un rendu) → deux timers d'avance armés →
  // une question sautée + un double mouvement de temps. Relâché au prochain
  // `qIndex`.
  const answerLockRef = useRef(false)

  useEffect(() => {
    const load = () => setBest(readBest())
    load()
  }, [])

  useEffect(() => {
    answerLockRef.current = false
  }, [qIndex])

  const question = pool.length > 0 ? pool[qIndex % pool.length] : null
  const answered = selected !== null

  const start = () => {
    sfx.flip()
    finishedRef.current = false
    statsRef.current = { correct: 0, answered: 0 }
    reviewsRef.current = []
    secondsRef.current = CHRONO_START_SECONDS
    setSecondsLeft(CHRONO_START_SECONDS)
    setQIndex((n) => n + 1)
    setSelected(null)
    setCorrect(0)
    setAnsweredCount(0)
    setLastDelta(null)
    setSaved(null)
    setIsRecord(false)
    setPhase('playing')
  }

  // Le chrono décompte (onglet visible) et déclenche la fin au zéro.
  useEffect(() => {
    if (phase !== 'playing') return

    const finish = () => {
      if (finishedRef.current) return
      finishedRef.current = true
      sfx.complete()
      const { correct: c, answered: n } = statsRef.current
      const prevBest = readBest()
      if (c > prevBest) {
        setIsRecord(true)
        try {
          window.localStorage.setItem(CHRONO_BEST_STORAGE_KEY, String(c))
        } catch {
          // stockage indisponible : tant pis pour le record local
        }
      }
      setBest(Math.max(prevBest, c))
      setPhase('done')
      recordChallenge(c, n, 'chrono')
        .then((r) => setSaved(r.saved))
        .catch(() => setSaved(false))
      // Reprogramme chaque question dans la file « À revoir ».
      recordReviewAnswers(reviewsRef.current).catch(() => {})
    }

    const id = setInterval(() => {
      if (document.visibilityState !== 'visible') return
      secondsRef.current = Math.max(0, secondsRef.current - 1)
      setSecondsLeft(secondsRef.current)
      if (secondsRef.current === 0) finish()
    }, 1000)
    return () => clearInterval(id)
  }, [phase])

  const answer = (i: number) => {
    if (!question || answered || answerLockRef.current || secondsRef.current === 0)
      return
    answerLockRef.current = true
    setSelected(i)
    const good = i === question.correctIndex
    reviewsRef.current.push({
      kind: 'question',
      id: question.id,
      subject: question.subject,
      good,
    })
    statsRef.current.answered += 1
    setAnsweredCount((n) => n + 1)
    // Le temps est la seule monnaie : il bouge à chaque réponse.
    secondsRef.current = chronoAfterAnswer(secondsRef.current, good)
    setSecondsLeft(secondsRef.current)
    setLastDelta(good ? CHRONO_GAIN_SECONDS : -CHRONO_LOSS_SECONDS)
    if (good) {
      sfx.correct()
      statsRef.current.correct += 1
      setCorrect((n) => n + 1)
    } else {
      sfx.wrong()
    }
    window.setTimeout(() => {
      setQIndex((n) => n + 1)
      setSelected(null)
    }, 550)
  }

  // ------------------------------------------------------------------- intro
  if (phase === 'intro') {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-6 pt-4 text-center">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl font-bold">Contre-la-montre</h1>
          <p className="text-sm text-muted-foreground">
            {CHRONO_START_SECONDS} secondes au départ. Bonne réponse : +
            {CHRONO_GAIN_SECONDS} s. Erreur : −{CHRONO_LOSS_SECONDS} s.
            <br />
            Tiens le plus longtemps possible !
          </p>
        </div>

        {best > 0 ? (
          <p className="flex items-center gap-1.5 rounded-full border bg-card px-4 py-1.5 text-sm font-semibold shadow-sm">
            <Trophy className="size-4 text-highlight" /> Record :{' '}
            <span className="font-mono tabular-nums">{best}</span> questions
          </p>
        ) : null}

        <button
          type="button"
          onClick={start}
          disabled={pool.length === 0}
          className="group go-pulse relative flex size-32 flex-col items-center justify-center gap-1 overflow-hidden rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-4 top-2 h-12 rounded-full bg-gradient-to-b from-white/20 to-transparent"
          />
          <Hourglass className="size-9 transition-transform group-hover:rotate-12" />
          <span className="font-heading text-xl font-bold">GO</span>
        </button>

        {pool.length === 0 ? (
          <p className="max-w-xs text-sm text-muted-foreground">
            Pas encore de questions pour ta classe — reviens bientôt !
          </p>
        ) : null}

        <Button variant="ghost" onClick={onExit}>
          Retour à l&apos;Arène
        </Button>
      </div>
    )
  }

  // -------------------------------------------------------------------- done
  if (phase === 'done') {
    const xp =
      correct * XP_RULES.challengePerCorrect +
      XP_RULES.challengeBonus +
      MODE_XP_BONUS.chrono
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-5 pt-8 text-center">
        <div className="animate-in zoom-in text-6xl duration-500">
          {isRecord ? '🏆' : correct >= 8 ? '⏱️' : '🌱'}
        </div>
        <div>
          <h1 className="font-heading text-3xl font-bold">
            {isRecord ? 'Nouveau record !' : 'Temps écoulé !'}
          </h1>
          <p className="mt-2 font-mono text-4xl font-bold tabular-nums">
            {correct}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            bonnes réponses sur {answeredCount} — le temps t&apos;a lâché.
          </p>
          {!isRecord && best > 0 ? (
            <p className="mt-1 text-xs text-muted-foreground">
              Record : <span className="font-mono tabular-nums">{best}</span>
            </p>
          ) : null}
        </div>

        <div className="animate-in slide-in-from-bottom-2 flex items-center gap-2 rounded-full bg-highlight px-6 py-3 font-mono text-2xl font-bold text-foreground shadow-lg duration-700 tabular-nums">
          <Zap className="size-6" /> +{xp} XP
        </div>

        <p className="text-sm text-muted-foreground">
          {saved === true
            ? '✓ Journée validée — ta série continue 🔥'
            : saved === false
              ? 'Partie non enregistrée (connecte-toi pour garder ton XP).'
              : ''}
        </p>

        <div className="flex gap-2">
          <Button size="lg" onClick={start}>
            <RotateCcw className="size-4" /> Rejouer
          </Button>
          <Button variant="outline" size="lg" onClick={onExit}>
            Retour à l&apos;Arène
          </Button>
        </div>
      </div>
    )
  }

  // ------------------------------------------------------------------ partie
  if (!question) return null

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="flex items-baseline gap-2">
          <span
            className={cn(
              'font-mono text-2xl font-bold tabular-nums',
              secondsLeft <= 8 && 'text-destructive',
            )}
            role="timer"
            aria-label={`${secondsLeft} secondes restantes`}
          >
            0:{String(secondsLeft).padStart(2, '0')}
          </span>
          {lastDelta !== null ? (
            <span
              key={answeredCount}
              className={cn(
                'pop-spring font-mono text-sm font-bold tabular-nums',
                lastDelta > 0
                  ? 'text-green-700 dark:text-green-400'
                  : 'text-destructive',
              )}
            >
              {lastDelta > 0 ? `+${lastDelta}` : lastDelta} s
            </span>
          ) : null}
        </span>
        <span
          key={correct}
          className="animate-in zoom-in-75 font-mono text-2xl font-bold duration-200 tabular-nums"
        >
          {correct}
        </span>
      </div>

      {/* Jauge du temps : proportionnelle au plafond, elle fond en continu. */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-1000 ease-linear',
            secondsLeft <= 8 ? 'bg-destructive' : 'bg-highlight',
          )}
          style={{ width: `${(secondsLeft / CHRONO_MAX_SECONDS) * 100}%` }}
        />
      </div>

      {question.subject ? (
        <p className="text-xs font-semibold text-muted-foreground uppercase">
          {question.subject}
        </p>
      ) : null}

      <h2 className="font-heading mb-1 text-xl font-bold text-balance">
        {question.prompt}
      </h2>
      <div className="flex flex-col gap-2">
        {question.options.map((option, i) => {
          const isCorrect = i === question.correctIndex
          const isSelected = i === selected
          return (
            <button
              key={i}
              type="button"
              disabled={answered}
              onClick={() => answer(i)}
              className={cn(
                'flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-all',
                !answered &&
                  'hover:border-primary/40 hover:bg-accent hover:text-accent-foreground active:scale-[0.99]',
                answered &&
                  isCorrect &&
                  'border-green-600 bg-green-600/10 text-green-700 dark:text-green-400',
                answered &&
                  isSelected &&
                  !isCorrect &&
                  'border-destructive bg-destructive/10 text-destructive',
                answered && !isSelected && !isCorrect && 'opacity-50',
              )}
            >
              {option}
              {answered && isCorrect ? <Check className="size-4 shrink-0" /> : null}
              {answered && isSelected && !isCorrect ? (
                <X className="size-4 shrink-0" />
              ) : null}
            </button>
          )
        })}
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {answered
          ? selected === question.correctIndex
            ? 'Bonne réponse, temps gagné'
            : 'Mauvaise réponse, temps perdu'
          : ''}
      </p>

      <button
        type="button"
        onClick={onExit}
        className="mt-2 self-center text-sm text-muted-foreground underline-offset-4 hover:underline"
      >
        Abandonner la partie
      </button>
    </div>
  )
}
