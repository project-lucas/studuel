// Les annales telles que l'écran les lit : une épreuve, ses parties, et ce
// qu'elles donnent à réviser.
//
// À ne pas confondre avec ses deux voisines :
//  · `lib/annales.ts` répond « cette année finit-elle par un examen ? » (3e,
//    1re, Tle) — c'est elle qui décide de l'existence de l'onglet ;
//  · `lib/exams.ts` répond « quelles MATIÈRES sont évaluées à cet examen ? » —
//    c'est elle qui construit l'objectif examen de l'élève.
// Ici on descend d'un cran : une épreuve précise, et son intérieur.
//
// Tout est PUR. La lecture Supabase se fait dans la page ; ce module ne fait
// que valider ce qui remonte et le mettre en forme.

import type { ExamYearKey } from '@/lib/annales'

/** Une partie de l'épreuve : un exercice, une sous-épreuve, un bloc du barème. */
export type ExamPart = {
  title: string
  /** Durée conseillée, `null` quand l'épreuve ne la découpe pas. */
  minutes: number | null
  /** Points sur le barème de l'épreuve, `null` si non barémé à part. */
  points: number | null
  /** Titres de chapitres du programme mobilisés — cf. migration 236. */
  chapters: string[]
  /** Ce qu'on attend concrètement. C'est le cœur de l'écran. */
  expected: string
}

export type ExamPaper = {
  id: string
  exam: ExamYearKey
  session: string
  /** Centre d'examen, ou variante d'épreuve (« Oral »). `''` = sans objet. */
  center: string
  title: string
  durationMin: number
  coefficient: number | null
  parts: ExamPart[]
  position: number
}

/** Les colonnes à demander à PostgREST. Une liste, pas un `*` : `outline` est
 *  volumineux et on ne veut jamais ramener une colonne ajoutée plus tard sans
 *  l'avoir décidé. */
export const EXAM_PAPER_COLUMNS =
  'id, exam, session, center, title, duration_min, coefficient, outline, position'

type Row = {
  id?: unknown
  exam?: unknown
  session?: unknown
  center?: unknown
  title?: unknown
  duration_min?: unknown
  coefficient?: unknown
  outline?: unknown
  position?: unknown
}

const EXAMS: ExamYearKey[] = ['brevet', 'bac-anticipe', 'bac']

function texte(v: unknown): string {
  return typeof v === 'string' ? v : ''
}

function nombreOuNull(v: unknown): number | null {
  // PostgREST rend les NUMERIC en CHAÎNE (« 1.50 ») pour ne pas perdre de
  // précision : sans ce parseFloat, le coefficient 1,5 du brevet s'afficherait
  // « 1.50 » ou disparaîtrait selon le test appliqué.
  if (typeof v === 'number') return Number.isFinite(v) ? v : null
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v)
    return Number.isFinite(n) ? n : null
  }
  return null
}

function partie(v: unknown): ExamPart | null {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return null
  const o = v as Record<string, unknown>
  const title = texte(o.title)
  const expected = texte(o.expected)
  // Une partie sans titre ni attendu n'affiche rien : elle ne laisse qu'une
  // ligne vide dans la liste, ce qui se lit comme un bug.
  if (!title || !expected) return null
  return {
    title,
    minutes: nombreOuNull(o.minutes),
    points: nombreOuNull(o.points),
    chapters: Array.isArray(o.chapters)
      ? o.chapters.filter((c): c is string => typeof c === 'string' && c !== '')
      : [],
    expected,
  }
}

/**
 * Met en forme les lignes d'`exam_papers`. Tolérante par construction : une
 * ligne illisible est ÉCARTÉE plutôt que de faire tomber l'onglet entier —
 * `outline` est du JSONB, donc rien côté base ne garantit sa forme.
 */
export function parseExamPapers(rows: readonly Row[] | null | undefined): ExamPaper[] {
  if (!rows) return []
  const papers: ExamPaper[] = []
  for (const row of rows) {
    const id = texte(row.id)
    const title = texte(row.title)
    const exam = EXAMS.find((e) => e === row.exam)
    const durationMin = nombreOuNull(row.duration_min)
    if (!id || !title || !exam || !durationMin) continue

    const parts = Array.isArray(row.outline)
      ? row.outline.map(partie).filter((p): p is ExamPart => p !== null)
      : []
    if (parts.length === 0) continue

    papers.push({
      id,
      exam,
      session: texte(row.session),
      center: texte(row.center),
      title,
      durationMin,
      coefficient: nombreOuNull(row.coefficient),
      parts,
      position: nombreOuNull(row.position) ?? 0,
    })
  }
  // La session la plus RÉCENTE en premier — c'est celle que l'élève passe.
  // À session égale, l'ordre voulu par le contenu (`position`).
  return papers.sort(
    (a, b) => b.session.localeCompare(a.session, 'fr') || a.position - b.position,
  )
}

/** Les épreuves regroupées par session, dans l'ordre d'affichage. */
export type PaperSession = { session: string; papers: ExamPaper[] }

export function groupPapersBySession(papers: readonly ExamPaper[]): PaperSession[] {
  const groups: PaperSession[] = []
  const bySession = new Map<string, PaperSession>()
  for (const paper of papers) {
    let group = bySession.get(paper.session)
    if (!group) {
      group = { session: paper.session, papers: [] }
      bySession.set(paper.session, group)
      groups.push(group)
    }
    group.papers.push(paper)
  }
  return groups
}

/** « 3 h 30 », « 2 h », « 20 min » — jamais « 210 min », qu'on doit convertir. */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `${h} h` : `${h} h ${String(m).padStart(2, '0')}`
}

/** « coef. 1,5 » — virgule décimale, et pas de « ,00 » inutile. */
export function formatCoefficient(coefficient: number | null): string | null {
  if (coefficient === null) return null
  const arrondi = Math.round(coefficient * 100) / 100
  return `coef. ${String(arrondi).replace('.', ',')}`
}

/**
 * Le total de points annoncé par le barème, `null` si toutes les parties ne
 * sont pas barémées — un total partiel serait un total FAUX.
 */
export function totalPoints(paper: ExamPaper): number | null {
  if (paper.parts.some((p) => p.points === null)) return null
  return paper.parts.reduce((sum, p) => sum + (p.points ?? 0), 0)
}

/**
 * Les chapitres cités par l'épreuve, dédoublonnés, dans l'ordre d'apparition —
 * c'est la liste « ce que cette épreuve te demande de réviser ».
 */
export function chaptersOfPaper(paper: ExamPaper): string[] {
  const vus = new Set<string>()
  const liste: string[] = []
  for (const part of paper.parts) {
    for (const chapter of part.chapters) {
      if (vus.has(chapter)) continue
      vus.add(chapter)
      liste.push(chapter)
    }
  }
  return liste
}
