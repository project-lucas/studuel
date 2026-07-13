'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  GOAL_HEADLINE,
  GRADE_LABELS,
  type OnboardingAnswers,
} from '@/lib/welcome'
import type { PlacementQuestion } from '@/lib/placement'
import OnbButton from './OnbButton'
import {
  IllustrationCircle,
  ProgressHeader,
  StepHead,
  usePressFx,
} from './OnbBits'

// ---------------------------------------------------------------------------
// Écran 9 — Placement (intro)
// ---------------------------------------------------------------------------
export function PlacementIntroStep({
  loading,
  onStart,
  onSkip,
}: {
  loading?: boolean
  onStart: () => void
  onSkip: () => void
}) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <IllustrationCircle size={130}>
          <svg viewBox="0 0 24 24" width="66" height="66" fill="none" stroke="var(--onb-pp)" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="5" />
            <circle cx="12" cy="12" r="1.4" fill="var(--onb-pp)" />
          </svg>
        </IllustrationCircle>
        <div className="mt-4">
          <StepHead
            center
            title="On évalue ton niveau ?"
            subtitle="5 questions rapides pour caler ton plan pile au bon niveau. Aucune mauvaise réponse, promis."
          />
        </div>
      </div>
      <div className="mt-auto flex flex-col gap-2.5 pt-4">
        <OnbButton variant="yellow" disabled={loading} onClick={onStart}>
          {loading ? 'Préparation…' : 'Commencer le test'}
        </OnbButton>
        <OnbButton variant="ghost" disabled={loading} onClick={onSkip}>
          Je débute, passer
        </OnbButton>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Écran 10 — Mini-quiz de placement (réel, corrigé, avec vies)
// ---------------------------------------------------------------------------
export function PlacementQuizStep({
  progress,
  questions,
  onBack,
  onDone,
}: {
  progress: number
  questions: PlacementQuestion[]
  onBack: () => void
  onDone: (correct: number, total: number) => void
}) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [lives, setLives] = useState(3)
  const [correct, setCorrect] = useState(0)

  const q = questions[index]
  if (!q) {
    // Sécurité : aucune question → on sort proprement.
    onDone(correct, 0)
    return null
  }
  const isRight = selected === q.correctIndex

  function check() {
    if (selected === null) return
    setChecked(true)
    if (isRight) setCorrect((c) => c + 1)
    else setLives((l) => l - 1)
  }

  function advance() {
    const answered = index + 1
    const livesLeft = isRight ? lives : lives - 1
    const isLast = index >= questions.length - 1
    if (isLast || livesLeft <= 0) {
      onDone(correct, answered)
      return
    }
    setIndex((i) => i + 1)
    setSelected(null)
    setChecked(false)
  }

  return (
    <div className="flex flex-1 flex-col">
      <ProgressHeader progress={progress} onBack={onBack} lives={lives} />
      <div className="flex flex-1 flex-col px-[22px] pt-2">
        <p
          className="mt-1.5 mb-2.5 text-[12px] font-extrabold tracking-[0.1em] uppercase"
          style={{ color: 'var(--onb-mut)' }}
        >
          {q.subject ? `${q.subject} · ` : ''}Question {index + 1}/{questions.length}
        </p>
        <div
          className="mb-4 rounded-[18px] border-2 bg-white p-[18px] text-center text-[20px] leading-[1.3] font-extrabold"
          style={{ borderColor: 'var(--onb-line)' }}
        >
          {q.question}
        </div>
        <div className="mt-auto flex flex-col gap-[11px] pt-6">
          {q.options.map((opt, i) => (
            <QuizOption
              key={i}
              index={i}
              option={opt}
              isSelected={selected === i}
              checked={checked}
              correctIndex={q.correctIndex}
              onSelect={() => setSelected(i)}
            />
          ))}
        </div>
      </div>
      <div className="px-[22px] pt-3 pb-[22px]">
        {checked ? (
          <OnbButton variant={isRight ? 'primary' : 'yellow'} onClick={advance}>
            {isRight ? 'Continuer' : 'On continue'}
          </OnbButton>
        ) : (
          <OnbButton disabled={selected === null} onClick={check}>
            Vérifier
          </OnbButton>
        )}
      </div>
    </div>
  )
}

