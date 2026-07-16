'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { GRADE_LEVELS, type Subject } from '@/lib/types'
import {
  DAILY_GOALS,
  GOALS,
  GRADE_LABELS,
  SOURCES,
  subjectsForGrade,
  type DailyGoalMinutes,
  type Goal,
  type OnboardingAnswers,
  type ProfileType,
  type Source,
} from '@/lib/welcome'
import { schoolLevelForGrade, SCHOOL_LEVEL_LABEL } from '@/lib/clan'
import PencilLogo from './PencilLogo'
import { Bubble, OptionIcon, OptionRow, StepHead, usePressFx } from './OnbBits'

// ---------------------------------------------------------------------------
// Écran 2 — Parent ou élève
// ---------------------------------------------------------------------------
export function ProfilStep({
  answers,
  onPick,
}: {
  answers: OnboardingAnswers
  onPick: (value: ProfileType) => void
}) {
  return (
    <div className="flex flex-1 flex-col pt-3">
      <StepHead
        title="Qui utilise Studuel ?"
        subtitle="On adapte l'expérience selon ton profil."
      />
      <div className="flex flex-col gap-[11px] pt-6">
        <OptionRow
          selected={answers.profileType === 'eleve'}
          onClick={() => onPick('eleve')}
          icon={
            <OptionIcon color="var(--onb-pp)">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" strokeWidth="2.2">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20a8 8 0 0 1 16 0" />
              </svg>
            </OptionIcon>
          }
          label="Je suis élève"
          description="Je révise et je défie mes amis en duel"
        />
        <OptionRow
          selected={answers.profileType === 'parent'}
          onClick={() => onPick('parent')}
          icon={
            <OptionIcon color="var(--onb-yl)">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#5a3d00" strokeWidth="2.2">
                <circle cx="8" cy="8" r="3.2" />
                <circle cx="16" cy="9" r="2.6" />
                <path d="M2 20a6 6 0 0 1 12 0M14 20a5 5 0 0 1 8-3.8" />
              </svg>
            </OptionIcon>
          }
          label="Je suis parent"
          description="Je crée un compte pour mon enfant"
        />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Écran 3 — Motivation (le crayon te parle)
// ---------------------------------------------------------------------------
export function MotivationStep() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <div className="mb-7 max-w-[280px]">
        <Bubble>Salut ! On va faire de toi la terreur des contrôles 💪</Bubble>
      </div>
      <PencilLogo size={130} className="float-slow" />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Écran 4 — Comment tu nous as connu ?
// ---------------------------------------------------------------------------
const SOURCE_ICONS: Record<Source, { color: string; icon: ReactNode }> = {
  tiktok: {
    color: '#111',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <path d="M16 3c.5 2.5 2 4 4.5 4.2v3C18.8 10 17.3 9.4 16 8.4V15a6 6 0 1 1-6-6c.3 0 .7 0 1 .1v3.2A3 3 0 1 0 13 15V3h3z" />
      </svg>
    ),
  },
  instagram: {
    color: '#E1306C',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
      </svg>
    ),
  },
  youtube: {
    color: '#FF0000',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <path d="M22 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.8-1.8C18.3 5 12 5 12 5s-6.3 0-7.8.5A2.5 2.5 0 0 0 2.4 7.3C2 8.8 2 12 2 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.8 1.8C5.7 19 12 19 12 19s6.3 0 7.8-.5a2.5 2.5 0 0 0 1.8-1.8C22 15.2 22 12 22 12zM10 15V9l5 3-5 3z" />
      </svg>
    ),
  },
  ami: {
    color: 'var(--onb-yl)',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2">
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.3" />
        <path d="M3 19a6 6 0 0 1 12 0M15.5 19a5 5 0 0 1 5.5-4.7" />
      </svg>
    ),
  },
  app_store: {
    color: 'var(--onb-pp)',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2">
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" />
      </svg>
    ),
  },
  autre: {
    color: 'var(--onb-mut)',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <circle cx="5" cy="12" r="2" />
        <circle cx="12" cy="12" r="2" />
        <circle cx="19" cy="12" r="2" />
      </svg>
    ),
  },
}

