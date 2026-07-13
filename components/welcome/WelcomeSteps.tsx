'use client'

import Image from 'next/image'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { subjectIcon } from '@/lib/subject-style'
import { GRADE_LEVELS, type Subject } from '@/lib/types'
import {
  GOALS,
  GRADE_HINTS,
  MOTIVATIONS,
  SOURCES,
  subjectsForGrade,
  type OnboardingAnswers,
} from '@/lib/welcome'

// La flamme, compagnon du parcours : elle accueille, encourage, félicite.
// Une bulle de dialogue lui donne une voix (le ressort « façon Duolingo »).
export function MascotBubble({
  image,
  size = 104,
  children,
  className,
}: {
  image: string
  size?: number
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <Image
        src={image}
        alt=""
        aria-hidden="true"
        width={size}
        height={size}
        priority
        className="float-slow drop-shadow-sm"
      />
      <div className="relative max-w-xs rounded-2xl rounded-tl-sm border bg-card px-4 py-3 text-center text-sm font-medium text-foreground shadow-sm">
        {children}
      </div>
    </div>
  )
}

// Grand bouton d'option, cœur de chaque écran-question (choix unique).
function OptionButton({
  selected,
  emoji,
  label,
  onClick,
}: {
  selected: boolean
  emoji: string
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        'flex min-h-14 w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-all active:scale-[0.99]',
        selected
          ? 'border-primary bg-primary/[0.06] shadow-sm'
          : 'border-border bg-card hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md',
      )}
    >
      <span aria-hidden className="text-2xl leading-none">
        {emoji}
      </span>
      <span className="min-w-0 flex-1 text-sm font-semibold">{label}</span>
      <span
        className={cn(
          'flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
          selected
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-muted-foreground/30 bg-card',
        )}
      >
        {selected ? <Check className="size-3" strokeWidth={3.5} /> : null}
      </span>
    </button>
  )
}

function StepTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="font-heading text-xl leading-tight font-bold text-balance">
      {children}
    </h1>
  )
}

export function MotivationStep({
  answers,
  onPick,
}: {
  answers: OnboardingAnswers
  onPick: (value: OnboardingAnswers['motivation']) => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <StepTitle>Pourquoi tu veux réviser ?</StepTitle>
      <div className="flex flex-col gap-2.5">
        {MOTIVATIONS.map((m) => (
          <OptionButton
            key={m.value}
            selected={answers.motivation === m.value}
            emoji={m.emoji}
            label={m.label}
            onClick={() => onPick(m.value)}
          />
        ))}
      </div>
    </div>
  )
}

export function SourceStep({
  answers,
  onPick,
}: {
  answers: OnboardingAnswers
  onPick: (value: OnboardingAnswers['source']) => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <StepTitle>Comment tu as connu Studuel ?</StepTitle>
      <div className="flex flex-col gap-2.5">
        {SOURCES.map((s) => (
          <OptionButton
            key={s.value}
            selected={answers.source === s.value}
            emoji={s.emoji}
            label={s.label}
            onClick={() => onPick(s.value)}
          />
        ))}
      </div>
    </div>
  )
}

export function GradeStep({
  answers,
  onPick,
}: {
  answers: OnboardingAnswers
  onPick: (grade: string) => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <StepTitle>En quelle classe es-tu ?</StepTitle>
      <p className="text-sm text-muted-foreground">
        On adapte tes cours, quiz et flashcards à ton programme.
      </p>
      <div className="grid grid-cols-2 gap-2.5">
        {GRADE_LEVELS.map((g) => {
          const selected = answers.grade === g
          return (
            <button
              key={g}
              type="button"
              aria-pressed={selected}
              onClick={() => onPick(g)}
              className={cn(
                'relative flex min-h-16 flex-col justify-center rounded-2xl border-2 px-4 py-3 text-left transition-all active:scale-[0.98]',
                selected
                  ? 'border-primary bg-primary text-primary-foreground shadow-md shadow-primary/25'
                  : 'border-border bg-card hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md',
              )}
            >
              {selected ? (
                <span className="absolute top-2.5 right-2.5 flex size-5 items-center justify-center rounded-full bg-primary-foreground/20">
                  <Check className="size-3" strokeWidth={3.2} />
                </span>
              ) : null}
              <span className="font-heading text-xl leading-none font-bold">
                {g}
              </span>
              {GRADE_HINTS[g] ? (
                <span
                  className={cn(
                    'mt-1.5 inline-block w-fit rounded-full px-2 py-0.5 text-[10px] font-semibold',
                    selected
                      ? 'bg-primary-foreground/15 text-primary-foreground/90'
                      : 'bg-highlight/20 text-foreground/70',
                  )}
                >
                  {GRADE_HINTS[g]}
                </span>
              ) : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function SubjectsStep({
  subjects,
  answers,
  onToggle,
}: {
  subjects: Subject[]
  answers: OnboardingAnswers
  onToggle: (slug: string) => void
}) {
  const ofLevel = subjectsForGrade(subjects, answers.grade)
  return (
    <div className="flex flex-col gap-4">
      <StepTitle>Tes matières en {answers.grade}</StepTitle>
      <p className="text-sm text-muted-foreground">
        Décoche ce que tu ne suis pas (options, spécialités…). Modifiable plus
        tard.
      </p>
      <div className="grid grid-cols-2 gap-2">
        {ofLevel.map((s) => {
          const checked = answers.subjects.includes(s.slug)
          const Icon = subjectIcon(s.slug)
          return (
            <button
              key={s.slug}
              type="button"
              role="checkbox"
              aria-checked={checked}
              aria-label={s.name}
              onClick={() => onToggle(s.slug)}
              className={cn(
                'relative flex items-center gap-2.5 rounded-2xl border-2 p-2.5 text-left transition-all active:scale-[0.97]',
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
    </div>
  )
}

export function GoalStep({
  answers,
  onPick,
}: {
  answers: OnboardingAnswers
  onPick: (goal: number) => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <StepTitle>Ton objectif quotidien ?</StepTitle>
      <p className="text-sm text-muted-foreground">
        Chaque jour tenu remplit ta série 🔥 — tu pourras le changer plus tard.
      </p>
      <div className="flex flex-col gap-2.5">
        {GOALS.map((g) => {
          const selected = answers.goal === g.value
          return (
            <button
              key={g.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onPick(g.value)}
              className={cn(
                'flex items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-all active:scale-[0.99]',
                selected
                  ? 'border-primary bg-primary text-primary-foreground shadow-md shadow-primary/25'
                  : 'border-border bg-card hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md',
              )}
            >
              <span
                className={cn(
                  'flex size-9 shrink-0 items-center justify-center rounded-xl font-heading text-base font-bold tabular-nums transition-colors',
                  selected
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
                    selected
                      ? 'text-primary-foreground/80'
                      : 'text-muted-foreground',
                  )}
                >
                  {g.hint}
                </span>
              </span>
              {selected ? (
                <Check className="size-4.5 shrink-0" strokeWidth={3} />
              ) : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}
