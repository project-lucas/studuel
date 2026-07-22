// Logique pure du template générique de page matière (/reviser/[matiereSlug]).
// Tout ce que la page calcule à partir des données Supabase vit ici : statut et
// couronnes d'un chapitre, progression globale de la matière, libellés d'état
// des contenus par mode. Aucune logique spécifique à une matière : ajouter une
// matière = ajouter des lignes en base, zéro code.

import { LESSON_FLOOR } from '@/lib/mastery'
import type { ExamProximity } from '@/lib/next-exam'
import type { ModeQuestion } from '@/lib/defi-modes'

// ---------------------------------------------------------------------------
// Onglets de la page matière.

export type ModeKey =
  | 'chapitres'
  | 'quiz'
  | 'flashcards'
  | 'cartes'
  | 'defis'
  | 'erreurs'
  | 'boss'

// Onglets « liste de contenus par chapitre » (rendus par ModeContentList) —
// Mes erreurs et Boss ont chacun leur panneau dédié.
export type ContentModeKey = Exclude<ModeKey, 'chapitres' | 'erreurs' | 'boss'>

export const MODES: { key: ModeKey; label: string }[] = [
  { key: 'chapitres', label: 'Chapitres' },
  { key: 'quiz', label: 'Quiz' },
  { key: 'flashcards', label: 'Flashcards' },
  { key: 'cartes', label: 'Cartes mentales' },
  { key: 'defis', label: 'Défis' },
  { key: 'erreurs', label: 'Mes erreurs' },
  { key: 'boss', label: 'Boss' },
]

// Message affiché quand un mode n'a encore aucun contenu.
export const MODE_EMPTY_LABELS: Record<ContentModeKey, string> = {
  quiz: 'Aucun quiz pour l’instant.',
  flashcards: 'Aucune flashcard pour l’instant.',
  cartes: 'Aucune carte mentale pour l’instant.',
  defis: 'Aucun défi pour l’instant.',
}

// ---------------------------------------------------------------------------
// Avancement d'un chapitre.

export type ChapterStatus = 'non_commence' | 'en_cours' | 'complete'

// Au-delà de ce ratio (meilleur quiz), le chapitre est considéré complété —
// aligné sur la maîtrise plutôt que sur un 100 % décourageant.
export const COMPLETE_THRESHOLD = 0.8

// Paliers des trois couronnes (façon Clash Royale) : chaque seuil franchi
// allume une couronne, la troisième coïncide avec « complété ».
export const CROWN_THRESHOLDS = [LESSON_FLOOR, 0.6, COMPLETE_THRESHOLD] as const

export type ChapterActivity = {
  bestQuizRatio: number | null // meilleur score (0..1) parmi les quiz du chapitre
  lessonDone: boolean // au moins une leçon terminée
}

// Valeur d'avancement 0..1 d'un chapitre : meilleur quiz, avec le plancher
// LESSON_FLOOR dès qu'une leçon est terminée — même règle que lib/mastery.
export function chapterValue(activity: ChapterActivity): number {
  let value = activity.bestQuizRatio ?? 0
  if (activity.lessonDone) value = Math.max(value, LESSON_FLOOR)
  return Math.min(Math.max(value, 0), 1)
}

export function chapterStatus(value: number): ChapterStatus {
  if (value >= COMPLETE_THRESHOLD) return 'complete'
  if (value > 0) return 'en_cours'
  return 'non_commence'
}

export const STATUS_LABELS: Record<ChapterStatus, string> = {
  non_commence: 'Non commencé',
  en_cours: 'En cours',
  complete: 'Complété',
}

// Nombre de couronnes (0..3) allumées pour une valeur d'avancement donnée.
export function crowns(value: number): number {
  return CROWN_THRESHOLDS.filter((t) => value >= t).length
}

// ---------------------------------------------------------------------------
// Progression globale de la matière : « X/Y chapitres · Z% ».

export type SubjectProgress = {
  done: number // chapitres complétés
  total: number
  pct: number // moyenne des avancements, en %
}

export function subjectProgress(values: number[]): SubjectProgress {
  const total = values.length
  const done = values.filter((v) => chapterStatus(v) === 'complete').length
  const pct =
    total > 0
      ? Math.round((values.reduce((s, v) => s + v, 0) / total) * 100)
      : 0
  return { done, total, pct }
}

