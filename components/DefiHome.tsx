'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Zap,
  Check,
  X,
  ArrowRight,
  RotateCcw,
  BusFront,
  Swords,
  Timer,
  Hourglass,
  Skull,
  Crown,
  Lock,
  Star,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { SoundToggle } from '@/components/FlashcardPlayer'
import StreakMascot from '@/components/StreakMascot'
import DefiTimer from '@/components/DefiTimer'
import BlitzMode from '@/components/BlitzMode'
import DuelMode from '@/components/DuelMode'
import ChronoMode from '@/components/ChronoMode'
import SurvivalMode from '@/components/SurvivalMode'
import BossMode from '@/components/BossMode'
import { bossForSubject, dominantSubject } from '@/lib/bosses'
import { XP_RULES, type LevelInfo } from '@/lib/xp'
import { isCommuteNow } from '@/lib/trajet'
import type { CommuteSlot } from '@/lib/types'
import { recordChallenge } from '@/app/defi/actions'
import { recordReviewAnswers } from '@/app/reviser/actions'
import type { ReviewAnswer } from '@/lib/srs'
import type { FriendGhost } from '@/lib/social'
import {
  GAME_MODES,
  MODE_XP_BONUS,
  FEATURED_XP_MULTIPLIER,
  modeButtonImage,
  modeImage,
  modeStatus,
  type GameModeId,
  type ModeQuestion,
} from '@/lib/defi-modes'

export type ChallengeItem =
  | {
      kind: 'question'
      id: string
      prompt: string
      options: string[]
      correctIndex: number
      explanation: string | null
      subject: string | null
    }
  | {
      kind: 'card'
      id: string
      front: string
      back: string
      subject: string | null
    }

type Phase =
  | 'landing'
  | 'playing'
  | 'done'
  | 'blitz'
  | 'duel'
  | 'chrono'
  | 'survie'
  | 'boss'

// Icône de chaque mode de jeu — sobres (Lucide), pas d'emoji.
const MODE_ICONS: Record<GameModeId, LucideIcon> = {
  duel: Swords,
  blitz: Timer,
  chrono: Hourglass,
  survie: Skull,
  boss: Crown,
}

// Couleur de tuile par mode (palette de l'Arène, cf. globals.css) et texte
// assorti : blanc partout, marine sur l'or du Blitz.
const TILE_CLASS: Record<GameModeId, string> = {
  duel: 'tile-duel text-white',
  blitz: 'tile-blitz text-primary',
  chrono: 'tile-chrono text-white',
  survie: 'tile-survie text-white',
  boss: 'tile-boss text-white',
}

// Idle par mode : le visuel du bouton vit (choc d'épées, sablier qui tangue,
// bouclier qui flotte) — keyframes dans globals.css, section Arène.
const MODE_BUTTON_ANIM: Partial<Record<GameModeId, string>> = {
  duel: 'mode-anim-duel',
  chrono: 'mode-anim-chrono',
  survie: 'mode-anim-survie',
}

// Badge « +XP » : or sur les tuiles colorées, marine sur la tuile or.
const TILE_CHIP: Record<GameModeId, string> = {
  duel: 'bg-highlight text-foreground',
  blitz: 'bg-primary text-primary-foreground',
  chrono: 'bg-highlight text-foreground',
  survie: 'bg-highlight text-foreground',
  boss: 'bg-highlight text-foreground',
}

