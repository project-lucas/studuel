'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Heart,
  HeartCrack,
  Hexagon,
  Lightbulb,
  Star,
  Trophy,
} from 'lucide-react'
import BackButton from '@/components/BackButton'
import ProgressRing from '@/components/ProgressRing'
import PairMatch from '@/components/PairMatch'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import {
  MAX_LIVES,
  levelPoints,
  maxScore,
  planLevels,
  starsForScore,
} from '@/lib/defi-solo'
import type { QuizQuestion } from '@/lib/types'

// Défi solo par niveaux monté sur le quiz de la leçon. Chaque niveau est une
// épreuve : un QCM (« Choisis la bonne réponse ») ou, intercalée, une manche
// « Associe les paires » (Phase 2). L'élève a MAX_LIVES cœurs et accumule des
// points. Shell gamifié façon concurrent : modale Objectif, rail (niveau/vies/
// points/indice), modales Échec (« Oups… ») et Réussite (confettis), écran final
// avec étoiles. Barème pur dans lib/defi-solo. Aucun enregistrement en base
// (partie d'entraînement).
type Phase =
  | 'objective'
  | 'playing'
  | 'levelFail'
  | 'levelSuccess'
  | 'defiSuccess'
  | 'defiFail'

export default function DefiSoloPlayer({
  questions,
  title,
  subject,
  backHref,
}: {
  questions: QuizQuestion[]
  title: string
  subject: string | null
  backHref: string
}) {
  // Plan des niveaux (stable) — logique pure testée dans lib/defi-solo.
  const levels = useMemo(() => planLevels(questions), [questions])

  const total = levels.length
  const max = maxScore(total)
  const pairsSeed = questions[0]?.id ?? 'defi'

  const [phase, setPhase] = useState<Phase>('objective')
  const [levelIndex, setLevelIndex] = useState(0)
  const [lives, setLives] = useState(MAX_LIVES)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [wrongThisLevel, setWrongThisLevel] = useState(0)
  const [hintUsed, setHintUsed] = useState(false)
  const [eliminated, setEliminated] = useState<number[]>([])
  const [correction, setCorrection] = useState(false)
  const [lastGain, setLastGain] = useState(0)

  const level = levels[levelIndex]
  const question = level?.kind === 'qcm' ? level.q : null

  // Recommence entièrement le défi (vies, score, niveau, état du niveau).
  const restartDefi = () => {
    setPhase('objective')
    setLevelIndex(0)
    setLives(MAX_LIVES)
    setScore(0)
    resetLevelState()
  }

  const resetLevelState = () => {
    setSelected(null)
    setWrongThisLevel(0)
    setHintUsed(false)
    setEliminated([])
    setCorrection(false)
  }

  // Indice « 50/50 » : élimine une mauvaise option (hors bonne réponse), une
  // seule fois par niveau. Indisponible en vrai/faux ou s'il ne reste qu'une
  // mauvaise option.
  const canHint =
    !hintUsed &&
    !correction &&
    question &&
    question.kind !== 'true_false' &&
    question.options.length - eliminated.length > 2

  const useHint = () => {
    if (!canHint || !question) return
    const wrongs = question.options
      .map((_, i) => i)
      .filter((i) => i !== question.correct_index && !eliminated.includes(i))
    if (wrongs.length === 0) return
    const drop = wrongs[Math.floor(Math.random() * wrongs.length)]
    setEliminated((e) => [...e, drop])
    setHintUsed(true)
    if (selected === drop) setSelected(null)
    sfx.tap()
  }

  const validate = () => {
    if (phase !== 'playing' || !question || selected === null || correction)
      return
    if (selected === question.correct_index) {
      const gain = levelPoints(wrongThisLevel, hintUsed)
      setScore((s) => s + gain)
      setLastGain(gain)
      sfx.correct()
      setPhase('levelSuccess')
      return
    }
    // Mauvaise réponse : on perd un cœur.
    const nextLives = lives - 1
    setLives(nextLives)
    setWrongThisLevel((w) => w + 1)
    sfx.wrong()
    setPhase(nextLives <= 0 ? 'defiFail' : 'levelFail')
  }

  // Manche « paires » réussie : crédite les points (pénalité = erreurs
  // d'appariement) sans coûter de vie, puis célèbre le niveau.
  const handlePairsSolved = (mistakes: number) => {
    const gain = levelPoints(mistakes, false)
    setScore((s) => s + gain)
    setLastGain(gain)
    sfx.correct()
    setPhase('levelSuccess')
  }

  const goNextLevel = () => {
    if (levelIndex + 1 < total) {
      setLevelIndex((i) => i + 1)
      resetLevelState()
      setPhase('playing')
    } else {
      sfx.complete()
      setPhase('defiSuccess')
    }
  }

  // « Voir la correction » : révèle la bonne réponse, niveau non crédité.
  const showCorrection = () => {
    if (!question) return
    setSelected(question.correct_index)
    setCorrection(true)
    setPhase('playing')
  }

  const retryLevel = () => {
    setSelected(null)
    setPhase('playing')
  }

  const isLastLevel = levelIndex + 1 >= total

  return (
    <div className="mx-auto w-full max-w-2xl">
      <BackButton fallback={backHref} />

      {/* En-tête compact : matière + titre du défi */}
      <div className="mt-3 mb-4 text-center">
        <p className="text-muted-foreground text-xs font-medium">
          {subject ? `${subject} · ` : ''}Défi
        </p>
        <h1 className="font-heading text-xl font-bold text-balance">{title}</h1>
      </div>

      {/* Rail de stats (niveau · vies · points · indice) */}
      {phase !== 'objective' ? (
        <StatRail
          level={levelIndex + 1}
          total={total}
          lives={lives}
          score={score}
          onHint={useHint}
          canHint={Boolean(canHint)}
        />
      ) : null}

      {/* Zone de jeu — rendue inerte (ni cliquable ni tabulable) dès qu'une
          modale est ouverte, pour ne pas contourner la machine à états. */}
      {level ? (
        <div
          inert={phase !== 'playing'}
          className="bg-muted/40 mt-4 rounded-3xl border p-5 md:p-6"
        >
          {question ? (
          <>
          <p className="text-muted-foreground mb-1 text-center text-sm font-semibold">
            Choisis la bonne réponse
          </p>
          <p className="font-heading mb-5 text-center text-lg font-bold text-balance">
            {question.question}
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            {question.options.map((opt, i) => {
              const isGone = eliminated.includes(i)
              const isSelected = selected === i
              const isAnswer = correction && i === question.correct_index
              return (
                <button
                  key={i}
                  type="button"
                  disabled={isGone || correction}
                  onClick={() => {
                    setSelected(i)
                    sfx.tap()
                  }}
                  className={cn(
                    'min-h-16 rounded-2xl border-2 bg-card px-4 py-3 text-center text-sm font-medium text-card-foreground transition-all',
                    isGone && 'pointer-events-none opacity-30 line-through',
                    isAnswer &&
                      'border-green-600 bg-green-600/10 text-green-800 dark:text-green-300',
                    !isAnswer &&
                      isSelected &&
                      'border-primary ring-primary/30 ring-2',
                    !isAnswer &&
                      !isSelected &&
                      'border-border hover:border-primary/50 cursor-pointer',
                  )}
                >
                  {opt}
                </button>
              )
            })}
          </div>

          {/* Action principale */}
          <div className="mt-6 flex justify-center">
            {correction ? (
              <ClayButton onClick={goNextLevel}>
                {isLastLevel ? 'Voir le résultat' : 'Niveau suivant'}
                <ArrowRight className="size-5" aria-hidden="true" />
              </ClayButton>
            ) : (
              <ClayButton onClick={validate} disabled={selected === null}>
                Valider
              </ClayButton>
            )}
          </div>
          </>
          ) : level.kind === 'pairs' ? (
            <>
              <p className="text-muted-foreground mb-4 text-center text-sm font-semibold">
                Associe les paires
              </p>
              <PairMatch
                pairs={level.pairs}
                seed={pairsSeed}
                onSolved={handlePairsSolved}
              />
            </>
          ) : null}
        </div>
      ) : null}

      {/* ---------- Modales ---------- */}
      {phase === 'objective' ? (
        <Modal
          badge={
            <BadgeRing tone="primary">
              <span className="font-heading text-xs font-bold">
                Niv.
                <br />1
              </span>
            </BadgeRing>
          }
        >
          <h2 className="font-heading text-2xl font-bold">Objectif</h2>
          <dl className="mt-5 w-full space-y-3 text-left">
            <ObjectiveRow label="Nombre d'essais">
              <Hearts lives={MAX_LIVES} />
            </ObjectiveRow>
            <ObjectiveRow label="Points à gagner">
              <span className="inline-flex items-center gap-1.5 font-bold tabular-nums">
                {max}
                <Hexagon
                  className="fill-highlight text-highlight size-5"
                  aria-hidden="true"
                />
              </span>
            </ObjectiveRow>
          </dl>
          <ClayButton className="mt-6 w-full" onClick={() => setPhase('playing')}>
            C&apos;est parti !
          </ClayButton>
        </Modal>
      ) : null}

      {phase === 'levelSuccess' ? (
        <Modal
          badge={
            <BadgeRing tone="success">
              <span className="font-heading text-sm font-bold">
                Niv.
                <br />
                {levelIndex + 1}
              </span>
            </BadgeRing>
          }
          confetti
        >
          <h2 className="font-heading text-2xl font-bold">Niveau réussi !</h2>
          <p className="bg-muted mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold">
            Bravo ! Tu as gagné {lastGain}
            <Hexagon
              className="fill-highlight text-highlight size-4"
              aria-hidden="true"
            />
          </p>
          <ClayButton className="mt-6 w-full" onClick={goNextLevel}>
            {isLastLevel ? 'Voir le résultat' : 'Passer au niveau suivant'}
            <ArrowRight className="size-5" aria-hidden="true" />
          </ClayButton>
        </Modal>
      ) : null}

      {phase === 'levelFail' ? (
        <Modal
          badge={
            <BadgeRing tone="destructive">
              <span className="font-heading text-sm font-bold">
                Niv.
                <br />
                {levelIndex + 1}
              </span>
            </BadgeRing>
          }
        >
          <h2 className="font-heading flex items-center gap-2 text-xl font-bold text-balance">
            Oups, c&apos;était presque ça !
            <HeartCrack className="text-destructive size-6" aria-hidden="true" />
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Que souhaites-tu faire ?
          </p>
          <div className="mt-5 flex w-full flex-col gap-3">
            <ClayButton variant="outline" onClick={showCorrection}>
              Voir la correction
            </ClayButton>
            <ClayButton onClick={retryLevel}>Nouvel essai</ClayButton>
          </div>
        </Modal>
      ) : null}

      {phase === 'defiSuccess' || phase === 'defiFail' ? (
        <Modal
          badge={
            <BadgeRing tone={phase === 'defiSuccess' ? 'success' : 'destructive'}>
              <Trophy className="size-8 text-white" aria-hidden="true" />
            </BadgeRing>
          }
          confetti={phase === 'defiSuccess'}
        >
          <h2 className="font-heading text-2xl font-bold">
            {phase === 'defiSuccess' ? 'Défi réussi' : 'Défi non validé'}
          </h2>
          <p className="text-muted-foreground mt-1 text-sm font-semibold tracking-wide uppercase">
            Score
          </p>
          <p className="inline-flex items-center gap-2 text-lg font-bold tabular-nums">
            {score} / {max}
            <Hexagon
              className="fill-highlight text-highlight size-5"
              aria-hidden="true"
            />
          </p>
          <div className="mt-3">
            <p className="text-muted-foreground mb-1.5 text-xs font-medium">
              Étoiles débloquées
            </p>
            <Stars count={starsForScore(score, max)} />
          </div>
          <div className="mt-6 flex w-full flex-col gap-3">
            <Link
              href={backHref}
              className="bg-primary text-primary-foreground inline-flex w-full items-center justify-center rounded-2xl px-6 py-3.5 font-bold shadow-[0_5px_0_0] shadow-black/20 transition-transform active:translate-y-[3px] active:shadow-[0_2px_0_0]"
            >
              Terminer
            </Link>
            <button
              type="button"
              onClick={restartDefi}
              className="text-primary cursor-pointer text-sm font-semibold underline underline-offset-4"
            >
              {phase === 'defiSuccess' ? 'Rejouer ce défi' : 'Réessayer'}
            </button>
          </div>
        </Modal>
      ) : null}
    </div>
  )
}

