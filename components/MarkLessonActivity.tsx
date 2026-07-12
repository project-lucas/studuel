'use client'

import { useEffect, useRef } from 'react'
import { markLessonActivity } from '@/app/reviser/actions'
import type { LessonActivityKind } from '@/lib/types'

// Trace la consultation d'un support (fiche de révision, studygram) dès
// l'ouverture de la page — l'anneau de la leçon s'actualise au retour.
// Invisible : le geste de l'élève, c'est d'être venu lire.
export default function MarkLessonActivity({
  lessonId,
  activity,
}: {
  lessonId: string
  activity: LessonActivityKind
}) {
  const sent = useRef(false)
  useEffect(() => {
    if (sent.current) return
    sent.current = true
    markLessonActivity(lessonId, activity).catch(() => {})
  }, [lessonId, activity])

  return null
}
