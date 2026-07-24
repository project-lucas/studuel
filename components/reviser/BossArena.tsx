'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { Heart, Star, Flag, Swords, Zap, Check, X, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { gameSfx, sfx } from '@/lib/sounds'
import { XP_RULES } from '@/lib/xp'
import { recordChallenge } from '@/app/defi/actions'
import { recordReviewAnswers } from '@/app/reviser/actions'
import { useDialogFocus } from '@/lib/use-dialog'
import DialogCloseButton from '@/components/DialogCloseButton'
import {
  MODE_TIMBRE,
  MODE_XP_BONUS,
  bossAfterAnswer,
  bossOutcome,
  type BossState,
  type ModeQuestion,
} from '@/lib/defi-modes'
import {
  bossForSubject,
  currentBossRank,
  recordBossVictory,
  RANK_STATS,
  RANK_LABELS,
  MAX_BOSS_RANK,
  type Boss,
  type BossRank,
} from '@/lib/bosses'
import type { ReviewAnswer } from '@/lib/srs'

// Sous PV_LOW le gardien vire au rouge et pulse : le combat entre dans sa
// phase critique. Seuil = 30 % de ses PV max (cf. brief « PV < 30 % »).
const PV_LOW = 0.3
// Durées calées sur les keyframes de globals.css — un écart et l'anim ment.
const ENTER_MS = 620 // .boss-portrait-in
const EXIT_MS = 460 // .boss-arena-out
const ADVANCE_MS = 700 // fenêtre de lecture avant la question suivante

// L'onglet « Boss » d'une page matière : la zone crème se mue en salle de
// combat (violet profond .mode-stage-dark) sans changer de page. Le gardien —
// le même de la 6e à la Terminale (bossForSubject sur le slug) — entre en
// grand, encaisse les coups et se dissout à sa chute. La mécanique (PV, cœurs,
// SRS, XP, rang) est celle de l'Arène, sans l'événement hebdo qui, lui, vit
// dans le Défi. Récompense réelle du combat matière : XP + montée de rang (les
// pièces sont réservées au trophée du boss de la semaine).
type Phase = 'idle' | 'entering' | 'playing' | 'done'

