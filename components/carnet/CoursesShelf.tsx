'use client'

import Link from 'next/link'
import { ChevronRight, NotebookPen, Play } from 'lucide-react'
import { sfx } from '@/lib/sounds'
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
 * compteur de questions.
 *
 * Chaque ligne porte désormais SES DEUX gestes : ouvrir le cours (toute la
 * ligne) et le réviser tout de suite (le bouton ▶). Réviser demandait avant
 * d'ouvrir le cours, de trouver le bouton « Réviser », puis de choisir la
 * portée — trois écrans pour l'action qu'on vient faire le plus souvent.
 * La création, elle, a quitté l'en-tête pour le bouton flottant (CarnetFab) :
 * elle reste à portée de pouce où qu'on soit dans la liste.
 */
export default function CoursesShelf({ items }: { items: CourseShelfItem[] }) {
  return (
    <section
      aria-label="Mes cours"
      className="rev-card rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5"
    >
      <div className="mb-3 flex items-center gap-3 px-1">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <NotebookPen className="size-5" strokeWidth={2.2} aria-hidden="true" />
        </span>
        <h2 className="font-heading min-w-0 flex-1 truncate text-lg font-extrabold text-foreground">
          Mes cours
        </h2>
        {items.length > 0 ? (
          <span className="shrink-0 rounded-full bg-primary/12 px-2.5 py-1 font-mono text-[11px] font-bold text-primary tabular-nums">
            {items.length}
          </span>
        ) : null}
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl bg-muted/40 px-4 py-8 text-center">
          <p className="text-4xl" aria-hidden="true">
            📚
          </p>
          <p className="font-heading mt-2 text-base font-extrabold text-foreground">
            Ton carnet est vide
          </p>
          <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">
            Un cours = un paquet de questions à toi (« Anglais — irréguliers »,
            « SVT chap. 2 »). Touche le bouton{' '}
            <span className="font-bold text-primary">+</span> en bas à droite
            pour en créer un, seul ou avec l&apos;IA.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((course) => {
            const Icon = COURSE_ICON[normalizeCourseIcon(course.icon)]
            const tint = COURSE_TINT[normalizeCourseColor(course.color)]
            const revisable = course.questionCount > 0
            return (
              <li
                key={course.id}
                className="flex items-center gap-2 rounded-2xl ring-1 ring-black/5 transition active:scale-[0.99]"
              >
                <Link
                  href={`/reviser/cours/${course.id}`}
                  onClick={() => sfx.tap()}
                  className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl py-3 pl-3"
                >
                  <span
                    className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${tint}`}
                  >
                    <Icon className="size-5" strokeWidth={2.2} aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="font-heading line-clamp-2 text-[0.95rem] leading-snug font-extrabold text-foreground">
                      {course.title}
                    </span>
                    <span className="mt-0.5 block text-xs font-semibold text-muted-foreground">
                      {revisable
                        ? `${course.questionCount} ${course.questionCount > 1 ? 'questions' : 'question'}`
                        : 'Vide — ajoute tes premières questions'}
                    </span>
                  </span>
                </Link>

                {/* Le geste le plus fréquent, à un tap : réviser ce cours. Un
                    cours vide n'a rien à réviser — on montre alors la simple
                    flèche d'ouverture plutôt qu'un bouton qui ne ferait rien. */}
                {revisable ? (
                  <Link
                    href={`/reviser/cours/${course.id}/reviser`}
                    onClick={() => sfx.tap()}
                    aria-label={`Réviser ${course.title}`}
                    className="mr-3 flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition active:translate-y-px"
                  >
                    <Play className="size-4 fill-current" aria-hidden="true" />
                  </Link>
                ) : (
                  <ChevronRight
                    className="mr-4 size-4 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                )}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
