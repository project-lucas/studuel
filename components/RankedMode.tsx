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
import { recordChallenge, recordDuelResult, recordRankedMatch } from '@/app/defi/actions'
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
  friendsPassed,
  friendsLostTo,
  matchmakeOpponentTrophies,
  type RankPlayer,
} from '@/lib/trophies'
import { rankFor } from '@/lib/rank'
import { rankPalier } from '@/lib/palier'
import PalierCelebration from '@/components/PalierCelebration'

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

// L'entrée en scène du match, en trois temps. Elle ne « charge » pas : elle
// raconte. On cherche (l'adversaire défile, masqué), on verrouille (il s'abat,
// l'onde de choc part du VS), on démarre (3·2·1).
type MatchStep = 'searching' | 'locked' | 'countdown'

const SEARCH_MS = 1100
const LOCK_MS = 800
const COUNT_MS = 400
const COUNTDOWN = ['3', '2', '1']
// Cadence du défilement des candidats pendant la recherche.
const SPIN_MS = 90

// Les lettres des réponses (A, B, C…) : un repère de lecture stable, comme sur
// un vrai sujet — et une cible de tap plus grande que le seul texte.
const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

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
  const [step, setStep] = useState<MatchStep>('searching')
  const [countIndex, setCountIndex] = useState(0)
  // Compteur du défilement des candidats (l'adversaire encore masqué).
  const [spin, setSpin] = useState(0)
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

  // Défilement des candidats tant qu'on « cherche » : l'adversaire réel est déjà
  // tiré (la graine le fige), mais on ne le montre qu'au verrouillage — sinon
  // la recherche est un mensonge visible dès la première frame.
  useEffect(() => {
    if (phase !== 'vs' || step !== 'searching') return
    const id = window.setInterval(() => setSpin((n) => n + 1), SPIN_MS)
    return () => window.clearInterval(id)
  }, [phase, step])

  // La chronologie de l'entrée en scène : recherche → verrouillage → 3·2·1 →
  // première manche. Tous les minuteurs sont annulés au démontage (abandon
  // pendant l'intro).
  useEffect(() => {
    if (phase !== 'vs') return
    const lockAt = SEARCH_MS
    const countAt = SEARCH_MS + LOCK_MS
    const timers = [
      window.setTimeout(() => {
        sfx.tap()
        setStep('locked')
      }, lockAt),
      window.setTimeout(() => setStep('countdown'), countAt),
      ...COUNTDOWN.map((_, i) =>
        window.setTimeout(() => setCountIndex(i), countAt + i * COUNT_MS),
      ),
      window.setTimeout(
        () => {
          startRound()
          setPhase('playing')
        },
        countAt + COUNTDOWN.length * COUNT_MS,
      ),
    ]
    // startRound ne lit que des setters (stables) : la chronologie ne se rejoue
    // que sur un changement de phase.
    return () => timers.forEach((t) => window.clearTimeout(t))
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
    // Bilan V/D + monnaie de victoire : le classé compte AUSSI au bilan (en plus
    // des trophées, versés par recordRankedMatch juste après).
    recordDuelResult(iWon).catch(() => {})
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
    const searching = step === 'searching'
    // Le candidat affiché tant qu'on cherche : il défile, le vrai adversaire
    // n'apparaît qu'au verrouillage.
    const shown = searching ? RANKED_BOTS[spin % RANKED_BOTS.length] : bot

    return (
      <div className="relative mx-auto flex min-h-[68vh] max-w-xl flex-col items-center justify-center overflow-hidden rounded-3xl p-6 text-center text-white shadow-lg">
        <ArenaBackdrop />
        {/* Les deux camps, séparés par la diagonale de lumière. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-tr from-highlight/60 via-highlight/20 to-transparent"
          style={{ clipPath: 'polygon(0 0, 58% 0, 42% 100%, 0 100%)' }}
        />
        <div
          aria-hidden="true"
          className={cn(
            'absolute inset-0 transition-colors duration-500',
            searching
              ? 'bg-gradient-to-bl from-black/75 via-black/60 to-black/45'
              : 'bg-gradient-to-bl from-primary/70 via-primary/25 to-transparent',
          )}
          style={{ clipPath: 'polygon(58% 0, 100% 0, 100% 100%, 42% 100%)' }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-white/60"
          style={{ clipPath: 'polygon(57.7% 0, 58.3% 0, 42.3% 100%, 41.7% 100%)' }}
        />
        {/* Balayage radar sur le camp adverse, tant que la recherche court. */}
        {searching ? (
          <div
            aria-hidden="true"
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: 'polygon(58% 0, 100% 0, 100% 100%, 42% 100%)' }}
          >
            <div className="rk-scan absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-highlight/45 to-transparent" />
          </div>
        ) : null}
        {/* Flash blanc au moment où l'adversaire se verrouille. */}
        {step === 'locked' ? (
          <div
            aria-hidden="true"
            className="rk-flash pointer-events-none absolute inset-0 bg-white"
          />
        ) : null}

        <div className="relative flex w-full flex-col items-center gap-6">
          <p className="pop-in flex items-center gap-1.5 rounded-full bg-highlight px-3 py-1 text-[11px] font-extrabold tracking-widest text-foreground uppercase">
            <Trophy className="size-3.5" aria-hidden="true" /> Match classé · 3 manches
          </p>

          <div className="flex w-full items-stretch justify-evenly gap-2">
            {/* Mon camp — présent d'emblée : c'est le repère. */}
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

            {/* Le VS : discret pendant la recherche, il encaisse l'impact au
                verrouillage et lâche son onde de choc. */}
            <span className="relative self-center">
              {!searching ? (
                <span
                  aria-hidden="true"
                  className="rk-shock absolute top-1/2 left-1/2 size-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-highlight"
                />
              ) : null}
              <span
                aria-hidden="true"
                className={cn(
                  'font-heading relative block text-6xl font-extrabold text-highlight italic drop-shadow-[0_4px_0_rgba(0,0,0,0.45)] transition-opacity duration-300',
                  searching ? 'opacity-35' : 'rk-impact opacity-100',
                )}
              >
                VS
              </span>
            </span>

            {/* Le camp adverse : masqué et grisé pendant la recherche (les
                candidats y défilent), il s'abat au verrouillage. */}
            <div
              key={searching ? 'search' : 'locked'}
              className={cn(
                'flex flex-col items-center gap-2',
                searching ? '' : 'rk-slam',
              )}
            >
              <span className="relative flex size-24 items-center justify-center">
                <span
                  aria-hidden="true"
                  className={cn(
                    'text-7xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition',
                    searching && 'brightness-[0.35] grayscale',
                  )}
                >
                  {shown.emoji}
                </span>
                {searching ? (
                  <span
                    aria-hidden="true"
                    className="font-heading absolute inset-0 grid place-items-center text-5xl font-extrabold text-white/85 drop-shadow-[0_3px_6px_rgba(0,0,0,0.6)]"
                  >
                    ?
                  </span>
                ) : null}
              </span>
              <span className="font-heading text-lg font-extrabold italic uppercase">
                {searching ? '· · ·' : bot.name}
              </span>
              <span className="flex items-center gap-1 font-mono text-xs font-bold text-white/80 tabular-nums">
                <Trophy className="size-3" aria-hidden="true" />{' '}
                {searching ? '???' : oppTrophies}
              </span>
            </div>
          </div>

          {/* La ligne d'état + la jauge de recherche : on voit le temps passer,
              on ne le subit pas. */}
          <div className="flex w-full max-w-xs flex-col items-center gap-2">
            <p role="status" className="text-sm font-semibold text-white/85">
              {searching
                ? 'Recherche d’un adversaire à ta taille…'
                : `Adversaire trouvé — ${bot.name} !`}
            </p>
            <div
              aria-hidden="true"
              className="h-1.5 w-full overflow-hidden rounded-full bg-white/15"
            >
              <div
                className={cn(
                  'h-full rounded-full bg-highlight',
                  searching ? 'rk-search' : 'w-full',
                )}
              />
            </div>
          </div>
        </div>

        {/* Le compte à rebours, plein cadre par-dessus la scène. */}
        {step === 'countdown' ? (
          <span
            key={countIndex}
            aria-hidden="true"
            className="rk-count font-heading pointer-events-none absolute inset-0 grid place-items-center text-[7rem] leading-none font-extrabold text-white italic drop-shadow-[0_6px_0_rgba(0,0,0,0.5)]"
          >
            {COUNTDOWN[countIndex]}
          </span>
        ) : null}
      </div>
    )
  }

  // Le bandeau de face-à-face : verre fumé (la chrome de l'arène) plutôt qu'une
  // carte blanche posée sur le violet. Les manches gagnées se lisent en gemmes
  // pleines de chaque côté du score, comme les couronnes d'un duel.
  const scoreboard = (
    <div className="olympe-glass flex w-full items-center justify-between gap-2 rounded-2xl px-3 py-2">
      <span className="flex min-w-0 flex-1 items-center gap-1.5">
        <Image
          src={PLAYER_AVATAR}
          alt=""
          aria-hidden="true"
          width={32}
          height={32}
          className="size-8 shrink-0 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
        />
        <span className="font-heading truncate text-sm font-extrabold">Toi</span>
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
                'size-2.5 rounded-full ring-1 ring-black/30',
                i < score.me
                  ? 'bg-highlight shadow-[0_0_8px_color-mix(in_oklch,var(--highlight),transparent_30%)]'
                  : 'bg-white/15',
              )}
            />
          ))}
        </span>
        <span
          key={`${score.me}-${score.them}`}
          className="pop-spring font-heading -skew-x-6 rounded-lg border-2 border-[color:var(--foreground)] bg-highlight px-2.5 py-0.5 text-base font-extrabold text-[color:var(--foreground)] tabular-nums shadow-[0_3px_0_var(--foreground)]"
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
                'size-2.5 rounded-full ring-1 ring-black/30',
                i < score.them ? 'bg-destructive' : 'bg-white/15',
              )}
            />
          ))}
        </span>
      </span>
      <span className="flex min-w-0 flex-1 items-center justify-end gap-1.5">
        <span
          aria-hidden="true"
          className="text-2xl leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
        >
          {bot.emoji}
        </span>
        <span className="font-heading truncate text-sm font-extrabold">
          {bot.name}
        </span>
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
        {/* Manche + avancement en SEGMENTS : on voit d'un coup d'œil combien de
            questions restent, là où une barre lisse ne disait qu'un pourcentage. */}
        <div className="flex items-center gap-3">
          <span className="font-heading shrink-0 text-sm font-extrabold text-white">
            Manche {rounds.length + 1}
          </span>
          <span
            className="flex min-w-0 flex-1 gap-1"
            role="progressbar"
            aria-label="Progression de la manche"
            aria-valuemin={0}
            aria-valuemax={ROUND_SIZE}
            aria-valuenow={qInRound}
            aria-valuetext={`Question ${qInRound + 1} sur ${ROUND_SIZE}`}
          >
            {Array.from({ length: ROUND_SIZE }, (_, i) => (
              <span
                key={i}
                aria-hidden="true"
                className={cn(
                  'h-2 flex-1 rounded-full transition-colors',
                  i < qInRound
                    ? 'bg-highlight'
                    : i === qInRound
                      ? 'bg-highlight/45'
                      : 'bg-white/15',
                )}
              />
            ))}
          </span>
          <span className="font-mono shrink-0 text-xs font-bold text-white/70 tabular-nums">
            {qInRound + 1}/{ROUND_SIZE}
          </span>
        </div>

        {/* La question sur une plaque de marbre : encre sur crème, comme un vrai
            sujet posé sur la table de jeu. Le texte blanc à même le fond violet
            se lisait mal et n'avait aucune présence. */}
        <div className="olympe-marble rounded-3xl px-4 py-4">
          {question.subject ? (
            <p className="font-heading mb-1.5 text-[11px] font-extrabold tracking-widest text-[color:var(--foreground)]/55 uppercase">
              {question.subject}
            </p>
          ) : null}
          <h2 className="font-heading text-xl leading-snug font-extrabold text-balance text-[color:var(--foreground)]">
            {question.prompt}
          </h2>
        </div>

        <div className="flex flex-col gap-2.5">
          {question.options.map((option, i) => {
            const isCorrect = i === question.correctIndex
            const isSelected = i === selected
            const revealGood = answered && isCorrect
            const revealBad = answered && isSelected && !isCorrect
            return (
              <button
                key={i}
                type="button"
                disabled={answered}
                onClick={() => answer(i)}
                className={cn(
                  // Plaque pressable façon arène : contour encre 3px, ombre dure
                  // qui s'écrase au tap. La cible fait toute la largeur.
                  'flex items-center gap-3 rounded-2xl border-[3px] border-[color:var(--foreground)] px-3 py-3 text-left text-[0.95rem] leading-snug font-bold text-[color:var(--foreground)] shadow-[0_4px_0_var(--foreground)] transition-all',
                  !answered &&
                    'bg-[#faf6ef] active:translate-y-[4px] active:shadow-[0_0_0_var(--foreground)]',
                  revealGood && 'bg-[#86efac]',
                  revealBad && 'jeu-secousse bg-[#fca5a5]',
                  answered && !isCorrect && !isSelected && 'bg-[#faf6ef] opacity-40',
                )}
              >
                {/* Lettre de la réponse : repère de lecture + point d'ancrage
                    visuel de la plaque. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    'font-heading grid size-7 shrink-0 place-items-center rounded-lg border-2 border-[color:var(--foreground)] text-xs font-extrabold',
                    revealGood
                      ? 'bg-white'
                      : revealBad
                        ? 'bg-white'
                        : 'bg-highlight',
                  )}
                >
                  {OPTION_LETTERS[i] ?? i + 1}
                </span>
                <span className="min-w-0 flex-1">{option}</span>
                {revealGood ? (
                  <Check className="size-5 shrink-0" strokeWidth={3} />
                ) : null}
                {revealBad ? <X className="size-5 shrink-0" strokeWidth={3} /> : null}
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
  const rank = rankFor(ranked?.after ?? 0)
  const crossedTier =
    ranked && rankFor(ranked.before).tier.id !== rankFor(ranked.after).tier.id
  // Le VRAI palier : bulle de célébration plein écran, partageable (une seule
  // fois par palier — la ligne inline ci-dessous reste en rappel).
  const palier = ranked ? rankPalier(ranked.before, ranked.after) : null

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4">
      {palier ? <PalierCelebration palier={palier} /> : null}
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

      {/* Franchissement de palier de rang : le vrai palier. */}
      {crossedTier && ranked && ranked.delta >= 0 ? (
        <p className="animate-in fade-in flex items-center gap-1.5 rounded-2xl bg-white/10 px-4 py-2 text-sm font-bold text-white ring-1 ring-highlight/50 duration-700">
          <span aria-hidden="true" className="text-lg">{rank.tier.emoji}</span>
          Nouveau palier : {rank.label} !
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
