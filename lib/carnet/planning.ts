// -----------------------------------------------------------------------------
// LE PLANNING DU CARNET — une révision par dossier, à des jours choisis.
//
// Le moteur (planification.ts) décide de l'ÉCHÉANCE de chaque carte ; la
// feuille d'options (session-options.ts) décide du CONTENU d'une session ; ce
// module décide du QUAND : « le dossier Verbes irréguliers, lundi et jeudi à
// 18 h, 20 cartes, en entraînement ». Un plan par dossier (le cours entier ou
// un chapitre), des jours de la semaine, une heure facultative.
//
// Le « fait / pas fait » n'est jamais stocké : il se DÉDUIT des sessions
// jouées (course_id + chapter_id + jour). C'est la seule preuve honnête.
//
// Conventions de l'app : jours 0 = lundi … 6 = dimanche (habits.target),
// clés de jour UTC `YYYY-MM-DD`, heure de l'élève en texte « HH:MM ».
// -----------------------------------------------------------------------------
import { LONGUEURS, MODES, MODE_LABEL, type Mode } from '@/lib/carnet/session-options'

export const JOURS_COURTS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'] as const
export const JOURS_LONGS = [
  'lundi',
  'mardi',
  'mercredi',
  'jeudi',
  'vendredi',
  'samedi',
  'dimanche',
] as const

export type Plan = {
  id: string
  courseId: string
  /** null = le cours entier. */
  chapterId: string | null
  /** Jours de la semaine, 0 = lundi … 6 = dimanche, triés, sans doublon. */
  days: number[]
  /** « HH:MM » ou null. */
  time: string | null
  /** 10, 20, 40 ou null = tout ce qui est dû. */
  longueur: number | null
  mode: Mode
}

/** Ce qu'un plan sait de son dossier, pour s'afficher. */
export type PlanAffiche = Plan & {
  courseTitle: string
  courseIcon: string | null
  courseColor: string | null
  /** Le titre du chapitre, ou null pour le cours entier. */
  chapterTitle: string | null
}

const HEURE = /^([01]\d|2[0-3]):[0-5]\d$/

export function isHeure(value: unknown): value is string {
  return typeof value === 'string' && HEURE.test(value)
}

/** Des jours propres : entiers 0..6, dédoublonnés, triés. */
export function normalizeDays(raw: unknown): number[] {
  if (!Array.isArray(raw)) return []
  const set = new Set<number>()
  for (const d of raw) {
    const n = Number(d)
    if (Number.isInteger(n) && n >= 0 && n <= 6) set.add(n)
  }
  return [...set].sort((a, b) => a - b)
}

export function normalizeLongueur(raw: unknown): number | null {
  if (raw === null || raw === undefined || raw === '') return null
  const n = Number(raw)
  return (LONGUEURS as readonly (number | null)[]).includes(n) ? n : null
}

export function normalizeMode(raw: unknown): Mode {
  return (MODES as readonly string[]).includes(String(raw)) ? (raw as Mode) : 'apprentissage'
}

/**
 * Normalise une ligne de `carnet_plans`. Null si la ligne est inutilisable
 * (pas d'id, pas de cours, aucun jour) — on n'affiche pas un plan cassé.
 */
export function normalizePlan(raw: unknown): Plan | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>
  const id = typeof r.id === 'string' ? r.id : null
  const courseId = typeof r.course_id === 'string' ? r.course_id : null
  const days = normalizeDays(r.days)
  if (!id || !courseId || days.length === 0) return null
  return {
    id,
    courseId,
    chapterId: typeof r.chapter_id === 'string' && r.chapter_id ? r.chapter_id : null,
    days,
    time: isHeure(r.at_time) ? r.at_time : null,
    longueur: normalizeLongueur(r.length),
    mode: normalizeMode(r.mode),
  }
}

/** L'URL de la session que le plan décrit — celle que le ▶ ouvre. */
export function hrefDuPlan(plan: Plan): string {
  const p = new URLSearchParams()
  if (plan.chapterId) p.set('chapitre', plan.chapterId)
  if (plan.longueur !== null) p.set('long', String(plan.longueur))
  if (plan.mode !== 'apprentissage') p.set('mode', plan.mode)
  const q = p.toString()
  return `/carnet/cours/${plan.courseId}/reviser${q ? `?${q}` : ''}`
}

