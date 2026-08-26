// L'agenda, la tendance, l'objectif et l'alerte de l'espace parents.
//
// `lib/parents.ts` répond depuis toujours à « qu'est-ce qu'il a fait ? »
// (temps, série, score par matière). Ce module-ci répond aux trois questions
// qu'un parent se pose vraiment en ouvrant l'écran, et auxquelles les chiffres
// bruts ne répondaient pas :
//
//   « Il a quelque chose de prévu ? »  → les contrôles (`controleViews`)
//   « Ça monte ou ça descend ? »       → la tendance (`weekTrend`)
//   « Il en fait assez ? »             → l'objectif (`goalProgress`)
//
// Les données viennent des quatre clés ajoutées à `child_dashboard` par la
// migration 319. Elles sont OPTIONNELLES côté type : tant que la migration
// n'est pas passée, l'écran doit se TAIRE sur ces blocs plutôt que d'afficher
// des zéros — un « 0 min cette semaine » faux est bien pire, pour un parent,
// qu'un bloc absent.
//
// Logique pure, testable sans base : voir parents-suivi.test.ts.

import type { ChildControle, SubjectScore, WeekPoint } from './parents'
import { MIN_ATTEMPTS_FOR_SIGNAL } from './parents'

// Les formes renvoyées par `child_dashboard` (`WeekPoint`, `ChildControle`)
// vivent dans `lib/parents.ts`, avec le reste du miroir de la RPC : elles y
// sont réexportées ci-dessous pour que l'appelant n'ait qu'un seul import.
export type { ChildControle, WeekPoint }

// --- Réglages du parent (table parent_prefs, migration 319) ------------------

export type ParentPrefs = {
  weeklyGoalMinutes: number
  /** 0 = alerte désactivée. */
  alertAfterDays: number
}

// Miroir EXACT des DEFAULT de `parent_prefs` : un parent qui n'a jamais rien
// réglé doit lire à l'écran ce que la base écrirait pour lui. Un test compare
// ces valeurs au fichier SQL — les deux ne peuvent plus diverger en silence.
export const DEFAULT_PARENT_PREFS: ParentPrefs = {
  weeklyGoalMinutes: 90,
  alertAfterDays: 3,
}

// Bornes de saisie, miroir des CHECK de la table. Elles vivent ici parce que
// c'est le FORMULAIRE qui doit refuser une valeur hors bornes : remonter une
// erreur 23514 de Postgres jusqu'au parent ne lui apprendrait rien.
export const GOAL_MINUTES_BOUNDS = { min: 15, max: 1200 } as const
export const ALERT_DAYS_BOUNDS = { min: 0, max: 30 } as const

export function clampParentPrefs(prefs: Partial<ParentPrefs>): ParentPrefs {
  return {
    weeklyGoalMinutes: clamp(
      prefs.weeklyGoalMinutes,
      GOAL_MINUTES_BOUNDS,
      DEFAULT_PARENT_PREFS.weeklyGoalMinutes,
    ),
    alertAfterDays: clamp(
      prefs.alertAfterDays,
      ALERT_DAYS_BOUNDS,
      DEFAULT_PARENT_PREFS.alertAfterDays,
    ),
  }
}

function clamp(
  value: unknown,
  bounds: { min: number; max: number },
  fallback: number,
): number {
  const n = Number(value)
  if (!Number.isFinite(n)) return fallback
  return Math.min(bounds.max, Math.max(bounds.min, Math.round(n)))
}

// Propositions d'objectif du formulaire de réglages. Des paliers plutôt qu'un
// champ libre : un parent ne SAIT pas combien de minutes hebdomadaires sont
// raisonnables — lui demander un nombre, c'est lui demander de deviner.
export const GOAL_PRESETS: readonly { minutes: number; label: string; hint: string }[] = [
  { minutes: 45, label: '45 min', hint: 'Entretien — 3 sessions courtes' },
  { minutes: 90, label: '1 h 30', hint: 'Régulier — le rythme conseillé' },
  { minutes: 150, label: '2 h 30', hint: 'Soutenu — période de contrôles' },
  { minutes: 300, label: '5 h', hint: 'Intensif — préparation d’examen' },
]

