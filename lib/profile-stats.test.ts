import { describe, it, expect } from 'vitest'
import {
  winRate,
  formatPercent,
  preferredSubject,
  buildProfileSummary,
  type ProfileStatInputs,
} from './profile-stats'

describe('winRate', () => {
  it('renvoie le ratio attendu', () => {
    expect(winRate(3, 4)).toBe(0.75)
  })

  it('renvoie 0 sans partie (jamais NaN)', () => {
    expect(winRate(0, 0)).toBe(0)
    expect(Number.isNaN(winRate(0, 0))).toBe(false)
  })

  it('borne à [0,1] même si les victoires dépassent les parties', () => {
    expect(winRate(5, 3)).toBe(1)
  })
})

describe('formatPercent', () => {
  it('formate en pourcentage entier français', () => {
    expect(formatPercent(0.734)).toBe('73 %')
    expect(formatPercent(0)).toBe('0 %')
    expect(formatPercent(1)).toBe('100 %')
  })

  it('borne les valeurs hors [0,1]', () => {
    expect(formatPercent(1.5)).toBe('100 %')
    expect(formatPercent(-0.2)).toBe('0 %')
  })
})

describe('preferredSubject', () => {
  it('renvoie la matière la plus jouée', () => {
    expect(preferredSubject({ Maths: 12, Français: 5, Anglais: 3 })).toBe('Maths')
  })

  it('renvoie null sans donnée', () => {
    expect(preferredSubject({})).toBeNull()
    expect(preferredSubject({ Maths: 0 })).toBeNull()
  })

  it('départage à égalité par ordre alphabétique (déterministe)', () => {
    expect(preferredSubject({ Physique: 4, Anglais: 4 })).toBe('Anglais')
  })
})

describe('buildProfileSummary', () => {
  const base: ProfileStatInputs = {
    gamesPlayed: 20,
    wins: 13,
    currentStreak: 4,
    bestStreak: 9,
    totalXp: 5400,
    level: 12,
    trophies: 350,
    bestTrophies: 420,
    studyMinutes: 185,
    subjectCounts: { Maths: 8, Français: 6, Histoire: 6 },
  }

  it('calcule le taux de victoire et son libellé', () => {
    const s = buildProfileSummary(base)
    expect(s.winRatio).toBe(0.65)
    expect(s.winRateLabel).toBe('65 %')
  })

  it('prend le max entre série courante et record', () => {
    expect(buildProfileSummary({ ...base, currentStreak: 12, bestStreak: 9 }).bestStreak).toBe(12)
    expect(buildProfileSummary(base).bestStreak).toBe(9)
  })

  it('prend le max entre trophées courants et record', () => {
    expect(buildProfileSummary(base).bestTrophies).toBe(420)
    expect(buildProfileSummary({ ...base, trophies: 500 }).bestTrophies).toBe(500)
  })

  it('formate le temps de jeu et calcule le rang', () => {
    const s = buildProfileSummary(base)
    expect(s.studyTimeLabel).toBe('3 h 05')
    expect(s.rank.tier).toBeDefined()
  })

  it('remonte la matière préférée', () => {
    expect(buildProfileSummary(base).preferredSubject).toBe('Maths')
  })

  it('reste sain quand tout est à zéro', () => {
    const zero: ProfileStatInputs = {
      gamesPlayed: 0,
      wins: 0,
      currentStreak: 0,
      bestStreak: 0,
      totalXp: 0,
      level: 1,
      trophies: 0,
      bestTrophies: 0,
      studyMinutes: 0,
      subjectCounts: {},
    }
    const s = buildProfileSummary(zero)
    expect(s.winRateLabel).toBe('0 %')
    expect(s.preferredSubject).toBeNull()
  })
})
