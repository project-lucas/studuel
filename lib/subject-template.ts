// Logique pure du template générique de page matière (/reviser/[matiereSlug]).
// Tout ce que la page calcule à partir des données Supabase vit ici : statut et
// couronnes d'un chapitre, progression globale de la matière, libellés d'état
// des contenus. Aucune logique spécifique à une matière : ajouter une matière =
// ajouter des lignes en base, zéro code.

import { isExamYear } from '@/lib/annales'
import { LESSON_FLOOR } from '@/lib/mastery'
import type { ExamProximity } from '@/lib/next-exam'
import type { ModeQuestion } from '@/lib/defi-modes'
import type { Standing } from '@/lib/percentile'

// ---------------------------------------------------------------------------
// Onglets de la page matière.
//
// DEUX OU TROIS onglets, pas sept. Les quatre onglets de format (Quiz,
// Flashcards, Cartes mentales, Défis) listaient les MÊMES chapitres quatre fois
// de suite : une matrice transposée, où l'élève scrollait quatre listes
// identiques pour changer d'exercice sur un chapitre. Ils fusionnent dans
// « Mode de jeu », où chaque chapitre porte ses formats en pastilles, et où le
// Boss (un panneau, pas une liste) prend la tête. « Annales » ne s'ajoute que
// les années à examen.

export type ModeKey = 'programme' | 'jeu' | 'annales'

/**
 * Pictogramme d'un onglet, désigné par son NOM (le composant fait la
 * correspondance avec l'icône) : `lib/` reste pur, sans JSX ni dépendance à une
 * bibliothèque d'icônes.
 */
export type ModeIcon = 'manette'

export type ModeTab = { key: ModeKey; label: string; icon?: ModeIcon }

/**
 * Les onglets de la matière, selon la classe.
 *
 * « Annales » n'existe QUE pour les années qui finissent sur une épreuve
 * nationale (3e, 1re, Tle — cf. lib/annales) : proposer des sujets d'examen à
 * un 5e serait du bruit, et l'absence d'onglet dit mieux que n'importe quel
 * message que ce n'est pas son année.
 *
 * « Mes erreurs » n'est plus un onglet : la file de la matière se lance depuis
 * le bandeau « À revoir » en tête du programme, et le CHAPITRE porte ses
 * propres erreurs dans ses tuiles — là où on décide quoi travailler.
 */
export function modesFor(grade: string | null | undefined): ModeTab[] {
  const tabs: ModeTab[] = [
    // « Programme » plutôt que « Chapitres » : c'est le mot de l'élève et celui
    // du BO — la liste ne dit pas un type d'objet, elle dit l'année à couvrir.
    { key: 'programme', label: 'Programme' },
    // La manette : c'est l'onglet qui se JOUE (boss, jeux de l'arène, défis).
    { key: 'jeu', label: 'Mode de jeu', icon: 'manette' },
  ]
  if (isExamYear(grade)) tabs.push({ key: 'annales', label: 'Annales' })
  return tabs
}

// Anciennes clés d'URL (`?onglet=boss`, `?onglet=quiz`… depuis la feuille Modes
// de jeu et les liens déjà partagés), les noms d'onglets d'avant le renommage,
// et « erreurs » qui n'a plus d'onglet : toutes restent valides et retombent
// sur l'onglet qui porte désormais leur contenu. Valeur inconnue — ou onglet
// absent pour cette classe — → undefined, c'est-à-dire Programme.
const LEGACY_MODE_ALIASES: Record<string, ModeKey> = {
  chapitres: 'programme',
  erreurs: 'programme',
  entrainement: 'jeu',
  quiz: 'jeu',
  flashcards: 'jeu',
  cartes: 'jeu',
  defis: 'jeu',
  boss: 'jeu',
}

