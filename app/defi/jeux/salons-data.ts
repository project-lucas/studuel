import type { SupabaseClient } from '@supabase/supabase-js'
import { getChapterMastery } from '@/lib/mastery'
import { salonStates, type SalonState } from '@/lib/jeux/catalog'

// États de déblocage des salons pour un élève : on relie les quiz de sa
// classe à leurs chapitres (via les leçons), puis la maîtrise par chapitre
// décide (lib/jeux/catalog). Partagé entre la page de l'espace Jeux et les
// pages de jeu — le déblocage est vérifié CÔTÉ SERVEUR, un lien profond ne
// suffit pas à entrer dans un salon fermé.
export async function getSalonBoard(
  supabase: SupabaseClient,
  userId: string,
  grade: string,
): Promise<Map<string, SalonState>> {
  const [mastery, { data: quizzes }] = await Promise.all([
    getChapterMastery(supabase, userId),
    supabase
      .from('quizzes')
      .select('id, subject, lesson_id')
      .eq('grade_level', grade)
      .returns<{ id: string; subject: string; lesson_id: string | null }[]>(),
  ])

  const lessonIds = Array.from(
    new Set(
      (quizzes ?? [])
        .map((q) => q.lesson_id)
        .filter((l): l is string => !!l),
    ),
  )

  const chapterByLesson = new Map<string, string>()
  if (lessonIds.length > 0) {
    const { data: lessons } = await supabase
      .from('lessons')
      .select('id, chapter_id')
      .in('id', lessonIds)
      .returns<{ id: string; chapter_id: string }[]>()
    for (const l of lessons ?? []) {
      chapterByLesson.set(l.id, l.chapter_id)
    }
  }

  // Chapitres (avec quiz) par matière — la surface sur laquelle un élève
  // peut faire ses preuves.
  const chaptersBySubject = new Map<string, string[]>()
  for (const q of quizzes ?? []) {
    const chapterId = q.lesson_id ? chapterByLesson.get(q.lesson_id) : undefined
    if (!chapterId || !q.subject) continue
    const list = chaptersBySubject.get(q.subject) ?? []
    if (!list.includes(chapterId)) {
      chaptersBySubject.set(q.subject, [...list, chapterId])
    }
  }

  return salonStates(chaptersBySubject, mastery)
}
