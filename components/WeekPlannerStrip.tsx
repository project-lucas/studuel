'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Plus, CalendarDays, Check, Flame, Pencil, Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { toast } from '@/lib/toast'
import { saveDailyGoalMinutes } from '@/app/reviser/actions'
import { DAILY_GOAL_OPTIONS } from '@/lib/daily-goal'
import { subjectTheme } from '@/lib/subject-style'
import SubjectIcon from '@/components/SubjectIcon'
import {
  addDays,
  derivePlanView,
  controleTitle,
  launchChapterId,
  nearestActiveControle,
  countdownTag,
  type Controle,
} from '@/lib/prep-plan'
import YearHistory from '@/components/YearHistory'
import AddExamSheet, {
  type SubjectLite,
  type ChapterLite,
} from '@/components/AddExamSheet'

// Jours de la semaine, lundi → dimanche (index 0 = lundi, cf. lib/streak).
const DAY_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
// Noms complets pour l'accessibilité : deux « M » à l'écran (mardi/mercredi)
// sont ambigus au lecteur d'écran, la lettre seule ne suffit pas.
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

// Métadonnée d'affichage d'une matière (couleur de la pastille + nom du libellé).
export type ControleSubjectMeta = { name: string; color: string }

// Les 7 clés UTC de la semaine courante (lundi → dimanche), à partir d'une clé
// « aujourd'hui » — même définition que weekProgress (lundi = 0).
function weekDatesOf(today: string): string[] {
  const t = Date.parse(`${today}T00:00:00Z`)
  const dow = Number.isNaN(t) ? 0 : new Date(t).getUTCDay()
  const mondayOffset = (dow + 6) % 7
  const monday = addDays(today, -mondayOffset)
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i))
}

