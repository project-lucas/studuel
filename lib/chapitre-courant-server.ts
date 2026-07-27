import type { SupabaseClient } from '@supabase/supabase-js'
import { getChapterMastery } from '@/lib/mastery'
import {
  getGradeQuizzesCached,
  getLessonChapterPairsCached,
  getChapterTitlesCached,
  getQuizQuestionCountsCached,
} from '@/lib/catalog'
import { toDayKey } from '@/lib/streak'
import { rowsToControles, type ControleRow, type SessionRow } from '@/lib/prep-plan'
import {
  pickCurrentChapter,
  type ChapterCandidate,
  type CurrentChapter,
} from '@/lib/chapitre-courant'
import { DUEL_MIN_QUESTIONS } from '@/lib/duel90'
import { HORS_NIVEAU } from '@/lib/types'

// Résolution SERVEUR du « chapitre en cours ». La décision elle-même est pure
// et testée dans lib/chapitre-courant ; ce module ne fait que rassembler les
// données. Il vit à part pour que /defi (qui n'affiche que la RAISON) et
// /defi/duel (qui a besoin des questions) prennent EXACTEMENT la même décision
// — deux résolutions concurrentes annonceraient un chapitre et en joueraient un
// autre.

type QuizRow = { id: string; subject: string; lesson_id: string | null }
type LessonRow = { id: string; chapter_id: string }
type ChapterRow = { id: string; title: string }

export type ResolvedChapter = {
  chapter: CurrentChapter | null
  /** Ids des quiz du chapitre retenu — de quoi charger ses questions. */
  quizIds: string[]
  /** Tous les quiz de la classe : repli quand aucun chapitre n'est jouable. */
  allQuizIds: string[]
}

const EMPTY: ResolvedChapter = { chapter: null, quizIds: [], allQuizIds: [] }

/**
 * Décide du chapitre à jouer maintenant.
 *
 * Ne charge PAS les questions : il ne compte que combien chaque chapitre en a
 * (`id, quiz_id` seulement), ce qui suffit à écarter les chapitres trop maigres
 * sans transporter tout le vivier de la classe.
 */
