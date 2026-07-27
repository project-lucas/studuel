// -----------------------------------------------------------------------------
// « Rétention » — la seule page de l'app qui dise si le produit marche.
//
// Directive n°1 : aucune décision de contenu ne se prend sans D1/D7/D30 sous les
// yeux. Tant que ces chiffres ne sont pas affichés, on construit à l'aveugle et
// chaque nouveau système est un pari.
//
// Bonne nouvelle : rien à instrumenter. Les tables d'activité (challenge_sessions,
// test_sessions, study_sessions, lesson_completions) SONT déjà le journal
// d'événements, et profiles.created_at donne la cohorte. La rétention se calcule
// donc RÉTROACTIVEMENT, sur tout l'historique, dès la première exécution.
//
// Définition retenue : rétention « jour N » = l'élève est actif LE jour N après
// son inscription (et non « au moins une fois depuis »). C'est la définition
// standard du jeu mobile, celle à laquelle correspondent les barres ci-dessous.
//
// Pur et testable (convention projet) ; la migration 206 ne fait que compter.
// -----------------------------------------------------------------------------

export type Horizon = 'd1' | 'd7' | 'd30'

export const HORIZONS: readonly Horizon[] = ['d1', 'd7', 'd30']

export const HORIZON_LABEL: Record<Horizon, string> = {
  d1: 'J+1',
  d7: 'J+7',
  d30: 'J+30',
}

export const HORIZON_DAYS: Record<Horizon, number> = { d1: 1, d7: 7, d30: 30 }

/**
 * Les barres de décision. En dessous de `alerte`, le produit a un problème
 * structurel qu'aucune feature ne réglera ; au-dessus de `bon`, on peut
 * investir. Ces seuils sont ceux du jeu mobile grand public — volontairement
 * exigeants : c'est à eux qu'on se compare, pas à la moyenne de l'edtech.
 */
export const BARS: Record<Horizon, { alerte: number; bon: number }> = {
  d1: { alerte: 0.35, bon: 0.5 },
  d7: { alerte: 0.15, bon: 0.25 },
  d30: { alerte: 0.06, bon: 0.12 },
}

export type Verdict = 'alerte' | 'correct' | 'bon' | 'inconnu'

export const VERDICT_LABEL: Record<Verdict, string> = {
  alerte: 'Sous la barre',
  correct: 'Correct',
  bon: 'Au-dessus de la barre',
  inconnu: 'Pas assez de données',
}

/** Taux de rétention, ou null si la cohorte est vide (0/0 n'est pas 0 %). */
export function rate(retained: number, size: number): number | null {
  if (!Number.isFinite(retained) || !Number.isFinite(size) || size <= 0) return null
  return Math.max(0, Math.min(1, retained / size))
}

/** Effectif minimal pour qu'un taux veuille dire quelque chose. En dessous, on
 *  affiche le chiffre mais on refuse de le juger — 1 élève sur 2 n'est pas
 *  « 50 % de rétention ». */
export const MIN_COHORT = 20

export function verdictFor(
  horizon: Horizon,
  value: number | null,
  size: number,
): Verdict {
  if (value === null || size < MIN_COHORT) return 'inconnu'
  const bar = BARS[horizon]
  if (value < bar.alerte) return 'alerte'
  if (value >= bar.bon) return 'bon'
  return 'correct'
}

export function percent(value: number | null): string {
  if (value === null) return '—'
  return `${Math.round(value * 100)} %`
}

// --- Cohortes -------------------------------------------------------------------

/** Une journée d'inscriptions et ce qu'elle est devenue. */
export type Cohort = {
  day: string // clé UTC 'YYYY-MM-DD' du jour d'inscription
  size: number
  retained: Record<Horizon, number>
  /** Un horizon n'est MESURABLE que si le jour N est déjà passé. Une cohorte
   *  d'hier ne peut pas avoir de J+7 : afficher 0 % serait un mensonge. */
  measurable: Record<Horizon, boolean>
}

export type CohortView = Cohort & {
  rates: Record<Horizon, number | null>
  verdicts: Record<Horizon, Verdict>
}

