'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronRight, Crown, NotebookPen, Play } from 'lucide-react'
import { cn } from '@/lib/utils'
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
  /** Questions dues aujourd'hui (moteur « à revoir », lib/carnet-revoir). */
  dueCount: number
  /** Couronnes de maîtrise (0 → 3), depuis les tentatives. */
  crowns: 0 | 1 | 2 | 3
}

// Les trois couronnes d'un cours : pleines = maîtrisées, éteintes = à gagner.
function Crowns({ count }: { count: 0 | 1 | 2 | 3 }) {
  return (
    <span
      className="inline-flex items-center gap-0.5"
      role="img"
      aria-label={`${count} couronne${count > 1 ? 's' : ''} sur 3`}
    >
      {[0, 1, 2].map((i) => (
        <Crown
          key={i}
          className={cn(
            'size-3.5',
            i < count ? 'fill-highlight text-highlight' : 'text-black/15',
          )}
          strokeWidth={2.4}
          aria-hidden="true"
        />
      ))}
    </span>
  )
}

// Une ligne de cours rempli : icône pastel, couronnes, badge « à revoir »,
// ▶ direct. La liste devient un tableau de bord, plus un annuaire de fichiers.
function CourseRow({ course }: { course: CourseShelfItem }) {
  const Icon = COURSE_ICON[normalizeCourseIcon(course.icon)]
  const tint = COURSE_TINT[normalizeCourseColor(course.color)]
  return (
    <li className="flex items-center gap-2 rounded-2xl ring-1 ring-black/5 transition active:scale-[0.99]">
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
          <span className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <Crowns count={course.crowns} />
            <span aria-hidden="true">·</span>
            {course.questionCount}{' '}
            {course.questionCount > 1 ? 'questions' : 'question'}
          </span>
        </span>
      </Link>

      {/* Le badge d'urgence : ce que ce cours réclame aujourd'hui. */}
      {course.dueCount > 0 ? (
        <span className="shrink-0 rounded-full bg-accent/60 px-2 py-0.5 text-[11px] font-extrabold text-foreground/80 tabular-nums">
          {course.dueCount} à revoir
        </span>
      ) : null}

      {/* Le geste le plus fréquent, à un tap : réviser ce cours. */}
      <Link
        href={`/reviser/cours/${course.id}/reviser`}
        onClick={() => sfx.tap()}
        aria-label={`Réviser ${course.title}`}
        className="mr-3 flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition active:translate-y-px"
      >
        <Play className="size-4 fill-current" aria-hidden="true" />
      </Link>
    </li>
  )
}

/**
 * « Mes cours » — LE bloc de Mon carnet, en tableau de bord : chaque cours
 * rempli porte ses couronnes de maîtrise, son badge « n à revoir » et son ▶.
 * Les cours VIDES quittent la liste principale : ils se replient dans une
 * rangée « Brouillons » (dépliable) au lieu de noyer les cours qui vivent.
 */
export default function CoursesShelf({ items }: { items: CourseShelfItem[] }) {
  const filled = items.filter((c) => c.questionCount > 0)
  const drafts = items.filter((c) => c.questionCount === 0)
  const [draftsOpen, setDraftsOpen] = useState(false)

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
        {filled.length > 0 ? (
          <span className="shrink-0 rounded-full bg-primary/12 px-2.5 py-1 font-mono text-[11px] font-bold text-primary tabular-nums">
            {filled.length}
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
          {filled.map((course) => (
            <CourseRow key={course.id} course={course} />
          ))}

          {/* Les brouillons (cours sans question), repliés : visibles quand on
              les cherche, invisibles quand on vient réviser. */}
          {drafts.length > 0 ? (
            <li className="flex flex-col rounded-2xl bg-muted/40 ring-1 ring-black/5">
              <button
                type="button"
                onClick={() => {
                  sfx.tap()
                  setDraftsOpen((v) => !v)
                }}
                aria-expanded={draftsOpen}
                className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3 py-3 text-left"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-black/5 text-xl">
                  🗂️
                </span>
                <span className="min-w-0 flex-1">
                  <span className="font-heading block text-[0.95rem] font-extrabold text-muted-foreground">
                    Brouillons
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {drafts.length} cours{' '}
                    {drafts.length > 1 ? 'vides' : 'vide'} — à remplir ou à
                    supprimer
                  </span>
                </span>
                <ChevronDown
                  className={cn(
                    'mr-1 size-4 shrink-0 text-muted-foreground transition-transform',
                    draftsOpen && 'rotate-180',
                  )}
                  aria-hidden="true"
                />
              </button>
              {draftsOpen ? (
                <ul className="flex flex-col gap-1 px-2 pb-2">
                  {drafts.map((course) => (
                    <li key={course.id}>
                      <Link
                        href={`/reviser/cours/${course.id}`}
                        onClick={() => sfx.tap()}
                        className="flex items-center gap-3 rounded-xl bg-white/70 px-3 py-2.5 transition active:scale-[0.99]"
                      >
                        <span className="min-w-0 flex-1">
                          <span className="font-heading block truncate text-sm font-bold text-foreground">
                            {course.title}
                          </span>
                          <span className="text-[11px] font-semibold text-muted-foreground">
                            Vide — ajoute tes premières questions
                          </span>
                        </span>
                        <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-extrabold text-primary">
                          ＋ Remplir
                        </span>
                        <ChevronRight
                          className="size-4 shrink-0 text-muted-foreground"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ) : null}
        </ul>
      )}
    </section>
  )
}
