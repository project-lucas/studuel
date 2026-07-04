'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Check, Pencil, Sparkles } from 'lucide-react'
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

function SubjectTile({
  subject,
  editing,
  checked,
  onToggle,
}: {
  subject: Subject
  editing: boolean
  checked: boolean
  onToggle: () => void
}) {
  const theme = subjectTheme(subject.color)

  const inner = (
    <div
      className={cn(
        'relative flex h-full flex-col items-center gap-2 rounded-2xl p-5 text-center shadow-sm transition-all',
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
      <span className="text-4xl leading-none drop-shadow-sm">{subject.icon}</span>
      <span className="text-sm font-bold">{subject.name}</span>
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

// Niveau 1 : « Mes matières » — grille par groupe, sélection éditable,
// barre d'input IA flottante (placeholder).
export default function SubjectsHome({
  subjects,
  selected,
  grade,
}: {
  subjects: Subject[]
  selected: string[] | null
  grade: string
}) {
  const [editing, setEditing] = useState(false)
  const [picked, setPicked] = useState<Set<string>>(
    () => new Set(selected ?? subjects.map((s) => s.slug)),
  )
  const [pending, startTransition] = useTransition()

  const isCollege = COLLEGE_LEVELS.includes(grade)
  const visible = editing
    ? subjects
    : subjects.filter((s) => picked.has(s.slug))

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
    <div className="pb-28">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold md:text-4xl">
          Mes matières
        </h1>
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
                <h2 className="font-heading mb-3 text-lg font-semibold text-muted-foreground">
                  {label}
                </h2>
              ) : null}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {items.map((s) => (
                  <SubjectTile
                    key={s.id}
                    subject={s}
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

      {/* Barre IA flottante — placeholder, sans logique pour l'instant */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="fixed inset-x-4 bottom-[84px] z-40 mx-auto flex max-w-xl items-center gap-2 rounded-full border bg-card/95 py-1.5 pr-1.5 pl-4 shadow-lg backdrop-blur-md md:inset-x-auto md:bottom-6 md:left-1/2 md:w-full md:translate-x-[calc(-50%+8rem)]"
      >
        <Sparkles className="size-4 shrink-0 text-primary" />
        <input
          type="text"
          placeholder="Explique-moi…"
          aria-label="Poser une question à l'IA (bientôt disponible)"
          className="h-8 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <Button type="submit" size="sm" className="rounded-full">
          Demander
        </Button>
      </form>
    </div>
  )
}
