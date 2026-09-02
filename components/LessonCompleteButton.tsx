'use client'

import { useRef, useState, useTransition } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { sfx } from '@/lib/sounds'
import { completeLesson } from '@/app/reviser/actions'
import {
  origineUnique,
  useRecompenses,
} from '@/components/recompenses/RecompensesProvider'

// « J'ai terminé cette leçon » : fait progresser le chapitre (plancher 30 %)
// et valide la journée dans la série.
//
// LE GESTE DE CLASH ROYALE, EN VERSION COURTE. C'est l'action la plus fréquente
// de l'app, et la seule qui paye de l'XP à coup sûr la première fois (5 pour la
// leçon, et jusqu'à 30 de plus si elle allume la première couronne du
// chapitre). Pas de panneau ici : les jetons jaillissent DU BOUTON qu'on vient
// de toucher et filent vers l'écusson du bandeau. L'élève voit enfin son niveau
// bouger quand il travaille — l'XP existait, rien ne la montrait jamais.
export default function LessonCompleteButton({
  lessonId,
  initialDone,
}: {
  lessonId: string
  initialDone: boolean
}) {
  const [done, setDone] = useState(initialDone)
  const [pending, startTransition] = useTransition()
  const { celebrer } = useRecompenses()
  const ref = useRef<HTMLButtonElement>(null)

  if (done) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-success/10 px-4 py-2 text-sm font-semibold text-success dark:text-green-400">
        <Check className="size-4" strokeWidth={3} /> Leçon terminée
      </span>
    )
  }

  return (
    <Button
      ref={ref}
      variant="outline"
      className="rounded-full"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const { saved, gains } = await completeLesson(lessonId)
          if (!saved) return
          sfx.complete()
          // LA MESURE AVANT LA BASCULE. `setDone` remplace le bouton par le
          // badge « Leçon terminée » : mesuré après, l'élément n'existe plus et
          // la volée partirait du centre de l'écran.
          const origines = origineUnique(ref.current, gains)
          setDone(true)
          celebrer(gains, origines)
        })
      }
    >
      <Check className="size-4" />
      {pending ? 'Un instant…' : 'J’ai terminé cette leçon'}
    </Button>
  )
}
