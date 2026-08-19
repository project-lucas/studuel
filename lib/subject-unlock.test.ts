import { describe, expect, it } from 'vitest'
import {
  CHAPTER_COMPLETE_SCORE,
  isChapterCompleted,
  newlyUnlocked,
  unlockedSubjectSlugs,
  type ChapterSubject,
} from './subject-unlock'
import { LESSON_FLOOR, type ChapterProgress } from './mastery'

function progress(patch: Partial<ChapterProgress> = {}): ChapterProgress {
  return { value: 0, quizAttempted: false, lessonDone: false, ...patch }
}

const CHAPTERS: ChapterSubject[] = [
  { chapterId: 'c1', subjectSlug: 'maths' },
  { chapterId: 'c2', subjectSlug: 'maths' },
  { chapterId: 'c3', subjectSlug: 'histoire-geo' },
  { chapterId: 'c4', subjectSlug: 'anglais' },
]

describe('chapitre terminé', () => {
  it('exige un quiz réussi au seuil', () => {
    expect(isChapterCompleted(progress({ quizAttempted: true, value: 0.7 }))).toBe(true)
    expect(isChapterCompleted(progress({ quizAttempted: true, value: 1 }))).toBe(true)
    expect(isChapterCompleted(progress({ quizAttempted: true, value: 0.69 }))).toBe(false)
  })

  it('refuse une leçon seulement LUE, même si elle pose un plancher', () => {
    // Le piège : `LESSON_FLOOR` remplit la barre sans qu'aucune question ait
    // été posée. Sans la garde `quizAttempted`, un élève ouvrirait le ladder en
    // faisant défiler un cours.
    expect(
      isChapterCompleted(progress({ lessonDone: true, value: LESSON_FLOOR })),
    ).toBe(false)
    // Et même un plancher au-dessus du seuil ne suffirait pas.
    expect(isChapterCompleted(progress({ lessonDone: true, value: 0.95 }))).toBe(false)
  })

  it('refuse un chapitre inconnu', () => {
    expect(isChapterCompleted(undefined)).toBe(false)
  })

  it('garde le seuil au-dessus du hasard d’un QCM', () => {
    expect(CHAPTER_COMPLETE_SCORE).toBeGreaterThan(0.5)
    expect(CHAPTER_COMPLETE_SCORE).toBeLessThan(1)
  })
})

describe('matières ouvertes au classé', () => {
  it('ouvre une matière dès UN chapitre terminé', () => {
    const mastery = new Map([['c2', progress({ quizAttempted: true, value: 0.8 })]])
    expect(unlockedSubjectSlugs(mastery, CHAPTERS)).toEqual(new Set(['maths']))
  })

  it('n’ouvre rien sur un compte neuf', () => {
    expect(unlockedSubjectSlugs(new Map(), CHAPTERS).size).toBe(0)
  })

  it('n’ouvre rien quand tous les quiz sont ratés', () => {
    const mastery = new Map([
      ['c1', progress({ quizAttempted: true, value: 0.3 })],
      ['c3', progress({ quizAttempted: true, value: 0.5 })],
    ])
    expect(unlockedSubjectSlugs(mastery, CHAPTERS).size).toBe(0)
  })

  it('ouvre plusieurs matières indépendamment', () => {
    const mastery = new Map([
      ['c1', progress({ quizAttempted: true, value: 0.9 })],
      ['c4', progress({ quizAttempted: true, value: 0.7 })],
      ['c3', progress({ quizAttempted: true, value: 0.2 })],
    ])
    expect(unlockedSubjectSlugs(mastery, CHAPTERS)).toEqual(
      new Set(['maths', 'anglais']),
    )
  })

  it('ignore un chapitre de maîtrise inconnue au catalogue', () => {
    const mastery = new Map([['inconnu', progress({ quizAttempted: true, value: 1 })]])
    expect(unlockedSubjectSlugs(mastery, CHAPTERS).size).toBe(0)
  })
})

describe('déblocages à annoncer', () => {
  it('ne retient que ce qui vient de s’ouvrir', () => {
    const avant = new Set(['maths'])
    const apres = new Set(['maths', 'physique-chimie'])
    expect(newlyUnlocked(avant, apres)).toEqual(['physique-chimie'])
  })

  it('ne dit rien quand rien n’a bougé', () => {
    const s = new Set(['maths'])
    expect(newlyUnlocked(s, s)).toEqual([])
  })

  it('ne signale jamais une fermeture (une porte ouverte le reste)', () => {
    expect(newlyUnlocked(new Set(['maths', 'anglais']), new Set(['maths']))).toEqual([])
  })
})
