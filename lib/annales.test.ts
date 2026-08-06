import { describe, expect, test } from 'vitest'
import { examYearFor, isExamYear } from './annales'

describe('examYearFor', () => {
  test('les trois années à examen', () => {
    expect(examYearFor('3e')?.key).toBe('brevet')
    expect(examYearFor('1re')?.key).toBe('bac-anticipe')
    expect(examYearFor('Tle')?.key).toBe('bac')
  })

  test('les autres années n’en ont pas', () => {
    for (const grade of ['6e', '5e', '4e', '2de']) {
      expect(examYearFor(grade)).toBeNull()
    }
  })

  test('tolère l’absence de classe et les espaces', () => {
    expect(examYearFor(null)).toBeNull()
    expect(examYearFor(undefined)).toBeNull()
    expect(examYearFor('')).toBeNull()
    expect(examYearFor(' Tle ')?.key).toBe('bac')
  })

  test('nomme l’examen pour l’écran', () => {
    expect(examYearFor('3e')?.short).toBe('Brevet')
    expect(examYearFor('Tle')?.label).toBe('le bac')
  })
})

describe('isExamYear', () => {
  test('vrai en 3e, 1re et Tle', () => {
    expect(isExamYear('3e')).toBe(true)
    expect(isExamYear('1re')).toBe(true)
    expect(isExamYear('Tle')).toBe(true)
  })

  test('faux ailleurs', () => {
    expect(isExamYear('4e')).toBe(false)
    expect(isExamYear(null)).toBe(false)
  })
})
