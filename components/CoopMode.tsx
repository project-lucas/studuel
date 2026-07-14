'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Copy,
  Loader2,
  Heart,
  HeartCrack,
  HandHeart,
  Wifi,
  WifiOff,
  Users,
  PartyPopper,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { createClient } from '@/lib/supabase/client'
import { useCoop } from '@/components/useCoop'
import { recordChallenge } from '@/app/defi/actions'
import { nowMs, type ModeQuestion } from '@/lib/defi-modes'
import { permuteOptions } from '@/lib/quiz-shuffle'
import {
  coopStatus,
  coopQuestionState,
  partnerProgress,
  COOP_QUESTIONS,
  COOP_LIVES,
  COOP_SECONDS,
  type CoopAnswer,
} from '@/lib/coop'

type Props = {
  userId: string
  pool: ModeQuestion[] // questions de l'hôte (partagées avec le partenaire)
  subject?: string | null
  onExit: () => void
}

type QuestionRow = {
  id: string
  question: string
  kind: 'mcq' | 'true_false'
  options: unknown
  correct_index: number
  explanation: string | null
  quiz: { subject: string | null } | null
}

// MODE COOP — deux amis, une équipe, des questions plus corsées et des vies
// PARTAGÉES. Un lobby (créer/rejoindre par code), l'attente du partenaire, puis
// la série d'équipe : chacun répond à son rythme, une question est sauvée dès
// que l'un des deux la réussit. L'entraide, pas l'affrontement.
export default function CoopMode({ userId, pool, subject, onExit }: Props) {
  const { state, create, join, sendAnswer, persist, leave } = useCoop(userId)
  const [joinCode, setJoinCode] = useState('')
  const [guestQuestions, setGuestQuestions] = useState<ModeQuestion[] | null>(
    null,
  )
  const [copied, setCopied] = useState(false)

  const questions = useMemo<ModeQuestion[]>(() => {
    if (state.isHost) {
      const byId = new Map(pool.map((q) => [q.id, q]))
      return state.questionIds
        .map((id) => byId.get(id))
        .filter((q): q is ModeQuestion => Boolean(q))
    }
    return guestQuestions ?? []
  }, [state.isHost, state.questionIds, pool, guestQuestions])

  // Partenaire : charge les questions correspondant aux ids partagés.
  useEffect(() => {
    if (state.isHost || state.questionIds.length === 0 || guestQuestions) return
    let cancelled = false
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('quiz_questions')
        .select('id, question, kind, options, correct_index, explanation, quiz:quizzes(subject)')
        .in('id', state.questionIds)
        .returns<QuestionRow[]>()
      if (cancelled) return
      const byId = new Map((data ?? []).map((r) => [r.id, r]))
      const ordered = state.questionIds
        .map((id) => byId.get(id))
        .filter((r): r is QuestionRow => Boolean(r))
        .map((r) => {
          const opts = Array.isArray(r.options) ? (r.options as string[]) : []
          const shuffled =
            r.kind === 'true_false'
              ? { options: opts, correctIndex: r.correct_index }
              : permuteOptions(opts, r.correct_index, r.id)
          return {
            id: r.id,
            prompt: r.question,
            options: shuffled.options,
            correctIndex: shuffled.correctIndex,
            explanation: r.explanation,
            subject: r.quiz?.subject ?? null,
          }
        })
      setGuestQuestions(ordered)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [state.isHost, state.questionIds, guestQuestions])

  const handleExit = useCallback(() => {
    leave()
    onExit()
  }, [leave, onExit])

  // Enregistre en fin de partie : score d'équipe = questions sauvées → XP.
  const total = Math.min(questions.length, COOP_QUESTIONS)
  const iFinished = state.myAnswers.length >= total && total > 0
  useEffect(() => {
    if ((iFinished || state.outcome) && state.sessionId) {
      persist(state.sessionId, state.myAnswers)
    }
  }, [iFinished, state.outcome, state.sessionId, state.myAnswers, persist])

  useEffect(() => {
    if (iFinished || state.outcome) {
      const status = coopStatus(state.myAnswers, state.theirAnswers, total)
      recordChallenge(status.cleared, total, 'duel').catch(() => {})
    }
    // On n'enregistre qu'une fois : à la bascule vers "fini".
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iFinished, state.outcome])

  // --- Lobby -----------------------------------------------------------------
  if (state.phase === 'idle') {
    return (
      <div className="mx-auto flex max-w-md flex-col gap-4 p-4">
        <div className="text-center">
          <h2 className="font-heading flex items-center justify-center gap-2 text-xl font-bold text-white">
            <HandHeart className="size-5 text-highlight" aria-hidden="true" /> Mode Coop
          </h2>
          <p className="mt-1 text-sm text-white/75">
            Appelle un ami : à deux, vous affrontez des questions plus dures avec{' '}
            {COOP_LIVES} vies partagées. Une bonne réponse de l’un sauve l’équipe.
          </p>
        </div>
        <Button
          className="press-3d-deep"
          onClick={() => create(subject ?? 'Coop', pool.map((q) => q.id))}
          disabled={pool.length < 2}
        >
          <Users className="size-4" /> Créer une équipe
        </Button>
        <div className="text-center text-sm text-white/60">ou</div>
        <div className="flex gap-2">
          <input
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.trim())}
            placeholder="Coller le code de l’équipe"
            aria-label="Code de l’équipe"
            className="flex-1 rounded-xl border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
          />
          <Button
            variant="secondary"
            onClick={() => joinCode && join(joinCode)}
            disabled={!joinCode}
          >
            Rejoindre
          </Button>
        </div>
        <Button variant="ghost" onClick={handleExit} className="text-white hover:text-white">
          Retour
        </Button>
      </div>
    )
  }

  if (state.phase === 'connecting') {
    return <Centered>Connexion…</Centered>
  }

  if (state.phase === 'error') {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 p-6">
        <p className="text-sm text-red-200">
          Cette équipe n’est pas disponible (déjà complète ou expirée).
        </p>
        <Button onClick={handleExit}>Retour</Button>
      </div>
    )
  }

  // --- Attente du partenaire -------------------------------------------------
  if (state.phase === 'waiting') {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 p-6 text-center">
        <Loader2 className="size-8 animate-spin text-highlight" aria-hidden="true" />
        <p className="font-medium text-white">En attente de ton coéquipier…</p>
        <p className="text-sm text-white/70">
          Partage ce code pour qu’un ami rejoigne l’équipe :
        </p>
        <button
          type="button"
          onClick={async () => {
            if (state.sessionId) {
              await navigator.clipboard?.writeText(state.sessionId)
              setCopied(true)
              sfx.tap()
            }
          }}
          className="flex items-center gap-2 rounded-xl bg-card px-4 py-2 font-mono text-sm break-all"
        >
          <Copy className="size-4 shrink-0" aria-hidden="true" />
          {state.sessionId}
        </button>
        {copied ? <span className="text-xs text-green-300">Copié !</span> : null}
        <Button variant="ghost" onClick={handleExit} className="text-white hover:text-white">
          Annuler
        </Button>
      </div>
    )
  }

  // --- Résultat d'équipe -----------------------------------------------------
  const status = coopStatus(state.myAnswers, state.theirAnswers, total)
  const finished = status.outcome !== null || (iFinished && state.myAnswers.length >= total)

  if (status.outcome || (finished && iFinished && partnerDone(state, total))) {
    const won = status.outcome === 'won'
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 p-8 text-center">
        <span aria-hidden="true" className="text-6xl">
          {won ? '🏆' : status.outcome === 'lost' ? '💔' : '🤝'}
        </span>
        <h2 className="font-heading text-2xl font-bold text-white">
          {won ? 'Équipe victorieuse !' : status.outcome === 'lost' ? 'Équipe à terre' : 'Manche terminée'}
        </h2>
        <p className="flex items-center gap-2 rounded-full bg-highlight px-5 py-2.5 font-mono text-lg font-bold text-foreground tabular-nums">
          <PartyPopper className="size-5" aria-hidden="true" />
          {status.cleared}/{total} sauvées
        </p>
        <p className="text-sm text-white/75">
          {won
            ? 'Vous avez tout géré, à deux. La preuve que l’entraide paie 🤝'
            : status.outcome === 'lost'
              ? 'Les vies partagées sont tombées — retentez ensemble !'
              : 'Belle synchro.'}
        </p>
        <Button onClick={handleExit} className="press-3d-deep">
          Retour à l’Arène
        </Button>
      </div>
    )
  }

  if (questions.length === 0) {
    return <Centered>Chargement des questions…</Centered>
  }

  // --- Partie en cours -------------------------------------------------------
  return (
    <CoopPlay
      questions={questions.slice(0, total)}
      total={total}
      myAnswers={state.myAnswers}
      theirAnswers={state.theirAnswers}
      livesLeft={status.livesLeft}
      partnerPresent={state.partnerPresent}
      onAnswer={(q, correct) => sendAnswer({ q, correct })}
      onExit={handleExit}
    />
  )
}

