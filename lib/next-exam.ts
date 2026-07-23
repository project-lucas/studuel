// -----------------------------------------------------------------------------
// « Contrôles à venir » — la LISTE des contrôles déclarés par l'élève (chacun :
// matière + chapitre, date optionnelle). Stockée dans profiles.upcoming_exams
// (migration 087). L'onglet Moi affiche la liste ; le Défi pioche ses questions
// en priorité dans ces chapitres. Logique pure et testable (convention projet :
// pas de logique dans les composants).
// -----------------------------------------------------------------------------

// Nombre maximum de contrôles suivis en même temps (garde-fou anti-abus).
export const MAX_UPCOMING_EXAMS = 10

export type NextExam = {
  subject: string // slug de la matière (ex. 'physique-chimie')
  chapterId: string // id du chapitre visé
  chapterTitle: string
  level: string // niveau du chapitre (ex. '1re')
  date: string | null // clé UTC 'YYYY-MM-DD' ou null si non précisée
}

const isDayKey = (v: unknown): v is string =>
  typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v)

const isNonEmpty = (v: unknown): v is string =>
  typeof v === 'string' && v.length > 0 && v.length < 200

// Valide/normalise une valeur brute (JSON de la base ou d'un formulaire) en
// NextExam, ou null si la forme est invalide.
export function normalizeNextExam(raw: unknown): NextExam | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  if (
    !isNonEmpty(o.subject) ||
    !isNonEmpty(o.chapterId) ||
    !isNonEmpty(o.chapterTitle) ||
    !isNonEmpty(o.level)
  ) {
    return null
  }
  return {
    subject: o.subject,
    chapterId: o.chapterId,
    chapterTitle: o.chapterTitle,
    level: o.level,
    date: isDayKey(o.date) ? o.date : null,
  }
}

// Une cible reste « active » tant que la date n'est pas passée (ou si aucune
// date n'a été donnée). Passé le jour du contrôle, on redemandera une cible.
export function isExamActive(
  exam: NextExam | null,
  today: string,
): exam is NextExam {
  if (!exam) return false
  if (exam.date === null) return true
  return exam.date >= today
}

// Compte à rebours lisible en français, ou null si aucune date.
export function examCountdownLabel(
  exam: NextExam,
  today: string,
): string | null {
  if (exam.date === null) return null
  const days = daysBetween(today, exam.date)
  if (days < 0) return 'contrôle passé'
  if (days === 0) return "c'est aujourd'hui"
  if (days === 1) return 'demain'
  return `dans ${days} jours`
}

// Libellé du badge des cartes prioritaires « contrôle » (rangée On s'y remet ?) :
// une carte par contrôle actif, le badge dit l'échéance d'un coup d'œil.
export function examCardLabel(exam: NextExam, today: string): string {
  if (exam.date === null) return 'Contrôle à venir'
  const days = daysBetween(today, exam.date)
  if (days <= 0) return "Contrôle aujourd'hui !"
  if (days === 1) return 'Contrôle demain'
  return `Contrôle dans ${days} jours`
}

// Proximité d'un contrôle, en 3 paliers pour annoter les dossiers de matières :
// vert = encore de la marge, orange = bientôt, rouge = très proche (ou
// aujourd'hui). Sans date : palier neutre « far » (annoncé, pas urgent).
export type ExamProximity = 'far' | 'soon' | 'imminent'

export const EXAM_SOON_DAYS = 6 // ≤ 6 jours → orange
export const EXAM_IMMINENT_DAYS = 2 // ≤ 2 jours → rouge

export function examProximity(exam: NextExam, today: string): ExamProximity {
  if (exam.date === null) return 'far'
  const days = daysBetween(today, exam.date)
  if (days <= EXAM_IMMINENT_DAYS) return 'imminent'
  if (days <= EXAM_SOON_DAYS) return 'soon'
  return 'far'
}

// --- Carte héro « Pour ton prochain contrôle » ---------------------------------

