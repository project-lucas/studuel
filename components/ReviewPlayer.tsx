'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Swords, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { sfx, buzz } from '@/lib/sounds'
import ComboBadge from '@/components/ComboBadge'
import QuitGuardButton from '@/components/QuitGuardButton'
import SoundToggle from '@/components/ui/SoundToggle'
import AnswerBoard from '@/components/jeux/AnswerBoard'
import QuizFeedbackMascotte from '@/components/QuizFeedbackMascotte'
import { finishReviewSession } from '@/app/reviser/actions'
import BossApparition from '@/components/defi/BossApparition'
import PanneauRecompenses from '@/components/recompenses/PanneauRecompenses'
import { feedbackTitle, reactionSrc } from '@/lib/quiz-feedback'
import type { Gain } from '@/lib/gains'
import type { TraqueApparition } from '@/lib/traque'
import type { ReviewAnswer } from '@/lib/srs'

// -----------------------------------------------------------------------------
// LA SESSION « MES ERREURS » (file « À revoir » : Revanche + révision espacée).
//
// Refaite le 05/11/2026 (Lucas : « son visuel est à refaire ») sur la grammaire
// du quiz, plein écran (lib/quiz-chrome) :
//   · en tête, la croix, la barre de progression, le son ;
//   · la PLAQUE DE LA REVANCHE (carte sombre) : le compte des erreurs qu'il
//     reste à venger, qui DESCEND sous les yeux à chaque erreur vengée — c'est
//     le compteur qu'on a envie de vider ;
//   · la question dans une carte, les réponses sur `AnswerBoard` (le plateau
//     du quiz et des jeux : une seule grammaire du verdict dans l'app) ;
//   · le verdict dans la feuille du quiz (`QuizFeedbackMascotte`), avec la
//     bonne réponse et l'explication ;
//   · la fin : les erreurs vengées en grand, puis ce qui a été VERSÉ.
// La logique d'enregistrement (finishReviewSession) n'a pas bougé.
// -----------------------------------------------------------------------------

// Un item jouable de la file « À revoir » : la question (ou carte) complète,
// avec son drapeau Revanche (erreur à venger).
export type ReviewPlayItem =
  | {
      kind: 'question'
      id: string
      subject: string | null
      inRevanche: boolean
      prompt: string
      options: string[]
      correctIndex: number
      explanation: string | null
    }
  | {
      kind: 'card'
      id: string
      subject: string | null
      inRevanche: boolean
      front: string
      back: string
    }

type Result = {
  saved: boolean
  revancheCleared: boolean
  coins: number
  // Un gardien vient-il de sortir grâce à cette session ? (La Traque.)
  apparition: TraqueApparition | null
  /** Ce que la session a réellement rapporté (557) : l'XP de la révision. */
  gains: Gain[]
}

const ICONE_ERREURS = '/images/supports/erreurs.webp'

