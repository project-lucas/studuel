import type { SupabaseClient } from '@supabase/supabase-js'
import { buildChapterSupports, type SupportLesson } from '@/lib/chapter-supports'
import { mindMapFromLessons } from '@/lib/mind-map-auto'
import { getReviewItems } from '@/lib/srs'
import { canAccessPremiumTests, getUserTierFor } from '@/lib/subscription'
import { canOpenChapter } from '@/lib/gems'
import { fetchUnlockedChapters } from '@/lib/gems-access'
import type { SupportChip } from '@/lib/subject-template'
import type { Chapter } from '@/lib/types'

/**
 * Les supports d'un chapitre : Cours · Fiche · Flashcards · Quiz · Exercice ·
 * Moi vs IA, avec leur état. Données du CHAPITRE, servies à ses deux écrans :
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

  const [
    { data: questions },
    { data: sessions },
    { data: copies },
    { data: lues },
    reviewItems,
    tier,
    unlocked,
    { data: cahier },
    { data: cahierReussis },
  ] = await Promise.all([
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
      // Les copies rendues sur l'exercice du chapitre (migration 360) : la
      // meilleure note fait la pastille de la tuile. Tant que la migration
      // n'est pas passée, la table manque et `data` est nul — la tuile dit
      // alors « --/20 », elle ne casse rien.
      supabase
        .from('chapter_exercice_reponses')
        .select('note, sur')
        .eq('user_id', userId)
        .eq('chapter_id', chapter.id)
        .returns<{ note: number; sur: number }[]>(),
      // Les leçons DÉJÀ TERMINÉES du chapitre : c'est ce qui coche la tuile
      // « Cours ». Bornée aux leçons de ce chapitre, donc une lecture courte.
      supabase
        .from('lesson_completions')
        .select('lesson_id')
        .eq('user_id', userId)
        .in(
          'lesson_id',
          rows.map((l) => l.id),
        )
        .returns<{ lesson_id: string }[]>(),
      getReviewItems(supabase, userId),
      getUserTierFor(supabase, userId),
      fetchUnlockedChapters(supabase, userId),
      // Le cahier d'exercices du chapitre (migration 372) et ceux que l'élève
      // a réussis. Tables absentes = `data` nul : la tuile reste sur le
      // contrôle blanc, rien ne casse.
      supabase
        .from('exercices')
        .select('id')
        .eq('chapter_id', chapter.id)
        .returns<{ id: string }[]>(),
      supabase
        .from('exercice_resultats')
        .select('exercice_id')
        .eq('user_id', userId)
        .eq('chapter_id', chapter.id)
        .eq('reussi', true)
        .returns<{ exercice_id: string }[]>(),
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

  const lecons_lues = new Set((lues ?? []).map((l) => l.lesson_id))

  // La meilleure copie : la note la plus haute, rapportée à son barème.
  let meilleureCopie: { note: number; sur: number } | null = null
  for (const c of copies ?? []) {
    if (!(c.sur > 0)) continue
    if (!meilleureCopie || c.note / c.sur > meilleureCopie.note / meilleureCopie.sur)
      meilleureCopie = { note: c.note, sur: c.sur }
  }

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
      ownQuiz: ownQuizId !== null,
      read: lecons_lues.has(l.id),
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
      exercice: {
        best: meilleureCopie,
        premium: canAccessPremiumTests(tier),
        cahier: cahier?.length
          ? {
              total: cahier.length,
              reussis: (cahierReussis ?? []).filter((r) => cahier.some((e) => e.id === r.exercice_id)).length,
            }
          : null,
      },
    },
    lessonId,
  )
}
