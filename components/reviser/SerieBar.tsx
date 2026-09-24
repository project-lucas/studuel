'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { CalendarDays, Check, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { quandLaScenePrete } from '@/lib/scene-prete'
import { subjectTheme } from '@/lib/subject-style'
import YearHistory from '@/components/YearHistory'
import FlammeAnimee from '@/components/FlammeAnimee'
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

// Le marqueur « la validation du jour a déjà été jouée », par jour : elle ne
// se joue qu'une fois, la première fois qu'on revoit la semaine avec le jour
// fait. Les autres visites du jour montrent la coche, posée. Le « 2 » de la
// clé : la première version posait le marqueur alors que l'animation tournait
// derrière le rideau de chargement — ces marqueurs-là ne comptent plus.
const cleValidation = (today: string) => `studuel:serie:validee:2:${today}`

// `?fete=1` rejoue la validation quel que soit le marqueur : pour la voir
// autant de fois qu'on veut (réglages, démonstration, relecture).
const rejouerDemande = () =>
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).get('fete') === '1'

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
  carnetSlot,
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
  /**
   * La porte de « Mon carnet », SOUS la semaine (Lucas, 17/09/2026 : « Mon
   * carnet va dans le bloc semaine, dans le bloc blanc en dessous de samedi
   * dimanche »). Elle vivait sur la ligne du titre, à côté de la classe.
   */
  carnetSlot?: ReactNode
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

  // LA VALIDATION DU JOUR (Lucas, 22/09/2026). La première fois qu'on revoit
  // la semaine avec le jour fait — au retour du quiz, de la leçon, de la
  // dictée —, la pastille du jour se RETOURNE comme une pièce (grise →
  // violette), la coche se TRACE, une onde s'écarte, deux notes montent
  // (`jour-valide*`, globals.css). Les visites suivantes la montrent posée :
  // un marqueur local par jour s'en souvient. Décidé APRÈS montage, jamais au
  // rendu : le serveur ne connaît pas le marqueur, et un écart d'hydratation
  // sur la barre la plus regardée de l'écran se verrait.
  //
  // ET SEULEMENT QUAND LA SCÈNE EST PRÊTE (lib/scene-prete) : rideau de
  // chargement parti, onglet visible. Jouée dès l'hydratation, l'animation se
  // déroulait derrière le rideau et l'élève ne voyait que la coche posée. Le
  // marqueur n'est posé qu'au moment où l'animation part vraiment : une
  // validation jamais vue n'est pas une validation fêtée.
  const [validation, setValidation] = useState(false)
  useEffect(() => {
    if (!todayDone) return
    const cle = cleValidation(today)
    const rejouer = rejouerDemande()
    try {
      if (!rejouer && window.localStorage.getItem(cle)) return
    } catch {
      // Stockage illisible : on fête, une fois par affichage.
    }
    return quandLaScenePrete(() => {
      try {
        window.localStorage.setItem(cle, '1')
      } catch {
        // Stockage indisponible : la fête aura lieu, elle ne sera pas mémorisée.
      }
      setValidation(true)
      sfx.correct()
    })
  }, [todayDone, today])

  return (
    <section
      aria-label="Ta série"
      className="carte p-3.5"
    >
      {/* Ligne du haut : la flamme et son compte à gauche, les deux commandes
          à droite (mon historique · annoncer un contrôle). */}
      <div className="flex items-center gap-3">
        {/* La flamme animée, sans tuile derrière : elle porte son propre
            cerne sombre, un fond coloré ne ferait que la répéter. Série à
            zéro = flamme éteinte (désaturée, en retrait) plutôt qu'absente :
            c'est la même place, à rallumer. */}
        <FlammeAnimee className="size-12" eteinte={streak === 0} />

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

        {/* « NOUVEAU CONTRÔLE ? » — LA fonction clé de l'écran, et elle doit
            se voir comme telle (Lucas, 16/09). Le bouton a été « + Contrôle »,
            discret exprès pour laisser la carte violette mener l'œil ; mais
            un élève qui n'annonce pas son contrôle n'a ni plan de révision, ni
            carte, ni compte à rebours : c'est le geste qui déclenche tout le
            reste. D'où le libellé en QUESTION, qui s'adresse à lui, et UN
            mouvement continu : la respiration (`controle-appel`, globals.css),
            une pulsation d'échelle et un halo violet qui s'écarte — le seul
            bouton de l'accueil qui bouge. Il a porté aussi la bande de lumière
            `attract-sheen` (celle qui traversait le DUEL de l'arène) ; retirée
            le 16/09 (Lucas : « elle s'arrête au milieu, c'est bof — garde les
            ombres, pas la bande »). Le halo reste : il désigne le bouton par
            son POURTOUR sans rien poser sur le mot. */}
        <button
          type="button"
          onClick={() => {
            sfx.tap()
            setAddOpen(true)
          }}
          aria-haspopup="dialog"
          aria-label="Annoncer un nouveau contrôle"
          className="controle-appel font-heading flex min-h-11 shrink-0 items-center gap-1 rounded-full border-b-[3px] border-b-black/25 bg-primary pr-3.5 pl-2.5 text-xs font-extrabold text-primary-foreground shadow-sm transition active:translate-y-px active:border-b-0"
        >
          <Plus className="size-4" strokeWidth={2.8} aria-hidden="true" />
          Nouveau contrôle&nbsp;?
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
                  'relative flex size-8 items-center justify-center rounded-full transition',
                  d.done
                    ? cn(
                        'bg-primary text-primary-foreground',
                        // Le jour qui vient d'être validé se retourne au lieu
                        // d'arriver par la vague : une animation par élément.
                        d.isToday && validation ? 'jour-valide' : 'wave-in',
                      )
                    : d.isFuture
                      ? 'bg-muted'
                      : 'bg-muted ring-1 ring-black/[0.06] ring-inset',
                  d.isToday && 'ring-2 ring-primary ring-offset-2',
                )}
              >
                {/* L'ONDE DU JOUR EN COURS. L'anneau violet le distinguait des
                    six autres, mais immobile au milieu de six pastilles grises
                    il était présent sans être trouvé. Une onde s'en écarte
                    toutes les deux secondes et demie : c'est le seul mouvement
                    de la barre, donc l'œil y va.

                    Elle est POSÉE PAR-DESSOUS (`-z-10`) et déborde (`-inset-1`)
                    : elle ne doit ni recouvrir la coche, ni intercepter un tap.
                    Le jour reste marqué par son anneau quand le mouvement est
                    réduit — un halo ne porte jamais seul une information. */}
                {d.isToday ? (
                  <span
                    aria-hidden="true"
                    className="jour-onde pointer-events-none absolute -inset-1 -z-10 rounded-full ring-2 ring-primary"
                  />
                ) : null}
                {/* L'onde de la validation : elle ne vit que le temps de son
                    animation, sur le seul jour qui vient d'être fait. */}
                {d.done && d.isToday && validation ? (
                  <span
                    aria-hidden="true"
                    className="jour-valide-onde pointer-events-none absolute inset-0 rounded-full ring-2 ring-primary"
                  />
                ) : null}
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

      {carnetSlot ? <div className="mt-3">{carnetSlot}</div> : null}

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
