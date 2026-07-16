'use client'

import { useState, useTransition } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { sfx } from '@/lib/sounds'
import { completeLesson } from '@/app/reviser/actions'

// « J'ai terminé cette leçon » : fait progresser le chapitre (plancher 30 %)
// et valide la journée dans la série.
export default function LessonCompleteButton({
  lessonId,
  initialDone,
}: {
  lessonId: string
  initialDone: boolean
}) {
  const [done, setDone] = useState(initialDone)
  const [pending, startTransition] = useTransition()

  if (done) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-success/10 px-4 py-2 text-sm font-semibold text-success dark:text-green-400">
        <Check className="size-4" strokeWidth={3} /> Leçon terminée
      </span>
    )
  }

  return (
    <Button
      variant="outline"
      className="rounded-full"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const { saved } = await completeLesson(lessonId)
          if (saved) {
            sfx.complete()
            setDone(true)
          }
        })
      }
    >
      <Check className="size-4" />
      {pending ? 'Un instant…' : 'J’ai terminé cette leçon'}
    </Button>
  )
}
