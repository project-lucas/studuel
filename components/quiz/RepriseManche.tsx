'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { Play, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDialogFocus } from '@/lib/use-dialog'
import { sfx } from '@/lib/sounds'
import { formatChrono } from '@/lib/quiz-chrono'
import { UNITES, plusQue } from '@/lib/boucle-ouverte'
import { chronoDeReprise, type BrouillonQuiz } from '@/lib/quiz-brouillon'

/**
 * « TU T'ÉTAIS ARRÊTÉ LÀ » — la manche inachevée, proposée à l'ouverture du
 * quiz (effet Zeigarnik, 28/10/2026).
 *
 * Posée PAR-DESSUS la première question, chrono suspendu tant qu'elle est
 * ouverte (le joueur ne décompte pas pendant ce choix). Deux gestes et pas de
 * croix : fermer sans choisir laisserait la manche dans un entre-deux. Reprendre
 * est le geste qu'on veut voir choisi — violet plein, en premier ; recommencer
 * efface la manche gardée.
 *
 * Le reste se dit par ce qui MANQUE (« Plus que 4 questions ») dès la moitié
 * franchie, sinon par le compte exact.
 */
export default function RepriseManche({
  brouillon,
  onReprendre,
  onRecommencer,
}: {
  brouillon: BrouillonQuiz
  onReprendre: () => void
  onRecommencer: () => void
}) {
  const panneau = useRef<HTMLDivElement>(null)
  useDialogFocus(panneau)

  const fait = brouillon.choix.length
  const total = brouillon.questionIds.length
  const appel = plusQue(fait, total, UNITES.question)
  const chrono = chronoDeReprise(brouillon.secondes)

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reprise-manche-titre"
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-4 sm:items-center"
    >
      <div
        ref={panneau}
        className="pop-in relative w-full max-w-sm rounded-3xl bg-card p-6 text-center shadow-2xl outline-none"
      >
        <Image
          src="/images/mascotte/marcel-bravo.webp"
          alt=""
          aria-hidden="true"
          width={512}
          height={512}
          sizes="112px"
          className="mx-auto size-28 object-contain"
        />
        <h2
          id="reprise-manche-titre"
          className="font-heading mt-1 text-2xl font-extrabold text-balance text-foreground"
        >
          Tu t’étais arrêté là
        </h2>
        <p className="mt-1 text-sm font-semibold text-pretty text-muted-foreground">
          {brouillon.titre}
        </p>

        <div className="mt-4 rounded-2xl bg-secondary/60 p-3 text-left">
          <div className="flex items-center justify-between gap-3">
            <span className="font-heading text-sm font-extrabold text-foreground">
              {appel ?? `${fait} question${fait > 1 ? 's' : ''} faite${fait > 1 ? 's' : ''}`}
            </span>
            <span className="font-heading shrink-0 text-sm font-extrabold text-primary tabular-nums">
              {fait}/{total}
            </span>
          </div>
          <div
            role="progressbar"
            aria-label="Questions déjà répondues"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={fait}
            className="mt-2 h-2.5 overflow-hidden rounded-full bg-primary/12"
          >
            <div
              className="h-full origin-left rounded-full bg-primary"
              style={{ transform: `scaleX(${total > 0 ? fait / total : 0})` }}
            />
          </div>
          {chrono !== null ? (
            <p className="mt-2 text-xs font-semibold text-muted-foreground">
              Le chrono repart de {formatChrono(chrono)}.
            </p>
          ) : null}
        </div>

        <Button
          size="xl"
          className="mt-5 w-full"
          onClick={() => {
            sfx.tap()
            onReprendre()
          }}
        >
          <Play className="fill-current" aria-hidden="true" />
          Reprendre à la question {fait + 1}
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="mt-2.5 w-full"
          onClick={() => {
            sfx.tap()
            onRecommencer()
          }}
        >
          <RotateCcw aria-hidden="true" />
          Recommencer
        </Button>
      </div>
    </div>
  )
}
