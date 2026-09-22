'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import {
  GOAL_HEADLINE,
  GRADE_LABELS,
  PLACEMENT_LEVEL_LABEL,
  placementFeedback,
  premiereMission,
  type OnboardingAnswers,
} from '@/lib/welcome'
import type { PlacementQuestion } from '@/lib/placement'
import { portraitSrc } from '@/lib/portraits'
import { souscrirePush } from '@/lib/push-client'
import ConfettiRain from '@/components/ConfettiRain'
import OnbButton from './OnbButton'
import {
  IllustrationCircle,
  ProgressHeader,
  StepHead,
  usePressFx,
} from './OnbBits'
import { playPop } from './onbSound'

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

// Ce qu'on dit après la vérification. Une bonne réponse est saluée, une
// mauvaise est DÉDRAMATISÉE et corrigée : l'écran d'intro a promis « aucune
// mauvaise réponse », la correction doit le tenir — on montre la bonne réponse
// sans jamais compter la faute contre l'élève.
const FEEDBACK_OK = ['Bien joué !', 'Exact !', 'Et de une !', 'Tu gères !']
const FEEDBACK_KO = ['Pas grave, on continue.', 'C’était piégeux.', 'Tu la connaîtras au prochain quiz.']

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
  // Sécurité : aucune question (liste vide) → on sort proprement. L'appel à
  // onDone (qui met à jour l'état du PARENT) doit passer par un effet, jamais
  // depuis le corps du rendu (mise à jour d'un autre composant pendant le rendu).
  useEffect(() => {
    if (!q) onDone(correct, 0)
  }, [q, correct, onDone])
  if (!q) return null
  const isRight = selected === q.correctIndex

  function check() {
    if (selected === null) return
    setChecked(true)
    if (isRight) {
      setCorrect((c) => c + 1)
      playPop(1.25)
    } else {
      setLives((l) => l - 1)
      playPop(0.8)
    }
  }

  function advance() {
    const answered = index + 1
    // `check()` a déjà décrémenté `lives` (state à jour ici) : ne pas le
    // re-décompter, sinon le test s'arrête une mauvaise réponse trop tôt.
    const isLast = index >= questions.length - 1
    if (isLast || lives <= 0) {
      onDone(correct, answered)
      return
    }
    setIndex((i) => i + 1)
    setSelected(null)
    setChecked(false)
  }

  const feedback = checked
    ? isRight
      ? FEEDBACK_OK[index % FEEDBACK_OK.length]
      : FEEDBACK_KO[index % FEEDBACK_KO.length]
    : null

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
        {/* Le verdict, au-dessus du bouton : lu au lecteur d'écran, et posé
            là où l'œil arrive après avoir tapé. */}
        <p
          aria-live="polite"
          className="mb-2 min-h-[20px] text-center text-[14px] font-extrabold"
          style={{ color: isRight ? '#2AA36B' : 'var(--onb-mut)' }}
        >
          {feedback}
        </p>
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
// Écran 10ter — Le résultat du placement (ajouté le 22/09/2026)
//
// Le quiz est la démonstration ; l'écran d'après en est la RÉCOMPENSE. Avant,
// la dernière réponse validée ouvrait directement la grille des blasons : le
// score n'était jamais dit, le niveau jamais nommé, et l'élève ne savait pas
// ce que ces cinq questions avaient changé. Ici : le score en grand, le niveau
// en pastille, une phrase qui relie le score au plan — et des confettis quand
// c'est mérité. Le crayon ne juge pas : un 1/5 s'appelle « On part des bases ».
// ---------------------------------------------------------------------------
export function PlacementResultStep({
  answers,
  onContinue,
}: {
  answers: OnboardingAnswers
  onContinue: () => void
}) {
  const fb = placementFeedback(answers.placement)
  // Sans résultat (quiz sauté, écran atteint par un brouillon incohérent), on
  // n'affiche rien de vide : on passe.
  useEffect(() => {
    if (!fb) onContinue()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fb === null])
  if (!fb) return null

  return (
    <div className="relative flex flex-1 flex-col">
      {fb.celebration ? <ConfettiRain /> : null}
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <p
          className="text-[12px] font-extrabold tracking-[0.12em] uppercase"
          style={{ color: 'var(--onb-mut)' }}
        >
          Ton placement
        </p>
        <p
          className="onb-word mt-2 text-[64px] leading-none tabular-nums"
          style={{ color: 'var(--onb-pp)' }}
          aria-label={`Score ${fb.score}`}
        >
          {fb.score}
        </p>
        <span
          className="mt-4 inline-block rounded-full px-[14px] py-[6px] text-[13px] font-extrabold tracking-[0.06em] uppercase"
          style={{
            background: fb.level === 'avance' ? 'var(--onb-yl)' : 'var(--onb-pps)',
            color: fb.level === 'avance' ? '#5a3d00' : 'var(--onb-pp)',
          }}
        >
          Niveau {fb.levelLabel}
        </span>
        <div className="mt-5 max-w-[300px]">
          <StepHead center title={fb.titre} subtitle={fb.phrase} />
        </div>
      </div>
      <div className="mt-auto pt-4">
        <OnbButton variant={fb.celebration ? 'yellow' : 'primary'} onClick={onContinue}>
          Continuer
        </OnbButton>
      </div>
    </div>
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
// Écran 12 — Notifications (abonnement push RÉEL, cf. lib/push-client)
//
// L'écran demandait la permission de l'OS et rien d'autre : `notify_opt_in`
// passait à vrai, et aucun rappel ne pouvait partir (pas de worker, pas
// d'abonnement). Il passe désormais par le même chemin que la carte
// « Rappels » du compte. Un refus ou une panne ne bloque jamais : on note la
// réponse et on avance — le compte permet de réessayer.
// ---------------------------------------------------------------------------
export function NotificationsStep({
  onDecided,
}: {
  onDecided: (enabled: boolean) => void
}) {
  const [busy, setBusy] = useState(false)

  async function enable() {
    setBusy(true)
    const resultat = await souscrirePush()
    setBusy(false)
    onDecided(resultat === 'on')
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
            subtitle="Un rappel le matin quand des cartes t’attendent, un coup de pouce le soir pour garder ta série. Rien d’autre."
          />
        </div>
      </div>
      <div className="mt-auto flex flex-col gap-2.5 pt-4">
        <OnbButton disabled={busy} onClick={enable}>
          {busy ? 'Un instant…' : 'Activer les rappels'}
        </OnbButton>
        <OnbButton variant="ghost" disabled={busy} onClick={() => onDecided(false)}>
          Non merci
        </OnbButton>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Écran 14 — Plan personnalisé (récap final)
//
// UNE CARTE DE JOUEUR, PAS UN RÉCAPITULATIF. L'écran alignait trois lignes
// (classe, objectif quotidien, « duels 1v1 activés ») sous un titre : le
// même écran pour tout le monde, à trois mots près. Il montre désormais ce
// que l'élève vient de construire — son blason, sa classe, son niveau de
// placement, son clan — et lui donne UNE première mission, celle qui
// découle de son objectif, là où le bouton l'emmène (cf. premiereMission).
// ---------------------------------------------------------------------------
function PlanLine({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <li className="flex items-baseline justify-between gap-3 py-[9px]">
      <span className="text-[13px] font-bold" style={{ color: 'var(--onb-mut)' }}>
        {label}
      </span>
      <span
        className="text-right text-[14.5px] font-extrabold"
        style={{ color: accent ? 'var(--onb-pp)' : 'var(--onb-ink)' }}
      >
        {value}
      </span>
    </li>
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
  const mission = premiereMission(answers)
  const placement = answers.placement?.total
    ? PLACEMENT_LEVEL_LABEL[answers.placement.level]
    : null
  const clan = answers.schoolName
    ? answers.schoolCity
      ? `${answers.schoolName} · ${answers.schoolCity}`
      : answers.schoolName
    : null

  return (
    <div className="relative flex flex-1 flex-col pt-3">
      <ConfettiRain />
      <div className="relative flex-1">
        <span
          className="inline-block rounded-[20px] px-[9px] py-[3px] text-[11px] font-extrabold tracking-[0.1em] uppercase"
          style={{ color: 'var(--onb-pp)', background: 'var(--onb-pps)' }}
        >
          Ton plan est prêt
        </span>
        <div className="mt-2">
          <StepHead title={headline} />
        </div>

        {/* La carte : le blason en médaillon, la classe, et les lignes du plan. */}
        <div
          className="mt-4 overflow-hidden rounded-[22px] border-2 bg-white"
          style={{ borderColor: 'var(--onb-line)', boxShadow: '0 4px 0 var(--onb-line-d)' }}
        >
          <div
            className="flex items-center gap-4 px-4 py-3.5"
            style={{ background: 'var(--onb-pps)' }}
          >
            {answers.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={portraitSrc(answers.avatar)}
                alt=""
                width={384}
                height={384}
                className="size-[68px] shrink-0 object-contain drop-shadow-[0_6px_10px_rgba(60,30,120,0.25)]"
              />
            ) : (
              <span
                aria-hidden="true"
                className="flex size-[68px] shrink-0 items-center justify-center rounded-2xl bg-white text-[28px] font-extrabold"
                style={{ color: 'var(--onb-pp)' }}
              >
                {gradeLabel.slice(0, 2)}
              </span>
            )}
            <div className="min-w-0">
              <p className="text-[12px] font-extrabold tracking-[0.1em] uppercase" style={{ color: 'var(--onb-pp)' }}>
                Joueur · {gradeLabel}
              </p>
              <p className="mt-0.5 text-[15px] leading-tight font-extrabold">
                {subjectCount} matière{subjectCount > 1 ? 's' : ''} au programme
              </p>
              {placement ? (
                <p className="mt-0.5 text-[13px] font-bold" style={{ color: 'var(--onb-mut)' }}>
                  Niveau de départ : {placement}
                </p>
              ) : null}
            </div>
          </div>
          <ul className="divide-y px-4" style={{ borderColor: 'var(--onb-line)' }}>
            <PlanLine label="Objectif quotidien" value={`${answers.dailyGoalMinutes} min / jour`} accent />
            {clan ? <PlanLine label="Ton clan" value={clan} /> : null}
            <PlanLine
              label="Rappels"
              value={answers.notificationsEnabled ? 'Activés' : 'Désactivés'}
            />
            <PlanLine label="Duels" value="1 v 1, sur ton programme" />
          </ul>
        </div>

        {/* La première mission : un geste, pas une promesse. */}
        <div
          className="mt-4 rounded-[18px] border-2 p-4"
          style={{ borderColor: 'var(--onb-yl)', background: '#FFF7E0' }}
        >
          <p className="text-[11px] font-extrabold tracking-[0.1em] uppercase" style={{ color: '#a06d00' }}>
            Ta première mission
          </p>
          <p className="mt-1 text-[16px] leading-tight font-extrabold">{mission.titre}</p>
          <p className="mt-1 text-[13.5px] leading-[1.4] font-semibold" style={{ color: 'var(--onb-mut)' }}>
            {mission.detail}
          </p>
        </div>
      </div>
      <div className="relative mt-auto pt-4">
        <OnbButton variant="yellow" disabled={finishing} onClick={onFinish}>
          {finishing ? 'Un instant…' : 'C’est parti'}
        </OnbButton>
      </div>
    </div>
  )
}
