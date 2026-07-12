'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Check, Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'
import { subjectTheme, subjectVignette } from '@/lib/subject-style'
import SubjectIcon from '@/components/SubjectIcon'
import StreakMascot from '@/components/StreakMascot'
import { sfx } from '@/lib/sounds'
import { saveSelectedSubjects } from '@/app/reviser/actions'
import type { Subject, SubjectCategory } from '@/lib/types'

const COLLEGE_LEVELS = ['6e', '5e', '4e', '3e']

const LYCEE_GROUPS: { category: SubjectCategory; label: string }[] = [
  { category: 'tronc_commun', label: 'Tronc commun' },
  { category: 'specialite', label: 'Spécialités' },
  { category: 'option', label: 'Options' },
]

// Pastille de série du header : la mascotte flamme (à son stade d'évolution)
// + nombre de jours. À zéro, la Braise endormie — la rallumer devient
// l'objectif du jour.
function StreakPill({ streak }: { streak: number }) {
  return (
    <span
      className="flex shrink-0 items-center gap-1.5 rounded-full bg-white py-1 pr-3 pl-1.5 shadow-sm"
      aria-label={`Série : ${streak} jour${streak > 1 ? 's' : ''}`}
    >
      <StreakMascot streak={streak} size={26} badge={false} />
      <span className="font-mono text-sm font-extrabold text-foreground tabular-nums">
        {streak}
      </span>
    </span>
  )
}

// « Classe de 5ᵉ » : l'exposant typographique de la maquette, dérivé de la
// valeur brute de `grade_level` ('5e', '2de', '1re', 'Tle'…).
function GradeChip({ grade }: { grade: string }) {
  const m = /^(\d)(e|de|re)$/.exec(grade)
  return (
    <span className="rev-chip shrink-0 rounded-full bg-white px-3.5 py-1.5 text-sm font-bold shadow-sm">
      {m ? (
        <>
          Classe de {m[1]}
          <sup>{m[2]}</sup>
        </>
      ) : grade === 'Tle' ? (
        'Terminale'
      ) : (
        grade
      )}
    </span>
  )
}

