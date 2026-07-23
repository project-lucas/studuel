'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import {
  Check,
  Pencil,
  CalendarClock,
  ChevronDown,
  Crown,
  Settings,
  Search,
  Zap,
  Trophy,
  Flame,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { subjectTheme, subjectVignette } from '@/lib/subject-style'
import {
  rankForValue,
  MASTERY_RANK_LABEL,
  type MasteryRank,
} from '@/lib/mastery'
import SubjectIcon from '@/components/SubjectIcon'
import WorldBackdrop from '@/components/WorldBackdrop'
import { sfx } from '@/lib/sounds'
import { toast } from '@/lib/toast'
import { saveSelectedSubjects, saveDailyGoalMinutes } from '@/app/reviser/actions'
import { DAILY_GOAL_OPTIONS } from '@/lib/daily-goal'
import type { ExamProximity, SubjectExamHint } from '@/lib/next-exam'
import type { Subject } from '@/lib/types'
import SubjectFolder from '@/components/reviser/SubjectFolder'
import { subjectFolders } from '@/lib/reviser-folders'

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


// Cote « couronnes » façon Duolingo : à la place du pourcentage (déprimant),
// chaque matière porte 3 emplacements de couronne remplis selon son rang de
// maîtrise (lib/mastery). Diamant et Légendaire gardent 3 couronnes mais
// passent en violet — le prestige au-delà de l'or.
const RANK_CROWNS: Record<MasteryRank, number> = {
  bronze: 1,
  argent: 2,
  or: 3,
  diamant: 3,
  legendaire: 3,
}

const RANK_COLOR: Record<MasteryRank, string> = {
  bronze: 'text-amber-700',
  argent: 'text-slate-400',
  or: 'text-yellow-500',
  diamant: 'text-primary',
  legendaire: 'text-primary',
}

// Rangée de 3 couronnes + libellé du rang (« À débloquer » tant que rien n'est
// commencé). Purement décorative : le texte porte l'information.
function CrownRating({
  rank,
  subjectName,
  showLabel = true,
}: {
  rank: MasteryRank | null
  subjectName: string
  // Sur une carte illustrée, on masque le libellé texte (l'illustration occupe
  // le coin bas-droit) : seules les couronnes restent, la légende de la page
  // explique les rangs. Le rang reste annoncé via l'aria-label.
  showLabel?: boolean
}) {
  const filled = rank ? RANK_CROWNS[rank] : 0
  const color = rank ? RANK_COLOR[rank] : ''
  const label = rank ? MASTERY_RANK_LABEL[rank] : 'À débloquer'

  return (
    <div
      className="mt-2.5 flex items-center gap-1.5"
      aria-label={`Rang en ${subjectName} : ${label}`}
    >
      <span aria-hidden="true" className="flex items-center gap-0.5">
        {[0, 1, 2].map((i) => (
          <Crown
            key={i}
            strokeWidth={2.2}
            className={cn(
              'size-4',
              i < filled
                ? cn(color, 'fill-current')
                : 'text-muted-foreground/30',
            )}
          />
        ))}
      </span>
      {showLabel ? (
        <span
          aria-hidden="true"
          className={cn(
            'text-xs font-bold',
            rank ? color : 'text-muted-foreground/70',
          )}
        >
          {label}
        </span>
      ) : null}
    </div>
  )
}

// Normalise pour une recherche tolérante aux accents/casse.
function normalizeSearch(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
}

