'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Subject } from '@/lib/types'
import {
  STORAGE_KEY,
  WELCOME_STEPS,
  canAdvance,
  defaultSelectedForGrade,
  parseAnswers,
  serializeAnswers,
  stepProgress,
  subjectsForGrade,
  type OnboardingAnswers,
  type WelcomeStep,
} from '@/lib/welcome'
import {
  GoalStep,
  GradeStep,
  MascotBubble,
  MotivationStep,
  SourceStep,
  SubjectsStep,
} from './WelcomeSteps'
import SignUpStep from './SignUpStep'

const PREPARING_MS = 2400
const PREPARING_LINES = [
  'On adapte ton programme à ta classe…',
  'On choisit tes premiers défis…',
  'On allume ta flamme… 🔥',
]

export default function WelcomeFlow({ subjects }: { subjects: Subject[] }) {
  const [index, setIndex] = useState(0)
  // Reprise : relit le brouillon local dès le premier rendu (l'accueil ne
  // dépend d'aucune réponse → pas de décalage d'hydratation visible).
  const [answers, setAnswers] = useState<OnboardingAnswers>(() =>
    parseAnswers(
      typeof window !== 'undefined'
        ? window.localStorage.getItem(STORAGE_KEY)
        : null,
    ),
  )

  const step: WelcomeStep = WELCOME_STEPS[index]

  // Sauvegarde à chaque changement de réponse (reprise après rafraîchissement).
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, serializeAnswers(answers))
  }, [answers])

  const goNext = useCallback(
    () => setIndex((i) => Math.min(i + 1, WELCOME_STEPS.length - 1)),
    [],
  )
  const goBack = useCallback(
    () =>
      setIndex((i) => {
        let next = Math.max(i - 1, 0)
        // Jamais l'écran de préparation en arrière : il s'auto-avance.
        if (WELCOME_STEPS[next] === 'preparing') next = Math.max(next - 1, 0)
        return next
      }),
    [],
  )

  // Écran de préparation : avance tout seul vers l'inscription.
  const [prepLine, setPrepLine] = useState(0)
  useEffect(() => {
    if (step !== 'preparing') return
    const cycle = setInterval(
      () => setPrepLine((n) => Math.min(n + 1, PREPARING_LINES.length - 1)),
      PREPARING_MS / PREPARING_LINES.length,
    )
    const done = setTimeout(goNext, PREPARING_MS)
    return () => {
      clearInterval(cycle)
      clearTimeout(done)
    }
  }, [step, goNext])

  const pickGrade = (grade: string) =>
    setAnswers((a) => ({
      ...a,
      grade,
      // Nouvelle classe → toutes ses matières cochées par défaut.
      subjects: defaultSelectedForGrade(subjects, grade),
    }))

  const toggleSubject = (slug: string) =>
    setAnswers((a) => ({
      ...a,
      subjects: a.subjects.includes(slug)
        ? a.subjects.filter((s) => s !== slug)
        : [...a.subjects, slug],
    }))

  const progress = stepProgress(step)
  const showChrome = step !== 'intro' && step !== 'preparing'

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background pb-[env(safe-area-inset-bottom)]">
      {/* En-tête : retour + barre de progression (masqués sur accueil/prépa). */}
      {showChrome ? (
        <header className="flex items-center gap-3 px-4 pt-[calc(env(safe-area-inset-top)+0.75rem)] pb-3">
          <button
            type="button"
            onClick={goBack}
            aria-label="Étape précédente"
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div
            className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-label="Progression de l'inscription"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round((progress ?? 0) * 100)}
          >
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
              style={{ width: `${(progress ?? 0) * 100}%` }}
            />
          </div>
        </header>
      ) : null}

      {step === 'intro' ? (
        <IntroStep onStart={goNext} />
      ) : step === 'preparing' ? (
        <PreparingStep line={PREPARING_LINES[prepLine]} />
      ) : (
        <>
          <main className="min-h-0 flex-1 overflow-y-auto px-5 pb-4">
            <div className="mx-auto flex w-full max-w-md flex-col pt-2">
              {step === 'motivation' ? (
                <MotivationStep
                  answers={answers}
                  onPick={(v) => setAnswers((a) => ({ ...a, motivation: v }))}
                />
              ) : step === 'source' ? (
                <SourceStep
                  answers={answers}
                  onPick={(v) => setAnswers((a) => ({ ...a, source: v }))}
                />
              ) : step === 'grade' ? (
                <GradeStep answers={answers} onPick={pickGrade} />
              ) : step === 'subjects' ? (
                <SubjectsStep
                  subjects={subjects}
                  answers={answers}
                  onToggle={toggleSubject}
                />
              ) : step === 'goal' ? (
                <GoalStep
                  answers={answers}
                  onPick={(v) => setAnswers((a) => ({ ...a, goal: v }))}
                />
              ) : step === 'signup' ? (
                <SignUpStep
                  answers={answers}
                  subjectCount={subjectsForGrade(subjects, answers.grade).length}
                />
              ) : null}
            </div>
          </main>

          {/* Barre d'action : le bouton « Continuer » vit ici, hors du signup
              (qui a son propre bouton de soumission). */}
          {step !== 'signup' ? (
            <footer className="border-t bg-card/60 px-5 py-4 backdrop-blur-sm">
              <div className="mx-auto w-full max-w-md">
                <Button
                  size="lg"
                  className="w-full"
                  disabled={!canAdvance(step, answers)}
                  onClick={goNext}
                >
                  Continuer
                </Button>
              </div>
            </footer>
          ) : null}
        </>
      )}
    </div>
  )
}

function IntroStep({ onStart }: { onStart: () => void }) {
  return (
    <main className="flex min-h-0 flex-1 flex-col items-center justify-center gap-8 px-6 text-center">
      <MascotBubble image="/images/mascotte/flamme-3-rayonnante.webp" size={132}>
        Salut ! Moi c&apos;est ta flamme 🔥 En 30 secondes, je prépare ton
        espace de révision rien que pour toi.
      </MascotBubble>
      <div className="flex w-full max-w-md flex-col gap-2.5">
        <Button size="lg" className="w-full" onClick={onStart}>
          Commencer
        </Button>
        <Button asChild variant="ghost" size="lg" className="w-full">
          <Link href="/login">J&apos;ai déjà un compte</Link>
        </Button>
      </div>
    </main>
  )
}

function PreparingStep({ line }: { line: string }) {
  return (
    <main className="flex min-h-0 flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <Image
        src="/images/mascotte/flamme-celebration.webp"
        alt=""
        aria-hidden="true"
        width={148}
        height={148}
        priority
        className="float-slow drop-shadow-sm"
      />
      <div className="w-full max-w-xs">
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-full origin-left animate-[bar-grow_2.4s_ease-out_forwards] rounded-full bg-primary" />
        </div>
        <p
          aria-live="polite"
          className={cn(
            'mt-4 text-sm font-medium text-muted-foreground',
            'motion-safe:animate-in motion-safe:fade-in',
          )}
          key={line}
        >
          {line}
        </p>
      </div>
    </main>
  )
}
