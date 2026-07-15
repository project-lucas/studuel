'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { addUpcomingExam } from '@/app/moi/actions'
import { useDialog } from '@/lib/use-dialog'

export type SubjectLite = { slug: string; name: string; icon: string }
export type ChapterLite = { id: string; title: string }

// -----------------------------------------------------------------------------
// Bottom-sheet « Nouveau contrôle » : flow rapide matière → chapitre → date.
// Possède sa propre transition : la feuille ne se ferme qu'en cas de succès réel
// (RPC add_upcoming_exam OK) ; sinon elle affiche une erreur et reste ouverte —
// pas de fausse impression d'enregistrement (ex. 087 pas encore passée).
//
// Extrait de UpcomingExamsCard pour être partagé avec la barre de semaine
// (WeekPlannerStrip) de l'onglet Réviser.
// -----------------------------------------------------------------------------
export default function AddExamSheet({
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

  // Échap ferme + fond figé : primitive commune des modales maison (useDialog).
  useDialog(onClose)
  // A11y : au montage, on amène le focus dans la feuille.
  useEffect(() => {
    firstFieldRef.current?.focus()
  }, [])

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