// Recherche sur TOUT le programme : une loupe (posée près de « Tronc commun »)
// qui ouvre un panneau plein écran filtrant les matières du niveau. Tap sur un
// résultat → la page de la matière. Remplace l'ancienne barre visuelle inerte.
function ProgramSearch({ subjects }: { subjects: Subject[] }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const q = normalizeSearch(query)
  const results = q
    ? subjects.filter((s) => normalizeSearch(s.name).includes(q))
    : subjects

  return (
    <>
      <button
        type="button"
        onClick={() => {
          sfx.tap()
          setOpen(true)
        }}
        aria-label="Rechercher dans le programme"
        aria-haspopup="dialog"
        className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-sm ring-1 ring-black/5 transition active:translate-y-px"
      >
        <Search className="size-4.5" strokeWidth={2.4} aria-hidden="true" />
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Recherche dans le programme"
          className="fixed inset-0 z-[70] flex flex-col bg-background/95 backdrop-blur-sm"
        >
          {/* Barre de recherche en haut du panneau. */}
          <div className="flex items-center gap-2 border-b border-black/5 p-3">
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-muted/60 px-4 py-2.5">
              <Search
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                placeholder="Chercher une matière…"
                aria-label="Chercher dans le programme"
                className="min-w-0 flex-1 bg-transparent text-sm font-medium text-foreground outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                sfx.tap()
                setOpen(false)
              }}
              aria-label="Fermer la recherche"
              className="flex size-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted active:scale-90"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          {/* Résultats : les matières du programme, filtrées. */}
          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            {results.length === 0 ? (
              <p className="mt-8 text-center text-sm text-muted-foreground">
                Aucune matière ne correspond à « {query} ».
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {results.map((s) => {
                  const theme = subjectTheme(s.color)
                  return (
                    <li key={s.id}>
                      <Link
                        href={`/reviser/${s.slug}`}
                        onClick={() => {
                          sfx.tap()
                          setOpen(false)
                        }}
                        className="flex items-center gap-3 rounded-2xl bg-white p-2.5 shadow-sm ring-1 ring-black/5 transition active:scale-[0.99]"
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            'arena-tile flex size-10 shrink-0 items-center justify-center rounded-2xl',
                            theme.arena,
                          )}
                        >
                          <SubjectIcon
                            slug={s.slug}
                            className="size-5 text-white"
                            strokeWidth={2.25}
                          />
                        </span>
                        <span className="min-w-0 flex-1 truncate text-sm font-bold text-foreground">
                          {s.name}
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </>
  )
}

// Anneau de progression de l'objectif du jour (0..1) : jaune solaire sur piste
// claire — la progression/récompense porte toujours le highlight.
function GoalRing({ pct }: { pct: number }) {
  const r = 15
  const circ = 2 * Math.PI * r
  const dash = Math.max(0, Math.min(1, pct)) * circ
  return (
    <svg
      viewBox="0 0 36 36"
      className="size-9 shrink-0 -rotate-90"
      aria-hidden="true"
    >
      <circle
        cx="18"
        cy="18"
        r={r}
        fill="none"
        strokeWidth="4"
        className="stroke-foreground/10"
      />
      <circle
        cx="18"
        cy="18"
        r={r}
        fill="none"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        className="stroke-highlight"
      />
    </svg>
  )
}

// Une case de donnée du header (icône + grand nombre + libellé), compacte.
function StatTile({
  icon,
  value,
  label,
  ariaLabel,
}: {
  icon: React.ReactNode
  value: React.ReactNode
  label: string
  ariaLabel: string
}) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-0.5 px-1 py-2"
      aria-label={ariaLabel}
    >
      <span aria-hidden="true" className="flex h-5 items-center">
        {icon}
      </span>
      <p className="font-mono text-sm font-extrabold text-foreground tabular-nums">
        {value}
      </p>
      <p className="text-[10px] font-semibold text-muted-foreground">{label}</p>
    </div>
  )
}

