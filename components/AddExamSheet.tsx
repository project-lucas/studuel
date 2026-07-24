'use client'

import { useEffect, useMemo, useRef, useState, useTransition } from 'react'
import { ArrowLeft, CalendarCheck, Check, Plus, Sparkles, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { toast } from '@/lib/toast'
import { createControle } from '@/app/reviser/prep-actions'
import { useDialog } from '@/lib/use-dialog'
import {
  buildSessionDrafts,
  planSummary,
  weekdayLabel,
  daysBetween,
  addDays,
  DEFAULT_GOAL_MINUTES,
} from '@/lib/prep-plan'

export type SubjectLite = { slug: string; name: string; icon: string }
export type ChapterLite = { id: string; title: string }

// -----------------------------------------------------------------------------
// Bottom-sheet « Nouveau contrôle » en DEUX temps :
//   1. Configuration : matière → chapitre(s) → date. Les chapitres cochés
//      forment UN SEUL contrôle (objet unique, pas un par chapitre).
//   2. Confirmation : le plan de préparation généré (répétition espacée sur les
//      jours restants), AJUSTABLE avant de valider — l'élève voit tout de suite
//      ce que l'app fait pour lui (brief §3).
// À la validation, createControle crée le contrôle ET son plan atomiquement
// (invariant « aucun contrôle sans plan »). La feuille ne se ferme qu'en cas de
// succès réel ; sinon elle affiche une erreur et reste ouverte.
// -----------------------------------------------------------------------------
export default function AddExamSheet({
  subjects,
  chaptersBySubject,
  existing,
  today,
  goalMinutes = DEFAULT_GOAL_MINUTES,
  onClose,
}: {
  subjects: SubjectLite[]
  chaptersBySubject: Record<string, ChapterLite[]>
  existing: Set<string>
  today: string
  goalMinutes?: number
  onClose: () => void
}) {
  const [step, setStep] = useState<'config' | 'confirm'>('config')
  const [subject, setSubject] = useState('')
  const [chapterIds, setChapterIds] = useState<string[]>([])
  const [date, setDate] = useState('')
  // Jours du plan retenus (ajustables au 2e écran) — clés UTC.
  const [planDays, setPlanDays] = useState<string[]>([])
  const [error, setError] = useState(false)
  const [pending, startTransition] = useTransition()
  const firstFieldRef = useRef<HTMLSelectElement>(null)

  const panel = useDialog(onClose)
  useEffect(() => {
    firstFieldRef.current?.focus()
  }, [])

  const chapters = useMemo(
    () => (subject ? (chaptersBySubject[subject] ?? []) : []),
    [subject, chaptersBySubject],
  )
  const count = chapterIds.length
  const examDate = date || null

  const selectedChapters = useMemo(
    () => chapters.filter((c) => chapterIds.includes(c.id)),
    [chapters, chapterIds],
  )

  // Jours candidats proposés au 2e écran : de la veille du contrôle en remontant
  // jusqu'à aujourd'hui (au plus une semaine avant, le plan ne s'étale jamais
  // au-delà). Sans date : uniquement aujourd'hui.
  const candidateDays = useMemo(() => {
    if (!examDate) return [today]
    const span = daysBetween(today, examDate)
    if (span < 0) return [today]
    const start = span > 7 ? addDays(examDate, -7) : today
    const days: string[] = []
    for (let d = daysBetween(start, examDate); d >= 0; d--) {
      days.push(addDays(examDate, -d))
    }
    return days
  }, [examDate, today])

  function toggleChapter(id: string) {
    sfx.tap()
    setChapterIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    )
  }

  // Config → Confirmation : on prégénère le plan par défaut (règles J-5/J-2-4/J-1).
  function goToConfirm() {
    if (count === 0 || pending) return
    sfx.tap()
    setError(false)
    const drafts = buildSessionDrafts(
      selectedChapters,
      examDate,
      today,
      goalMinutes,
    )
    setPlanDays(drafts.map((d) => d.plannedDate))
    setStep('confirm')
  }

  function togglePlanDay(day: string) {
    sfx.tap()
    setPlanDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort(),
    )
  }

  function submit() {
    if (planDays.length === 0 || pending) return
    sfx.tap()
    setError(false)
    startTransition(async () => {
      const res = await createControle(chapterIds, examDate, goalMinutes, planDays)
      if (res.ok) {
        toast('Contrôle et plan de révision créés ✓')
        onClose()
      } else setError(true)
    })
  }

  // Résumé lisible du plan retenu, pour le titre de l'écran de confirmation.
  const summary = useMemo(() => {
    const dur = goalMinutes > 0 ? Math.round(goalMinutes) : DEFAULT_GOAL_MINUTES
    const drafts = [...planDays].sort().map((plannedDate, i) => ({
      plannedDate,
      durationMin: dur,
      chapterId: '',
      position: i,
    }))
    return planSummary(examDate, drafts)
  }, [planDays, examDate, goalMinutes])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Nouveau contrôle"
      onClick={onClose}
    >
      <div
        ref={panel}
        className="w-full max-w-md rounded-t-3xl bg-white p-5 shadow-xl outline-none sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading flex items-center gap-2 text-lg font-extrabold text-foreground">
            {step === 'confirm' ? (
              <button
                type="button"
                onClick={() => {
                  sfx.tap()
                  setStep('config')
                }}
                aria-label="Revenir à la configuration"
                className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted active:scale-90"
              >
                <ArrowLeft className="size-5" strokeWidth={2.4} aria-hidden="true" />
              </button>
            ) : null}
            {step === 'config' ? 'Nouveau contrôle' : 'Ton plan de révision'}
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

        {step === 'config' ? (
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
                  Chapitre(s) du contrôle
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
                min={today}
                onChange={(e) => setDate(e.target.value)}
                className="min-h-11 w-full rounded-2xl border border-border bg-muted/40 px-3 text-sm font-medium text-foreground"
              />
            </label>

            <button
              type="button"
              onClick={goToConfirm}
              disabled={count === 0}
              className={cn(
                'mt-1 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-4 font-heading text-base font-extrabold text-primary-foreground shadow-sm transition active:translate-y-px',
                count === 0 && 'opacity-60',
              )}
            >
              <Sparkles className="size-5" strokeWidth={2.6} aria-hidden="true" />
              Voir mon plan
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Ce que l'app fait pour l'élève, en une phrase. */}
            <div className="flex items-start gap-2.5 rounded-2xl bg-primary/8 p-3">
              <CalendarCheck
                className="mt-0.5 size-5 shrink-0 text-primary"
                strokeWidth={2.4}
                aria-hidden="true"
              />
              <p className="text-sm font-semibold text-foreground">{summary}</p>
            </div>

            {/* Ajustement des jours : chaque pastille = un jour de révision. */}
            <div>
              <p className="mb-1.5 text-xs font-semibold text-muted-foreground">
                Ajuste tes jours de révision
              </p>
              <div className="flex flex-wrap gap-1.5">
                {candidateDays.map((day) => {
                  const on = planDays.includes(day)
                  const dayNum = day.slice(8)
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => togglePlanDay(day)}
                      aria-pressed={on}
                      className={cn(
                        'flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-bold transition active:translate-y-px',
                        on
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'bg-muted text-muted-foreground hover:bg-muted/70',
                      )}
                    >
                      {on ? (
                        <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                      ) : null}
                      {weekdayLabel(day)} {dayNum}
                    </button>
                  )
                })}
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {planDays.length > 0
                  ? `${planDays.length} session${planDays.length > 1 ? 's' : ''} de ${goalMinutes} min`
                  : 'Choisis au moins un jour.'}
              </p>
            </div>

            <button
              type="button"
              onClick={submit}
              disabled={planDays.length === 0 || pending}
              className={cn(
                'flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-4 font-heading text-base font-extrabold text-primary-foreground shadow-sm transition active:translate-y-px',
                (planDays.length === 0 || pending) && 'opacity-60',
              )}
            >
              <Plus className="size-5" strokeWidth={2.8} aria-hidden="true" />
              {pending ? 'Création…' : 'Valider le plan'}
            </button>
          </div>
        )}

        {error ? (
          <p
            role="alert"
            className="mt-3 rounded-2xl bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive"
          >
            Impossible d’enregistrer pour le moment. Réessaie.
          </p>
        ) : null}
      </div>
    </div>
  )
}
