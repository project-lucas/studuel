'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import {
  CalendarDays,
  Flame,
  Pencil,
  Play,
  Plus,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { toast } from '@/lib/toast'
import { saveDailyGoalMinutes } from '@/app/reviser/actions'
import { DAILY_GOAL_OPTIONS } from '@/lib/daily-goal'
import { subjectTheme } from '@/lib/subject-style'
import { missionHref, type Mission } from '@/lib/mission'
import { addDays, type Controle, type ControleSubjectMeta } from '@/lib/prep-plan'
import AddExamSheet, {
  type SubjectLite,
  type ChapterLite,
} from '@/components/AddExamSheet'
import YearHistory from '@/components/YearHistory'

// Jours de la semaine, lundi → dimanche (index 0 = lundi, cf. lib/streak). Trois
// lettres à l'écran : fini le « L M M J V S D » où l'on devine quel M est mardi.
const DAY_SHORT = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const DAY_FULL = [
  'lundi',
  'mardi',
  'mercredi',
  'jeudi',
  'vendredi',
  'samedi',
  'dimanche',
]

type WeekDay = { done: boolean; isToday: boolean; isFuture: boolean }

// Les 7 clés UTC de la semaine courante (lundi → dimanche) — même définition
// que weekProgress (lundi = 0).
function weekDatesOf(today: string): string[] {
  const t = Date.parse(`${today}T00:00:00Z`)
  const dow = Number.isNaN(t) ? 0 : new Date(t).getUTCDay()
  const mondayOffset = (dow + 6) % 7
  const monday = addDays(today, -mondayOffset)
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i))
}

// Anneau d'objectif du jour : progression minutes travaillées / objectif, au
// trait jaune solaire (la couleur de la progression) sur piste translucide.
function GoalRing({
  todayMinutes,
  goalMinutes,
}: {
  todayMinutes: number
  goalMinutes: number
}) {
  const R = 26
  const C = 2 * Math.PI * R
  const ratio = goalMinutes > 0 ? Math.min(todayMinutes / goalMinutes, 1) : 0
  return (
    <span className="relative grid size-16 shrink-0 place-items-center">
      <svg viewBox="0 0 64 64" className="size-16 -rotate-90" aria-hidden="true">
        <circle
          cx="32"
          cy="32"
          r={R}
          fill="none"
          strokeWidth="6"
          className="stroke-white/20"
        />
        <circle
          cx="32"
          cy="32"
          r={R}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          className="stroke-highlight transition-[stroke-dashoffset] duration-500"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - ratio)}
        />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className="font-heading text-sm font-extrabold tabular-nums">
          {todayMinutes}
          <span className="text-[10px] font-bold text-white/70">
            /{goalMinutes}
          </span>
        </span>
        <span className="text-[8px] font-extrabold tracking-wide text-white/70 uppercase">
          min
        </span>
      </span>
    </span>
  )
}

/**
 * Le héros « Mission du jour » : LA carte d'action de l'accueil Réviser. L'app
 * choisit la meilleure session (lib/mission) et la met en scène avec UN seul
 * bouton — les statuts (série, objectif, semaine) l'entourent sans jamais lui
 * faire concurrence. Absorbe les outils de l'ancienne carte « Ta semaine » :
 * objectif éditable, nouveau contrôle, historique annuel.
 */
