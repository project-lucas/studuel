'use client'

import { useEffect, useRef, useState } from 'react'
import { Timer, Zap, Check, X, RotateCcw, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { XP_RULES } from '@/lib/xp'
import { recordChallenge } from '@/app/defi/actions'
import { recordReviewAnswers } from '@/app/reviser/actions'
import type { ReviewAnswer } from '@/lib/srs'
import {
  BLITZ_SECONDS,
  BLITZ_BEST_STORAGE_KEY,
  blitzMultiplier,
  blitzPoints,
  type ModeQuestion,
} from '@/lib/defi-modes'

type Phase = 'intro' | 'playing' | 'done'

function readBest(): number {
  try {
    return Number(window.localStorage.getItem(BLITZ_BEST_STORAGE_KEY)) || 0
  } catch {
    return 0
  }
}

// Blitz 60 secondes : un flux de questions, un combo qui multiplie les
// points, un record à battre. La partie parfaite pour « encore une ».
export default function BlitzMode({
  pool,
  onExit,
}: {
  pool: ModeQuestion[]
  onExit: () => void
}) {
  const [phase, setPhase] = useState<Phase>('intro')
  const [secondsLeft, setSecondsLeft] = useState(BLITZ_SECONDS)
  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [bestCombo, setBestCombo] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [answeredCount, setAnsweredCount] = useState(0)
  const [best, setBest] = useState(0)
  const [isRecord, setIsRecord] = useState(false)
  const [saved, setSaved] = useState<boolean | null>(null)
  // Miroirs des compteurs pour la fin de partie, déclenchée par le chrono
  // (le callback d'intervalle ne voit pas les states frais).
  const statsRef = useRef({ score: 0, correct: 0, answered: 0 })
  const secondsRef = useRef(BLITZ_SECONDS)
  const finishedRef = useRef(false)
  // Réponses de la partie pour la répétition espacée (SRS + Revanche).
  const reviewsRef = useRef<ReviewAnswer[]>([])

  // Le record se lit après montage (localStorage) — même pattern que le mode
  // trajet de DefiHome.
  useEffect(() => {
    const load = () => setBest(readBest())
    load()
  }, [])

  const question = pool.length > 0 ? pool[qIndex % pool.length] : null
  const answered = selected !== null
  const multiplier = blitzMultiplier(combo)

  const start = () => {
    sfx.flip()
    finishedRef.current = false
    statsRef.current = { score: 0, correct: 0, answered: 0 }
    reviewsRef.current = []
    secondsRef.current = BLITZ_SECONDS
    setSecondsLeft(BLITZ_SECONDS)
    setQIndex((n) => n + 1) // repart ailleurs dans le pool d'une partie à l'autre
    setSelected(null)
    setScore(0)
    setCombo(0)
    setBestCombo(0)
    setCorrect(0)
    setAnsweredCount(0)
    setSaved(null)
    setIsRecord(false)
    setPhase('playing')
  }

  // Le chrono : ne décompte que l'onglet visible (pas de partie mangée par un
  // changement d'app), et déclenche lui-même la fin au zéro.
  useEffect(() => {
    if (phase !== 'playing') return

    const finish = () => {
      if (finishedRef.current) return
      finishedRef.current = true
      sfx.complete()
      const { score: s, correct: c, answered: n } = statsRef.current
      const prevBest = readBest()
      if (s > prevBest) {
        setIsRecord(true)
        try {
          window.localStorage.setItem(BLITZ_BEST_STORAGE_KEY, String(s))
        } catch {
          // stockage indisponible : tant pis pour le record local
        }
      }
      setBest(Math.max(prevBest, s))
      setPhase('done')
      // L'XP est recalculée côté serveur depuis score/total.
      recordChallenge(c, n, 'blitz')
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
    if (!question || answered || secondsRef.current === 0) return
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
    if (good) {
      sfx.correct()
      statsRef.current.score += blitzPoints(combo)
      statsRef.current.correct += 1
      setScore((s) => s + blitzPoints(combo))
      setCombo((c) => {
        const n = c + 1
        setBestCombo((b) => Math.max(b, n))
        return n
      })
      setCorrect((n) => n + 1)
    } else {
      sfx.wrong()
      setCombo(0)
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
          <h1 className="font-heading text-3xl font-bold">Blitz 60s</h1>
          <p className="text-sm text-muted-foreground">
            Réponds à un max de questions en {BLITZ_SECONDS} secondes.
            <br />
            3 bonnes réponses d&apos;affilée : les points doublent. Une erreur :
            le combo retombe.
          </p>
        </div>

        {best > 0 ? (
          <p className="flex items-center gap-1.5 rounded-full border bg-card px-4 py-1.5 text-sm font-semibold shadow-sm">
            <Trophy className="size-4 text-highlight" /> Record à battre :{' '}
            <span className="font-mono tabular-nums">{best}</span>
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
          <Timer className="size-9 transition-transform group-hover:rotate-12" />
          <span className="font-heading text-xl font-bold">GO</span>
        </button>

        {pool.length === 0 ? (
          <p className="max-w-xs text-sm text-muted-foreground">
            Pas encore de questions pour ta classe — reviens bientôt !
          </p>
        ) : null}

        <Button variant="ghost" onClick={onExit}>
          Retour aux modes
        </Button>
      </div>
    )
  }

  // -------------------------------------------------------------------- done
  if (phase === 'done') {
    const xp = correct * XP_RULES.challengePerCorrect + XP_RULES.challengeBonus
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-5 pt-8 text-center">
        <div className="animate-in zoom-in text-6xl duration-500">
          {isRecord ? '🏆' : correct >= 5 ? '⚡' : '🌱'}
        </div>
        <div>
          <h1 className="font-heading text-3xl font-bold">
            {isRecord ? 'Nouveau record !' : 'Temps écoulé !'}
          </h1>
          <p className="mt-2 font-mono text-4xl font-bold tabular-nums">{score}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {correct}/{answeredCount} bonnes réponses · meilleur combo ×
            {blitzMultiplier(Math.max(0, bestCombo - 1))} ({bestCombo} d&apos;affilée)
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
            Retour aux modes
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
        <span
          className={cn(
            'font-mono text-2xl font-bold tabular-nums',
            secondsLeft <= 10 && 'text-destructive',
          )}
          role="timer"
          aria-label={`${secondsLeft} secondes restantes`}
        >
          0:{String(secondsLeft).padStart(2, '0')}
        </span>
        <span
          key={multiplier}
          className={cn(
            'pop-spring rounded-full px-3 py-1 font-mono text-sm font-bold tabular-nums',
            multiplier > 1
              ? 'bg-highlight text-foreground shadow-sm'
              : 'bg-muted text-muted-foreground',
          )}
        >
          ×{multiplier}
        </span>
        <span
          key={score}
          className="animate-in zoom-in-75 flex items-center gap-1 font-mono text-2xl font-bold duration-200 tabular-nums"
        >
          {score}
        </span>
      </div>

      {/* Jauge du temps : elle fond — la pression est visuelle, pas que chiffrée. */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-1000 ease-linear',
            secondsLeft <= 10 ? 'bg-destructive' : 'bg-highlight',
          )}
          style={{ width: `${(secondsLeft / BLITZ_SECONDS) * 100}%` }}
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
            ? 'Bonne réponse'
            : 'Mauvaise réponse'
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