// Le partenaire a-t-il fini toute la série ?
function partnerDone(
  state: { theirAnswers: CoopAnswer[] },
  total: number,
): boolean {
  return partnerProgress(state.theirAnswers, total) >= total
}

// La série d'équipe : je réponds à mon rythme, chaque question sous chrono.
// Le HUD montre les vies partagées et l'avancée du coéquipier.
function CoopPlay({
  questions,
  total,
  myAnswers,
  theirAnswers,
  livesLeft,
  partnerPresent,
  onAnswer,
  onExit,
}: {
  questions: ModeQuestion[]
  total: number
  myAnswers: CoopAnswer[]
  theirAnswers: CoopAnswer[]
  livesLeft: number
  partnerPresent: boolean
  onAnswer: (q: number, correct: boolean) => void
  onExit: () => void
}) {
  // Ma prochaine question = nombre de réponses déjà déclarées.
  const myIndex = myAnswers.length
  const q = questions[myIndex]
  const partnerAt = partnerProgress(theirAnswers, total)

  // Réponse stable : le sous-composant question la déclare une fois.
  const handleCommit = useCallback(
    (correct: boolean) => onAnswer(myIndex, correct),
    [onAnswer, myIndex],
  )

  return (
    <div className="mx-auto flex max-w-md flex-col gap-3 p-1">
      {/* HUD d'équipe : vies partagées et présence du coéquipier. */}
      <div className="flex items-center justify-between gap-2 rounded-2xl border bg-card px-3 py-2 shadow-sm">
        <span className="flex items-center gap-1" aria-label={`${livesLeft} vies partagées`}>
          {Array.from({ length: COOP_LIVES }).map((_, i) =>
            i < livesLeft ? (
              <Heart key={i} className="size-5 fill-destructive text-destructive" aria-hidden="true" />
            ) : (
              <HeartCrack key={i} className="size-5 text-muted-foreground" aria-hidden="true" />
            ),
          )}
        </span>
        <span className="text-xs font-semibold text-foreground">Vies partagées</span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          {partnerPresent ? (
            <Wifi className="size-3.5 text-green-600" aria-hidden="true" />
          ) : (
            <WifiOff className="size-3.5 text-destructive" aria-hidden="true" />
          )}
          Ami {partnerAt}/{total}
        </span>
      </div>

      {q ? (
        <CoopQuestion
          key={myIndex}
          question={q}
          index={myIndex}
          total={total}
          onCommit={handleCommit}
        />
      ) : (
        <Centered>
          <Loader2 className="mb-2 size-6 animate-spin text-highlight" aria-hidden="true" />
          En attente de ton coéquipier…
        </Centered>
      )}

      {/* Réponses déjà tranchées par l'équipe (aperçu des sauvetages). */}
      <div className="mt-1 flex flex-wrap gap-1" aria-hidden="true">
        {Array.from({ length: total }).map((_, i) => {
          const st = coopQuestionState(myAnswers, theirAnswers, i)
          return (
            <span
              key={i}
              className={cn(
                'size-2.5 rounded-full',
                st === 'cleared' && 'bg-highlight',
                st === 'failed' && 'bg-destructive',
                st === 'pending' && 'bg-white/25',
              )}
            />
          )
        })}
      </div>

      <button
        type="button"
        onClick={onExit}
        className="mt-2 self-center text-sm text-white/70 underline-offset-4 hover:underline"
      >
        Quitter l’équipe
      </button>
    </div>
  )
}