export async function resolveCurrentChapter(
  supabase: SupabaseClient,
  userId: string,
  grade: string,
  today: string = toDayKey(new Date()),
): Promise<ResolvedChapter> {
  // UNE SEULE VAGUE. La fonction en enchaînait trois — le vivier de quiz, puis
  // les leçons de ces quiz, puis les chapitres et le comptage des questions —
  // alors que TOUT cela relève du catalogue : identique pour tous les élèves
  // d'une même classe. Servi par le cache serveur, il part avec l'historique
  // personnel au lieu de l'attendre.
  const [
    quizzes,
    mastery,
    { data: controleRows },
    { data: sessionRows },
    { data: recentRows },
    lessonChapterPairs,
    chapterTitlePairs,
    questionCountPairs,
  ] = await Promise.all([
    getGradeQuizzesCached(grade, HORS_NIVEAU),
    getChapterMastery(supabase, userId),
    supabase
      .from('controles')
      .select(
        'id, subject_slug, chapters, exam_date, grade, note, note_prompted, snooze_date',
      )
      .eq('user_id', userId)
      .returns<ControleRow[]>(),
    supabase
      .from('sessions_preparation')
      .select(
        'id, controle_id, planned_date, duration_min, chapter_id, status, position',
      )
      .eq('user_id', userId)
      .returns<SessionRow[]>(),
    // « Là où tu t'es arrêté » : les dernières leçons terminées.
    supabase
      .from('lesson_completions')
      .select('lesson_id, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)
      .returns<{ lesson_id: string; created_at: string }[]>(),
    getLessonChapterPairsCached(),
    getChapterTitlesCached(),
    getQuizQuestionCountsCached(),
  ])

  // Repli : cache froid ou migration 026 (lecture anon du catalogue) pas
  // exécutée. Sans lui, le catalogue vide se lirait « aucun chapitre jouable »
  // et le CTA du Défi disparaîtrait en silence — on repasse donc par le client
  // authentifié, exactement comme avant la mise en cache.
  let quizList = quizzes
  if (quizList.length === 0) {
    const { data } = await supabase
      .from('quizzes')
      .select('id, subject, lesson_id')
      .in('grade_level', [grade, HORS_NIVEAU])
      .returns<QuizRow[]>()
    quizList = data ?? []
  }
  if (quizList.length === 0) return EMPTY
  const allQuizIds = quizList.map((q) => q.id)

  let chapterByLesson = new Map(lessonChapterPairs)
  let titleByChapter = new Map(chapterTitlePairs)
  let countByQuiz = new Map(questionCountPairs)
  if (chapterByLesson.size === 0) {
    const lessonIds = [
      ...new Set(
        [
          ...quizList.map((q) => q.lesson_id),
          ...(recentRows ?? []).map((r) => r.lesson_id),
        ].filter((l): l is string => typeof l === 'string' && l.length > 0),
      ),
    ]
    const [{ data: lessons }, { data: chapters }, { data: counts }] =
      await Promise.all([
        lessonIds.length
          ? supabase
              .from('lessons')
              .select('id, chapter_id')
              .in('id', lessonIds)
              .returns<LessonRow[]>()
          : Promise.resolve({ data: [] as LessonRow[] }),
        supabase.from('chapters').select('id, title').returns<ChapterRow[]>(),
        supabase
          .from('quiz_questions')
          .select('quiz_id')
          .in('quiz_id', allQuizIds)
          .returns<{ quiz_id: string }[]>(),
      ])
    chapterByLesson = new Map(
      (lessons ?? []).map((l) => [String(l.id), String(l.chapter_id)]),
    )
    titleByChapter = new Map(
      (chapters ?? []).map((c) => [String(c.id), String(c.title)]),
    )
    countByQuiz = new Map()
    for (const row of counts ?? []) {
      const id = String(row.quiz_id)
      countByQuiz.set(id, (countByQuiz.get(id) ?? 0) + 1)
    }
  }

  // Quiz regroupés par chapitre (et matière du chapitre, pour l'affichage).
  const quizzesByChapter = new Map<string, string[]>()
  const subjectByChapter = new Map<string, string>()
  for (const q of quizList) {
    const chapterId = q.lesson_id ? chapterByLesson.get(q.lesson_id) : undefined
    if (!chapterId) continue
    quizzesByChapter.set(chapterId, [
      ...(quizzesByChapter.get(chapterId) ?? []),
      q.id,
    ])
    if (!subjectByChapter.has(chapterId)) subjectByChapter.set(chapterId, q.subject)
  }
  const chapterIds = [...quizzesByChapter.keys()]
  if (chapterIds.length === 0) return { ...EMPTY, allQuizIds }

  // Comptage : les questions sont déjà comptées PAR QUIZ dans le catalogue en
  // cache ; il ne reste qu'à les additionner par chapitre.
  const countByChapter = new Map<string, number>()
  for (const [chapterId, ids] of quizzesByChapter) {
    let total = 0
    for (const id of ids) total += countByQuiz.get(id) ?? 0
    countByChapter.set(chapterId, total)
  }

  const candidates: ChapterCandidate[] = chapterIds.map((id) => ({
    id,
    title: titleByChapter.get(id) ?? 'Chapitre',
    subject: subjectByChapter.get(id) ?? '',
    questionCount: countByChapter.get(id) ?? 0,
  }))

  const recentChapterIds = [
    ...new Set(
      (recentRows ?? [])
        .map((r) => chapterByLesson.get(r.lesson_id))
        .filter((c): c is string => typeof c === 'string'),
    ),
  ]
  // La maîtrise est une fraction (0..1) côté lib/mastery ; le sélecteur
  // raisonne en pourcentage entier.
  const masteryValues = new Map(
    [...mastery.entries()].map(([id, p]) => [id, Math.round((p.value ?? 0) * 100)]),
  )

  const chapter = pickCurrentChapter({
    candidates,
    controles: rowsToControles(controleRows ?? [], sessionRows ?? []),
    today,
    recentChapterIds,
    mastery: masteryValues,
    minQuestions: DUEL_MIN_QUESTIONS,
  })

  return {
    chapter,
    quizIds: chapter ? (quizzesByChapter.get(chapter.id) ?? []) : [],
    allQuizIds,
  }
}