// --- L'objectif de la semaine ------------------------------------------------

export type GoalProgress = {
  /** 0..1, ÉCRÊTÉ : une barre ne dépasse pas son cadre. */
  ratio: number
  /** 0..100, écrêté lui aussi. */
  percent: number
  reached: boolean
  /** 0 dès que l'objectif est atteint. */
  remainingSeconds: number
}

// Où en est la semaine par rapport à l'objectif posé par le parent ?
//
// L'écrêtage est VOLONTAIRE et rattrapé par `reached` : une semaine à 300 % ne
// doit pas déformer la jauge, mais elle doit pouvoir être félicitée — c'est
// `reached` qui porte cette information, pas le débordement d'une barre.
export function goalProgress(
  weekSeconds: number,
  goalMinutes: number,
): GoalProgress {
  const target = Math.max(1, Math.round(goalMinutes)) * 60
  const done = Math.max(0, Math.round(weekSeconds))
  const raw = done / target
  return {
    ratio: Math.min(1, raw),
    percent: Math.min(100, Math.round(raw * 100)),
    reached: done >= target,
    remainingSeconds: Math.max(0, target - done),
  }
}

// --- La tendance sur quatre semaines -----------------------------------------

export type TrendDirection = 'hausse' | 'stable' | 'baisse' | 'inconnue'

export type TrendPoint = {
  start: string
  seconds: number
  activeDays: number
  /** Hauteur relative de la barre, 0..1. */
  ratio: number
}

export type WeekTrend = {
  points: TrendPoint[]
  direction: TrendDirection
  /**
   * Variation de la semaine en cours par rapport à la PRÉCÉDENTE, en %.
   * null quand la comparaison n'a pas de sens (pas de semaine précédente, ou
   * semaine précédente à zéro : « +∞ % » n'est pas une information).
   */
  deltaPercent: number | null
}

// En dessous de ce seuil on parle de « stable » plutôt que de hausse ou de
// baisse : à huit minutes près sur une semaine, une flèche donnerait un sens à
// du bruit — et un parent alerté par du bruit cesse de croire aux vraies
// alertes.
export const TREND_STABLE_RATIO = 0.15

// La courbe des quatre dernières semaines, prête à dessiner.
//
// `ratio` rapporte chaque semaine à la PLUS HAUTE des quatre, et non à
// l'objectif. Rapporter à l'objectif écraserait toutes les barres d'un enfant
// qui n'atteint jamais sa cible — or c'est précisément chez lui qu'on cherche
// à lire une progression.
export function weekTrend(
  weeks: readonly WeekPoint[] | null | undefined,
): WeekTrend {
  const list = (weeks ?? []).filter(
    (w): w is WeekPoint => Boolean(w) && typeof w.start === 'string',
  )
  if (list.length === 0) {
    return { points: [], direction: 'inconnue', deltaPercent: null }
  }

  const max = Math.max(...list.map((w) => Math.max(0, w.seconds)), 1)
  const points: TrendPoint[] = list.map((w) => ({
    start: w.start,
    seconds: Math.max(0, w.seconds),
    activeDays: Math.max(0, w.active_days ?? 0),
    ratio: Math.max(0, w.seconds) / max,
  }))

  const current = points[points.length - 1]
  const previous = points[points.length - 2]
  if (!previous || previous.seconds <= 0) {
    // Repartir de zéro EST une information — mais « +∞ % » n'en est pas une :
    // on nomme la direction, on renonce au chiffre.
    return {
      points,
      direction: previous && current.seconds > 0 ? 'hausse' : 'inconnue',
      deltaPercent: null,
    }
  }

  const delta = (current.seconds - previous.seconds) / previous.seconds
  return {
    points,
    direction:
      Math.abs(delta) < TREND_STABLE_RATIO
        ? 'stable'
        : delta > 0
          ? 'hausse'
          : 'baisse',
    deltaPercent: Math.round(delta * 100),
  }
}

