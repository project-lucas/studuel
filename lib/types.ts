// Types du module Test (miroir des tables supabase/002_quizzes.sql).

export type Quiz = {
  id: string
  title: string
  subject: string
  grade_level: string | null
  chapter: string | null
  is_free: boolean
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
