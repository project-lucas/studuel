import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
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
  const {
    data: { user },
  } = await supabase.auth.getUser()
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