// Une question de la série coop, montée à neuf à chaque index (key) : l'état
// (sélection, chrono) repart donc à zéro sans effet de réinitialisation. Chrono
// serré (le « plus dur ») : à zéro, la question est comptée fausse pour moi.
function CoopQuestion({
  question,
  index,
  total,
  onCommit,
}: {
  question: ModeQuestion
  index: number
  total: number
  onCommit: (correct: boolean) => void
}) {
  const [selected, setSelected] = useState<number | null>(null)
  const [remaining, setRemaining] = useState(COOP_SECONDS)
  const committedRef = useRef(false)

  const commit = useCallback(
    (choice: number) => {
      if (committedRef.current) return
      committedRef.current = true
      setSelected(choice)
      const correct = choice === question.correctIndex
      if (correct) sfx.correct()
      else sfx.wrong()
      window.setTimeout(() => onCommit(correct), 500)
    },
    [question, onCommit],
  )

  useEffect(() => {
    const startedAt = nowMs()
    const id = window.setInterval(() => {
      const left = COOP_SECONDS - Math.floor((nowMs() - startedAt) / 1000)
      setRemaining(Math.max(0, left))
      if (left <= 0) {
        window.clearInterval(id)
        commit(-1) // temps écoulé : faux pour moi (le partenaire peut sauver)
      }
    }, 250)
    return () => window.clearInterval(id)
  }, [commit])

  const answered = selected !== null
  const lowTime = remaining <= 4

  return (
    <>
      <div className="flex items-center justify-between text-sm text-white/75">
        <span className="font-semibold text-white">
          Question {index + 1}/{total}
        </span>
        <span
          className={cn(
            'font-mono text-sm font-bold tabular-nums',
            lowTime ? 'text-red-300' : 'text-white',
          )}
        >
          {remaining}s
        </span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-white/20"
        role="progressbar"
        aria-label="Chrono de la question"
        aria-valuemin={0}
        aria-valuemax={COOP_SECONDS}
        aria-valuenow={remaining}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all',
            lowTime ? 'bg-destructive' : 'bg-highlight',
          )}
          style={{ width: `${(remaining / COOP_SECONDS) * 100}%` }}
        />
      </div>

      {question.subject ? (
        <p className="mt-1 text-xs font-semibold text-white/70 uppercase">
          {question.subject}
        </p>
      ) : null}
      <h2 className="font-heading mb-1 text-xl font-bold text-balance text-white">
        {question.prompt}
      </h2>

      <div className="flex flex-col gap-2">
        {question.options.map((option, i) => {
          const isCorrect = i === question.correctIndex
          const isSelected = i === selected
          return (
            <button
              key={i}
              type="button"
              disabled={answered}
              onClick={() => commit(i)}
              className={cn(
                'flex items-center justify-between gap-3 rounded-2xl border bg-card px-4 py-3 text-left text-sm font-medium transition-all',
                !answered &&
                  'hover:border-primary/40 hover:bg-accent hover:text-accent-foreground active:scale-[0.99]',
                answered && isCorrect && 'border-green-600 bg-green-50 text-green-700',
                answered && isSelected && !isCorrect && 'border-destructive bg-red-50 text-destructive',
                answered && !isSelected && !isCorrect && 'opacity-50',
              )}
            >
              {option}
            </button>
          )
        })}
      </div>
      <p role="status" aria-live="polite" className="sr-only">
        {answered
          ? selected === question.correctIndex
            ? 'Bonne réponse'
            : 'Mauvaise réponse'
          : ''}
      </p>
    </>
  )
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-1 p-6 text-center text-sm text-white/80">
      {children}
    </div>
  )
}
