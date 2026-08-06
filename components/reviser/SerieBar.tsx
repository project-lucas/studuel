'use client'

import { useState } from 'react'
import Image from 'next/image'
import { CalendarDays, Check, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { subjectTheme } from '@/lib/subject-style'
import YearHistory from '@/components/YearHistory'
import AddExamSheet, {
  type SubjectLite,
  type ChapterLite,
} from '@/components/AddExamSheet'
import { addDays, type Controle, type ControleSubjectMeta } from '@/lib/prep-plan'

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

export type WeekDay = { done: boolean; isToday: boolean; isFuture: boolean }

// Les 7 clés UTC de la semaine courante (lundi → dimanche) — même définition
// que weekProgress (lundi = 0).
function weekDatesOf(today: string): string[] {
  const t = Date.parse(`${today}T00:00:00Z`)
  const dow = Number.isNaN(t) ? 0 : new Date(t).getUTCDay()
  const mondayOffset = (dow + 6) % 7
  const monday = addDays(today, -mondayOffset)
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i))
}

/**
 * LA barre du haut de Réviser : la série, la semaine, l'historique, et le
 * bouton qui annonce un contrôle. Elle remplace la carte violette « Mission du
 * jour », qui empilait sur un même bloc la mission, l'objectif éditable, la
 * semaine, le lien vers Marcel et l'historique — cinq objets à comprendre avant
 * d'apercevoir la première matière.
 *
 * Ici, trois choses seulement : où j'en suis (la flamme + les 7 jours), tout mon
 * historique (le bouton agenda), et le seul geste d'organisation qui compte
 * depuis cet écran (« + Contrôle », qui ouvre la même feuille qu'avant).
 *
 * Les jours portant un contrôle DATÉ prennent une pastille à la couleur de la
 * matière : la semaine dit ce qui arrive, pas seulement ce qui est fait.
 */
