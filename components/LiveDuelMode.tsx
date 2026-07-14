'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Copy, Loader2, Swords, Trophy, Wifi, WifiOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useLiveDuel } from '@/components/useLiveDuel'
import {
  ROUND_SIZE,
  nowMs,
  type ModeQuestion,
} from '@/lib/defi-modes'
import { permuteQuizOptions } from '@/lib/quiz-shuffle'

type Props = {
  userId: string
  pool: ModeQuestion[] // questions de l'hôte (partagées avec le rival)
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

// Duel en temps réel : un lobby (créer/rejoindre), l'attente du rival, puis des
// manches de 5 questions synchronisées, et le verdict BO3.
export default function LiveDuelMode({ userId, pool, subject, onExit }: Props) {
  const { state, create, join, sendRound, persist, leave } = useLiveDuel(userId)
  const [joinCode, setJoinCode] = useState('')
  const [guestQuestions, setGuestQuestions] = useState<ModeQuestion[] | null>(
    null,
  )
  const [copied, setCopied] = useState(false)

  // Questions effectivement jouées, dans l'ordre partagé (question_ids).
  const questions = useMemo<ModeQuestion[]>(() => {
    if (state.isHost) {
      const byId = new Map(pool.map((q) => [q.id, q]))
      return state.questionIds
        .map((id) => byId.get(id))
        .filter((q): q is ModeQuestion => Boolean(q))
    }
    return guestQuestions ?? []
  }, [state.isHost, state.questionIds, pool, guestQuestions])

  // Rival : charge les ModeQuestion correspondant aux question_ids reçus.
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
          const shuffled = permuteQuizOptions(r.kind, opts, r.correct_index, r.id)
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

  // Persiste les manches en fin de duel (historique).
  useEffect(() => {
    if (state.winner && state.duelId) {
      persist(state.duelId, state.myRounds)
    }
  }, [state.winner, state.duelId, state.myRounds, persist])

  // --- Lobby -----------------------------------------------------------------
  if (state.phase === 'idle') {
    return (
      <div className="mx-auto flex max-w-md flex-col gap-4 p-4">
        <h2 className="font-heading flex items-center gap-2 text-xl font-bold">
          <Swords className="text-primary size-5" aria-hidden="true" /> Duel en
          ligne
        </h2>
        <Button
          onClick={() => create(subject ?? 'Duel', pool.map((q) => q.id))}
          disabled={pool.length < ROUND_SIZE}
        >
          Créer un duel
        </Button>
        <div className="text-muted-foreground text-center text-sm">ou</div>
        <div className="flex gap-2">
          <input
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.trim())}
            placeholder="Coller le code du duel"
            className="bg-background flex-1 rounded-xl border px-3 py-2 text-sm outline-none"
          />
          <Button
            variant="outline"
            onClick={() => joinCode && join(joinCode)}
            disabled={!joinCode}
          >
            Rejoindre
          </Button>
        </div>
        <Button variant="ghost" onClick={handleExit}>
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
        <p className="text-destructive text-sm">
          Ce duel n’est pas disponible (déjà rejoint ou expiré).
        </p>
        <Button onClick={handleExit}>Retour</Button>
      </div>
    )
  }

  // --- Attente du rival ------------------------------------------------------
  if (state.phase === 'waiting') {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 p-6 text-center">
        <Loader2 className="text-primary size-8 animate-spin" aria-hidden="true" />
        <p className="font-medium">En attente d’un adversaire…</p>
        <p className="text-muted-foreground text-sm">
          Partage ce code pour qu’un ami te rejoigne :
        </p>
        <button
          type="button"
          onClick={async () => {
            if (state.duelId) {
              await navigator.clipboard?.writeText(state.duelId)
              setCopied(true)
            }
          }}
          className="bg-muted flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-sm break-all"
        >
          <Copy className="size-4 shrink-0" aria-hidden="true" />
          {state.duelId}
        </button>
        {copied ? <span className="text-xs text-green-600">Copié !</span> : null}
        <Button variant="ghost" onClick={handleExit}>
          Annuler
        </Button>
      </div>
    )
  }

  // --- Résultat --------------------------------------------------------------
  if (state.winner) {
    const iWon = state.winner === 'me'
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 p-8 text-center">
        <Trophy
          className={`size-12 ${iWon ? 'text-highlight' : 'text-muted-foreground'}`}
          aria-hidden="true"
        />
        <h2 className="font-heading text-2xl font-bold">
          {iWon ? 'Victoire !' : 'Défaite'}
        </h2>
        <p className="text-muted-foreground text-sm">
          Manches gagnées : {state.myRounds.length > 0 ? '' : ''}
          {countWins(state)} — {countWins(state, true)}
        </p>
        <Button onClick={handleExit}>Retour à l’arène</Button>
      </div>
    )
  }

  // --- Match en cours --------------------------------------------------------
  return (
    <LiveMatch
      key={state.myRounds.length}
      questions={questions}
      currentRound={state.myRounds.length}
      opponentPresent={state.opponentPresent}
      waitingForOpponent={state.myRounds.length > state.theirRounds.length}
      onRoundDone={(correct, timeMs) =>
        sendRound({ round: state.myRounds.length, correct, timeMs })
      }
      onExit={handleExit}
    />
  )
}

