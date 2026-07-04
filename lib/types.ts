// Types du module Test (miroir des tables supabase/002_quizzes.sql).

export type Quiz = {
  id: string
  title: string
  subject: string
  grade_level: string | null
  chapter: string | null
  is_free: boolean
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
