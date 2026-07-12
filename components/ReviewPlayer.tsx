'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Check, Flame, Swords, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { SoundToggle } from '@/components/FlashcardPlayer'
import { finishReviewSession } from '@/app/reviser/actions'
import type { ReviewAnswer } from '@/lib/srs'

// Un item jouable de la file « À revoir » : la question (ou carte) complète,
// avec son drapeau Revanche (erreur à venger).
export type ReviewPlayItem =
  | {
      kind: 'question'
      id: string
      subject: string | null
      inRevanche: boolean
      prompt: string
      options: string[]
      correctIndex: number
      explanation: string | null
    }
  | {
      kind: 'card'
      id: string
      subject: string | null
      inRevanche: boolean
      front: string
      back: string
    }

type Result = {
  saved: boolean
  revancheCleared: boolean
  coins: number
}

// La session « À revoir aujourd'hui » : la file SRS + Revanche, jouée d'une
// traite. Chaque réponse reprogramme l'item (succès = plus tard, erreur =
// demain + Revanche) ; vider la Revanche paye un bonus en pièces.
export default function ReviewPlayer({ items }: { items: ReviewPlayItem[] }) {
  const router = useRouter()
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [answers, setAnswers] = useState<ReviewAnswer[]>([])
  const [done, setDone] = useState(false)
  const [result, setResult] = useState<Result | null>(null)

  const item = items[index]
  const answered = selected !== null
  const revancheCount = items.filter((i) => i.inRevanche).length

  const finish = (finalAnswers: ReviewAnswer[]) => {
    setDone(true)
    sfx.complete()
    finishReviewSession(finalAnswers)
      .then(setResult)
      .catch(() => setResult({ saved: false, revancheCleared: false, coins: 0 }))
  }

  const next = (good: boolean) => {
    if (!item) return
    const newAnswers: ReviewAnswer[] = [
      ...answers,
      { kind: item.kind, id: item.id, subject: item.subject, good },
    ]
    setAnswers(newAnswers)
    if (index + 1 >= items.length) {
      finish(newAnswers)
    } else {
      setIndex((i) => i + 1)
      setSelected(null)
      setRevealed(false)
    }
  }

  // ------------------------------------------------------------------- vide
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 pt-10 text-center">
        <div className="text-5xl">🌿</div>
        <h1 className="font-heading text-2xl font-bold">Rien à revoir !</h1>
        <p className="max-w-xs text-sm text-muted-foreground">
          Ta mémoire est à jour. Continue tes leçons et tes quiz — la file se
          remplira toute seule, au bon moment.
        </p>
        <Button onClick={() => router.push('/reviser')}>
          Retour à Réviser
        </Button>
      </div>
    )
  }

  // ------------------------------------------------------------------- fin
  if (done) {
    const correct = answers.filter((a) => a.good).length
    const ratio = answers.length > 0 ? correct / answers.length : 0
    return (
      <div className="flex flex-col items-center gap-5 pt-8 text-center">
        <div className="animate-in zoom-in text-6xl duration-500">
          {ratio >= 0.8 ? '🧠' : ratio >= 0.5 ? '💪' : '🌱'}
        </div>
        <div>
          <h1 className="font-heading text-3xl font-bold">
            {ratio >= 0.8
              ? 'Mémoire affûtée !'
              : ratio >= 0.5
                ? 'Bien repris !'
                : 'Ça reviendra vite !'}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {correct}/{answers.length} retenues — chaque item est reprogrammé
            au bon moment.
          </p>
        </div>

        {result?.revancheCleared ? (
          <p className="animate-in slide-in-from-bottom-2 flex items-center gap-2 rounded-full bg-highlight px-5 py-2 text-sm font-bold duration-500">
            <Swords className="size-4" /> Revanche vidée ! +{result.coins}{' '}
            pièces
          </p>
        ) : null}

        <p className="text-sm text-muted-foreground">
          {result === null
            ? ''
            : result.saved
              ? '✓ Session enregistrée — ta série continue 🔥'
              : 'Session non enregistrée (connecte-toi pour garder ta progression).'}
        </p>

        <Button onClick={() => router.push('/reviser')}>
          Retour à Réviser
        </Button>
      </div>
    )
  }

  // ---------------------------------------------------------------- session
  if (!item) return null

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-3">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span className="font-mono tabular-nums">
          {index + 1}/{items.length}
        </span>
        {revancheCount > 0 ? (
          <span className="flex items-center gap-1 text-xs font-semibold">
            <Swords className="size-3.5 text-primary" /> {revancheCount} à
            venger
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs font-semibold">
            <Flame className="size-3.5 text-primary" /> Révision espacée
          </span>
        )}
        <SoundToggle />
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-label="Progression de la session"
        aria-valuemin={0}
        aria-valuemax={items.length}
        aria-valuenow={index}
        aria-valuetext={`Item ${index + 1} sur ${items.length}`}
      >
        <div
          className="h-full rounded-full bg-highlight transition-all"
          style={{ width: `${(index / items.length) * 100}%` }}
        />
      </div>

      <div className="flex items-center gap-2">
        {item.subject ? (
          <p className="text-xs font-semibold text-muted-foreground uppercase">
            {item.subject}
          </p>
        ) : null}
        {item.inRevanche ? (
          <span className="flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
            <Swords className="size-3" aria-hidden="true" /> Revanche
          </span>
        ) : null}
      </div>

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
                {answered && isCorrect ? (
                  <Check className="size-4 shrink-0" />
                ) : null}
                {answered && isSelected && !isCorrect ? (
                  <X className="size-4 shrink-0" />
                ) : null}
              </button>
            )
          })}

          <p
            role="status"
            aria-live="polite"
            className={cn(
              'text-sm font-semibold',
              !answered && 'sr-only',
              answered &&
                selected === item.correctIndex &&
                'text-green-700 dark:text-green-400',
              answered && selected !== item.correctIndex && 'text-destructive',
            )}
          >
            {answered
              ? selected === item.correctIndex
                ? item.inRevanche
                  ? 'Vengée ! ✓'
                  : 'Bonne réponse ✓'
                : 'Mauvaise réponse ✗ — elle revient demain'
              : ''}
          </p>

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
            aria-hidden={!revealed}
            className={cn(
              'grid grid-cols-2 gap-2 transition-opacity',
              !revealed && 'pointer-events-none opacity-0',
            )}
          >
            <Button
              variant="outline"
              size="lg"
              tabIndex={revealed ? undefined : -1}
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
              tabIndex={revealed ? undefined : -1}
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
