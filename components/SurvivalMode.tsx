'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Skull, Check, X, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { gameSfx, sfx } from '@/lib/sounds'
import type { Gain } from '@/lib/gains'
import { recordChallenge } from '@/app/defi/actions'
import { recordModeScore } from '@/app/defi/palmares-actions'
import FinDePartie from '@/components/palmares/FinDePartie'
import type { BilanPartie } from '@/lib/palmares/bilan'
import { recordReviewAnswers } from '@/app/reviser/actions'
import type { ReviewAnswer } from '@/lib/srs'
import {
  SURVIE_BEST_STORAGE_KEY,
  MODE_TIMBRE,
  nowMs,
  type ModeQuestion,
  modeScene,
} from '@/lib/defi-modes'
import ModeHero from '@/components/defi/ModeHero'

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
  // La Survie sonne VELOURS : registre grave, attaque lente, mineur. On retient
  // son souffle — l'inverse exact de la mitraille du Blitz.
  const audio = useMemo(() => gameSfx(MODE_TIMBRE.survie), [])
  const [phase, setPhase] = useState<Phase>('intro')
  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [streak, setStreak] = useState(0)
  const [best, setBest] = useState(0)
  const [isRecord, setIsRecord] = useState(false)
  const [saved, setSaved] = useState<boolean | null>(null)
  // Ce que la partie a rapporté, tel que la base l'a écrit (rien avant 348).
  const [gains, setGains] = useState<Gain[]>([])
  // Le bilan du Palmarès (352) : dernière fois, record, échelle de la semaine.
  const [bilan, setBilan] = useState<BilanPartie | null>(null)
  const [enAttente, setEnAttente] = useState(false)
  const [recordAvant, setRecordAvant] = useState(0)
  const startRef = useRef(0)
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
    setGains([])
    setBilan(null)
    setEnAttente(false)
    reviewsRef.current = []
    startRef.current = nowMs()
    setPhase('playing')
  }

  const finish = (finalStreak: number) => {
    // La Survie ne se « termine » jamais bien : on tombe. Fanfare partagée
    // seulement quand la série valait le coup, sinon la descente du timbre.
    if (finalStreak >= 5) sfx.complete()
    else audio.lose()
    const prevBest = readBest()
    setRecordAvant(prevBest)
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
      .then((r) => {
        setSaved(r.saved)
        setGains(r.gains)
      })
      .catch(() => setSaved(false))
    // Le Palmarès : la série entre sur l'échelle de la semaine.
    setEnAttente(true)
    recordModeScore('survie', finalStreak, Math.max(1, nowMs() - startRef.current))
      .then((b) => {
        setBilan(b)
        if (b && b.best > finalStreak) setBest(b.best)
      })
      .catch(() => setBilan(null))
      .finally(() => setEnAttente(false))
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
      audio.correct(streak + 1)
      const newStreak = streak + 1
      setStreak(newStreak)
      window.setTimeout(() => {
        setQIndex((n) => n + 1)
        setSelected(null)
      }, 550)
    } else {
      // Mort subite : ce n'est pas « une erreur », c'est LA fin. Le son de vie
      // perdue (deux notes qui tombent) le dit avant même l'écran de résultat.
      audio.lifeLost()
      // On laisse voir la bonne réponse avant l'écran de fin.
      window.setTimeout(() => finish(streak), 1200)
    }
  }

  // ------------------------------------------------------------------- intro
  if (phase === 'intro') {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-6 pt-4 text-center">
        {/* L'ambiance du mode : la scène de son billet, fondue dans sa robe. */}
        <ModeHero scene={modeScene('survie')} titre="Survie" dansIntro />
        <div className="space-y-1">
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
      </div>
    )
  }

  // -------------------------------------------------------------------- done
  if (phase === 'done') {
    return (
      <FinDePartie
        mode="survie"
        score={streak}
        titreAttente="Éliminé !"
        detail={
          <>
            bonne{streak > 1 ? 's' : ''} réponse{streak > 1 ? 's' : ''} d&apos;affilée
            avant la chute.
          </>
        }
        bilan={bilan}
        enAttente={enAttente}
        recordLocalAvant={isRecord ? recordAvant : best}
        gains={gains}
        saved={saved}
        onRejouer={start}
      />
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
