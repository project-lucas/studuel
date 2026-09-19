'use client'

import { useState, useTransition } from 'react'
import { Check, Medal, RotateCcw, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { terminerCapsule } from '@/app/carnet/capsules/actions'
import { SEUIL_QUIZ_REUSSI, quizReussi, type CapsuleQuiz } from '@/lib/capsules'
import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'

type Fin = { badge: string | null; nouveau: boolean } | null

/**
 * Le quiz d'une capsule : une question à la fois, la correction expliquée,
 * puis le score. Réussi (60 % et plus), il TERMINE la capsule et accorde son
 * badge (`terminerCapsule`). Sans chrono : on vérifie ce qu'on a compris, pas
 * la vitesse. Rien n'entre dans la file « À revoir » : ce n'est pas le
 * programme scolaire.
 */
export default function QuizCapsule({
  capsuleId,
  quiz,
  badge,
  dejaTerminee,
}: {
  capsuleId: string
  quiz: CapsuleQuiz
  badge: string
  dejaTerminee: boolean
}) {
  const questions = quiz.questions
  const [index, setIndex] = useState(0)
  const [choix, setChoix] = useState<number | null>(null)
  const [bonnes, setBonnes] = useState(0)
  const [termine, setTermine] = useState(false)
  const [fin, setFin] = useState<Fin>(null)
  const [, demarrer] = useTransition()

  const question = questions[index]
  const repondu = choix !== null
  const requis = Math.ceil(questions.length * SEUIL_QUIZ_REUSSI)

  const repondre = (i: number) => {
    if (repondu) return
    setChoix(i)
    if (i === question.bonne) {
      sfx.correct()
      setBonnes((n) => n + 1)
    } else {
      sfx.wrong()
    }
  }

  const suivante = () => {
    if (index + 1 < questions.length) {
      setIndex(index + 1)
      setChoix(null)
      return
    }
    setTermine(true)
    if (quizReussi(bonnes, questions.length)) {
      sfx.complete()
      demarrer(async () => {
        const r = await terminerCapsule(capsuleId)
        if (r.ok) setFin({ badge: r.badge, nouveau: r.nouveau })
      })
    }
  }

  const recommencer = () => {
    sfx.tap()
    setIndex(0)
    setChoix(null)
    setBonnes(0)
    setTermine(false)
    setFin(null)
  }

  if (termine) {
    const reussi = quizReussi(bonnes, questions.length)
    return (
      <div className="flex flex-col items-center gap-3 rounded-3xl bg-card p-5 text-center ring-1 ring-border">
        <p className="font-heading text-5xl leading-none font-extrabold text-primary tabular-nums">
          {bonnes}/{questions.length}
        </p>
        {reussi ? (
          <>
            <p className="font-heading text-xl font-extrabold">Capsule terminée !</p>
            <p className="flex items-center gap-2 rounded-2xl bg-accent px-3 py-2 text-sm font-bold text-accent-foreground">
              <Medal className="size-4 shrink-0" strokeWidth={2.4} aria-hidden="true" />
              {fin?.nouveau || (!fin && !dejaTerminee)
                ? `Badge « ${fin?.badge ?? badge} » débloqué : il rejoint ton profil.`
                : `Ton badge « ${badge} » est déjà sur ton profil.`}
            </p>
          </>
        ) : (
          <p className="text-sm font-bold text-muted-foreground">
            Presque ! Il faut {requis} bonnes réponses sur {questions.length} pour terminer la
            capsule. Relis la fiche récap, puis retente.
          </p>
        )}
        <Button variant="secondary" className="rounded-full font-bold" onClick={recommencer}>
          <RotateCcw className="size-4" aria-hidden="true" /> Refaire le quiz
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 px-1">
        <div
          className="h-2 flex-1 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={questions.length}
          aria-valuenow={index + (repondu ? 1 : 0)}
          aria-label="Avancement du quiz"
        >
          <i
            className="block h-full rounded-full bg-primary transition-[width]"
            style={{ width: `${((index + (repondu ? 1 : 0)) / questions.length) * 100}%` }}
          />
        </div>
        <span className="font-heading text-sm font-extrabold text-muted-foreground tabular-nums">
          {index + 1}/{questions.length}
        </span>
      </div>

      <div className="rounded-3xl bg-card p-4 ring-1 ring-border">
        <p className="font-heading text-lg leading-snug font-extrabold">{question.question}</p>
        <ul className="mt-3 flex flex-col gap-2">
          {question.choix.map((texte, i) => {
            const estBonne = i === question.bonne
            const estChoisie = i === choix
            return (
              <li key={texte}>
                <button
                  type="button"
                  disabled={repondu}
                  onClick={() => repondre(i)}
                  className={cn(
                    'btn-chunky flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-bold ring-1 transition-colors disabled:cursor-default',
                    !repondu && 'bg-background ring-border [--btn-edge:var(--border)] hover:bg-secondary',
                    repondu && estBonne && 'bg-success/12 text-foreground ring-success',
                    repondu && estChoisie && !estBonne && 'bg-destructive/10 ring-destructive',
                    repondu && !estBonne && !estChoisie && 'bg-background opacity-60 ring-border',
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'grid size-6 shrink-0 place-items-center rounded-full text-xs font-extrabold',
                      repondu && estBonne
                        ? 'bg-success text-success-foreground'
                        : repondu && estChoisie
                          ? 'bg-destructive text-white'
                          : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {repondu && estBonne ? (
                      <Check className="size-3.5" strokeWidth={3} />
                    ) : repondu && estChoisie ? (
                      <X className="size-3.5" strokeWidth={3} />
                    ) : (
                      String.fromCharCode(65 + i)
                    )}
                  </span>
                  {texte}
                </button>
              </li>
            )
          })}
        </ul>

        {repondu ? (
          <div aria-live="polite" className="mt-3 rounded-2xl bg-secondary px-3 py-2.5 text-sm">
            <p className="font-extrabold text-secondary-foreground">
              {choix === question.bonne ? 'Bien vu !' : 'Pas tout à fait.'}
            </p>
            {question.explication ? <p className="mt-0.5 font-semibold">{question.explication}</p> : null}
          </div>
        ) : null}
      </div>

      {repondu ? (
        <Button size="lg" className="w-full rounded-full font-bold" onClick={suivante}>
          {index + 1 < questions.length ? 'Question suivante' : 'Voir mon score'}
        </Button>
      ) : null}
    </div>
  )
}
