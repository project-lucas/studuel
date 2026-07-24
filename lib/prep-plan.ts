// -----------------------------------------------------------------------------
// « Plan de préparation » — le cœur PUR (aucun accès base, aucune dépendance
// composant) du contrôle-objet-unique et de son plan de révision réparti sur
// les jours restants. Convention projet : toute la logique métier vit ici, avec
// son test à côté ; les tables (supabase/203) et l'UI ne font qu'orchestrer.
//
// Un Controle = 1 matière + N chapitres + 1 date + 1 plan. Une SessionPreparation
// = un jour planifié + une durée + un chapitre + un statut. Toutes les vues
// (confirmation, « Ta semaine », carte de préparation) lisent CES entités —
// aucune donnée dupliquée.
//
// Dates = clés UTC 'YYYY-MM-DD' (convention projet, cf. lib/time & lib/streak).
// -----------------------------------------------------------------------------

// Durée d'une session = objectif quotidien de l'élève. Défaut 10 min (brief).
export const DEFAULT_GOAL_MINUTES = 10

export type PrepStatus = 'a_faire' | 'faite' | 'manquee'

export type PrepChapter = { id: string; title: string }

// Une session telle que STOCKÉE (id présent) ou telle que DESSINÉE avant
// création (brouillon, sans id). Le champ `status` n'existe que sur la stockée.
export type SessionDraft = {
  plannedDate: string // 'YYYY-MM-DD'
  durationMin: number
  chapterId: string
  position: number
}

export type PrepSession = SessionDraft & {
  id: string
  controleId: string
  status: PrepStatus
}

export type Controle = {
  id: string
  subject: string // slug de matière
  chapters: PrepChapter[] // au moins 1
  date: string | null // date du contrôle (null = sans date)
  grade: string
  note: number | null // note obtenue /20 (post-contrôle), null tant que non saisie
  notePrompted: boolean // a-t-on déjà demandé la note ? (une seule relance)
  snoozeDate: string | null // jour où la carte a été repliée (« ce soir »)
  sessions: PrepSession[]
}

// --- Arithmétique de dates (clés UTC) ----------------------------------------

// Différence en jours entre deux clés UTC 'YYYY-MM-DD' (from → to).
export function daysBetween(from: string, to: string): number {
  const a = Date.parse(`${from}T00:00:00Z`)
  const b = Date.parse(`${to}T00:00:00Z`)
  if (Number.isNaN(a) || Number.isNaN(b)) return 0
  return Math.round((b - a) / 86_400_000)
}

// Ajoute n jours (n négatif = recule) à une clé UTC, renvoie une clé UTC.
export function addDays(day: string, n: number): string {
  const t = Date.parse(`${day}T00:00:00Z`)
  if (Number.isNaN(t)) return day
  return new Date(t + n * 86_400_000).toISOString().slice(0, 10)
}

// --- Génération du plan -------------------------------------------------------

// Nombre de sessions selon les jours restants (répétition espacée, brief §2) :
//   J-5 ou plus → 3 · J-2 à J-4 → 2 · J-1 ou jour J (ou sans date) → 1.
export function planSessionCount(examDate: string | null, today: string): 1 | 2 | 3 {
  if (examDate === null) return 1
  const d = daysBetween(today, examDate)
  if (d >= 5) return 3
  if (d >= 2) return 2
  return 1
}

// Offsets (jours AVANT le contrôle) des sessions, du plus tôt au plus tard.
// 3 → J-4, J-2, J-1 (exemple du brief) · 2 → J-2, J-1 · 1 → jour immédiat.
function offsetsFor(count: 1 | 2 | 3): number[] {
  if (count === 3) return [4, 2, 1]
  if (count === 2) return [2, 1]
  return [0]
}

// Les jours planifiés du plan (clés UTC), du plus tôt au plus tard, chacun borné
// à « pas avant aujourd'hui » et « pas après la veille du contrôle », dédoublonné.
// Sans date → une seule session aujourd'hui (on prépare quand même).
export function planDates(examDate: string | null, today: string): string[] {
  const count = planSessionCount(examDate, today)
  if (examDate === null) return [today]

  // Contrôle déjà passé (cas limite) : une session aujourd'hui, faute de mieux.
  if (daysBetween(today, examDate) < 0) return [today]

  // 1 session (J-1 ou jour J) : immédiate, aujourd'hui.
  if (count === 1) return [today]

  const seen = new Set<string>()
  const dates: string[] = []
  for (const off of offsetsFor(count)) {
    // Jamais avant aujourd'hui : une session ne se planifie pas dans le passé.
    const raw = addDays(examDate, -off)
    const clamped = daysBetween(today, raw) < 0 ? today : raw
    if (!seen.has(clamped)) {
      seen.add(clamped)
      dates.push(clamped)
    }
  }
  return dates.sort()
}