function answerBorder(
  checked: boolean,
  i: number,
  correctIndex: number,
  isSelected: boolean,
): string {
  if (!checked) return isSelected ? 'var(--onb-pp)' : 'var(--onb-line)'
  if (i === correctIndex) return '#2AA36B'
  if (isSelected) return 'var(--onb-co)'
  return 'var(--onb-line)'
}

function answerBg(
  checked: boolean,
  i: number,
  correctIndex: number,
  isSelected: boolean,
): string {
  if (!checked) return isSelected ? 'var(--onb-pps)' : '#fff'
  if (i === correctIndex) return 'rgba(42,163,107,0.12)'
  if (isSelected) return 'rgba(241,86,108,0.12)'
  return '#fff'
}

// Une réponse du mini-quiz : socle 3D, rebond + son au clic (avant vérification).
function QuizOption({
  index,
  option,
  isSelected,
  checked,
  correctIndex,
  onSelect,
}: {
  index: number
  option: string
  isSelected: boolean
  checked: boolean
  correctIndex: number
  onSelect: () => void
}) {
  const { pop, onPress, onAnimationEnd } = usePressFx()
  const border = answerBorder(checked, index, correctIndex, isSelected)
  const bg = answerBg(checked, index, correctIndex, isSelected)
  return (
    <button
      type="button"
      disabled={checked}
      onClick={() => {
        onPress()
        onSelect()
      }}
      onAnimationEnd={onAnimationEnd}
      className={cn(
        'onb-card flex items-center gap-3 p-[15px] text-left text-[15px] font-extrabold',
        pop && 'onb-pop',
      )}
      style={{ borderColor: border, background: bg }}
    >
      <span
        className="flex shrink-0 items-center justify-center rounded-lg border-2 text-[13px] font-extrabold"
        style={{
          width: 26,
          height: 26,
          borderColor: isSelected ? 'var(--onb-pp)' : 'var(--onb-line)',
          color: isSelected ? 'var(--onb-pp)' : 'var(--onb-mut)',
        }}
      >
        {index + 1}
      </span>
      <span className="min-w-0 flex-1">{option}</span>
    </button>
  )
}

// ---------------------------------------------------------------------------
// Écran 11 — Défie tes amis (invitation par partage natif)
// ---------------------------------------------------------------------------
function Avatar({ bg, stroke }: { bg: string; stroke: string }) {
  return (
    <span
      className="flex items-center justify-center rounded-full"
      style={{ width: 78, height: 78, background: bg }}
    >
      <svg viewBox="0 0 24 24" width="34" height="34" fill={stroke}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20a8 8 0 0 1 16 0z" />
      </svg>
    </span>
  )
}

export function FriendsStep({
  onInvited,
  onSkip,
}: {
  onInvited: () => void
  onSkip: () => void
}) {
  async function invite() {
    const url = typeof window !== 'undefined' ? window.location.origin : ''
    const shareData = {
      title: 'Studuel',
      text: 'Rejoins-moi sur Studuel : on révise en se défiant en duel 1v1 💪',
      url,
    }
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share(shareData)
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(`${shareData.text} ${url}`)
      }
    } catch {
      // Partage annulé par l'utilisateur : on n'interrompt pas le parcours.
    }
    onInvited()
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="mb-2 flex items-center gap-2.5">
          <Avatar bg="var(--onb-pps)" stroke="var(--onb-pp)" />
          <span className="onb-word text-[22px]" style={{ color: 'var(--onb-co)' }}>
            VS
          </span>
          <Avatar bg="#FDECC7" stroke="var(--onb-yld)" />
        </div>
        <StepHead
          center
          title="Réviser, c'est mieux en duel"
          subtitle="Défie tes amis ou des inconnus en 1v1. Le premier à tout juste remporte la manche… et les XP."
        />
      </div>
      <div className="mt-auto flex flex-col gap-2.5 pt-4">
        <OnbButton onClick={invite}>Inviter mes amis</OnbButton>
        <OnbButton variant="ghost" onClick={onSkip}>
          Plus tard
        </OnbButton>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Écran 12 — Notifications (permission OS réelle)