// Les GRANDES données de Réviser, sur une rangée : trophées, XP (lié aux tests
// sur le programme), série, et l'objectif du jour — ce dernier est CLIQUABLE
// pour changer l'objectif quotidien en minutes (3/10/15/30, bornes SQL). La
// sélection est optimiste : le compteur se met à jour tout de suite.
function HeaderStats({
  trophies,
  xp,
  streak,
  todayMinutes,
  goalMinutes,
}: {
  trophies: number
  xp: number
  streak: number
  todayMinutes: number
  goalMinutes: number
}) {
  const [goal, setGoal] = useState(goalMinutes)
  const [editing, setEditing] = useState(false)
  const [pending, start] = useTransition()

  const pct = goal > 0 ? todayMinutes / goal : 0
  const done = goal > 0 && todayMinutes >= goal

  const choose = (min: number) => {
    sfx.tap()
    setGoal(min) // optimiste
    setEditing(false)
    start(async () => {
      const res = await saveDailyGoalMinutes(min)
      if (!res.ok) {
        setGoal(goalMinutes) // rollback
        toast('Objectif non enregistré — réessaie.', 'error')
      }
    })
  }

  return (
    <div className="rev-card relative mt-3 rounded-2xl bg-white p-1.5">
      <div className="grid grid-cols-4 divide-x divide-black/5">
        <StatTile
          icon={<Trophy className="size-4 text-highlight" aria-hidden="true" />}
          value={trophies}
          label="trophées"
          ariaLabel={`${trophies} trophées`}
        />
        <StatTile
          icon={
            <Zap
              className="size-4 fill-highlight text-highlight"
              aria-hidden="true"
            />
          }
          value={xp}
          label="XP"
          ariaLabel={`${xp} points d'expérience`}
        />
        <StatTile
          icon={<Flame className="size-4 text-orange-500" aria-hidden="true" />}
          value={streak}
          label="série"
          ariaLabel={`Série : ${streak} jour${streak > 1 ? 's' : ''}`}
        />

        {/* Objectif du jour — CLIQUABLE pour changer l'objectif quotidien. */}
        <button
          type="button"
          onClick={() => {
            sfx.tap()
            setEditing((v) => !v)
          }}
          aria-haspopup="menu"
          aria-expanded={editing}
          aria-label={`Objectif du jour : ${todayMinutes} sur ${goal} minutes — toucher pour changer`}
          className="relative flex flex-col items-center justify-center gap-0.5 px-1 py-2 transition-colors hover:bg-muted/40"
        >
          <span aria-hidden="true" className="relative flex h-5 items-center">
            <GoalRing pct={pct} />
            {done ? (
              <Check
                className="absolute inset-0 m-auto size-3.5 text-highlight"
                strokeWidth={3}
                aria-hidden="true"
              />
            ) : null}
          </span>
          <p className="font-mono text-sm font-extrabold text-foreground tabular-nums">
            {goal}
            <span className="text-[10px]">m</span>
          </p>
          <p className="flex items-center gap-0.5 text-[10px] font-semibold text-primary">
            objectif
            <Pencil className="size-2.5" aria-hidden="true" />
          </p>
        </button>
      </div>

      {/* Le sélecteur d'objectif quotidien, déplié sous la rangée. */}
      {editing ? (
        <div
          role="menu"
          aria-label="Choisir l'objectif quotidien"
          className="mt-1.5 flex items-center gap-1.5 border-t border-black/5 px-1 pt-2"
        >
          <span className="mr-auto pl-1 text-[11px] font-bold text-muted-foreground">
            Objectif / jour
          </span>
          {DAILY_GOAL_OPTIONS.map((min) => (
            <button
              key={min}
              type="button"
              role="menuitemradio"
              aria-checked={goal === min}
              disabled={pending}
              onClick={() => choose(min)}
              className={cn(
                'min-h-8 rounded-full px-3 font-mono text-xs font-extrabold tabular-nums transition',
                goal === min
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted/70 text-foreground hover:bg-muted',
              )}
            >
              {min}m
            </button>
          ))}
        </div>
      ) : null}
    </div>
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
  // Illustration dédiée de la matière (toile carrée normalisée) : elle habille
  // la carte hors édition. Quand elle est là, elle remplace le médaillon
  // d'icône — une seule image forte par carte, façon grande app.
  const vignette = subjectVignette(subject.slug)
  const showVignette = !!vignette && !editing

  const inner = (
    <div
      style={{ animationDelay: `${delayMs}ms` }}
      className={cn(
        // Bouton « chunky » façon jeu mobile : fond pastel de la matière + un
        // socle 3D coloré (border-bottom épais à la couleur de la matière) et un
        // appui tactile au tap. Chaque carte lit comme un vrai bouton scolaire.
        'pop-in rev-card relative flex min-h-[116px] flex-col justify-between rounded-3xl border border-black/[0.06] border-b-[6px] p-3.5 transition-all duration-150 will-change-transform',
        theme.tile,
        theme.edge,
        prox ? `ring-2 ${prox.ring}` : null,
        !editing &&
          'group-hover:-translate-y-0.5 group-active:translate-y-[3px] group-active:border-b-[3px]',
        editing && 'cursor-pointer',
        editing && !checked && 'opacity-45 grayscale',
      )}
    >
      {/* Pastille « contrôle » : compte à rebours coloré, coin haut-droit. */}
      {exam && prox && !editing ? (
        <span
          className={cn(
            'absolute -top-2 right-2 z-20 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold shadow-sm',
            prox.pill,
          )}
        >
          <CalendarClock className="size-3" aria-hidden="true" />
          {exam.label}
        </span>
      ) : null}

      {/* Illustration de la matière : ancrée en bas à droite, taille identique
          d'une carte à l'autre. Purement décorative — le nom porte le sens. */}
      {showVignette ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={vignette}
          alt=""
          aria-hidden="true"
          width={320}
          height={320}
          loading="lazy"
          className="pointer-events-none absolute right-0 bottom-0 z-0 size-[76px] select-none object-contain drop-shadow-[0_4px_10px_rgba(31,17,71,0.16)] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-105"
        />
      ) : null}

      <div className="relative z-10 flex items-center gap-2.5">
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
        ) : showVignette ? null : (
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
        <p
          className={cn(
            'font-heading min-w-0 flex-1 text-base leading-tight font-bold',
            // Petite réserve à droite : le nom reste au-dessus, l'illustration
            // vit dans le coin bas-droit sans le chevaucher.
            showVignette && 'pr-2',
          )}
        >
          {subject.name}
        </p>
      </div>

      <div className="relative z-10">
        <CrownRating
          rank={rankForValue(pct / 100)}
          subjectName={subject.name}
          showLabel={!showVignette}
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
  xp,
  trophies,
  todayMinutes,
  goalMinutes,
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
  // Stats du header : XP cumulée, minutes travaillées aujourd'hui, objectif.
  xp: number
  // Trophées (mode classé du Défi) : la 4e grande donnée du header.
  trophies: number
  todayMinutes: number
  goalMinutes: number
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

  // Les matières « culture » (hors-programme, hors-niveau) vivent dans leur
  // propre dossier et ne font pas partie de la sélection de matières (ni du
  // mode édition).
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
      try {
        await saveSelectedSubjects([...picked])
      } catch {
        toast('Sélection non enregistrée — réessaie.', 'error')
        return
      }
      toast('Matières enregistrées ✓')
      setEditing(false)
    })

  // En édition, on ne montre QUE le dossier Programme : la culture générale
  // n'est pas sélectionnable, un dossier qu'on ne peut pas modifier n'a rien à
  // faire dans un écran de modification.
  const folders = subjectFolders({
    programmeSubjects: visible,
    cultureSubjects: editing ? [] : cultureSubjects,
    grade,
  })

  // Décalage d'apparition continu d'une carte à l'autre, tous groupes confondus.
  let cardIndex = 0

  return (
    <section aria-label="Mes matières">
      {/* Fond crème pleine page, derrière tout le contenu de l'onglet. */}
      <WorldBackdrop className="rev-bg" />

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

        {/* Identité compacte : avatar-menu + salutation/classe, sur une seule
            ligne pour gagner de la hauteur (la série a rejoint la bande de
            stats juste dessous). */}
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
        </div>

        {/* Hors édition : les 4 grandes données (trophées · XP · série ·
            objectif éditable) qui chevauchent le bas du bandeau. La recherche a
            migré plus bas, en loupe près des matières. */}
        {!editing ? (
          <HeaderStats
            trophies={trophies}
            xp={xp}
            streak={streak}
            todayMinutes={todayMinutes}
            goalMinutes={goalMinutes}
          />
        ) : null}

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

        {/* La loupe reste au-dessus des dossiers : elle cherche dans TOUT le
            programme, y compris ce qui est replié — sinon fermer un dossier
            reviendrait à cacher son contenu de la recherche. */}
        <div className="flex items-center justify-between gap-2 px-1">
          <h2 className="font-heading text-sm font-bold text-foreground">
            Mes matières
          </h2>
          <ProgramSearch subjects={subjects} />
        </div>

        {/* On teste le dossier PROGRAMME, pas le nombre de dossiers : la culture
            générale reste visible même quand l'élève n'a plus aucune matière
            sélectionnée, et compter les dossiers ferait alors disparaître le
            seul message qui lui dit comment se réinscrire. */}
        {!folders.some((f) => f.id === 'programme') ? (
          <div className="rev-card rounded-[1.75rem] bg-white p-5 text-sm text-muted-foreground">
            Aucune matière sélectionnée — touche «&nbsp;Modifier&nbsp;» pour en
            ajouter.
          </div>
        ) : null}

        {folders.map((folder) => (
            // En édition, le dossier reste ouvert de force : le choix
            // ouvert/fermé étant mémorisé, un élève qui l'avait replié entrait
            // en édition devant un dossier fermé, donc sans une seule case.
            <SubjectFolder key={folder.id} folder={folder} forceOpen={editing}>
              {folder.groups.map(({ label, items }) => (
                <section key={label ?? 'tout'} className="flex flex-col gap-2.5">
                  {label ? (
                    <h3 className="font-heading px-1 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                      {label}
                    </h3>
                  ) : null}
                  <div className="grid grid-cols-2 gap-3">
                    {items.map((s) => {
                      // La culture générale n'entre pas dans la sélection : ses
                      // cartes restent inertes même en mode édition.
                      const isCulture = folder.id === 'hors-programme'
                      return (
                        <SubjectRow
                          key={s.id}
                          subject={s}
                          pct={progressBySlug[s.slug] ?? 0}
                          editing={editing && !isCulture}
                          checked={isCulture ? true : picked.has(s.slug)}
                          onToggle={() => {
                            if (!isCulture) toggle(s.slug)
                          }}
                          exam={examBySubject[s.slug]}
                          delayMs={cardIndex++ * 40}
                        />
                      )
                    })}
                  </div>
                </section>
              ))}
            </SubjectFolder>
        ))}

        {/* Légende des rangs de couronnes, comme sur la maquette. */}
        {!editing ? (
          <div
            aria-hidden="true"
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-1 pb-1"
          >
            {(['bronze', 'argent', 'or', 'diamant'] as const).map((rank) => (
              <span
                key={rank}
                className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground"
              >
                <Crown
                  strokeWidth={2.2}
                  className={cn('size-3.5 fill-current', RANK_COLOR[rank])}
                />
                {MASTERY_RANK_LABEL[rank]}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
