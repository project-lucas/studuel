// -----------------------------------------------------------------------------
// « Ma bibliothèque » — contenus créés par l'élève (fiches de révision, quiz,
// cartes mentales), stockés dans library_items (migration 158). Un seul modèle,
// discriminé par `kind` ; le détail vit dans `content` selon le type. Toute la
// validation/normalisation est ici, pure et testable (convention projet) : les
// données brutes de la base ET des formulaires passent par ces fonctions avant
// d'être utilisées ou réécrites.
// -----------------------------------------------------------------------------

import type { MindMapData, QuizQuestion } from '@/lib/types'

export type LibraryKind = 'fiche' | 'quiz' | 'carte'

export const LIBRARY_KINDS: readonly LibraryKind[] = ['fiche', 'quiz', 'carte']

export const KIND_LABEL: Record<LibraryKind, string> = {
  fiche: 'Fiche de révision',
  quiz: 'Quiz',
  carte: 'Carte mentale',
}

// --- Bornes (partagées avec les éditeurs) ------------------------------------
export const MAX_TITLE_LEN = 120
export const MAX_FICHE_LEN = 20_000
export const MAX_QUIZ_QUESTIONS = 20
export const MIN_QUIZ_OPTIONS = 2
export const MAX_QUIZ_OPTIONS = 6
export const MAX_CARTE_BRANCHES = 8
export const MAX_BRANCH_ITEMS = 10

// --- Formes de `content` par type --------------------------------------------
export type FicheContent = { markdown: string }
export type LibraryQuizQuestion = {
  question: string
  options: string[]
  correct_index: number
  explanation: string | null
}
export type QuizContent = { questions: LibraryQuizQuestion[] }
export type CarteContent = MindMapData // { centre, branches: [{ titre, enfants }] }

export type LibraryContent = FicheContent | QuizContent | CarteContent

export type LibraryItem = {
  id: string
  kind: LibraryKind
  title: string
  subject: string | null
  content: LibraryContent
  updatedAt: string
}

export function isLibraryKind(v: unknown): v is LibraryKind {
  return v === 'fiche' || v === 'quiz' || v === 'carte'
}

const str = (v: unknown): string => (typeof v === 'string' ? v : '')

// Titre nettoyé : rogné, borné, jamais vide (retombe sur « Sans titre »).
export function normalizeTitle(raw: unknown): string {
  const t = str(raw).trim().slice(0, MAX_TITLE_LEN)
  return t.length > 0 ? t : 'Sans titre'
}

// --- Normalisation par type ---------------------------------------------------

export function normalizeFiche(raw: unknown): FicheContent {
  const o = (raw ?? {}) as Record<string, unknown>
  return { markdown: str(o.markdown).slice(0, MAX_FICHE_LEN) }
}

// Une question du quiz de l'élève, ou null si inexploitable (question vide ou
// moins de 2 options non vides). L'index de bonne réponse est ramené dans les
// bornes (0 par défaut).
export function normalizeQuizQuestion(raw: unknown): LibraryQuizQuestion | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  const question = str(o.question).trim().slice(0, 500)
  if (question.length === 0) return null

  const options = Array.isArray(o.options)
    ? o.options
        .map((x) => str(x).trim().slice(0, 300))
        .filter((x) => x.length > 0)
        .slice(0, MAX_QUIZ_OPTIONS)
    : []
  if (options.length < MIN_QUIZ_OPTIONS) return null

  const rawIndex = Number(o.correct_index)
  const correct_index =
    Number.isInteger(rawIndex) && rawIndex >= 0 && rawIndex < options.length
      ? rawIndex
      : 0

  const explanationRaw = str(o.explanation).trim().slice(0, 500)
  return {
    question,
    options,
    correct_index,
    explanation: explanationRaw.length > 0 ? explanationRaw : null,
  }
}

export function normalizeQuizContent(raw: unknown): QuizContent {
  const o = (raw ?? {}) as Record<string, unknown>
  const list = Array.isArray(o.questions) ? o.questions : []
  const questions = list
    .map(normalizeQuizQuestion)
    .filter((q): q is LibraryQuizQuestion => q !== null)
    .slice(0, MAX_QUIZ_QUESTIONS)
  return { questions }
}

export function normalizeCarte(raw: unknown): CarteContent {
  const o = (raw ?? {}) as Record<string, unknown>
  const centre = str(o.centre).trim().slice(0, 120)
  const branchesRaw = Array.isArray(o.branches) ? o.branches : []
  const branches = branchesRaw
    .map((b) => {
      if (!b || typeof b !== 'object') return null
      const bo = b as Record<string, unknown>
      const titre = str(bo.titre).trim().slice(0, 120)
      if (titre.length === 0) return null
      const enfants = Array.isArray(bo.enfants)
        ? bo.enfants
            .map((x) => str(x).trim().slice(0, 200))
            .filter((x) => x.length > 0)
            .slice(0, MAX_BRANCH_ITEMS)
        : []
      return { titre, enfants }
    })
    .filter((b): b is { titre: string; enfants: string[] } => b !== null)
    .slice(0, MAX_CARTE_BRANCHES)
  return { centre, branches }
}

// Normalise le `content` brut selon le type.
export function normalizeContent(
  kind: LibraryKind,
  raw: unknown,
): LibraryContent {
  if (kind === 'fiche') return normalizeFiche(raw)
  if (kind === 'quiz') return normalizeQuizContent(raw)
  return normalizeCarte(raw)
}

// Contenu vide par défaut à la création d'un nouvel item.
export function emptyContent(kind: LibraryKind): LibraryContent {
  if (kind === 'fiche') return { markdown: '' }
  if (kind === 'quiz') return { questions: [] }
  return { centre: '', branches: [] }
}

// --- Complétude (pour afficher un état « brouillon » vs « prêt ») -------------
export function isContentReady(kind: LibraryKind, content: LibraryContent): boolean {
  if (kind === 'fiche') return (content as FicheContent).markdown.trim().length > 0
  if (kind === 'quiz') return (content as QuizContent).questions.length > 0
  const carte = content as CarteContent
  return carte.centre.trim().length > 0 && carte.branches.length > 0
}

// Convertit un quiz de la bibliothèque en questions jouables par QuizPlayer
// (ids synthétiques, tout en QCM). `quizId` sert d'id de session.
export function toQuizQuestions(
  quizId: string,
  content: QuizContent,
): QuizQuestion[] {
  return content.questions.map((q, i) => ({
    id: `${quizId}-${i}`,
    quiz_id: quizId,
    question: q.question,
    kind: 'mcq',
    options: q.options,
    correct_index: q.correct_index,
    explanation: q.explanation,
    position: i,
  }))
}