export function modeFromParam(
  raw: string | undefined,
  modes: ModeTab[],
): ModeKey | undefined {
  if (!raw) return undefined
  const key = modes.some((m) => m.key === raw)
    ? (raw as ModeKey)
    : LEGACY_MODE_ALIASES[raw]
  // Un onglet que cette classe n'a pas (annales en 4e) ne s'ouvre pas.
  return key && modes.some((m) => m.key === key) ? key : undefined
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

// ---------------------------------------------------------------------------
// Le chapitre où l'élève doit cliquer.
//
// Une liste de 28 chapitres sans point d'entrée est un mur : l'ancien CTA
// « Commencer » ne se posait QUE sur le chapitre 1 d'un élève 100 % neuf et
// disparaissait au premier quiz. Ici il y a toujours exactement UNE ligne mise
// en avant, tant qu'il reste quelque chose à faire.

export type ResumeCta = { chapterId: string; label: string }

export const RESUME_LABELS = {
  reprendre: 'Reprendre',
  commencer: 'Commencer',
} as const

/**
 * Le chapitre à reprendre : le premier commencé mais pas fini (« Reprendre »),
 * sinon le premier jamais ouvert (« Commencer »). Tout complété → aucun CTA,
 * la matière est finie et le mettre en avant serait mentir.
 */
export function resumeCta(
  chapters: { id: string; status: ChapterStatus }[],
): ResumeCta | null {
  const enCours = chapters.find((c) => c.status === 'en_cours')
  if (enCours) return { chapterId: enCours.id, label: RESUME_LABELS.reprendre }
  const neuf = chapters.find((c) => c.status === 'non_commence')
  if (neuf) return { chapterId: neuf.id, label: RESUME_LABELS.commencer }
  return null
}

// ---------------------------------------------------------------------------
// Durée d'un chapitre.
//
// « ~6 min » avant de cliquer : le premier levier d'engagement en révision
// mobile — l'élève doit savoir dans quoi il s'engage, pas le découvrir.

export const READING_WPM = 180 // lecture d'un cours, collège/lycée
export const SECONDS_PER_QUESTION = 30

/**
 * Durée estimée d'un chapitre, en minutes : le temps de lecture de ses cours
 * plus le temps de ses questions. `null` quand il n'y a rien à estimer — mieux
 * vaut pas de durée qu'une durée inventée.
 */
export function estimateMinutes(input: {
  words: number
  questions: number
}): number | null {
  if (input.words <= 0 && input.questions <= 0) return null
  const minutes =
    input.words / READING_WPM + (input.questions * SECONDS_PER_QUESTION) / 60
  return Math.max(1, Math.round(minutes))
}

export function minutesLabel(minutes: number): string {
  return `~${minutes} min`
}

/** Compte de mots d'un cours, tolérant au markdown et au contenu vide. */
export function countWords(content: string | null | undefined): number {
  if (!content) return 0
  const words = content.trim().split(/\s+/).filter(Boolean)
  return words.length
}

// ---------------------------------------------------------------------------
// Bandeau « Examen blanc ».
//
// Il était le PREMIER élément cliquable de la page, y compris pour un élève à
// 0 % : proposer l'épreuve finale à quelqu'un qui n'a pas ouvert un chapitre.
// Il ne monte en tête que lorsqu'il a du sens ; sinon il descend en pied de
// liste, où il reste trouvable sans détourner du chapitre à faire.

export const EXAM_BANNER_MIN_PCT = 30
export const EXAM_BANNER_EXAM_DAYS = 14

/**
 * Le bandeau mérite-t-il la tête de page ? Oui si l'élève a de quoi être évalué
 * (≥ 30 % de la matière), ou si un contrôle approche (≤ 14 jours) — auquel cas
 * l'examen blanc est exactement ce qu'il cherche.
 */
export function examBannerOnTop(
  pct: number,
  daysToExam: number | null,
): boolean {
  if (pct >= EXAM_BANNER_MIN_PCT) return true
  return daysToExam !== null && daysToExam <= EXAM_BANNER_EXAM_DAYS
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
  /** Durée estimée du chapitre (« ~6 min »), `null` s'il n'y a rien à estimer. */
  minutes: number | null
  /** Axe / thème du programme (migration 234), `null` si la base ne l'a pas. */
  theme: string | null
}

// ---------------------------------------------------------------------------
// Regroupement par axe du programme.
//
// 28 chapitres à plat, c'est une liste qu'on ne relit pas. Les programmes sont
// déjà écrits en axes (les 8 axes d'anglais Tle, les thèmes d'histoire…) : on
// leur rend leurs sections. Sans la colonne `theme` en base, un seul groupe
// anonyme — l'affichage à plat d'avant, sans régression.

export type ChapterGroup = {
  /** `null` = groupe implicite, rendu sans en-tête (aucun thème en base). */
  theme: string | null
  chapters: ChapterRow[]
}

export function groupChaptersByTheme(chapters: ChapterRow[]): ChapterGroup[] {
  if (chapters.length === 0) return []
  if (chapters.every((c) => !c.theme)) return [{ theme: null, chapters }]

  const groups: ChapterGroup[] = []
  const byTheme = new Map<string, ChapterGroup>()
  for (const chapter of chapters) {
    const theme = chapter.theme || null
    // Les chapitres sans thème d'une matière qui en a se rangent ensemble, à
    // leur place d'apparition — pas dans un fourre-tout final qui casserait
    // l'ordre du programme.
    const key = theme ?? ' sans-theme'
    let group = byTheme.get(key)
    if (!group) {
      group = { theme, chapters: [] }
      byTheme.set(key, group)
      groups.push(group)
    }
    group.chapters.push(chapter)
  }
  return groups
}

/** Le groupe à ouvrir à l'arrivée : celui qui porte le chapitre à reprendre. */
export function openGroupIndex(
  groups: ChapterGroup[],
  resume: ResumeCta | null,
): number {
  if (!resume) return 0
  const index = groups.findIndex((g) =>
    g.chapters.some((c) => c.id === resume.chapterId),
  )
  return index >= 0 ? index : 0
}

// ---------------------------------------------------------------------------
// Onglet « S'entraîner » : un chapitre par ligne, ses formats en pastilles.

export type SupportKind =
  | 'cours'
  | 'quiz'
  | 'flashcards'
  | 'carte'
  | 'defi'
  | 'erreurs'

export type SupportChip = {
  kind: SupportKind
  label: string
  /** État lisible : « 7/10 », « 12 cartes · 4 à revoir », « Débloquer »… */
  meta: string
  /**
   * Version COURTE de l'état, pour la pastille posée sous l'icône des tuiles
   * carrées (« 7/10 », « --/10 », « 4 à revoir »). `null` = rien à dire : la
   * tuile porte alors juste son icône, ou la coche si c'est fait. Le `meta`
   * long, lui, sert la liste de l'onglet « S'entraîner », qui a la place.
   */
  badge: string | null
  href: string
  done: boolean
  locked?: boolean
  /** Récompense promise AVANT de jouer (« +20 XP »), miroir de lib/wallet. */
  xp?: number
}

export const SUPPORT_LABELS: Record<SupportKind, string> = {
  cours: 'Cours',
  quiz: 'Quiz',
  flashcards: 'Flashcards',
  carte: 'Carte mentale',
  defi: 'Défi',
  erreurs: 'Mes erreurs',
}

export type TrainingRow = {
  chapterId: string
  position: number
  title: string
  chips: SupportChip[]
}

// ---------------------------------------------------------------------------
// Libellés d'état des contenus.

// Quiz : « 7/10 » (meilleur essai) ou « Jamais tenté ».
export function quizMeta(
  best: { score: number; total: number } | null,
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

// --- Pastilles courtes des tuiles carrées -----------------------------------

/**
 * Quiz : « 7/10 » quand il a été joué, « --/10 » sinon — le barème se lit AVANT
 * de cliquer, et la case vide dit qu'il reste à faire. `null` si le quiz n'a
 * aucune question à annoncer.
 */
export function quizBadge(
  best: { score: number; total: number } | null,
  questionCount: number,
): string | null {
  if (best && best.total > 0) return `${best.score}/${best.total}`
  return questionCount > 0 ? `--/${questionCount}` : null
}

/** Flashcards : la file du jour si elle existe (c'est ce qui presse), sinon le paquet. */
export function flashcardsBadge(
  cardCount: number,
  dueCount: number,
): string | null {
  if (dueCount > 0) return `${dueCount} à revoir`
  return cardCount > 0 ? `${cardCount} carte${cardCount > 1 ? 's' : ''}` : null
}

/** Mes erreurs : le nombre de notions du chapitre qui attendent dans la file. */
export function erreursMeta(count: number): string {
  return `${count} notion${count > 1 ? 's' : ''} à revoir`
}

export function erreursBadge(count: number): string | null {
  return count > 0 ? `${count} à revoir` : null
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

export type SubjectTemplateData = {
  subject: { slug: string; name: string; color: string }
  /** Libellé long du programme affiché en clair (« 3e », « Terminale »). */
  grade: string
  /**
   * Niveau brut de l'élève (`profiles.grade_level`), qui sert à NOMMER la
   * cohorte du classement (« des 3e »). Distinct de `grade`, qui est le
   * programme suivi et peut être écrit autrement.
   */
  gradeLevel: string | null
  /**
   * Place de l'élève dans cette matière parmi son niveau. `null` quand il n'y a
   * rien d'honnête à annoncer — pas assez de quiz passés, ou cohorte trop
   * petite pour un pourcentage (docs/CADRAGE-PERCENTILE.md).
   */
  standing: Standing | null
  progress: SubjectProgress
  /** Le chapitre mis en avant (« Reprendre » / « Commencer »), s'il en reste. */
  resume: ResumeCta | null
  /** Le bandeau « Examen blanc » a-t-il gagné sa place en tête de page ? */
  examOnTop: boolean
  weakCount: number
  // Économie affichée en haut à droite du header : solde de gemmes 💎 et
  // série 🔥 (la même série dérivée que la flamme de l'accueil Réviser).
  gems: number
  streak: number
  chapters: ChapterRow[]
  /** Onglet « S'entraîner » : un chapitre par ligne, ses formats en pastilles. */
  training: TrainingRow[]
  // Onglet « Boss » : pool de questions 100 % matière pour affronter le boss
  // de la matière (le même de la 6e à la Terminale — bossForSubject côté client).
  bossPool: ModeQuestion[]
}
