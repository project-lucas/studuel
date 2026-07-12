'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BadgeCheck, Check, Search, Sparkles, WandSparkles, X } from 'lucide-react'
import BackButton from '@/components/BackButton'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { subjectTheme, subjectDecor, GRID_PATTERN } from '@/lib/subject-style'
import SubjectIcon from '@/components/SubjectIcon'
import ProgressRing from '@/components/ProgressRing'
import { Button } from '@/components/ui/button'
import type { Subject } from '@/lib/types'

// Une leçon (sous-chapitre) affichée dans le programme, avec son anneau.
export type ProgrammeLesson = {
  id: string
  chapterId: string
  title: string
  progress: number // 0..1
  done: number // supports consultés
  total: number // supports disponibles
}

export type ProgrammeChapter = {
  id: string
  title: string
  position: number
  lessons: ProgrammeLesson[]
}

// Page matière du template « structure des cours » : header coloré, pills de
// navigation à l'horizontale, puis LA liste — chapitres en sections verticales,
// leçons en cartes cliquables avec anneau d'avancement. Bouton IA flottant.
export default function SubjectProgramme({
  subject,
  grade,
  chapters,
  globalPct,
  premium,
}: {
  subject: Subject
  grade: string
  chapters: ProgrammeChapter[]
  globalPct: number
  premium: boolean
}) {
  const [query, setQuery] = useState('')
  const theme = subjectTheme(subject.color)
  const decor = subjectDecor(subject.slug)

  const norm = (s: string) =>
    s
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
  // Filtre sur les titres de chapitres ET de leçons : un chapitre reste
  // visible si lui-même ou l'une de ses leçons correspond.
  const filtered = chapters
    .map((c) => ({
      ...c,
      lessons: norm(c.title).includes(norm(query))
        ? c.lessons
        : c.lessons.filter((l) => norm(l.title).includes(norm(query))),
    }))
    .filter(
      (c) => norm(c.title).includes(norm(query)) || c.lessons.length > 0,
    )

  return (
    <div className="-mx-4 -mt-16 md:-mx-8 md:-mt-10">
      {/* Header coloré de la matière (décor d'arène si disponible) */}
      <header
        className={cn(
          'relative overflow-hidden px-4 pt-20 pb-10 text-white md:px-8 md:pt-12',
          decor ? null : cn('arena-tile', theme.arena),
        )}
        style={
          decor
            ? {
                backgroundImage: `linear-gradient(to bottom, rgba(10,14,30,0.45), rgba(10,14,30,0.15) 45%, rgba(10,14,30,0.4)), url(${decor})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center top',
              }
            : undefined
        }
      >
        {decor ? null : (
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={GRID_PATTERN}
            aria-hidden="true"
          />
        )}
        <div className="relative mx-auto w-full max-w-4xl">
          <BackButton fallback="/reviser" label="Retour aux matières" className="mb-4" />
          <div className="flex items-center gap-4">
            <span className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white/15 shadow-[inset_0_-2px_3px_rgba(0,0,0,0.25)]">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-2 top-1 h-5 rounded-full bg-gradient-to-b from-white/40 to-transparent"
              />
              <SubjectIcon
                slug={subject.slug}
                className="size-7 drop-shadow-[0_1.5px_1px_rgba(0,0,0,0.35)]"
                strokeWidth={2.25}
                aria-hidden="true"
              />
            </span>
            <div className="min-w-0 flex-1">
              <h1 className="font-heading text-3xl font-bold md:text-4xl">
                {subject.name}
              </h1>
              <p className="text-sm font-medium opacity-70">
                Programme de {grade} · {globalPct}% travaillé
              </p>
            </div>
          </div>

          {/* Barre de progression globale de la matière */}
          <div
            className="mt-3 h-2 w-full overflow-hidden rounded-full bg-black/25"
            role="progressbar"
            aria-label={`${subject.name} — ${globalPct}% travaillé`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={globalPct}
          >
            <div
              className="bar-fill h-full rounded-full bg-highlight transition-all"
              style={{ width: `${globalPct}%` }}
            />
          </div>

          {/* Recherche : filtre client sur chapitres et leçons */}
          <label className="mt-5 flex items-center gap-2 rounded-full bg-card/90 px-4 py-2.5 text-foreground shadow-sm backdrop-blur">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Chercher un sujet"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </label>

          {/* Pills de navigation à l'horizontale (template) */}
          <nav
            aria-label="Contenus de la matière"
            className="hide-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0"
          >
            <span
              aria-current="page"
              className="shrink-0 rounded-full bg-card px-4 py-1.5 text-sm font-bold text-foreground shadow-sm"
            >
              Programme
            </span>
            <Link
              href="/studio"
              className="shrink-0 rounded-full border border-white/50 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Contenus IA
            </Link>
            <Link
              href="/reviser/revoir"
              className="shrink-0 rounded-full border border-white/50 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              À revoir
            </Link>
          </nav>
        </div>
      </header>

      {/* Panneau du programme : il chevauche le header, façon carnet */}
      <div className="relative -mt-6 rounded-t-3xl bg-background">
        <div className="mx-auto w-full max-w-4xl px-4 pt-5 pb-24 md:px-8">
          {/* Badge de confiance (template « Contenus certifiés ! ») */}
          <p className="flex justify-end">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700 dark:bg-sky-950/60 dark:text-sky-300">
              Contenus certifiés !
              <BadgeCheck className="size-4" aria-hidden="true" />
            </span>
          </p>

          {filtered.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">
              {chapters.length === 0
                ? `Le programme de ${subject.name} en ${grade} arrive bientôt.`
                : `Aucun chapitre ne correspond à « ${query} ».`}
            </p>
          ) : (
            <div className="mt-2 flex flex-col gap-8">
              {filtered.map((chapter) => (
                <section key={chapter.id} aria-labelledby={`chap-${chapter.id}`}>
                  <p className="text-sm font-semibold text-muted-foreground">
                    Chapitre {chapter.position}
                  </p>
                  <h2
                    id={`chap-${chapter.id}`}
                    className="font-heading mt-0.5 text-xl font-bold text-balance md:text-2xl"
                  >
                    {chapter.title}
                  </h2>

                  {chapter.lessons.length === 0 ? (
                    <p className="mt-3 text-sm text-muted-foreground">
                      Les leçons de ce chapitre arrivent bientôt.
                    </p>
                  ) : (
                    <ul className="mt-3 flex flex-col gap-3">
                      {chapter.lessons.map((lesson) => (
                        <li key={lesson.id}>
                          <Link
                            href={`/reviser/${subject.slug}/${lesson.chapterId}/${lesson.id}`}
                            onClick={() => sfx.tap()}
                            className="flex items-center gap-4 rounded-2xl border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]"
                          >
                            <ProgressRing
                              value={lesson.progress}
                              size={44}
                              label={`${lesson.title} — ${Math.round(lesson.progress * 100)} % d'avancement, ${lesson.done} support${lesson.done > 1 ? 's' : ''} sur ${lesson.total}`}
                              fillClassName={theme.stroke}
                            >
                              {lesson.progress >= 1 ? (
                                // La classe stroke-* (CSS) prime sur le
                                // stroke="currentColor" de lucide : la coche
                                // prend la couleur de la matière.
                                <Check
                                  className={cn('size-4', theme.stroke)}
                                  strokeWidth={3}
                                  aria-hidden="true"
                                />
                              ) : null}
                            </ProgressRing>
                            <span className="min-w-0 flex-1 font-semibold text-balance">
                              {lesson.title}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          )}
        </div>
      </div>

      <AiFab premium={premium} />
    </div>
  )
}

