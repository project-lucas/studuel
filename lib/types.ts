// Types du module Test (miroir des tables supabase/002_quizzes.sql).

export type Quiz = {
  id: string
  title: string
  subject: string
  grade_level: string | null
  chapter: string | null
  is_free: boolean
}

// Classes proposées à l'onboarding.
export const GRADE_LEVELS = ['6e', '5e', '4e', '3e', '2de', '1re', 'Tle'] as const
export type GradeLevel = (typeof GRADE_LEVELS)[number]

// Réviser : matières → chapitres → leçons (migration 008).
export type SubjectCategory = 'college' | 'tronc_commun' | 'specialite' | 'option'

export type Subject = {
  id: string
  slug: string
  name: string
  icon: string
  color: string
  category: SubjectCategory
  levels: string[]
}

// Carte mentale d'un chapitre (chapters.mind_map, migration 029).
// Réservée aux abonnés : les gratuits voient la tuile mais ne peuvent pas l'ouvrir.
export type MindMapBranch = { titre: string; enfants: string[] }
export type MindMapData = { centre: string; branches: MindMapBranch[] }

export type Chapter = {
  id: string
  subject_id: string
  level: string
  title: string
  position: number
  // Optionnelle tant que la migration 029 n'est pas exécutée partout.
  mind_map?: MindMapData | null
}

export type Lesson = {
  id: string
  chapter_id: string
  title: string
  thumbnail_url: string | null
  content: string | null
  position: number
  // Supports du template « structure des cours » (migration 025) — optionnels
  // tant que la migration n'est pas exécutée partout.
  revision_sheet?: string | null
  studygram_url?: string | null
}

// Support consulté d'une leçon (table lesson_activities, migration 025).
export type LessonActivityKind = 'revision' | 'studygram'

// Onglet Moi : habitudes, badges, trajets (migration 010).
export type HabitValidationType = 'auto_revision' | 'auto_commute' | 'manual'

export type HabitCatalogEntry = {
  id: string
  title: string
  icon: string
  rationale: string
  validation_type: HabitValidationType
  default_target: Record<string, unknown>
}

export type Habit = {
  id: string
  catalog_id: string
  target: Record<string, unknown>
  created_at: string
  habit_catalog: HabitCatalogEntry | null
}

export type HabitLog = {
  id: string
  habit_id: string
  date: string // 'YYYY-MM-DD'
  completed: boolean
  auto_validated: boolean
}

export type Badge = {
  id: string
  slug: string
  title: string
  description: string
  icon: string
  condition: Record<string, unknown>
}

export type CommuteSlot = { start: string; end: string } // 'HH:MM'

// Flashcards du programme (Studio).
export type FlashcardDeck = {
  id: string
  title: string
  subject: string
  grade_level: string | null
  is_free: boolean
  deck_cards: { count: number }[]
}

export type DeckCard = {
  id: string
  deck_id: string
  front: string
  back: string
  position: number
}

export type StudySession = {
  id: string
  deck_id: string | null
  cards_count: number
  created_at: string
  flashcard_decks: { title: string } | null
}

// Tableau de révision (classes à examen : 3e, 1re, Tle).
export type RevisionPriority = 'normale' | 'prioritaire' | 'critique'
export type RevisionStatus = 'a_faire' | 'en_cours' | 'a_revoir' | 'maitrise'
export type RevisionKind = 'chapitre' | 'texte'

export type RevisionItem = {
  id: string
  subject_id: string
  title: string
  kind: RevisionKind
  status: RevisionStatus
  created_at: string
}

export type RevisionSubject = {
  id: string
  name: string
  exam: string | null
  exam_date: string | null // 'YYYY-MM-DD'
  priority: RevisionPriority
  created_at: string
  revision_items: RevisionItem[]
}

export type TestSession = {
  id: string
  quiz_id: string | null
  score: number
  total: number
  created_at: string
  quizzes: { title: string } | null
}

export type QuizQuestion = {
  id: string
  quiz_id: string
  question: string
  kind: 'mcq' | 'true_false'
  options: string[]
  correct_index: number
  explanation: string | null
  position: number
}
