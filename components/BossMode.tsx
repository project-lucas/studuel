'use client'

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import Image from 'next/image'
import { Heart, Zap, Check, X, RotateCcw, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { gameSfx, sfx } from '@/lib/sounds'
import PanneauRecompenses from '@/components/recompenses/PanneauRecompenses'
import type { Gain } from '@/lib/gains'
import { recordChallenge } from '@/app/defi/actions'
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
  dominantSubject,
  currentBossRank,
  recordBossVictory,
  weeklyBoss,
  weeklyBossBeaten,
  recordWeeklyBossWin,
  WEEKLY_BOSS_STATS,
  WEEKLY_TROPHY_COINS,
  RANK_STATS,
  RANK_LABELS,
  MAX_BOSS_RANK,
  type Boss,
  type BossRank,
} from '@/lib/bosses'
import { toDayKey } from '@/lib/streak'
import { claimWeeklyTrophy } from '@/app/defi/actions'
import { recordReviewAnswers } from '@/app/reviser/actions'
import type { ReviewAnswer } from '@/lib/srs'

type Phase = 'intro' | 'playing' | 'done'

// Visage du boss dans un médaillon : buste détouré si la DA est prête,
// emoji sinon. Le parent donne la taille (size-*) et le fond ; l'image
// déborde légèrement du cadre (scale) pour l'effet « portrait d'arène ».
function BossFace({ boss, px }: { boss: Boss; px: number }) {
  if (!boss.image) return <span aria-hidden="true">{boss.emoji}</span>
  return (
    <Image
      src={boss.image}
      alt=""
      width={px}
      height={px}
      aria-hidden="true"
      className="size-full scale-110 object-contain object-bottom"
    />
  )
}