// Bouton IA flottant (template) : baguette magique en bas à droite.
// Premium → Studio IA directement ; sinon, mini-carte d'invitation à l'offre.
function AiFab({ premium }: { premium: boolean }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  return (
    <div className="fixed right-4 bottom-20 z-40 flex flex-col items-end gap-2 md:bottom-8">
      {open ? (
        <div className="pop-in w-64 rounded-2xl border bg-card p-4 shadow-lg">
          <p className="flex items-center gap-1.5 text-sm font-bold">
            <Sparkles className="size-4 text-primary" aria-hidden="true" />
            Assistant IA
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Fiches et quiz générés par IA sur ce programme — réservé à
            l&apos;Offre 1.
          </p>
          <Button asChild size="sm" className="mt-3 w-full rounded-full">
            <Link href="/compte">Découvrir l&apos;offre</Link>
          </Button>
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => {
          sfx.tap()
          if (premium) router.push('/studio')
          else setOpen((o) => !o)
        }}
        aria-label={
          premium
            ? 'Ouvrir les contenus IA'
            : open
              ? 'Fermer l’assistant IA'
              : 'Découvrir l’assistant IA'
        }
        aria-expanded={premium ? undefined : open}
        className="press-3d-deep flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg"
      >
        {open && !premium ? (
          <X className="size-6" aria-hidden="true" />
        ) : (
          <WandSparkles className="size-6" aria-hidden="true" />
        )}
      </button>
    </div>
  )
}
