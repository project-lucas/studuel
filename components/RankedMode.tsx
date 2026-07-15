'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import {
  Check,
  X,
  ChevronRight,
  Trophy,
  TrendingUp,
  TrendingDown,
  PartyPopper,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import DefiTimer from '@/components/DefiTimer'
import { recordChallenge, recordRankedMatch } from '@/app/defi/actions'
import { recordReviewAnswers } from '@/app/reviser/actions'
import type { ReviewAnswer } from '@/lib/srs'
import {
  ARENA_IMAGE,
  ROUND_SIZE,
  duelScore,
  duelWinner,
  ghostRound,
  nowMs,
  roundWinner,
  type ModeQuestion,
  type RoundResult,
} from '@/lib/defi-modes'
import {
  arenaFor,
  friendsPassed,
  friendsLostTo,
  matchmakeOpponentTrophies,
  type RankPlayer,
} from '@/lib/trophies'

const PLAYER_AVATAR = '/images/mascotte/flamme-2-vive.webp'

// Adversaires du classement : des bots à l'identité stable, tirés par la graine
// du match (même graine → même rival). Noms « scolaires » clin d'œil.
const RANKED_BOTS: { name: string; emoji: string }[] = [
  { name: 'Maxou', emoji: '🐙' },
  { name: 'BrainZ', emoji: '🧠' },
  { name: 'La Taupe', emoji: '🦡' },
  { name: 'Klara', emoji: '🦩' },
  { name: 'Néo', emoji: '🐲' },
  { name: 'Zébulon', emoji: '🦓' },
  { name: 'Iris', emoji: '🦚' },
  { name: 'Panda07', emoji: '🐼' },
  { name: 'Sensei', emoji: '🥷' },
  { name: 'Vortex', emoji: '🌀' },
]

function botFor(seed: string): { name: string; emoji: string } {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return RANKED_BOTS[h % RANKED_BOTS.length]
}

// Le décor d'arène derrière un contenu : image + voile de lisibilité.
function ArenaBackdrop() {
  return (
    <>
      <Image
        src={ARENA_IMAGE}
        alt=""
        aria-hidden="true"
        fill
        sizes="(max-width: 640px) 100vw, 640px"
        className="object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/70"
      />
    </>
  )
}

type Phase = 'vs' | 'playing' | 'reveal' | 'done'

type RankedResult = {
  before: number
  after: number
  delta: number
  best: number
} | null