export function cohortView(cohort: Cohort): CohortView {
  const rates = {} as Record<Horizon, number | null>
  const verdicts = {} as Record<Horizon, Verdict>
  for (const h of HORIZONS) {
    rates[h] = cohort.measurable[h] ? rate(cohort.retained[h], cohort.size) : null
    verdicts[h] = cohort.measurable[h]
      ? verdictFor(h, rates[h], cohort.size)
      : 'inconnu'
  }
  return { ...cohort, rates, verdicts }
}

/**
 * Le taux agrégé d'un horizon : somme des retenus / somme des inscrits, sur les
 * seules cohortes MESURABLES. Moyenner les taux par cohorte donnerait le même
 * poids à une journée de 3 inscrits qu'à une journée de 300.
 */
export function aggregate(
  cohorts: readonly Cohort[],
  horizon: Horizon,
): { rate: number | null; size: number; retained: number; verdict: Verdict } {
  let size = 0
  let retained = 0
  for (const c of cohorts) {
    if (!c.measurable[horizon]) continue
    size += Math.max(0, c.size)
    retained += Math.max(0, c.retained[horizon])
  }
  const value = rate(retained, size)
  return { rate: value, size, retained, verdict: verdictFor(horizon, value, size) }
}

// --- Entonnoir d'arrivée ----------------------------------------------------------
// Là où on perd les gens avant même de pouvoir parler de rétention. Chaque
// marche est un pourcentage de la PRÉCÉDENTE : c'est la chute entre deux
// marches qui désigne l'écran à refaire, pas le total.

export type FunnelStep = {
  id: string
  label: string
  count: number
}

export type FunnelView = FunnelStep & {
  /** Part de l'étape précédente (1 pour la première). */
  ofPrevious: number | null
  /** Part du tout premier palier — la vue d'ensemble. */
  ofTotal: number | null
  /** Combien on perd À CETTE MARCHE. */
  lost: number
}

export function funnelView(steps: readonly FunnelStep[]): FunnelView[] {
  const total = steps[0]?.count ?? 0
  return steps.map((s, i) => {
    const prev = i === 0 ? s.count : steps[i - 1].count
    return {
      ...s,
      ofPrevious: i === 0 ? 1 : prev > 0 ? s.count / prev : null,
      ofTotal: total > 0 ? s.count / total : null,
      lost: Math.max(0, prev - s.count),
    }
  })
}

/** La marche qui saigne le plus — celle à refaire en premier. Null si
 *  l'entonnoir est vide ou parfait. */
export function worstStep(steps: readonly FunnelView[]): FunnelView | null {
  const candidates = steps.slice(1).filter((s) => s.lost > 0)
  if (candidates.length === 0) return null
  return candidates.reduce((worst, s) => (s.lost > worst.lost ? s : worst))
}

// --- Activité ---------------------------------------------------------------------

export type DailyActivity = {
  day: string
  activeUsers: number
  sessions: number
}

/** Sessions par élève actif — l'autre moitié de l'histoire. Une rétention
 *  correcte avec 1,0 session/jour décrit une corvée ; le seuil du jeu est 2,5. */
export const SESSIONS_TARGET = 2.5

export function sessionsPerUser(a: DailyActivity): number | null {
  if (a.activeUsers <= 0) return null
  return a.sessions / a.activeUsers
}

/** Moyenne des N derniers jours (les jours sans aucun actif sont ignorés :
 *  ils tirent la moyenne vers zéro sans rien dire de l'engagement). */
export function averageSessionsPerUser(
  activity: readonly DailyActivity[],
): number | null {
  const days = activity.filter((a) => a.activeUsers > 0)
  if (days.length === 0) return null
  const total = days.reduce((s, a) => s + a.sessions, 0)
  const users = days.reduce((s, a) => s + a.activeUsers, 0)
  return users > 0 ? total / users : null
}

// --- Le verdict d'ensemble ----------------------------------------------------------

export type Dashboard = {
  cohorts: Cohort[]
  funnel: FunnelStep[]
  activity: DailyActivity[]
  /** Nombre total de comptes (contexte : 12 % de D30 sur 40 élèves ≠ sur 4000). */
  totalUsers: number
}

