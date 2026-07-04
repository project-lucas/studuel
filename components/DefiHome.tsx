'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Flame, Zap, Check, X, ArrowRight, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { SoundToggle } from '@/components/FlashcardPlayer'
import { XP_RULES, type LevelInfo } from '@/lib/xp'
import { recordChallenge } from '@/app/defi/actions'

export type ChallengeItem =
  | {
      kind: 'question'
      id: string
      prompt: string
      options: string[]
      correctIndex: number
      explanation: string | null
      subject: string | null
    }
  | {
      kind: 'card'
      id: string
      front: string
      back: string
      subject: string | null
    }

type Phase = 'landing' | 'playing' | 'done'

// L'onglet central : UN gros bouton, une session de ~3 minutes, de l'XP.
// L'élève ne choisit rien — il joue.
export default function DefiHome({
  items,
  streak,
  doneToday,
  level,
  firstName,
}: {
  items: ChallengeItem[]
  streak: number
  doneToday: boolean
  level: LevelInfo
  firstName: string | null
}) {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('landing')
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [xp, setXp] = useState(0)
  const [saved, setSaved] = useState<boolean | null>(null)

  const item = items[index]
  const answered = selected !== null

  const start = () => {
    setPhase('playing')
    setIndex(0)
    setSelected(null)
    setRevealed(false)
    setCorrect(0)
    setXp(0)
    setSaved(null)
    sfx.flip()
  }

  const finish = (finalCorrect: number, finalXp: number) => {
    const totalXp = finalXp + XP_RULES.challengeBonus
    setXp(totalXp)
    setPhase('done')
    sfx.complete()
    recordChallenge(finalCorrect, items.length, totalXp)
      .then((r) => setSaved(r.saved))
      .catch(() => setSaved(false))
  }

  const next = (gained: boolean) => {
    const newCorrect = correct + (gained ? 1 : 0)
    const newXp = xp + (gained ? XP_RULES.challengePerCorrect : 0)
    setCorrect(newCorrect)
    setXp(newXp)
    if (index + 1 >= items.length) {
      finish(newCorrect, newXp)
    } else {
      setIndex((i) => i + 1)
      setSelected(null)
      setRevealed(false)
    }
  }

  // ---------------------------------------------------------------- landing
  if (phase === 'landing') {
    return (
      <div className="flex flex-col items-center gap-6 pt-4 text-center">
        {/* XP & niveau */}
        <div className="w-full max-w-sm rounded-2xl border bg-card p-3 shadow-sm">
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-semibold">
              Niv. {level.level} — {level.title}
            </span>
            <span className="font-mono text-xs tabular-nums text-muted-foreground">
              {level.currentXp}
              {level.nextAt ? ` / ${level.nextAt}` : ''} XP
            </span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="bar-fill h-full rounded-full bg-highlight transition-all"
              style={{ width: `${Math.round(level.progress * 100)}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-lg font-bold">
          <Flame className="size-5 text-highlight" />
          <span className="font-mono tabular-nums">{streak}</span>
          <span className="text-sm font-medium text-muted-foreground">
            jour{streak > 1 ? 's' : ''} de série
          </span>
        </div>

        <div className="space-y-1">
          <h1 className="font-heading text-3xl font-bold">
            {doneToday
              ? 'Encore un, pour la gloire ?'
              : firstName
                ? `À toi de jouer, ${firstName} !`
                : 'À toi de jouer !'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {items.length} questions · environ 3 minutes ·{' '}
            {doneToday ? 'défi du jour déjà validé ✓' : 'valide ta journée'}
          </p>
        </div>

        {/* LE bouton */}
        <button
          type="button"
          onClick={start}
          disabled={items.length === 0}
          className={cn(
            'group flex size-36 flex-col items-center justify-center gap-1 rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-40',
            !doneToday && items.length > 0 && 'go-pulse',
          )}
        >
          <Zap className="size-10 transition-transform group-hover:rotate-12" />
          <span className="font-heading text-xl font-bold">GO</span>
        </button>

        {items.length === 0 ? (
          <p className="max-w-xs text-sm text-muted-foreground">
            Pas encore de contenu pour ta classe — reviens bientôt !
          </p>
        ) : null}
      </div>
    )
  }

  // ---------------------------------------------------------------- done
  if (phase === 'done') {
    const ratio = items.length > 0 ? correct / items.length : 0
    return (
      <div className="flex flex-col items-center gap-5 pt-8 text-center">
        <div className="animate-in zoom-in text-6xl duration-500">
          {ratio >= 0.8 ? '🏆' : ratio >= 0.5 ? '💪' : '🌱'}
        </div>
        <div>
          <h1 className="font-heading text-3xl font-bold">
            {ratio >= 0.8
              ? 'Excellent !'
              : ratio >= 0.5
                ? 'Bien joué !'
                : 'C’est un début !'}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {correct}/{items.length} bonnes réponses
          </p>
        </div>

        <div className="animate-in slide-in-from-bottom-2 flex items-center gap-2 rounded-full bg-highlight px-6 py-3 font-mono text-2xl font-bold text-foreground shadow-lg duration-700 tabular-nums">
          <Zap className="size-6" /> +{xp} XP
        </div>

        <p className="text-sm text-muted-foreground">
          {saved === true
            ? '✓ Journée validée — ta série continue 🔥'
            : saved === false
              ? 'Session non enregistrée (connecte-toi pour garder ton XP).'
              : ''}
        </p>

        <div className="flex gap-2">
          <Button onClick={() => router.refresh()} variant="outline">
            <RotateCcw className="size-4" /> Nouveau défi
          </Button>
          <Button onClick={() => router.push('/moi')}>Voir mes progrès</Button>
        </div>
      </div>
    )
  }

  // ---------------------------------------------------------------- playing
  if (!item) return null

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-3">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span className="font-mono tabular-nums">
          {index + 1}/{items.length}
        </span>
        <span className="flex items-center gap-1 font-mono font-semibold text-foreground tabular-nums">
          <Zap className="size-3.5 text-highlight" /> {xp} XP
        </span>
        <SoundToggle />
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-highlight transition-all"
          style={{ width: `${(index / items.length) * 100}%` }}
        />
      </div>

      {item.subject ? (
        <p className="text-xs font-semibold text-muted-foreground uppercase">
          {item.subject}
        </p>
      ) : null}

      {item.kind === 'question' ? (
        <div className="flex flex-col gap-2">
          <h2 className="font-heading mb-1 text-xl font-bold text-balance">
            {item.prompt}
          </h2>
          {item.options.map((option, i) => {
            const isCorrect = i === item.correctIndex
            const isSelected = i === selected
            return (
              <button
                key={i}
                type="button"
                disabled={answered}
                onClick={() => {
                  setSelected(i)
                  if (isCorrect) sfx.correct()
                  else sfx.wrong()
                }}
                className={cn(
                  'flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-all',
                  !answered &&
                    'hover:border-primary/40 hover:bg-accent hover:text-accent-foreground active:scale-[0.99]',
                  answered &&
                    isCorrect &&
                    'border-green-600 bg-green-600/10 text-green-700 dark:text-green-400',
                  answered &&
                    isSelected &&
                    !isCorrect &&
                    'border-destructive bg-destructive/10 text-destructive',
                  answered && !isSelected && !isCorrect && 'opacity-50',
                )}
              >
                {option}
                {answered && isCorrect ? <Check className="size-4 shrink-0" /> : null}
                {answered && isSelected && !isCorrect ? (
                  <X className="size-4 shrink-0" />
                ) : null}
              </button>
            )
          })}

          {answered && item.explanation ? (
            <p className="rounded-2xl bg-muted p-3 text-sm text-muted-foreground">
              {item.explanation}
            </p>
          ) : null}

          <Button
            className="mt-1 self-end rounded-full"
            disabled={!answered}
            onClick={() => next(selected === item.correctIndex)}
          >
            Suivant <ArrowRight className="size-4" />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => {
              if (!revealed) {
                sfx.flip()
                setRevealed(true)
              }
            }}
            className="flex min-h-48 w-full flex-col items-center justify-center gap-3 rounded-2xl bg-card p-6 text-center ring-1 ring-foreground/10 transition-all active:scale-[0.99]"
          >
            <p className="font-heading text-2xl font-semibold text-balance">
              {item.front}
            </p>
            {revealed ? (
              <p className="animate-in fade-in text-lg font-medium text-primary duration-300">
                {item.back}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Touche pour voir la réponse
              </p>
            )}
          </button>

          <div
            className={cn(
              'grid grid-cols-2 gap-2 transition-opacity',
              !revealed && 'pointer-events-none opacity-0',
            )}
          >
            <Button
              variant="outline"
              size="lg"
              className="rounded-full border-amber-500/40 text-amber-700 hover:bg-amber-500/10 dark:text-amber-400"
              onClick={() => {
                sfx.wrong()
                next(false)
              }}
            >
              À revoir
            </Button>
            <Button
              size="lg"
              className="rounded-full bg-green-600 text-white hover:bg-green-600/85"
              onClick={() => {
                sfx.correct()
                next(true)
              }}
            >
              <Check className="size-4" /> Je savais
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
