'use client'

import ChapterItem from '@/components/reviser/ChapterItem'
import type { ChapterRow } from '@/lib/subject-template'

// Liste des chapitres de la matière : une seule entrée par chapitre. Pour un
// élève 100 % nouveau (`isNew`), le premier chapitre porte le CTA « Commencer ».
export default function ChapterList({
  chapters,
  isNew,
  subjectName,
  grade,
}: {
  chapters: ChapterRow[]
  isNew: boolean
  subjectName: string
  grade: string
}) {
  if (chapters.length === 0) {
    return (
      <p className="mt-6 text-sm text-muted-foreground">
        Le programme de {subjectName} en {grade} arrive bientôt.
      </p>
    )
  }

  return (
    <ul className="mt-4 flex flex-col gap-3">
      {chapters.map((chapter, index) => (
        <li key={chapter.id}>
          <ChapterItem chapter={chapter} highlight={isNew && index === 0} />
        </li>
      ))}
    </ul>
  )
}
