'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Bot, Copy, Loader2, Swords, Trophy, Wifi, WifiOff, Zap } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useLiveDuel } from '@/components/useLiveDuel'
import DuelMode from '@/components/DuelMode'
import { recordChallenge } from '@/app/defi/actions'
import {
  ROUND_SIZE,
  nowMs,
  duelScore,
  type ModeQuestion,
} from '@/lib/defi-modes'
import { mergeRounds } from '@/lib/duel-live'
import { permuteQuizOptions } from '@/lib/quiz-shuffle'

// Démarrage automatique (partie rapide par QR code) : 'create' crée la
// session dès le montage (l'hôte affiche son QR), 'join' rejoint directement
// la session scannée. Sans `auto`, le lobby classique s'affiche.
export type LiveDuelAutoStart =
  | { kind: 'create' }
  | { kind: 'join'; duelId: string }

type Props = {
  userId: string
  pool: ModeQuestion[] // questions de l'hôte (partagées avec le rival)
  subject?: string | null
  // Niveau du joueur : calibre le bot d'entraînement (repli solo). Défaut 1.
  myLevel?: number
  auto?: LiveDuelAutoStart
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
export default function LiveDuelMode({
  userId,
  pool,
  subject,
  myLevel = 1,
  auto,
  onExit,
}: Props) {
  const { state, create, join, sendRound, persist, leave } = useLiveDuel(userId)
  const [joinCode, setJoinCode] = useState('')
  // Repli solo : on affronte un bot (duel BO3 contre un rival simulé). Rendu par
  // DuelMode, qui porte déjà l'écran VS, les sons, l'XP et la file « À revoir ».
  const [botMode, setBotMode] = useState(false)
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

  // Partie rapide (QR) : on saute le lobby — création ou rejointe immédiate.
  // Une seule fois par montage, même si les deps bougent ensuite.
  const autoStartedRef = useRef(false)
  useEffect(() => {
    if (!auto || autoStartedRef.current) return
    autoStartedRef.current = true
    if (auto.kind === 'create') {
      create(subject ?? 'Duel', pool.map((q) => q.id))
    } else {
      join(auto.duelId)
    }
  }, [auto, create, join, pool, subject])

  // Persiste les manches en fin de duel (historique) ET crédite l'XP : un vrai
  // duel en direct gagné rapportait 0 XP (le serveur recalcule sur score/total
  // réels). Garde one-shot : le `winner` ne bascule qu'une fois, mais l'effet
  // pouvait rejouer si `myRounds`/`persist` changeaient d'identité.
  const recordedRef = useRef(false)
  useEffect(() => {
    if (!state.winner || !state.duelId) return
    persist(state.duelId, state.myRounds)
    if (recordedRef.current) return
    recordedRef.current = true
    const answered = state.myRounds.length * ROUND_SIZE
    const correct = state.myRounds.reduce((s, r) => s + r.correct, 0)
    recordChallenge(correct, answered, 'duel').catch(() => {})
  }, [state.winner, state.duelId, state.myRounds, persist])

  // --- Repli solo : duel contre un bot ---------------------------------------
  if (botMode) {
    return (
      <DuelMode
        pool={pool}
        myLevel={myLevel}
        ghosts={[]}
        onExit={handleExit}
      />
    )
  }

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
        {/* Personne sous la main ? On s'entraîne tout de suite contre un bot —
            même format BO3, mais sans attendre un 2e joueur en ligne. */}
        <Button
          variant="secondary"
          onClick={() => setBotMode(true)}
          disabled={pool.length < ROUND_SIZE}
        >
          <Bot className="size-4" aria-hidden="true" /> Défier un bot
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

  // --- Attente du rival : le QR code façon « Partie rapide » ------------------
  // Scanner le QR (appareil photo du téléphone) ouvre l'app directement sur
  // /defi/duel-rapide?rejoindre=<id> → le match démarre instantanément.
  if (state.phase === 'waiting') {
    const joinUrl =
      state.duelId && typeof window !== 'undefined'
        ? `${window.location.origin}/defi/duel-rapide?rejoindre=${state.duelId}`
        : null
    return (
      <div className="mx-auto w-full max-w-md p-4">
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-[oklch(0.75_0.1_255)]/60 bg-gradient-to-b from-[oklch(0.58_0.15_255)] to-[oklch(0.46_0.16_262)] p-6 text-center shadow-[0_20px_45px_-18px_oklch(0.4_0.16_260)]">
          <h3 className="font-heading flex items-center gap-2 text-xl font-extrabold text-white">
            <Zap className="size-5 text-highlight" aria-hidden="true" />
            Duel en direct
          </h3>

          {joinUrl ? (
            <div className="rounded-2xl bg-white p-3 shadow-inner">
              <QRCodeSVG
                value={joinUrl}
                size={208}
                marginSize={1}
                fgColor="#1c2a4a"
                bgColor="#ffffff"
                aria-label="QR code de la partie — à faire scanner par ton adversaire"
              />
            </div>
          ) : (
            <Loader2
              className="size-8 animate-spin text-white"
              aria-hidden="true"
            />
          )}

          <p className="text-sm font-semibold text-white/90">
            Si quelqu’un scanne ce code, il commence instantanément un match
            contre toi !
          </p>
          <p className="text-xs font-medium text-white/70">
            Le code est valable tant que cette fenêtre est ouverte.
          </p>

          <button
            type="button"
            aria-label="Copier le code du duel"
            onClick={async () => {
              if (state.duelId) {
                await navigator.clipboard?.writeText(state.duelId)
                setCopied(true)
              }
            }}
            className="flex max-w-full items-center gap-2 rounded-xl bg-white/15 px-4 py-2 font-mono text-xs break-all text-white"
          >
            <Copy className="size-4 shrink-0" aria-hidden="true" />
            {state.duelId}
          </button>
          {copied ? (
            <span className="text-xs font-bold text-highlight">Copié !</span>
          ) : null}

          <Button
            variant="ghost"
            onClick={handleExit}
            className="text-white hover:bg-white/10 hover:text-white"
          >
            Annuler
          </Button>
        </div>
      </div>
    )
  }

  // --- Résultat --------------------------------------------------------------
  if (state.winner) {
    const iWon = state.winner === 'me'
    // Décompte des manches via la MÊME logique que le vainqueur (départage à
    // l'égalité de bonnes réponses par le temps) — sinon l'affichage pouvait
    // contredire le titre « Victoire/Défaite ».
    const score = duelScore(mergeRounds(state.myRounds, state.theirRounds))
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
          Manches gagnées : {score.me} — {score.them}
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
  // Verrou synchrone anti-double-tap : la garde `answered` (state) est en retard
  // d'un rendu, donc deux taps rapprochés la franchissent tous deux. Sur la
  // dernière question d'une manche, cela appellerait `onRoundDone` (→ sendRound)
  // DEUX fois avec le même numéro de manche → risque de désync du duel. Purement
  // défensif (aucun changement de sync). Relâché au changement d'`index`.
  const advancingRef = useRef(false)
  useEffect(() => {
    advancingRef.current = false
  }, [index])

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
    if (answered || advancingRef.current) return
    advancingRef.current = true
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