// MODE CLASSÉ — le cœur compétitif du Défi. On est matché contre un rival
// proche en trophées, on joue un BO3, et le résultat FAIT BOUGER les trophées
// (barème recalculé côté serveur). L'écran de fin annonce le gain/la perte et,
// surtout, les amis que l'on vient de doubler.
export default function RankedMode({
  pool,
  myTrophies,
  friends = [],
  onExit,
  onResult,
}: {
  pool: ModeQuestion[]
  myTrophies: number
  friends?: RankPlayer[]
  onExit: () => void
  onResult?: (after: number) => void
}) {
  // Graine du match : fixée une fois, elle fige le rival et sa difficulté.
  const [seed] = useState(
    () =>
      `${myTrophies}-${
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : nowMs()
      }`,
  )
  const bot = botFor(seed)
  const oppTrophies = matchmakeOpponentTrophies(myTrophies, seed)
  const myLevel = Math.floor(myTrophies / 150) + 1
  const oppLevel = Math.floor(oppTrophies / 150) + 1

  const [phase, setPhase] = useState<Phase>('vs')
  const [rounds, setRounds] = useState<RoundResult[]>([])
  const [ghostVisible, setGhostVisible] = useState(false)

  const [qIndex, setQIndex] = useState(0)
  const [qInRound, setQInRound] = useState(0)
  const [roundCorrect, setRoundCorrect] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const roundStartRef = useRef(0)

  const [ranked, setRanked] = useState<RankedResult>(null)
  const reviewsRef = useRef<ReviewAnswer[]>([])
  // Timer d'auto-avance / de révélation : annulé au démontage pour qu'un abandon
  // juste après une réponse n'enregistre pas le match classé après coup
  // (XP, trophées, mouvement de classement).
  const advanceTimerRef = useRef<number | null>(null)
  useEffect(
    () => () => {
      if (advanceTimerRef.current) window.clearTimeout(advanceTimerRef.current)
    },
    [],
  )
  // Verrou synchrone anti-double-tap : deux taps rapprochés franchissent sinon
  // la garde `answered` (en retard d'un rendu) → deux timers d'avance armés →
  // une question sautée + une réponse en double (SRS/score de manche). Relâché
  // au prochain `qIndex` (incrémenté à chaque réponse).
  const answerLockRef = useRef(false)
  useEffect(() => {
    answerLockRef.current = false
  }, [qIndex])

  const question = pool.length > 0 ? pool[qIndex % pool.length] : null
  const answered = selected !== null
  const score = duelScore(rounds)
  const winner = duelWinner(rounds)

  const startRound = () => {
    setQInRound(0)
    setRoundCorrect(0)
    setSelected(null)
    roundStartRef.current = nowMs()
  }

  // L'écran VS s'efface tout seul.
  useEffect(() => {
    if (phase !== 'vs') return
    const t = window.setTimeout(() => {
      startRound()
      setPhase('playing')
    }, 2400)
    return () => window.clearTimeout(t)
  }, [phase])

  const answer = (i: number) => {
    if (!question || answered || answerLockRef.current) return
    answerLockRef.current = true
    setSelected(i)
    const good = i === question.correctIndex
    reviewsRef.current.push({
      kind: 'question',
      id: question.id,
      subject: question.subject,
      good,
    })
    if (good) sfx.correct()
    else sfx.wrong()
    const newRoundCorrect = roundCorrect + (good ? 1 : 0)
    setRoundCorrect(newRoundCorrect)

    advanceTimerRef.current = window.setTimeout(() => {
      setQIndex((n) => n + 1)
      setSelected(null)
      if (qInRound + 1 >= ROUND_SIZE) {
        endRound(newRoundCorrect)
      } else {
        setQInRound((n) => n + 1)
      }
    }, 650)
  }

  const endRound = (correct: number) => {
    const ghost = ghostRound(seed, rounds.length, oppLevel, myLevel)
    const result: RoundResult = {
      me: correct,
      them: ghost.correct,
      myTimeMs: nowMs() - roundStartRef.current,
      theirTimeMs: ghost.timeMs,
    }
    const newRounds = [...rounds, result]
    setRounds(newRounds)
    setGhostVisible(false)
    setPhase('reveal')
    advanceTimerRef.current = window.setTimeout(() => {
      setGhostVisible(true)
      const w = duelWinner(newRounds)
      if (w) {
        finishMatch(w === 'me', newRounds)
      } else if (roundWinner(result) === 'me') {
        sfx.dayComplete()
      } else {
        sfx.wrong()
      }
    }, 1300)
  }

  const finishMatch = (iWon: boolean, newRounds: RoundResult[]) => {
    if (iWon) sfx.complete()
    else sfx.wrong()
    const answeredCount = newRounds.length * ROUND_SIZE
    const correctCount = newRounds.reduce((s, r) => s + r.me, 0)
    // XP du défi (barème serveur) — un match classé reste une session d'entraînement.
    recordChallenge(correctCount, answeredCount, 'duel').catch(() => {})
    recordReviewAnswers(reviewsRef.current).catch(() => {})
    // Le résultat classé : trophées recalculés et persistés côté serveur.
    recordRankedMatch(iWon, seed, bot.name)
      .then((r) => {
        setRanked(r)
        if (r && onResult) onResult(r.after)
      })
      .catch(() => setRanked(null))
  }

  // -------------------------------------------------------- entrée en scène
  if (phase === 'vs') {
    return (
      <div className="relative mx-auto flex min-h-[68vh] max-w-xl flex-col items-center justify-center overflow-hidden rounded-3xl p-6 text-center text-white shadow-lg">
        <ArenaBackdrop />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-tr from-highlight/60 via-highlight/20 to-transparent"
          style={{ clipPath: 'polygon(0 0, 58% 0, 42% 100%, 0 100%)' }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-bl from-primary/70 via-primary/25 to-transparent"
          style={{ clipPath: 'polygon(58% 0, 100% 0, 100% 100%, 42% 100%)' }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-white/60"
          style={{ clipPath: 'polygon(57.7% 0, 58.3% 0, 42.3% 100%, 41.7% 100%)' }}
        />
        <div className="relative flex w-full flex-col items-center gap-7">
          <p className="pop-in flex items-center gap-1.5 rounded-full bg-highlight px-3 py-1 text-[11px] font-extrabold tracking-widest text-foreground uppercase">
            <Trophy className="size-3.5" aria-hidden="true" /> Match classé
          </p>
          <div className="flex w-full items-stretch justify-evenly gap-2">
            <div className="animate-in slide-in-from-left-8 fade-in flex flex-col items-center gap-2 duration-500">
              <Image
                src={PLAYER_AVATAR}
                alt=""
                aria-hidden="true"
                width={96}
                height={96}
                className="flame-breathe size-24 object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
              />
              <span className="font-heading text-lg font-extrabold italic uppercase">
                Toi
              </span>
              <span className="flex items-center gap-1 font-mono text-xs font-bold text-highlight tabular-nums">
                <Trophy className="size-3" aria-hidden="true" /> {myTrophies}
              </span>
            </div>
            <span
              aria-hidden="true"
              className="pop-spring self-center font-heading text-6xl font-extrabold text-highlight italic drop-shadow-[0_4px_0_rgba(0,0,0,0.45)]"
              style={{ animationDelay: '350ms' }}
            >
              VS
            </span>
            <div className="animate-in slide-in-from-right-8 fade-in flex flex-col items-center gap-2 duration-500">
              <span
                aria-hidden="true"
                className="flex size-24 items-center justify-center text-7xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
              >
                {bot.emoji}
              </span>
              <span className="font-heading text-lg font-extrabold italic uppercase">
                {bot.name}
              </span>
              <span className="flex items-center gap-1 font-mono text-xs font-bold text-white/80 tabular-nums">
                <Trophy className="size-3" aria-hidden="true" /> {oppTrophies}
              </span>
            </div>
          </div>
          <p role="status" className="text-sm font-semibold text-white/85">
            Recherche d’un adversaire à ta taille…
          </p>
        </div>
      </div>
    )
  }

  const scoreboard = (
    <div className="flex w-full items-center justify-between gap-2 rounded-2xl border bg-card px-3 py-2 shadow-sm">
      <span className="flex min-w-0 flex-1 items-center gap-1.5">
        <Image
          src={PLAYER_AVATAR}
          alt=""
          aria-hidden="true"
          width={28}
          height={28}
          className="size-7 shrink-0 object-contain"
        />
        <span className="truncate text-sm font-semibold">Toi</span>
      </span>
      <span className="flex shrink-0 items-center gap-2">
        <span
          className="flex gap-1"
          role="img"
          aria-label={`Toi : ${score.me} manche${score.me > 1 ? 's' : ''} sur 2`}
        >
          {[0, 1].map((i) => (
            <span
              key={i}
              className={cn(
                'size-1.5 rounded-full',
                i < score.me ? 'bg-highlight' : 'bg-muted',
              )}
            />
          ))}
        </span>
        <span
          key={`${score.me}-${score.them}`}
          className="pop-spring -skew-x-6 rounded-lg bg-primary px-2.5 py-0.5 font-mono text-sm font-bold text-primary-foreground tabular-nums shadow-sm"
        >
          <span className="inline-block skew-x-6">
            {score.me} — {score.them}
          </span>
        </span>
        <span
          className="flex gap-1"
          role="img"
          aria-label={`${bot.name} : ${score.them} manche${score.them > 1 ? 's' : ''} sur 2`}
        >
          {[0, 1].map((i) => (
            <span
              key={i}
              className={cn(
                'size-1.5 rounded-full',
                i < score.them ? 'bg-primary' : 'bg-muted',
              )}
            />
          ))}
        </span>
      </span>
      <span className="flex min-w-0 flex-1 items-center justify-end gap-1.5">
        <span aria-hidden="true" className="text-xl leading-none">
          {bot.emoji}
        </span>
        <span className="truncate text-sm font-semibold">{bot.name}</span>
      </span>
    </div>
  )

  // ------------------------------------------------------------------ manche
  if (phase === 'playing') {
    if (!question) return null
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-3">
        <DefiTimer />
        {scoreboard}
        <div className="flex items-center justify-between text-sm text-white/75">
          <span className="font-semibold text-white">
            Manche {rounds.length + 1}
          </span>
          <span className="font-mono tabular-nums">
            {qInRound + 1}/{ROUND_SIZE}
          </span>
        </div>
        <div
          className="h-2 w-full overflow-hidden rounded-full bg-white/20"
          role="progressbar"
          aria-label="Progression de la manche"
          aria-valuemin={0}
          aria-valuemax={ROUND_SIZE}
          aria-valuenow={qInRound}
          aria-valuetext={`Question ${qInRound + 1} sur ${ROUND_SIZE}`}
        >
          <div
            className="h-full rounded-full bg-highlight transition-all"
            style={{ width: `${(qInRound / ROUND_SIZE) * 100}%` }}
          />
        </div>

        {question.subject ? (
          <p className="text-xs font-semibold text-white/70 uppercase">
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
                onClick={() => answer(i)}
                className={cn(
                  'flex items-center justify-between gap-3 rounded-2xl border bg-card px-4 py-3 text-left text-sm font-medium transition-all',
                  !answered &&
                    'hover:border-primary/40 hover:bg-accent hover:text-accent-foreground active:scale-[0.99]',
                  answered &&
                    isCorrect &&
                    'border-green-600 bg-green-50 text-green-700',
                  answered &&
                    isSelected &&
                    !isCorrect &&
                    'border-destructive bg-red-50 text-destructive',
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
        </div>

        <p role="status" aria-live="polite" className="sr-only">
          {answered
            ? selected === question.correctIndex
              ? 'Bonne réponse'
              : 'Mauvaise réponse'
            : ''}
        </p>

        <button
          type="button"
          onClick={onExit}
          className="mt-2 self-center text-sm text-white/70 underline-offset-4 hover:underline"
        >
          Abandonner (défaite)
        </button>
      </div>
    )
  }

  // -------------------------------------------------- révélation de la manche
  if (phase === 'reveal') {
    const last = rounds[rounds.length - 1]
    const iWon = roundWinner(last) === 'me'
    const done = winner !== null
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-5 pt-6 text-center">
        {scoreboard}

        {!ghostVisible ? (
          <div className="relative flex w-full flex-col items-center gap-3 overflow-hidden rounded-3xl px-6 py-12 text-white shadow-lg">
            <ArenaBackdrop />
            <span className="relative animate-bounce text-5xl">{bot.emoji}</span>
            <p role="status" className="relative text-sm font-semibold text-white/90">
              {bot.name} joue sa manche…
            </p>
          </div>
        ) : done ? (
          <RankedDone
            botName={bot.name}
            botEmoji={bot.emoji}
            score={score}
            iWon={winner === 'me'}
            ranked={ranked}
            friends={friends}
            onExit={onExit}
          />
        ) : (
          <>
            <div className="animate-in zoom-in duration-300">
              <p className="text-xs font-bold tracking-wide text-white/70 uppercase">
                Manche {rounds.length}
              </p>
              <p className="font-heading mt-1 text-3xl font-bold text-white">
                {iWon ? 'Manche gagnée !' : 'Manche perdue'}
              </p>
              <p className="mt-2 font-mono text-xl font-bold text-white tabular-nums">
                {last.me} — {last.them}
              </p>
              {last.me === last.them ? (
                <p className="mt-1 text-xs text-white/70">
                  Égalité — départagée à la vitesse{' '}
                  {iWon ? '· plus rapide ⚡' : `· ${bot.name} plus rapide`}
                </p>
              ) : null}
            </div>
            <Button size="lg" onClick={() => { startRound(); setPhase('playing') }}>
              Manche {rounds.length + 1} <ChevronRight className="size-4" />
            </Button>
          </>
        )}
      </div>
    )
  }

  return null
}

// Écran de fin classé — le total de trophées grimpe (ou chute), le delta
// s'affiche, et l'app crie « tu as doublé Léa ! ».
function RankedDone({
  botName,
  botEmoji,
  score,
  iWon,
  ranked,
  friends,
  onExit,
}: {
  botName: string
  botEmoji: string
  score: { me: number; them: number }
  iWon: boolean
  ranked: RankedResult
  friends: RankPlayer[]
  onExit: () => void
}) {
  useEffect(() => {
    document.getElementById('ranked-result')?.focus()
  }, [])

  const passed = ranked ? friendsPassed(ranked.before, ranked.after, friends) : []
  const lost = ranked ? friendsLostTo(ranked.before, ranked.after, friends) : []
  const arena = arenaFor(ranked?.after ?? 0)
  const crossedArena =
    ranked && arenaFor(ranked.before).id !== arenaFor(ranked.after).id

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4">
      <div
        id="ranked-result"
        tabIndex={-1}
        className={cn(
          'animate-in zoom-in relative w-full overflow-hidden rounded-2xl p-6 text-center text-white shadow-lg outline-none duration-500',
          iWon && 'ring-2 ring-highlight',
        )}
      >
        <ArenaBackdrop />
        <div className="relative">
          <p className="text-[11px] font-bold tracking-widest text-white/75 uppercase">
            Match classé · vs {botName}
          </p>
          <p className="font-heading mt-2 text-4xl font-bold italic">
            {iWon ? 'VICTOIRE !' : 'DÉFAITE'}
          </p>
          <div className="mt-3 flex items-center justify-center gap-6">
            <div>
              <p className="font-mono text-3xl font-bold tabular-nums">{score.me}</p>
              <p className="text-xs text-white/75">Toi</p>
            </div>
            <span className="text-2xl font-bold text-white/60">—</span>
            <div>
              <p className="font-mono text-3xl font-bold tabular-nums">{score.them}</p>
              <p className="text-xs text-white/75">
                {botEmoji} {botName}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Le compteur de trophées : grimpe (ou chute) sous les yeux. */}
      {ranked ? (
        <div className="flex w-full flex-col items-center gap-2">
          <div className="flex items-center gap-2 rounded-full bg-highlight px-6 py-3 font-mono text-3xl font-bold text-foreground shadow-lg tabular-nums">
            <Trophy className="size-6" aria-hidden="true" />
            <TrophyCounter from={ranked.before} to={ranked.after} />
          </div>
          <span
            className={cn(
              'flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold',
              ranked.delta >= 0
                ? 'bg-green-500/20 text-green-200'
                : 'bg-destructive/20 text-red-200',
            )}
          >
            {ranked.delta >= 0 ? (
              <TrendingUp className="size-4" aria-hidden="true" />
            ) : (
              <TrendingDown className="size-4" aria-hidden="true" />
            )}
            {ranked.delta >= 0 ? '+' : ''}
            {ranked.delta} trophées
          </span>
        </div>
      ) : (
        <p className="text-sm text-white/75">
          Trophées non enregistrés (connecte-toi pour grimper au classement).
        </p>
      )}

      {/* Franchissement d'arène : le vrai palier. */}
      {crossedArena && ranked && ranked.delta >= 0 ? (
        <p className="animate-in fade-in flex items-center gap-1.5 rounded-2xl bg-white/10 px-4 py-2 text-sm font-bold text-white ring-1 ring-highlight/50 duration-700">
          <span aria-hidden="true" className="text-lg">{arena.emoji}</span>
          Nouvelle arène : {arena.name} !
        </p>
      ) : null}

      {/* Amis doublés — le shot de dopamine social. */}
      {passed.length > 0 ? (
        <p className="animate-in slide-in-from-bottom-2 flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-md duration-500">
          <PartyPopper className="size-4 shrink-0 text-highlight" aria-hidden="true" />
          {passed.length === 1
            ? `Tu viens de doubler ${passed[0].name} !`
            : `Tu doubles ${passed.length} amis d'un coup !`}
        </p>
      ) : null}
      {lost.length > 0 ? (
        <p className="text-sm text-white/80">
          {lost[0].name} repasse devant toi — reprends ta place au prochain match.
        </p>
      ) : null}

      <div className="flex w-full flex-col gap-2">
        <Button size="lg" onClick={onExit} className="press-3d-deep">
          <Trophy className="size-4" /> Continuer
        </Button>
      </div>
    </div>
  )
}

// Compteur de trophées animé : monté avec `from`, il grimpe (ou chute) vers
// `to`. L'état s'initialise à `from` et n'est mis à jour que dans le callback
// de l'intervalle (aucun setState synchrone dans le corps de l'effet).
function TrophyCounter({ from, to }: { from: number; to: number }) {
  const [shown, setShown] = useState(from)
  useEffect(() => {
    const steps = 22
    let n = 0
    const id = window.setInterval(() => {
      n += 1
      setShown(Math.round(from + ((to - from) * n) / steps))
      if (n >= steps) {
        setShown(to)
        window.clearInterval(id)
      }
    }, 32)
    return () => window.clearInterval(id)
  }, [from, to])
  return <>{shown}</>
}
