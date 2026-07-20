'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import {
  RotateCcw,
  ArrowLeft,
  Check,
  Undo2,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { sfx, buzz, isSoundOn, setSoundOn } from '@/lib/sounds'
import ComboBadge from '@/components/ComboBadge'
import ConfettiRain from '@/components/ConfettiRain'
import QuitGuardButton from '@/components/QuitGuardButton'
import { bestStreak, COMBO_HOT } from '@/lib/juice'
import { sessionXp } from '@/lib/xp'
import { deckProgress } from '@/lib/flashcards'
import { recordStudySession } from '@/app/studio/actions'
import { recordReviewAnswers } from '@/app/reviser/actions'
import type { ReviewAnswer } from '@/lib/srs'
import type { DeckCard } from '@/lib/types'

// Bouton muet partagé (préférence localStorage).
export function SoundToggle() {
  const [on, setOn] = useState(() => isSoundOn())
  return (
    <button
      type="button"
      aria-label={on ? 'Couper le son' : 'Activer le son'}
      title={on ? 'Couper le son' : 'Activer le son'}
      onClick={() => {
        setSoundOn(!on)
        setOn(!on)
      }}
      className="text-muted-foreground transition-colors hover:text-foreground"
    >
      {on ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
    </button>
  )
}

// Boucle façon Wooflash : une carte marquée « À revoir » revient en fin de
// pile — la session se termine quand tout est su.
export default function FlashcardPlayer({
  deckId,
  title,
  cards,
  subject = null,
}: {
  deckId: string
  title: string
  cards: DeckCard[]
  subject?: string | null
}) {
  const [queue, setQueue] = useState<DeckCard[]>(cards)
  const [flipped, setFlipped] = useState(false)
  const [reviews, setReviews] = useState(0)
  const [firstTryKnown, setFirstTryKnown] = useState(0)
  const [seen, setSeen] = useState<Set<string>>(new Set())
  // Cartes sues d'affilée (remise à zéro dès qu'une carte n'est pas sue).
  const [streak, setStreak] = useState(0)
  // Meilleure série de la session : sans elle, un « Inarrêtable ×8 » atteint en
  // cours de route ne laisse aucune trace sur l'écran de fin.
  const [best, setBest] = useState(0)
  const [finished, setFinished] = useState(false)
  const [saved, setSaved] = useState<boolean | null>(null)

  const current = queue[0]
  const progress = deckProgress(
    cards.length,
    queue.map((c) => c.id),
    seen,
  )

  // Verrou synchrone anti-double-tap : le state (flipped) est en retard d'un
  // rendu, donc deux clics rapides sur « Je savais » rejoueraient answer() sur
  // la même carte (double session + double SRS sur la dernière). Le ref bloque
  // le 2e clic ; il se relâche au flip de la carte suivante.
  const lockRef = useRef(false)

  const flip = () => {
    if (!flipped) {
      sfx.flip()
      setFlipped(true)
      lockRef.current = false
    }
  }

  // Résultat au premier passage de chaque carte : c'est le signal envoyé à la
  // répétition espacée (une carte reprise en fin de pile a déjà été « ratée »).
  const reviewsRef = useRef<ReviewAnswer[]>([])

  const answer = (known: boolean) => {
    if (!current || lockRef.current) return
    lockRef.current = true
    setReviews((r) => r + 1)
    const firstTry = !seen.has(current.id)
    setSeen((s) => new Set(s).add(current.id))
    if (firstTry) {
      reviewsRef.current.push({
        kind: 'card',
        id: current.id,
        subject,
        good: known,
      })
    }

    // Série en cours : la récompense monte tant que l'élève enchaîne les
    // cartes sues, et retombe net dès qu'une carte lui échappe.
    const nextStreak = known ? streak + 1 : 0
    setStreak(nextStreak)
    setBest((b) => bestStreak(b, nextStreak))
    buzz(known, nextStreak)

    const rest = queue.slice(1)
    if (known) {
      sfx.correctCombo(nextStreak)
      if (firstTry) setFirstTryKnown((n) => n + 1)
      if (rest.length === 0) {
        setFinished(true)
        sfx.complete()
        recordStudySession(deckId, cards.length)
          .then((r) => setSaved(r.saved))
          .catch(() => setSaved(false))
        // Reprogramme chaque carte dans la file « À revoir ».
        recordReviewAnswers(reviewsRef.current).catch(() => {})
      }
      setQueue(rest)
    } else {
      sfx.wrong()
      setQueue([...rest, current]) // la carte reviendra en fin de pile
    }
    setFlipped(false)
  }

  const restart = () => {
    setQueue(cards)
    setFlipped(false)
    setStreak(0)
    setBest(0)
    setReviews(0)
    setFirstTryKnown(0)
    setSeen(new Set())
    setFinished(false)
    setSaved(null)
    reviewsRef.current = []
    lockRef.current = false
  }

  if (finished) {
    const rate = Math.round((firstTryKnown / cards.length) * 100)

    return (
      // `key` explicite sur chaque branche : le démontage de l'écran de jeu
      // (et donc de l'état de ComboBadge) ne doit pas dépendre de l'alignement
      // positionnel des deux arbres JSX.
      <div
        key="deck-fin"
        className="relative mx-auto flex max-w-xl flex-col items-center gap-4 overflow-hidden rounded-3xl bg-primary px-6 py-10 text-center text-primary-foreground"
      >
        {/* L'écran de fin était une carte nue, face au volet plein écran du
            quiz : un élève qui retourne 20 cartes recevait MOINS de récompense
            que celui qui répond à 5 questions. */}
        {rate >= 80 ? <ConfettiRain /> : null}

        <div className="relative flex flex-col items-center gap-4">
          <span className="animate-in zoom-in text-6xl duration-500" aria-hidden="true">
            {rate === 100 ? '🤩' : rate >= 80 ? '😎' : rate >= 50 ? '🙂' : '🌱'}
          </span>

          <div>
            <h1 className="font-heading text-2xl font-bold">Deck terminé !</h1>
            <p className="mt-1 text-sm opacity-80">{title}</p>
          </div>

          <p className="font-mono text-6xl font-bold tabular-nums">
            {rate}
            <span className="text-2xl opacity-60"> %</span>
          </p>

          <p className="font-heading text-lg font-extrabold text-highlight">
            +{sessionXp('deck', cards.length, cards.length)} XP
          </p>

          {best >= COMBO_HOT ? (
            <p className="text-sm font-semibold opacity-90">
              🔥 Meilleure série : {best} d&apos;affilée
            </p>
          ) : null}

          <p className="max-w-xs text-sm opacity-90">
            {rate === 100
              ? 'Toutes les cartes sues du premier coup — impressionnant !'
              : `${firstTryKnown}/${cards.length} cartes sues du premier coup, en ${reviews} passages. La répétition paie !`}
          </p>

          {saved === true ? (
            <p className="text-xs opacity-80">
              ✓ Session enregistrée — ta série continue 🔥
            </p>
          ) : saved === false ? (
            <p className="text-xs opacity-80">
              <Link href="/login" className="underline underline-offset-4">
                Connecte-toi
              </Link>{' '}
              pour faire compter cette session dans ta série.
            </p>
          ) : null}

          <div className="mt-2 flex w-full flex-col gap-2">
            <Button
              onClick={restart}
              size="lg"
              className="w-full rounded-full bg-card text-foreground shadow-md hover:bg-card/90"
            >
              <RotateCcw className="size-4" /> Recommencer
            </Button>
            <Button
              variant="ghost"
              asChild
              size="lg"
              className="w-full rounded-full text-primary-foreground hover:bg-white/10"
            >
              <Link href="/studio">
                <ArrowLeft className="size-4" /> Retour au Studio
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!current) return null

  return (
    <div key="deck-session" className="mx-auto flex max-w-xl flex-col gap-3">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        {/* Croix « quitter » gardée : la session du deck serait perdue, on
            confirme avant de sortir (même pattern que le quiz). */}
        <QuitGuardButton fallback="/studio" label="Quitter le deck">
          <X className="size-5" aria-hidden="true" />
        </QuitGuardButton>
        {/* « 8 sues · 3 à repasser » : sans le second chiffre, l'élève qui
            bloque sur quelques cartes voit un compteur figé et ne sait pas
            combien il lui reste. */}
        <span className="font-mono tabular-nums">
          {progress.known}/{cards.length} sues
          {progress.toRedo > 0 ? (
            <span className="text-muted-foreground/70">
              {' · '}
              {progress.toRedo} à repasser
            </span>
          ) : null}
        </span>
        {/* Badge de SÉRIE : apparaît à partir de 2 cartes sues d'affilée et
            disparaît net dès qu'une carte échappe — même récompense que le
            quiz, pour que les deux formats se ressemblent. */}
        {/* Région `aria-live` toujours montée (cf. QuizPlayer) : un lecteur
            d'écran n'annonce que le changement d'une région déjà présente. */}
        <span aria-live="polite" className="min-h-6">
          <ComboBadge streak={streak} />
        </span>
        <SoundToggle />
      </div>

      {/* Barre de progression à DEUX segments : le clair marque les cartes
          déjà passées (il avance à chaque réponse, même ratée), le plein les
          cartes sues. Avec le seul segment plein, un élève bloqué sur 3 cartes
          voyait une barre parfaitement immobile. */}
      <div
        className="relative h-2 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-label="Cartes sues"
        aria-valuemin={0}
        aria-valuemax={cards.length}
        aria-valuenow={progress.known}
        aria-valuetext={
          progress.toRedo > 0
            ? `${progress.known} sur ${cards.length} cartes sues, ${progress.toRedo} à repasser`
            : `${progress.known} sur ${cards.length} cartes sues`
        }
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-highlight/40 transition-all"
          style={{ width: `${progress.seenRatio * 100}%` }}
        />
        <div
          className="bar-fill absolute inset-y-0 left-0 rounded-full bg-highlight transition-all"
          style={{ width: `${progress.knownRatio * 100}%` }}
        />
      </div>

      {/* La carte 3D : clic pour retourner */}
      <button
        type="button"
        onClick={flip}
        aria-label={flipped ? 'Réponse affichée' : 'Retourner la carte'}
        className="h-64 w-full [perspective:1200px]"
      >
        <div
          className={cn(
            'relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]',
            flipped && '[transform:rotateY(180deg)]',
          )}
        >
          {/* Recto — masqué au lecteur d'écran quand la carte est retournée */}
          <div
            aria-hidden={flipped}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-card p-6 text-center ring-1 ring-foreground/10 [backface-visibility:hidden]"
          >
            <p className="font-heading text-2xl font-semibold text-balance">
              {current.front}
            </p>
            <p className="text-xs text-muted-foreground">
              Touche la carte pour voir la réponse
            </p>
          </div>
          {/* Verso — masqué (et non lu) tant que la réponse n'est pas révélée */}
          <div
            aria-hidden={!flipped}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-primary p-6 text-center text-primary-foreground ring-1 ring-foreground/10 [backface-visibility:hidden] [transform:rotateY(180deg)]"
          >
            <p className="text-lg font-medium text-balance">{current.back}</p>
          </div>
        </div>
      </button>

      {/* Réponses — visibles (et focusables) une fois la carte retournée */}
      <div
        aria-hidden={!flipped}
        className={cn(
          'grid grid-cols-2 gap-2 transition-opacity',
          !flipped && 'pointer-events-none opacity-0',
        )}
      >
        <Button
          variant="outline"
          size="lg"
          tabIndex={flipped ? undefined : -1}
          onClick={() => answer(false)}
          className="border-warning/40 text-warning hover:bg-warning/10"
        >
          <Undo2 className="size-4" /> À revoir
        </Button>
        <Button
          size="lg"
          tabIndex={flipped ? undefined : -1}
          onClick={() => answer(true)}
          className="bg-success text-success-foreground hover:bg-success/85"
        >
          <Check className="size-4" /> Je savais
        </Button>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Les cartes « À revoir » reviennent en fin de pile, jusqu&apos;à ce que
        tu saches tout.
      </p>
    </div>
  )
}