export default function ReviewPlayer({
  items,
  titre = 'Mes erreurs',
}: {
  items: ReviewPlayItem[]
  /** « Mes erreurs », ou « Mes erreurs · Anglais » filtré sur une matière. */
  titre?: string
}) {
  const router = useRouter()
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [answers, setAnswers] = useState<ReviewAnswer[]>([])
  const [done, setDone] = useState(false)
  // Bonnes réponses d'affilée (badge de série, illustration du verdict) et
  // ratés d'affilée (le verdict console plus fort au troisième).
  const [streak, setStreak] = useState(0)
  const [rates, setRates] = useState(0)
  const [result, setResult] = useState<Result | null>(null)
  // Garde anti-double-soumission : un double-tap sur la dernière carte pourrait
  // sinon enregistrer la session deux fois (ligne dupliquée en base).
  const finishedRef = useRef(false)
  // Verrou d'avancement : sans lui, deux taps rapprochés sur « Continuer »
  // franchissent tous deux la garde et sautent un item. On ne le relâche
  // qu'au changement d'`index` (après re-rendu), pas dans le même tick.
  const advancingRef = useRef(false)

  const item = items[index]
  const answered = selected !== null
  const revancheTotal = items.filter((i) => i.inRevanche).length
  const vengees = answers.filter((a, i) => a.good && items[i]?.inRevanche).length
  // L'item en cours compte dès que la réponse juste est donnée : le compteur
  // tombe au moment du « Vengée ! », pas un écran plus tard.
  const vengeeEnDirect =
    item?.kind === 'question' && item.inRevanche && answered && selected === item.correctIndex ? 1 : 0
  const restants = Math.max(0, revancheTotal - vengees - vengeeEnDirect)

  useEffect(() => {
    advancingRef.current = false
  }, [index])

  const finish = (finalAnswers: ReviewAnswer[]) => {
    if (finishedRef.current) return
    finishedRef.current = true
    setDone(true)
    sfx.complete()
    finishReviewSession(finalAnswers)
      .then(setResult)
      .catch(() =>
        setResult({ saved: false, revancheCleared: false, coins: 0, apparition: null, gains: [] }),
      )
  }

  const next = (good: boolean) => {
    if (!item || advancingRef.current) return
    advancingRef.current = true
    const newAnswers: ReviewAnswer[] = [...answers, { kind: item.kind, id: item.id, subject: item.subject, good }]
    setAnswers(newAnswers)
    if (index + 1 >= items.length) {
      finish(newAnswers)
    } else {
      setIndex((i) => i + 1)
      setSelected(null)
      setRevealed(false)
    }
  }

  const repondre = (i: number) => {
    if (!item || item.kind !== 'question' || answered) return
    const juste = i === item.correctIndex
    setSelected(i)
    const nextStreak = juste ? streak + 1 : 0
    setStreak(nextStreak)
    setRates(juste ? 0 : rates + 1)
    if (juste) sfx.correctCombo(nextStreak)
    else sfx.wrong()
    buzz(juste, nextStreak)
  }

  // ------------------------------------------------------------------- vide
  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[70svh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element -- illustration de la famille nav */}
        <img src={ICONE_ERREURS} alt="" width={120} height={120} className="size-28" />
        <h1 className="font-heading text-3xl font-extrabold">Aucune erreur à venger</h1>
        <p className="text-muted-foreground max-w-xs text-sm">
          Ta mémoire est à jour. Chaque erreur de quiz ou de duel viendra s’ajouter ici, au bon moment.
        </p>
        <Button size="xl" className="mt-2 w-full max-w-xs" onClick={() => router.push('/reviser')}>
          Retour à Réviser
        </Button>
      </div>
    )
  }

  // ------------------------------------------------------------------- fin
  if (done) {
    const correct = answers.filter((a) => a.good).length
    const vengeesFin = answers.filter((a, i) => a.good && items[i]?.inRevanche).length
    return (
      <div className="mx-auto flex min-h-[80svh] max-w-md flex-col items-center justify-center gap-5 px-4 text-center">
        {/* La Traque : la session vient peut-être de faire sortir un gardien.
            Rendu en portail — sa place ici ne change rien à la mise en page. */}
        {result?.apparition ? (
          <BossApparition
            apparition={result.apparition}
            onClose={() => setResult((r) => (r ? { ...r, apparition: null } : r))}
          />
        ) : null}

        <div className="carte-sombre animate-in zoom-in-90 fade-in flex w-full flex-col items-center gap-2 px-5 pt-6 pb-5 duration-500">
          <span className="bg-highlight text-foreground grid size-16 place-items-center rounded-full shadow-[0_4px_0_0_rgba(0,0,0,0.25)]">
            <Swords className="size-8" strokeWidth={2.4} aria-hidden="true" />
          </span>
          <p className="surtitre opacity-80">{titre}</p>
          <h1 className="font-heading text-[2rem] leading-none font-extrabold">
            {revancheTotal > 0
              ? vengeesFin === revancheTotal
                ? 'Toutes vengées !'
                : `${vengeesFin} vengée${vengeesFin > 1 ? 's' : ''} sur ${revancheTotal}`
              : 'Mémoire affûtée !'}
          </h1>
          <p className="text-sm opacity-85">
            {correct}/{answers.length} justes — chaque question revient au bon moment.
          </p>
        </div>

        {/* L'XP de la révision vole vers le bandeau — une fois le rideau du
            gardien refermé, sinon les jetons voleraient derrière lui. */}
        {result && !result.apparition ? (
          <PanneauRecompenses gains={result.gains} titre="Gagné" className="w-full" />
        ) : null}

        {result?.revancheCleared ? (
          <p className="animate-in slide-in-from-bottom-2 bg-highlight flex items-center gap-2 rounded-full px-5 py-2 text-sm font-extrabold duration-500">
            <Swords className="size-4" aria-hidden="true" /> Revanche vidée !
          </p>
        ) : null}

        {result !== null && !result.saved ? (
          <p className="text-muted-foreground text-sm">
            Session non enregistrée (connecte-toi pour garder ta progression).
          </p>
        ) : null}

        <Button size="xl" className="w-full" onClick={() => router.push('/reviser')}>
          Retour à Réviser
        </Button>
      </div>
    )
  }

  // ---------------------------------------------------------------- session
  if (!item) return null

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 px-1 pb-48">
      {/* --- En tête : quitter, progression, son ------------------------- */}
      <div className="flex items-center gap-3">
        {/* Croix « quitter » gardée : même pattern que le quiz. */}
        <QuitGuardButton fallback="/reviser" label="Quitter la session">
          <X className="size-5" aria-hidden="true" />
        </QuitGuardButton>
        <div
          className="bg-foreground/10 h-3.5 flex-1 overflow-hidden rounded-full"
          role="progressbar"
          aria-label="Progression de la session"
          aria-valuemin={0}
          aria-valuemax={items.length}
          aria-valuenow={index}
          aria-valuetext={`Question ${index + 1} sur ${items.length}`}
        >
          <div
            className="bg-primary h-full rounded-full transition-[width] duration-500"
            style={{ width: `${Math.max(4, ((index + (answered || revealed ? 1 : 0)) / items.length) * 100)}%` }}
          />
        </div>
        <SoundToggle />
      </div>

      {/* --- La plaque de la Revanche ----------------------------------- */}
      <div className="carte-sombre flex items-center gap-3 px-4 py-3">
        {/* eslint-disable-next-line @next/next/no-img-element -- illustration de la famille nav */}
        <img src={ICONE_ERREURS} alt="" width={56} height={56} className="size-12 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="surtitre opacity-75">{titre}</p>
          {revancheTotal > 0 ? (
            <p className="font-heading text-lg leading-tight font-extrabold">
              <span
                // `key` : le chiffre rejoue son entrée à chaque erreur vengée.
                key={restants}
                className="text-highlight animate-in zoom-in-50 inline-block tabular-nums duration-300"
              >
                {restants}
              </span>{' '}
              {restants > 1 ? 'erreurs à venger' : restants === 1 ? 'erreur à venger' : 'tout est vengé !'}
            </p>
          ) : (
            <p className="font-heading text-lg leading-tight font-extrabold">Révision espacée</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="font-heading text-sm font-extrabold tabular-nums opacity-80">
            {index + 1}/{items.length}
          </span>
          {/* Badge de SÉRIE : la région `aria-live` reste toujours montée. */}
          <span aria-live="polite" className="min-h-6">
            <ComboBadge streak={streak} variant="arene" />
          </span>
        </div>
      </div>

      {/* --- La question ------------------------------------------------ */}
      <div key={item.id} className="carte animate-in fade-in slide-in-from-right-4 flex flex-col gap-3 p-5 duration-300">
        <div className="flex flex-wrap items-center gap-2">
          {item.subject ? <p className="surtitre text-muted-foreground">{item.subject}</p> : null}
          {item.inRevanche ? (
            <span className="bg-primary text-primary-foreground flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-extrabold">
              <Swords className="size-3" aria-hidden="true" /> Revanche
            </span>
          ) : null}
        </div>

        {item.kind === 'question' ? (
          <>
            <h2 className="font-heading text-xl leading-snug font-extrabold text-balance">{item.prompt}</h2>
            <AnswerBoard
              options={item.options}
              correctIndex={item.correctIndex}
              selected={selected}
              revealed={answered}
              layout="liste"
              onAnswer={repondre}
            />
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => {
                if (!revealed) {
                  sfx.flip()
                  setRevealed(true)
                }
              }}
              className="bg-secondary/60 flex min-h-48 w-full flex-col items-center justify-center gap-3 rounded-2xl p-6 text-center transition-transform active:scale-[0.99]"
            >
              <p className="font-heading text-2xl font-extrabold text-balance">{item.front}</p>
              {revealed ? (
                <p className="animate-in fade-in text-primary text-lg font-bold duration-300">{item.back}</p>
              ) : (
                <p className="text-muted-foreground text-xs font-bold">Touche pour voir la réponse</p>
              )}
            </button>
            <div
              aria-hidden={!revealed}
              className={cn('grid grid-cols-2 gap-2 transition-opacity', !revealed && 'pointer-events-none opacity-0')}
            >
              <Button
                variant="outline"
                size="xl"
                tabIndex={revealed ? undefined : -1}
                onClick={() => {
                  setStreak(0)
                  sfx.wrong()
                  buzz(false, 0)
                  next(false)
                }}
              >
                À revoir
              </Button>
              <Button
                size="xl"
                tabIndex={revealed ? undefined : -1}
                onClick={() => {
                  const nextStreak = streak + 1
                  setStreak(nextStreak)
                  sfx.correctCombo(nextStreak)
                  buzz(true, nextStreak)
                  next(true)
                }}
              >
                <Check className="size-4" aria-hidden="true" /> Je savais
              </Button>
            </div>
          </>
        )}
      </div>

      {/* --- Le verdict : la feuille du quiz ---------------------------- */}
      {item.kind === 'question' ? (
        <QuizFeedbackMascotte
          open={answered}
          good={selected === item.correctIndex}
          imageSrc={reactionSrc(selected === item.correctIndex, selected === item.correctIndex ? streak : rates)}
          title={
            selected === item.correctIndex
              ? item.inRevanche
                ? 'Vengée !'
                : feedbackTitle(true, streak, item.id)
              : 'Elle revient demain'
          }
          correctAnswer={item.options[item.correctIndex]}
          explanation={item.explanation}
          ctaLabel={index + 1 >= items.length ? 'Voir mon bilan' : 'Continuer'}
          onContinue={() => next(selected === item.correctIndex)}
        />
      ) : null}
    </div>
  )
}
