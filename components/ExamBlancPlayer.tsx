'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlarmClock, ArrowRight, GraduationCap, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { finishExamBlanc, recordReviewAnswers } from '@/app/reviser/actions'
import {
  buildReport,
  examDurationSeconds,
  verdictFor,
  VERDICT_LABELS,
  type ChapterReport,
  type ExamQuestion,
  type ExamVerdict,
} from '@/lib/exam-blanc'
import type { ReviewAnswer } from '@/lib/srs'

type Phase = 'intro' | 'playing' | 'done'

// Pastille de verdict — couleurs sémantiques (vert/ambre/rouge), jamais
// décoratives : c'est un diagnostic.
const VERDICT_CLASS: Record<ExamVerdict, string> = {
  solide:
    'bg-success/10 text-success dark:text-green-400 border-success/40',
  fragile: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/40',
  a_revoir: 'bg-destructive/10 text-destructive border-destructive/40',
}

function formatClock(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

// L'examen blanc : conditions réelles — chrono global, pas de correction
// pendant l'épreuve, bilan par chapitre à la fin. La progression vers
// l'examen se mesure ici, sur du réel.
export default function ExamBlancPlayer({
  questions,
  examTitle,
  lastScore,
  subjectName = null,
}: {
  questions: ExamQuestion[]
  examTitle: string
  lastScore: { score: number; total: number } | null
  // Examen ciblé sur UNE matière (lancé depuis son dossier) → l'intro le dit ;
  // null = examen multi-matières classique.
  subjectName?: string | null
}) {
  const router = useRouter()
  const duration = examDurationSeconds(questions.length)

  const [phase, setPhase] = useState<Phase>('intro')
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [secondsLeft, setSecondsLeft] = useState(duration)
  const [report, setReport] = useState<ChapterReport[]>([])
  const [score, setScore] = useState(0)
  const [saved, setSaved] = useState<boolean | null>(null)

  // Réponses par question (id → juste ?) — un ref : la fin peut venir du
  // chrono, qui ne voit pas les states frais.
  const goodByIdRef = useRef(new Map<string, boolean>())
  const secondsRef = useRef(duration)
  const finishedRef = useRef(false)
  // Verrou synchrone anti double-tap : `selected` (state) ne se met à jour qu'au
  // prochain rendu, donc deux taps rapprochés le franchissaient tous deux et
  // armaient deux avancements → l'index sautait de 2 (une question jamais
  // affichée). L'id du timeout d'avancement est gardé pour pouvoir l'annuler
  // (fin de copie / relance) et éviter qu'il déborde sur la tentative suivante.
  const lockedRef = useRef(false)
  const advanceTimerRef = useRef<number | null>(null)

  const clearAdvance = () => {
    if (advanceTimerRef.current !== null) {
      window.clearTimeout(advanceTimerRef.current)
      advanceTimerRef.current = null
    }
  }

  const question = questions[index]

  const start = () => {
    sfx.flip()
    clearAdvance()
    lockedRef.current = false
    goodByIdRef.current = new Map()
    finishedRef.current = false
    secondsRef.current = duration
    setSecondsLeft(duration)
    setIndex(0)
    setSelected(null)
    setSaved(null)
    setPhase('playing')
  }

  const finish = () => {
    if (finishedRef.current) return
    finishedRef.current = true
    clearAdvance()
    sfx.complete()
    const goodById = goodByIdRef.current
    const finalScore = questions.filter((q) => goodById.get(q.id) === true).length
    const finalReport = buildReport(questions, goodById)
    setScore(finalScore)
    setReport(finalReport)
    setPhase('done')
    // Historique + XP côté serveur, et chaque question rejoint la file SRS
    // (les erreurs de l'examen blanc tombent dans la Revanche).
    finishExamBlanc(finalScore, questions.length, finalReport)
      .then((r) => setSaved(r.saved))
      .catch(() => setSaved(false))
    const reviews: ReviewAnswer[] = questions.map((q) => ({
      kind: 'question',
      id: q.id,
      subject: q.subject,
      good: goodById.get(q.id) === true,
    }))
    recordReviewAnswers(reviews).catch(() => {})
  }

  // Chrono global : décompte onglet visible, fin d'épreuve au zéro.
  useEffect(() => {
    if (phase !== 'playing') return
    const id = setInterval(() => {
      if (document.visibilityState !== 'visible') return
      secondsRef.current = Math.max(0, secondsRef.current - 1)
      setSecondsLeft(secondsRef.current)
      if (secondsRef.current === 0) finish()
    }, 1000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  // Annule un avancement encore en attente au démontage.
  useEffect(
    () => () => {
      if (advanceTimerRef.current !== null) {
        window.clearTimeout(advanceTimerRef.current)
      }
    },
    [],
  )

  const answer = (i: number) => {
    if (!question || lockedRef.current) return
    lockedRef.current = true
    setSelected(i)
    sfx.tap() // pas de son juste/faux : la correction attend la fin, comme le jour J
    goodByIdRef.current.set(question.id, i === question.correctIndex)
    advanceTimerRef.current = window.setTimeout(() => {
      advanceTimerRef.current = null
      if (index + 1 >= questions.length) {
        finish()
      } else {
        setIndex((n) => n + 1)
        setSelected(null)
        lockedRef.current = false
      }
    }, 350)
  }

  // ------------------------------------------------------------------- intro
  if (phase === 'intro') {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-6 pt-4 text-center">
        <span className="flex size-20 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30">
          <GraduationCap className="size-9" aria-hidden="true" />
        </span>
        <div className="space-y-1">
          <h1 className="font-heading text-3xl font-bold">Examen blanc</h1>
          <p className="text-sm font-semibold text-primary">{examTitle}</p>
          <p className="text-sm text-muted-foreground">
            {questions.length} questions · {formatClock(duration)} chrono ·{' '}
            {subjectName ?? 'toutes tes matières'}
            <br />
            Pas de correction pendant l&apos;épreuve — comme le jour J. Le
            bilan chapitre par chapitre tombe à la fin.
          </p>
        </div>

        {lastScore ? (
          <p className="flex items-center gap-1.5 rounded-full border bg-card px-4 py-1.5 text-sm font-semibold shadow-sm">
            <Target className="size-4 text-primary" /> Dernier examen blanc :{' '}
            <span className="font-mono tabular-nums">
              {lastScore.score}/{lastScore.total}
            </span>
          </p>
        ) : null}

        <button
          type="button"
          onClick={start}
          disabled={questions.length === 0}
          className="group go-pulse relative flex size-32 flex-col items-center justify-center gap-1 overflow-hidden rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-4 top-2 h-12 rounded-full bg-gradient-to-b from-white/20 to-transparent"
          />
          <AlarmClock className="size-8 transition-transform group-hover:rotate-12" />
          <span className="font-heading text-xl font-bold">GO</span>
        </button>

        {questions.length === 0 ? (
          <p className="max-w-xs text-sm text-muted-foreground">
            Pas encore assez de questions pour composer un sujet — reviens
            quand tu auras exploré quelques chapitres !
          </p>
        ) : null}

        <Button variant="ghost" onClick={() => router.push('/reviser')}>
          Retour à Réviser
        </Button>
      </div>
    )
  }

  // -------------------------------------------------------------------- bilan
  if (phase === 'done') {
    const ratio = questions.length > 0 ? score / questions.length : 0
    const globalVerdict = verdictFor(ratio)
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-5 pt-6 text-center">
        <div className="animate-in zoom-in text-6xl duration-500">
          {globalVerdict === 'solide'
            ? '🎓'
            : globalVerdict === 'fragile'
              ? '💪'
              : '📚'}
        </div>
        <div>
          <h1 className="font-heading text-3xl font-bold">
            {score}/{questions.length}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {globalVerdict === 'solide'
              ? 'Niveau examen — continue comme ça, tu es prêt·e.'
              : globalVerdict === 'fragile'
                ? 'La base est là. Vise les chapitres fragiles ci-dessous.'
                : 'Bon diagnostic : tu sais exactement quoi retravailler.'}
          </p>
        </div>

        {/* Le bilan : chapitre par chapitre, à revoir d'abord — c'est le plan
            de travail qui sort de l'examen. */}
        <section
          className="w-full rounded-2xl border bg-card p-4 text-left shadow-sm"
          aria-label="Bilan par chapitre"
        >
          <h2 className="font-heading mb-3 text-base font-bold">
            Bilan par chapitre
          </h2>
          <ul className="flex flex-col gap-2">
            {report.map((r) => {
              const content = (
                <>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">
                      {r.chapterTitle ?? r.subject}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {r.chapterTitle ? r.subject + ' · ' : ''}
                      {r.correct}/{r.total} bonnes réponses
                    </span>
                  </span>
                  <span
                    className={cn(
                      'shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold',
                      VERDICT_CLASS[r.verdict],
                    )}
                  >
                    {VERDICT_LABELS[r.verdict]}
                  </span>
                </>
              )
              const key = `${r.chapterId ?? r.subject}`
              // Un chapitre identifié et non solide devient un lien direct
              // vers sa page — le bilan se transforme en action.
              return r.chapterId && r.subjectSlug && r.verdict !== 'solide' ? (
                <li key={key}>
                  <Link
                    href={`/reviser/${r.subjectSlug}/${r.chapterId}`}
                    className="flex items-center gap-3 rounded-xl border p-2.5 transition-colors hover:border-primary/40 hover:bg-accent"
                  >
                    {content}
                    <ArrowRight
                      className="size-4 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ) : (
                <li key={key} className="flex items-center gap-3 rounded-xl border p-2.5">
                  {content}
                </li>
              )
            })}
          </ul>
        </section>

        <p className="text-sm text-muted-foreground">
          {saved === true
            ? '✓ Examen enregistré — tes erreurs sont dans la Revanche.'
            : saved === false
              ? 'Examen non enregistré (connecte-toi pour garder ton bilan).'
              : ''}
        </p>

        <div className="flex gap-2">
          <Button onClick={start} variant="outline">
            Repasser un examen
          </Button>
          <Button onClick={() => router.push('/reviser')}>
            Retour à Réviser
          </Button>
        </div>
      </div>
    )
  }

  // ------------------------------------------------------------------ épreuve
  if (!question) return null
  const urgent = secondsLeft <= 60

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-mono tabular-nums text-muted-foreground">
          {index + 1}/{questions.length}
        </span>
        <span
          className={cn(
            'flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-sm font-bold tabular-nums',
            urgent
              ? 'bg-destructive/10 text-destructive'
              : 'bg-muted text-foreground',
          )}
          role="timer"
          aria-label={`Temps restant : ${formatClock(secondsLeft)}`}
        >
          <AlarmClock className="size-4" aria-hidden="true" />
          {formatClock(secondsLeft)}
        </span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-label="Progression de l'examen"
        aria-valuemin={0}
        aria-valuemax={questions.length}
        aria-valuenow={index}
        aria-valuetext={`Question ${index + 1} sur ${questions.length}`}
      >
        <div
          className="h-full rounded-full bg-highlight transition-all"
          style={{ width: `${(index / questions.length) * 100}%` }}
        />
      </div>

      {question.subject ? (
        <p className="text-xs font-semibold text-muted-foreground uppercase">
          {question.subject}
          {question.chapterTitle ? ` · ${question.chapterTitle}` : ''}
        </p>
      ) : null}

      <h2 className="font-heading mb-1 text-xl font-bold text-balance">
        {question.prompt}
      </h2>
      <div className="flex flex-col gap-2">
        {question.options.map((option, i) => {
          const isSelected = i === selected
          return (
            <button
              key={i}
              type="button"
              disabled={selected !== null}
              onClick={() => answer(i)}
              className={cn(
                'flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-all',
                selected === null &&
                  'hover:border-primary/40 hover:bg-accent hover:text-accent-foreground active:scale-[0.99]',
                // Pas de vert/rouge : on ne montre que la sélection,
                // la correction attend la fin de l'épreuve.
                isSelected && 'border-primary bg-primary/10',
                selected !== null && !isSelected && 'opacity-50',
              )}
            >
              {option}
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={finish}
        className="mt-2 self-center text-sm text-muted-foreground underline-offset-4 hover:underline"
      >
        Rendre ma copie
      </button>
    </div>
  )
}
