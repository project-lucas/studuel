'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  FileText,
  Plus,
  X,
  TriangleAlert,
  Dumbbell,
  CalendarClock,
} from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  addSubject,
  addItem,
  setSubjectPriority,
  setItemStatus,
  setExamDate,
  deleteSubject,
  deleteItem,
} from '@/app/planning/actions'
import { daysUntil } from '@/lib/coach'
import type {
  RevisionSubject,
  RevisionItem,
  RevisionPriority,
  RevisionStatus,
} from '@/lib/types'

// --- Configuration visuelle -------------------------------------------------

const STATUS_ORDER: RevisionStatus[] = ['a_faire', 'en_cours', 'a_revoir', 'maitrise']

const STATUS_CONFIG: Record<RevisionStatus, { label: string; cls: string }> = {
  a_faire: { label: 'À faire', cls: 'bg-muted text-muted-foreground' },
  en_cours: { label: 'En cours', cls: 'bg-primary/10 text-primary' },
  a_revoir: {
    label: 'À revoir',
    cls: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  },
  maitrise: {
    label: 'Maîtrisé',
    cls: 'bg-green-600/10 text-green-700 dark:text-green-400',
  },
}

const PRIORITY_ORDER: RevisionPriority[] = ['normale', 'prioritaire', 'critique']

const PRIORITY_CONFIG: Record<
  RevisionPriority,
  { label: string; badge: string; border: string; weight: number }
> = {
  critique: {
    label: 'Critique',
    badge: 'bg-destructive/10 text-destructive',
    border: 'border-l-destructive',
    weight: 0,
  },
  prioritaire: {
    label: 'Prioritaire',
    badge: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
    border: 'border-l-amber-500',
    weight: 1,
  },
  normale: {
    label: 'Normale',
    badge: 'bg-muted text-muted-foreground',
    border: 'border-l-transparent',
    weight: 2,
  },
}

const EXAM_LABELS: Record<string, string> = {
  brevet: 'Brevet (3e)',
  bac_fr_ecrit: 'Bac français · écrit (1re)',
  bac_fr_oral: 'Bac français · oral (1re)',
  bac_spe: 'Bac · spécialité (Tle)',
  bac_philo: 'Bac · philosophie (Tle)',
  grand_oral: 'Grand oral (Tle)',
  autre: 'Autre échéance',
}

const selectCls =
  'h-8 rounded-lg border border-input bg-transparent px-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'

// --- Sous-composants ---------------------------------------------------------

// Suppression en deux temps, sans confirm() natif : un premier appui « arme »
// le bouton (« Confirmer ? »), un second supprime. Se désarme après 3 s.
// Toujours visible au doigt (pas seulement au survol).
function DeleteButton({
  onConfirm,
  label,
  subtle,
}: {
  onConfirm: () => void
  label: string
  subtle?: boolean
}) {
  const [pending, startTransition] = useTransition()
  const [armed, setArmed] = useState(false)

  useEffect(() => {
    if (!armed) return
    const t = setTimeout(() => setArmed(false), 3000)
    return () => clearTimeout(t)
  }, [armed])

  if (armed) {
    return (
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => onConfirm())}
        className="shrink-0 rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-semibold text-destructive transition-all active:scale-95 disabled:opacity-50"
      >
        {pending ? '…' : 'Confirmer ?'}
      </button>
    )
  }

  return (
    <button
      type="button"
      aria-label={`Supprimer ${label}`}
      title={`Supprimer ${label}`}
      onClick={() => setArmed(true)}
      className={cn(
        'flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive focus-visible:opacity-100',
        subtle && 'opacity-70 sm:opacity-0 sm:group-hover:opacity-100',
      )}
    >
      <X className="size-4" />
    </button>
  )
}

function StatusChip({ item }: { item: RevisionItem }) {
  const [pending, startTransition] = useTransition()
  const next =
    STATUS_ORDER[(STATUS_ORDER.indexOf(item.status) + 1) % STATUS_ORDER.length]
  const { label, cls } = STATUS_CONFIG[item.status]

  return (
    <button
      type="button"
      disabled={pending}
      title={`Passer à « ${STATUS_CONFIG[next].label} »`}
      onClick={() => startTransition(() => setItemStatus(item.id, next))}
      className={cn(
        'w-20 shrink-0 rounded-full px-2 py-0.5 text-center text-xs font-medium transition-all active:scale-95 disabled:opacity-50',
        cls,
      )}
    >
      {label}
    </button>
  )
}

