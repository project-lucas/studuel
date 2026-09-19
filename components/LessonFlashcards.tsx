'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Check,
  Hourglass,
  Lightbulb,
  RotateCcw,
  RotateCw,
  TimerOff,
  Trophy,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { recordReviewAnswers } from '@/app/reviser/actions'
import type { ReviewAnswer } from '@/lib/srs'
import {
  budgetChrono,
  chronoApresReponse,
  chronoEnAlerte,
  chronoRatio,
  chronoTick,
  formatChrono,
  tempsEcoule,
} from '@/lib/quiz-chrono'
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
//
// DEUX CHOSES DEPUIS LE 16/09/2026, pour que « Mémoriser » soit un vrai geste :
//
// 1. LE CHRONO DU DUEL (lib/quiz-chrono). Un budget pour tout le paquet, une
//    carte sue rend du temps, et à zéro la manche est abandonnée — rien n'est
//    écrit. Il court en continu, du recto au verdict : ici il n'y a pas de
//    correction à lire, retourner la carte EST la réponse. C'est l'entraînement
//    à répondre vite et bien, sur le rythme de la course PvP.
//
// 2. LE VERDICT COMPTE. « Je le savais » / « À revoir » ne servait qu'au bilan
//    de l'écran : le paquet fermé, l'app n'en savait rien, et la tuile
//    « Flashcards » promettait une file « À revoir » qu'aucune carte
//    n'alimentait. Les verdicts partent maintenant à la répétition espacée
//    (recordReviewAnswers) sous l'identité de la QUESTION dont la carte est
//    tirée : c'est le même item que celui du quiz, donc « 4 à revoir » sur la
//    tuile et la file de /reviser/revoir disent enfin la même chose.
export default function LessonFlashcards({
  cards,
  backHref,
  title,
  subject = null,
  chrono = true,
}: {
  cards: Flashcard[]
  backHref: string
  title: string
  /** Nom de la matière, pour étiqueter les items de la file « À revoir ». */
  subject?: string | null
  /** Le chrono de la manche — allumé par défaut, `false` pour un écran sans. */
  chrono?: boolean
}) {
  const [deck, setDeck] = useState<Flashcard[]>(cards)
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [verdicts, setVerdicts] = useState<Record<string, CardVerdict>>({})
  const [finished, setFinished] = useState(false)
  // La file « À revoir » a-t-elle bien reçu les verdicts ? `null` tant qu'on
  // attend, `false` si l'écriture a échoué — le bilan le dit.
  const [saved, setSaved] = useState<boolean | null>(null)

  // Le chrono : le budget du paquet joué, le temps qui reste (et son miroir en
  // ref, lu par l'intervalle sans attendre un rendu), et l'abandon.
  const [budget, setBudget] = useState(() => budgetChrono(cards.length))
  const [secondesRestantes, setSecondesRestantes] = useState(budget)
  const secondesRef = useRef(budget)
  const [horsDelai, setHorsDelai] = useState(false)

  // Verrou synchrone anti double-tap : deux taps rapides sur « Je le savais »
  // marqueraient deux cartes d'un coup. Relâché à la carte suivante.
  const lockRef = useRef(false)
  useEffect(() => {
    lockRef.current = false
  }, [index])

  // LE DÉCOMPTE : en continu tant que la manche est en cours, suspendu quand
  // l'onglet est caché (comme au salon). À zéro : abandon, rien n'est écrit.
  useEffect(() => {
    if (!chrono || finished || horsDelai) return
    const id = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState !== 'visible')
        return
      secondesRef.current = chronoTick(secondesRef.current)
      setSecondesRestantes(secondesRef.current)
      if (tempsEcoule(secondesRef.current)) {
        sfx.wrong()
        setHorsDelai(true)
      }
    }, 1000)
    return () => clearInterval(id)
  }, [chrono, finished, horsDelai])

  const startRun = (next: Flashcard[]) => {
    setDeck(next)
    setIndex(0)
    setFlipped(false)
    setVerdicts({})
    setFinished(false)
    setSaved(null)
    const nouveauBudget = budgetChrono(next.length)
    secondesRef.current = nouveauBudget
    setSecondesRestantes(nouveauBudget)
    setBudget(nouveauBudget)
    setHorsDelai(false)
  }

  // Fin de manche : les verdicts partent à la répétition espacée, en une fois,
  // en « fire and forget ». Une carte = la question dont elle est tirée.
  const terminer = (tous: Record<string, CardVerdict>) => {
    setFinished(true)
    sfx.complete()
    const reponses: ReviewAnswer[] = deck.map((card) => ({
      kind: 'question',
      id: card.id,
      subject,
      good: tous[card.id] === 'known',
    }))
    recordReviewAnswers(reponses)
      .then(() => setSaved(true))
      .catch(() => setSaved(false))
  }

  const assess = (verdict: CardVerdict) => {
    const current = deck[index]
    if (!current || lockRef.current || horsDelai) return
    lockRef.current = true
    const next = { ...verdicts, [current.id]: verdict }
    setVerdicts(next)
    if (verdict === 'known') sfx.correct()
    else sfx.flip()
    // Une carte sue rend du temps ; une carte à revoir n'en retire pas.
    if (chrono) {
      secondesRef.current = chronoApresReponse(secondesRef.current, verdict === 'known')
      setSecondesRestantes(secondesRef.current)
    }
    if (index + 1 < deck.length) {
      setIndex(index + 1)
      setFlipped(false)
    } else {
      terminer(next)
    }
  }

  // ------- Temps écoulé : la manche est abandonnée, rien n'est écrit -------
  if (horsDelai) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-6 py-8 text-center">
        <span className="flex size-20 items-center justify-center rounded-3xl bg-destructive text-white shadow-[0_6px_0_0] shadow-black/15">
          <TimerOff className="size-10" strokeWidth={2.4} aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-heading text-2xl font-bold">Temps écoulé !</h2>
          <p className="text-muted-foreground mt-1 text-sm text-balance">
            La manche s’arrête là, et rien n’est enregistré : {index} carte
            {index > 1 ? 's' : ''} sur {deck.length}. En duel non plus, le chrono
            n’attend pas — reprends, plus vite.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3">
          <button
            type="button"
            onClick={() => {
              sfx.tap()
              startRun(deck)
            }}
            className="bg-primary text-primary-foreground flex cursor-pointer items-center justify-center gap-2 rounded-2xl px-5 py-3.5 font-bold shadow-[0_5px_0_0] shadow-black/20 transition-transform active:translate-y-[3px] active:shadow-[0_2px_0_0]"
          >
            <RotateCcw className="size-5" aria-hidden="true" />
            Réessayer
          </button>
          <Link
            href={backHref}
            className="text-muted-foreground hover:text-foreground flex items-center justify-center gap-1.5 py-2 text-sm font-medium underline underline-offset-4 transition-colors"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Quitter
          </Link>
        </div>
      </div>
    )
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
          {/* Ce que le geste a produit : les cartes à revoir sont dans la file,
              celles qui sont sues s'y espacent. Dit seulement une fois écrit. */}
          <p className="text-muted-foreground mt-1 text-xs" aria-live="polite">
            {saved === true
              ? 'Enregistré dans ta file « À revoir ».'
              : saved === false
                ? 'La file « À revoir » n’a pas pu être mise à jour.'
                : ''}
          </p>
        </div>

        <div className="grid w-full grid-cols-2 gap-3">
          <div className="rounded-2xl border border-success/30 bg-success/10 p-4">
            <span className="block text-2xl font-bold text-success tabular-nums">
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
  const alerte = chronoEnAlerte(secondesRestantes)

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-5">
      {/* Progression du paquet, et le chrono de la manche à côté */}
      <div className="flex flex-col gap-1.5">
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
          {chrono ? (
            <span
              role="timer"
              aria-live="off"
              aria-label={`${secondesRestantes} secondes restantes`}
              title="Temps restant pour la manche"
              className={cn(
                'flex shrink-0 items-center gap-1 rounded-full border bg-card px-2 py-0.5 font-mono text-xs font-bold tabular-nums shadow-sm',
                alerte ? 'border-destructive/40 text-destructive' : 'text-foreground',
              )}
            >
              <Hourglass className="size-3.5" aria-hidden="true" />
              {formatChrono(secondesRestantes)}
            </span>
          ) : null}
        </div>
        {chrono ? (
          <div aria-hidden="true" className="h-1 w-full overflow-hidden rounded-full bg-black/10">
            <div
              className={cn(
                'h-full rounded-full transition-[width] duration-1000 ease-linear',
                alerte ? 'bg-destructive' : 'bg-highlight',
              )}
              style={{ width: `${chronoRatio(secondesRestantes, budget) * 100}%` }}
            />
          </div>
        ) : null}
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

      {/* Auto-évaluation — EN BAS de la carte. Corail pour « À revoir » (c'est
          le rôle de l'alerte), vert `success` pour « su » : les rôles de la DA,
          plus l'ambre et le vert bruts d'avant. */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => assess('review')}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-destructive px-4 py-3.5 font-bold text-white shadow-[0_5px_0_0] shadow-black/20 transition-transform active:translate-y-[3px] active:shadow-[0_2px_0_0]"
        >
          <RotateCcw className="size-5" aria-hidden="true" />À revoir
        </button>
        <button
          type="button"
          onClick={() => assess('known')}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-success px-4 py-3.5 font-bold text-white shadow-[0_5px_0_0] shadow-black/20 transition-transform active:translate-y-[3px] active:shadow-[0_2px_0_0]"
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
