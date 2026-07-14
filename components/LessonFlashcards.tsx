'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Lightbulb, RotateCcw, RotateCw, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import {
  countReview,
  reviewDeck,
  type CardVerdict,
  type Flashcard,
} from '@/lib/flashcards'

// Lecteur de flashcards. Une carte à la fois : on clique dessus pour la faire
// PIVOTER sur elle-même (recto violet = question → verso jaune = réponse), puis
// on s'auto-évalue avec les deux boutons EN BAS de la carte (« Je le savais ! »
// / « À revoir »). Bilan de fin de paquet, avec rejeu des cartes ratées.
export default function LessonFlashcards({
  cards,
  backHref,
  title,
}: {
  cards: Flashcard[]
  backHref: string
  title: string
}) {
  const [deck, setDeck] = useState<Flashcard[]>(cards)
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [verdicts, setVerdicts] = useState<Record<string, CardVerdict>>({})
  const [finished, setFinished] = useState(false)

  const startRun = (next: Flashcard[]) => {
    setDeck(next)
    setIndex(0)
    setFlipped(false)
    setVerdicts({})
    setFinished(false)
  }

  const assess = (verdict: CardVerdict) => {
    const current = deck[index]
    if (!current) return
    const next = { ...verdicts, [current.id]: verdict }
    setVerdicts(next)
    if (index + 1 < deck.length) {
      setIndex(index + 1)
      setFlipped(false)
    } else {
      setFinished(true)
    }
  }

  // ------- Bilan de fin de paquet -------
  if (finished) {
    const toReview = countReview(verdicts)
    const known = deck.length - toReview
    const again = reviewDeck(deck, verdicts)
    return (
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-6 py-8 text-center">
        <span className="bg-highlight flex size-20 items-center justify-center rounded-3xl shadow-[0_6px_0_0] shadow-black/10">
          <Trophy className="text-foreground size-10" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-heading text-2xl font-bold">Paquet terminé !</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            {known} carte{known > 1 ? 's' : ''} sue{known > 1 ? 's' : ''} ·{' '}
            {toReview} à revoir
          </p>
        </div>

        <div className="grid w-full grid-cols-2 gap-3">
          <div className="rounded-2xl border border-green-600/30 bg-green-600/10 p-4">
            <span className="block text-2xl font-bold tabular-nums text-green-700 dark:text-green-400">
              {known}
            </span>
            <span className="text-muted-foreground text-xs font-medium">
              Je le savais
            </span>
          </div>
          <div className="border-primary/30 bg-primary/10 rounded-2xl border p-4">
            <span className="text-primary block text-2xl font-bold tabular-nums">
              {toReview}
            </span>
            <span className="text-muted-foreground text-xs font-medium">
              À revoir
            </span>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3">
          {again.length > 0 ? (
            <button
              type="button"
              onClick={() => startRun(again)}
              className="bg-primary text-primary-foreground cursor-pointer rounded-2xl px-5 py-3.5 font-bold shadow-[0_5px_0_0] shadow-black/20 transition-transform active:translate-y-[3px] active:shadow-[0_2px_0_0]"
            >
              Revoir les {again.length} carte{again.length > 1 ? 's' : ''} à revoir
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => startRun(cards)}
            className={cn(
              'cursor-pointer rounded-2xl px-5 py-3.5 font-bold transition-transform active:translate-y-[3px]',
              again.length > 0
                ? 'bg-card text-foreground border shadow-[0_5px_0_0] shadow-black/10 active:shadow-[0_2px_0_0]'
                : 'bg-primary text-primary-foreground shadow-[0_5px_0_0] shadow-black/20 active:shadow-[0_2px_0_0]',
            )}
          >
            Recommencer tout le paquet
          </button>
          <Link
            href={backHref}
            className="text-muted-foreground hover:text-foreground py-2 text-sm font-medium underline underline-offset-4 transition-colors"
          >
            Retour à la leçon
          </Link>
        </div>
      </div>
    )
  }

  // ------- Carte courante -------
  const card = deck[index]
  const progress = deck.length > 0 ? index / deck.length : 0

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-5">
      {/* Progression du paquet */}
      <div className="flex items-center gap-3">
        <div className="bg-muted h-2.5 flex-1 overflow-hidden rounded-full">
          <div
            className="bg-primary h-full rounded-full transition-[width] duration-300"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
        <span className="text-muted-foreground shrink-0 font-mono text-xs font-bold tabular-nums">
          {index + 1}/{deck.length}
        </span>
      </div>

      {/* La carte : cliquer pour la faire pivoter (recto ↔ verso) */}
      <div className="[perspective:1600px]">
        <button
          type="button"
          onClick={() => {
            setFlipped((f) => !f)
            sfx.flip()
          }}
          className="relative block min-h-[24rem] w-full cursor-pointer text-left [transform-style:preserve-3d] transition-transform duration-500 motion-reduce:transition-none"
          style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
        >
          {/* Recto — violet : la question. Masqué aux lecteurs d'écran quand la
              carte est retournée, pour n'exposer que la face visible. */}
          <CardFace
            ariaHidden={flipped}
            className="bg-primary text-primary-foreground shadow-primary/30"
            tab="?"
            body={card.front}
            footer={
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold opacity-80">
                <RotateCw className="size-4" aria-hidden="true" />
                Clique pour découvrir la réponse
              </span>
            }
          />
          {/* Verso — jaune : la réponse (+ indice) */}
          <CardFace
            ariaHidden={!flipped}
            className="bg-highlight text-foreground shadow-highlight/40 [transform:rotateY(180deg)]"
            tab="!"
            body={card.back}
            hint={card.hint}
            footer={
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold opacity-70">
                <RotateCw className="size-4" aria-hidden="true" />
                Clique pour revoir la question
              </span>
            }
          />
        </button>
      </div>

      {/* Auto-évaluation — EN BAS de la carte */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => assess('review')}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-amber-500 px-4 py-3.5 font-bold text-white shadow-[0_5px_0_0] shadow-amber-700/40 transition-transform active:translate-y-[3px] active:shadow-[0_2px_0_0]"
        >
          <RotateCcw className="size-5" aria-hidden="true" />À revoir
        </button>
        <button
          type="button"
          onClick={() => assess('known')}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 py-3.5 font-bold text-white shadow-[0_5px_0_0] shadow-green-800/40 transition-transform active:translate-y-[3px] active:shadow-[0_2px_0_0]"
        >
          <Check className="size-5" strokeWidth={3} aria-hidden="true" />
          Je le savais !
        </button>
      </div>

      <p className="text-muted-foreground text-center text-xs">
        {title}
      </p>
    </div>
  )
}

