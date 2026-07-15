'use client'

import { useEffect, useRef, useState } from 'react'
import { Skull, Zap, Check, X, RotateCcw, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { XP_RULES } from '@/lib/xp'
import { recordChallenge } from '@/app/defi/actions'
import { recordReviewAnswers } from '@/app/reviser/actions'
import type { ReviewAnswer } from '@/lib/srs'
import {
  SURVIE_BEST_STORAGE_KEY,
  MODE_XP_BONUS,
  type ModeQuestion,
} from '@/lib/defi-modes'

type Phase = 'intro' | 'playing' | 'done'

function readBest(): number {
  try {
    return Number(window.localStorage.getItem(SURVIE_BEST_STORAGE_KEY)) || 0
  } catch {
    return 0
  }
}

// Survie : mort subite. Les questions s'enchaînent, la première erreur met
// fin à la série — le score, c'est la longueur de la série.
export default function SurvivalMode({
  pool,
  onExit,
}: {
  pool: ModeQuestion[]
  onExit: () => void
}) {
  const [phase, setPhase] = useState<Phase>('intro')
  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [streak, setStreak] = useState(0)
  const [best, setBest] = useState(0)
  const [isRecord, setIsRecord] = useState(false)
  const [saved, setSaved] = useState<boolean | null>(null)
  // Réponses de la partie pour la répétition espacée (SRS + Revanche).
  const reviewsRef = useRef<ReviewAnswer[]>([])
  // Verrou synchrone anti-double-tap : sans lui, deux taps rapprochés (avant que
  // React re-rende) franchissent tous deux la garde `answered` (en retard d'un
  // rendu) → deux timers d'avance armés → une question sautée + une réponse en
  // double dans la file SRS. On ne le relâche qu'au changement de `qIndex`.
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
    setQIndex((n) => n + 1)
    setSelected(null)
    setStreak(0)
    setSaved(null)
    setIsRecord(false)
    reviewsRef.current = []
    setPhase('playing')
  }

  const finish = (finalStreak: number) => {
    sfx.complete()
    const prevBest = readBest()
    if (finalStreak > prevBest) {
      setIsRecord(true)
      try {
        window.localStorage.setItem(
          SURVIE_BEST_STORAGE_KEY,
          String(finalStreak),
        )
      } catch {
        // stockage indisponible : tant pis pour le record local
      }
    }
    setBest(Math.max(prevBest, finalStreak))
    setPhase('done')
    // La série + la question fatale = le total de questions répondues.
    recordChallenge(finalStreak, finalStreak + 1, 'survie')
      .then((r) => setSaved(r.saved))
      .catch(() => setSaved(false))
    // Reprogramme chaque question dans la file « À revoir ».
    recordReviewAnswers(reviewsRef.current).catch(() => {})
  }

  const answer = (i: number) => {
    if (!question || answered || answerLockRef.current) return
    answerLockRef.current = true
    setSelected(i)
    const good = i === question.correctIndex
    reviewsRef.current.push({
      kind: 'question',
      id: question.id,
      subject: question.subject,
      good,
    })
    if (good) {
      sfx.correct()
      const newStreak = streak + 1
      setStreak(newStreak)
      window.setTimeout(() => {
        setQIndex((n) => n + 1)
        setSelected(null)
      }, 550)
    } else {
      sfx.wrong()
      // On laisse voir la bonne réponse avant l'écran de fin.
      window.setTimeout(() => finish(streak), 1200)
    }
  }

  // ------------------------------------------------------------------- intro
  if (phase === 'intro') {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-6 pt-4 text-center">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl font-bold">Survie</h1>
          <p className="text-sm text-muted-foreground">
            Les questions s&apos;enchaînent sans fin.
            <br />
            Une seule erreur, et c&apos;est terminé. Jusqu&apos;où iras-tu ?
          </p>
        </div>

        {best > 0 ? (
          <p className="flex items-center gap-1.5 rounded-full border bg-card px-4 py-1.5 text-sm font-semibold shadow-sm">
            <Trophy className="size-4 text-highlight" /> Record :{' '}
            <span className="font-mono tabular-nums">{best}</span> d&apos;affilée
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
          <Skull className="size-9 transition-transform group-hover:rotate-12" />
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
      streak * XP_RULES.challengePerCorrect +
      XP_RULES.challengeBonus +
      MODE_XP_BONUS.survie
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-5 pt-8 text-center">
        <div className="animate-in zoom-in text-6xl duration-500">
          {isRecord ? '🏆' : streak >= 8 ? '💀' : '🌱'}
        </div>
        <div>
          <h1 className="font-heading text-3xl font-bold">
            {isRecord ? 'Nouveau record !' : 'Éliminé !'}
          </h1>
          <p className="mt-2 font-mono text-4xl font-bold tabular-nums">
            {streak}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            bonne{streak > 1 ? 's' : ''} réponse{streak > 1 ? 's' : ''}{' '}
            d&apos;affilée avant la chute.
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
        <span className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
          <Skull className="size-4" /> Mort subite
        </span>
        <span
          key={streak}
          className="animate-in zoom-in-75 font-mono text-2xl font-bold duration-200 tabular-nums"
        >
          {streak}
        </span>
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
            ? 'Bonne réponse, tu survis'
            : 'Mauvaise réponse, série terminée'
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
