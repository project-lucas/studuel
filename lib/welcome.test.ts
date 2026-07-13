import { describe, it, expect } from 'vitest'
import type { Subject } from '@/lib/types'
import {
  EMPTY_ANSWERS,
  canAdvance,
  defaultSelectedForGrade,
  isDailyGoalMinutes,
  makePlacement,
  minutesToSessions,
  parseAnswers,
  placementLevel,
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

const FILLED: OnboardingAnswers = {
  profileType: 'eleve',
  source: 'tiktok',
  goal: 'moyenne',
  grade: '3e',
  subjects: ['maths'],
  dailyGoalMinutes: 15,
  placement: makePlacement(4, 5),
  friendsInvited: true,
  notificationsEnabled: true,
}

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
    expect(canAdvance('profil', EMPTY_ANSWERS)).toBe(false)
    expect(canAdvance('source', EMPTY_ANSWERS)).toBe(false)
    expect(canAdvance('goal', EMPTY_ANSWERS)).toBe(false)
    expect(canAdvance('grade', EMPTY_ANSWERS)).toBe(false)
    expect(canAdvance('subjects', EMPTY_ANSWERS)).toBe(false)
  })

  it('laisse passer une fois répondu', () => {
    expect(canAdvance('profil', FILLED)).toBe(true)
    expect(canAdvance('source', FILLED)).toBe(true)
    expect(canAdvance('goal', FILLED)).toBe(true)
    expect(canAdvance('grade', FILLED)).toBe(true)
    expect(canAdvance('subjects', FILLED)).toBe(true)
    expect(canAdvance('dailyGoal', FILLED)).toBe(true)
  })

  it('l’objectif quotidien par défaut (10 min) est déjà valide', () => {
    expect(canAdvance('dailyGoal', EMPTY_ANSWERS)).toBe(true)
  })

  it('les écrans à boutons propres ne bloquent jamais', () => {
    expect(canAdvance('intro', EMPTY_ANSWERS)).toBe(true)
    expect(canAdvance('motivation', EMPTY_ANSWERS)).toBe(true)
    expect(canAdvance('placementIntro', EMPTY_ANSWERS)).toBe(true)
    expect(canAdvance('placementQuiz', EMPTY_ANSWERS)).toBe(true)
    expect(canAdvance('friends', EMPTY_ANSWERS)).toBe(true)
    expect(canAdvance('notifications', EMPTY_ANSWERS)).toBe(true)
    expect(canAdvance('signup', EMPTY_ANSWERS)).toBe(true)
    expect(canAdvance('plan', EMPTY_ANSWERS)).toBe(true)
  })
})

describe('stepProgress', () => {
  it('suit les pourcentages du design', () => {
    expect(stepProgress('source')).toBeCloseTo(0.12)
    expect(stepProgress('dailyGoal')).toBeCloseTo(0.6)
    expect(stepProgress('signup')).toBeCloseTo(0.96)
  })

  it('masque la barre sur accueil, profil, motivation et plan', () => {
    expect(stepProgress('intro')).toBeNull()
    expect(stepProgress('profil')).toBeNull()
    expect(stepProgress('motivation')).toBeNull()
    expect(stepProgress('plan')).toBeNull()
  })
})

describe('minutesToSessions', () => {
  it('mappe les minutes vers les sessions legacy', () => {
    expect(minutesToSessions(3)).toBe(1)
    expect(minutesToSessions(10)).toBe(1)
    expect(minutesToSessions(15)).toBe(2)
    expect(minutesToSessions(30)).toBe(3)
  })
})

describe('isDailyGoalMinutes', () => {
  it('n’accepte que 3 / 10 / 15 / 30', () => {
    expect(isDailyGoalMinutes(10)).toBe(true)
    expect(isDailyGoalMinutes(30)).toBe(true)
    expect(isDailyGoalMinutes(7)).toBe(false)
    expect(isDailyGoalMinutes('10')).toBe(false)
    expect(isDailyGoalMinutes(null)).toBe(false)
  })
})

describe('placementLevel', () => {
  it('classe selon le ratio de bonnes réponses', () => {
    expect(placementLevel(5, 5)).toBe('avance')
    expect(placementLevel(4, 5)).toBe('avance')
    expect(placementLevel(3, 5)).toBe('intermediaire')
    expect(placementLevel(2, 5)).toBe('intermediaire')
    expect(placementLevel(1, 5)).toBe('debutant')
  })

  it('un test vide (sauté) donne débutant', () => {
    expect(placementLevel(0, 0)).toBe('debutant')
  })
})

describe('makePlacement', () => {
  it('borne le score et calcule le niveau', () => {
    expect(makePlacement(9, 5)).toEqual({ correct: 5, total: 5, level: 'avance' })
    expect(makePlacement(-2, 5)).toEqual({
      correct: 0,
      total: 5,
      level: 'debutant',
    })
  })
})

describe('parseAnswers / serializeAnswers', () => {
  it('fait un aller-retour fidèle', () => {
    expect(parseAnswers(serializeAnswers(FILLED))).toEqual(FILLED)
  })

  it('retombe sur le défaut pour une entrée nulle ou cassée', () => {
    expect(parseAnswers(null)).toEqual(EMPTY_ANSWERS)
    expect(parseAnswers('pas du json')).toEqual(EMPTY_ANSWERS)
    expect(parseAnswers('[]')).toEqual(EMPTY_ANSWERS)
  })

  it('rejette les valeurs hors référentiel', () => {
    const parsed = parseAnswers(
      JSON.stringify({
        profileType: 'robot',
        source: 'tiktok',
        goal: 'piratage',
        grade: 'CP',
        subjects: ['maths', 42, ''],
        dailyGoalMinutes: 7,
        placement: { correct: 'x', total: 5 },
      }),
    )
    expect(parsed.profileType).toBeNull()
    expect(parsed.source).toBe('tiktok')
    expect(parsed.goal).toBeNull()
    expect(parsed.grade).toBeNull()
    expect(parsed.subjects).toEqual(['maths'])
    expect(parsed.dailyGoalMinutes).toBe(10)
    expect(parsed.placement).toBeNull()
  })
})