const TREND_SENTENCE: Record<TrendDirection, string> = {
  hausse: 'Le temps de révision augmente par rapport à la semaine dernière.',
  stable:
    'Le rythme se tient d’une semaine à l’autre — c’est la régularité qui fait progresser.',
  baisse:
    'Le temps de révision baisse par rapport à la semaine dernière — un encouragement peut suffire.',
  inconnue: 'Pas encore assez de recul pour dégager une tendance.',
}

export function trendSentence(direction: TrendDirection): string {
  return TREND_SENTENCE[direction]
}

// Libellé d'une semaine, RELATIF à aujourd'hui : « Cette semaine », « Semaine
// dernière », « Il y a 2 semaines ». Une date de lundi (« 04/08 ») obligerait
// le parent à calculer de tête à quelle semaine elle correspond.
export function weekLabel(startDay: string, today: string): string {
  const weeksAgo = weeksBetween(startDay, today)
  if (weeksAgo <= 0) return 'Cette semaine'
  if (weeksAgo === 1) return 'Semaine dernière'
  return `Il y a ${weeksAgo} semaines`
}

/** Version courte pour l'axe du graphique, où la place manque. */
export function weekLabelShort(startDay: string, today: string): string {
  const weeksAgo = weeksBetween(startDay, today)
  return weeksAgo <= 0 ? 'Cette sem.' : `S-${weeksAgo}`
}

function weeksBetween(startDay: string, today: string): number {
  return Math.round(daysBetweenKeys(startDay, mondayOf(today)) / 7)
}

// Lundi de la semaine d'une clé UTC — semaine commençant lundi (index 0), la
// convention de toute l'app (lib/streak.ts, lib/time.ts).
function mondayOf(day: string): string {
  const t = Date.parse(`${day}T00:00:00Z`)
  if (Number.isNaN(t)) return day
  const offset = (new Date(t).getUTCDay() + 6) % 7
  return new Date(t - offset * 86_400_000).toISOString().slice(0, 10)
}

// Écart en jours entre deux clés UTC. Redit ici plutôt qu'importé de
// `lib/prep-plan.ts` : ce module est tiré par un composant serveur qui n'a
// aucune raison d'embarquer le planificateur de révisions au passage.
function daysBetweenKeys(from: string, to: string): number {
  const a = Date.parse(`${from}T00:00:00Z`)
  const b = Date.parse(`${to}T00:00:00Z`)
  if (Number.isNaN(a) || Number.isNaN(b)) return 0
  return Math.round((b - a) / 86_400_000)
}

// --- L'alerte d'inactivité ---------------------------------------------------

export type InactivityAlert = {
  daysSince: number
  message: string
}

// Faut-il alerter le parent ? `null` = non, et c'est le cas majoritaire.
//
// Trois situations rendent `null` : l'alerte est désactivée (`alertAfterDays`
// à 0), l'enfant a travaillé assez récemment, ou on n'a AUCUNE trace
// d'activité. Ce dernier cas est le plus important : un compte tout juste créé
// n'a pas de dernière activité, et lui coller « inactif depuis toujours »
// accueillerait chaque nouveau parent par un reproche. L'écran a un état
// « pas encore commencé » pour ça, et ce n'est pas une alerte.
export function inactivityAlert(
  lastActivity: string | null | undefined,
  alertAfterDays: number,
  today: string,
): InactivityAlert | null {
  if (!alertAfterDays || alertAfterDays <= 0) return null
  if (!lastActivity) return null

  const daysSince = daysBetweenKeys(lastActivity, today)
  if (!Number.isFinite(daysSince) || daysSince < alertAfterDays) return null

  return {
    daysSince,
    message:
      daysSince === 1
        ? 'Aucune activité depuis hier.'
        : `Aucune activité depuis ${daysSince} jours.`,
  }
}

// --- Les contrôles à venir ---------------------------------------------------