// Un élève 100 % nouveau sur la matière : aucun chapitre entamé. Le premier
// chapitre affiche alors le CTA « Commencer ».
export function isNewToSubject(values: number[]): boolean {
  return values.length > 0 && values.every((v) => chapterStatus(v) === 'non_commence')
}

// ---------------------------------------------------------------------------
// Libellés d'état des contenus par mode.

// Quiz : « 7/10 » (meilleur essai) ou « Jamais tenté ».
export function quizMeta(
  best: { score: number; total: number } | null,
  // Gardé pour la symétrie d'appel avec les autres metas (le compte de
  // questions reste porté par le titre côté défi).
  _questionCount: number,
): string {
  if (best && best.total > 0) return `${best.score}/${best.total}`
  return NEVER_TRIED_LABEL
}

/** État « vierge » d'un contenu jamais joué, commun à toutes les vues. */
export const NEVER_TRIED_LABEL = 'Jamais tenté'

// Flashcards : « 12 cartes · 4 à revoir » (le « à revoir » vient de la file SRS).
export function flashcardsMeta(cardCount: number, dueCount: number): string {
  const cards = `${cardCount} carte${cardCount > 1 ? 's' : ''}`
  return dueCount > 0 ? `${cards} · ${dueCount} à revoir` : cards
}

// Défi : l'item s'appelle « Défi · 10 questions » (le titre de leçon des seeds,
// type « L'essentiel du cours », n'apportait rien — le chapitre est déjà le
// titre de section) ; son état dit s'il a déjà été relevé.
export function defiTitle(questionCount: number): string {
  return `Défi · ${questionCount} question${questionCount > 1 ? 's' : ''}`
}

export function defiMeta(attempted: boolean): string {
  return attempted ? 'Relevé' : NEVER_TRIED_LABEL
}

// Carte mentale : « Vue d'ensemble » si le chapitre est accessible,
// « Débloquer » (affiché avec la gemme) tant qu'il est verrouillé.
export function carteMeta(locked: boolean): string {
  return locked ? 'Débloquer' : 'Vue d’ensemble'
}

// ---------------------------------------------------------------------------
// Vue-modèle passé du Server Component à l'UI (sérialisable).

export type ChapterExamHint = {
  label: string // « Contrôle dans 3 jours », « Contrôle demain »…
  proximity: ExamProximity
}

export type ChapterRow = {
  id: string
  position: number
  title: string
  status: ChapterStatus
  crowns: number
  href: string
  examHint: ChapterExamHint | null
}

export type ModeItem = {
  id: string
  title: string
  href: string
  meta: string
  done: boolean
  // Contenu gated par l'abonnement/les gemmes (cartes mentales) : la ligne
  // affiche alors la gemme + « Débloquer » et une loupe d'aperçu.
  locked?: boolean
  // Récompense promise AVANT de jouer (« +20 XP ») — miroir de
  // lib/wallet.XP_AWARDS, versée par la Server Action de fin de session.
  xp?: number
}

export type ModeGroup = {
  chapterId: string
  chapterTitle: string
  position: number
  items: ModeItem[]
}

// Onglet « Mes erreurs » : les notions de la matière dans la file SRS du jour,
// ventilées par chapitre — mêmes règles de rattachement que weakCount.
export type SubjectErrorsData = {
  total: number
  byChapter: { title: string; count: number }[]
}

export type SubjectTemplateData = {
  subject: { slug: string; name: string; color: string }
  grade: string
  progress: SubjectProgress
  isNew: boolean
  weakCount: number
  // Économie affichée en haut à droite du header : solde de gemmes 💎 et
  // série 🔥 (la même série dérivée que la flamme de l'accueil Réviser).
  gems: number
  streak: number
  chapters: ChapterRow[]
  modes: Record<ContentModeKey, ModeGroup[]>
  erreurs: SubjectErrorsData
  // Onglet « Boss » : pool de questions 100 % matière pour affronter le boss
  // de la matière (le même de la 6e à la Terminale — bossForSubject côté client).
  bossPool: ModeQuestion[]
}