// Brouillons de sessions pour un contrôle : un jour planifié × la rotation des
// chapitres (session i → chapitre i modulo N). Durée = objectif quotidien.
export function buildSessionDrafts(
  chapters: PrepChapter[],
  examDate: string | null,
  today: string,
  goalMinutes: number = DEFAULT_GOAL_MINUTES,
): SessionDraft[] {
  const chaps = chapters.length > 0 ? chapters : [{ id: '', title: '' }]
  const duration = goalMinutes > 0 ? Math.round(goalMinutes) : DEFAULT_GOAL_MINUTES
  return planDates(examDate, today).map((plannedDate, i) => ({
    plannedDate,
    durationMin: duration,
    chapterId: chaps[i % chaps.length].id,
    position: i,
  }))
}

// --- Libellés lisibles --------------------------------------------------------

const WEEKDAYS = [
  'dimanche',
  'lundi',
  'mardi',
  'mercredi',
  'jeudi',
  'vendredi',
  'samedi',
]

// Jour de la semaine en français d'une clé UTC ('vendredi'…).
export function weekdayLabel(day: string): string {
  const t = Date.parse(`${day}T00:00:00Z`)
  if (Number.isNaN(t)) return ''
  return WEEKDAYS[new Date(t).getUTCDay()]
}

// Compte à rebours court pour la ligne de semaine : « J-3 », « J-0 » (jour J),
// ou null sans date.
export function countdownTag(examDate: string | null, today: string): string | null {
  if (examDate === null) return null
  const d = daysBetween(today, examDate)
  if (d < 0) return 'passé'
  return `J-${d}`
}

// Résumé du plan pour l'écran de confirmation (brief §3) :
// « Contrôle vendredi → 3 sessions de 10 min : mardi, jeudi, vendredi ».
export function planSummary(
  examDate: string | null,
  drafts: SessionDraft[],
): string {
  const n = drafts.length
  const dur = drafts[0]?.durationMin ?? DEFAULT_GOAL_MINUTES
  const days = drafts.map((d) => weekdayLabel(d.plannedDate)).join(', ')
  const plural = n > 1 ? 'sessions' : 'session'
  const head = examDate ? `Contrôle ${weekdayLabel(examDate)}` : 'Sans date'
  return `${head} → ${n} ${plural} de ${dur} min : ${days}`
}

// --- Vue dérivée du plan (réconciliation d'affichage) -------------------------

// Ce que l'UI lit pour un contrôle : progression + la session à lancer
// maintenant. Une session « à faire » dont le jour est passé compte comme
// MANQUÉE et est REPLANIFIÉE d'office sur aujourd'hui (le prochain jour
// disponible) tant que le contrôle n'est pas passé — sans rien réécrire en base,
// la vue pointe toujours l'élève vers un jour faisable.
export type PlanView = {
  total: number // nombre de sessions du plan
  done: number // sessions faites
  missed: number // sessions manquées (jour passé, non faites)
  progressLabel: string // « 1/3 »
  todaySession: PrepSession | null // la session à lancer maintenant (ou null)
  nextDate: string | null // jour de la prochaine session à faire
  isComplete: boolean // plan terminé (tout fait, ou contrôle passé)
}

// Statut EFFECTIF d'une session à la date du jour (le stocké, sauf « à faire »
// en retard → manquée).
export function effectiveStatus(
  session: Pick<PrepSession, 'status' | 'plannedDate'>,
  today: string,
): PrepStatus {
  if (session.status === 'a_faire' && session.plannedDate < today) return 'manquee'
  return session.status
}

export function derivePlanView(controle: Controle, today: string): PlanView {
  const sessions = [...controle.sessions].sort(
    (a, b) =>
      a.plannedDate.localeCompare(b.plannedDate) || a.position - b.position,
  )
  const total = sessions.length
  const done = sessions.filter((s) => s.status === 'faite').length
  const missed = sessions.filter((s) => effectiveStatus(s, today) === 'manquee')
    .length

  // La session à lancer maintenant : d'abord une session en retard (replanifiée
  // sur aujourd'hui), sinon celle du jour, sinon la prochaine à venir (on
  // autorise l'élève à prendre de l'avance).
  const pending = sessions.filter((s) => s.status === 'a_faire')
  const overdue = pending.filter((s) => s.plannedDate < today)
  const dueToday = pending.filter((s) => s.plannedDate === today)
  const upcoming = pending.filter((s) => s.plannedDate > today)
  const todaySession = overdue[0] ?? dueToday[0] ?? upcoming[0] ?? null

  // La prochaine échéance affichée : aujourd'hui si en retard/du jour, sinon le
  // jour planifié de la prochaine session à venir.
  const nextDate = todaySession
    ? todaySession.plannedDate < today
      ? today
      : todaySession.plannedDate
    : null

  const examPassed = controle.date !== null && daysBetween(controle.date, today) > 0
  const isComplete = total > 0 ? done >= total || examPassed : examPassed

  return {
    total,
    done,
    missed,
    progressLabel: `${done}/${total}`,
    todaySession,
    nextDate,
    isComplete,
  }
}

// --- Carte de préparation : visibilité (repli « ce soir », brief §5) ----------