export function SourceStep({
  answers,
  onPick,
}: {
  answers: OnboardingAnswers
  onPick: (value: Source) => void
}) {
  return (
    <div className="flex flex-1 flex-col">
      <StepHead title="Comment tu as connu Studuel ?" />
      <div className="flex flex-col gap-[11px] pt-6">
        {SOURCES.map((s) => {
          const meta = SOURCE_ICONS[s.value]
          return (
            <OptionRow
              key={s.value}
              selected={answers.source === s.value}
              onClick={() => onPick(s.value)}
              icon={<OptionIcon color={meta.color}>{meta.icon}</OptionIcon>}
              label={s.label}
            />
          )
        })}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Écran 5 — Objectif n°1
// ---------------------------------------------------------------------------
const GOAL_ICONS: Record<Goal, { color: string; icon: ReactNode }> = {
  controles: {
    color: 'var(--onb-co)',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  moyenne: {
    color: 'var(--onb-pp)',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M4 19V9m5 10V5m5 14v-7m5 7V8" />
      </svg>
    ),
  },
  examen: {
    color: 'var(--onb-yl)',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M12 3l2.5 5.3 5.8.8-4.2 4 1 5.7L12 16l-5.1 2.6 1-5.7L3.7 9l5.8-.8z" />
      </svg>
    ),
  },
  avance: {
    color: '#2AA36B',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M4 18l6-6 4 4 6-8" />
      </svg>
    ),
  },
  defi: {
    color: 'var(--onb-ink)',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M13 3L5 14h5l-1 7 8-11h-5z" />
      </svg>
    ),
  },
}

