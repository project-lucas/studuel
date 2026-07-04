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

export type Chapter = {
  id: string
  subject_id: string
  level: string
  title: string
  position: number
}

export type Lesson = {
  id: string
  chapter_id: string
  title: string
  thumbnail_url: string | null
  content: string | null
  position: number
}

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
