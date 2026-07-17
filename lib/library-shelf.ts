// L'étagère de la bibliothèque (bloc « Bibliothèque » de Mon carnet) —
// logique pure : sections de récence (« Aujourd'hui », « Cette semaine »,
// « Plus ancien »), libellés relatifs (« il y a 16 min ») et aperçus de
// contenu par type. Les composants ne font qu'afficher.
import { toDayKey } from '@/lib/streak'
import type {
  CarteContent,
  FicheContent,
  LibraryContent,
  LibraryKind,
  QuizContent,
} from '@/lib/library'

// Un item prêt à afficher sur l'étagère — entièrement sérialisable (calculé
// côté serveur, rendu côté client).
export type ShelfItem = {
  id: string
  kind: LibraryKind
  title: string
  ready: boolean
  updatedAt: string
  /** Lignes d'aperçu du contenu (déjà rognées). */
  lines: string[]
  /** Jeton de comptage (« 5 questions », « 3 branches ») — null pour la fiche. */
  meta: string | null
}

// --------------------------------------------------------------- récence

export type ShelfSectionId = 'today' | 'week' | 'older'

export const SECTION_LABELS: Record<ShelfSectionId, string> = {
  today: 'Aujourd’hui',
  week: 'Cette semaine',
  older: 'Plus ancien',
}

const DAY_MS = 86_400_000

const utcDayStart = (d: Date): number =>
  Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())

/** Section de récence d'un item (jours = clés UTC, convention projet). */
export function sectionFor(updatedAt: string, now: Date): ShelfSectionId {
  const d = new Date(updatedAt)
  if (Number.isNaN(d.getTime())) return 'older'
  if (toDayKey(d) === toDayKey(now)) return 'today'
  const days = Math.round((utcDayStart(now) - utcDayStart(d)) / DAY_MS)
  return days <= 7 ? 'week' : 'older'
}

/**
 * Groupe les items par section de récence, en préservant l'ordre reçu
 * (déjà trié du plus récent au plus ancien). Les sections vides disparaissent.
 */
export function groupShelf<T extends { updatedAt: string }>(
  items: T[],
  now: Date,
): { id: ShelfSectionId; label: string; items: T[] }[] {
  const buckets: Record<ShelfSectionId, T[]> = {
    today: [],
    week: [],
    older: [],
  }
  for (const item of items) buckets[sectionFor(item.updatedAt, now)].push(item)
  return (['today', 'week', 'older'] as const)
    .filter((id) => buckets[id].length > 0)
    .map((id) => ({ id, label: SECTION_LABELS[id], items: buckets[id] }))
}

/** « à l'instant », « il y a 16 min », « il y a 3 h », « hier », « il y a 5 j ». */
export function relativeLabel(updatedAt: string, now: Date): string {
  const d = new Date(updatedAt)
  if (Number.isNaN(d.getTime())) return ''
  const diffMs = Math.max(0, now.getTime() - d.getTime())
  const minutes = Math.floor(diffMs / 60_000)
  if (minutes < 1) return 'à l’instant'
  if (minutes < 60) return `il y a ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `il y a ${hours} h`
  const days = Math.round((utcDayStart(now) - utcDayStart(d)) / DAY_MS)
  if (days <= 1) return 'hier'
  if (days < 30) return `il y a ${days} j`
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  })
}

// --------------------------------------------------------------- aperçus

export const PREVIEW_MAX_LINES = 6
const PREVIEW_LINE_LEN = 80

// Une ligne de markdown débarrassée de ses marqueurs (##, -, *, >, `).
const stripMarkdown = (line: string): string =>
  line
    .replace(/^[#>\-*+\s]+/, '')
    .replace(/[*_`]/g, '')
    .trim()

/** Lignes d'aperçu du contenu, façon miniature de la vraie fiche. */
export function previewLines(
  kind: LibraryKind,
  content: LibraryContent,
): string[] {
  if (kind === 'fiche') {
    return (content as FicheContent).markdown
      .split('\n')
      .map(stripMarkdown)
      .filter((l) => l.length > 0)
      .slice(0, PREVIEW_MAX_LINES)
      .map((l) => l.slice(0, PREVIEW_LINE_LEN))
  }
  if (kind === 'quiz') {
    return (content as QuizContent).questions
      .slice(0, PREVIEW_MAX_LINES)
      .map((q, i) => `${i + 1}. ${q.question.slice(0, PREVIEW_LINE_LEN)}`)
  }
  const carte = content as CarteContent
  const centre = carte.centre.trim()
  return [
    ...(centre.length > 0 ? [centre] : []),
    ...carte.branches.map((b) => `→ ${b.titre.slice(0, PREVIEW_LINE_LEN)}`),
  ].slice(0, PREVIEW_MAX_LINES)
}

/** Jeton de comptage du pied de carte — null quand il n'apporte rien. */
export function previewMeta(
  kind: LibraryKind,
  content: LibraryContent,
): string | null {
  if (kind === 'quiz') {
    const n = (content as QuizContent).questions.length
    return `${n} question${n > 1 ? 's' : ''}`
  }
  if (kind === 'carte') {
    const n = (content as CarteContent).branches.length
    return `${n} branche${n > 1 ? 's' : ''}`
  }
  return null
}
