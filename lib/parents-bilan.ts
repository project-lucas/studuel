// Le bilan de la semaine et les gestes du parent — l'espace parents devient un
// COACH, pas seulement un tableau de bord.
//
// `lib/parents.ts` dérive des chiffres (temps, série, score) ; `lib/parents-suivi.ts`
// des repères (objectif, tendance, contrôles, alerte). Ce module-ci les met en
// PHRASES, dans l'ordre où un parent les lirait à voix haute — et en GESTES :
// deux ou trois choses concrètes à faire cette semaine, chacune reliée à la
// fiche de conseil qui l'explique (`lib/parents-conseils.ts`).
//
// POURQUOI. Un parent ouvre l'écran une fois par semaine, dix secondes. Il ne
// lit pas six blocs de chiffres ; il cherche une réponse à « ça va ? » et une
// à « qu'est-ce que je fais ? ». Les chiffres restent en dessous, pour qui
// veut vérifier. Ici, on répond d'abord.
//
// Logique pure : pas de date système, `today` est fourni. Testé sans base.

import type { ChildDashboard } from './parents'
import {
  MIN_ATTEMPTS_FOR_SIGNAL,
  formatWorkDuration,
  scorePercent,
  strongestSubject,
  weakestSubjects,
} from './parents'
import {
  controleViews,
  goalProgress,
  inactivityAlert,
  weekTrend,
  type ControleView,
  type ParentPrefs,
} from './parents-suivi'
import { MASTERY_THRESHOLDS } from './mastery'

export type BilanTon = 'bravo' | 'neutre' | 'attention'

export type BilanSemaine = {
  /** Deux à cinq phrases, dans l'ordre de lecture. */
  phrases: string[]
  ton: BilanTon
}

export type BilanEntree = {
  displayName: string
  dashboard: ChildDashboard
  prefs: ParentPrefs
  streak: number
  /** Clé UTC du jour. */
  today: string
  /** slug → nom de matière, pour nommer les contrôles. */
  subjectNames: Readonly<Record<string, string>>
}

// Un enfant qui n'a JAMAIS rien fait n'est pas « inactif » : il n'a pas
// commencé. Les deux se lisent différemment, et le second n'est pas une
// alerte (cf. inactivityAlert).
function aDejaCommence(d: ChildDashboard): boolean {
  return Boolean(d.last_activity) || d.work_seconds > 0 || d.sessions_total > 0
}

function pluriel(n: number, mot: string): string {
  return `${n} ${mot}${n > 1 ? 's' : ''}`
}

