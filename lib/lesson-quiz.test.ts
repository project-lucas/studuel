import { describe, expect, test } from 'vitest'
import { pickLessonQuiz, quizSourceLabel, type ChapterQuiz } from './lesson-quiz'

const quizA: ChapterQuiz = { id: 'q-a', lesson_id: 'l1', is_free: true }
const quizB: ChapterQuiz = { id: 'q-b', lesson_id: 'l2', is_free: false }

describe('pickLessonQuiz', () => {
  test('prend le quiz de la leçon quand elle en a un', () => {
    const pick = pickLessonQuiz('l1', ['l1', 'l2'], [quizA, quizB])
    expect(pick).toEqual({ quizId: 'q-a', isFree: true, source: 'lesson' })
  })

  test('emprunte le quiz du chapitre quand la leçon n’en a pas', () => {
    const pick = pickLessonQuiz('l2', ['l1', 'l2'], [quizA])
    expect(pick).toEqual({ quizId: 'q-a', isFree: true, source: 'chapter' })
  })

  test('emprunte la PREMIÈRE leçon du chapitre qui a un quiz (déterministe)', () => {
    const quizC: ChapterQuiz = { id: 'q-c', lesson_id: 'l3', is_free: true }
    const pick = pickLessonQuiz('l1', ['l1', 'l2', 'l3'], [quizC, quizB])
    // l2 vient avant l3 dans l'ordre d'affichage : c'est son quiz qu'on emprunte.
    expect(pick).toEqual({ quizId: 'q-b', isFree: false, source: 'chapter' })
  })

  test('reporte le is_free du quiz emprunté (le paywall suit la source)', () => {
    const pick = pickLessonQuiz('l1', ['l1', 'l2'], [quizB])
    expect(pick).toEqual({ quizId: 'q-b', isFree: false, source: 'chapter' })
  })

  test('renvoie null quand aucun quiz n’existe dans tout le chapitre', () => {
    expect(pickLessonQuiz('l1', ['l1', 'l2'], [])).toBeNull()
  })

  test('ignore les quiz orphelins (lesson_id null)', () => {
    const orphelin: ChapterQuiz = { id: 'q-o', lesson_id: null, is_free: true }
    expect(pickLessonQuiz('l1', ['l1', 'l2'], [orphelin])).toBeNull()
  })

  test('ne s’emprunte jamais à elle-même', () => {
    // Cas dégénéré : un seul id, aucun quiz rattaché.
    expect(pickLessonQuiz('l1', ['l1'], [])).toBeNull()
  })
})

describe('quizSourceLabel', () => {
  test('nomme l’emprunt', () => {
    expect(quizSourceLabel('chapter', 'Les fractions')).toBe(
      'Questions du chapitre · Les fractions',
    )
  })

  test('ne dit rien quand le quiz est bien celui de la leçon', () => {
    expect(quizSourceLabel('lesson', 'Les fractions')).toBeNull()
  })
})
