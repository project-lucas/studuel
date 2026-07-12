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
} from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { sfx, isSoundOn, setSoundOn } from '@/lib/sounds'
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
  const [finished, setFinished] = useState(false)
  const [saved, setSaved] = useState<boolean | null>(null)

  const current = queue[0]
  const knownCount = cards.length - queue.length

  const flip = () => {
    if (!flipped) {
      sfx.flip()
      setFlipped(true)
    }
  }

  // Résultat au premier passage de chaque carte : c'est le signal envoyé à la
  // répétition espacée (une carte reprise en fin de pile a déjà été « ratée »).
  const reviewsRef = useRef<ReviewAnswer[]>([])

  const answer = (known: boolean) => {
    if (!current) return
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

    const rest = queue.slice(1)
    if (known) {
      sfx.correct()
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
    setReviews(0)
    setFirstTryKnown(0)
    setSeen(new Set())
    setFinished(false)
    setSaved(null)
    reviewsRef.current = []
  }

  if (finished) {
    const rate = Math.round((firstTryKnown / cards.length) * 100)
    return (
      <Card className="mx-auto max-w-xl">
        <CardHeader>
          <CardTitle>Deck terminé ! 🎉</CardTitle>
          <CardDescription>{title}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="font-mono text-4xl font-bold tabular-nums">
            {rate}
            <span className="text-muted-foreground/60"> %</span>
          </p>
          <p className="text-sm text-muted-foreground">
            {rate === 100
              ? 'Toutes les cartes sues du premier coup — impressionnant !'
              : `${firstTryKnown}/${cards.length} cartes sues du premier coup, en ${reviews} passages. La répétition paie !`}
          </p>
          {saved === true ? (
            <p className="text-xs text-muted-foreground">
              ✓ Session enregistrée — ta série continue 🔥
            </p>
          ) : saved === false ? (
            <p className="text-xs text-muted-foreground">
              <Link href="/login" className="underline underline-offset-4">
                Connecte-toi
              </Link>{' '}
              pour faire compter cette session dans ta série.
            </p>
          ) : null}
        </CardContent>
        <CardFooter className="gap-2">
          <Button onClick={restart}>
            <RotateCcw className="size-4" /> Recommencer
          </Button>
          <Button variant="outline" asChild>
            <Link href="/studio">
              <ArrowLeft className="size-4" /> Retour au Studio
            </Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  if (!current) return null

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-3">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span className="font-mono tabular-nums">
          {knownCount}/{cards.length} sues
        </span>
        <SoundToggle />
      </div>

      {/* Barre de progression */}
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-label="Cartes sues"
        aria-valuemin={0}
        aria-valuemax={cards.length}
        aria-valuenow={knownCount}
        aria-valuetext={`${knownCount} sur ${cards.length} cartes sues`}
      >
        <div
          className="bar-fill h-full rounded-full bg-highlight transition-all"
          style={{ width: `${(knownCount / cards.length) * 100}%` }}
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
          className="border-amber-500/40 text-amber-700 hover:bg-amber-500/10 dark:text-amber-400"
        >
          <Undo2 className="size-4" /> À revoir
        </Button>
        <Button
          size="lg"
          tabIndex={flipped ? undefined : -1}
          onClick={() => answer(true)}
          className="bg-green-600 text-white hover:bg-green-600/85"
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