// Boss de la semaine : un combat contre le boss de ta matière prioritaire.
// Chaque bonne réponse le frappe, chaque erreur coûte un cœur. Le pool vise
// déjà les chapitres fragiles — battre le boss, c'est réviser ce qui rapporte
// le plus. Chaque victoire le fait monter d'un rang : il revient plus fort.
export default function BossMode({
  pool,
  onExit,
  variant = 'arena',
  boss: forcedBoss,
  rank: forcedRank,
  onOutcome,
  rewardSlot,
  canRetry = false,
}: {
  pool: ModeQuestion[]
  onExit: () => void
  // 'subject' : combat lancé depuis l'onglet Boss d'une page matière — pas
  // d'événement hebdo (il vit dans l'Arène) et libellé de retour neutre.
  // 'traque'  : combat de LA TRAQUE (lib/traque) — le gardien a été débusqué
  //             en révisant. Pas d'événement hebdo, et c'est la BASE qui tient
  //             le rang et la victoire : une progression gagnée par du travail
  //             réel n'a rien à faire en localStorage. La scène est SOMBRE (on
  //             joue par-dessus le décor de l'arène) : l'encre du monde crème y
  //             passe en clair et le duo question/réponses se pose sur un
  //             panneau opaque, sans quoi rien n'est lisible.
  variant?: 'arena' | 'subject' | 'traque'
  /** Impose le gardien au lieu de le déduire de la matière dominante du pool. */
  boss?: Boss
  /** Impose le rang (lu en base) au lieu du compteur localStorage. */
  rank?: BossRank
  /** Issue du combat, pour que l'appelant la persiste côté serveur. */
  onOutcome?: (result: 'won' | 'lost') => void
  /** Bandeau de récompense de l'appelant, affiché sur l'écran de fin. */
  rewardSlot?: ReactNode
  /**
   * La Traque : la fenêtre d'une heure court-elle encore ? Si oui, l'écran de
   * défaite propose la revanche sur place — perdre coûte du temps, pas la
   * traque. Ignoré hors variante `traque` (les autres ont toujours « Rejouer »).
   */
  canRetry?: boolean
}) {
  // Le Boss sonne CUIVRE : fanfare courte et franche, dents de scie. Un combat
  // de boss doit s'annoncer à l'oreille comme un événement, pas comme un quiz.
  const audio = useMemo(() => gameSfx(MODE_TIMBRE.boss), [])
  // Le boss incarne la matière la plus représentée du pool (= la priorité) —
  // sauf quand l'appelant l'impose (La Traque : c'est LUI qu'on a débusqué).
  const derivedBoss = useMemo(() => bossForSubject(dominantSubject(pool)), [pool])
  const subjectBoss = forcedBoss ?? derivedBoss
  // L'événement : le boss de la semaine, plus dur, trophée exclusif à la clé.
  // BossMode n'est monté qu'après un clic (jamais en SSR) : lire la date ici
  // ne crée pas d'écart d'hydratation.
  const weekly = useMemo(() => weeklyBoss(toDayKey(new Date())), [])
  const [eventFight, setEventFight] = useState(false)
  const [weeklyDone, setWeeklyDone] = useState(false)
  const [trophy, setTrophy] = useState<boolean | null>(null)

  const character = eventFight ? weekly : subjectBoss

  // Le rang se lit après montage (localStorage) — même pattern que le record
  // du Blitz, pour éviter tout écart d'hydratation.
  const [rank, setRank] = useState<BossRank>(forcedRank ?? 1)
  useEffect(() => {
    const load = () => {
      // Rang imposé (lu en base, cf. La Traque) : rien à relire côté navigateur.
      if (forcedRank === undefined) setRank(currentBossRank(subjectBoss.id))
      setWeeklyDone(weeklyBossBeaten(toDayKey(new Date())))
    }
    load()
  }, [subjectBoss.id, forcedRank])
  const stats = eventFight ? WEEKLY_BOSS_STATS : RANK_STATS[rank]

  const [phase, setPhase] = useState<Phase>('intro')
  const [boss, setBoss] = useState<BossState>({ hp: stats.hp, lives: stats.lives })
  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [correct, setCorrect] = useState(0)
  const [answeredCount, setAnsweredCount] = useState(0)
  const [outcome, setOutcome] = useState<'won' | 'lost' | null>(null)
  const [rankedUp, setRankedUp] = useState(false)
  const [saved, setSaved] = useState<boolean | null>(null)
  // Ce que le combat a rapporté, tel que la base l'a écrit.
  const [gains, setGains] = useState<Gain[]>([])

  const question = pool.length > 0 ? pool[qIndex % pool.length] : null
  const answered = selected !== null

  // La Traque se joue SUR le décor de l'arène (voile de nuit), pas sur le fond
  // crème de Réviser : l'encre marine et les cartes transparentes y devenaient
  // invisibles. Deux rôles suffisent — l'encre claire, et le panneau opaque qui
  // porte la question et les réponses.
  const onDark = variant === 'traque'
  const inkSoft = onDark ? 'text-white/75' : 'text-muted-foreground'
  const panel = onDark
    ? 'rounded-3xl border border-white/10 bg-card p-4 shadow-[0_20px_45px_rgba(18,8,45,0.55)]'
    : ''

  // Réponses du combat pour la répétition espacée (SRS + Revanche).
  const reviewsRef = useRef<ReviewAnswer[]>([])
  // Timer d'auto-avance : annulé au démontage pour qu'un abandon juste après
  // une réponse n'enregistre pas le combat après coup (XP, boss hebdo, trophée).
  const advanceTimerRef = useRef<number | null>(null)
  useEffect(
    () => () => {
      if (advanceTimerRef.current) window.clearTimeout(advanceTimerRef.current)
    },
    [],
  )
  // Verrou synchrone anti-double-tap : deux taps rapprochés franchissent sinon
  // la garde `answered` (en retard d'un rendu) → deux timers d'avance armés →
  // une question sautée + une réponse en double (SRS). Relâché au prochain
  // `qIndex` (nouvelle question) ou à `start()` (qui incrémente aussi `qIndex`).
  const answerLockRef = useRef(false)
  // Série de coups portés d'affilée : elle fait monter la récompense sonore.
  const streakRef = useRef(0)
  useEffect(() => {
    answerLockRef.current = false
  }, [qIndex])

  const start = (event: boolean) => {
    sfx.flip()
    streakRef.current = 0
    setEventFight(event)
    const s = event ? WEEKLY_BOSS_STATS : RANK_STATS[rank]
    setBoss({ hp: s.hp, lives: s.lives })
    setQIndex((n) => n + 1)
    setSelected(null)
    setCorrect(0)
    setAnsweredCount(0)
    setOutcome(null)
    setRankedUp(false)
    setTrophy(null)
    setSaved(null)
    reviewsRef.current = []
    setPhase('playing')
  }

  const finish = (
    result: 'won' | 'lost',
    finalCorrect: number,
    finalAnswered: number,
  ) => {
    // La Traque : la victoire, le rang et les gemmes sont l'affaire du SERVEUR
    // (RPC traque_victoire, qui revérifie que la fenêtre d'une heure court
    // encore). Rien n'est écrit en localStorage — sinon changer de téléphone
    // effacerait une progression gagnée en travaillant.
    if (variant === 'traque') {
      if (result === 'won') sfx.levelUp()
      else audio.lose()
      onOutcome?.(result)
    } else if (result === 'won' && eventFight) {
      // Boss de la semaine vaincu : trophée exclusif + pièces, versés côté
      // serveur (l'identité du boss y est recalculée depuis la date).
      recordWeeklyBossWin(toDayKey(new Date()))
      setWeeklyDone(true)
      claimWeeklyTrophy()
        .then((r) => setTrophy(r.claimed))
        .catch(() => setTrophy(false))
      sfx.levelUp()
    } else if (result === 'won') {
      const newRank = recordBossVictory(character.id)
      const up = newRank > rank
      setRankedUp(up)
      setRank(newRank)
      // Montée de rang : l'envolée ; sinon la fanfare de victoire.
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
      .then((r) => {
        setSaved(r.saved)
        setGains(r.gains)
      })
      .catch(() => setSaved(false))
    // Reprogramme chaque question dans la file « À revoir ».
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
    // Chaque bonne réponse FRAPPE le boss, chaque erreur coûte un cœur : deux
    // événements de nature différente, deux sons différents. Les cuivres du
    // Boss ne s'entendent dans aucun autre mode.
    if (good) audio.correct(streakRef.current + 1)
    else audio.lifeLost()
    streakRef.current = good ? streakRef.current + 1 : 0
    const newBoss = bossAfterAnswer(boss, good)
    const newCorrect = correct + (good ? 1 : 0)
    const newAnswered = answeredCount + 1
    setBoss(newBoss)
    setCorrect(newCorrect)
    setAnsweredCount(newAnswered)
    const result = bossOutcome(newBoss)
    advanceTimerRef.current = window.setTimeout(() => {
      if (result) {
        finish(result, newCorrect, newAnswered)
      } else {
        setQIndex((n) => n + 1)
        setSelected(null)
      }
    }, 700)
  }

  // Étoiles de rang — partagées entre l'intro et l'arène.
  const rankStars = (
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
              : 'fill-transparent text-current opacity-40',
          )}
        />
      ))}
    </span>
  )

  // Cœurs restants — partagés entre l'arène et l'intro.
  const hearts = (
    <span className="flex items-center gap-1" aria-label={`${boss.lives} cœur${boss.lives > 1 ? 's' : ''} restant${boss.lives > 1 ? 's' : ''}`}>
      {Array.from({ length: stats.lives }, (_, i) => (
        <Heart
          key={i}
          className={cn(
            'size-5',
            i < boss.lives
              ? 'fill-destructive text-destructive'
              : 'fill-muted text-muted',
          )}
        />
      ))}
    </span>
  )

  // ------------------------------------------------------------------- intro
  if (phase === 'intro') {
    return (
      <div
        className={cn(
          'mx-auto flex max-w-xl flex-col items-center gap-6 pt-4 text-center',
          onDark && 'text-white',
        )}
      >
        <div className="flex flex-col items-center gap-2">
          <span
            className={cn(
              'flex size-24 items-center justify-center overflow-hidden rounded-full bg-primary text-5xl shadow-lg shadow-primary/30',
              onDark && 'size-32 border-4 border-highlight/70 shadow-2xl',
            )}
          >
            <BossFace boss={character} px={onDark ? 128 : 96} />
          </span>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-3xl font-bold">{character.name}</h1>
            {rankStars}
          </div>
          <p
            className={cn(
              'text-sm font-semibold uppercase tracking-wide',
              onDark ? 'text-highlight' : 'text-muted-foreground',
            )}
          >
            {character.epithet} · {RANK_LABELS[rank]}
          </p>
          <p className="font-heading text-lg italic">« {character.intro} »</p>
        </div>

        <p className={cn('text-sm', inkSoft)}>
          {character.name} a {stats.hp} points de vie, tu as {stats.lives} cœur
          {stats.lives > 1 ? 's' : ''}.
          <br />
          Chaque bonne réponse le frappe, chaque erreur te coûte un cœur.
          <br />
          {variant === 'traque'
            ? 'Il t’interroge sur ce que tu viens de réviser — c’est ton travail qui l’a fait sortir.'
            : 'Il garde ton chapitre le plus fragile — bats-le, prends l’XP.'}
        </p>

        {/* text-foreground explicite : sur la scène sombre, le texte hérité
            serait blanc sur jaune solaire — illisible. */}
        <p className="flex items-center gap-1.5 rounded-full bg-highlight px-4 py-1.5 font-mono text-sm font-bold text-foreground shadow-sm tabular-nums">
          <Zap className="size-4" /> +{MODE_XP_BONUS.boss} XP en cas de victoire
        </p>

        <button
          type="button"
          onClick={() => start(false)}
          disabled={pool.length === 0}
          className="group go-pulse relative flex size-32 flex-col items-center justify-center gap-1 overflow-hidden rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-4 top-2 h-12 rounded-full bg-gradient-to-b from-white/20 to-transparent"
          />
          <span aria-hidden="true" className="text-4xl transition-transform group-hover:rotate-12">
            ⚔️
          </span>
          <span className="font-heading text-xl font-bold">GO</span>
        </button>

        {pool.length === 0 ? (
          <p className={cn('max-w-xs text-sm', inkSoft)}>
            Pas encore de questions pour ta classe — reviens bientôt !
          </p>
        ) : null}

        {/* Événement : le boss de la semaine, toutes matières, trophée
            exclusif. Disparaît lundi — vaincu ou pas. Réservé à l'Arène. */}
        {variant === 'arena' ? (
        <section className="w-full max-w-sm rounded-3xl border-2 border-highlight/60 bg-card p-4 text-left shadow-sm">
          <p className="flex items-center gap-1.5 text-[11px] font-extrabold tracking-widest text-primary uppercase">
            <Zap className="size-3.5 text-highlight" aria-hidden="true" />
            Événement · Boss de la semaine
          </p>
          <div className="mt-2 flex items-center gap-3">
            <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary text-2xl">
              <BossFace boss={weekly} px={48} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-heading text-base font-bold leading-tight">
                {weekly.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {weekly.epithet} · {WEEKLY_BOSS_STATS.hp} PV ·{' '}
                {WEEKLY_BOSS_STATS.lives} cœurs · toutes matières
              </p>
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {weeklyDone
              ? `Vaincu cette semaine — trophée en poche. Il change lundi !`
              : `Bats-le avant lundi : Trophée ${weekly.name} (carte exclusive) + ${WEEKLY_TROPHY_COINS} pièces.`}
          </p>
          <Button
            className="mt-3 w-full rounded-full"
            disabled={pool.length === 0 || weeklyDone}
            onClick={() => start(true)}
          >
            {weeklyDone ? 'Déjà vaincu cette semaine ✓' : 'Affronter le boss de la semaine'}
          </Button>
        </section>
        ) : null}

        {variant === 'arena' ? null : (
          <Button
            variant="ghost"
            onClick={onExit}
            className={onDark ? 'text-white hover:bg-white/10 hover:text-white' : ''}
          >
            Retour
          </Button>
        )}
      </div>
    )
  }

  // -------------------------------------------------------------------- done
  if (phase === 'done') {
    return (
      <div
        className={cn(
          'mx-auto flex max-w-xl flex-col items-center gap-5 pt-8 text-center',
          onDark && 'text-white',
        )}
      >
        <div className="animate-in zoom-in text-6xl duration-500">
          {outcome === 'won' ? (
            '👑'
          ) : character.image ? (
            <Image
              src={character.image}
              alt=""
              width={112}
              height={112}
              aria-hidden="true"
              className="mx-auto"
            />
          ) : (
            character.emoji
          )}
        </div>
        <div>
          <h1 className="font-heading text-3xl font-bold">
            {outcome === 'won'
              ? `${character.name} est vaincu !`
              : `${character.name} t’a eu…`}
          </h1>
          <p className="font-heading mt-1 text-base italic">
            « {outcome === 'won' ? character.defeat : character.victory} »
          </p>
          <p className={cn('mt-1 text-sm', inkSoft)}>
            {outcome === 'won'
              ? `${correct} coups portés en ${answeredCount} questions.`
              : canRetry
                ? `Il lui restait ${boss.hp} PV. Il est encore là — reprends-le tout de suite.`
                : `Il lui restait ${boss.hp} PV. Reviens plus fort — il t'attend.`}
          </p>
        </div>

        {outcome === 'won' && eventFight ? (
          <p className="animate-in slide-in-from-bottom-2 flex items-center gap-2 rounded-full bg-highlight px-4 py-1.5 text-sm font-bold text-foreground duration-500">
            <span aria-hidden="true">🏆</span>
            {trophy === false
              ? 'Trophée déjà en poche cette semaine.'
              : `Trophée ${character.name} débloqué + ${WEEKLY_TROPHY_COINS} pièces !`}
          </p>
        ) : outcome === 'won' ? (
          <p
            className={cn(
              'animate-in slide-in-from-bottom-2 rounded-full px-4 py-1.5 text-sm font-bold duration-500',
              onDark ? 'bg-white/10 text-highlight' : 'bg-primary/10 text-primary',
            )}
          >
            {rankedUp
              ? `${character.name} passe au ${RANK_LABELS[rank].toLowerCase()} — ${RANK_STATS[rank].hp} PV. Il reviendra plus fort.`
              : rank === MAX_BOSS_RANK
                ? `Rang max — tu domines ${character.name}. 👑`
                : ''}
          </p>
        ) : null}

        {/* La Traque : gemmes versées et « ouvrir la fiche » viennent de
            l'appelant — c'est lui qui a parlé au serveur. */}
        {rewardSlot}

        {/* CE QUE LE COMBAT A RAPPORTÉ, et le geste de Clash Royale qui va
            avec. ⚠️ C'était un « +XX XP » calculé côté client (`XP_RULES` +
            `MODE_XP_BONUS.boss`) que le portefeuille ne versait plus depuis la
            migration 348 — jouer n'acquiert rien. */}
        <PanneauRecompenses gains={gains} className="w-full max-w-sm" />

        <p className={cn('text-sm', inkSoft)}>
          {saved === true
            ? '✓ Journée validée — ta série continue 🔥'
            : saved === false
              ? 'Combat non enregistré (connecte-toi pour garder ta progression).'
              : ''}
        </p>

        <div className="flex gap-2">
          {/* La Traque : la victoire consomme la fenêtre (le gardien retourne
              dans sa tanière), la DÉFAITE non — tant que l'heure court, la
              revanche est là. C'est l'appelant qui le dit : lui seul connaît
              l'heure de fin. */}
          {variant === 'traque' ? (
            canRetry ? (
              <Button size="lg" onClick={() => start(false)}>
                <RotateCcw className="size-4" /> Revanche
              </Button>
            ) : null
          ) : (
            <Button
              size="lg"
              onClick={() => start(eventFight && outcome !== 'won')}
            >
              <RotateCcw className="size-4" />{' '}
              {outcome === 'won' ? 'Rejouer' : 'Revanche'}
            </Button>
          )}
          {variant === 'arena' ? null : (
            <Button
              variant="outline"
              size="lg"
              onClick={onExit}
              className={
                onDark
                  ? 'border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white'
                  : ''
              }
            >
              {variant === 'traque' ? "Retour à l'arène" : 'Retour'}
            </Button>
          )}
        </div>
      </div>
    )
  }

  // ----------------------------------------------------------------- combat
  if (!question) return null

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-3">
      {/* Le boss : médaillon, barre de PV, tes cœurs en face. */}
      <div className="rounded-2xl bg-primary p-3 text-primary-foreground shadow-md">
        <div className="flex items-center gap-3">
          <span
            key={boss.hp}
            className="pop-spring flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary-foreground/15 text-2xl"
          >
            <BossFace boss={character} px={44} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 tracking-wide uppercase">
                {character.name}{' '}
                {eventFight ? (
                  <span className="rounded-full bg-highlight px-1.5 py-px text-[9px] font-extrabold text-foreground">
                    SEMAINE
                  </span>
                ) : (
                  rankStars
                )}
              </span>
              <span className="font-mono tabular-nums">
                {boss.hp}/{stats.hp} PV
              </span>
            </div>
            <div
              className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-primary-foreground/20"
              role="progressbar"
              aria-label={`Points de vie de ${character.name} : ${boss.hp} sur ${stats.hp}`}
              aria-valuemin={0}
              aria-valuemax={stats.hp}
              aria-valuenow={boss.hp}
            >
              <div
                className="h-full rounded-full bg-destructive transition-all duration-500"
                style={{ width: `${(boss.hp / stats.hp) * 100}%` }}
              />
            </div>
          </div>
          {hearts}
        </div>
      </div>

      {/* Sur la scène sombre de La Traque, la question et les réponses se
          posent sur un PANNEAU opaque : le décor de l'arène passait à travers
          le texte et les cartes de réponse (captures du 30/07). */}
      <div className={cn('flex flex-col gap-2', panel)}>
        {question.subject ? (
          <p className="text-xs font-semibold text-muted-foreground uppercase">
            {question.subject}
          </p>
        ) : null}

        <h2 className="font-heading mb-1 text-xl font-bold text-balance">
          {question.prompt}
        </h2>
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
                // Sur le panneau crème, une réponse « transparente » se
                // confondrait avec le fond : on lui donne son propre relief.
                onDark && !answered && 'bg-background',
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
            ? `Bonne réponse, ${character.name} est touché`
            : 'Mauvaise réponse, tu perds un cœur'
          : ''}
      </p>

      <button
        type="button"
        onClick={onExit}
        className={cn(
          'mt-2 self-center text-sm underline-offset-4 hover:underline',
          inkSoft,
        )}
      >
        Abandonner le combat
      </button>
    </div>
  )
}