function PriorityBadge({ subject }: { subject: RevisionSubject }) {
  const [pending, startTransition] = useTransition()
  const next =
    PRIORITY_ORDER[
      (PRIORITY_ORDER.indexOf(subject.priority) + 1) % PRIORITY_ORDER.length
    ]
  const { label, badge } = PRIORITY_CONFIG[subject.priority]

  return (
    <button
      type="button"
      disabled={pending}
      title={`Passer à « ${PRIORITY_CONFIG[next].label} »`}
      onClick={() => startTransition(() => setSubjectPriority(subject.id, next))}
      className={cn(
        'rounded-full px-2.5 py-0.5 text-xs font-medium transition-all active:scale-95 disabled:opacity-50',
        badge,
      )}
    >
      {label}
    </button>
  )
}

// Compte à rebours : « J-42 » — rouge sous 15 jours, ambre sous 31.
function CountdownBadge({ subject }: { subject: RevisionSubject }) {
  const days = daysUntil(subject.exam_date)
  if (days === null) return null

  const label = days < 0 ? 'passé' : days === 0 ? "aujourd'hui !" : `J-${days}`
  return (
    <span
      className={cn(
        'flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-xs font-semibold tabular-nums',
        days <= 14
          ? 'bg-destructive/10 text-destructive'
          : days <= 30
            ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
            : 'bg-secondary text-secondary-foreground',
      )}
    >
      <CalendarClock className="size-3" />
      {label}
    </span>
  )
}

function ExamDateInput({ subject }: { subject: RevisionSubject }) {
  const [pending, startTransition] = useTransition()
  return (
    <input
      type="date"
      defaultValue={subject.exam_date ?? ''}
      disabled={pending}
      aria-label="Date de l'examen"
      title="Date de l'examen"
      onChange={(e) =>
        startTransition(() => setExamDate(subject.id, e.target.value || null))
      }
      className="h-6 rounded-md border border-transparent bg-transparent px-1 text-xs text-muted-foreground transition-colors hover:border-input focus-visible:border-ring focus-visible:outline-none disabled:opacity-50"
    />
  )
}

