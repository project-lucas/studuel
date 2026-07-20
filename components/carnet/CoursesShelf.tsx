'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronRight, GraduationCap, Plus } from 'lucide-react'
import { sfx } from '@/lib/sounds'
import { createCourse } from '@/app/reviser/cours/actions'
import {
  normalizeCourseColor,
  normalizeCourseIcon,
} from '@/lib/carnet-cours'
import { COURSE_ICON, COURSE_TINT } from '@/components/carnet/style'

// Un cours prêt à afficher sur l'étagère (calculé côté serveur).
export type CourseShelfItem = {
  id: string
  title: string
  description: string | null
  icon: string | null
  color: string | null
  questionCount: number
}

/**
 * « Mes cours » — LE bloc de Mon carnet : les cours créés par l'élève (façon
 * Wooflash), chacun avec son icône dans un container arrondi pastel et son
 * compteur de questions. Remplace l'ancienne Bibliothèque.
 */
export default function CoursesShelf({ items }: { items: CourseShelfItem[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [failed, setFailed] = useState(false)

  const create = () => {
    if (pending) return
    sfx.tap()
    setFailed(false)
    startTransition(async () => {
      const res = await createCourse()
      if (res.ok && res.id) router.push(`/reviser/cours/${res.id}`)
      else setFailed(true)
    })
  }

  return (
    <section
      aria-label="Mes cours"
      className="rev-card rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5"
    >
      <div className="mb-3 flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <GraduationCap className="size-5" strokeWidth={2.2} aria-hidden="true" />
        </span>
        <h2 className="font-heading min-w-0 flex-1 truncate text-lg font-extrabold text-foreground">
          Mes cours
        </h2>
        <button
          type="button"
          disabled={pending}
          onClick={create}
          className="font-heading flex shrink-0 cursor-pointer items-center gap-1 rounded-full bg-primary px-3.5 py-2 text-xs font-extrabold text-primary-foreground shadow-sm transition active:translate-y-px disabled:opacity-60"
        >
          <Plus className="size-4" strokeWidth={2.8} aria-hidden="true" />
          {pending ? 'Création…' : 'Créer un cours'}
        </button>
      </div>

      {failed ? (
        <p
          role="alert"
          className="mb-3 rounded-2xl bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive"
        >
          La création a échoué. Réessaie dans un instant.
        </p>
      ) : null}

      {items.length === 0 ? (
        <p className="rounded-2xl bg-muted/40 px-3 py-4 text-center text-sm text-muted-foreground">
          Crée ton premier cours (« Anglais 3e », « SVT — chapitre 2 »…) puis
          remplis-le de questions à réviser 📚
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((course) => {
            const Icon = COURSE_ICON[normalizeCourseIcon(course.icon)]
            const tint = COURSE_TINT[normalizeCourseColor(course.color)]
            return (
              <li key={course.id}>
                <Link
                  href={`/reviser/cours/${course.id}`}
                  onClick={() => sfx.tap()}
                  className="flex items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-black/5 transition active:scale-[0.99]"
                >
                  <span
                    className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${tint}`}
                  >
                    <Icon className="size-5" strokeWidth={2.2} aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="font-heading line-clamp-2 text-sm leading-snug font-extrabold text-foreground">
                      {course.title}
                    </span>
                    <span className="mt-0.5 block text-[11px] font-semibold text-muted-foreground">
                      {course.questionCount}{' '}
                      {course.questionCount > 1 ? 'questions' : 'question'}
                    </span>
                  </span>
                  <ChevronRight
                    className="size-4 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
