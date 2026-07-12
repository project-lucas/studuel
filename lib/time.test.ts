import { describe, it, expect } from 'vitest'
import {
  formatDuration,
  formatDurationFromSeconds,
  formatHours,
} from '@/lib/time'

describe('formatDuration (minutes)', () => {
  it('minutes seules sous une heure', () => {
    expect(formatDuration(0)).toBe('0 min')
    expect(formatDuration(45)).toBe('45 min')
  })

  it('heures rondes sans minutes', () => {
    expect(formatDuration(60)).toBe('1 h')
    expect(formatDuration(180)).toBe('3 h')
  })

  it('minutes sur deux chiffres après les heures', () => {
    expect(formatDuration(125)).toBe('2 h 05')
    expect(formatDuration(725)).toBe('12 h 05')
  })

  it('les valeurs négatives sont ramenées à zéro', () => {
    expect(formatDuration(-10)).toBe('0 min')
  })
})

describe('formatDurationFromSeconds', () => {
  it('message doux sous la minute', () => {
    expect(formatDurationFromSeconds(59)).toBe('moins d’1 min')
  })

  it('bascule en minutes à partir de 60 s', () => {
    expect(formatDurationFromSeconds(60)).toBe('1 min')
    expect(formatDurationFromSeconds(3660)).toBe('1 h 01')
  })
})

describe('formatHours', () => {
  it('toujours en heures, même à zéro', () => {
    expect(formatHours(0)).toBe('0 h')
    expect(formatHours(3 * 60)).toBe('0 h 03')
  })

  it('minutes sur deux chiffres, omises si rondes', () => {
    expect(formatHours(2 * 3600 + 5 * 60)).toBe('2 h 05')
    expect(formatHours(12 * 3600)).toBe('12 h')
  })
})
