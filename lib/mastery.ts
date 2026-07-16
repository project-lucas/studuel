import type { SupabaseClient } from '@supabase/supabase-js'

// Progression par chapitre :
// - quiz terminé → meilleur score (0..1), seul moyen de dépasser 30 %
// - leçon terminée → plancher de 30 % (LESSON_FLOOR)
// L'élève voit que chaque geste paye, et la source distingue les états
// (une leçon lue n'est pas un quiz raté : pas de « fragile » injustifié).

export const LESSON_FLOOR = 0.3
export const MASTERY_THRESHOLDS = { mastered: 0.8, fragile: 0.5 } as const

export type ChapterProgress = {
  value: number // 0..1, ce qui remplit les barres
  quizAttempted: boolean
  lessonDone: boolean
}

export type ChapterMastery = Map<string, ChapterProgress>

export type ChapterState = 'maitrise' | 'en_cours' | 'fragile' | 'a_commencer'

export function chapterState(p: ChapterProgress | undefined): ChapterState {
  // « À commencer » = aucun geste posé. Un quiz TENTÉ (même échoué 0/10) est une
  // progression : il doit remonter en « fragile » (priorité à revoir), pas se
  // faire masquer — sinon l'élève en difficulté disparaît du radar.
  if (!p || (p.value === 0 && !p.lessonDone && !p.quizAttempted))
    return 'a_commencer'
  if (!p.quizAttempted) return 'en_cours' // leçon lue, quiz pas encore tenté
  if (p.value >= MASTERY_THRESHOLDS.mastered) return 'maitrise'
  if (p.value >= MASTERY_THRESHOLDS.fragile) return 'en_cours'
  return 'fragile' // quiz tenté mais < 50 % : à retravailler en priorité
}

// Rang de maîtrise façon jeu compétitif — même donnée que chapterState, mais
// présentée comme un rang à monter. Au-delà de « maîtrisé » (or), deux rangs
// de prestige tirent vers l'excellence : diamant (≥ 90 %) et légendaire (100 %).
// Le bronze récompense le premier geste (leçon lue) ; les rangs supérieurs
// exigent un quiz — lire ne suffit pas pour grimper.

export type MasteryRank = 'bronze' | 'argent' | 'or' | 'diamant' | 'legendaire'

// Habillage des rangs pour l'UI (carnet, célébrations…) : un seul vocabulaire
// visuel pour toute l'app.
export const MASTERY_RANK_LABEL: Record<MasteryRank, string> = {
  bronze: 'Bronze',
  argent: 'Argent',
  or: 'Or',
  diamant: 'Diamant',
  legendaire: 'Légendaire',
}

export const MASTERY_RANK_EMOJI: Record<MasteryRank, string> = {
  bronze: '🥉',
  argent: '🥈',
  or: '🥇',
  diamant: '💎',
  legendaire: '🏆',
}

// Rang d'une valeur agrégée (moyenne de matière, 0..1) — mêmes paliers que
// masteryRank, sans la nuance leçon/quiz qui n'a pas de sens sur une moyenne.
// null tant que rien n'est commencé (pas de rang « vide » culpabilisant).
export function rankForValue(value: number): MasteryRank | null {
  if (value <= 0) return null
  if (value >= 1) return 'legendaire'
  if (value >= 0.9) return 'diamant'
  if (value >= MASTERY_THRESHOLDS.mastered) return 'or'
  if (value >= MASTERY_THRESHOLDS.fragile) return 'argent'
  return 'bronze'
}

export function masteryRank(
  p: ChapterProgress | undefined,
): MasteryRank | null {
  // Idem chapterState : un quiz tenté à 0 vaut « bronze », pas « pas de rang ».
  if (!p || (p.value === 0 && !p.lessonDone && !p.quizAttempted)) return null
  if (!p.quizAttempted) return 'bronze'
  if (p.value >= 1) return 'legendaire'
  if (p.value >= 0.9) return 'diamant'
  if (p.value >= MASTERY_THRESHOLDS.mastered) return 'or'
  if (p.value >= MASTERY_THRESHOLDS.fragile) return 'argent'
  return 'bronze'
}

export async function getChapterMastery(
  supabase: SupabaseClient,
  userId: string,
): Promise<ChapterMastery> {
  const mastery: ChapterMastery = new Map()

  // user_id explicite : la RLS le garantit aujourd'hui, mais la couche sociale
  // ouvrira la lecture croisée des sessions — la maîtrise reste personnelle.
  const [{ data: sessions }, { data: completions }] = await Promise.all([
    supabase
      .from('test_sessions')
      .select('quiz_id, score, total')
      .eq('user_id', userId)
      .returns<{ quiz_id: string | null; score: number; total: number }[]>(),
    supabase
      .from('lesson_completions')
      .select('lesson_id')
      .eq('user_id', userId)
      .returns<{ lesson_id: string }[]>(),
  ])

  // Meilleur score par quiz.
  const bestByQuiz = new Map<string, number>()
  for (const s of sessions ?? []) {
    if (!s.quiz_id || s.total <= 0) continue
    const ratio = Math.min(s.score / s.total, 1)
    bestByQuiz.set(s.quiz_id, Math.max(bestByQuiz.get(s.quiz_id) ?? 0, ratio))
  }

  // Quiz → leçon.
  const quizLessons = new Map<string, string>()
  if (bestByQuiz.size > 0) {
    const { data: quizzes } = await supabase
      .from('quizzes')
      .select('id, lesson_id')
      .in('id', [...bestByQuiz.keys()])
      .returns<{ id: string; lesson_id: string | null }[]>()
    for (const q of quizzes ?? []) {
      if (q.lesson_id) quizLessons.set(q.id, q.lesson_id)
    }
  }

  // Toutes les leçons concernées (quiz joués + leçons terminées) → chapitre.
  const completedLessons = new Set((completions ?? []).map((c) => c.lesson_id))
  const allLessonIds = Array.from(
    new Set([...quizLessons.values(), ...completedLessons]),
  )
  if (allLessonIds.length === 0) return mastery

  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, chapter_id')
    .in('id', allLessonIds)
    .returns<{ id: string; chapter_id: string }[]>()
  const chapterByLesson = new Map(
    (lessons ?? []).map((l) => [l.id, l.chapter_id]),
  )

  const upsert = (chapterId: string, patch: Partial<ChapterProgress>) => {
    const current = mastery.get(chapterId) ?? {
      value: 0,
      quizAttempted: false,
      lessonDone: false,
    }
    mastery.set(chapterId, {
      value: Math.max(current.value, patch.value ?? 0),
      quizAttempted: current.quizAttempted || (patch.quizAttempted ?? false),
      lessonDone: current.lessonDone || (patch.lessonDone ?? false),
    })
  }

  // Scores de quiz.
  for (const [quizId, ratio] of bestByQuiz) {
    const lessonId = quizLessons.get(quizId)
    if (!lessonId) continue
    const chapterId = chapterByLesson.get(lessonId)
    if (!chapterId) continue
    upsert(chapterId, { value: ratio, quizAttempted: true })
  }

  // Plancher des leçons terminées.
  for (const lessonId of completedLessons) {
    const chapterId = chapterByLesson.get(lessonId)
    if (!chapterId) continue
    upsert(chapterId, { value: LESSON_FLOOR, lessonDone: true })
  }

  return mastery
}
