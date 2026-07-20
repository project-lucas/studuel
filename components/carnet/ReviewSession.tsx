'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'
import { sfx } from '@/lib/sounds'
import type {
  CourseQuestionType,
  QuestionContent,
} from '@/lib/carnet-cours'
import {
  endReviewSession,
  recordAttempt,
  startReviewSession,
} from '@/app/reviser/cours/actions'
import QuestionPlayer, {
  type PlayerResult,
} from '@/components/carnet/QuestionPlayer'

export type PlayableQuestion = {
  id: string
  type: CourseQuestionType
  content: QuestionContent
}

/**
 * Une session de révision : une question par écran, correction immédiate,
 * puis bilan. Les tentatives sont enregistrées au fil de l'eau
 * (carnet_review_attempts) pour nourrir l'onglet Résultats.
 */
export default function ReviewSession({
  courseId,
  chapterId,
  courseTitle,
  scopeLabel,
  questions,
}: {
  courseId: string
  chapterId: string | null
  courseTitle: string
  /** « Tout le cours » ou le titre du chapitre révisé. */
  scopeLabel: string
  questions: PlayableQuestion[]
}) {
  const [index, setIndex] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [finished, setFinished] = useState(false)
  const sessionIdRef = useRef<string | null>(null)
  const endedRef = useRef(false)

  // Ouvre la session côté serveur, une seule fois.
  useEffect(() => {
    let cancelled = false
    startReviewSession(courseId, chapterId).then((res) => {
      if (!cancelled && res.ok && res.id) sessionIdRef.current = res.id
    })
    return () => {
      cancelled = true
    }
  }, [courseId, chapterId])

  const total = questions.length
  const current = questions[index]

  const onAnswered = (result: PlayerResult) => {
    if (answered || !current) return
    setAnswered(true)
    if (result.correct) setCorrectCount((n) => n + 1)
    // Enregistrement en arrière-plan : ne bloque jamais l'élève. Session
    // encore en cours d'ouverture → la tentative est enregistrée hors session
    // plutôt que perdue (le serveur re-corrige de toute façon).
    void recordAttempt(
      sessionIdRef.current,
      current.id,
      result.correct,
      result.given,
    )
  }

  const next = () => {
    sfx.tap()
    if (index + 1 >= total) {
      setFinished(true)
      if (!endedRef.current && sessionIdRef.current) {
        endedRef.current = true
        void endReviewSession(sessionIdRef.current)
      }
      sfx.complete()
      return
    }
    setIndex((i) => i + 1)
    setAnswered(false)
  }

  if (total === 0) {
    return (
      <div className="mx-auto w-full max-w-md">
        <p className="rounded-2xl bg-muted/40 px-3 py-4 text-center text-sm text-muted-foreground">
          Aucune question complète à réviser ici pour l’instant.
        </p>
        <Link
          href={`/reviser/cours/${courseId}`}
          className="font-heading mt-3 block rounded-2xl bg-primary px-4 py-3 text-center text-sm font-extrabold text-primary-foreground"
        >
          Retour au cours
        </Link>
      </div>
    )
  }

  if (finished) {
    const pct = Math.round((correctCount / total) * 100)
    return (
      <div className="mx-auto w-full max-w-md">
        <div className="rev-card rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-black/5">
          <p className="text-4xl" aria-hidden="true">
            {pct >= 80 ? '🏆' : pct >= 50 ? '💪' : '📚'}
          </p>
          <h1 className="font-heading mt-2 text-xl font-extrabold text-foreground">
            Session terminée !
          </h1>
          <p className="mt-1 text-sm font-semibold text-muted-foreground">
            {scopeLabel} · {courseTitle}
          </p>
          <p className="font-heading mt-4 text-3xl font-extrabold text-primary tabular-nums">
            {correctCount} / {total}
          </p>
          <p className="text-xs font-bold text-muted-foreground">
            bonnes réponses ({pct} %)
          </p>
          <div className="mt-5 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                sfx.tap()
                // Nouvelle session sur la même sélection.
                window.location.reload()
              }}
              className="font-heading cursor-pointer rounded-2xl bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground shadow-sm transition active:translate-y-px"
            >
              Rejouer
            </button>
            <Link
              href={`/reviser/cours/${courseId}`}
              onClick={() => sfx.tap()}
              className="font-heading rounded-2xl bg-muted/60 px-4 py-3 text-sm font-extrabold text-foreground"
            >
              Retour au cours
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-md">
      {/* Barre de progression + quitter. */}
      <div className="mb-3 flex items-center gap-3">
        <Link
          href={`/reviser/cours/${courseId}`}
          onClick={() => sfx.tap()}
          aria-label="Quitter la session"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-muted-foreground ring-1 ring-black/5 hover:text-foreground"
        >
          <X className="size-4" aria-hidden="true" />
        </Link>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={index + (answered ? 1 : 0)}
          aria-label="Avancement de la session"
          className="h-3 flex-1 overflow-hidden rounded-full bg-black/5"
        >
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{
              width: `${((index + (answered ? 1 : 0)) / total) * 100}%`,
            }}
          />
        </div>
        <span className="shrink-0 text-xs font-extrabold text-muted-foreground tabular-nums">
          {index + 1}/{total}
        </span>
      </div>

      <p className="mb-2 px-1 text-[11px] font-bold text-muted-foreground">
        {scopeLabel} · {courseTitle}
      </p>

      {/* La question du moment — `key` remonte un joueur neuf à chaque pas. */}
      <div className="rev-card rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5">
        <QuestionPlayer
          key={current.id}
          type={current.type}
          content={current.content}
          onAnswered={onAnswered}
        />
      </div>

      {answered ? (
        <button
          type="button"
          onClick={next}
          className="font-heading mt-3 w-full cursor-pointer rounded-2xl bg-primary px-4 py-3.5 text-sm font-extrabold text-primary-foreground shadow-sm transition active:translate-y-px"
        >
          {index + 1 >= total ? 'Voir le bilan' : 'Continuer'}
        </button>
      ) : null}
    </div>
  )
}
