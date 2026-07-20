'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Zap,
  Check,
  X,
  ArrowLeft,
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
  HandHeart,
  CornerDownRight,
  Target,
  Trophy,
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
import LiveDuelMode from '@/components/LiveDuelMode'
import ChronoMode from '@/components/ChronoMode'
import SurvivalMode from '@/components/SurvivalMode'
import BossMode from '@/components/BossMode'
import RankedMode from '@/components/RankedMode'
import RankedHero from '@/components/RankedHero'
import CoopMode from '@/components/CoopMode'
import ModeStage from '@/components/defi/ModeStage'
import type { RankPlayer } from '@/lib/trophies'
import { bossForSubject, dominantSubject } from '@/lib/bosses'
import { XP_RULES, type LevelInfo } from '@/lib/xp'
import { isCommuteNow } from '@/lib/trajet'
import type { CommuteSlot } from '@/lib/types'
import { recordChallenge } from '@/app/defi/actions'
import { recordReviewAnswers } from '@/app/reviser/actions'
import { submitDuelScore } from '@/app/amis/actions'
import { ACTIVE_DUEL_KEY } from '@/lib/social'
import type { ReviewAnswer } from '@/lib/srs'
import type { FriendGhost } from '@/lib/social'
import {
  GAME_MODES,
  MODE_XP_BONUS,
  FEATURED_XP_MULTIPLIER,
  modeImage,
  modeStatus,
  ROUND_SIZE,
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
  | 'duel-live'
  | 'chrono'
  | 'survie'
  | 'boss'
  | 'ranked'
  | 'coop'

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
  userId = null,
  trophies: trophiesProp = 0,
  bestTrophies = 0,
  friendRanks = [],
  examFocus = null,
  initialMode = null,
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
  // Identifiant de l'élève : requis pour le duel en temps réel (Realtime).
  userId?: string | null
  // Classement compétitif : mes trophées, mon record, et ceux de mes amis.
  trophies?: number
  bestTrophies?: number
  friendRanks?: RankPlayer[]
  // Contrôles à venir déclarés sur Moi : le Défi pioche dans leurs chapitres.
  // Titres montrés en bannière (« Révise ton contrôle : … »).
  examFocus?: { titles: string[] } | null
  // Mode ouvert directement à l'arrivée (lien profond /defi/jouer?mode=…) :
  // un id de mode, 'ranked', ou null pour l'accueil de la salle de jeu.
  initialMode?: GameModeId | 'ranked' | null
}) {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>(initialMode ?? 'landing')
  // Trophées suivis localement : le match classé les met à jour tout de suite
  // (le serveur reste la source de vérité, re-tirée au retour à l'accueil).
  const [trophies, setTrophies] = useState(trophiesProp)
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
    // Duel en cours (lancé/relevé depuis l'onglet Amis) : dépose mon score une
    // seule fois, puis oublie le duel. submit_duel_score borne côté SQL.
    try {
      const duelId = sessionStorage.getItem(ACTIVE_DUEL_KEY)
      if (duelId) {
        sessionStorage.removeItem(ACTIVE_DUEL_KEY)
        submitDuelScore(duelId, finalCorrect).catch(() => {})
      }
    } catch {
      /* sessionStorage indispo : pas de duel à créditer */
    }
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

  // Sortie d'un mode. Entrée profonde (?mode=… depuis l'écran d'arène) : on
  // retourne À L'ARÈNE, pas à la salle d'entraînement — celle-ci rejouerait
  // trophées/Match classé/grille des modes déjà présents sur /defi. Sinon (on
  // était sur la salle d'entraînement), on revient à son accueil + on rafraîchit
  // les stats (le mode vient peut-être d'enregistrer un défi → série, XP…).
  const exitMode = () => {
    if (initialMode !== null) {
      router.push('/defi')
      return
    }
    setPhase('landing')
    router.refresh()
  }

  // ------------------------------------------------------------ modes de jeu
  // Chaque mode joue désormais dans une PAGE plein cadre opaque (ModeStage) :
  // fini le calque posé sur l'image d'arène qui rendait les questions
  // illisibles. Teinte `light` (crème) pour les modes conçus clairs, `dark`
  // (violet uni) pour les modes compétitifs conçus sombres — aucun mode n'est
  // repeint, on ne fait que leur rendre le fond pour lequel ils sont dessinés.
  if (phase === 'blitz') {
    return (
      <ModeStage title="Blitz 60s" Icon={Timer} onExit={exitMode}>
        <BlitzMode pool={pool} onExit={exitMode} />
      </ModeStage>
    )
  }
  if (phase === 'duel') {
    return (
      <ModeStage title="Duel fantôme" Icon={Swords} onExit={exitMode}>
        <DuelMode
          pool={pool}
          myLevel={level.level}
          ghosts={ghosts}
          onExit={exitMode}
        />
      </ModeStage>
    )
  }
  if (phase === 'duel-live' && userId) {
    return (
      <ModeStage title="Duel en direct" Icon={Swords} onExit={exitMode}>
        <LiveDuelMode
          userId={userId}
          pool={pool}
          subject={dominantSubject(pool)}
          myLevel={level.level}
          onExit={exitMode}
        />
      </ModeStage>
    )
  }
  if (phase === 'chrono') {
    return (
      <ModeStage title="Contre-la-montre" Icon={Hourglass} onExit={exitMode}>
        <ChronoMode pool={pool} onExit={exitMode} />
      </ModeStage>
    )
  }
  if (phase === 'survie') {
    return (
      <ModeStage title="Survie" Icon={Skull} onExit={exitMode}>
        <SurvivalMode pool={pool} onExit={exitMode} />
      </ModeStage>
    )
  }
  if (phase === 'boss') {
    return (
      <ModeStage title="Boss" Icon={Crown} onExit={exitMode}>
        <BossMode pool={pool} onExit={exitMode} />
      </ModeStage>
    )
  }
  if (phase === 'ranked') {
    return (
      <ModeStage title="Match classé" Icon={Trophy} tone="dark" onExit={exitMode}>
        <RankedMode
          pool={pool}
          myTrophies={trophies}
          friends={friendRanks}
          onResult={(after) => setTrophies(after)}
          onExit={exitMode}
        />
      </ModeStage>
    )
  }
  if (phase === 'coop' && userId) {
    return (
      <ModeStage title="Mode Coop" Icon={HandHeart} tone="dark" onExit={exitMode}>
        <CoopMode
          userId={userId}
          pool={pool}
          subject={dominantSubject(pool)}
          onExit={exitMode}
        />
      </ModeStage>
    )
  }

  // ---------------------------------------------------------------- landing
  if (phase === 'landing') {
    // Récompense affichée sur le GO : le potentiel du défi du jour.
    const dailyXp =
      items.length * XP_RULES.challengePerCorrect + XP_RULES.challengeBonus
    // Classement : moi (trophées suivis localement) + mes amis.
    const rankedPlayers: RankPlayer[] = [
      {
        id: 'me',
        name: firstName ?? 'Toi',
        emoji: '🔥',
        trophies,
        isMe: true,
      },
      ...friendRanks,
    ]
    return (
      <div className="flex flex-col items-center gap-6 pt-2 text-center">
        {/* Retour vers l'écran d'arène : la salle de jeu est une sous-page,
            l'élève ne doit jamais y rester coincé (libellé standard). */}
        <Link
          href="/defi"
          onClick={() => sfx.tap()}
          className="flex items-center gap-1.5 self-start text-sm font-bold text-white/70 transition-colors hover:text-white"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Retour à l&apos;arène
        </Link>

        {/* LE classement : hero de l'onglet, mode classé par défaut. */}
        <RankedHero
          trophies={trophies}
          bestTrophies={Math.max(bestTrophies, trophies)}
          players={rankedPlayers}
          onPlay={() => {
            sfx.tap()
            setPhase('ranked')
          }}
        />

        {/* HUD : niveau à gauche, série à droite — l'écran d'accueil du jeu. */}
        <div className="grid w-full max-w-sm grid-cols-2 gap-2 text-left">
          <div className="pop-in flex items-center gap-2.5 rounded-2xl bg-card p-3 shadow-sm ring-1 ring-black/5">
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
            className="pop-in flex items-center gap-2.5 rounded-2xl bg-card p-3 shadow-sm ring-1 ring-black/5"
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

        {/* Défi du jour — carte « clay » violette qui appelle le bouton GO
            flottant (même couleur d'action). Contour clair + reflet doux =
            langage claymorphism, cohérent avec le reste du monde Studuel. */}
        <section aria-label="Défi du jour" className="w-full max-w-sm text-left">
          <div className="relative overflow-hidden rounded-3xl border-2 border-white/15 bg-primary p-4 text-primary-foreground shadow-xl shadow-black/30">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/12 to-transparent"
            />
            <div className="relative flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-bold tracking-widest text-highlight uppercase">
                  Défi du jour
                </p>
                <h1 className="font-heading mt-0.5 text-2xl font-bold text-balance">
                  {doneToday
                    ? 'Encore un, pour la gloire ?'
                    : firstName
                      ? `À toi de jouer, ${firstName} !`
                      : 'À toi de jouer !'}
                </h1>
                <p className="mt-1 text-sm text-primary-foreground/80">
                  {items.length} questions · environ 3 minutes ·{' '}
                  {doneToday ? 'déjà validé ✓' : 'valide ta journée'}
                </p>
                {examFocus && examFocus.titles.length > 0 ? (
                  <p className="mt-2 inline-flex max-w-full items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-primary-foreground ring-1 ring-white/25">
                    <Target
                      className="size-3.5 shrink-0 text-highlight"
                      aria-hidden="true"
                    />
                    <span className="truncate">
                      Révise ton contrôle : {examFocus.titles[0]}
                      {examFocus.titles.length > 1
                        ? ` +${examFocus.titles.length - 1}`
                        : ''}
                    </span>
                  </p>
                ) : null}
              </div>
              {items.length > 0 && !doneToday ? (
                <span className="flex shrink-0 items-center gap-1 rounded-full bg-highlight px-2.5 py-1 font-mono text-xs font-bold text-foreground tabular-nums shadow-sm">
                  <Zap className="size-3.5" aria-hidden="true" />+{dailyXp} XP
                </span>
              ) : null}
            </div>
            {items.length > 0 ? (
              <p className="relative mt-3 flex items-center gap-1.5 text-xs font-semibold text-primary-foreground/85">
                <CornerDownRight className="size-4 text-highlight" aria-hidden="true" />
                Appuie sur le gros bouton{' '}
                <span className="font-heading font-extrabold">GO</span> en bas à
                droite
              </p>
            ) : (
              <p className="relative mt-3 text-sm text-primary-foreground/80">
                Pas encore de contenu pour ta classe — reviens bientôt !
              </p>
            )}
          </div>
        </section>

        {/* LE bouton du défi du jour — FAB flottant fixe, ancré en bas à droite,
            toujours visible au scroll, au-dessus du contenu, en zone sûre
            (safe-area) et dégagé de la barre d'onglets (mêmes offsets que le
            bouton d'arrêt de session). Contour marine + ombre dure décalée. */}
        <div
          className="fixed z-50 right-[calc(env(safe-area-inset-right)+1rem)] bottom-[calc(env(safe-area-inset-bottom)+6rem)] md:right-[calc(env(safe-area-inset-right)+2rem)] md:bottom-[calc(env(safe-area-inset-bottom)+2rem)]"
        >
          {/* Anneau d'arcade : pointillés en rotation lente autour du GO. */}
          <span
            aria-hidden="true"
            className="go-ring pointer-events-none absolute -inset-2 rounded-full border-2 border-dashed border-white/40"
          />
          <button
            type="button"
            onClick={start}
            disabled={items.length === 0}
            aria-label={
              doneToday
                ? 'Rejouer le défi du jour'
                : 'Lancer le défi du jour'
            }
            style={{
              boxShadow:
                '0 6px 0 0 var(--foreground), 0 14px 22px rgba(0,0,0,0.45)',
            }}
            className="group relative flex size-24 flex-col items-center justify-center gap-0.5 overflow-hidden rounded-full border-[3px] border-foreground bg-primary text-primary-foreground transition-transform hover:-translate-y-0.5 active:translate-y-1 active:scale-95 disabled:opacity-40"
          >
            {/* Reflet en haut du bouton : le « bouton d'arcade ». */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-3 top-1.5 h-9 rounded-full bg-gradient-to-b from-white/25 to-transparent"
            />
            <Zap className="size-8 transition-transform group-hover:rotate-12" />
            <span className="font-heading text-base leading-none font-bold">
              GO
            </span>
          </button>

          {items.length > 0 && !doneToday ? (
            <span
              className="pop-spring absolute -top-3 left-1/2 -translate-x-1/2 rotate-[-4deg] rounded-full border-2 border-foreground bg-highlight px-2 py-0.5 font-mono text-[11px] font-bold text-foreground shadow-md tabular-nums"
              style={{ animationDelay: '500ms' }}
            >
              +{dailyXp} XP
            </span>
          ) : null}
        </div>

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

              // Toutes les tuiles parlent le MÊME langage : carte 3D colorée
              // (couleur propre au mode), illustration cartoon en cartouche,
              // en-tête pastille icône + pastille XP, titre + promesse, « Jouer ».
              // Un seul chemin de rendu = grille cohérente d'un mode à l'autre.
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
                    'pop-in group relative flex min-h-36 flex-col gap-2 overflow-hidden rounded-2xl p-3 text-left',
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
                      className={cn(
                        'pointer-events-none absolute -right-2 -bottom-3 w-auto max-w-[46%] rotate-6 object-contain object-bottom drop-shadow-[0_3px_6px_rgba(0,0,0,0.35)] transition-transform group-hover:rotate-3 group-hover:scale-105',
                        isBoss ? 'h-28' : 'h-24',
                      )}
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

          {/* Jouer à deux, en temps réel (Realtime). Coop = entraide, Duel =
              affrontement — les deux se lancent par un code d'invitation. */}
          {userId ? (
            <div className="mt-4 flex flex-col gap-2.5">
              {pool.length >= 2 ? (
                <button
                  type="button"
                  onClick={() => {
                    sfx.tap()
                    setPhase('coop')
                  }}
                  className="press-3d-deep flex w-full items-center justify-center gap-2 rounded-2xl bg-highlight px-4 py-3.5 font-heading text-sm font-extrabold tracking-wide text-foreground uppercase italic ring-1 ring-black/10 transition-transform active:scale-[0.99]"
                >
                  <HandHeart className="size-4.5" aria-hidden="true" /> Mode Coop ·
                  à deux
                </button>
              ) : null}
              {pool.length >= ROUND_SIZE ? (
                <button
                  type="button"
                  onClick={() => {
                    sfx.tap()
                    setPhase('duel-live')
                  }}
                  className="press-3d-deep flex w-full items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-extrabold tracking-wide text-white uppercase ring-1 ring-white/25 transition-transform hover:scale-[1.01] active:scale-95"
                >
                  <Swords className="size-4" aria-hidden="true" /> Duel en direct
                  · par code
                </button>
              ) : null}
            </div>
          ) : null}
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
                  'flex items-center justify-between gap-3 rounded-2xl border bg-card px-4 py-3 text-left text-sm font-medium text-card-foreground transition-all',
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
