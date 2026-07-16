'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Swords, Check, X, Trophy, RotateCcw, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import DefiTimer from '@/components/DefiTimer'
import { XP_RULES } from '@/lib/xp'
import { recordChallenge, saveDuelRecording } from '@/app/defi/actions'
import { recordReviewAnswers } from '@/app/reviser/actions'
import type { ReviewAnswer } from '@/lib/srs'
import {
  getMockFriends,
  avatarEmojiFor,
  DUEL_DAY_STORAGE_KEY,
  type Friend,
  type FriendGhost,
} from '@/lib/social'
import { toDayKey } from '@/lib/streak'
import {
  ARENA_IMAGE,
  ROUND_SIZE,
  duelScore,
  duelWinner,
  ghostRoundFrom,
  nowMs,
  roundWinner,
  type ModeQuestion,
  type RecordedRound,
  type RoundResult,
} from '@/lib/defi-modes'

type Phase = 'pick' | 'vs' | 'playing' | 'reveal' | 'done'

// L'avatar du joueur dans l'arène : sa flamme (la mascotte de l'app).
const PLAYER_AVATAR = '/images/mascotte/flamme-2-vive.webp'

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

// Duel BO3 contre le fantôme d'un ami : l'élève joue ses manches maintenant,
// le camp adverse rejoue l'ENREGISTREMENT réel du dernier duel de l'ami
// (duel_recordings) quand il existe — sensation de duel, zéro contrainte de
// présence. Sans enregistrement (pas d'amis, migration pas passée), repli
// sur les rivaux d'entraînement au score simulé, déterministe par duel.
export default function DuelMode({
  pool,
  myLevel,
  ghosts = [],
  srs = true,
  onExit,
}: {
  pool: ModeQuestion[]
  myLevel: number
  ghosts?: FriendGhost[]
  // Les jeux de salon (capitales, orthographe…) posent des questions hors
  // programme : elles ne doivent PAS entrer dans la file « À revoir ».
  srs?: boolean
  onExit: () => void
}) {
  const [phase, setPhase] = useState<Phase>('pick')
  const [opponent, setOpponent] = useState<Friend | null>(null)
  // Clé du duel : fixée au lancement, elle rend le fantôme déterministe
  // pendant toute la partie (re-render compris).
  const [duelKey, setDuelKey] = useState('')
  const [rounds, setRounds] = useState<RoundResult[]>([])
  const [ghostVisible, setGhostVisible] = useState(false)

  // Manche en cours.
  const [qIndex, setQIndex] = useState(0) // curseur global dans le pool (recycle)
  const [qInRound, setQInRound] = useState(0)
  const [roundCorrect, setRoundCorrect] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const roundStartRef = useRef(0)
  // Timer d'auto-avance / de révélation : gardé pour être annulé au démontage,
  // sinon un abandon juste après une réponse enregistre le duel après coup
  // (XP, fantôme, mission du jour).
  const advanceTimerRef = useRef<number | null>(null)

  // Cumul pour l'XP (le serveur recalcule depuis score/total).
  const [totalCorrect, setTotalCorrect] = useState(0)
  const [saved, setSaved] = useState<boolean | null>(null)
  // Réponses du duel pour la répétition espacée (SRS + Revanche).
  const reviewsRef = useRef<ReviewAnswer[]>([])

  // Les vrais fantômes d'abord (c'est LE duel qu'on veut) ; les rivaux
  // d'entraînement complètent la liste.
  const realFriends: Friend[] = ghosts.map((g) => ({
    id: g.id,
    name: g.name,
    emoji: avatarEmojiFor(g.id),
    level: myLevel, // un fantôme réel n'a pas besoin de niveau : il a ses manches
    real: true,
  }))
  const recordingsById = new Map<string, RecordedRound[]>(
    ghosts.map((g) => [g.id, g.rounds]),
  )
  const friends = [...realFriends, ...getMockFriends()]
  const question = pool.length > 0 ? pool[qIndex % pool.length] : null
  const answered = selected !== null
  const score = duelScore(rounds)
  const winner = duelWinner(rounds)

  const startDuel = (friend: Friend) => {
    sfx.flip()
    setOpponent(friend)
    setDuelKey(`${friend.id}-${nowMs()}`)
    setRounds([])
    setTotalCorrect(0)
    setSaved(null)
    reviewsRef.current = []
    setPhase('vs')
  }

  const startRound = () => {
    setQInRound(0)
    setRoundCorrect(0)
    setSelected(null)
    roundStartRef.current = nowMs()
  }

  // L'écran VS s'efface tout seul : l'entrée en scène dure ~2,5 s.
  useEffect(() => {
    if (phase !== 'vs') return
    const t = window.setTimeout(() => {
      startRound()
      setPhase('playing')
    }, 2500)
    return () => window.clearTimeout(t)
  }, [phase])

  // Annule tout timer d'avance/révélation en attente au démontage (abandon).
  useEffect(
    () => () => {
      if (advanceTimerRef.current) window.clearTimeout(advanceTimerRef.current)
    },
    [],
  )
  // Verrou synchrone anti-double-tap : deux taps rapprochés franchissent sinon
  // la garde `answered` (en retard d'un rendu) → deux timers d'avance armés →
  // une question sautée + une réponse en double (SRS/score de manche). Le
  // fantôme étant déterministe/enregistré (pas de sync live), c'est aussi sûr
  // qu'en Classé. Relâché au prochain `qIndex` (incrémenté à chaque réponse).
  const answerLockRef = useRef(false)
  useEffect(() => {
    answerLockRef.current = false
  }, [qIndex])

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
    setTotalCorrect((c) => c + (good ? 1 : 0))

    // Auto-avance : dans un duel, le rythme fait partie du jeu (le temps
    // départage les manches à égalité) — pas de bouton « Suivant ».
    advanceTimerRef.current = window.setTimeout(() => {
      setQIndex((n) => n + 1)
      setSelected(null)
      if (qInRound + 1 >= ROUND_SIZE) {
        endRound(newRoundCorrect)
      } else {
        setQInRound((n) => n + 1)
      }
    }, 700)
  }

  const endRound = (correct: number) => {
    if (!opponent) return
    const ghost = ghostRoundFrom(
      recordingsById.get(opponent.id) ?? null,
      duelKey,
      rounds.length,
      opponent.level,
      myLevel,
    )
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
    // Suspense : l'adversaire « joue » sa manche avant la révélation.
    advanceTimerRef.current = window.setTimeout(() => {
      setGhostVisible(true)
      const w = duelWinner(newRounds)
      if (w) {
        finishDuel(w, newRounds)
      } else if (roundWinner(result) === 'me') {
        sfx.dayComplete()
      } else {
        sfx.wrong()
      }
    }, 1400)
  }

  const finishDuel = (w: 'me' | 'them', newRounds: RoundResult[]) => {
    if (w === 'me') sfx.complete()
    else sfx.wrong()
    // Le duel compte comme mission du jour (mock partagé avec l'onglet Amis).
    try {
      window.localStorage.setItem(DUEL_DAY_STORAGE_KEY, toDayKey(new Date()))
    } catch {
      // stockage indisponible (navigation privée) : le duel reste jouable
    }
    // L'XP est recalculée côté serveur ; on envoie score/total réels.
    const answeredCount = newRounds.length * ROUND_SIZE
    const correctCount = newRounds.reduce((s, r) => s + r.me, 0)
    recordChallenge(correctCount, answeredCount, 'duel')
      .then((r) => setSaved(r.saved))
      .catch(() => setSaved(false))
    // Reprogramme chaque question dans la file « À revoir » — sauf pour les
    // jeux de salon, dont les questions ne vivent pas dans quiz_questions.
    if (srs) recordReviewAnswers(reviewsRef.current).catch(() => {})
    // Mes manches deviennent MON fantôme : mes amis pourront me défier.
    saveDuelRecording(
      newRounds.map((r) => ({ correct: r.me, timeMs: r.myTimeMs })),
    ).catch(() => {})
  }

  // ------------------------------------------------------------------- choix
  if (phase === 'pick') {
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-4">
        <div className="space-y-1 text-center">
          <h1 className="font-heading text-3xl font-bold">Choisis ton rival</h1>
          <p className="text-sm text-muted-foreground">
            Premier à 2 manches gagnées · {ROUND_SIZE} questions par manche
          </p>
        </div>

        <ul className="flex flex-col gap-2.5">
          {friends.map((f, i) => (
            <li key={f.id}>
              <button
                type="button"
                onClick={() => startDuel(f)}
                className="pop-in press-3d flex w-full items-center gap-3 rounded-2xl border bg-card p-3 text-left hover:border-primary/40"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-2xl">
                  {f.emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 font-semibold">
                    {f.name}
                    {f.real ? (
                      <span className="rounded-full bg-primary px-1.5 py-px text-[9px] font-extrabold tracking-wide text-primary-foreground uppercase">
                        Fantôme réel
                      </span>
                    ) : null}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {f.real
                      ? 'Rejoue son vrai dernier duel — bats son enregistrement'
                      : `Niveau ${f.level}${Math.abs(f.level - myLevel) <= 1 ? ' · rival à ta taille' : ''}`}
                  </span>
                </span>
                <Swords className="size-4 shrink-0 text-primary" />
              </button>
            </li>
          ))}
        </ul>

        <Button variant="ghost" onClick={onExit} className="self-center">
          Retour aux modes
        </Button>
      </div>
    )
  }

  if (!opponent) return null

  // -------------------------------------------------------- entrée en scène
  // La couture du clash : l'écran est fendu en diagonale — voile or pour le
  // joueur, voile marine pour le rival — et le VS se tamponne sur la couture.
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
          <p className="pop-in text-[11px] font-bold tracking-widest text-white/80 uppercase">
            Duel · premier à 2 manches
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
              <span className="font-heading text-xl font-extrabold italic uppercase">
                Toi
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
                {opponent.emoji}
              </span>
              <span className="font-heading text-xl font-extrabold italic uppercase">
                {opponent.name}
              </span>
            </div>
          </div>
          <p role="status" className="text-sm font-semibold text-white/85">
            L’arène s’ouvre…
          </p>
        </div>
      </div>
    )
  }

  // Le HUD du duel : les deux camps face à face, le score incliné sur la
  // couture, et les pips BO3 — 2 ronds par camp, remplis manche par manche.
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
          aria-label={`${opponent.name} : ${score.them} manche${score.them > 1 ? 's' : ''} sur 2`}
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
          {opponent.emoji}
        </span>
        <span className="truncate text-sm font-semibold">{opponent.name}</span>
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
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">
            Manche {rounds.length + 1}
          </span>
          <span className="font-mono tabular-nums">
            {qInRound + 1}/{ROUND_SIZE}
          </span>
        </div>
        <div
          className="h-2 w-full overflow-hidden rounded-full bg-muted"
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
          <p className="text-xs font-semibold text-muted-foreground uppercase">
            {question.subject}
          </p>
        ) : null}

        <h2 className="font-heading mb-1 text-xl font-bold text-balance">
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
          className="mt-2 self-center text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          Abandonner le duel
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
            <span className="relative animate-bounce text-5xl">
              {opponent.emoji}
            </span>
            <p role="status" className="relative text-sm font-semibold text-white/90">
              {opponent.name} joue sa manche…
            </p>
          </div>
        ) : done ? (
          <DuelDone
            opponent={opponent}
            score={score}
            iWon={winner === 'me'}
            totalCorrect={totalCorrect}
            saved={saved}
            onRematch={() => startDuel(opponent)}
            onExit={onExit}
          />
        ) : (
          <>
            <div className="animate-in zoom-in duration-300">
              <p className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
                Manche {rounds.length}
              </p>
              <p className="font-heading mt-1 text-3xl font-bold">
                {iWon ? 'Manche gagnée !' : 'Manche perdue'}
              </p>
              <p className="mt-2 font-mono text-xl font-bold tabular-nums">
                {last.me} — {last.them}
              </p>
              {last.me === last.them ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  Égalité — départagée à la vitesse{' '}
                  {iWon ? '· tu as été plus rapide ⚡' : `· ${opponent.name} a été plus rapide`}
                </p>
              ) : null}
            </div>

            <p className="text-sm text-muted-foreground">
              {iWon
                ? score.me === 1
                  ? `Plus qu'une manche pour battre ${opponent.name} !`
                  : 'La balle de match est pour toi.'
                : `Rien n'est perdu — remporte les 2 prochaines manches.`}
            </p>

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

