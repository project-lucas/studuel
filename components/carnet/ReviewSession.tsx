'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, X } from 'lucide-react'
import { sfx } from '@/lib/sounds'
import type { CourseQuestionType, QuestionContent } from '@/lib/carnet-cours'
import {
  avancerSession,
  endReviewSession,
  recordAttempt,
  startReviewSession,
  type AttemptResult,
} from '@/app/reviser/cours/actions'
import QuestionPlayer, {
  type PlayerResult,
} from '@/components/carnet/QuestionPlayer'

export type PlayableQuestion = {
  id: string
  type: CourseQuestionType
  content: QuestionContent
}

/** Dit l'échéance en français, sans jargon d'intervalle. */
function prochainTexte(jours: number): string {
  if (jours <= 0) return 'revue tout à l’heure'
  if (jours === 1) return 'revue demain'
  if (jours < 30) return `revue dans ${jours} jours`
  const mois = Math.round(jours / 30)
  return mois <= 1 ? 'revue dans un mois' : `revue dans ${mois} mois`
}

/**
 * Une session de révision : une question par écran, correction immédiate, puis
 * bilan. Trois choses que l'ancienne version ne faisait pas :
 *
 *   • elle DIT ce que le moteur a décidé (« revue dans 12 jours ») — sans quoi
 *     la répétition espacée travaille sans que l'élève la voie jamais ;
 *   • elle SURVIT à la fermeture de l'onglet (l'avancement est enregistré à
 *     chaque réponse, il ne vivait que dans ce composant) ;
 *   • elle propose de REJOUER LES ERREURS à la fin, au lieu de laisser la
 *     boucle ouverte au moment précis où elle devrait se refermer.
 */
