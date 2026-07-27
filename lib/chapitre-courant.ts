// -----------------------------------------------------------------------------
// « Chapitre en cours » — la réponse à la seule question que le bouton JOUER
// doit trancher : sur QUOI l'élève joue maintenant ?
//
// Un duel tiré au hasard dans tout le programme n'apprend rien et ne se rejoue
// pas ; un duel sur le chapitre du contrôle de jeudi est utile ET urgent. Cette
// résolution est la différence entre un jeu de quiz et un outil de révision.
//
// Ordre de priorité, du plus urgent au plus utile :
//   1. controle    — le chapitre de la session de préparation du jour (203)
//   2. recent      — le dernier chapitre travaillé (« là où tu t'es arrêté »)
//   3. faible      — le chapitre le plus fragile (maîtrise la plus basse)
//   4. decouverte  — un chapitre jamais travaillé
//
// Pur et testable : l'appelant fournit des données déjà normalisées, ce module
// ne connaît ni Supabase ni React (convention projet).
// -----------------------------------------------------------------------------

import { derivePlanView, launchChapterId, nearestActiveControle } from '@/lib/prep-plan'
import type { Controle } from '@/lib/prep-plan'

export type ChapterReason = 'controle' | 'recent' | 'faible' | 'decouverte'

/** Un chapitre jouable : il a des questions derrière lui. L'appelant ne
 *  propose QUE des chapitres réellement alimentés. */
export type ChapterCandidate = {
  id: string
  title: string
  subject: string // slug de matière
  /** Nombre de questions disponibles — un chapitre trop maigre ne fait pas
   *  90 secondes de duel. */
  questionCount: number
}

export type CurrentChapter = ChapterCandidate & {
  reason: ChapterReason
  /** Date du contrôle qui motive ce chapitre (reason 'controle'), sinon null. */
  examDate: string | null
}

/** Ce que l'appelant doit rassembler pour trancher. Tout est optionnel sauf
 *  les candidats : sans chapitre alimenté, il n'y a pas de duel de chapitre. */
export type ChapterContext = {
  candidates: readonly ChapterCandidate[]
  /** Contrôles déclarés (lib/prep-plan). */
  controles?: readonly Controle[]
  /** Jour courant, clé UTC 'YYYY-MM-DD'. */
  today: string
  /** Chapitres récemment travaillés, du plus récent au plus ancien. */
  recentChapterIds?: readonly string[]
  /** Maîtrise par chapitre (0..100). Absent = jamais travaillé. */
  mastery?: ReadonlyMap<string, number>
  /** Questions minimum pour qu'un chapitre soit jouable en duel. */
  minQuestions?: number
}

/** En dessous de ce niveau de maîtrise, un chapitre est dit « fragile ». */
export const FRAGILE_THRESHOLD = 60

const DEFAULT_MIN_QUESTIONS = 6

function playable(
  candidates: readonly ChapterCandidate[],
  minQuestions: number,
): ChapterCandidate[] {
  return candidates.filter(
    (c) =>
      typeof c.id === 'string' &&
      c.id.length > 0 &&
      Number.isFinite(c.questionCount) &&
      c.questionCount >= minQuestions,
  )
}

/**
 * Le chapitre sur lequel lancer le duel maintenant, ou null si aucun chapitre
 * n'est assez alimenté (l'appelant retombe alors sur le vivier général).
 */
export function pickCurrentChapter(ctx: ChapterContext): CurrentChapter | null {
  const min = ctx.minQuestions ?? DEFAULT_MIN_QUESTIONS
  const pool = playable(ctx.candidates, min)
  if (pool.length === 0) return null

  const byId = new Map(pool.map((c) => [c.id, c]))

  // 1. Le contrôle le plus proche dont le plan n'est pas terminé : on joue le
  //    chapitre de sa session du jour. C'est la raison la plus forte de jouer.
  const controle = nearestActiveControle(ctx.controles ?? [], ctx.today)
  if (controle) {
    const view = derivePlanView(controle, ctx.today)
    const wanted = launchChapterId(view, controle)
    const hit = byId.get(wanted)
    if (hit) return { ...hit, reason: 'controle', examDate: controle.date }
    // Le chapitre visé n'a pas (encore) de questions : on reste sur le contrôle
    // en prenant n'importe lequel de SES chapitres qui, lui, est jouable.
    for (const chap of controle.chapters) {
      const alt = byId.get(chap.id)
      if (alt) return { ...alt, reason: 'controle', examDate: controle.date }
    }
  }

  // 2. Là où l'élève s'est arrêté.
  for (const id of ctx.recentChapterIds ?? []) {
    const hit = byId.get(id)
    if (hit) return { ...hit, reason: 'recent', examDate: null }
  }

  // 3. Le plus fragile parmi ceux DÉJÀ travaillés (une maîtrise existe).
  const worked = pool
    .map((c) => ({ c, m: ctx.mastery?.get(c.id) }))
    .filter((x): x is { c: ChapterCandidate; m: number } => typeof x.m === 'number')
    .sort((a, b) => a.m - b.m)
  if (worked.length > 0 && worked[0].m < FRAGILE_THRESHOLD) {
    return { ...worked[0].c, reason: 'faible', examDate: null }
  }

  // 4. Un chapitre jamais travaillé — sinon, à défaut, le moins maîtrisé.
  const fresh = pool.find((c) => ctx.mastery?.get(c.id) === undefined)
  if (fresh) return { ...fresh, reason: 'decouverte', examDate: null }

  return { ...(worked[0]?.c ?? pool[0]), reason: 'faible', examDate: null }
}

// --- Libellés ------------------------------------------------------------------
// Le bouton JOUER doit dire POURQUOI ce chapitre. « Duel » tout court ne donne
// aucune raison de cliquer ; « Contrôle jeudi » en donne une.

export function reasonLabel(chapter: CurrentChapter, today: string): string {
  if (chapter.reason === 'controle') {
    if (chapter.examDate === null) return 'Pour ton contrôle'
    const d = daysUntil(today, chapter.examDate)
    if (d <= 0) return 'Contrôle aujourd’hui'
    if (d === 1) return 'Contrôle demain'
    return `Contrôle dans ${d} jours`
  }
  if (chapter.reason === 'recent') return 'Là où tu t’es arrêté'
  if (chapter.reason === 'faible') return 'Ton chapitre le plus fragile'
  return 'Un chapitre à découvrir'
}

/** Urgence de la raison : la carte du duel s'habille en rouge pour un contrôle
 *  imminent, en violet sinon. Le visuel doit trahir l'enjeu avant le texte. */
export function reasonUrgency(
  chapter: CurrentChapter,
  today: string,
): 'urgent' | 'normal' {
  if (chapter.reason !== 'controle') return 'normal'
  if (chapter.examDate === null) return 'normal'
  return daysUntil(today, chapter.examDate) <= 2 ? 'urgent' : 'normal'
}

function daysUntil(from: string, to: string): number {
  const a = Date.parse(`${from}T00:00:00Z`)
  const b = Date.parse(`${to}T00:00:00Z`)
  if (Number.isNaN(a) || Number.isNaN(b)) return 0
  return Math.round((b - a) / 86_400_000)
}