// Ton du badge d'urgence de la carte héro : jaune tant qu'il reste de la marge
// (≥ 3 jours, ou sans date), corail quand c'est imminent (≤ 2 jours).
export type ExamHeroTone = 'yellow' | 'coral'

export type ExamHeroUrgency = {
  label: string // « Contrôle dans 3 jours », « Contrôle demain »…
  tone: ExamHeroTone
}

// Badge de la carte héro, à partir de la SEULE date du contrôle : calculé côté
// client en jours calendaires (clés UTC 'YYYY-MM-DD', convention projet).
export function examHeroUrgency(
  date: string | null,
  today: string,
): ExamHeroUrgency {
  if (date === null) return { label: 'Contrôle à venir', tone: 'yellow' }
  const days = daysBetween(today, date)
  if (days <= 0) return { label: "Contrôle aujourd'hui !", tone: 'coral' }
  if (days === 1) return { label: 'Contrôle demain', tone: 'coral' }
  if (days === 2) return { label: 'Contrôle dans 2 jours', tone: 'coral' }
  return { label: `Contrôle dans ${days} jours`, tone: 'yellow' }
}

// Indice d'annotation d'un dossier : le contrôle le PLUS proche de la matière.
export type SubjectExamHint = {
  proximity: ExamProximity
  label: string // « demain », « dans 3 jours », « à venir »…
  chapterTitle: string
}

// Le contrôle le plus proche par matière (slug), à partir d'une liste DÉJÀ
// triée soonest-first (cf. activeExams) : le premier vu par matière gagne.
export function examHintsBySubject(
  activeList: readonly NextExam[],
  today: string,
): Record<string, SubjectExamHint> {
  const out: Record<string, SubjectExamHint> = {}
  for (const exam of activeList) {
    if (out[exam.subject]) continue
    out[exam.subject] = {
      proximity: examProximity(exam, today),
      label: examCountdownLabel(exam, today) ?? 'à venir',
      chapterTitle: exam.chapterTitle,
    }
  }
  return out
}

// Différence en jours entre deux clés UTC 'YYYY-MM-DD' (from → to).
function daysBetween(from: string, to: string): number {
  const a = Date.parse(`${from}T00:00:00Z`)
  const b = Date.parse(`${to}T00:00:00Z`)
  if (Number.isNaN(a) || Number.isNaN(b)) return 0
  return Math.round((b - a) / 86_400_000)
}

// --- Liste de contrôles -------------------------------------------------------

// Normalise une valeur brute (JSONB de la base) en liste de contrôles valides :
// on jette les entrées invalides, on dédoublonne par chapitre (dernière gagne),
// et on borne la taille.
export function normalizeExamList(raw: unknown): NextExam[] {
  if (!Array.isArray(raw)) return []
  const byChapter = new Map<string, NextExam>()
  for (const entry of raw) {
    const exam = normalizeNextExam(entry)
    if (exam) byChapter.set(exam.chapterId, exam)
  }
  // On garde les PLUS RÉCENTS (fin de liste), cohérent avec addExam : si une
  // liste stockée dépasse un jour la borne, on jette les plus anciens, pas les
  // derniers annoncés.
  return [...byChapter.values()].slice(-MAX_UPCOMING_EXAMS)
}

// Ne garde que les contrôles encore à venir (date nulle = toujours actif), triés
// par date croissante (les sans-date à la fin).
export function activeExams(list: NextExam[], today: string): NextExam[] {
  return list
    .filter((e) => isExamActive(e, today))
    .sort((a, b) => {
      if (a.date === b.date) return 0
      if (a.date === null) return 1
      if (b.date === null) return -1
      return a.date < b.date ? -1 : 1
    })
}

// Identifiants des chapitres visés par les contrôles à venir (sans doublon) —
// c'est là-dedans que le Défi pioche en priorité.
export function examChapterIds(list: NextExam[]): string[] {
  return [...new Set(list.map((e) => e.chapterId))]
}
