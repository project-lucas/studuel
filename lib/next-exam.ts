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

// Lien profond vers la session de révision du chapitre visé :
// /reviser/{slug-matière}/{id-chapitre} (le chapitre est identifié par son id).
export function examHref(exam: NextExam): string {
  return `/reviser/${exam.subject}/${exam.chapterId}`
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

// Ajoute (ou met à jour) un contrôle dans la liste : dédoublonné par chapitre,
// borné. Retourne une NOUVELLE liste (immutabilité).
export function addExam(list: NextExam[], exam: NextExam): NextExam[] {
  const withoutDup = list.filter((e) => e.chapterId !== exam.chapterId)
  return [...withoutDup, exam].slice(-MAX_UPCOMING_EXAMS)
}

// Retire le contrôle d'un chapitre. Nouvelle liste.
export function removeExam(list: NextExam[], chapterId: string): NextExam[] {
  return list.filter((e) => e.chapterId !== chapterId)
}

// Identifiants des chapitres visés par les contrôles à venir (sans doublon) —
// c'est là-dedans que le Défi pioche en priorité.
export function examChapterIds(list: NextExam[]): string[] {
  return [...new Set(list.map((e) => e.chapterId))]
}
