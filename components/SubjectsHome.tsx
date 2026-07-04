'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Check, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { subjectTheme } from '@/lib/subject-style'
import { saveSelectedSubjects } from '@/app/reviser/actions'
import type { Subject, SubjectCategory } from '@/lib/types'

const COLLEGE_LEVELS = ['6e', '5e', '4e', '3e']

const LYCEE_GROUPS: { category: SubjectCategory; label: string }[] = [
  { category: 'tronc_commun', label: 'Tronc commun' },
  { category: 'specialite', label: 'Spécialités' },
  { category: 'option', label: 'Options' },
]

// Anneau de progression autour de l'émoji de la matière.
function ProgressRing({
  pct,
  strokeClass,
  icon,
}: {
  pct: number
  strokeClass: string
  icon: string
}) {
  const R = 26
  const C = 2 * Math.PI * R
  return (
    <span className="relative inline-flex size-16 items-center justify-center">
      <svg viewBox="0 0 60 60" className="absolute inset-0 size-full -rotate-90">
        <circle
          cx="30"
          cy="30"
          r={R}
          fill="none"
          strokeWidth="4.5"
          className="stroke-black/10 dark:stroke-white/15"
        />
        {pct > 0 ? (
          <circle
            cx="30"
            cy="30"
            r={R}
            fill="none"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeDasharray={`${(C * pct) / 100} ${C}`}
            className={cn('transition-all', strokeClass)}
          />
        ) : null}
      </svg>
      <span className="text-3xl leading-none drop-shadow-sm">{icon}</span>
    </span>
  )
}

function SubjectTile({
  subject,
  pct,
  editing,
  checked,
  onToggle,
}: {
  subject: Subject
  pct: number
  editing: boolean
  checked: boolean
  onToggle: () => void
}) {
  const theme = subjectTheme(subject.color)

  const inner = (
    <div
      className={cn(
        'relative flex h-full flex-col items-center gap-1.5 rounded-2xl p-4 text-center shadow-sm transition-all',
        theme.tile,
        editing
          ? 'cursor-pointer active:scale-[0.97]'
          : 'hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]',
        editing && !checked && 'opacity-45 grayscale',
      )}
    >
      {editing ? (
        <span
          className={cn(
            'absolute top-2.5 right-2.5 flex size-5 items-center justify-center rounded-full border text-[11px] transition-colors',
            checked
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-muted-foreground/40 bg-card',
          )}
        >
          {checked ? <Check className="size-3" /> : null}
        </span>
      ) : null}
      <ProgressRing pct={pct} strokeClass={theme.stroke} icon={subject.icon} />
      <span className="text-sm font-bold">{subject.name}</span>
      <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
        {pct > 0 ? `${pct}%` : '—'}
      </span>
    </div>
  )

  if (editing) {
    return (
      <button type="button" onClick={onToggle} className="block h-full w-full text-left">
        {inner}
      </button>
    )
  }
  return (
    <Link href={`/reviser/${subject.slug}`} className="block h-full">
      {inner}
    </Link>
  )
}

// Bloc « Mes matières » : grille avec progression intégrée, sélection éditable.
export default function SubjectsHome({
  subjects,
  selected,
  grade,
  progressBySlug,
}: {
  subjects: Subject[]
  selected: string[] | null
  grade: string
  progressBySlug: Record<string, number>
}) {
  const [editing, setEditing] = useState(false)
  const [picked, setPicked] = useState<Set<string>>(
    () => new Set(selected ?? subjects.map((s) => s.slug)),
  )
  const [pending, startTransition] = useTransition()

  const isCollege = COLLEGE_LEVELS.includes(grade)
  const visible = editing ? subjects : subjects.filter((s) => picked.has(s.slug))

  const toggle = (slug: string) =>
    setPicked((prev) => {
      const next = new Set(prev)
      if (next.has(slug)) next.delete(slug)
      else next.add(slug)
      return next
    })

  const finishEditing = () =>
    startTransition(async () => {
      await saveSelectedSubjects([...picked])
      setEditing(false)
    })

  const groups: { label: string | null; items: Subject[] }[] = isCollege
    ? [{ label: null, items: visible }]
    : LYCEE_GROUPS.map((g) => ({
        label: g.label,
        items: visible.filter((s) => s.category === g.category),
      })).filter((g) => g.items.length > 0)

  return (
    <div className="pb-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-heading text-lg font-bold">Mes matières</h2>
        {editing ? (
          <Button size="sm" onClick={finishEditing} disabled={pending}>
            <Check className="size-4" /> {pending ? '…' : 'Terminé'}
          </Button>
        ) : (
          <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
            <Pencil className="size-3.5" /> Éditer
          </Button>
        )}
      </div>

      {editing ? (
        <p className="mb-4 text-sm text-muted-foreground">
          Touche une matière pour l&apos;ajouter ou la retirer de ta liste.
        </p>
      ) : null}

      {groups.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Aucune matière sélectionnée — clique sur « Éditer » pour en ajouter.
        </p>
      ) : (
        <div className="flex flex-col gap-8">
          {groups.map(({ label, items }) => (
            <section key={label ?? 'all'}>
              {label ? (
                <h3 className="font-heading mb-3 text-sm font-semibold text-muted-foreground">
                  {label}
                </h3>
              ) : null}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {items.map((s) => (
                  <SubjectTile
                    key={s.id}
                    subject={s}
                    pct={progressBySlug[s.slug] ?? 0}
                    editing={editing}
                    checked={picked.has(s.slug)}
                    onToggle={() => toggle(s.slug)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
