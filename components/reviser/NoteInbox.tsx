'use client'

import { useState, useTransition } from 'react'
import { GraduationCap, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { toast } from '@/lib/toast'
import { setControleNote, dismissControleNote } from '@/app/reviser/prep-actions'
import {
  isNoteDue,
  noteRecap,
  daysBetween,
  controleTitle,
  type Controle,
} from '@/lib/prep-plan'
import type { ControleSubjectMeta } from '@/components/WeekPlannerStrip'

// -----------------------------------------------------------------------------
// Boucle post-contrôle (brief §6). Le lendemain de la date, on demande la note
// obtenue (saisie facultative, UNE seule relance : « Plus tard » clôt la
// relance). Une fois la note saisie, on affiche le récap « X sessions de
// préparation → note Y/20 » quelques jours, pour boucler l'effort → résultat.
// -----------------------------------------------------------------------------

// On garde le récap visible ce nombre de jours après le contrôle.
const RECAP_WINDOW_DAYS = 14

function NotePrompt({
  controle,
  meta,
}: {
  controle: Controle
  meta: ControleSubjectMeta
}) {
  const [note, setNote] = useState('')
  const [busy, start] = useTransition()

  const save = () => {
    const n = Number(note)
    if (!Number.isFinite(n) || note === '' || busy) return
    sfx.tap()
    start(async () => {
      const res = await setControleNote(controle.id, n)
      toast(res.ok ? 'Note enregistrée ✓' : 'Réessaie dans un instant.')
    })
  }

  const skip = () => {
    if (busy) return
    sfx.tap()
    start(async () => {
      await dismissControleNote(controle.id)
    })
  }

  return (
    <div
      className={cn(
        'rev-card rounded-3xl bg-white p-4 ring-1 ring-black/5',
        busy && 'opacity-60',
      )}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"
        >
          <GraduationCap className="size-5" strokeWidth={2.4} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-foreground">
            Ton contrôle est passé — quelle note as-tu eue ?
          </p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {controleTitle(controle, meta.name)} · {meta.name}
          </p>

          <div className="mt-3 flex items-center gap-2">
            <label className="flex items-center gap-1.5 rounded-2xl border border-border bg-muted/40 px-3">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                max={20}
                step={0.5}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="14"
                aria-label="Note obtenue sur 20"
                className="min-h-11 w-14 bg-transparent text-center text-base font-extrabold text-foreground outline-none"
              />
              <span className="text-sm font-bold text-muted-foreground">/20</span>
            </label>
            <button
              type="button"
              onClick={save}
              disabled={busy || note === ''}
              className={cn(
                'font-heading flex min-h-11 flex-1 items-center justify-center rounded-full bg-primary px-4 text-sm font-extrabold text-primary-foreground transition active:translate-y-px',
                (busy || note === '') && 'opacity-60',
              )}
            >
              Enregistrer
            </button>
            <button
              type="button"
              onClick={skip}
              disabled={busy}
              aria-label="Plus tard"
              className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted active:scale-90"
            >
              <X className="size-5" strokeWidth={2.4} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function NoteInbox({
  controles,
  today,
  subjectMeta,
}: {
  controles: Controle[]
  today: string
  subjectMeta: Record<string, ControleSubjectMeta>
}) {
  const metaOf = (c: Controle): ControleSubjectMeta =>
    subjectMeta[c.subject] ?? { name: c.subject, color: 'blue' }

  // Demandes de note dues (lendemain, pas encore relancé/saisi).
  const due = controles.filter((c) => isNoteDue(c, today))

  // Récaps récents : contrôle noté, dans la fenêtre après la date.
  const recaps = controles.filter(
    (c) =>
      c.note !== null &&
      c.date !== null &&
      daysBetween(c.date, today) >= 0 &&
      daysBetween(c.date, today) <= RECAP_WINDOW_DAYS,
  )

  if (due.length === 0 && recaps.length === 0) return null

  return (
    <div className="flex flex-col gap-2">
      {due.map((c) => (
        <NotePrompt key={c.id} controle={c} meta={metaOf(c)} />
      ))}
      {recaps.map((c) => (
        <div
          key={c.id}
          className="flex items-center gap-2 rounded-2xl bg-primary/8 px-3 py-2 text-sm font-semibold text-foreground"
        >
          <GraduationCap className="size-4 shrink-0 text-primary" aria-hidden="true" />
          <span className="min-w-0 flex-1">{noteRecap(c)}</span>
        </div>
      ))}
    </div>
  )
}