export default function BossArena({
  subjectSlug,
  pool,
}: {
  subjectSlug: string
  pool: ModeQuestion[]
}) {
  const boss = useMemo(() => bossForSubject(subjectSlug), [subjectSlug])
  // Le Boss sonne CUIVRE : fanfare franche, dents de scie — l'oreille sait que
  // c'est un événement, pas un quiz de plus.
  const audio = useMemo(() => gameSfx(MODE_TIMBRE.boss), [])

  const [phase, setPhase] = useState<Phase>('idle')
  // Rang lu après montage (localStorage) — évite tout écart d'hydratation, et
  // se rafraîchit au retour au repos (une victoire a pu le faire monter).
  const [rank, setRank] = useState<BossRank>(1)
  useEffect(() => {
    const load = () => setRank(currentBossRank(boss.id))
    if (phase === 'idle') load()
  }, [boss.id, phase])
  const stats = RANK_STATS[rank]

  const [bossState, setBossState] = useState<BossState>({
    hp: stats.hp,
    lives: stats.lives,
  })
  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [correct, setCorrect] = useState(0)
  const [answeredCount, setAnsweredCount] = useState(0)
  const [outcome, setOutcome] = useState<'won' | 'lost' | null>(null)
  const [rankedUp, setRankedUp] = useState(false)
  const [saved, setSaved] = useState<boolean | null>(null)
  const [exiting, setExiting] = useState(false)

  // Réaction du gardien au dernier coup : `tick` (re-jouer l'anim via key),
  // `good` (recul + flash blanc) ou non (bond + secousse d'écran + cœur brisé).
  const [reaction, setReaction] = useState<{ tick: number; good: boolean }>({
    tick: 0,
    good: true,
  })
  const [shaking, setShaking] = useState(false)

  const question = pool.length > 0 ? pool[qIndex % pool.length] : null
  const answered = selected !== null
  const woundedNow =
    phase === 'playing' && bossState.hp > 0 && bossState.hp / stats.hp < PV_LOW

  // Réponses du combat pour la répétition espacée (SRS + Revanche).
  const reviewsRef = useRef<ReviewAnswer[]>([])
  // Verrou synchrone anti-double-tap : la garde `answered` est en retard d'un
  // rendu ; sans lui, deux taps arment deux timers → question sautée + réponse
  // en double (SRS). Relâché au prochain qIndex.
  const answerLockRef = useRef(false)
  const streakRef = useRef(0)
  const advanceTimerRef = useRef<number | null>(null)
  const enterTimerRef = useRef<number | null>(null)
  const exitTimerRef = useRef<number | null>(null)
  useEffect(() => {
    answerLockRef.current = false
  }, [qIndex])
  // Au démontage, on annule tout timer en vol : un abandon juste après une
  // réponse ne doit pas enregistrer le combat après coup (XP, SRS).
  useEffect(
    () => () => {
      if (advanceTimerRef.current) window.clearTimeout(advanceTimerRef.current)
      if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current)
      if (exitTimerRef.current) window.clearTimeout(exitTimerRef.current)
    },
    [],
  )

  // ------------------------------------------------------------- transitions
  const beginFight = () => {
    if (pool.length === 0) return
    sfx.flip()
    streakRef.current = 0
    setBossState({ hp: stats.hp, lives: stats.lives })
    setQIndex((n) => n + 1)
    setSelected(null)
    setCorrect(0)
    setAnsweredCount(0)
    setOutcome(null)
    setRankedUp(false)
    setSaved(null)
    setShaking(false)
    setReaction({ tick: 0, good: true })
    reviewsRef.current = []
    setPhase('entering')
    // Le gardien entre (~600 ms), puis la question apparaît.
    enterTimerRef.current = window.setTimeout(
      () => setPhase('playing'),
      ENTER_MS,
    )
  }

  // Retour à la présentation crème : le calque sombre s'efface d'abord.
  const leaveArena = () => {
    if (advanceTimerRef.current) window.clearTimeout(advanceTimerRef.current)
    setExiting(true)
    exitTimerRef.current = window.setTimeout(() => {
      setExiting(false)
      setPhase('idle')
    }, EXIT_MS)
  }

  const finish = (
    result: 'won' | 'lost',
    finalCorrect: number,
    finalAnswered: number,
  ) => {
    if (result === 'won') {
      const newRank = recordBossVictory(boss.id)
      const up = newRank > rank
      setRankedUp(up)
      setRank(newRank)
      if (up) sfx.levelUp()
      else sfx.complete()
    } else {
      audio.lose()
    }
    setOutcome(result)
    setPhase('done')
    // Le gros bonus du boss ne se gagne qu'en le battant.
    recordChallenge(
      finalCorrect,
      finalAnswered,
      result === 'won' ? 'boss' : undefined,
    )
      .then((r) => setSaved(r.saved))
      .catch(() => setSaved(false))
    recordReviewAnswers(reviewsRef.current).catch(() => {})
  }

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
    // Deux événements de nature différente, deux sons : la bonne réponse FRAPPE
    // le boss, l'erreur coûte un cœur. Les cuivres du Boss ne sonnent nulle part
    // ailleurs.
    if (good) audio.correct(streakRef.current + 1)
    else audio.lifeLost()
    streakRef.current = good ? streakRef.current + 1 : 0
    const newBoss = bossAfterAnswer(bossState, good)
    const newCorrect = correct + (good ? 1 : 0)
    const newAnswered = answeredCount + 1
    setBossState(newBoss)
    setCorrect(newCorrect)
    setAnsweredCount(newAnswered)
    setReaction((r) => ({ tick: r.tick + 1, good }))
    if (!good) setShaking(true)
    const result = bossOutcome(newBoss)
    advanceTimerRef.current = window.setTimeout(() => {
      if (result) {
        finish(result, newCorrect, newAnswered)
      } else {
        setQIndex((n) => n + 1)
        setSelected(null)
      }
    }, ADVANCE_MS)
  }

  // ------------------------------------------------------------------- repos
  if (phase === 'idle') {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-5 pt-2 text-center">
        <span className="float-slow flex size-36 items-center justify-center overflow-hidden rounded-full bg-primary text-7xl shadow-lg shadow-primary/30">
          <BossFace boss={boss} px={144} />
        </span>

        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-3xl font-bold">{boss.name}</h2>
            <RankStars rank={rank} onDark={false} />
          </div>
          <p className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            {boss.epithet} · {RANK_LABELS[rank]}
          </p>
          <p className="font-heading text-lg italic">« {boss.intro} »</p>
        </div>

        <p className="max-w-sm text-sm text-muted-foreground">
          {boss.name} garde cette matière. {stats.hp}&nbsp;PV aujourd&apos;hui,
          et chaque victoire le fait revenir plus fort.
        </p>

        <Button
          size="lg"
          className="rounded-full px-8"
          disabled={pool.length === 0}
          onClick={beginFight}
        >
          <Swords className="size-4" /> Affronter {boss.name}
        </Button>

        {pool.length === 0 ? (
          <p className="max-w-xs text-sm text-muted-foreground">
            Pas encore de questions dans cette matière — le boss attend son
            premier challenger.
          </p>
        ) : null}
      </div>
    )
  }

  // -------------------------------------------------------- arène (combat/fin)
  // La zone crème passe au violet profond : marges négatives pour occuper toute
  // la largeur du panneau de contenu (header/nav restent au-dessus, intacts).
  return (
    <div
      className={cn(
        '-mx-4 -mt-5 -mb-24 flex min-h-[calc(100dvh-8rem)] flex-col overflow-hidden rounded-t-3xl px-4 pt-6 pb-28 text-white md:-mx-8 md:px-8',
        'mode-stage-dark',
        exiting ? 'boss-arena-out' : phase === 'entering' ? 'boss-arena-dark' : '',
        shaking && 'jeu-secousse',
      )}
      onAnimationEnd={(e) => {
        // animationend REMONTE depuis les enfants (portrait, recul, cœur…) :
        // on ne coupe la secousse que sur l'anim de la racine elle-même.
        if (e.target === e.currentTarget && shaking) setShaking(false)
      }}
    >
      {/* Barre haute : abandon (gauche) · cœurs du joueur (droite). */}
      <div className="flex items-center justify-between">
        <AbandonButton onConfirm={leaveArena} />
        <PlayerHearts lives={bossState.lives} max={stats.lives} tick={reaction.tick} lostByMiss={!reaction.good} />
      </div>

      {/* Le gardien, en grand (~40 % de la zone). */}
      <div className="relative mt-1 flex h-[38dvh] max-h-80 min-h-40 shrink-0 items-end justify-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-2 mx-auto h-24 w-4/5 max-w-xs rounded-[50%] bg-black/40 blur-2xl"
        />
        <div className={phase === 'entering' ? 'boss-portrait-in' : 'float-slow'}>
          <div
            key={reaction.tick}
            className={cn(
              'relative flex h-[36dvh] max-h-72 min-h-36 items-end',
              reaction.tick > 0 &&
                (reaction.good ? 'boss-recoil' : 'boss-lunge'),
            )}
          >
            <BossFace boss={boss} px={320} className="h-full w-auto drop-shadow-2xl" />
            {reaction.tick > 0 && reaction.good ? (
              <span
                aria-hidden="true"
                className="rk-flash pointer-events-none absolute inset-0 rounded-[40%] bg-white"
              />
            ) : null}
          </div>
          {woundedNow ? (
            <span
              aria-hidden="true"
              className="boss-wounded pointer-events-none absolute inset-0 rounded-[40%] bg-destructive mix-blend-hard-light"
            />
          ) : null}
        </div>
      </div>

      {outcome ? (
        <Outcome
          boss={boss}
          outcome={outcome}
          correct={correct}
          answeredCount={answeredCount}
          remainingHp={bossState.hp}
          rank={rank}
          rankedUp={rankedUp}
          saved={saved}
          onReplay={beginFight}
          onLeave={leaveArena}
        />
      ) : (
        <>
          {/* Identité + barre de PV, sous le gardien. */}
          <div className="mt-4 flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-xl font-bold">{boss.name}</h2>
              <RankStars rank={rank} onDark />
            </div>
            <div className="flex w-full max-w-md items-center gap-2">
              <span className="text-sm">❤️</span>
              <div
                className="h-3 w-full overflow-hidden rounded-full bg-white/15"
                role="progressbar"
                aria-label={`Points de vie de ${boss.name} : ${bossState.hp} sur ${stats.hp}`}
                aria-valuemin={0}
                aria-valuemax={stats.hp}
                aria-valuenow={bossState.hp}
              >
                <div
                  className="h-full rounded-full bg-destructive transition-all duration-500"
                  style={{ width: `${(bossState.hp / stats.hp) * 100}%` }}
                />
              </div>
              <span className="min-w-14 text-right font-mono text-xs font-bold tabular-nums">
                {bossState.hp}/{stats.hp}
              </span>
            </div>
          </div>

          {/* Question + réponses (mécanique existante, robe d'arène). */}
          {question ? (
            <div className="mx-auto mt-5 flex w-full max-w-md flex-col gap-2">
              {question.subject ? (
                <p className="text-xs font-semibold tracking-wide text-white/60 uppercase">
                  {question.subject}
                </p>
              ) : null}
              <h3 className="font-heading mb-1 text-lg font-bold text-balance">
                {question.prompt}
              </h3>
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
                        'border-white/15 bg-white/[0.06] hover:border-white/40 hover:bg-white/10 active:scale-[0.99]',
                      answered &&
                        isCorrect &&
                        'border-emerald-400 bg-emerald-400/15 text-emerald-50',
                      answered &&
                        isSelected &&
                        !isCorrect &&
                        'jeu-secousse border-destructive bg-destructive/20 text-white',
                      answered && !isSelected && !isCorrect && 'opacity-40',
                      // La bonne réponse choisie s'élève vers le boss.
                      answered && isSelected && isCorrect && 'answer-to-boss',
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
            </div>
          ) : null}

          <p role="status" aria-live="polite" className="sr-only">
            {answered
              ? selected === question?.correctIndex
                ? `Bonne réponse, ${boss.name} est touché`
                : 'Mauvaise réponse, tu perds un cœur'
              : ''}
          </p>
        </>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Visage du boss : buste détouré si la DA est prête, emoji sinon. Le parent
// donne la taille et le fond.
function BossFace({
  boss,
  px,
  className,
}: {
  boss: Boss
  px: number
  className?: string
}) {
  if (!boss.image)
    return (
      <span aria-hidden="true" className={className}>
        {boss.emoji}
      </span>
    )
  return (
    <Image
      src={boss.image}
      alt=""
      width={px}
      height={px}
      aria-hidden="true"
      className={cn('object-contain object-bottom', className)}
    />
  )
}

function RankStars({ rank, onDark }: { rank: BossRank; onDark: boolean }) {
  return (
    <span
      className="flex items-center gap-0.5"
      aria-label={`${RANK_LABELS[rank]} sur ${MAX_BOSS_RANK}`}
    >
      {Array.from({ length: MAX_BOSS_RANK }, (_, i) => (
        <Star
          key={i}
          className={cn(
            'size-3.5',
            i < rank
              ? 'fill-highlight text-highlight'
              : onDark
                ? 'fill-transparent text-white/30'
                : 'fill-transparent text-current opacity-40',
          )}
        />
      ))}
    </span>
  )
}

// Cœurs du joueur, en overlay. Le cœur qui vient de tomber (index === vies
// restantes) se brise quand la dernière réponse était une erreur.
function PlayerHearts({
  lives,
  max,
  tick,
  lostByMiss,
}: {
  lives: number
  max: number
  tick: number
  lostByMiss: boolean
}) {
  return (
    <span
      className="flex items-center gap-1 rounded-full bg-black/25 px-3 py-1.5"
      aria-label={`${lives} cœur${lives > 1 ? 's' : ''} restant${lives > 1 ? 's' : ''}`}
    >
      {Array.from({ length: max }, (_, i) => {
        const filled = i < lives
        const justLost = lostByMiss && i === lives
        return (
          <Heart
            key={justLost ? `break-${tick}` : i}
            className={cn(
              'size-5',
              filled
                ? 'fill-destructive text-destructive'
                : 'fill-white/15 text-white/15',
              justLost && 'heart-break fill-destructive text-destructive',
            )}
          />
        )
      })}
    </span>
  )
}

// Décompte animé de l'XP à la fin — count-up via rAF (timestamp, pas Date.now).
function CountUp({ value }: { value: number }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    let raf = 0
    let start: number | null = null
    const step = (t: number) => {
      if (start === null) start = t
      const p = Math.min(1, (t - start) / 900)
      const eased = 1 - Math.pow(1 - p, 3)
      setN(Math.round(value * eased))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [value])
  return <>{n}</>
}

// Écran de fin, dans l'arène : victoire (le boss se dissout, XP qui compte,
// montée de rang) ou défaite (message court + revanche / retour).
function Outcome({
  boss,
  outcome,
  correct,
  answeredCount,
  remainingHp,
  rank,
  rankedUp,
  saved,
  onReplay,
  onLeave,
}: {
  boss: Boss
  outcome: 'won' | 'lost'
  correct: number
  answeredCount: number
  remainingHp: number
  rank: BossRank
  rankedUp: boolean
  saved: boolean | null
  onReplay: () => void
  onLeave: () => void
}) {
  const won = outcome === 'won'
  const xp =
    correct * XP_RULES.challengePerCorrect +
    XP_RULES.challengeBonus +
    (won ? MODE_XP_BONUS.boss : 0)
  return (
    <div className="mx-auto mt-4 flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 text-center">
      <div className="text-5xl">
        {won ? (
          <span className="pop-spring inline-block">👑</span>
        ) : (
          <span className="inline-block">💀</span>
        )}
      </div>

      <div>
        <h2 className="font-heading text-2xl font-bold">
          {won ? `${boss.name} est vaincu !` : `${boss.name} t’a eu…`}
        </h2>
        <p className="font-heading mt-1 text-base italic text-white/80">
          « {won ? boss.defeat : boss.victory} »
        </p>
        <p className="mt-1 text-sm text-white/60">
          {won
            ? `${correct} coups portés en ${answeredCount} questions.`
            : `Il lui restait ${remainingHp} PV. Reviens plus fort.`}
        </p>
      </div>

      {won ? (
        <p
          className={cn(
            'rounded-full px-4 py-1.5 text-sm font-bold',
            'bg-white/10 text-white',
          )}
        >
          {rankedUp
            ? `${boss.name} passe au ${RANK_LABELS[rank].toLowerCase()} — ${RANK_STATS[rank].hp} PV. Il reviendra plus fort.`
            : rank === MAX_BOSS_RANK
              ? `Rang max — tu domines ${boss.name}. 👑`
              : `Coups placés — l'XP est à toi.`}
        </p>
      ) : null}

      <div className="flex items-center gap-2 rounded-full bg-highlight px-6 py-3 font-mono text-2xl font-bold text-foreground shadow-lg tabular-nums">
        <Zap className="size-6" /> +<CountUp value={xp} /> XP
      </div>

      {won ? (
        <p className="text-sm text-white/60">
          {saved === true
            ? '✓ Journée validée — ta série continue 🔥'
            : saved === false
              ? 'Combat non enregistré (connecte-toi pour garder ton XP).'
              : ''}
        </p>
      ) : null}

      <div className="mt-1 flex gap-2">
        <Button size="lg" className="rounded-full" onClick={onReplay}>
          <RotateCcw className="size-4" /> {won ? 'Rejouer' : 'Revanche'}
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="rounded-full border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
          onClick={onLeave}
        >
          Retour
        </Button>
      </div>
    </div>
  )
}

// Abandon : petit drapeau en coin qui demande confirmation (le boss récupère
// tous ses PV). Modale par portail sur <body> — l'arène est en marges négatives,
// un overlay ancré ailleurs évite tout piège de z-index.
function AbandonButton({ onConfirm }: { onConfirm: () => void }) {
  const [open, setOpen] = useState(false)
  const panel = useRef<HTMLDivElement>(null)
  useDialogFocus(panel, open)

  return (
    <>
      <button
        type="button"
        aria-label="Abandonner le combat"
        title="Abandonner"
        onClick={() => {
          sfx.tap()
          setOpen(true)
        }}
        className="inline-flex size-10 items-center justify-center rounded-full bg-black/25 text-white/80 transition-transform active:scale-95 hover:text-white"
      >
        <Flag className="size-4" />
      </button>

      {open && typeof document !== 'undefined'
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Abandonner le combat ?"
              className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-4 sm:items-center"
              onClick={() => setOpen(false)}
            >
              <div
                ref={panel}
                className="relative w-full max-w-sm rounded-3xl bg-card p-6 text-center text-foreground shadow-2xl outline-none"
                onClick={(e) => e.stopPropagation()}
              >
                <DialogCloseButton
                  onClose={() => {
                    sfx.tap()
                    setOpen(false)
                  }}
                />
                <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-destructive/10 text-3xl">
                  🏳️
                </div>
                <h2 className="font-heading mt-3 text-2xl font-bold">
                  Abandonner le combat ?
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Tu perdras ta progression sur ce combat — le boss récupère tous
                  ses PV.
                </p>

                <Button
                  size="lg"
                  className="mt-6 w-full rounded-full font-bold"
                  onClick={() => {
                    sfx.tap()
                    setOpen(false)
                  }}
                >
                  Continuer le combat
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    sfx.tap()
                    setOpen(false)
                    onConfirm()
                  }}
                  className="mt-3 w-full py-2 text-sm font-bold text-destructive transition-opacity hover:opacity-80"
                >
                  Abandonner
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