// ------- Rail de stats (adapté mobile : barre horizontale) -------
function StatRail({
  level,
  total,
  lives,
  score,
  onHint,
  canHint,
}: {
  level: number
  total: number
  lives: number
  score: number
  onHint: () => void
  canHint: boolean
}) {
  return (
    <div className="bg-card flex items-center justify-between gap-3 rounded-2xl border p-2.5 shadow-sm">
      <span className="flex items-center gap-2">
        <ProgressRing
          value={total > 0 ? (level - 1) / total : 0}
          size={40}
          strokeWidth={4}
          fillClassName="stroke-primary"
          label={`Niveau ${level} sur ${total}`}
        >
          <span className="font-mono text-[11px] font-bold tabular-nums">
            {level}
          </span>
        </ProgressRing>
        <span className="text-muted-foreground text-xs font-semibold">
          Niv. {level}/{total}
        </span>
      </span>

      <Hearts lives={lives} />

      <span className="inline-flex items-center gap-1 text-sm font-bold tabular-nums">
        {score}
        <Hexagon
          className="fill-highlight text-highlight size-4"
          aria-hidden="true"
        />
      </span>

      <button
        type="button"
        onClick={onHint}
        disabled={!canHint}
        className="text-primary flex cursor-pointer flex-col items-center gap-0.5 rounded-xl px-2 py-1 text-[10px] font-bold transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Utiliser un indice"
      >
        <Lightbulb className="size-5" aria-hidden="true" />
        Indice
      </button>
    </div>
  )
}