/** Le bilan de la semaine, en phrases. */
export function bilanSemaine(e: BilanEntree): BilanSemaine {
  const { displayName: nom, dashboard: d, prefs, streak, today } = e
  const phrases: string[] = []
  let ton: BilanTon = 'neutre'

  const alerte = inactivityAlert(d.last_activity, prefs.alertAfterDays, today)
  const objectif = d.weeks ? goalProgress(d.week_seconds, prefs.weeklyGoalMinutes) : null
  const tendance = d.weeks ? weekTrend(d.weeks) : null

  // 1. Le temps de la semaine — la phrase que tout le monde lit.
  if (!aDejaCommence(d)) {
    phrases.push(`${nom} n’a pas encore commencé : son suivi se remplira dès sa première session.`)
    return { phrases, ton }
  }
  if (d.week_seconds <= 0) {
    phrases.push(`${nom} n’a pas révisé ces sept derniers jours.`)
    ton = 'attention'
  } else {
    const duree = formatWorkDuration(d.week_seconds)
    const jours = pluriel(d.week_active_days, 'jour')
    if (objectif?.reached) {
      phrases.push(`${nom} a révisé ${duree} sur ${jours} cette semaine — objectif atteint.`)
      ton = 'bravo'
    } else if (objectif) {
      phrases.push(
        `${nom} a révisé ${duree} sur ${jours} cette semaine, soit ${objectif.percent} % de l’objectif.`,
      )
    } else {
      phrases.push(`${nom} a révisé ${duree} sur ${jours} cette semaine.`)
    }
  }

  // 2. La pente, quand elle dit quelque chose. Une semaine à ZÉRO se passe
  // de « −100 % » : la première phrase a déjà tout dit.
  if (
    d.week_seconds > 0 &&
    tendance &&
    tendance.deltaPercent !== null &&
    tendance.direction !== 'stable'
  ) {
    const signe = tendance.direction === 'hausse' ? '+' : ''
    phrases.push(
      tendance.direction === 'hausse'
        ? `C’est plus que la semaine dernière (${signe}${tendance.deltaPercent} %).`
        : `C’est moins que la semaine dernière (${tendance.deltaPercent} %).`,
    )
  }

  // 3. La série, quand elle mérite un mot.
  if (streak >= 3) {
    phrases.push(`Sa série tient depuis ${pluriel(streak, 'jour')}.`)
    if (streak >= 7 && ton !== 'attention') ton = 'bravo'
  }

  // 4. Le point fort et la matière à surveiller — avec assez de preuve, et
  // seulement une matière FRAGILE (sous 50 %) : « à surveiller » sur un 58 %
  // en progrès, c'est un reproche que les chiffres ne portent pas.
  const fort = strongestSubject(d.per_subject)
  const faible = weakestSubjects(d.per_subject, 1).find(
    (s) => s.ratio < MASTERY_THRESHOLDS.fragile,
  )
  if (fort && faible && fort.subject !== faible.subject) {
    phrases.push(
      `Point fort : ${fort.subject} (${scorePercent(fort.ratio)} %). À surveiller : ${faible.subject} (${scorePercent(faible.ratio)} %).`,
    )
  } else if (fort) {
    phrases.push(`Point fort : ${fort.subject} (${scorePercent(fort.ratio)} %).`)
  }

  // 5. La prochaine échéance.
  const prochain = d.controles
    ? controleViews(d.controles, e.subjectNames, today)[0]
    : undefined
  if (prochain) {
    phrases.push(
      `Prochain contrôle : ${prochain.subjectName}, ${prochain.countdown.toLowerCase()}.`,
    )
  }

  if (alerte) ton = 'attention'
  return { phrases, ton }
}

// --- Les gestes de la semaine ------------------------------------------------

export type Geste = {
  id: string
  texte: string
  /** La fiche de `lib/parents-conseils.ts` qui explique ce geste. */
  conseilId: string
}

export const MAX_GESTES = 3

/**
 * Deux ou trois gestes concrets pour cette semaine, du plus urgent au plus
 * général. Chaque règle correspond à une situation lisible dans les chiffres ;
 * elles sont classées par priorité et on n'en garde que MAX_GESTES.
 */
