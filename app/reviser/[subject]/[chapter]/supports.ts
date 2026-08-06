import type { SupabaseClient } from '@supabase/supabase-js'
import { buildChapterSupports, type SupportLesson } from '@/lib/chapter-supports'
import { mindMapFromLessons } from '@/lib/mind-map-auto'
import { getReviewItems } from '@/lib/srs'
import { getUserTierFor } from '@/lib/subscription'
import { canOpenChapter } from '@/lib/gems'
import { fetchUnlockedChapters } from '@/lib/gems-access'
import type { SupportChip } from '@/lib/subject-template'
import type { Chapter } from '@/lib/types'

/**
 * Les cinq supports d'un chapitre : Cours · Quiz · Flashcards · Carte mentale ·
 * Défi, avec leur état. Données du CHAPITRE, servies à ses deux écrans :
 *
 *  - l'écran de chapitre, où l'élève choisit par quoi il commence (aucune leçon
 *    de référence : rien n'est encore lu) ;
 *  - le pied de cours, calé sur la leçon qu'il vient de lire — la lecture se
 *    terminait en cul-de-sac, il fallait remonter à la page matière, changer
 *    d'onglet et re-scroller pour les flashcards du MÊME chapitre.
 *
 * Tout est lu en parallèle, et chaque source manquante dégrade sa pastille sans
 * jamais faire tomber l'écran qui l'accueille.
 */
export async function loadChapterSupports(
  supabase: SupabaseClient,
  userId: string,
  subjectSlug: string,
  chapter: Chapter,
  /** La leçon lue (pied de cours). Absente = écran de chapitre : rien n'est lu. */
  lessonId?: string,
): Promise<SupportChip[]> {
  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, title, content, position')
    .eq('chapter_id', chapter.id)
    .order('position', { ascending: true })
    .returns<{ id: string; title: string; content: string | null; position: number }[]>()

  const rows = lessons ?? []
  if (rows.length === 0) return []

  const { data: quizzes } = await supabase
    .from('quizzes')
    .select('id, lesson_id')
    .in(
      'lesson_id',
      rows.map((l) => l.id),
    )
    .returns<{ id: string; lesson_id: string }[]>()

  // Quiz PROPRE à chaque leçon, et quiz de repli du chapitre (le premier) —
  // même règle que la page matière : une leçon sur deux n'a pas le sien.
  const ownQuizByLesson = new Map<string, string>()
  for (const q of quizzes ?? []) {
    if (!ownQuizByLesson.has(q.lesson_id)) ownQuizByLesson.set(q.lesson_id, q.id)
  }
  const fallbackQuizId =
    rows.map((l) => ownQuizByLesson.get(l.id)).find(Boolean) ?? null
  const quizIds = [...new Set((quizzes ?? []).map((q) => q.id))]

  const [{ data: questions }, { data: sessions }, { data: defiEvents }, reviewItems, tier, unlocked] =
    await Promise.all([
      quizIds.length
        ? supabase
            .from('quiz_questions')
            .select('id, quiz_id')
            .in('quiz_id', quizIds)
            .returns<{ id: string; quiz_id: string }[]>()
        : Promise.resolve({ data: [] as { id: string; quiz_id: string }[] }),
      quizIds.length
        ? supabase
            .from('test_sessions')
            .select('quiz_id, score, total')
            .eq('user_id', userId)
            .in('quiz_id', quizIds)
            .returns<{ quiz_id: string | null; score: number; total: number }[]>()
        : Promise.resolve({
            data: [] as { quiz_id: string | null; score: number; total: number }[],
          }),
      supabase
        .from('xp_events')
        .select('source_key')
        .eq('user_id', userId)
        .eq('source', 'defi')
        .returns<{ source_key: string | null }[]>(),
      getReviewItems(supabase, userId),
      getUserTierFor(supabase, userId),
      fetchUnlockedChapters(supabase, userId),
    ])

  const questionCountByQuiz = new Map<string, number>()
  const quizByQuestion = new Map<string, string>()
  for (const q of questions ?? []) {
    questionCountByQuiz.set(q.quiz_id, (questionCountByQuiz.get(q.quiz_id) ?? 0) + 1)
    quizByQuestion.set(q.id, q.quiz_id)
  }

  const dueByQuiz = new Map<string, number>()
  for (const item of reviewItems) {
    if (item.item_kind !== 'question') continue
    const quizId = quizByQuestion.get(item.item_id)
    if (quizId) dueByQuiz.set(quizId, (dueByQuiz.get(quizId) ?? 0) + 1)
  }

  const bestByQuiz = new Map<string, { score: number; total: number; ratio: number }>()
  for (const s of sessions ?? []) {
    if (!s.quiz_id || s.total <= 0) continue
    const ratio = Math.min(s.score / s.total, 1)
    const prev = bestByQuiz.get(s.quiz_id)
    if (!prev || ratio > prev.ratio)
      bestByQuiz.set(s.quiz_id, { score: s.score, total: s.total, ratio })
  }

  const defiAttempted = new Set(
    (defiEvents ?? []).flatMap((e) =>
      e.source_key ? [e.source_key.split(':')[0]] : [],
    ),
  )

  const supportLessons: SupportLesson[] = rows.map((l) => {
    const ownQuizId = ownQuizByLesson.get(l.id) ?? null
    const quizId = ownQuizId ?? fallbackQuizId
    return {
      id: l.id,
      title: l.title,
      quizId,
      questionCount: quizId ? (questionCountByQuiz.get(quizId) ?? 0) : 0,
      dueCount: quizId ? (dueByQuiz.get(quizId) ?? 0) : 0,
      best: ownQuizId ? (bestByQuiz.get(ownQuizId) ?? null) : null,
      defiAttempted: defiAttempted.has(l.id),
      ownQuiz: ownQuizId !== null,
    }
  })

  return buildChapterSupports(
    {
      subjectSlug,
      chapterId: chapter.id,
      lessons: supportLessons,
      erreurs: [...dueByQuiz.values()].reduce((sum, n) => sum + n, 0),
      carte: {
        available:
          Boolean(chapter.has_mind_map) ||
          mindMapFromLessons(chapter.title, rows) !== null,
        locked: !canOpenChapter(tier, chapter.id, unlocked),
      },
    },
    lessonId,
  )
}
