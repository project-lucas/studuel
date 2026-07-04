'use client'

import { useState } from 'react'
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
import { subjectTheme } from '@/lib/subject-style'
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
      {step === 1 ? (
        <>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="size-4 text-primary" />
              En quelle classe es-tu ?
            </CardTitle>
            <CardDescription>
              Scolaria adapte tes cours, quiz et flashcards à ton programme.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-2">
              {GRADE_LEVELS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => chooseGrade(g)}
                  className={cn(
                    'rounded-2xl border px-3 py-2.5 text-left transition-all active:scale-[0.98]',
                    grade === g
                      ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                      : 'hover:border-primary/40 hover:bg-accent hover:text-accent-foreground',
                  )}
                >
                  <span className="font-heading text-base font-semibold">{g}</span>
                  {GRADE_HINTS[g] ? (
                    <span
                      className={cn(
                        'block text-xs',
                        grade === g
                          ? 'text-primary-foreground/80'
                          : 'text-muted-foreground',
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
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="size-4 text-primary" />
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
                const theme = subjectTheme(s.color)
                return (
                  <button
                    key={s.slug}
                    type="button"
                    onClick={() => toggleSubject(s.slug)}
                    className={cn(
                      'relative flex items-center gap-2 rounded-2xl p-3 text-left shadow-sm transition-all active:scale-[0.97]',
                      theme.tile,
                      !checked && 'opacity-40 grayscale',
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-2 right-2 flex size-4.5 items-center justify-center rounded-full border text-[10px]',
                        checked
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-muted-foreground/40 bg-card',
                      )}
                    >
                      {checked ? <Check className="size-3" /> : null}
                    </span>
                    <span className="text-2xl leading-none">{s.icon}</span>
                    <span className="pr-4 text-xs font-bold">{s.name}</span>
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
            <CardTitle className="flex items-center gap-2">
              <Target className="size-4 text-primary" />
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
                  onClick={() => setGoal(g.value)}
                  className={cn(
                    'flex items-baseline justify-between rounded-2xl border px-4 py-3 text-left transition-all active:scale-[0.99]',
                    goal === g.value
                      ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                      : 'hover:border-primary/40 hover:bg-accent hover:text-accent-foreground',
                  )}
                >
                  <span className="text-sm font-semibold">{g.label}</span>
                  <span
                    className={cn(
                      'text-xs',
                      goal === g.value
                        ? 'text-primary-foreground/80'
                        : 'text-muted-foreground',
                    )}
                  >
                    {g.hint}
                  </span>
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
              <Button type="submit">C&apos;est parti !</Button>
            </form>
          </CardContent>
        </>
      )}
    </Card>
  )
}
