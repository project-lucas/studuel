'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronRight, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { subjectTheme, GRID_PATTERN, MASCOT } from '@/lib/subject-style'
import { chapterState, type ChapterState } from '@/lib/mastery'
import type { Subject, Chapter } from '@/lib/types'

// État visuel d'un chapitre selon la maîtrise (meilleur score aux quiz).
const STATE_BADGES: Record<ChapterState, { label: string; cls: string }> = {
  maitrise: {
    label: 'Maîtrisé',
    cls: 'bg-green-600/10 text-green-700 dark:text-green-400',
  },
  en_cours: {
    label: 'En cours',
    cls: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  },
  fragile: { label: 'Fragile', cls: 'bg-destructive/10 text-destructive' },
  a_commencer: { label: 'À commencer', cls: 'bg-muted text-muted-foreground' },
}

// Niveau 2 : header coloré de la matière + recherche + chapitres du programme
// avec leur état de maîtrise (le détail derrière la barre du bloc 2).
export default function ChapterExplorer({
  subject,
  chapters,
  grade,
  mastery,
}: {
  subject: Subject
  chapters: Chapter[]
  grade: string
  mastery: Record<string, number>
}) {
  const [query, setQuery] = useState('')
  const theme = subjectTheme(subject.color)

  // Progression globale de la matière (pondérée par les scores).
  const globalPct =
    chapters.length > 0
      ? Math.round(
          (chapters.reduce((sum, c) => sum + (mastery[c.id] ?? 0), 0) /
            chapters.length) *
            100,
        )
      : 0

  const norm = (s: string) =>
    s
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
  const filtered = chapters.filter((c) => norm(c.title).includes(norm(query)))

  return (
    <div className="-mx-4 -mt-16 md:-mx-8 md:-mt-10">
      {/* Header coloré, motif grille léger */}
      <header
        className={cn('relative overflow-hidden px-4 pt-20 pb-6 md:px-8 md:pt-12', theme.header)}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={GRID_PATTERN}
          aria-hidden="true"
        />
        <div className="relative mx-auto w-full max-w-4xl">
          <Link
            href="/reviser"
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold opacity-80 transition-opacity hover:opacity-100"
          >
            <ArrowLeft className="size-4" /> Mes matières
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-5xl leading-none drop-shadow-sm">{subject.icon}</span>
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
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
            <div
              className={cn('h-full rounded-full transition-all', theme.bar)}
              style={{ width: `${globalPct}%` }}
            />
          </div>

          {/* Recherche : filtre client sur les chapitres */}
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
        </div>
      </header>

      {/* Chapitres */}
      <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-8">
        <h2 className="font-heading mb-4 text-lg font-semibold text-muted-foreground">
          {filtered.length} chapitre{filtered.length > 1 ? 's' : ''}
        </h2>

        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {chapters.length === 0
              ? `Le programme de ${subject.name} en ${grade} arrive bientôt.`
              : `Aucun chapitre ne correspond à « ${query} ».`}
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {filtered.map((chapter) => (
              <li key={chapter.id}>
                <Link
                  href={`/reviser/${subject.slug}/${chapter.id}`}
                  className="flex items-center gap-4 rounded-2xl border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]"
                >
                  <span
                    className={cn(
                      'flex size-12 shrink-0 items-center justify-center rounded-xl text-2xl',
                      theme.chip,
                    )}
                  >
                    {MASCOT}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">
                      {chapter.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Chapitre {chapter.position}
                    </span>
                  </span>
                  {(() => {
                    const m = mastery[chapter.id]
                    const state = chapterState(m)
                    const badge = STATE_BADGES[state]
                    return (
                      <span
                        className={cn(
                          'shrink-0 rounded-full px-2.5 py-0.5 font-mono text-[11px] font-semibold tabular-nums',
                          badge.cls,
                        )}
                      >
                        {m !== undefined
                          ? `${badge.label} · ${Math.round(m * 100)}%`
                          : badge.label}
                      </span>
                    )
                  })()}
                  <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