/** « Lun · Mer · Ven à 18:00 », « Tous les jours à 07:30 », « Le dimanche ». */
export function libelleJours(plan: Pick<Plan, 'days' | 'time'>): string {
  const jours =
    plan.days.length === 7
      ? 'Tous les jours'
      : plan.days.length === 1
        ? `Le ${JOURS_LONGS[plan.days[0]]}`
        : plan.days.map((d) => JOURS_COURTS[d]).join(' · ')
  return plan.time ? `${jours} à ${plan.time}` : jours
}

/** « 20 cartes · entraînement », « Tout ce qui est dû ». */
export function libelleSession(plan: Pick<Plan, 'longueur' | 'mode'>): string {
  const longueur = plan.longueur === null ? 'Tout ce qui est dû' : `${plan.longueur} cartes`
  return plan.mode === 'apprentissage' ? longueur : `${longueur} · ${MODE_LABEL[plan.mode].toLowerCase()}`
}

// ------------------------------------------------------------- la semaine

/** Le lundi (clé UTC) de la semaine d'une clé de jour. */
export function lundiDe(dayKey: string): string {
  const d = new Date(`${dayKey}T12:00:00Z`)
  const index = (d.getUTCDay() + 6) % 7
  d.setUTCDate(d.getUTCDate() - index)
  return d.toISOString().slice(0, 10)
}

/** Les 7 clés de jour de la semaine, lundi en tête. */
export function joursDeLaSemaine(lundi: string): string[] {
  const d = new Date(`${lundi}T12:00:00Z`)
  return Array.from({ length: 7 }, (_, i) => {
    const j = new Date(d)
    j.setUTCDate(d.getUTCDate() + i)
    return j.toISOString().slice(0, 10)
  })
}

/** Une session jouée : ce qu'il faut pour savoir si un plan a été tenu. */
export type SessionJouee = {
  courseId: string | null
  chapterId: string | null
  /** Clé de jour UTC de `started_at`. */
  dayKey: string
}

/** Un plan posé sur un jour, et son état. */
export type CreneauSemaine = {
  plan: PlanAffiche
  /** La session correspondante a été jouée ce jour-là. */
  fait: boolean
}

export type JourSemaine = {
  dayKey: string
  /** 0 = lundi … 6 = dimanche. */
  index: number
  aujourdhui: boolean
  passe: boolean
  creneaux: CreneauSemaine[]
}

/**
 * Un plan a-t-il été tenu ce jour ? Une session du MÊME cours, sur le même
 * dossier (ou sur le cours entier, qui couvre tous ses dossiers), ce jour-là.
 * Une session sur un sous-dossier ne compte pas : le plan disait « tout le
 * dossier », on n'a fait qu'une partie.
 */
export function planTenu(plan: Plan, sessions: readonly SessionJouee[], dayKey: string): boolean {
  return sessions.some(
    (s) =>
      s.dayKey === dayKey &&
      s.courseId === plan.courseId &&
      (s.chapterId === null || s.chapterId === plan.chapterId),
  )
}

/**
 * LA SEMAINE : sept jours, les plans posés sur chacun (triés par heure, les
 * sans-heure en dernier), tenus ou non. `today` est une clé de jour UTC.
 */
export function semaineDuPlanning(
  plans: readonly PlanAffiche[],
  sessions: readonly SessionJouee[],
  today: string,
): JourSemaine[] {
  const lundi = lundiDe(today)
  return joursDeLaSemaine(lundi).map((dayKey, index) => {
    const creneaux = plans
      .filter((p) => p.days.includes(index))
      .sort((a, b) => {
        if (a.time === b.time) return a.courseTitle.localeCompare(b.courseTitle, 'fr')
        if (a.time === null) return 1
        if (b.time === null) return -1
        return a.time.localeCompare(b.time)
      })
      .map((plan) => ({ plan, fait: planTenu(plan, sessions, dayKey) }))
    return { dayKey, index, aujourdhui: dayKey === today, passe: dayKey < today, creneaux }
  })
}