function countWins(
  state: { myRounds: { round: number; correct: number }[]; theirRounds: { round: number; correct: number }[] },
  forThem = false,
): number {
  let mine = 0
  let theirs = 0
  const byRound = new Map(state.theirRounds.map((r) => [r.round, r]))
  for (const m of state.myRounds) {
    const t = byRound.get(m.round)
    if (!t) continue
    if (m.correct >= t.correct) mine += 1
    else theirs += 1
  }
  return forThem ? theirs : mine
}

// Une manche de ROUND_SIZE questions : on répond, on chronomètre, on déclare.
function LiveMatch({
  questions,
  currentRound,
  opponentPresent,
  waitingForOpponent,
  onRoundDone,
  onExit,
}: {
  questions: ModeQuestion[]
  currentRound: number
  opponentPresent: boolean
  waitingForOpponent: boolean
  onRoundDone: (correct: number, timeMs: number) => void
  onExit: () => void
}) {
  // Le composant est remonté à chaque manche (key={currentRound}) : l'état
  // repart donc à zéro naturellement, sans effet de réinitialisation.
  const start = currentRound * ROUND_SIZE
  const roundQuestions = questions.slice(start, start + ROUND_SIZE)
  const [index, setIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [startedAt] = useState(() => nowMs())
  const [answered, setAnswered] = useState(false)

  if (questions.length === 0) return <Centered>Chargement des questions…</Centered>

  if (waitingForOpponent) {
    return (
      <Centered>
        <Loader2 className="text-primary mb-2 size-6 animate-spin" aria-hidden="true" />
        En attente de la manche du rival…
      </Centered>
    )
  }

  const q = roundQuestions[index]
  if (!q) return <Centered>Manche terminée…</Centered>

  const answer = (choice: number) => {
    if (answered) return
    setAnswered(true)
    const isCorrect = choice === q.correctIndex
    const nextCorrect = correct + (isCorrect ? 1 : 0)
    setCorrect(nextCorrect)
    setTimeout(() => {
      if (index + 1 >= roundQuestions.length) {
        onRoundDone(nextCorrect, Math.round(nowMs() - startedAt))
      } else {
        setIndex(index + 1)
        setAnswered(false)
      }
    }, 350)
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 p-4">
      <div className="text-muted-foreground flex items-center justify-between text-xs">
        <span>
          Manche {currentRound + 1} · Question {index + 1}/{roundQuestions.length}
        </span>
        <span className="flex items-center gap-1">
          {opponentPresent ? (
            <Wifi className="size-3 text-green-600" aria-hidden="true" />
          ) : (
            <WifiOff className="text-destructive size-3" aria-hidden="true" />
          )}
          {opponentPresent ? 'Rival connecté' : 'Rival déconnecté'}
        </span>
      </div>

      <p className="font-medium">{q.prompt}</p>
      <div className="flex flex-col gap-2">
        {q.options.map((opt, i) => (
          <button
            key={i}
            type="button"
            disabled={answered}
            onClick={() => answer(i)}
            className={`rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
              answered && i === q.correctIndex
                ? 'border-green-500 bg-green-50'
                : 'hover:border-primary/50'
            } disabled:cursor-default`}
          >
            {opt}
          </button>
        ))}
      </div>
      <Button variant="ghost" size="sm" onClick={onExit} className="self-start">
        Abandonner
      </Button>
    </div>
  )
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-muted-foreground flex min-h-40 flex-col items-center justify-center gap-1 p-6 text-center text-sm">
      {children}
    </div>
  )
}
