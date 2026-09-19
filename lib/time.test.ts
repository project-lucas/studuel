import { describe, it, expect } from 'vitest'
import {
  formatDuration,
  formatDurationFromSeconds,
  formatHours,
  minuitParis,
  parisDayKey,
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

describe('parisDayKey', () => {
  it('lit le jour de Paris, pas le jour UTC', () => {
    // 23 h UTC en été = 1 h du matin le lendemain à Paris.
    expect(parisDayKey(new Date('2026-09-18T23:00:00Z'))).toBe('2026-09-19')
    expect(parisDayKey(new Date('2026-09-18T21:59:00Z'))).toBe('2026-09-18')
    // L'hiver, une heure d'écart seulement.
    expect(parisDayKey(new Date('2026-12-04T23:30:00Z'))).toBe('2026-12-05')
  })
})

describe('minuitParis', () => {
  it('minuit à Paris = 22 h UTC la veille en été, 23 h en hiver', () => {
    expect(minuitParis('2026-09-19').toISOString()).toBe('2026-09-18T22:00:00.000Z')
    expect(minuitParis('2026-12-05').toISOString()).toBe('2026-12-04T23:00:00.000Z')
  })

  it('suit le changement d’heure au jour près', () => {
    // Dernier dimanche d'octobre 2026 : le 25. Samedi en heure d'été, lundi
    // en heure d'hiver.
    expect(minuitParis('2026-10-24').toISOString()).toBe('2026-10-23T22:00:00.000Z')
    expect(minuitParis('2026-10-26').toISOString()).toBe('2026-10-25T23:00:00.000Z')
    // Dernier dimanche de mars 2026 : le 29.
    expect(minuitParis('2026-03-28').toISOString()).toBe('2026-03-27T23:00:00.000Z')
    expect(minuitParis('2026-03-30').toISOString()).toBe('2026-03-29T22:00:00.000Z')
  })

  it('rend une date invalide sur une clé illisible, sans jeter', () => {
    expect(Number.isNaN(minuitParis('pas-une-date').getTime())).toBe(true)
  })
})
