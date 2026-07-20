'use client'

import { useState, useTransition } from 'react'
import { ChevronLeft, Gauge, Settings2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import {
  CAPACITY_OPTIONS,
  CAPACITY_QUESTIONS,
  computeCapacity,
  capacityMessage,
  capacityPriorities,
  type CapacityAnswers,
} from '@/lib/capacity'
import { saveCapacityQuiz } from '@/app/moi/actions'
import { useDialog } from '@/lib/use-dialog'

// -----------------------------------------------------------------------------
// Questionnaire en modale : une question par écran, 4 réponses
// (Jamais → Toujours), puis révélation du score.
// -----------------------------------------------------------------------------
function CapacityQuiz({
  initial,
  onClose,
}: {
  // Réponses du dernier bilan : pré-cochées pour ajuster plutôt que repartir de zéro.
  initial?: CapacityAnswers
  onClose: () => void
}) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<CapacityAnswers>(initial ?? {})
  const [result, setResult] = useState<number | null>(null)
  const [, startTransition] = useTransition()

  useDialog(onClose)

  const total = CAPACITY_QUESTIONS.length
  const q = CAPACITY_QUESTIONS[Math.min(step, total - 1)]

  const pick = (value: number) => {
    sfx.tap()
    const next = { ...answers, [q.id]: value }
    setAnswers(next)
    if (step < total - 1) {
      setStep(step + 1)
    } else {
      // Dernière question : on calcule, on sauvegarde, on révèle.
      setResult(computeCapacity(next))
      sfx.correct()
      startTransition(() => saveCapacityQuiz(next))
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Bilan de capacités"
        onClick={(e) => e.stopPropagation()}
        className="pop-in w-full max-w-sm rounded-2xl bg-card p-5 text-foreground shadow-xl"
      >
        {/* header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold">
            {result === null ? 'Fais le point' : 'Ton bilan'}
          </h2>
          <button
            type="button"
            aria-label="Fermer"
            onClick={() => {
              sfx.tap()
              onClose()
            }}
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        {result === null ? (
          <>
            {/* progression */}
            <div className="mb-4">
              <p className="mb-1.5 text-xs font-semibold text-muted-foreground">
                Question {step + 1}/{total}
              </p>
              <div
                className="h-1.5 overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-label="Progression du bilan"
                aria-valuemin={0}
                aria-valuemax={total}
                aria-valuenow={step}
              >
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${(step / total) * 100}%` }}
                />
              </div>
            </div>

            <p className="text-base font-bold">{q.question}</p>
            <p className="mt-1.5 mb-4 text-xs leading-relaxed text-muted-foreground">
              {q.why}
            </p>

            <div className="flex flex-col gap-2">
              {CAPACITY_OPTIONS.map((label, value) => (
                <button
                  key={label}
                  type="button"
                  aria-pressed={answers[q.id] === value}
                  onClick={() => pick(value)}
                  className={cn(
                    'rounded-xl border px-4 py-2.5 text-left text-sm font-semibold transition-all hover:border-primary/40 hover:bg-accent hover:text-accent-foreground active:scale-[0.98]',
                    answers[q.id] === value && 'border-primary bg-primary/10',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            {step > 0 ? (
              <button
                type="button"
                onClick={() => {
                  sfx.tap()
                  setStep(step - 1)
                }}
                className="mt-3 flex items-center gap-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                <ChevronLeft className="size-3.5" /> Question précédente
              </button>
            ) : null}
          </>
        ) : (
          /* ------------------------------------------------- révélation */
          <div className="flex flex-col items-center py-2 text-center">
            <p className="text-sm text-muted-foreground">Tu es à</p>
            <p className="pop-spring font-heading my-1 text-6xl font-extrabold text-primary tabular-nums">
              {result}%
            </p>
            <p className="text-sm font-bold">de tes capacités</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {capacityMessage(result)}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Chaque habitude ancrée fait monter ce score — tes missions de la
              semaine sont là pour ça. Refais le point quand tu veux.
            </p>
            <Button
              type="button"
              onClick={onClose}
              className="mt-4 w-full rounded-xl"
            >
              C&apos;est parti
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

// Anneau de score, encre (primary), pourcentage au centre.
function ScoreRing({ score }: { score: number }) {
  const R = 34
  const C = 2 * Math.PI * R
  return (
    <span className="relative inline-flex size-20 shrink-0 items-center justify-center">
      <svg
        viewBox="0 0 80 80"
        aria-hidden="true"
        className="absolute inset-0 size-full -rotate-90"
      >
        <circle
          cx="40"
          cy="40"
          r={R}
          fill="none"
          strokeWidth="8"
          className="stroke-muted"
        />
        {score > 0 ? (
          <circle
            cx="40"
            cy="40"
            r={R}
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${(C * score) / 100} ${C}`}
            className="stroke-primary transition-all"
          />
        ) : null}
      </svg>
      <span className="font-heading text-lg font-extrabold tabular-nums">
        {score}%
      </span>
    </span>
  )
}