// L'onglet central : le défi du jour en un gros bouton, et en dessous
// l'arène — les modes de jeu compétitifs.
export default function DefiHome({
  items,
  pool = [],
  streak,
  doneToday,
  level,
  firstName,
  commuteSlots = [],
  commuteStreak = 0,
  featuredId = null,
  ghosts = [],
}: {
  items: ChallengeItem[]
  pool?: ModeQuestion[]
  streak: number
  doneToday: boolean
  level: LevelInfo
  firstName: string | null
  commuteSlots?: CommuteSlot[]
  commuteStreak?: number
  // Mode du jour : calculé côté serveur (clé UTC) pour éviter tout écart
  // d'hydratation — la tuile est mise en avant et son bonus d'XP doublé.
  featuredId?: GameModeId | null
  // Fantômes réels des amis (duels asynchrones, duel_recordings).
  ghosts?: FriendGhost[]
}) {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('landing')
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [xp, setXp] = useState(0)
  const [saved, setSaved] = useState<boolean | null>(null)
  // Mode trajet : testé après montage (heure du téléphone de l'élève), pour
  // ne pas figer un état « en trajet » dans le HTML servi.
  const [commuteMode, setCommuteMode] = useState(false)
  const [commuteExploit, setCommuteExploit] = useState(false)

  useEffect(() => {
    if (commuteSlots.length === 0) return
    const check = () => setCommuteMode(isCommuteNow(commuteSlots))
    check()
    const id = setInterval(check, 60_000)
    return () => clearInterval(id)
  }, [commuteSlots])

  const item = items[index]
  const answered = selected !== null

  // Réponses de la session pour la répétition espacée (SRS + Revanche).
  const reviewsRef = useRef<ReviewAnswer[]>([])

  const start = () => {
    setPhase('playing')
    setIndex(0)
    setSelected(null)
    setRevealed(false)
    setCorrect(0)
    setXp(0)
    setSaved(null)
    reviewsRef.current = []
    sfx.flip()
  }

  // Arrête la session en cours : le chrono se démonte (le temps mesuré est
  // versé au compteur) et on revient à l'écran d'accueil du Défi.
  const stop = () => {
    sfx.tap()
    setPhase('landing')
    setIndex(0)
    setSelected(null)
    setRevealed(false)
    setCorrect(0)
    setXp(0)
    setSaved(null)
  }

  const finish = (finalCorrect: number, finalXp: number) => {
    // Exploit de trajet : le défi a été joué pendant un créneau de trajet.
    const exploit = isCommuteNow(commuteSlots)
    setCommuteExploit(exploit)
    const totalXp =
      finalXp +
      XP_RULES.challengeBonus +
      (exploit ? XP_RULES.commuteBonus : 0)
    setXp(totalXp)
    setPhase('done')
    sfx.complete()
    // L'XP envoyée n'est qu'un affichage local : le serveur la recalcule.
    recordChallenge(finalCorrect, items.length)
      .then((r) => setSaved(r.saved))
      .catch(() => setSaved(false))
    // Reprogramme chaque item dans la file « À revoir » (SRS + Revanche).
    recordReviewAnswers(reviewsRef.current).catch(() => {})
  }

  const next = (gained: boolean) => {
    if (item) {
      reviewsRef.current.push({
        kind: item.kind === 'question' ? 'question' : 'card',
        id: item.id,
        subject: item.subject,
        good: gained,
      })
    }
    const newCorrect = correct + (gained ? 1 : 0)
    const newXp = xp + (gained ? XP_RULES.challengePerCorrect : 0)
    setCorrect(newCorrect)
    setXp(newXp)
    if (index + 1 >= items.length) {
      finish(newCorrect, newXp)
    } else {
      setIndex((i) => i + 1)
      setSelected(null)
      setRevealed(false)
    }
  }

  // Sortie d'un mode : retour à l'accueil + rafraîchissement des stats
  // (le mode vient peut-être d'enregistrer un défi → série, XP, doneToday).
  const exitMode = () => {
    setPhase('landing')
    router.refresh()
  }

  // ------------------------------------------------------------ modes de jeu
  if (phase === 'blitz') {
    return <BlitzMode pool={pool} onExit={exitMode} />
  }
  if (phase === 'duel') {
    return (
      <DuelMode
        pool={pool}
        myLevel={level.level}
        ghosts={ghosts}
        onExit={exitMode}
      />
    )
  }
  if (phase === 'chrono') {
    return <ChronoMode pool={pool} onExit={exitMode} />
  }
  if (phase === 'survie') {
    return <SurvivalMode pool={pool} onExit={exitMode} />
  }
  if (phase === 'boss') {
    return <BossMode pool={pool} onExit={exitMode} />
  }

  // ---------------------------------------------------------------- landing
  if (phase === 'landing') {
    // Récompense affichée sur le GO : le potentiel du défi du jour.
    const dailyXp =
      items.length * XP_RULES.challengePerCorrect + XP_RULES.challengeBonus
    return (
      <div className="flex flex-col items-center gap-6 pt-2 text-center">
        {/* HUD : niveau à gauche, série à droite — l'écran d'accueil du jeu. */}
        <div className="grid w-full max-w-sm grid-cols-2 gap-2 text-left">
          <div className="pop-in flex items-center gap-2.5 rounded-2xl border bg-card p-3 shadow-sm">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-mono text-base font-extrabold text-primary tabular-nums">
              {level.level}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold">{level.title}</p>
              <div
                className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-label={`Progression vers le niveau ${level.level + 1}`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(level.progress * 100)}
              >
                <div
                  className="bar-fill h-full rounded-full bg-highlight"
                  style={{ width: `${Math.round(level.progress * 100)}%` }}
                />
              </div>
              <p className="mt-0.5 font-mono text-[10px] tabular-nums text-muted-foreground">
                {level.currentXp}
                {level.nextAt ? ` / ${level.nextAt}` : ''} XP
              </p>
            </div>
          </div>

          <div
            className="pop-in flex items-center gap-2.5 rounded-2xl border bg-card p-3 shadow-sm"
            style={{ animationDelay: '70ms' }}
          >
            <StreakMascot streak={streak} size={40} />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold">Série</p>
              <p className="text-[11px] leading-tight text-muted-foreground">
                {streak > 0
                  ? `${streak} jour${streak > 1 ? 's' : ''} d'affilée — continue !`
                  : 'Joue pour allumer ta flamme !'}
              </p>
            </div>
          </div>
        </div>

        {/* Mode trajet : visible seulement dans un créneau de trajet. */}
        {commuteMode ? (
          <p className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground">
            <BusFront className="size-4 text-highlight" />
            Mode trajet · +{XP_RULES.commuteBonus} XP bonus
            {commuteStreak > 0 ? (
              <span className="text-primary-foreground/75">
                · {commuteStreak} d&apos;affilée
              </span>
            ) : null}
          </p>
        ) : null}

        {/* Sur le fond sombre de l'Arène, les textes posés à même le décor
            passent en blanc. */}
        <div className="space-y-1">
          <p className="text-[11px] font-bold tracking-widest text-white/80 uppercase">
            Défi du jour
          </p>
          <h1 className="font-heading text-3xl font-bold text-white">
            {doneToday
              ? 'Encore un, pour la gloire ?'
              : firstName
                ? `À toi de jouer, ${firstName} !`
                : 'À toi de jouer !'}
          </h1>
          <p className="text-sm text-white/70">
            {items.length} questions · environ 3 minutes ·{' '}
            {doneToday ? 'défi du jour déjà validé ✓' : 'valide ta journée'}
          </p>
        </div>

        {/* LE bouton — avec sa récompense affichée, comme un niveau de jeu. */}
        <div className="relative">
          {/* Anneau d'arcade : pointillés en rotation lente autour du GO. */}
          <span
            aria-hidden="true"
            className="go-ring pointer-events-none absolute -inset-2.5 rounded-full border-2 border-dashed border-white/30"
          />
          <button
            type="button"
            onClick={start}
            disabled={items.length === 0}
            className={cn(
              'group relative flex size-36 flex-col items-center justify-center gap-1 overflow-hidden rounded-full bg-primary text-primary-foreground shadow-xl shadow-black/40 ring-2 ring-white/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-40',
              !doneToday && items.length > 0 && 'go-pulse',
            )}
          >
            {/* Reflet en haut du bouton : le « bouton d'arcade ». */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-4 top-2 h-14 rounded-full bg-gradient-to-b from-white/20 to-transparent"
            />
            <Zap className="size-10 transition-transform group-hover:rotate-12" />
            <span className="font-heading text-xl font-bold">GO</span>
          </button>

          {items.length > 0 && !doneToday ? (
            <span
              className="pop-spring absolute -top-1 -right-8 rotate-6 rounded-full bg-highlight px-2.5 py-1 font-mono text-xs font-bold shadow-md tabular-nums"
              style={{ animationDelay: '500ms' }}
            >
              +{dailyXp} XP
            </span>
          ) : null}
        </div>

        {items.length === 0 ? (
          <p className="max-w-xs text-sm text-white/70">
            Pas encore de contenu pour ta classe — reviens bientôt !
          </p>
        ) : null}

        {/* L'Arène : les modes compétitifs, sous le rituel quotidien.
            Sans cadre ni décor : les tuiles colorées respirent sur le fond
            de la page. */}
        <section className="w-full max-w-sm pt-2 text-left" aria-label="L’Arène">
          <div className="mb-5 flex items-center gap-3">
            <span aria-hidden="true" className="h-px flex-1 bg-white/25" />
            <h2 className="font-heading flex items-center gap-1.5 text-base font-extrabold tracking-widest text-white uppercase italic">
              <Swords className="size-4.5" /> L’Arène
            </h2>
            <span aria-hidden="true" className="h-px flex-1 bg-white/25" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {GAME_MODES.map((mode, i) => {
              const status = modeStatus(mode, level.level)
              const playable = status === 'playable'
              const isBoss = mode.id === 'boss'
              // Mode du jour : bonus doublé, tuile cerclée d'or.
              const featured = playable && mode.id === featuredId
              const xpChip =
                MODE_XP_BONUS[mode.id] * (featured ? FEATURED_XP_MULTIPLIER : 1)
              // La tuile Boss annonce le personnage : matière dominante du pool.
              const arenaBoss = isBoss
                ? bossForSubject(dominantSubject(pool))
                : null
              const Icon = MODE_ICONS[mode.id]
              const image = playable ? modeImage(mode.id) : undefined
              const buttonImage = playable
                ? modeButtonImage(mode.id)
                : undefined

              // L'image EST le bouton : carte sombre à halo, titre du mode
              // intégré au visuel. On ne surimprime que la pastille XP (dans
              // la moitié basse de la carte, laissée vide) et le badge du
              // mode du jour ; le nom et la promesse passent en aria-label.
              if (buttonImage) {
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => {
                      sfx.tap()
                      setPhase(mode.id)
                    }}
                    aria-label={`${mode.name} — ${mode.tagline}`}
                    className="pop-in group flex items-center transition-transform hover:scale-[1.03] active:scale-95"
                    style={{ animationDelay: `${120 + i * 90}ms` }}
                  >
                    <span className="relative w-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={buttonImage}
                        alt=""
                        aria-hidden="true"
                        className={cn('h-auto w-full', MODE_BUTTON_ANIM[mode.id])}
                      />
                      {featured ? (
                        <span className="absolute top-[6%] left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-highlight px-2 py-0.5 text-[9px] font-extrabold tracking-widest whitespace-nowrap text-foreground uppercase">
                          <Star className="size-2.5" aria-hidden="true" /> Mode
                          du jour
                        </span>
                      ) : null}
                      <span
                        className={cn(
                          'absolute inset-x-0 bottom-[14%] mx-auto w-fit rotate-3 rounded-full border border-white/30 px-2 py-0.5 font-mono text-[10px] font-bold shadow-sm tabular-nums',
                          featured
                            ? 'bg-highlight text-foreground'
                            : TILE_CHIP[mode.id],
                        )}
                      >
                        +{xpChip} XP{featured ? ' ·×2' : ''}
                      </span>
                    </span>
                  </button>
                )
              }

              return (
                <button
                  key={mode.id}
                  type="button"
                  disabled={!playable}
                  onClick={() => {
                    sfx.tap()
                    setPhase(mode.id)
                  }}
                  className={cn(
                    'pop-in group relative flex flex-col gap-2 overflow-hidden rounded-2xl p-3 text-left',
                    playable
                      ? cn('press-3d-deep arena-tile', TILE_CLASS[mode.id])
                      : 'border border-dashed bg-card opacity-70 shadow-sm',
                    isBoss && 'col-span-2 ring-2 ring-highlight/60 ring-inset',
                    featured && 'ring-2 ring-highlight ring-inset',
                  )}
                  style={{ animationDelay: `${120 + i * 90}ms` }}
                >
                  {/* L'affiche du mode : l'illustration cartoon si elle est
                      déposée, sinon l'icône en filigrane géant, penchée. */}
                  {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={image}
                      alt=""
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-2 -bottom-3 h-24 w-auto max-w-[45%] rotate-6 object-contain object-bottom drop-shadow-[0_3px_6px_rgba(0,0,0,0.35)] transition-transform group-hover:rotate-3 group-hover:scale-105"
                    />
                  ) : (
                    <Icon
                      aria-hidden="true"
                      className="absolute -right-3 -bottom-4 size-24 rotate-12 text-white/10 transition-transform group-hover:rotate-6"
                    />
                  )}
                  <span className="relative flex items-start justify-between">
                    <span
                      className={cn(
                        'flex size-10 items-center justify-center rounded-xl',
                        playable
                          ? isBoss
                            ? 'bg-highlight/15 text-highlight'
                            : 'bg-white/20'
                          : 'bg-muted text-muted-foreground',
                      )}
                    >
                      {arenaBoss ? (
                        <span aria-hidden="true" className="wiggle-on-hover text-2xl">
                          {arenaBoss.emoji}
                        </span>
                      ) : (
                        <Icon className="wiggle-on-hover size-5" />
                      )}
                    </span>
                    {playable ? (
                      <span
                        className={cn(
                          'rotate-3 rounded-full border border-white/30 px-2 py-0.5 font-mono text-[10px] font-bold shadow-sm tabular-nums',
                          featured
                            ? 'bg-highlight text-foreground'
                            : TILE_CHIP[mode.id],
                        )}
                      >
                        +{xpChip} XP{featured ? ' ·×2' : ''}
                      </span>
                    ) : status === 'locked' ? (
                      <span className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                        <Lock className="size-3" aria-hidden="true" /> Niv.{' '}
                        {mode.unlockLevel}
                      </span>
                    ) : (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                        Bientôt
                      </span>
                    )}
                  </span>
                  {featured ? (
                    <span className="relative -mb-1 flex items-center gap-1 self-start rounded-full bg-highlight px-2 py-0.5 text-[9px] font-extrabold tracking-widest text-foreground uppercase">
                      <Star className="size-2.5" aria-hidden="true" /> Mode du
                      jour
                    </span>
                  ) : null}
                  <span className="relative flex-1">
                    <span
                      className={cn(
                        'font-heading block text-base leading-tight font-extrabold tracking-tight uppercase italic',
                        mode.id !== 'blitz' &&
                          'drop-shadow-[0_1.5px_0_rgba(0,0,0,0.35)]',
                      )}
                    >
                      {arenaBoss ? `Boss : ${arenaBoss.name}` : mode.name}
                    </span>
                    <span className="block text-xs leading-snug opacity-80">
                      {arenaBoss
                        ? `${arenaBoss.epithet} garde ton chapitre fragile`
                        : mode.tagline}
                    </span>
                  </span>
                  {playable ? (
                    <span className="relative text-xs font-extrabold tracking-wide uppercase">
                      Jouer ›
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>
        </section>
      </div>
    )
  }

  // ---------------------------------------------------------------- done
  if (phase === 'done') {
    const ratio = items.length > 0 ? correct / items.length : 0
    return (
      <div className="flex flex-col items-center gap-5 pt-8 text-center">
        <div className="animate-in zoom-in text-6xl duration-500">
          {ratio >= 0.8 ? '🏆' : ratio >= 0.5 ? '💪' : '🌱'}
        </div>
        <div>
          <h1 className="font-heading text-3xl font-bold text-white">
            {ratio >= 0.8
              ? 'Excellent !'
              : ratio >= 0.5
                ? 'Bien joué !'
                : 'C’est un début !'}
          </h1>
          <p className="mt-1 text-white/75">
            {correct}/{items.length} bonnes réponses
          </p>
        </div>

        <div className="animate-in slide-in-from-bottom-2 flex items-center gap-2 rounded-full bg-highlight px-6 py-3 font-mono text-2xl font-bold text-foreground shadow-lg duration-700 tabular-nums">
          <Zap className="size-6" /> +{xp} XP
        </div>

        {/* Exploit de trajet : le temps mort est devenu de l'XP. */}
        {commuteExploit ? (
          <p className="animate-in fade-in flex items-center gap-1.5 text-sm font-semibold text-white duration-700">
            <BusFront className="size-4 text-highlight" />
            Exploit de trajet ! +{XP_RULES.commuteBonus} XP bonus inclus
          </p>
        ) : null}

        <p className="text-sm text-white/75">
          {saved === true
            ? '✓ Journée validée — ta série continue 🔥'
            : saved === false
              ? 'Session non enregistrée (connecte-toi pour garder ton XP).'
              : ''}
        </p>

        <div className="flex gap-2">
          <Button onClick={() => router.refresh()} variant="outline">
            <RotateCcw className="size-4" /> Nouveau défi
          </Button>
          <Button onClick={() => router.push('/moi')}>Voir mes progrès</Button>
        </div>
      </div>
    )
  }

  // ---------------------------------------------------------------- playing
  if (!item) return null

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-3">
      {/* Chrono de la session, démarré au GO. */}
      <DefiTimer />

      {/* Bouton d'arrêt rond, flottant en bas à droite (au-dessus de la barre
          d'onglets sur mobile). */}
      <button
        type="button"
        onClick={stop}
        aria-label="Arrêter la session"
        title="Arrêter la session"
        className="fixed right-4 bottom-24 z-40 flex size-14 items-center justify-center rounded-full border-4 border-background bg-card text-2xl shadow-lg ring-2 ring-destructive/30 transition-all hover:bg-muted active:scale-90 md:right-8 md:bottom-8"
      >
        <span aria-hidden="true">❌</span>
      </button>

      <div className="flex items-center justify-between text-sm text-white/75">
        <span className="font-mono tabular-nums">
          {index + 1}/{items.length}
        </span>
        <span className="flex items-center gap-1 font-mono font-semibold text-white tabular-nums">
          <Zap className="size-3.5 text-highlight" /> {xp} XP
        </span>
        <SoundToggle />
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-white/20"
        role="progressbar"
        aria-label="Progression du défi"
        aria-valuemin={0}
        aria-valuemax={items.length}
        aria-valuenow={index}
        aria-valuetext={`Question ${index + 1} sur ${items.length}`}
      >
        <div
          className="h-full rounded-full bg-highlight transition-all"
          style={{ width: `${(index / items.length) * 100}%` }}
        />
      </div>

      {item.subject ? (
        <p className="text-xs font-semibold text-white/70 uppercase">
          {item.subject}
        </p>
      ) : null}

      {item.kind === 'question' ? (
        <div className="flex flex-col gap-2">
          <h2 className="font-heading mb-1 text-xl font-bold text-balance text-white">
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
                  // bg-card : les options restent des cartes claires lisibles
                  // sur le fond d'écran sombre de l'Arène.
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

          {/* Retour juste/faux : annoncé et lisible, pas seulement la couleur. */}
          <p
            role="status"
            aria-live="polite"
            className={cn(
              'text-sm font-semibold',
              !answered && 'sr-only',
              answered &&
                selected === item.correctIndex &&
                'text-green-300',
              answered &&
                selected !== item.correctIndex &&
                'text-red-300',
            )}
          >
            {answered
              ? selected === item.correctIndex
                ? 'Bonne réponse ✓'
                : 'Mauvaise réponse ✗'
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
