'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { GraduationCap, Target, Flame, BookOpen, Check } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { subjectIcon } from '@/lib/subject-style'
import { saveOnboarding } from '@/app/onboarding/actions'
import { GRADE_LEVELS, type Subject } from '@/lib/types'

const GRADE_HINTS: Record<string, string> = {
  '3e': 'Année du brevet',
  '1re': 'Bac de français',
  Tle: 'Année du bac',
}

const GOALS = [
  { value: 1, label: '1 session / jour', hint: 'Tranquille et régulier' },
  { value: 2, label: '2 sessions / jour', hint: 'Motivé·e' },
  { value: 3, label: '3 sessions / jour', hint: 'Mode examen 🔥' },
]

export default function OnboardingFlow({
  subjects,
  defaultGrade,
  defaultGoal,
  defaultSelected,
}: {
  subjects: Subject[]
  defaultGrade: string | null
  defaultGoal: number
  defaultSelected: string[] | null
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [grade, setGrade] = useState<string | null>(defaultGrade)
  const [goal, setGoal] = useState<number>(defaultGoal)
  const [picked, setPicked] = useState<Set<string>>(
    () => new Set(defaultSelected ?? []),
  )

  const ofLevel = grade ? subjects.filter((s) => s.levels.includes(grade)) : []

  const chooseGrade = (g: string) => {
    setGrade(g)
    // Nouvelle classe → toutes les matières du niveau cochées par défaut.
    setPicked(new Set(subjects.filter((s) => s.levels.includes(g)).map((s) => s.slug)))
  }

  const toggleSubject = (slug: string) =>
    setPicked((prev) => {
      const next = new Set(prev)
      if (next.has(slug)) next.delete(slug)
      else next.add(slug)
      return next
    })

  return (
    <Card className="mx-auto w-full max-w-md">
      {/* Repère de progression : où en est-on dans les 3 étapes. */}
      <div className="px-6 pt-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            Étape {step} / 3
          </span>
          <span className="text-[11px] font-medium text-muted-foreground/70">
            {step === 1 ? 'Classe' : step === 2 ? 'Matières' : 'Objectif'}
          </span>
        </div>
        <div
          className="flex items-center gap-1.5"
          role="progressbar"
          aria-label={`Étape ${step} sur 3`}
          aria-valuemin={1}
          aria-valuemax={3}
          aria-valuenow={step}
        >
          {[1, 2, 3].map((n) => (
            <span
              key={n}
              className={cn(
                'h-1.5 flex-1 overflow-hidden rounded-full transition-colors',
                n <= step ? 'bg-primary' : 'bg-muted',
              )}
            />
          ))}
        </div>
      </div>
      {step === 1 ? (
        <>
          <CardHeader>
            <CardTitle className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <GraduationCap className="size-4.5" />
              </span>
              En quelle classe es-tu ?
            </CardTitle>
            <CardDescription>
              Studuel adapte tes cours, quiz et flashcards à ton programme.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-2.5">
              {GRADE_LEVELS.map((g) => (
                <button
                  key={g}
                  type="button"
                  aria-pressed={grade === g}
                  onClick={() => chooseGrade(g)}
                  className={cn(
                    'relative flex min-h-15 flex-col justify-center rounded-2xl border px-4 py-3 text-left transition-all active:scale-[0.98]',
                    grade === g
                      ? 'border-primary bg-primary text-primary-foreground shadow-md shadow-primary/25'
                      : 'border-border bg-card shadow-sm hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md',
                  )}
                >
                  {grade === g ? (
                    <span className="absolute top-2.5 right-2.5 flex size-5 items-center justify-center rounded-full bg-primary-foreground/20">
                      <Check className="size-3" strokeWidth={3.2} />
                    </span>
                  ) : null}
                  <span className="font-heading text-xl leading-none font-bold">{g}</span>
                  {GRADE_HINTS[g] ? (
                    <span
                      className={cn(
                        'mt-1.5 inline-block w-fit rounded-full px-2 py-0.5 text-[10px] font-semibold',
                        grade === g
                          ? 'bg-primary-foreground/15 text-primary-foreground/90'
                          : 'bg-highlight/20 text-foreground/70',
                      )}
                    >
                      {GRADE_HINTS[g]}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
            <Button className="self-end" disabled={!grade} onClick={() => setStep(2)}>
              Continuer
            </Button>
          </CardContent>
        </>
      ) : step === 2 ? (
        <>
          <CardHeader>
            <CardTitle className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BookOpen className="size-4.5" />
              </span>
              Tes matières en {grade}
            </CardTitle>
            <CardDescription>
              Décoche ce que tu ne suis pas (options, spécialités…). Tu pourras
              modifier plus tard.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-2">
              {ofLevel.map((s) => {
                const checked = picked.has(s.slug)
                const Icon = subjectIcon(s.slug)
                return (
                  <button
                    key={s.slug}
                    type="button"
                    role="checkbox"
                    aria-checked={checked}
                    aria-label={s.name}
                    onClick={() => toggleSubject(s.slug)}
                    className={cn(
                      'relative flex items-center gap-2.5 rounded-2xl border p-2.5 text-left transition-all active:scale-[0.97]',
                      checked
                        ? 'border-primary/40 bg-primary/[0.04] shadow-sm'
                        : 'border-border bg-card opacity-55 hover:opacity-100',
                    )}
                  >
                    <span
                      className={cn(
                        'flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors',
                        checked
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted text-muted-foreground',
                      )}
                    >
                      <Icon className="size-4.5" strokeWidth={2} />
                    </span>
                    <span className="min-w-0 flex-1 pr-5 text-xs leading-tight font-bold">
                      {s.name}
                    </span>
                    <span
                      className={cn(
                        'absolute top-2 right-2 flex size-4.5 items-center justify-center rounded-full border transition-colors',
                        checked
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-muted-foreground/30 bg-card',
                      )}
                    >
                      {checked ? <Check className="size-3" strokeWidth={3} /> : null}
                    </span>
                  </button>
                )
              })}
            </div>
            <div className="flex justify-between">
              <Button type="button" variant="ghost" onClick={() => setStep(1)}>
                Retour
              </Button>
              <Button disabled={picked.size === 0} onClick={() => setStep(3)}>
                Continuer
              </Button>
            </div>
          </CardContent>
        </>
      ) : (
        <>
          <CardHeader>
            <CardTitle className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Target className="size-4.5" />
              </span>
              Ton objectif quotidien ?
            </CardTitle>
            <CardDescription>
              Chaque jour tenu remplit ta série{' '}
              <Flame className="inline size-3.5 text-highlight" /> — tu pourras
              le changer plus tard.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              {GOALS.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  aria-pressed={goal === g.value}
                  onClick={() => setGoal(g.value)}
                  className={cn(
                    'group flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all active:scale-[0.99]',
                    goal === g.value
                      ? 'border-primary bg-primary text-primary-foreground shadow-md shadow-primary/25'
                      : 'border-border bg-card shadow-sm hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md',
                  )}
                >
                  <span
                    className={cn(
                      'flex size-9 shrink-0 items-center justify-center rounded-xl font-heading text-base font-bold tabular-nums transition-colors',
                      goal === g.value
                        ? 'bg-primary-foreground/20 text-primary-foreground'
                        : 'bg-primary/10 text-primary',
                    )}
                  >
                    {g.value}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{g.label}</span>
                    <span
                      className={cn(
                        'block text-xs',
                        goal === g.value
                          ? 'text-primary-foreground/80'
                          : 'text-muted-foreground',
                      )}
                    >
                      {g.hint}
                    </span>
                  </span>
                  {goal === g.value ? (
                    <Check className="size-4.5 shrink-0" strokeWidth={3} />
                  ) : null}
                </button>
              ))}
            </div>

            <form action={saveOnboarding} className="flex justify-between">
              <Button type="button" variant="ghost" onClick={() => setStep(2)}>
                Retour
              </Button>
              <input type="hidden" name="grade_level" value={grade ?? ''} />
              <input type="hidden" name="daily_goal" value={goal} />
              {[...picked].map((slug) => (
                <input key={slug} type="hidden" name="subjects" value={slug} />
              ))}
              <SubmitButton />
            </form>
          </CardContent>
        </>
      )}
    </Card>
  )
}

// Bouton de soumission : se désactive pendant l'enregistrement pour éviter
// toute double-soumission (double-tap sur mobile).
function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Un instant…' : "C'est parti !"}
    </Button>
  )
}