// Carte matière façon carnet : nom + barre de progression jaune, et à droite
// la vignette illustrée qui déborde de la carte (batch 8 du doc de prompts).
// Tant que l'illustration d'une matière n'est pas générée, un médaillon
// dégradé (couleur de la matière + icône) prend sa place.
function SubjectRow({
  subject,
  pct,
  editing,
  checked,
  onToggle,
  delayMs,
}: {
  subject: Subject
  pct: number
  editing: boolean
  checked: boolean
  onToggle: () => void
  delayMs: number
}) {
  const theme = subjectTheme(subject.color)
  const vignette = subjectVignette(subject.slug)

  const inner = (
    <div
      style={{ animationDelay: `${delayMs}ms` }}
      className={cn(
        'pop-in rev-card relative flex min-h-[104px] items-center gap-3 rounded-[1.75rem] bg-white py-5 pr-28 pl-5 transition',
        !vignette && 'overflow-hidden',
        !editing &&
          'group-hover:-translate-y-0.5 group-hover:shadow-lg group-active:translate-y-px',
        editing && 'cursor-pointer',
        editing && !checked && 'opacity-45 grayscale',
      )}
    >
      {editing ? (
        <span
          className={cn(
            'flex size-5 shrink-0 items-center justify-center rounded-full border text-[11px] transition-colors',
            checked
              ? 'border-highlight bg-highlight text-foreground'
              : 'border-muted-foreground/40 bg-muted',
          )}
        >
          {checked ? <Check className="size-3" /> : null}
        </span>
      ) : null}

      <div className="min-w-0 flex-1">
        <p className="font-heading truncate text-xl font-bold">
          {subject.name}
        </p>
        <div
          className="rev-track mt-2.5 h-3 w-full max-w-56 overflow-hidden rounded-full"
          role="progressbar"
          aria-label={`Avancement en ${subject.name}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
        >
          <div
            className="rev-fill h-full rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {vignette ? (
        /* L'illustration à fond transparent déborde du coin droit, comme sur
           la maquette — la carte ne la rogne pas. */
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={vignette}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -top-3 right-0 h-[calc(100%+1.5rem)] w-auto max-w-32 object-contain object-right transition-transform group-hover:scale-105"
        />
      ) : (
        <span
          aria-hidden="true"
          className={cn(
            'arena-tile absolute -right-4 top-1/2 flex size-24 -translate-y-1/2 rotate-12 items-center justify-center overflow-hidden rounded-[1.9rem] shadow-md transition-transform group-hover:rotate-6',
            theme.arena,
          )}
        >
          <SubjectIcon
            slug={subject.slug}
            className="size-10 -rotate-12 text-white drop-shadow-[0_1.5px_1px_rgba(0,0,0,0.35)]"
            strokeWidth={2.25}
          />
        </span>
      )}
    </div>
  )

  if (editing) {
    return (
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        aria-label={subject.name}
        onClick={onToggle}
        className="group block w-full text-left"
      >
        {inner}
      </button>
    )
  }
  return (
    <Link
      href={`/reviser/${subject.slug}`}
      onClick={() => sfx.tap()}
      className="group block"
    >
      {inner}
    </Link>
  )
}

// Accueil Réviser façon carnet violet : fond crème pleine page, bandeau de
// salutation (prénom, classe, série) qui file jusqu'aux bords sur mobile, et
// la liste des matières qui vient le chevaucher.
export default function SubjectsHome({
  firstName,
  streak,
  subjects,
  selected,
  grade,
  progressBySlug,
}: {
  firstName: string | null
  streak: number
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

  // Décalage d'apparition continu d'une carte à l'autre, tous groupes confondus.
  let cardIndex = 0

  return (
    <section aria-label="Mes matières">
      {/* Fond crème pleine page, derrière tout le contenu de l'onglet. */}
      <div aria-hidden="true" className="rev-bg fixed inset-0 -z-10" />

      {/* Bandeau violet : bord à bord sur mobile (il file sous la barre du
          haut), carte arrondie sur desktop. */}
      <div className="rev-hero relative -mx-4 -mt-16 overflow-hidden px-5 pt-20 pb-16 text-white md:mx-0 md:mt-0 md:rounded-3xl md:px-7 md:pt-7">
        {/* Capsules décoratives, violet plus clair — comme la maquette. */}
        <span
          aria-hidden="true"
          className="rev-blob absolute -top-8 -left-10 h-36 w-36 rounded-full"
        />
        <span
          aria-hidden="true"
          className="rev-blob absolute top-6 right-16 h-10 w-40 rotate-[-35deg] rounded-full"
        />
        <span
          aria-hidden="true"
          className="rev-blob absolute -bottom-10 left-1/3 h-12 w-48 rotate-[-35deg] rounded-full"
        />

        <div className="relative flex justify-end">
          <StreakPill streak={streak} />
        </div>

        <div className="relative mt-4 flex items-center justify-between gap-3">
          <h1 className="font-heading text-3xl font-bold text-balance">
            {firstName ? `Bonjour ${firstName}` : 'Bonjour !'}
          </h1>
          <GradeChip grade={grade} />
        </div>

        <div className="relative mt-3 flex items-center justify-between gap-3">
          {editing ? (
            <p className="text-sm text-white/85">
              Touche une matière pour l&apos;ajouter ou la retirer.
            </p>
          ) : (
            <span />
          )}
          {editing ? (
            <button
              type="button"
              onClick={finishEditing}
              disabled={pending}
              className="rev-chip flex shrink-0 items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold shadow-sm transition active:translate-y-px disabled:opacity-60"
            >
              <Check className="size-3.5" />
              {pending ? 'Enregistrement…' : 'Terminé'}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold text-white transition hover:bg-white/20 active:translate-y-px"
            >
              <Pencil className="size-3" /> Modifier
            </button>
          )}
        </div>
      </div>

      {/* Les cartes matières chevauchent le bandeau, comme sur la maquette. */}
      <div className="relative -mt-10 flex flex-col gap-5 sm:px-1">
        {groups.length === 0 ? (
          <div className="rev-card rounded-[1.75rem] bg-white p-5 text-sm text-muted-foreground">
            Aucune matière sélectionnée — touche «&nbsp;Modifier&nbsp;» pour en
            ajouter.
          </div>
        ) : (
          groups.map(({ label, items }, gi) => (
            <section key={label ?? 'all'} className="flex flex-col gap-5">
              {label ? (
                <h2
                  className={cn(
                    'font-heading -mb-1 px-2 text-sm font-semibold',
                    gi === 0 ? 'text-white/90' : 'text-muted-foreground',
                  )}
                >
                  {label}
                </h2>
              ) : null}
              {items.map((s) => (
                <SubjectRow
                  key={s.id}
                  subject={s}
                  pct={progressBySlug[s.slug] ?? 0}
                  editing={editing}
                  checked={picked.has(s.slug)}
                  onToggle={() => toggle(s.slug)}
                  delayMs={cardIndex++ * 45}
                />
              ))}
            </section>
          ))
        )}
      </div>
    </section>
  )
}
