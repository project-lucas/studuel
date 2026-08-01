import { notFound, redirect } from 'next/navigation'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { pickLessonQuiz, type ChapterQuiz, type LessonQuizPick } from '@/lib/lesson-quiz'
import {
  CHAPTER_COLUMNS,
  LESSON_COLUMNS,
  type Subject,
  type Chapter,
  type Lesson,
} from '@/lib/types'

// Contexte commun du hub de leçon et de ses supports (cours, révision,
// studygram) : élève connecté + triplet matière/chapitre/leçon cohérent.
// Une seule requête : le chapitre et la matière sont embarqués dans la leçon
// (jointures PostgREST), le slug est vérifié côté serveur.
export async function loadLessonContext(
  slug: string,
  chapterId: string,
  lessonId: string,
) {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  // Colonnes explicites des DEUX côtés : un `*` sur la leçon inclurait
  // `revision_sheet` (fiche = contenu payant, révoquée par la migration 185) et
  // un `*` sur le chapitre inclurait `mind_map` (révoquée par la 182) — dans
  // les deux cas PostgREST répondrait « permission denied » et casserait tout
  // le hub de leçon. Le contenu de la fiche se lit à part, par la RPC gardée
  // (`lib/revision-access.ts`).
  type Row = Lesson & { chapter: (Chapter & { subject: Subject }) | null }
  const { data: row } = await supabase
    .from('lessons')
    .select(
      `${LESSON_COLUMNS}, chapter:chapters!inner(${CHAPTER_COLUMNS}, subject:subjects!inner(*))`,
    )
    .eq('id', lessonId)
    .eq('chapter_id', chapterId)
    .maybeSingle<Row>()

  if (!row?.chapter?.subject || row.chapter.subject.slug !== slug) notFound()
  const { chapter: chapterRow, ...lesson } = row
  const { subject, ...chapter } = chapterRow

  return { supabase, user, subject, chapter, lesson: lesson as Lesson }
}

// Le quiz qui alimente les supports de la leçon (flashcards, défi de leçon).
//
// On regarde TOUT le chapitre, pas la seule leçon : la base compte 564 leçons
// pour 295 quiz, donc une leçon sur deux n'a pas le sien et affichait un
// « bientôt ». La règle de choix (et le fait qu'un emprunt se dise) vit dans
// `lib/lesson-quiz.ts`, testée.
export async function loadLessonQuiz(
  supabase: SupabaseClient,
  chapterId: string,
  lessonId: string,
): Promise<LessonQuizPick | null> {
  const { data: lessons } = await supabase
    .from('lessons')
    .select('id')
    .eq('chapter_id', chapterId)
    .order('position', { ascending: true })
    .order('title', { ascending: true })
    .returns<{ id: string }[]>()

  const ids = (lessons ?? []).map((l) => l.id)
  if (ids.length === 0) return null

  const { data: quizzes } = await supabase
    .from('quizzes')
    .select('id, lesson_id, is_free')
    .in('lesson_id', ids)
    .returns<ChapterQuiz[]>()

  return pickLessonQuiz(lessonId, ids, quizzes ?? [])
}