// -----------------------------------------------------------------------------
// Bloc « Tes capacités » — tout en haut de Moi. Le score (anneau) côtoie les
// priorités : les habitudes les plus faibles du bilan, celles qui feront le
// plus progresser le score. ⚙ pour refaire le point et actualiser.
// -----------------------------------------------------------------------------
export default function CapacityScore({
  score,
  answers = {},
  autoOpen = false,
  needsMigration = false,
  variant = 'full',
}: {
  score: number | null
  answers?: CapacityAnswers
  // Ouvre le questionnaire à l'arrivée (fin d'onboarding, score encore vide).
  autoOpen?: boolean
  needsMigration?: boolean
  // `line` : ligne compacte sans carte, à glisser dans la carte Trajectoire.
  variant?: 'full' | 'line'
}) {
  const [open, setOpen] = useState(autoOpen && score === null && !needsMigration)
  const priorities = capacityPriorities(answers)
  // Tant qu'aucun vrai bilan n'a été fait, on affiche un score fictif (50 %).
  const displayScore = score ?? 50
  const topPriority = priorities[0] ?? null

  // Version « 1 ligne » fondue dans la carte Trajectoire : score + priorité +
  // ⚙ pour (re)faire le point. Pas de chrome de carte propre.
  if (variant === 'line') {
    return (
      <>
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Gauge className="size-4.5" strokeWidth={2.2} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-foreground">
              <span className="tabular-nums">{displayScore}%</span> de tes
              capacités d&apos;apprentissage
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {needsMigration
                ? 'Bilan à activer (migration 013).'
                : topPriority
                  ? `À renforcer : ${topPriority.label}`
                  : capacityMessage(displayScore)}
            </p>
          </div>
          {!needsMigration ? (
            <button
              type="button"
              aria-label="Faire ou refaire le point et actualiser mon score"
              title="Faire le point"
              onClick={() => {
                sfx.tap()
                setOpen(true)
              }}
              className="flex size-11 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-90"
            >
              <Settings2 className="size-4" strokeWidth={2.2} />
            </button>
          ) : null}
        </div>

        {open ? (
          <CapacityQuiz initial={answers} onClose={() => setOpen(false)} />
        ) : null}
      </>
    )
  }

  return (
    <>
      <section
        aria-label={`Tu es à ${displayScore} % de tes capacités`}
        className="moi-card rounded-[1.75rem] bg-white p-5"
      >
        {/* header : label + réglage (faire / refaire le point) */}
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
            Tes capacités
          </p>
          {!needsMigration ? (
            <button
              type="button"
              aria-label="Faire ou refaire le point et actualiser mon score"
              title="Faire le point"
              onClick={() => {
                sfx.tap()
                setOpen(true)
              }}
              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-90"
            >
              <Settings2 className="size-4" strokeWidth={2.2} />
            </button>
          ) : null}
        </div>

        {needsMigration ? (
          /* --------------------------------------- migration pas encore passée */
          <div className="flex items-center gap-3">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Gauge className="size-6" strokeWidth={2.2} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold">Bilan à activer</p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Exécute <code>supabase/013_capacite.sql</code> dans le SQL
                Editor Supabase, puis recharge la page.
              </p>
            </div>
          </div>
        ) : (
          /* --------------------------------------------- score + priorités */
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <ScoreRing score={displayScore} />

            <div className="min-w-32 flex-1">
              <p className="text-base leading-snug font-bold">
                de tes capacités
                <br />
                d&apos;apprentissage
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {capacityMessage(displayScore)}
              </p>
            </div>

            <div className="w-full min-w-40 sm:w-auto sm:flex-1">
              {priorities.length > 0 ? (
                <>
                  <p className="mb-1.5 text-[10px] font-bold tracking-widest text-destructive uppercase">
                    Priorités pour progresser
                  </p>
                  <ul className="flex flex-col gap-1">
                    {priorities.map((p) => (
                      <li
                        key={p.id}
                        className="flex items-center gap-2 text-xs font-semibold text-destructive"
                      >
                        <span className="size-1.5 shrink-0 rounded-full bg-destructive" />
                        {p.label}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="text-xs font-semibold text-success dark:text-green-400">
                  💪 Toutes tes habitudes sont ancrées — rien d&apos;urgent.
                </p>
              )}
            </div>
          </div>
        )}
      </section>

      {open ? (
        <CapacityQuiz initial={answers} onClose={() => setOpen(false)} />
      ) : null}
    </>
  )
}