export type BilanSemaine = {
  /** Créneaux prévus sur la semaine. */
  prevus: number
  /** Créneaux tenus (passés ou aujourd'hui). */
  tenus: number
  /** Créneaux manqués (passés, non tenus). */
  manques: number
  /** Ce qu'il reste à faire aujourd'hui. */
  restantAujourdhui: number
}

export function bilanSemaine(jours: readonly JourSemaine[]): BilanSemaine {
  let prevus = 0
  let tenus = 0
  let manques = 0
  let restantAujourdhui = 0
  for (const j of jours) {
    for (const c of j.creneaux) {
      prevus += 1
      if (c.fait) tenus += 1
      else if (j.passe) manques += 1
      else if (j.aujourdhui) restantAujourdhui += 1
    }
  }
  return { prevus, tenus, manques, restantAujourdhui }
}

/** La phrase sous le titre du bloc « Ma semaine ». */
export function phraseSemaine(b: BilanSemaine): string {
  if (b.prevus === 0) return 'Choisis un dossier, des jours, une heure — et la semaine se remplit.'
  if (b.restantAujourdhui > 0) {
    return b.restantAujourdhui === 1
      ? 'Une révision t’attend aujourd’hui.'
      : `${b.restantAujourdhui} révisions t’attendent aujourd’hui.`
  }
  if (b.tenus === b.prevus) return 'Tout est fait cette semaine. Rien ne t’arrête.'
  if (b.manques > 0) {
    return `${b.tenus} tenue${b.tenus > 1 ? 's' : ''} sur ${b.prevus} — ${b.manques} manquée${b.manques > 1 ? 's' : ''}, la suite reste à prendre.`
  }
  return `${b.tenus} tenue${b.tenus > 1 ? 's' : ''} sur ${b.prevus}, le reste vient.`
}

// ------------------------------------------- le planning proposé avant un contrôle

/** Un dossier candidat à la proposition : un chapitre, avec ses cartes. */
export type DossierCandidat = {
  chapterId: string | null
  titre: string
  cartes: number
}

export type PlanPropose = {
  chapterId: string | null
  titre: string
  days: number[]
}

/**
 * LE PLANNING À REBOURS depuis la date du contrôle (audit du carnet, point
 * 16). On répartit les dossiers sur les jours qui restent : chaque dossier
 * reçoit au moins un jour par semaine, les plus gros dossiers d'abord, en
 * tournant sur les jours ; la veille du contrôle, tout le cours (révision
 * générale). Rien à proposer si le contrôle est passé ou si aucun dossier
 * n'a de cartes.
 */
export function proposerAvantControle(
  examOn: string,
  today: string,
  dossiers: readonly DossierCandidat[],
): PlanPropose[] {
  const restants = Math.round(
    (Date.parse(`${examOn}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86_400_000,
  )
  if (!Number.isFinite(restants) || restants < 1) return []
  const avecCartes = dossiers.filter((d) => d.cartes > 0).sort((a, b) => b.cartes - a.cartes)
  if (avecCartes.length === 0) return []

  // Les jours disponibles, en partant de demain, jusqu'à la veille — au plus
  // une semaine (un plan est hebdomadaire ; au-delà, il se répète).
  const debut = (new Date(`${today}T12:00:00Z`).getUTCDay() + 6) % 7
  const nbJours = Math.min(7, Math.max(1, restants - 1))
  const jours = Array.from({ length: nbJours }, (_, i) => (debut + 1 + i) % 7)
  const veille = (debut + restants - 1 + 7) % 7

  // Tour de rôle : le dossier k prend le jour k, puis k + n, etc. — un dossier
  // par jour quand il y a plus de jours que de dossiers, plusieurs dossiers
  // par jour sinon.
  const plans: PlanPropose[] = avecCartes.map((d) => ({
    chapterId: d.chapterId,
    titre: d.titre,
    days: [] as number[],
  }))
  jours.forEach((jour, i) => {
    if (restants > 1 && jour === veille && nbJours > 1) return
    plans[i % plans.length].days.push(jour)
  })
  for (const p of plans) {
    if (p.days.length === 0) p.days.push(jours[0])
    p.days = normalizeDays(p.days)
  }
  // La veille : révision générale du cours entier.
  if (restants > 1) {
    plans.push({ chapterId: null, titre: 'Révision générale', days: [veille] })
  }
  return plans
}
