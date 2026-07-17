'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { toast } from '@/lib/toast'
import { addGradeAction } from '@/app/moi/actions'
import { useDialog } from '@/lib/use-dialog'
import type { SchoolGrade } from '@/lib/notes'

export type SubjectLite = { slug: string; name: string; icon: string }

// -----------------------------------------------------------------------------
// Bottom-sheet « Nouvelle note » : l'élève reporte la note d'un vrai contrôle
// (matière, note /barème, coefficient, date). Même contrat qu'AddExamSheet :
// la feuille ne se ferme qu'en cas de succès réel (167 passée, insert OK) —
// sinon erreur affichée, pas de fausse impression d'enregistrement.
// -----------------------------------------------------------------------------
export default function AddGradeSheet({
  subjects,
  today,
  onAdded,
  onClose,
}: {
  subjects: SubjectLite[]
  today: string // clé UTC 'YYYY-MM-DD' (date par défaut du contrôle)
  onAdded: (grade: SchoolGrade) => void
  onClose: () => void
}) {
  const [subject, setSubject] = useState('')
  const [score, setScore] = useState('')
  const [outOf, setOutOf] = useState('20')
  const [coefficient, setCoefficient] = useState('1')
  const [date, setDate] = useState(today)
  const [label, setLabel] = useState('')
  const [error, setError] = useState(false)
  const [pending, startTransition] = useTransition()
  const firstFieldRef = useRef<HTMLSelectElement>(null)

  // Échap ferme + fond figé : primitive commune des modales maison (useDialog).
  useDialog(onClose)
  // A11y : au montage, on amène le focus dans la feuille.
  useEffect(() => {
    firstFieldRef.current?.focus()
  }, [])

  const scoreNum = Number(score.replace(',', '.'))
  const outOfNum = Number(outOf.replace(',', '.'))
  const coeffNum = Number(coefficient.replace(',', '.'))
  const isValid =
    subject.length > 0 &&
    score.trim().length > 0 &&
    Number.isFinite(scoreNum) &&
    Number.isFinite(outOfNum) &&
    Number.isFinite(coeffNum) &&
    scoreNum >= 0 &&
    outOfNum > 0 &&
    scoreNum <= outOfNum &&
    coeffNum > 0 &&
    /^\d{4}-\d{2}-\d{2}$/.test(date)

  function submit() {
    if (!isValid || pending) return
    sfx.tap()
    setError(false)
    startTransition(async () => {
      const res = await addGradeAction({
        subject,
        score: scoreNum,
        outOf: outOfNum,
        coefficient: coeffNum,
        date,
        label: label.trim().length > 0 ? label.trim() : null,
      })
      if (res.ok && res.grade) {
        toast('Note ajoutée ✓')
        onAdded(res.grade)
        onClose()
      } else setError(true)
    })
  }

  const fieldClass =
    'min-h-11 w-full rounded-2xl border border-border bg-muted/40 px-3 text-sm font-medium text-foreground'

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Nouvelle note"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-3xl bg-white p-5 shadow-xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-extrabold text-foreground">
            Nouvelle note
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
              onChange={(e) => setSubject(e.target.value)}
              className={fieldClass}
            >
              <option value="">Choisir une matière…</option>
              {subjects.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.icon} {s.name}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-3 gap-2">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-muted-foreground">
                Note
              </span>
              <input
                type="text"
                inputMode="decimal"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder="14,5"
                aria-label="Note obtenue"
                className={fieldClass}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-muted-foreground">
                Sur
              </span>
              <input
                type="text"
                inputMode="decimal"
                value={outOf}
                onChange={(e) => setOutOf(e.target.value)}
                aria-label="Barème (note maximale)"
                className={fieldClass}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-muted-foreground">
                Coeff.
              </span>
              <input
                type="text"
                inputMode="decimal"
                value={coefficient}
                onChange={(e) => setCoefficient(e.target.value)}
                aria-label="Coefficient"
                className={fieldClass}
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-muted-foreground">
              Date du contrôle
            </span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={fieldClass}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-muted-foreground">
              Intitulé (facultatif)
            </span>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              maxLength={120}
              placeholder="Ex. Contrôle sur les fractions"
              className={fieldClass}
            />
          </label>
        </div>

        {error ? (
          <p
            role="alert"
            className="mt-3 rounded-2xl bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive"
          >
            Impossible d&apos;enregistrer cette note pour le moment. Réessaie.
          </p>
        ) : null}

        <button
          type="button"
          onClick={submit}
          disabled={!isValid || pending}
          className={cn(
            'mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-4 font-heading text-base font-extrabold text-primary-foreground shadow-sm transition active:translate-y-px',
            (!isValid || pending) && 'opacity-60',
          )}
        >
          <Plus className="size-5" strokeWidth={2.8} aria-hidden="true" />
          {pending ? 'Ajout…' : 'Ajouter cette note'}
        </button>
      </div>
    </div>
  )
}