function Hearts({ lives }: { lives: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${lives} vies restantes`}>
      {Array.from({ length: MAX_LIVES }, (_, i) => (
        <Heart
          key={i}
          className={cn(
            'size-5',
            i < lives
              ? 'fill-destructive text-destructive'
              : 'text-muted-foreground/40',
          )}
          aria-hidden="true"
        />
      ))}
    </span>
  )
}

function Stars({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center gap-1" aria-label={`${count} étoiles sur 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            'size-6',
            i < count
              ? 'fill-highlight text-highlight'
              : 'text-muted-foreground/25',
          )}
          aria-hidden="true"
        />
      ))}
    </span>
  )
}

function ObjectiveRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between border-b pb-2">
      <dt className="font-heading font-bold">{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}

// ------- Modale gamifiée : carte blanche + pastille qui déborde en haut -------
function Modal({
  badge,
  confetti,
  children,
}: {
  badge: React.ReactNode
  confetti?: boolean
  children: React.ReactNode
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="bg-foreground/50 absolute inset-0" aria-hidden="true" />
      <div className="pop-spring relative w-full max-w-sm">
        {/* Pastille + confettis, à cheval sur le haut de la carte */}
        <div className="absolute -top-10 left-1/2 z-10 -translate-x-1/2">
          {confetti ? <ConfettiBurst /> : null}
          {badge}
        </div>
        <div className="bg-card flex flex-col items-center rounded-3xl px-6 pt-14 pb-6 text-center shadow-xl">
          {children}
        </div>
      </div>
    </div>
  )
}