export default function SerieBar({
  streak,
  week,
  today,
  activeDays = [],
  controles,
  subjectMeta,
  subjects,
  chaptersBySubject = {},
  existingExamChapters = [],
  goalMinutes,
}: {
  streak: number
  week: WeekDay[]
  today: string
  activeDays?: string[]
  controles: Controle[]
  subjectMeta: Record<string, ControleSubjectMeta>
  subjects: SubjectLite[]
  chaptersBySubject?: Record<string, ChapterLite[]>
  existingExamChapters?: string[]
  goalMinutes: number
}) {
  const [historyOpen, setHistoryOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)

  const weekDates = weekDatesOf(today)

  // Jour portant un contrôle daté → pastille de la couleur de la matière (le
  // premier contrôle trouvé ce jour-là donne la teinte et le nom).
  const examByDate = new Map<string, { color: string; name: string }>()
  for (const c of controles) {
    if (!c.date || examByDate.has(c.date)) continue
    const meta = subjectMeta[c.subject]
    examByDate.set(c.date, {
      color: meta?.color ?? 'blue',
      name: meta?.name ?? c.subject,
    })
  }

  const todayDone = week.some((d) => d.isToday && d.done)
  const subline =
    streak > 0
      ? todayDone
        ? 'Série en cours — reviens demain pour la prolonger.'
        : 'Travaille un peu aujourd’hui pour la garder.'
      : 'Une session aujourd’hui, et la flamme repart.'

  return (
    <section
      aria-label="Ta série"
      className="rev-card rounded-[1.75rem] bg-white p-3.5 ring-1 ring-black/5"
    >
      {/* Ligne du haut : la flamme et son compte à gauche, les deux commandes
          à droite (mon historique · annoncer un contrôle). */}
      <div className="flex items-center gap-3">
        {/* La flamme illustrée, sans tuile derrière : elle porte son propre
            cerne sombre, un fond coloré ne ferait que la répéter. Série à
            zéro = flamme éteinte (désaturée, en retrait) plutôt qu'absente :
            c'est la même place, à rallumer. */}
        <Image
          src="/images/serie/flamme.webp"
          alt=""
          aria-hidden="true"
          width={128}
          height={128}
          className={cn(
            'size-12 shrink-0 object-contain',
            streak > 0 ? 'flame-breathe' : 'opacity-40 grayscale',
          )}
        />

        <div className="min-w-0 flex-1">
          <p className="font-heading text-base leading-tight font-extrabold text-foreground">
            {streak > 0
              ? `${streak} jour${streak > 1 ? 's' : ''} de série`
              : 'Pas encore de série'}
          </p>
          <p className="truncate text-[11px] font-semibold text-muted-foreground">
            {subline}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            sfx.tap()
            setHistoryOpen(true)
          }}
          aria-haspopup="dialog"
          aria-label="Voir tout mon historique de travail"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted/70 text-primary transition active:translate-y-px"
        >
          <CalendarDays className="size-5" strokeWidth={2.3} aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={() => {
            sfx.tap()
            setAddOpen(true)
          }}
          aria-haspopup="dialog"
          aria-label="Annoncer un contrôle"
          className="font-heading flex min-h-11 shrink-0 items-center gap-1 rounded-full bg-primary pr-3.5 pl-2.5 text-xs font-extrabold text-primary-foreground shadow-sm transition active:translate-y-px"
        >
          <Plus className="size-4" strokeWidth={2.8} aria-hidden="true" />
          Contrôle
        </button>
      </div>

      {/* LA SEMAINE, façon carte de salle de sport : la DATE au-dessus, et
          dans le cercle ce qu'on est venu voir — un V quand c'est fait.
          Le chiffre du jour vivait dans le cercle : il fallait le lire pour
          savoir si la journée comptait, alors que la coche se voit sans lire.
          Date et jour restent au-dessus, en petit, pour se repérer.

          LA VAGUE : les jours faits s'allument de gauche à droite, l'un après
          l'autre, à chaque affichage de l'écran. Ce n'est pas une décoration —
          c'est le mouvement de la semaine qui se remplit, et il s'arrête net
          là où l'élève s'est arrêté. Le retard sur la case suivante est ce qui
          donne envie de la remplir. */}
      <ul className="mt-3 flex items-start justify-between gap-1">
        {week.map((d, i) => {
          const dayNum = Number(weekDates[i]?.slice(8, 10)) || 0
          const exam = examByDate.get(weekDates[i])
          return (
            <li key={i} className="flex flex-1 flex-col items-center gap-1">
              {/* Date + jour, au-dessus du cercle. Ils portent l'info de
                  repérage ; le cercle porte l'état. */}
              <span
                aria-hidden="true"
                className={cn(
                  'text-[10px] leading-none font-extrabold tabular-nums',
                  d.isToday ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                {dayNum}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  'text-[8.5px] leading-none font-extrabold tracking-wide uppercase',
                  d.isToday ? 'text-primary' : 'text-muted-foreground/70',
                )}
              >
                {DAY_SHORT[i]}
              </span>

              <span
                // `role="img"` n'est pas décoratif ici : un `aria-label` posé
                // sur un span SANS rôle n'est pas exposé par la plupart des
                // lecteurs d'écran. Les dates et les noms de jours voisins étant
                // `aria-hidden`, la semaine entière était muette — l'élève qui
                // navigue au lecteur d'écran ne pouvait pas savoir combien de
                // jours il avait faits.
                role="img"
                aria-label={`${DAY_FULL[i]} ${dayNum}${
                  d.done ? ' — fait' : d.isToday ? " — aujourd'hui" : ''
                }${exam ? ` — contrôle de ${exam.name}` : ''}`}
                // Le décalage de la vague suit le RANG DU JOUR, pas celui des
                // jours faits : un trou au milieu de la semaine se voit, la
                // vague passe par-dessus sans se resserrer. 50 ms entre deux
                // jours : la semaine entière se remplit en un tiers de seconde,
                // on lit un mouvement et non sept apparitions successives.
                style={d.done ? { animationDelay: `${i * 50}ms` } : undefined}
                className={cn(
                  'flex size-8 items-center justify-center rounded-full transition',
                  d.done
                    ? 'wave-in bg-primary text-primary-foreground'
                    : d.isFuture
                      ? 'bg-muted'
                      : 'bg-muted ring-1 ring-black/[0.06] ring-inset',
                  d.isToday && 'ring-2 ring-primary ring-offset-2',
                )}
              >
                {d.done ? (
                  <Check className="size-4" strokeWidth={3.4} aria-hidden="true" />
                ) : null}
              </span>

              <span
                aria-hidden="true"
                className={cn(
                  'size-1.5 rounded-full',
                  exam ? subjectTheme(exam.color).bar : 'bg-transparent',
                )}
              />
            </li>
          )
        })}
      </ul>

      {historyOpen ? (
        <YearHistory
          activeDays={activeDays}
          today={today}
          onClose={() => setHistoryOpen(false)}
        />
      ) : null}

      {addOpen ? (
        <AddExamSheet
          subjects={subjects}
          chaptersBySubject={chaptersBySubject}
          existing={new Set(existingExamChapters)}
          today={today}
          goalMinutes={goalMinutes}
          onClose={() => setAddOpen(false)}
        />
      ) : null}
    </section>
  )
}