// Une face de la carte (recto ou verso). Chevron « onglet » en haut façon
// carte à jouer, corps centré, pied d'aide.
function CardFace({
  className,
  tab,
  body,
  hint,
  footer,
  ariaHidden,
}: {
  className?: string
  tab: string
  body: string
  hint?: string | null
  footer: React.ReactNode
  ariaHidden?: boolean
}) {
  return (
    <div
      aria-hidden={ariaHidden}
      className={cn(
        'absolute inset-0 flex flex-col items-center justify-between rounded-[1.75rem] border-4 border-white/30 p-6 shadow-[0_10px_0_0] [backface-visibility:hidden]',
        className,
      )}
    >
      {/* Onglet du haut */}
      <span
        className="font-heading -mt-11 flex size-9 items-center justify-center rounded-full border-4 border-white/30 bg-inherit text-lg font-bold"
        aria-hidden="true"
      >
        {tab}
      </span>

      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
        <p className="font-heading text-lg leading-snug font-bold text-balance md:text-xl">
          {body}
        </p>
        {hint ? (
          <p className="flex items-start gap-1.5 text-sm leading-snug opacity-80">
            <Lightbulb className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span className="text-balance">{hint}</span>
          </p>
        ) : null}
      </div>

      <span className="pt-2">{footer}</span>
    </div>
  )
}
