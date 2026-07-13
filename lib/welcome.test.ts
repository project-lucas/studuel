import { describe, it, expect } from 'vitest'
import type { Subject } from '@/lib/types'
import {
  EMPTY_ANSWERS,
  canAdvance,
  defaultSelectedForGrade,
  parseAnswers,
  serializeAnswers,
  stepProgress,
  subjectsForGrade,
  type OnboardingAnswers,
} from '@/lib/welcome'

function subject(slug: string, levels: string[]): Subject {
  return {
    id: slug,
    slug,
    name: slug,
    category: 'college',
    levels,
  } as Subject
}

const SUBJECTS: Subject[] = [
  subject('maths', ['6e', '5e', '4e', '3e']),
  subject('francais', ['6e', '5e', '4e', '3e']),
  subject('ses', ['1re', 'Tle']),
]

describe('subjectsForGrade', () => {
  it('ne renvoie que les matières du niveau demandé', () => {
    const found = subjectsForGrade(SUBJECTS, '4e').map((s) => s.slug)
    expect(found).toEqual(['maths', 'francais'])
  })

  it('renvoie une liste vide sans niveau', () => {
    expect(subjectsForGrade(SUBJECTS, null)).toEqual([])
  })
})

describe('defaultSelectedForGrade', () => {
  it('coche toutes les matières du niveau', () => {
    expect(defaultSelectedForGrade(SUBJECTS, '6e')).toEqual(['maths', 'francais'])
  })
})

describe('canAdvance', () => {
  it('bloque tant que la question n’est pas répondue', () => {
    expect(canAdvance('motivation', EMPTY_ANSWERS)).toBe(false)
    expect(canAdvance('grade', EMPTY_ANSWERS)).toBe(false)
    expect(canAdvance('subjects', EMPTY_ANSWERS)).toBe(false)
  })

  it('laisse passer une fois répondu', () => {
    const answers: OnboardingAnswers = {
      motivation: 'controles',
      source: 'tiktok',
      grade: '3e',
      subjects: ['maths'],
      goal: 2,
    }
    expect(canAdvance('motivation', answers)).toBe(true)
    expect(canAdvance('source', answers)).toBe(true)
    expect(canAdvance('grade', answers)).toBe(true)
    expect(canAdvance('subjects', answers)).toBe(true)
    expect(canAdvance('goal', answers)).toBe(true)
  })

  it('l’objectif par défaut (1) est déjà valide', () => {
    expect(canAdvance('goal', EMPTY_ANSWERS)).toBe(true)
  })

  it('les écrans sans bouton standard ne bloquent jamais', () => {
    expect(canAdvance('intro', EMPTY_ANSWERS)).toBe(true)
    expect(canAdvance('preparing', EMPTY_ANSWERS)).toBe(true)
    expect(canAdvance('signup', EMPTY_ANSWERS)).toBe(true)
  })
})

describe('stepProgress', () => {
  it('progresse des questions vers 1', () => {
    expect(stepProgress('motivation')).toBeCloseTo(1 / 5)
    expect(stepProgress('goal')).toBeCloseTo(5 / 5)
    expect(stepProgress('signup')).toBe(1)
  })

  it('masque la barre sur l’accueil et la préparation', () => {
    expect(stepProgress('intro')).toBeNull()
    expect(stepProgress('preparing')).toBeNull()
  })
})

describe('parseAnswers / serializeAnswers', () => {
  it('fait un aller-retour fidèle', () => {
    const answers: OnboardingAnswers = {
      motivation: 'examen',
      source: 'prof',
      grade: '1re',
      subjects: ['ses'],
      goal: 3,
    }
    expect(parseAnswers(serializeAnswers(answers))).toEqual(answers)
  })

  it('retombe sur le défaut pour une entrée nulle ou cassée', () => {
    expect(parseAnswers(null)).toEqual(EMPTY_ANSWERS)
    expect(parseAnswers('pas du json')).toEqual(EMPTY_ANSWERS)
    expect(parseAnswers('[]')).toEqual(EMPTY_ANSWERS)
  })

  it('rejette les valeurs hors référentiel', () => {
    const parsed = parseAnswers(
      JSON.stringify({
        motivation: 'piratage',
        source: 'tiktok',
        grade: 'CP',
        subjects: ['maths', 42, ''],
        goal: 9,
      }),
    )
    expect(parsed.motivation).toBeNull()
    expect(parsed.source).toBe('tiktok')
    expect(parsed.grade).toBeNull()
    expect(parsed.subjects).toEqual(['maths'])
    expect(parsed.goal).toBe(1)
  })
})