export function GoalStep({
  answers,
  onPick,
}: {
  answers: OnboardingAnswers
  onPick: (value: Goal) => void
}) {
  return (
    <div className="flex flex-1 flex-col">
      <StepHead title="Ton objectif n°1 ?" subtitle="On adapte ton plan en fonction." />
      <div className="flex flex-col gap-[11px] pt-6">
        {GOALS.map((g) => {
          const meta = GOAL_ICONS[g.value]
          return (
            <OptionRow
              key={g.value}
              selected={answers.goal === g.value}
              onClick={() => onPick(g.value)}
              icon={<OptionIcon color={meta.color}>{meta.icon}</OptionIcon>}
              label={g.label}
            />
          )
        })}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Écran 6 — Ta classe
// ---------------------------------------------------------------------------
function GradeCell({
  label,
  selected,
  onPick,
}: {
  label: string
  selected: boolean
  onPick: () => void
}) {
  const { pop, onPress, onAnimationEnd } = usePressFx()
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => {
        onPress()
        onPick()
      }}
      onAnimationEnd={onAnimationEnd}
      className={cn(
        'onb-card flex items-center justify-center px-3 py-[15px] text-[15px] font-extrabold',
        selected && 'onb-card-on',
        pop && 'onb-pop',
      )}
    >
      {label}
    </button>
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
    <div className="flex flex-1 flex-col">
      <StepHead
        title="Tu es en quelle classe ?"
        subtitle="Pour te proposer le bon programme."
      />
      <div className="grid grid-cols-2 gap-[11px] pt-6">
        {GRADE_LEVELS.map((g) => (
          <GradeCell
            key={g}
            label={GRADE_LABELS[g] ?? g}
            selected={answers.grade === g}
            onPick={() => onPick(g)}
          />
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Écran 6bis — Ton établissement = ton clan
// ---------------------------------------------------------------------------
export function SchoolStep({
  answers,
  onChange,
}: {
  answers: OnboardingAnswers
  onChange: (name: string | null, city: string | null) => void
}) {
  const level = schoolLevelForGrade(answers.grade)
  const word = SCHOOL_LEVEL_LABEL[level].toLowerCase()
  return (
    <div className="flex flex-1 flex-col">
      <StepHead
        title={`Ton ${word}, c’est ton clan`}
        subtitle="Tu grimperas au classement avec les élèves de ton établissement. Tu pourras le changer plus tard."
      />
      <div className="flex flex-col gap-3 pt-6">
        <input
          value={answers.schoolName ?? ''}
          onChange={(e) => onChange(e.target.value || null, answers.schoolCity)}
          placeholder={`Nom de ton ${word}`}
          aria-label={`Nom de ton ${word}`}
          maxLength={120}
          className="w-full rounded-2xl border-2 bg-white px-4 py-3 text-[15px] font-semibold outline-none"
          style={{ borderColor: 'var(--onb-line)' }}
        />
        <input
          value={answers.schoolCity ?? ''}
          onChange={(e) => onChange(answers.schoolName, e.target.value || null)}
          placeholder="Ville (facultatif)"
          aria-label="Ville de ton établissement"
          maxLength={80}
          className="w-full rounded-2xl border-2 bg-white px-4 py-3 text-[15px] font-semibold outline-none"
          style={{ borderColor: 'var(--onb-line)' }}
        />
        <p className="px-1 text-[13px] font-semibold" style={{ color: 'var(--onb-mut)' }}>
          Pas envie maintenant ? Passe cette étape, tu choisiras ton clan depuis
          le Défi.
        </p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Écran 7 — Matières (choix multiple)
// ---------------------------------------------------------------------------
function SubjectChip({
  name,
  selected,
  onToggle,
}: {
  name: string
  selected: boolean
  onToggle: () => void
}) {
  const { pop, onPress, onAnimationEnd } = usePressFx()
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      onClick={() => {
        onPress()
        onToggle()
      }}
      onAnimationEnd={onAnimationEnd}
      className={cn(
        'rounded-[18px] border-2 px-[16px] py-[11px] text-[14.5px] font-extrabold transition-colors active:translate-y-[2px]',
        pop && 'onb-pop',
      )}
      style={{
        borderColor: selected ? 'var(--onb-pp)' : 'var(--onb-line)',
        background: selected ? 'var(--onb-pp)' : '#fff',
        color: selected ? '#fff' : 'var(--onb-ink)',
        boxShadow: selected
          ? '0 3px 0 var(--onb-ppd)'
          : '0 3px 0 var(--onb-line-d)',
      }}
    >
      {name}
    </button>
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
    <div className="flex flex-1 flex-col">
      <StepHead
        title="Quelles matières bosser ?"
        subtitle="Choisis-en autant que tu veux."
      />
      <div className="flex flex-wrap content-start gap-[10px] pt-6">
        {ofLevel.map((s) => (
          <SubjectChip
            key={s.slug}
            name={s.name}
            selected={answers.subjects.includes(s.slug)}
            onToggle={() => onToggle(s.slug)}
          />
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Écran 8 — Objectif quotidien (minutes)
// ---------------------------------------------------------------------------
export function DailyGoalStep({
  answers,
  onPick,
}: {
  answers: OnboardingAnswers
  onPick: (minutes: DailyGoalMinutes) => void
}) {
  return (
    <div className="flex flex-1 flex-col">
      <StepHead
        title="Ton objectif quotidien ?"
        subtitle="Tu pourras le changer plus tard."
      />
      <div className="flex flex-col gap-[11px] pt-6">
        {DAILY_GOALS.map((g) => {
          const selected = answers.dailyGoalMinutes === g.minutes
          return (
            <OptionRow
              key={g.minutes}
              selected={selected}
              onClick={() => onPick(g.minutes)}
              label={g.label}
              trailing={
                <div className="flex items-center gap-3">
                  <span
                    className="text-[13px] font-bold"
                    style={{
                      color: selected ? 'var(--onb-pp)' : 'var(--onb-mut)',
                    }}
                  >
                    {g.hint}
                  </span>
                  <span
                    className="shrink-0 rounded-full border-2"
                    style={{
                      width: 26,
                      height: 26,
                      borderColor: selected ? 'var(--onb-pp)' : 'var(--onb-line)',
                      background: selected ? 'var(--onb-pp)' : '#fff',
                      boxShadow: selected ? 'inset 0 0 0 4px #fff' : undefined,
                    }}
                  />
                </div>
              }
            />
          )
        })}
      </div>
    </div>
  )
}