function SubjectCard({ subject }: { subject: RevisionSubject }) {
  const formRef = useRef<HTMLFormElement>(null)
  const items = [...subject.revision_items].sort((a, b) =>
    a.created_at.localeCompare(b.created_at),
  )
  const done = items.filter((i) => i.status === 'maitrise').length
  const progress = items.length ? Math.round((done / items.length) * 100) : 0

  return (
    <Card className={cn('border-l-4', PRIORITY_CONFIG[subject.priority].border)}>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-2">
          {subject.name}
          <PriorityBadge subject={subject} />
          {subject.exam ? (
            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
              {EXAM_LABELS[subject.exam] ?? subject.exam}
            </span>
          ) : null}
          <CountdownBadge subject={subject} />
        </CardTitle>
        <CardDescription className="flex items-center gap-3">
          <span className="font-mono text-xs tabular-nums">
            {done}/{items.length} maîtrisé{done > 1 ? 's' : ''}
          </span>
          <ExamDateInput subject={subject} />
          <span className="h-1.5 max-w-40 flex-1 overflow-hidden rounded-full bg-muted">
            <span
              className="block h-full rounded-full bg-highlight transition-all"
              style={{ width: `${progress}%` }}
            />
          </span>
          <Link
            href="/reviser"
            className="ml-auto flex shrink-0 items-center gap-1 text-xs font-medium text-primary transition-colors hover:underline"
          >
            <Dumbbell className="size-3.5" /> M&apos;entraîner
          </Link>
          <DeleteButton
            onConfirm={() => deleteSubject(subject.id)}
            label={`la matière « ${subject.name} » et tous ses éléments`}
          />
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-1.5">
        {items.map((item) => (
          <ItemRow key={item.id} item={item} />
        ))}

        {/* Ajout d'un chapitre / texte */}
        <form
          ref={formRef}
          action={async (fd) => {
            await addItem(fd)
            formRef.current?.reset()
          }}
          className="mt-1 flex items-center gap-2"
        >
          <input type="hidden" name="subject_id" value={subject.id} />
          <Input
            name="title"
            required
            placeholder="Ajouter un chapitre ou un texte…"
            className="h-8 flex-1 text-sm"
          />
          <select name="kind" className={selectCls} aria-label="Type">
            <option value="chapitre">Chapitre</option>
            <option value="texte">Texte</option>
          </select>
          <Button type="submit" size="icon-sm" variant="secondary" aria-label="Ajouter">
            <Plus />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function ItemRow({ item }: { item: RevisionItem }) {
  const Icon = item.kind === 'texte' ? BookOpen : FileText

  return (
    <div className="group flex items-center gap-2 rounded-lg px-1 py-1 transition-colors hover:bg-muted/60">
      <StatusChip item={item} />
      <Icon className="size-3.5 shrink-0 text-muted-foreground" />
      <span
        className={cn(
          'flex-1 truncate text-sm',
          item.status === 'maitrise' && 'text-muted-foreground line-through',
        )}
      >
        {item.title}
      </span>
      <DeleteButton
        onConfirm={() => deleteItem(item.id)}
        label={item.title}
        subtle
      />
    </div>
  )
}

// --- Tableau complet ----------------------------------------------------------

export default function RevisionBoard({ subjects }: { subjects: RevisionSubject[] }) {
  const addFormRef = useRef<HTMLFormElement>(null)

  const sorted = [...subjects].sort(
    (a, b) =>
      PRIORITY_CONFIG[a.priority].weight - PRIORITY_CONFIG[b.priority].weight ||
      a.created_at.localeCompare(b.created_at),
  )

  const allItems = subjects.flatMap((s) => s.revision_items)
  const mastered = allItems.filter((i) => i.status === 'maitrise').length
  const urgent = subjects
    .filter((s) => s.priority === 'critique')
    .flatMap((s) => s.revision_items)
    .filter((i) => i.status === 'a_revoir' || i.status === 'a_faire').length

  return (
    <div className="flex flex-col gap-4">
      {/* Vue d'ensemble */}
      {allItems.length > 0 ? (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span>
            <span className="font-mono font-semibold text-foreground tabular-nums">
              {mastered}/{allItems.length}
            </span>{' '}
            maîtrisés
          </span>
          {urgent > 0 ? (
            <span className="flex items-center gap-1.5 font-medium text-destructive">
              <TriangleAlert className="size-4" />
              {urgent} urgence{urgent > 1 ? 's' : ''} en matière critique
            </span>
          ) : null}
        </div>
      ) : null}

      {/* Matières, les plus critiques en premier */}
      {sorted.map((subject) => (
        <SubjectCard key={subject.id} subject={subject} />
      ))}

      {/* Ajout d'une matière */}
      <Card>
        <CardHeader>
          <CardTitle>Ajouter une matière</CardTitle>
          <CardDescription>
            Indique l&apos;examen visé et la priorité — les matières critiques
            remontent en haut du tableau.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            ref={addFormRef}
            action={async (fd) => {
              await addSubject(fd)
              addFormRef.current?.reset()
            }}
            className="flex flex-wrap items-center gap-2"
          >
            <Input
              name="name"
              required
              placeholder="Matière (ex : Français)"
              className="h-8 min-w-40 flex-1 text-sm"
            />
            <select name="exam" className={selectCls} aria-label="Examen visé">
              <option value="">Examen visé…</option>
              {Object.entries(EXAM_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <select
              name="priority"
              defaultValue="normale"
              className={selectCls}
              aria-label="Priorité"
            >
              <option value="normale">Normale</option>
              <option value="prioritaire">Prioritaire</option>
              <option value="critique">Critique</option>
            </select>
            <input
              type="date"
              name="exam_date"
              aria-label="Date de l'examen (optionnel)"
              title="Date de l'examen (optionnel)"
              className={selectCls}
            />
            <Button type="submit" size="sm">
              <Plus /> Ajouter
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