/**
 * La phrase à lire en premier. Elle nomme le problème le plus grave OU autorise
 * à construire — c'est la seule sortie de ce module qui doit tenir en un
 * coup d'œil.
 */
export function headline(d: Dashboard): string {
  const d1 = aggregate(d.cohorts, 'd1')
  const d7 = aggregate(d.cohorts, 'd7')
  const d30 = aggregate(d.cohorts, 'd30')

  if (d1.size < MIN_COHORT) {
    return `Trop peu d’inscrits mesurables (${d1.size}) pour conclure. Reviens à ${MIN_COHORT}.`
  }
  if (d1.verdict === 'alerte') {
    return `J+1 à ${percent(d1.rate)} : le problème est le PREMIER jour, pas le contenu. Refaire l’arrivée avant tout le reste.`
  }
  if (d7.verdict === 'alerte') {
    return `J+1 tient (${percent(d1.rate)}) mais J+7 tombe à ${percent(d7.rate)} : il manque une raison de revenir. Le rendez-vous quotidien est le chantier.`
  }
  if (d30.verdict === 'alerte' && d30.size >= MIN_COHORT) {
    return `J+7 tient (${percent(d7.rate)}) mais J+30 s’effondre à ${percent(d30.rate)} : il manque le lien social. Le clan est le chantier.`
  }
  // Arrivé ici, d7 n'est ni 'alerte' (traité plus haut) : il reste à exiger
  // qu'il soit mesuré, et que J+1 soit franchement au-dessus de la barre.
  if (d1.verdict === 'bon' && d7.verdict !== 'inconnu') {
    return `J+1 ${percent(d1.rate)} · J+7 ${percent(d7.rate)} · J+30 ${percent(d30.rate)} — les barres sont tenues. On peut investir.`
  }
  return `J+1 ${percent(d1.rate)} · J+7 ${percent(d7.rate)} · J+30 ${percent(d30.rate)} — au-dessus de l’alerte, sous la cible.`
}

// --- Normalisation de la réponse SQL --------------------------------------------

const str = (v: unknown): string => (typeof v === 'string' ? v : '')
const int = (v: unknown): number => {
  const n = Number(v)
  return Number.isFinite(n) ? Math.max(0, Math.round(n)) : 0
}
const bool = (v: unknown): boolean => v === true

function normalizeCohort(raw: unknown): Cohort | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  const day = str(o.day)
  if (day.length === 0) return null
  return {
    day,
    size: int(o.size),
    retained: { d1: int(o.d1), d7: int(o.d7), d30: int(o.d30) },
    measurable: {
      d1: bool(o.d1_measurable),
      d7: bool(o.d7_measurable),
      d30: bool(o.d30_measurable),
    },
  }
}

/** Normalise le JSONB de `retention_dashboard`. Robuste au vide : un tableau de
 *  bord sans données s'affiche « pas encore de données », il ne plante pas. */
export function normalizeDashboard(raw: unknown): Dashboard {
  const o = (raw ?? {}) as Record<string, unknown>
  return {
    totalUsers: int(o.total_users),
    cohorts: Array.isArray(o.cohorts)
      ? o.cohorts
          .map(normalizeCohort)
          .filter((c): c is Cohort => c !== null)
          .sort((a, b) => b.day.localeCompare(a.day))
      : [],
    funnel: Array.isArray(o.funnel)
      ? o.funnel.flatMap((s) => {
          if (!s || typeof s !== 'object') return []
          const r = s as Record<string, unknown>
          const id = str(r.id)
          if (id.length === 0) return []
          return [{ id, label: str(r.label) || id, count: int(r.count) }]
        })
      : [],
    activity: Array.isArray(o.activity)
      ? o.activity
          .flatMap((a) => {
            if (!a || typeof a !== 'object') return []
            const r = a as Record<string, unknown>
            const day = str(r.day)
            if (day.length === 0) return []
            return [
              {
                day,
                activeUsers: int(r.active_users),
                sessions: int(r.sessions),
              },
            ]
          })
          .sort((a, b) => a.day.localeCompare(b.day))
      : [],
  }
}