export function gestesDeLaSemaine(e: BilanEntree): Geste[] {
  const { dashboard: d, prefs, streak, today } = e
  const gestes: Geste[] = []

  const alerte = inactivityAlert(d.last_activity, prefs.alertAfterDays, today)
  const objectif = d.weeks ? goalProgress(d.week_seconds, prefs.weeklyGoalMinutes) : null
  const tendance = d.weeks ? weekTrend(d.weeks) : null
  const controles = d.controles ? controleViews(d.controles, e.subjectNames, today) : null

  if (!aDejaCommence(d)) {
    gestes.push({
      id: 'premiere-semaine',
      texte:
        'Première semaine : installez un créneau court et régulier — le même moment chaque jour, téléphone posé ailleurs.',
      conseilId: 'ecrans-et-devoirs',
    })
    gestes.push({
      id: 'declarer-controle',
      texte:
        'Demandez-lui ses prochaines dates de contrôle : il les saisit dans Réviser, et l’app lui prépare les sessions.',
      conseilId: 'preparer-un-controle',
    })
    return gestes.slice(0, MAX_GESTES)
  }

  // 1. Un contrôle qui approche prime sur tout : c'est daté.
  const imminent = controles?.find((c) => c.imminent)
  const proche = controles?.find((c) => !c.imminent && joursAvant(c, today) <= 7)
  if (imminent) {
    gestes.push({
      id: `controle-${imminent.id}`,
      texte: `Contrôle de ${imminent.subjectName} ${imminent.countdown.toLowerCase()} : proposez-lui un passage à froid ce soir, sans le cours sous les yeux — puis dodo.`,
      conseilId: 'preparer-un-controle',
    })
  } else if (proche) {
    gestes.push({
      id: `controle-${proche.id}`,
      texte: `Contrôle de ${proche.subjectName} ${proche.countdown.toLowerCase()} : c’est le moment du premier passage — relire le cours pour repérer ce qui n’est pas clair.`,
      conseilId: 'preparer-un-controle',
    })
  }

  // 2. Le décrochage.
  if (alerte) {
    gestes.push({
      id: 'relancer',
      texte: `${alerte.message} Un mot d’encouragement plutôt qu’un reproche, et un créneau court dès demain.`,
      conseilId: 'la-serie',
    })
  } else if (tendance?.direction === 'baisse' && tendance.deltaPercent !== null) {
    gestes.push({
      id: 'tendance-baisse',
      texte: `Le temps de révision baisse (${tendance.deltaPercent} %) : une session courte à un moment calme relance mieux qu’une longue le dimanche soir.`,
      conseilId: 'courbe-de-l-oubli',
    })
  }

  // 3. La matière fragile.
  const fragile = d.per_subject.find(
    (s) => s.attempts >= MIN_ATTEMPTS_FOR_SIGNAL && s.ratio < MASTERY_THRESHOLDS.fragile,
  )
  if (fragile) {
    gestes.push({
      id: `fragile-${fragile.subject}`,
      texte: `${fragile.subject} à ${scorePercent(fragile.ratio)} % : demandez-lui sur quelles questions les points partent, plutôt que « tu n’as pas assez travaillé ».`,
      conseilId: 'mauvaise-note',
    })
  }

  // 4. Ce qui va bien se dit aussi — c'est même le geste le plus rentable.
  if (objectif?.reached) {
    gestes.push({
      id: 'objectif-atteint',
      texte: 'Objectif de la semaine atteint : dites-le lui. Féliciter la régularité vaut plus que féliciter une note.',
      conseilId: 'la-serie',
    })
  } else if (streak >= 3) {
    gestes.push({
      id: 'feliciter-serie',
      texte: `${streak} jours d’affilée : dites-le lui ce soir. La série est la seule chose sur laquelle il a une prise directe.`,
      conseilId: 'la-serie',
    })
  }

  // 5. Pas d'échéance connue : c'est une information à aller chercher.
  if (controles && controles.length === 0) {
    gestes.push({
      id: 'declarer-controle',
      texte:
        'Aucun contrôle déclaré : demandez-lui les prochaines dates, il les saisit dans Réviser et l’app prépare les sessions.',
      conseilId: 'preparer-un-controle',
    })
  }

  // 6. Le filet : toujours au moins un geste.
  if (gestes.length === 0) {
    gestes.push({
      id: 'laisser-chercher',
      texte:
        'Quand un exercice bloque, trois questions valent mieux qu’une explication : « qu’est-ce que tu as déjà essayé ? » d’abord.',
      conseilId: 'sans-faire-a-sa-place',
    })
  }

  return gestes.slice(0, MAX_GESTES)
}

function joursAvant(c: ControleView, today: string): number {
  const a = Date.parse(`${today}T00:00:00Z`)
  const b = Date.parse(`${c.date}T00:00:00Z`)
  if (Number.isNaN(a) || Number.isNaN(b)) return 99
  return Math.round((b - a) / 86_400_000)
}