function BadgeRing({
  tone,
  children,
}: {
  tone: 'primary' | 'success' | 'destructive'
  children: React.ReactNode
}) {
  const bg =
    tone === 'success'
      ? 'bg-green-500'
      : tone === 'destructive'
        ? 'bg-destructive'
        : 'bg-highlight'
  const text = tone === 'primary' ? 'text-foreground' : 'text-white'
  return (
    <span
      className={cn(
        'ring-card flex size-20 items-center justify-center rounded-full ring-8',
        bg,
        text,
      )}
    >
      {children}
    </span>
  )
}

// Éclat de confettis depuis le centre de la pastille vers l'extérieur.
function ConfettiBurst() {
  const colors = [
    'var(--primary)',
    'var(--highlight)',
    'var(--destructive)',
    '#22c55e',
  ]
  // Variation déterministe par index (pas de Math.random pendant le render) :
  // éclat régulier en cercle, distances/rotations/délais pseudo-aléatoires
  // mais stables.
  const COUNT = 14
  const pieces = Array.from({ length: COUNT }, (_, i) => {
    const angle = (i / COUNT) * Math.PI * 2 + (i % 3) * 0.18
    const dist = 62 + ((i * 37) % 40)
    return {
      tx: `${Math.round(Math.cos(angle) * dist)}px`,
      ty: `${Math.round(Math.sin(angle) * dist)}px`,
      rot: `${((i * 137) % 540) - 270}deg`,
      delay: `${(i % 5) * 0.02}s`,
      color: colors[i % colors.length],
    }
  })
  return (
    <span
      className="pointer-events-none absolute top-1/2 left-1/2 z-0"
      aria-hidden="true"
    >
      {pieces.map((p, i) => (
        <span
          key={i}
          className="defi-confetti"
          style={
            {
              backgroundColor: p.color,
              '--tx': p.tx,
              '--ty': p.ty,
              '--rot': p.rot,
              animationDelay: p.delay,
            } as React.CSSProperties
          }
        />
      ))}
    </span>
  )
}

// Bouton claymorphique (ombre dure qui s'écrase au clic).
function ClayButton({
  children,
  onClick,
  disabled,
  variant = 'primary',
  className,
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'outline'
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 font-bold transition-transform active:translate-y-[3px]',
        variant === 'primary'
          ? 'bg-primary text-primary-foreground shadow-[0_5px_0_0] shadow-black/20 active:shadow-[0_2px_0_0]'
          : 'bg-card text-foreground border shadow-[0_5px_0_0] shadow-black/10 active:shadow-[0_2px_0_0]',
        disabled ? 'pointer-events-none opacity-40' : 'cursor-pointer',
        className,
      )}
    >
      {children}
    </button>
  )
}