// La carte reste visible tant que le plan n'est pas terminé, SAUF si l'élève l'a
// repliée aujourd'hui (« me le rappeler ce soir ») : elle réapparaît le
// lendemain (ou plus jamais une fois le plan terminé). Le X ne supprime jamais.
export function isCardVisible(
  controle: Controle,
  view: PlanView,
  today: string,
): boolean {
  if (view.isComplete) return false
  if (controle.snoozeDate === today) return false
  return true
}

// --- Boucle post-contrôle (brief §6) ------------------------------------------

// Faut-il demander la note ? Le LENDEMAIN de la date (ou après), si aucune note
// n'a encore été saisie et qu'on n'a pas déjà relancé (une seule relance).
export function isNoteDue(controle: Controle, today: string): boolean {
  if (controle.date === null) return false
  if (controle.note !== null) return false
  if (controle.notePrompted) return false
  return daysBetween(controle.date, today) >= 1
}

// Récap post-contrôle : « 3 sessions de préparation → note 14/20 ». Null tant
// qu'aucune note n'est saisie.
export function noteRecap(controle: Controle): string | null {
  if (controle.note === null) return null
  const done = controle.sessions.filter((s) => s.status === 'faite').length
  const plural = done > 1 ? 'sessions' : 'session'
  return `${done} ${plural} de préparation → note ${controle.note}/20`
}

// --- Identité partagée entre la ligne « Ta semaine » et la carte de prépa -----

// Intitulé du contrôle, IDENTIQUE partout (ligne de semaine, carte) pour que
// l'élève comprenne que c'est le même objet : le titre du chapitre s'il n'y en a
// qu'un, sinon le nom de la matière.
export function controleTitle(controle: Controle, subjectName: string): string {
  if (controle.chapters.length === 1) return controle.chapters[0].title
  return subjectName
}

// Le chapitre à ouvrir pour « lancer la session du jour » : celui de la session
// à faire maintenant, à défaut le premier chapitre du contrôle.
export function launchChapterId(view: PlanView, controle: Controle): string {
  return view.todaySession?.chapterId ?? controle.chapters[0]?.id ?? ''
}

// Le contrôle actif (plan non terminé) le plus proche, ou null. Les sans-date
// passent en dernier — même tri que la liste des contrôles.
export function nearestActiveControle(
  controles: readonly Controle[],
  today: string,
): Controle | null {
  const active = controles.filter((c) => !derivePlanView(c, today).isComplete)
  if (active.length === 0) return null
  return [...active].sort((a, b) => {
    if (a.date === b.date) return 0
    if (a.date === null) return 1
    if (b.date === null) return -1
    return a.date < b.date ? -1 : 1
  })[0]
}

// --- Mapping lignes Supabase → entités (pur, pas de couplage au client) -------

// Forme brute des lignes lues (le client Supabase n'est pas typé).
export type ControleRow = {
  id: string
  subject_slug: string
  chapters: unknown
  exam_date: string | null
  grade: string | null
  note: number | null
  note_prompted: boolean | null
  snooze_date: string | null
}

export type SessionRow = {
  id: string
  controle_id: string
  planned_date: string
  duration_min: number | null
  chapter_id: string | null
  status: string | null
  position: number | null
}

const isStatus = (v: unknown): v is PrepStatus =>
  v === 'a_faire' || v === 'faite' || v === 'manquee'

function normalizeChapters(raw: unknown): PrepChapter[] {
  if (!Array.isArray(raw)) return []
  const out: PrepChapter[] = []
  for (const c of raw) {
    if (!c || typeof c !== 'object') continue
    const o = c as Record<string, unknown>
    if (typeof o.id === 'string' && typeof o.title === 'string') {
      out.push({ id: o.id, title: o.title })
    }
  }
  return out
}

// Assemble les contrôles + leurs sessions en entités Controle prêtes à lire.
// Les lignes invalides sont ignorées ; les sessions sont rattachées par
// controle_id. Un contrôle sans chapitre valide est écarté (invariant côté base,
// mais on se protège d'une donnée corrompue).
export function rowsToControles(
  controleRows: readonly ControleRow[],
  sessionRows: readonly SessionRow[],
): Controle[] {
  const sessionsByControle = new Map<string, PrepSession[]>()
  for (const r of sessionRows) {
    const list = sessionsByControle.get(r.controle_id) ?? []
    list.push({
      id: r.id,
      controleId: r.controle_id,
      plannedDate: r.planned_date,
      durationMin: r.duration_min ?? DEFAULT_GOAL_MINUTES,
      chapterId: r.chapter_id ?? '',
      status: isStatus(r.status) ? r.status : 'a_faire',
      position: r.position ?? 0,
    })
    sessionsByControle.set(r.controle_id, list)
  }

  const out: Controle[] = []
  for (const r of controleRows) {
    const chapters = normalizeChapters(r.chapters)
    if (chapters.length === 0) continue
    out.push({
      id: r.id,
      subject: r.subject_slug,
      chapters,
      date: r.exam_date,
      grade: r.grade ?? '',
      note: typeof r.note === 'number' ? r.note : null,
      notePrompted: r.note_prompted === true,
      snoozeDate: r.snooze_date,
      sessions: sessionsByControle.get(r.id) ?? [],
    })
  }
  return out
}
