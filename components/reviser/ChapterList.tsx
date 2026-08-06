'use client'

import { ChevronDown } from 'lucide-react'
import ChapterItem from '@/components/reviser/ChapterItem'
import {
  groupChaptersByTheme,
  openGroupIndex,
  type ChapterRow,
  type ResumeCta,
} from '@/lib/subject-template'

// Liste des chapitres de la matière, rangée par axe du programme quand la base
// porte des thèmes (migration 234) : 28 lignes à plat, personne ne les relit.
// Chaque section est repliable ; celle du chapitre à reprendre s'ouvre à
// l'arrivée, les autres restent fermées — l'élève voit le programme en entier
// et sa place dedans, en un écran.
//
// Sans thème en base, un seul groupe implicite : la liste à plat d'avant.
export default function ChapterList({
  chapters,
  resume,
  subjectName,
  grade,
}: {
  chapters: ChapterRow[]
  /** Le chapitre mis en avant (« Reprendre » / « Commencer »), s'il en reste. */
  resume: ResumeCta | null
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

  const groups = groupChaptersByTheme(chapters)
  const open = openGroupIndex(groups, resume)

  const list = (rows: ChapterRow[]) => (
    <ul className="flex flex-col gap-3">
      {rows.map((chapter) => (
        <li key={chapter.id}>
          <ChapterItem
            chapter={chapter}
            resumeLabel={resume?.chapterId === chapter.id ? resume.label : null}
          />
        </li>
      ))}
    </ul>
  )

  // Un seul groupe anonyme : pas de section, pas de pliage, rien à ouvrir.
  if (groups.length === 1 && groups[0].theme === null) {
    return <div className="mt-4">{list(groups[0].chapters)}</div>
  }

  return (
    <div className="mt-4 flex flex-col gap-3">
      {groups.map((group, i) => {
        const done = group.chapters.filter((c) => c.status === 'complete').length
        return (
          <details
            key={group.theme ?? `sans-theme-${i}`}
            open={i === open}
            className="group rounded-2xl border bg-card/60 px-3 py-2 open:pb-3"
          >
            <summary className="flex cursor-pointer list-none items-center gap-3 py-1.5">
              <span className="min-w-0 flex-1">
                <span className="font-heading block font-bold text-balance">
                  {group.theme ?? 'Autres chapitres'}
                </span>
                <span className="text-xs font-semibold text-muted-foreground tabular-nums">
                  {done}/{group.chapters.length} chapitre
                  {group.chapters.length > 1 ? 's' : ''}
                </span>
              </span>
              <ChevronDown
                className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <div className="mt-2">{list(group.chapters)}</div>
          </details>
        )
      })}
    </div>
  )
}