// ---------------------------------------------------------------------------
export function NotificationsStep({
  onDecided,
}: {
  onDecided: (enabled: boolean) => void
}) {
  const [busy, setBusy] = useState(false)

  async function enable() {
    setBusy(true)
    let granted = false
    try {
      if (typeof Notification !== 'undefined') {
        const permission = await Notification.requestPermission()
        granted = permission === 'granted'
      }
    } catch {
      granted = false
    }
    setBusy(false)
    onDecided(granted)
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <IllustrationCircle size={130} bg="#FDECC7">
          <svg viewBox="0 0 24 24" width="60" height="60" fill="none" stroke="var(--onb-yld)" strokeWidth="2">
            <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z" />
            <path d="M10 20a2 2 0 0 0 4 0" />
          </svg>
        </IllustrationCircle>
        <div className="mt-4">
          <StepHead
            center
            title="On te rappelle de réviser ?"
            subtitle="Un petit rappel par jour et ta série ne s'éteint jamais. Tu choisis l'heure."
          />
        </div>
      </div>
      <div className="mt-auto flex flex-col gap-2.5 pt-4">
        <OnbButton disabled={busy} onClick={enable}>
          {busy ? 'Un instant…' : 'Activer les rappels'}
        </OnbButton>
        <OnbButton variant="ghost" onClick={() => onDecided(false)}>
          Non merci
        </OnbButton>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Écran 14 — Plan personnalisé (récap final)
// ---------------------------------------------------------------------------
function SummaryRow({
  color,
  icon,
  label,
  value,
}: {
  color: string
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div
      className="flex items-center gap-3 rounded-2xl border-2 bg-white p-[12px_14px]"
      style={{ borderColor: 'var(--onb-line)' }}
    >
      <span
        className="flex shrink-0 items-center justify-center rounded-xl text-white"
        style={{ width: 38, height: 38, background: color }}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span
          className="block text-[12px] font-bold"
          style={{ color: 'var(--onb-mut)' }}
        >
          {label}
        </span>
        <span className="block text-[15px] font-extrabold">{value}</span>
      </span>
    </div>
  )
}

export function PlanStep({
  answers,
  subjectCount,
  onFinish,
  finishing,
}: {
  answers: OnboardingAnswers
  subjectCount: number
  onFinish: () => void
  finishing: boolean
}) {
  const headline = answers.goal
    ? GOAL_HEADLINE[answers.goal]
    : 'Ton plan est prêt 🚀'
  const gradeLabel = answers.grade
    ? (GRADE_LABELS[answers.grade] ?? answers.grade)
    : '—'

  return (
    <div className="flex flex-1 flex-col pt-3">
      <div className="flex-1">
        <span
          className="inline-block rounded-[20px] px-[9px] py-[3px] text-[11px] font-extrabold tracking-[0.1em] uppercase"
          style={{ color: 'var(--onb-pp)', background: 'var(--onb-pps)' }}
        >
          Ton plan est prêt
        </span>
        <div className="mt-2">
          <StepHead
            title={headline}
            subtitle="Voilà ce qu'on a préparé pour toi, Studuel s'occupe du reste."
          />
        </div>
        <div className="mt-4 flex flex-col gap-[11px]">
          <SummaryRow
            color="var(--onb-pp)"
            label="Classe"
            value={`${gradeLabel} · ${subjectCount} matière${subjectCount > 1 ? 's' : ''}`}
            icon={
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" strokeWidth="2.2">
                <path d="M4 5h16v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
                <path d="M4 9h16M8 3v4M16 3v4" />
              </svg>
            }
          />
          <SummaryRow
            color="var(--onb-yl)"
            label="Objectif quotidien"
            value={`${answers.dailyGoalMinutes} min / jour`}
            icon={
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#5a3d00" strokeWidth="2.2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
            }
          />
          <SummaryRow
            color="var(--onb-co)"
            label="Défis"
            value={answers.friendsInvited ? 'Amis invités · duels 1v1' : 'Duels 1v1 activés'}
            icon={
              <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff">
                <path d="M13 2L4 14h6l-1 8 9-12h-6z" />
              </svg>
            }
          />
        </div>
      </div>
      <div className="mt-auto pt-4">
        <OnbButton variant="yellow" disabled={finishing} onClick={onFinish}>
          {finishing ? 'Un instant…' : 'Commencer à réviser'}
        </OnbButton>
      </div>
    </div>
  )
}