// -----------------------------------------------------------------------------
// Barre de semaine de l'onglet Réviser : la ligne des 7 jours (activité + jours
// portant une session du plan de préparation, pastille de la couleur de la
// matière) + la ligne du prochain contrôle (compte à rebours « J-3 » et
// progression « 1/3 sessions »). Le tap sur la ligne LANCE directement la
// session du jour — même action que le bouton de la carte de préparation.
// -----------------------------------------------------------------------------
export default function WeekPlannerStrip({
  week,
  controles,
  today,
  subjectMeta,
  subjects,
  chaptersBySubject = {},
  existingExamChapters = [],
  streak,
  todayMinutes,
  goalMinutes,
  activeDays = [],
}: {
  week: WeekDay[]
  controles: Controle[]
  today: string
  subjectMeta: Record<string, ControleSubjectMeta>
  subjects: SubjectLite[]
  chaptersBySubject?: Record<string, ChapterLite[]>
  existingExamChapters?: string[]
  // Série d'activité + minutes travaillées aujourd'hui : les deux données
  // conservées de l'ancienne carte d'identité, désormais en tête de cette carte.
  streak: number
  todayMinutes: number
  goalMinutes: number
  activeDays?: string[]
}) {
  const [historyOpen, setHistoryOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)

  // Objectif quotidien éditable (logique reprise de l'ancien HeaderStats) :
  // sélection optimiste, rollback + toast si l'enregistrement échoue.
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

  // Couleur (thème matière) d'un jour portant une session du plan : le premier
  // contrôle vu ce jour-là donne la teinte de la pastille.
  const colorByDate = new Map<string, string>()
  for (const c of controles) {
    const color = subjectMeta[c.subject]?.color ?? 'blue'
    for (const s of c.sessions) {
      if (!colorByDate.has(s.plannedDate)) colorByDate.set(s.plannedDate, color)
    }
  }

  // Le prochain contrôle actif → sa ligne (compte à rebours + progression).
  const next = nearestActiveControle(controles, today)
  const nextView = next ? derivePlanView(next, today) : null
  const nextName = next ? (subjectMeta[next.subject]?.name ?? '') : ''
  const nextColor = next ? (subjectMeta[next.subject]?.color ?? 'blue') : 'blue'
  const nextHref =
    next && nextView
      ? `/reviser/${next.subject}/${launchChapterId(nextView, next)}`
      : '/reviser'
  const nextTag = next ? countdownTag(next.date, today) : null

  return (
    <section aria-label="Ta semaine" className="px-1">
      {/* Bande fine en tête : série + objectif du jour éditable — les deux
          données rescapées de l'ancienne carte d'identité violette. */}
      <div className="mb-2.5 flex items-center justify-between gap-2 rounded-2xl bg-muted/40 px-3 py-2">
        <span className="flex items-center gap-1.5 text-xs font-bold text-foreground">
          <Flame className="size-4 text-orange-500" aria-hidden="true" />
          Série {streak}
        </span>
        <button
          type="button"
          onClick={() => {
            sfx.tap()
            setEditingGoal((v) => !v)
          }}
          aria-haspopup="menu"
          aria-expanded={editingGoal}
          aria-label={`Objectif du jour : ${todayMinutes} sur ${goal} minutes — toucher pour changer`}
          className="flex items-center gap-1 text-xs font-bold text-primary transition-colors hover:text-primary/80"
        >
          <span>
            Objectif&nbsp;:{' '}
            <span className="tabular-nums">
              {todayMinutes}/{goal}
            </span>{' '}
            min
          </span>
          <Pencil className="size-3" aria-hidden="true" />
        </button>
      </div>

      {/* Sélecteur d'objectif quotidien, déplié sous la bande. */}
      {editingGoal ? (
        <div
          role="menu"
          aria-label="Choisir l'objectif quotidien"
          className="mb-2.5 flex items-center gap-1.5 rounded-2xl bg-muted/40 px-3 py-2"
        >
          <span className="mr-auto text-[11px] font-bold text-muted-foreground">
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
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-white text-foreground hover:bg-muted',
              )}
            >
              {min}m
            </button>
          ))}
        </div>
      ) : null}

      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-heading text-sm font-extrabold text-foreground">
          Ta semaine
        </h3>
        {/* Actions de la carte, en haut à droite : ajouter un contrôle (le
            bouton a migré du bas de la carte vers ici, près du calendrier) +
            ouvrir l'historique complet. */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              sfx.tap()
              setAddOpen(true)
            }}
            aria-haspopup="dialog"
            className="flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border border-dashed border-primary/40 py-1.5 pr-3 pl-1.5 font-heading text-xs font-bold text-primary transition hover:bg-primary/5 active:translate-y-px"
          >
            <span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Plus className="size-3.5" strokeWidth={2.8} aria-hidden="true" />
            </span>
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
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-primary ring-1 ring-black/5 shadow-sm transition active:translate-y-px"
          >
            <CalendarDays
              className="size-5"
              strokeWidth={2.4}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      {/* Ligne des 7 jours : UNE seule lettre par jour (dans la pastille), plus
          la rangée de lettres redondante d'avant. Un jour validé garde sa lettre
          et reçoit un ✓ vert en badge superposé — l'information « quel jour » ne
          disparaît plus derrière la coche. Vert = validation (le jaune reste la
          monnaie). Point coloré dessous = session du plan de révision. */}
      <ul className="flex items-center justify-between gap-1">
        {week.map((d, i) => {
          const sessionColor = colorByDate.get(weekDates[i])
          return (
            <li key={i} className="flex flex-1 flex-col items-center gap-1">
              <span
                className="relative"
                aria-label={`${DAY_FULL[i]}${
                  d.done ? ' — fait' : d.isToday ? " — aujourd'hui" : ''
                }`}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex size-7 items-center justify-center rounded-full text-xs font-bold uppercase transition',
                    d.done
                      ? 'bg-green-500/15 text-green-700 ring-1 ring-green-500/40'
                      : d.isFuture
                        ? 'bg-white/60 text-muted-foreground/50'
                        : 'bg-white text-muted-foreground ring-1 ring-black/5',
                    d.isToday &&
                      'ring-2 ring-primary ring-offset-1 ring-offset-background',
                  )}
                >
                  {DAY_LABELS[i]}
                </span>
                {d.done ? (
                  <span
                    aria-hidden="true"
                    className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-green-500 text-white shadow-sm ring-2 ring-white"
                  >
                    <Check className="size-2.5" strokeWidth={3.5} />
                  </span>
                ) : null}
              </span>
              {/* Pastille « session de révision planifiée » (couleur matière). */}
              <span
                aria-hidden="true"
                className={cn(
                  'size-1.5 rounded-full',
                  sessionColor ? subjectTheme(sessionColor).bar : 'bg-transparent',
                )}
              />
            </li>
          )
        })}
      </ul>

      {/* Le prochain contrôle : ligne cliquable qui lance la session du jour. */}
      {next && nextView ? (
        <Link
          href={nextHref}
          onClick={() => sfx.tap()}
          aria-label={`Lancer la session de préparation — ${controleTitle(next, nextName)}`}
          className="group mt-2 flex min-w-0 items-center gap-2.5 rounded-2xl bg-white/70 px-3 py-2 ring-1 ring-black/5 transition active:scale-[0.99]"
        >
          <span
            aria-hidden="true"
            className={cn(
              'grid size-9 shrink-0 place-items-center rounded-full',
              subjectTheme(nextColor).chip,
            )}
          >
            <SubjectIcon
              slug={next.subject}
              className="size-4 text-foreground"
              strokeWidth={2.4}
            />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-bold text-foreground">
              {controleTitle(next, nextName)}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-primary">
              {nextTag ? (
                <span className="rounded-full bg-primary/10 px-1.5 py-0.5 font-extrabold tabular-nums">
                  {nextTag}
                </span>
              ) : (
                <span className="text-muted-foreground">Sans date</span>
              )}
              <span className="text-muted-foreground">
                {nextView.progressLabel} sessions
              </span>
            </span>
          </span>
          {/* CTA explicite : l'action principale de l'écran. Le tap sur TOUTE
              la ligne lance déjà la session (le lien enveloppe le CTA), pas
              d'écran intermédiaire. */}
          <span className="font-heading flex shrink-0 items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-extrabold whitespace-nowrap text-primary-foreground shadow-sm transition-transform group-active:translate-y-px">
            <Play className="size-3.5 fill-current" aria-hidden="true" />
            Faire ma session
          </span>
        </Link>
      ) : null}

      {/* À défaut de contrôle, un mot discret sous la semaine (le bouton
          d'ajout vit désormais dans l'en-tête, près du calendrier). */}
      {!next ? (
        <p className="mt-2.5 text-xs font-medium text-muted-foreground">
          Aucun contrôle prévu.
        </p>
      ) : null}

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
