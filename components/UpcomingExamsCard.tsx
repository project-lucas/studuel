'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, useTransition } from 'react'
import { createPortal } from 'react-dom'
import { Target, Plus, Play, X, CalendarClock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { examCountdownLabel, type NextExam } from '@/lib/next-exam'
import { addUpcomingExam, removeUpcomingExam } from '@/app/moi/actions'

type SubjectLite = { slug: string; name: string; icon: string }
type ChapterLite = { id: string; title: string }

// -----------------------------------------------------------------------------
// « Mes contrôles à venir » — l'élève annonce ses prochains contrôles (matière +
// chapitre + date). La liste s'empile au fil des jours ; le Défi pioche ensuite
// ses questions dans ces chapitres. Style claymorphism (cartes jouet, coins
// doux, doubles ombres), mobile-first. Voir lib/next-exam.ts.
// -----------------------------------------------------------------------------
export default function UpcomingExamsCard({
  exams,
  today,
  subjects,
  chaptersBySubject,
}: {
  exams: NextExam[]
  today: string
  subjects: SubjectLite[]
  chaptersBySubject: Record<string, ChapterLite[]>
}) {
  const [adding, setAdding] = useState(false)
  const [pending, startTransition] = useTransition()

  const iconBySlug = new Map(subjects.map((s) => [s.slug, s.icon]))

  function remove(chapterId: string) {
    sfx.tap()
    startTransition(async () => {
      await removeUpcomingExam(chapterId)
    })
  }

  // Pas de matière disponible (catalogue non chargé / classe non réglée).
  if (subjects.length === 0) {
    return (
      <section className="moi-card rounded-3xl bg-white px-5 py-4 text-center">
        <p className="text-sm text-muted-foreground">
          Choisis ta classe pour annoncer tes prochains contrôles.
        </p>
      </section>
    )
  }

  return (
    <section
      aria-label="Mes contrôles à venir"
      className="moi-card overflow-hidden rounded-3xl bg-white"
    >
      <div className="flex items-center justify-between gap-2 px-5 pt-4">
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Target className="size-5" strokeWidth={2.2} aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-heading text-base font-bold text-foreground">
              Mes contrôles à venir
            </h2>
            <p className="text-xs text-muted-foreground">
              {exams.length === 0
                ? 'Le Défi révisera avec toi'
                : `${exams.length} au programme · le Défi les révise`}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            sfx.tap()
            setAdding(true)
          }}
          aria-label="Annoncer un nouveau contrôle"
          className="flex h-11 items-center gap-1.5 rounded-full bg-primary px-3.5 font-heading text-sm font-extrabold text-primary-foreground shadow-sm transition active:translate-y-px"
        >
          <Plus className="size-4" strokeWidth={2.8} aria-hidden="true" />
          Contrôle
        </button>
      </div>

      {/* Liste des contrôles annoncés. */}
      {exams.length > 0 ? (
        <ul className="mt-3 space-y-2 px-4">
          {exams.map((exam) => {
            const countdown = examCountdownLabel(exam, today)
            const soon = exam.date !== null && countdown !== 'contrôle passé'
            return (
              <li
                key={exam.chapterId}
                className="flex items-center gap-3 rounded-2xl bg-muted/50 py-2.5 pr-2 pl-3"
              >
                <span className="text-xl" aria-hidden="true">
                  {iconBySlug.get(exam.subject) ?? '📘'}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-foreground">
                    {exam.chapterTitle}
                  </p>
                  {countdown ? (
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 text-xs font-semibold',
                        soon ? 'text-primary' : 'text-muted-foreground',
                      )}
                    >
                      <CalendarClock className="size-3" aria-hidden="true" />
                      {countdown}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Sans date
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => remove(exam.chapterId)}
                  disabled={pending}
                  aria-label={`Retirer le contrôle sur ${exam.chapterTitle}`}
                  className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted active:scale-90 disabled:opacity-60"
                >
                  <X className="size-4" strokeWidth={2.4} aria-hidden="true" />
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}

      {/* Le pont vers le Défi : c'est LUI qui révise les contrôles annoncés. */}
      {exams.length > 0 ? (
        <div className="px-4 pt-3 pb-4">
          <Link
            href="/defi"
            onClick={() => sfx.tap()}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3.5 font-heading text-base font-extrabold text-primary-foreground shadow-sm transition active:translate-y-px"
          >
            <Play className="size-5" strokeWidth={2.6} aria-hidden="true" />
            Réviser mes contrôles
          </Link>
        </div>
      ) : (
        <div className="px-5 pb-5" />
      )}

      {adding
        ? createPortal(
            <AddExamSheet
              subjects={subjects}
              chaptersBySubject={chaptersBySubject}
              existing={new Set(exams.map((e) => e.chapterId))}
              onClose={() => setAdding(false)}
            />,
            document.body,
          )
        : null}
    </section>
  )
}

// -----------------------------------------------------------------------------
// Bottom-sheet « Nouveau contrôle » : flow rapide matière → chapitre → date.
// Possède sa propre transition : la feuille ne se ferme qu'en cas de succès réel
// (RPC add_upcoming_exam OK) ; sinon elle affiche une erreur et reste ouverte —
// pas de fausse impression d'enregistrement (ex. 087 pas encore passée).
// -----------------------------------------------------------------------------
function AddExamSheet({
  subjects,
  chaptersBySubject,
  existing,
  onClose,
}: {
  subjects: SubjectLite[]
  chaptersBySubject: Record<string, ChapterLite[]>
  existing: Set<string>
  onClose: () => void
}) {
  const [subject, setSubject] = useState('')
  const [chapterId, setChapterId] = useState('')
  const [date, setDate] = useState('')
  const [error, setError] = useState(false)
  const [pending, startTransition] = useTransition()
  const firstFieldRef = useRef<HTMLSelectElement>(null)

  // A11y : au montage, on amène le focus dans la feuille et on la ferme à Escape.
  useEffect(() => {
    firstFieldRef.current?.focus()
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const chapters = subject ? (chaptersBySubject[subject] ?? []) : []

  function submit() {
    if (!chapterId || pending) return
    sfx.tap()
    setError(false)
    startTransition(async () => {
      const res = await addUpcomingExam(chapterId, date || null)
      if (res.ok) onClose()
      else setError(true)
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Nouveau contrôle"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-3xl bg-white p-5 shadow-xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-extrabold text-foreground">
            Nouveau contrôle
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted active:scale-90"
          >
            <X className="size-5" strokeWidth={2.4} aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-muted-foreground">
              Matière
            </span>
            <select
              ref={firstFieldRef}
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value)
                setChapterId('')
              }}
              className="min-h-11 w-full rounded-2xl border border-border bg-muted/40 px-3 text-sm font-medium text-foreground"
            >
              <option value="">Choisir une matière…</option>
              {subjects.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.icon} {s.name}
                </option>
              ))}
            </select>
          </label>

          {subject ? (
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-muted-foreground">
                Chapitre
              </span>
              <select
                value={chapterId}
                onChange={(e) => setChapterId(e.target.value)}
                className="min-h-11 w-full rounded-2xl border border-border bg-muted/40 px-3 text-sm font-medium text-foreground"
              >
                <option value="">Choisir un chapitre…</option>
                {chapters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {existing.has(c.id) ? '✓ ' : ''}
                    {c.title}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-muted-foreground">
              Date du contrôle (facultatif)
            </span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="min-h-11 w-full rounded-2xl border border-border bg-muted/40 px-3 text-sm font-medium text-foreground"
            />
          </label>
        </div>

        {error ? (
          <p
            role="alert"
            className="mt-3 rounded-2xl bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive"
          >
            Impossible d&apos;enregistrer ce contrôle pour le moment. Réessaie.
          </p>
        ) : null}

        <button
          type="button"
          onClick={submit}
          disabled={!chapterId || pending}
          className={cn(
            'mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-4 font-heading text-base font-extrabold text-primary-foreground shadow-sm transition active:translate-y-px',
            (!chapterId || pending) && 'opacity-60',
          )}
        >
          <Plus className="size-5" strokeWidth={2.8} aria-hidden="true" />
          {pending ? 'Ajout…' : 'Ajouter ce contrôle'}
        </button>
      </div>
    </div>
  )
}