// Écran de fin de duel — victoire ou défaite, XP et revanche en un tap.
function DuelDone({
  opponent,
  score,
  iWon,
  totalCorrect,
  saved,
  onRematch,
  onExit,
}: {
  opponent: Friend
  score: { me: number; them: number }
  iWon: boolean
  totalCorrect: number
  saved: boolean | null
  onRematch: () => void
  onExit: () => void
}) {
  const xp = totalCorrect * XP_RULES.challengePerCorrect + XP_RULES.challengeBonus

  // Le retour au calme sonore/visuel : focus sur la carte de résultat.
  useEffect(() => {
    document.getElementById('duel-result')?.focus()
  }, [])

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4">
      <div
        id="duel-result"
        tabIndex={-1}
        className={cn(
          'animate-in zoom-in relative w-full overflow-hidden rounded-2xl p-6 text-center text-white shadow-lg outline-none duration-500',
          iWon && 'ring-2 ring-highlight',
        )}
      >
        <ArenaBackdrop />
        <div className="relative">
          <p className="text-[11px] font-bold tracking-widest text-white/75 uppercase">
            Duel terminé · vs {opponent.name}
          </p>
          {iWon ? (
            <Image
              src="/images/mascotte/flamme-celebration.webp"
              alt=""
              aria-hidden="true"
              width={96}
              height={96}
              className="pop-in mx-auto mt-2 object-contain"
            />
          ) : null}
          <p className="font-heading mt-2 text-4xl font-bold italic">
            {iWon ? 'VICTOIRE !' : 'DÉFAITE'}
          </p>
          <div className="mt-4 flex items-center justify-center gap-6">
            <div>
              <p className="font-mono text-3xl font-bold tabular-nums">{score.me}</p>
              <p className="text-xs text-white/75">Toi</p>
            </div>
            <span className="text-2xl font-bold text-white/60">—</span>
            <div>
              <p className="font-mono text-3xl font-bold tabular-nums">{score.them}</p>
              <p className="text-xs text-white/75">
                {opponent.emoji} {opponent.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <span className="flex items-center gap-1.5 rounded-full bg-highlight px-4 py-2 font-mono text-sm font-bold tabular-nums">
          +{xp} XP
        </span>
        {iWon ? (
          <span className="flex items-center gap-1.5 rounded-full border bg-card px-4 py-2 text-sm font-bold shadow-sm">
            <Trophy className="size-4 text-highlight" /> +1 victoire
          </span>
        ) : null}
      </div>

      <p className="text-sm text-muted-foreground">
        {saved === true
          ? '✓ Journée validée — ta série continue 🔥'
          : saved === false
            ? 'Duel non enregistré (connecte-toi pour garder ton XP).'
            : ''}
      </p>

      <div className="flex w-full flex-col gap-2">
        <Button size="lg" onClick={onRematch}>
          <RotateCcw className="size-4" /> Revanche
        </Button>
        <Button variant="outline" size="lg" onClick={onExit}>
          Continuer
        </Button>
      </div>
    </div>
  )
}
