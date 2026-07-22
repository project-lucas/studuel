'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { toast } from '@/lib/toast'
import { addUpcomingExams } from '@/app/moi/actions'
import { useDialog } from '@/lib/use-dialog'

export type SubjectLite = { slug: string; name: string; icon: string }
export type ChapterLite = { id: string; title: string }

// -----------------------------------------------------------------------------
// Bottom-sheet « Nouveau contrôle » : flow rapide matière → chapitres → date.
// Un contrôle peut porter sur plusieurs chapitres : une case par chapitre,
// chaque chapitre coché devient un contrôle (2 cases = 2 contrôles, même date).
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
  const [chapterIds, setChapterIds] = useState<string[]>([])
  const [date, setDate] = useState('')
  const [error, setError] = useState<'none' | 'all' | 'partial'>('none')
  const [pending, startTransition] = useTransition()
  const firstFieldRef = useRef<HTMLSelectElement>(null)

  // Échap ferme + fond figé : primitive commune des modales maison (useDialog).
  useDialog(onClose)
  // A11y : au montage, on amène le focus dans la feuille.
  useEffect(() => {
    firstFieldRef.current?.focus()
  }, [])

  const chapters = subject ? (chaptersBySubject[subject] ?? []) : []
  const count = chapterIds.length

  function toggleChapter(id: string) {
    sfx.tap()
    setChapterIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    )
  }

  function submit() {
    if (count === 0 || pending) return
    sfx.tap()
    setError('none')
    startTransition(async () => {
      const res = await addUpcomingExams(chapterIds, date || null)
      if (res.ok) {
        toast(res.added > 1 ? `${res.added} contrôles ajoutés ✓` : 'Contrôle ajouté ✓')
        onClose()
      } else setError(res.added > 0 ? 'partial' : 'all')
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
                setChapterIds([])
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
            <fieldset>
              <legend className="mb-1 block text-xs font-semibold text-muted-foreground">
                Chapitres — un contrôle par chapitre coché
              </legend>
              <div className="max-h-52 space-y-1.5 overflow-y-auto rounded-2xl border border-border bg-muted/40 p-1.5">
                {chapters.length === 0 ? (
                  <p className="px-2 py-1.5 text-sm text-muted-foreground">
                    Aucun chapitre dans cette matière.
                  </p>
                ) : (
                  chapters.map((c) => {
                    const checked = chapterIds.includes(c.id)
                    return (
                      <label
                        key={c.id}
                        className={cn(
                          'flex min-h-11 cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-sm font-medium text-foreground transition-colors',
                          checked ? 'bg-primary/10' : 'hover:bg-muted',
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleChapter(c.id)}
                          className="size-4 shrink-0 accent-primary"
                        />
                        <span className="min-w-0 flex-1">{c.title}</span>
                        {existing.has(c.id) ? (
                          <span className="shrink-0 text-[10px] font-bold text-muted-foreground">
                            déjà annoncé ✓
                          </span>
                        ) : null}
                      </label>
                    )
                  })
                )}
              </div>
            </fieldset>
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

        {error !== 'none' ? (
          <p
            role="alert"
            className="mt-3 rounded-2xl bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive"
          >
            {error === 'partial'
              ? 'Une partie seulement des contrôles a été enregistrée. Décoche ceux qui sont passés et réessaie.'
              : 'Impossible d’enregistrer pour le moment. Réessaie.'}
          </p>
        ) : null}

        <button
          type="button"
          onClick={submit}
          disabled={count === 0 || pending}
          className={cn(
            'mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-4 font-heading text-base font-extrabold text-primary-foreground shadow-sm transition active:translate-y-px',
            (count === 0 || pending) && 'opacity-60',
          )}
        >
          <Plus className="size-5" strokeWidth={2.8} aria-hidden="true" />
          {pending
            ? 'Ajout…'
            : count > 1
              ? `Ajouter ${count} contrôles`
              : 'Ajouter ce contrôle'}
        </button>
      </div>
    </div>
  )
}