export default function MissionHero({
  mission,
  streak,
  todayMinutes,
  goalMinutes,
  week,
  today,
  controles,
  subjectMeta,
  subjects,
  chaptersBySubject = {},
  existingExamChapters = [],
  activeDays = [],
}: {
  mission: Mission | null
  streak: number
  todayMinutes: number
  goalMinutes: number
  week: WeekDay[]
  today: string
  controles: Controle[]
  subjectMeta: Record<string, ControleSubjectMeta>
  subjects: SubjectLite[]
  chaptersBySubject?: Record<string, ChapterLite[]>
  existingExamChapters?: string[]
  activeDays?: string[]
}) {
  const [historyOpen, setHistoryOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)

  // Objectif quotidien éditable : sélection optimiste, rollback + toast si
  // l'enregistrement échoue (logique reprise de l'ancienne carte « Ta semaine »).
  const [goal, setGoal] = useState(goalMinutes)
  const [editingGoal, setEditingGoal] = useState(false)
  const [pendingGoal, startGoal] = useTransition()

  const chooseGoal = (min: number) => {
    sfx.tap()
    setGoal(min)
    setEditingGoal(false)
    startGoal(async () => {
      const res = await saveDailyGoalMinutes(min)
      if (!res.ok) {
        setGoal(goalMinutes)
        toast('Objectif non enregistré — réessaie.', 'error')
      }
    })
  }

  const weekDates = weekDatesOf(today)

  // Jour portant une session du plan de préparation → pastille de la couleur de
  // la matière (le premier contrôle vu ce jour-là donne la teinte).
  const colorByDate = new Map<string, string>()
  for (const c of controles) {
    const color = subjectMeta[c.subject]?.color ?? 'blue'
    for (const s of c.sessions) {
      if (!colorByDate.has(s.plannedDate)) colorByDate.set(s.plannedDate, color)
    }
  }

  const goalReached = goal > 0 && todayMinutes >= goal

  // La phrase sous le titre : l'enjeu de la session, en une ligne.
  const subline = goalReached
    ? 'Objectif du jour atteint — continue sur ta lancée !'
    : mission
      ? streak > 0
        ? `${mission.minutes} min pour prolonger ta série`
        : `${mission.minutes} min pour rallumer ta flamme`
      : 'Explore ton programme ou annonce un contrôle.'

  const ctaLabel = mission
    ? mission.kind === 'controle'
      ? `Préparer le contrôle · ${mission.minutes} min`
      : mission.isNew
        ? `Découvrir · ${mission.minutes} min`
        : `C'est parti · ${mission.minutes} min`
    : null

  return (
    <section
      aria-label="Ta mission du jour"
      className="rev-card relative overflow-hidden rounded-[1.75rem] bg-primary p-4 text-primary-foreground shadow-[0_14px_30px_-16px_color-mix(in_oklch,var(--primary),black_20%)]"
    >
      {/* Halo décoratif : un souffle de lumière en haut de l'arène violette. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-10 size-48 rounded-full bg-white/10 blur-2xl"
      />

      {/* Bande de statut : la série à gauche, l'anneau d'objectif à droite. */}
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span
            className={cn(
              'flex w-fit items-center gap-1.5 rounded-full bg-white/12 px-2.5 py-1 text-xs font-extrabold',
              streak > 0 ? 'text-white' : 'text-white/70',
            )}
          >
            <Flame
              aria-hidden="true"
              className={cn(
                'size-4',
                streak > 0
                  ? 'fill-orange-400 text-orange-500'
                  : 'text-white/50',
              )}
            />
            Série {streak}
          </span>

          {/* La mission : quoi, pourquoi, en combien de temps. */}
          <p className="font-heading mt-3 flex flex-wrap items-center gap-1.5 text-[11px] font-extrabold tracking-wide text-highlight uppercase">
            {mission ? (
              <>
                Mission du jour · {mission.subjectName}
                {mission.countdown ? (
                  <span className="rounded-full bg-highlight px-1.5 py-0.5 text-[10px] text-foreground tabular-nums normal-case">
                    ⏰ Contrôle {mission.countdown}
                  </span>
                ) : null}
              </>
            ) : (
              <>
                <Sparkles className="size-3.5" aria-hidden="true" />
                Tout est à jour !
              </>
            )}
          </p>
          <h2 className="font-heading mt-1 line-clamp-2 text-xl leading-tight font-extrabold text-white">
            {mission ? mission.chapterTitle : 'Beau travail'}
          </h2>
          <p className="mt-1 text-[13px] font-semibold text-white/75">
            {subline}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            sfx.tap()
            setEditingGoal((v) => !v)
          }}
          aria-haspopup="menu"
          aria-expanded={editingGoal}
          aria-label={`Objectif du jour : ${todayMinutes} sur ${goal} minutes — toucher pour changer`}
          className="group relative shrink-0 transition active:scale-95"
        >
          <GoalRing todayMinutes={todayMinutes} goalMinutes={goal} />
          <span
            aria-hidden="true"
            className="absolute -right-0.5 -bottom-0.5 grid size-5 place-items-center rounded-full bg-white/20 text-white backdrop-blur-sm transition group-hover:bg-white/30"
          >
            <Pencil className="size-2.5" />
          </span>
        </button>
      </div>

      {/* Sélecteur d'objectif quotidien, déplié sous la bande. */}
      {editingGoal ? (
        <div
          role="menu"
          aria-label="Choisir l'objectif quotidien"
          className="relative mt-3 flex items-center gap-1.5 rounded-2xl bg-white/10 px-3 py-2"
        >
          <span className="mr-auto text-[11px] font-bold text-white/70">
            Objectif / jour
          </span>
          {DAILY_GOAL_OPTIONS.map((min) => (
            <button
              key={min}
              type="button"
              role="menuitemradio"
              aria-checked={goal === min}
              disabled={pendingGoal}
              onClick={() => chooseGoal(min)}
              className={cn(
                'min-h-8 rounded-full px-3 font-mono text-xs font-extrabold tabular-nums transition',
                goal === min
                  ? 'bg-highlight text-foreground shadow-sm'
                  : 'bg-white/12 text-white hover:bg-white/20',
              )}
            >
              {min}m
            </button>
          ))}
        </div>
      ) : null}

      {/* LE bouton — la seule action mise en avant de tout l'écran. Jaune
          solaire : accomplir la mission, c'est faire avancer la progression du
          jour. Socle 3D + appui tactile façon bouton de jeu. */}
      {mission && ctaLabel ? (
        <Link
          href={missionHref(mission)}
          onClick={() => sfx.tap()}
          className="font-heading relative mt-4 flex min-h-13 items-center justify-center gap-2 rounded-2xl bg-highlight px-4 text-base font-extrabold text-foreground shadow-[0_4px_0_color-mix(in_oklch,var(--highlight),black_25%)] transition active:translate-y-[3px] active:shadow-[0_1px_0_color-mix(in_oklch,var(--highlight),black_25%)]"
        >
          <Play className="size-5 fill-current" aria-hidden="true" />
          {ctaLabel}
        </Link>
      ) : null}

      {/* La semaine : 7 jours DATÉS (numéro du jour + Lun/Mar/Mer), validés en
          blanc plein, aujourd'hui cerclé de jaune. Pastille colorée dessous =
          session de préparation planifiée (couleur de la matière). */}
      <ul className="relative mt-4 flex items-start justify-between gap-1">
        {week.map((d, i) => {
          const dayNum = Number(weekDates[i]?.slice(8, 10)) || 0
          const sessionColor = colorByDate.get(weekDates[i])
          return (
            <li key={i} className="flex flex-1 flex-col items-center gap-1">
              <span
                aria-label={`${DAY_FULL[i]} ${dayNum}${
                  d.done ? ' — fait' : d.isToday ? " — aujourd'hui" : ''
                }`}
                className={cn(
                  'flex size-7 items-center justify-center rounded-full text-xs font-extrabold tabular-nums transition',
                  d.done
                    ? 'bg-white text-primary'
                    : d.isFuture
                      ? 'bg-white/10 text-white/50'
                      : 'bg-white/15 text-white/80',
                  d.isToday && 'ring-2 ring-highlight',
                )}
              >
                {dayNum}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  'text-[8.5px] font-extrabold tracking-wide uppercase',
                  d.isToday ? 'text-highlight' : 'text-white/60',
                )}
              >
                {DAY_SHORT[i]}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  'size-1.5 rounded-full',
                  sessionColor
                    ? subjectTheme(sessionColor).bar
                    : 'bg-transparent',
                )}
              />
            </li>
          )
        })}
      </ul>

      {/* Outils discrets : annoncer un contrôle + historique annuel. */}
      <div className="relative mt-2 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => {
            sfx.tap()
            setAddOpen(true)
          }}
          aria-haspopup="dialog"
          className="font-heading flex min-h-9 items-center gap-1.5 rounded-full bg-white/12 py-1.5 pr-3 pl-2 text-xs font-bold text-white transition hover:bg-white/20 active:translate-y-px"
        >
          <Plus className="size-3.5" strokeWidth={2.8} aria-hidden="true" />
          Nouveau contrôle
        </button>
        <button
          type="button"
          onClick={() => {
            sfx.tap()
            setHistoryOpen(true)
          }}
          aria-label="Voir mon historique de travail complet"
          aria-haspopup="dialog"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/12 text-white transition hover:bg-white/20 active:translate-y-px"
        >
          <CalendarDays className="size-4.5" strokeWidth={2.4} aria-hidden="true" />
        </button>
      </div>

      {addOpen ? (
        <AddExamSheet
          subjects={subjects}
          chaptersBySubject={chaptersBySubject}
          existing={new Set(existingExamChapters)}
          today={today}
          goalMinutes={goal}
          onClose={() => setAddOpen(false)}
        />
      ) : null}

      {historyOpen ? (
        <YearHistory
          activeDays={activeDays}
          today={today}
          onClose={() => setHistoryOpen(false)}
        />
      ) : null}
    </section>
  )
}
