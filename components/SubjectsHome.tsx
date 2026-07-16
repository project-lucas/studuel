'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Check, Pencil, CalendarClock, ChevronDown, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { subjectTheme } from '@/lib/subject-style'
import SubjectIcon from '@/components/SubjectIcon'
import StreakMascot from '@/components/StreakMascot'
import { sfx } from '@/lib/sounds'
import { saveSelectedSubjects } from '@/app/reviser/actions'
import type { ExamProximity, SubjectExamHint } from '@/lib/next-exam'
import type { Subject, SubjectCategory } from '@/lib/types'

// Palette des 3 paliers d'annotation « contrôle qui arrive » sur un dossier :
// vert = de la marge, orange = bientôt, rouge = très proche.
const PROX_STYLE: Record<
  ExamProximity,
  { ring: string; pill: string }
> = {
  far: { ring: 'ring-green-500/70', pill: 'bg-green-600 text-white' },
  soon: { ring: 'ring-amber-500/80', pill: 'bg-amber-500 text-white' },
  imminent: { ring: 'ring-destructive', pill: 'bg-destructive text-white' },
}

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

// Avatar du header façon « bouton-menu » : l'avatar de l'élève, tapable, qui
// déplie autour de lui les actions du profil (modifier ses matières, ouvrir son
// compte). Replié par défaut pour libérer de la hauteur en haut de Réviser.
function HeaderAvatar({
  avatarUri,
  onEdit,
}: {
  avatarUri: string
  onEdit: () => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative flex shrink-0 items-center">
      <button
        type="button"
        onClick={() => {
          sfx.tap()
          setOpen((o) => !o)
        }}
        aria-label="Menu du profil"
        aria-expanded={open}
        className="relative size-14 shrink-0 overflow-hidden rounded-full bg-white shadow-md ring-2 ring-white/70 transition active:scale-95"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatarUri}
          alt="Mon avatar"
          className="size-full object-cover"
        />
        <span className="absolute right-0 bottom-0 flex size-5 items-center justify-center rounded-full bg-highlight text-foreground shadow ring-2 ring-white">
          <ChevronDown
            className={cn('size-3 transition-transform', open && 'rotate-180')}
            aria-hidden="true"
          />
        </span>
      </button>

      {/* Les actions se déplient à droite de l'avatar. */}
      <div
        className={cn(
          'flex items-center gap-2 overflow-hidden transition-all duration-200',
          open ? 'ml-2 max-w-[120px] opacity-100' : 'max-w-0 opacity-0',
        )}
      >
        <button
          type="button"
          onClick={() => {
            setOpen(false)
            onEdit()
          }}
          aria-label="Modifier mes matières"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/30 transition hover:bg-white/25 active:scale-90"
        >
          <Pencil className="size-4" aria-hidden="true" />
        </button>
        <Link
          href="/compte"
          onClick={() => sfx.tap()}
          aria-label="Mon compte"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/30 transition hover:bg-white/25 active:scale-90"
        >
          <Settings className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
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

// Carte matière compacte (grille 2 colonnes) : médaillon coloré + nom + barre
// de progression. Volontairement resserrée pour limiter le scroll. Si un
// contrôle est annoncé sur la matière, la carte prend un liseré coloré (3
// paliers) + une pastille compte à rebours — pour repérer d'un coup d'œil que
// « ça arrive ».
function SubjectRow({
  subject,
  pct,
  editing,
  checked,
  onToggle,
  exam,
  delayMs,
}: {
  subject: Subject
  pct: number
  editing: boolean
  checked: boolean
  onToggle: () => void
  exam?: SubjectExamHint
  delayMs: number
}) {
  const theme = subjectTheme(subject.color)
  const prox = exam ? PROX_STYLE[exam.proximity] : null

  const inner = (
    <div
      style={{ animationDelay: `${delayMs}ms` }}
      className={cn(
        'pop-in rev-card relative flex min-h-[92px] flex-col justify-between rounded-3xl bg-white p-3.5 transition',
        prox ? `ring-2 ${prox.ring}` : 'ring-1 ring-black/5',
        !editing &&
          'group-hover:-translate-y-0.5 group-hover:shadow-lg group-active:translate-y-px',
        editing && 'cursor-pointer',
        editing && !checked && 'opacity-45 grayscale',
      )}
    >
      {/* Pastille « contrôle » : compte à rebours coloré, coin haut-droit. */}
      {exam && prox && !editing ? (
        <span
          className={cn(
            'absolute -top-2 right-2 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold shadow-sm',
            prox.pill,
          )}
        >
          <CalendarClock className="size-3" aria-hidden="true" />
          {exam.label}
        </span>
      ) : null}

      <div className="flex items-center gap-2.5">
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
        ) : (
          <span
            aria-hidden="true"
            className={cn(
              'arena-tile flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl shadow-sm',
              theme.arena,
            )}
          >
            <SubjectIcon
              slug={subject.slug}
              className="size-6 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]"
              strokeWidth={2.25}
            />
          </span>
        )}
        <p className="font-heading min-w-0 flex-1 text-base leading-tight font-bold">
          {subject.name}
        </p>
      </div>

      <div
        className="rev-track mt-2.5 h-2 w-full overflow-hidden rounded-full"
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
      aria-label={
        exam
          ? `${subject.name} — contrôle ${exam.label}`
          : subject.name
      }
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
  avatarUri,
  streak,
  subjects,
  selected,
  grade,
  progressBySlug,
  examBySubject = {},
  topSlot,
  underHeader = true,
}: {
  firstName: string | null
  avatarUri: string
  streak: number
  subjects: Subject[]
  selected: string[] | null
  grade: string
  progressBySlug: Record<string, number>
  examBySubject?: Record<string, SubjectExamHint>
  // Blocs insérés entre le hero et la grille des matières (reprise, outils,
  // contrôles…) — rendus côté serveur et passés en enfant.
  topSlot?: React.ReactNode
  // Vrai (défaut) : le bandeau file sous la barre du haut, bord à bord.
  // Faux : un élément (ex. le sélecteur d'espaces) vit au-dessus — le bandeau
  // reste bord à bord mais ne remonte plus sous la barre.
  underHeader?: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [picked, setPicked] = useState<Set<string>>(
    () => new Set(selected ?? subjects.map((s) => s.slug)),
  )
  const [pending, startTransition] = useTransition()

  const isCollege = COLLEGE_LEVELS.includes(grade)
  // Les dossiers « Culture générale » (catégorie culture, hors-programme et
  // hors-niveau) sont TOUJOURS visibles, dans leur propre section en bas, et ne
  // font pas partie de la sélection de matières (ni du mode édition).
  const cultureSubjects = subjects.filter((s) => s.category === 'culture')
  const selectable = subjects.filter((s) => s.category !== 'culture')
  const visible = editing
    ? selectable
    : selectable.filter((s) => picked.has(s.slug))

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
      <div
        className={`rev-hero relative overflow-hidden px-5 pb-16 text-white md:mx-0 md:mt-0 md:rounded-3xl md:px-7 md:pt-7 ${
          underHeader ? '-mx-4 -mt-16 pt-20' : 'mx-0 mt-0 rounded-3xl pt-7'
        }`}
      >
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

        {/* Identité compacte : avatar-menu + salutation/classe + série, sur une
            seule ligne pour gagner de la hauteur. */}
        <div className="relative flex items-center gap-3">
          <HeaderAvatar avatarUri={avatarUri} onEdit={() => setEditing(true)} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white/80">
              {firstName ? `Bonjour ${firstName}` : 'Bonjour !'}
            </p>
            <div className="mt-1">
              <GradeChip grade={grade} />
            </div>
          </div>
          <StreakPill streak={streak} />
        </div>

        {/* En mode édition seulement : consigne + bouton Terminé. */}
        {editing ? (
          <div className="relative mt-3 flex items-center justify-between gap-3">
            <p className="text-sm text-white/85">
              Touche une matière pour l&apos;ajouter ou la retirer.
            </p>
            <button
              type="button"
              onClick={finishEditing}
              disabled={pending}
              className="rev-chip flex shrink-0 items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold shadow-sm transition active:translate-y-px disabled:opacity-60"
            >
              <Check className="size-3.5" />
              {pending ? 'Enregistrement…' : 'Terminé'}
            </button>
          </div>
        ) : null}
      </div>

      {/* Ce qui chevauche le bandeau : d'abord les blocs d'action (reprise,
          outils, contrôles), puis la grille des matières resserrée. */}
      <div className="relative -mt-8 flex flex-col gap-4 sm:px-1">
        {topSlot ? <div className="flex flex-col gap-4">{topSlot}</div> : null}
        {groups.length === 0 ? (
          <div className="rev-card rounded-[1.75rem] bg-white p-5 text-sm text-muted-foreground">
            Aucune matière sélectionnée — touche «&nbsp;Modifier&nbsp;» pour en
            ajouter.
          </div>
        ) : (
          groups.map(({ label, items }, gi) => (
            <section key={label ?? 'all'} className="flex flex-col gap-2.5">
              {label ? (
                <h2
                  className={cn(
                    'font-heading px-1 text-sm font-semibold',
                    gi === 0 ? 'text-white/90' : 'text-muted-foreground',
                  )}
                >
                  {label}
                </h2>
              ) : null}
              <div className="grid grid-cols-2 gap-3">
                {items.map((s) => (
                  <SubjectRow
                    key={s.id}
                    subject={s}
                    pct={progressBySlug[s.slug] ?? 0}
                    editing={editing}
                    checked={picked.has(s.slug)}
                    onToggle={() => toggle(s.slug)}
                    exam={examBySubject[s.slug]}
                    delayMs={cardIndex++ * 40}
                  />
                ))}
              </div>
            </section>
          ))
        )}

        {/* Dossiers hors-programme (Culture générale) : toujours là, en bonus,
            pas concernés par « Modifier mes matières ». */}
        {!editing && cultureSubjects.length > 0 ? (
          <section className="flex flex-col gap-2.5">
            <h2 className="font-heading px-1 text-sm font-semibold text-muted-foreground">
              Culture générale · hors-programme
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {cultureSubjects.map((s) => (
                <SubjectRow
                  key={s.id}
                  subject={s}
                  pct={progressBySlug[s.slug] ?? 0}
                  editing={false}
                  checked
                  onToggle={() => {}}
                  exam={examBySubject[s.slug]}
                  delayMs={cardIndex++ * 40}
                />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </section>
  )
}
