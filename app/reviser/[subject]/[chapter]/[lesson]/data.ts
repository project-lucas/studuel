import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CHAPTER_COLUMNS, type Subject, type Chapter, type Lesson } from '@/lib/types'

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

  // select('*') sur la leçon : tolère une base où la migration 025 n'est pas
  // encore passée (revision_sheet / studygram_url absents → undefined).
  // Sur le chapitre en revanche, colonnes explicites : `*` inclurait `mind_map`,
  // dont la lecture est révoquée (contenu payant, migration 182).
  type Row = Lesson & { chapter: (Chapter & { subject: Subject }) | null }
  const { data: row } = await supabase
    .from('lessons')
    .select(`*, chapter:chapters!inner(${CHAPTER_COLUMNS}, subject:subjects!inner(*))`)
    .eq('id', lessonId)
    .eq('chapter_id', chapterId)
    .maybeSingle<Row>()

  if (!row?.chapter?.subject || row.chapter.subject.slug !== slug) notFound()
  const { chapter: chapterRow, ...lesson } = row
  const { subject, ...chapter } = chapterRow

  return { supabase, user, subject, chapter, lesson: lesson as Lesson }
}
