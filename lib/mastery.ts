import type { SupabaseClient } from '@supabase/supabase-js'

// Maîtrise par chapitre : meilleur score obtenu (0..1) sur les quiz du
// chapitre (chaîne session → quiz → leçon → chapitre). Un 80 % fait avancer
// la barre de 0,8 chapitre : l'élève voit que chaque quiz paye.

export type ChapterMastery = Map<string, number>

// Seuils d'état d'un chapitre.
export const MASTERY_THRESHOLDS = { mastered: 0.8, fragile: 0.5 } as const

export type ChapterState = 'maitrise' | 'en_cours' | 'fragile' | 'a_commencer'

export function chapterState(mastery: number | undefined): ChapterState {
  if (mastery === undefined) return 'a_commencer'
  if (mastery >= MASTERY_THRESHOLDS.mastered) return 'maitrise'
  if (mastery >= MASTERY_THRESHOLDS.fragile) return 'en_cours'
  return 'fragile'
}

export async function getChapterMastery(
  supabase: SupabaseClient,
): Promise<ChapterMastery> {
  const mastery: ChapterMastery = new Map()

  const { data: sessions } = await supabase
    .from('test_sessions')
    .select('quiz_id, score, total')
    .returns<{ quiz_id: string | null; score: number; total: number }[]>()

  const bestByQuiz = new Map<string, number>()
  for (const s of sessions ?? []) {
    if (!s.quiz_id || s.total <= 0) continue
    const ratio = Math.min(s.score / s.total, 1)
    bestByQuiz.set(s.quiz_id, Math.max(bestByQuiz.get(s.quiz_id) ?? 0, ratio))
  }
  if (bestByQuiz.size === 0) return mastery

  const { data: quizzes } = await supabase
    .from('quizzes')
    .select('id, lesson_id')
    .in('id', [...bestByQuiz.keys()])
    .returns<{ id: string; lesson_id: string | null }[]>()

  const lessonIds = (quizzes ?? [])
    .map((q) => q.lesson_id)
    .filter((l): l is string => l !== null)
  if (lessonIds.length === 0) return mastery

  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, chapter_id')
    .in('id', lessonIds)
    .returns<{ id: string; chapter_id: string }[]>()

  const chapterByLesson = new Map(
    (lessons ?? []).map((l) => [l.id, l.chapter_id]),
  )

  for (const q of quizzes ?? []) {
    if (!q.lesson_id) continue
    const chapterId = chapterByLesson.get(q.lesson_id)
    if (!chapterId) continue
    const ratio = bestByQuiz.get(q.id) ?? 0
    mastery.set(chapterId, Math.max(mastery.get(chapterId) ?? 0, ratio))
  }

  return mastery
}