export type ControleView = {
  id: string
  subjectSlug: string
  subjectName: string
  date: string
  /** « Demain », « Dans 3 jours » : le compte à rebours tel qu'il se LIT. */
  countdown: string
  /** Les chapitres du contrôle, déjà mis en phrase. */
  chaptersLabel: string
  /**
   * Vrai à 2 jours ou moins : le seuil « imminent » de Réviser
   * (app/reviser/page.tsx), repris tel quel pour que l'élève et son parent
   * voient la même échéance devenir urgente le même jour.
   */
  imminent: boolean
}

export const CONTROLE_IMMINENT_DAYS = 2

// Met les contrôles bruts de la RPC en forme d'affichage.
//
// `subjectNames` : slug → nom lisible, pris du catalogue. Un slug inconnu
// (matière retirée du catalogue depuis la déclaration) s'affiche tel quel
// plutôt que de faire disparaître le contrôle : la date, elle, reste vraie —
// et c'est la date qui intéresse le parent.
export function controleViews(
  controles: readonly ChildControle[] | null | undefined,
  subjectNames: Readonly<Record<string, string>>,
  today: string,
): ControleView[] {
  return (controles ?? [])
    .filter((c) => Boolean(c) && typeof c.exam_date === 'string')
    .map((c) => {
      const days = daysBetweenKeys(today, c.exam_date)
      return {
        id: String(c.id),
        subjectSlug: c.subject_slug,
        subjectName: subjectNames[c.subject_slug] ?? c.subject_slug,
        date: c.exam_date,
        countdown: countdownLabel(days),
        chaptersLabel: chaptersLabel(c.chapters),
        imminent: days <= CONTROLE_IMMINENT_DAYS,
      }
    })
    .sort((a, b) => a.date.localeCompare(b.date))
}

function countdownLabel(days: number): string {
  if (days <= 0) return "Aujourd'hui"
  if (days === 1) return 'Demain'
  if (days < 7) return `Dans ${days} jours`
  if (days < 14) return 'La semaine prochaine'
  return `Dans ${Math.round(days / 7)} semaines`
}

// « Les fonctions affines et Le théorème de Thalès » — une phrase, jamais une
// liste à puces : le parent n'a pas à réviser ces chapitres, seulement à savoir
// sur quoi porte le contrôle. Au-delà de deux titres, on compte le reste.
export function chaptersLabel(
  chapters: readonly { title?: string }[] | null | undefined,
): string {
  const titles = (chapters ?? [])
    .map((c) => (typeof c?.title === 'string' ? c.title.trim() : ''))
    .filter((t) => t.length > 0)

  if (titles.length === 0) return 'Chapitres non précisés'
  if (titles.length === 1) return titles[0]
  if (titles.length === 2) return `${titles[0]} et ${titles[1]}`
  const rest = titles.length - 2
  return `${titles[0]}, ${titles[1]} et ${rest} autre${rest > 1 ? 's' : ''}`
}

// --- Toutes les matières, et non plus les trois plus faibles -----------------

export type SubjectRow = SubjectScore & { judgeable: boolean }

// Le volet Suivi montre TOUTES les matières travaillées, de la plus fragile à
// la mieux tenue — et non le top 3 des faiblesses.
//
// Pourquoi ce changement : trois matières faibles présentées seules donnaient
// d'un enfant qui va bien le portrait d'un enfant en difficulté. Le parent ne
// voyait jamais l'ensemble, donc jamais la proportion.
//
// Les matières trop peu travaillées pour être jugées (`judgeable: false`)
// restent dans la liste, en fin de tri et signalées comme telles : les cacher
// ferait croire qu'elles n'ont pas été abordées, ce qui est faux — et c'est
// justement là qu'un parent peut agir.
export function subjectRows(
  perSubject: readonly SubjectScore[],
  minAttempts = MIN_ATTEMPTS_FOR_SIGNAL,
): SubjectRow[] {
  return perSubject
    .map((s) => ({ ...s, judgeable: s.attempts >= minAttempts }))
    .sort((a, b) => {
      if (a.judgeable !== b.judgeable) return a.judgeable ? -1 : 1
      if (!a.judgeable) return b.attempts - a.attempts
      return a.ratio - b.ratio || b.attempts - a.attempts
    })
}