export default function ReviewSession({
  courseId,
  chapterId,
  courseTitle,
  scopeLabel,
  questions,
  backHref,
  backLabel,
  repriseIndex = 0,
  repriseJustes = 0,
  repriseSessionId = null,
  planifie = true,
}: {
  /** null = session transverse (« À revoir » multi-cours). */
  courseId: string | null
  chapterId: string | null
  courseTitle: string
  /** « Tout le cours » ou le titre du chapitre révisé. */
  scopeLabel: string
  questions: PlayableQuestion[]
  backHref?: string
  backLabel?: string
  /** Reprise d'une session interrompue : où elle s'était arrêtée. */
  repriseIndex?: number
  repriseJustes?: number
  repriseSessionId?: string | null
  /** Faux en entraînement / examen : les échéances ne bougent pas. */
  planifie?: boolean
}) {
  const [index, setIndex] = useState(
    Math.min(Math.max(0, repriseIndex), Math.max(0, questions.length - 1)),
  )
  const [answered, setAnswered] = useState(false)
  const [retour, setRetour] = useState<AttemptResult | null>(null)
  const [correctCount, setCorrectCount] = useState(repriseJustes)
  const [finished, setFinished] = useState(false)
  // Les questions ratées de CETTE session : la matière du « rejouer mes erreurs ».
  const [rates, setRates] = useState<PlayableQuestion[]>([])
  // La file jouée — remplacée par les erreurs quand on les rejoue.
  const [file, setFile] = useState<PlayableQuestion[]>(questions)
  const [tourErreurs, setTourErreurs] = useState(false)

  const sessionIdRef = useRef<string | null>(repriseSessionId)
  const endedRef = useRef(false)

  const exitHref = backHref ?? `/reviser/cours/${courseId}`
  const exitLabel = backLabel ?? 'Retour au cours'

  // Ouvre la session côté serveur, une seule fois — sauf reprise, où elle est
  // déjà ouverte. La file est transmise pour que la reprise rejoue LA MÊME
  // sélection (les échéances auront bougé entre-temps).
  useEffect(() => {
    if (sessionIdRef.current !== null) return
    let cancelled = false
    startReviewSession(
      courseId,
      chapterId,
      questions.map((q) => q.id),
    ).then((res) => {
      if (!cancelled && res.ok && res.id) sessionIdRef.current = res.id
    })
    return () => {
      cancelled = true
    }
    // `questions` est stable pour un rendu de page donné (calculée au serveur).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, chapterId])

  const total = file.length
  const current = file[index]

  const onAnswered = (result: PlayerResult) => {
    if (answered || !current) return
    setAnswered(true)
    if (result.correct) setCorrectCount((n) => n + 1)
    else setRates((liste) => [...liste, current])

    // Enregistrement en arrière-plan : ne bloque jamais l'élève. Le serveur
    // re-corrige, planifie la carte et rend son échéance — qu'on affiche.
    void recordAttempt(
      sessionIdRef.current,
      current.id,
      result.verdict,
      result.given,
      planifie,
    ).then((res) => {
      if (res.ok) setRetour(res)
    })
  }

  const next = () => {
    sfx.tap()
    const suivant = index + 1
    // L'avancement est poussé au serveur : c'est ce qui rend la session
    // reprenable. Sans attendre — un aller-retour ne doit pas retenir l'élève.
    if (sessionIdRef.current && !tourErreurs) {
      void avancerSession(sessionIdRef.current, suivant, correctCount)
    }
    setRetour(null)

    if (suivant >= total) {
      setFinished(true)
      if (!endedRef.current && sessionIdRef.current) {
        endedRef.current = true
        void endReviewSession(sessionIdRef.current)
      }
      sfx.complete()
      return
    }
    setIndex(suivant)
    setAnswered(false)
  }

  const rejouerErreurs = () => {
    sfx.tap()
    setFile(rates)
    setRates([])
    setIndex(0)
    setAnswered(false)
    setRetour(null)
    setCorrectCount(0)
    setFinished(false)
    setTourErreurs(true)
  }

  if (total === 0) {
    return (
      <div className="mx-auto w-full max-w-md">
        <p className="rounded-2xl bg-muted/40 px-3 py-4 text-center text-sm text-muted-foreground">
          Rien à réviser ici pour l’instant — tout est à jour. 🎉
        </p>
        <Link
          href={exitHref}
          className="font-heading mt-3 block rounded-2xl bg-primary px-4 py-3 text-center text-sm font-extrabold text-primary-foreground"
        >
          {exitLabel}
        </Link>
      </div>
    )
  }

  if (finished) {
    const pct = Math.round((correctCount / total) * 100)
    return (
      <div className="mx-auto w-full max-w-md">
        <div className="rev-card rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-black/5">
          <p className="text-4xl" aria-hidden="true">
            {pct >= 80 ? '🏆' : pct >= 50 ? '💪' : '📚'}
          </p>
          <h1 className="font-heading mt-2 text-xl font-extrabold text-foreground">
            {tourErreurs ? 'Erreurs rejouées !' : 'Session terminée !'}
          </h1>
          <p className="mt-1 text-sm font-semibold text-muted-foreground">
            {scopeLabel} · {courseTitle}
          </p>
          <p className="font-heading mt-4 text-3xl font-extrabold text-primary tabular-nums">
            {correctCount} / {total}
          </p>
          <p className="text-xs font-bold text-muted-foreground">
            bonnes réponses ({pct} %)
          </p>

          <div className="mt-5 flex flex-col gap-2">
            {/* LA porte de sortie utile : refermer la boucle sur ce qui a raté,
                tout de suite, pendant que c'est encore frais. */}
            {rates.length > 0 ? (
              <button
                type="button"
                onClick={rejouerErreurs}
                className="font-heading flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground shadow-sm transition active:translate-y-px"
              >
                <RefreshCw className="size-4" aria-hidden="true" />
                Rejouer mes {rates.length} erreur
                {rates.length > 1 ? 's' : ''}
              </button>
            ) : null}
            <Link
              href={exitHref}
              onClick={() => sfx.tap()}
              className="font-heading rounded-2xl bg-muted/60 px-4 py-3 text-sm font-extrabold text-foreground"
            >
              {exitLabel}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-md">
      {/* Barre de progression + quitter. */}
      <div className="mb-3 flex items-center gap-3">
        <Link
          href={exitHref}
          onClick={() => sfx.tap()}
          aria-label="Quitter la session"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-muted-foreground ring-1 ring-black/5 hover:text-foreground"
        >
          <X className="size-4" aria-hidden="true" />
        </Link>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={index + (answered ? 1 : 0)}
          aria-label="Avancement de la session"
          className="h-3 flex-1 overflow-hidden rounded-full bg-black/5"
        >
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{
              width: `${((index + (answered ? 1 : 0)) / total) * 100}%`,
            }}
          />
        </div>
        <span className="shrink-0 text-xs font-extrabold text-muted-foreground tabular-nums">
          {index + 1}/{total}
        </span>
      </div>

      <p className="mb-2 px-1 text-[11px] font-bold text-muted-foreground">
        {tourErreurs ? 'Tes erreurs' : scopeLabel} · {courseTitle}
      </p>

      {/* La question du moment — `key` remonte un joueur neuf à chaque pas. */}
      <div className="rev-card rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5">
        <QuestionPlayer
          key={current.id}
          type={current.type}
          content={current.content}
          onAnswered={onAnswered}
        />
      </div>

      {/* Ce que le moteur a décidé. Sans ce bandeau, la répétition espacée
          travaille dans le dos de l'élève : il ne sait jamais qu'une carte
          qu'il maîtrise ne reviendra pas avant trois semaines. */}
      {answered && retour ? (
        <div className="mt-3 flex flex-col gap-2">
          {retour.presque && retour.orthographe ? (
            <p className="rounded-2xl bg-highlight/25 px-3 py-2 text-center text-xs font-bold text-foreground">
              Presque ! L’orthographe exacte :{' '}
              <span className="font-extrabold">{retour.orthographe}</span>
            </p>
          ) : null}
          {retour.sangsue ? (
            <p className="flex items-center gap-2 rounded-2xl bg-destructive/10 px-3 py-2 text-xs font-bold text-destructive">
              <AlertTriangle className="size-4 shrink-0" aria-hidden="true" />
              Cette carte te résiste depuis longtemps — elle gagnerait à être
              réécrite plus simplement.
            </p>
          ) : null}
          {planifie ? (
            <p className="text-center text-[11px] font-bold text-muted-foreground">
              {prochainTexte(retour.prochainJours)}
            </p>
          ) : null}
        </div>
      ) : null}

      {answered ? (
        <button
          type="button"
          onClick={next}
          className="font-heading mt-3 w-full cursor-pointer rounded-2xl bg-primary px-4 py-3.5 text-sm font-extrabold text-primary-foreground shadow-sm transition active:translate-y-px"
        >
          {index + 1 >= total ? 'Voir le bilan' : 'Continuer'}
        </button>
      ) : null}
    </div>
  )
}
