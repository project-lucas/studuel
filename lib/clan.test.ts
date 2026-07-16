import { describe, it, expect } from 'vitest'
import {
  schoolLevelForGrade,
  isSchoolLevel,
  normalizeSchool,
  normalizeSchoolList,
  normalizeRanking,
  ordinalFr,
  rankHeadline,
} from '@/lib/clan'

describe('schoolLevelForGrade', () => {
  it('6e→3e = collège', () => {
    for (const g of ['6e', '5e', '4e', '3e']) {
      expect(schoolLevelForGrade(g)).toBe('college')
    }
  })
  it('2de, 1re, Tle = lycée', () => {
    for (const g of ['2de', '1re', 'Tle']) {
      expect(schoolLevelForGrade(g)).toBe('lycee')
    }
  })
  it('classe inconnue / nulle → collège par défaut', () => {
    expect(schoolLevelForGrade(null)).toBe('college')
    expect(schoolLevelForGrade('CP')).toBe('college')
  })
})

describe('isSchoolLevel', () => {
  it('ne reconnaît que college/lycee', () => {
    expect(isSchoolLevel('college')).toBe(true)
    expect(isSchoolLevel('lycee')).toBe(true)
    expect(isSchoolLevel('primaire')).toBe(false)
  })
})

describe('normalizeSchool', () => {
  it('valide une école bien formée, ville nettoyée', () => {
    expect(
      normalizeSchool({ id: 'a', name: '  Collège Jean Moulin ', city: ' Lyon ', level: 'college' }),
    ).toEqual({ id: 'a', name: 'Collège Jean Moulin', city: 'Lyon', level: 'college' })
  })
  it('ville vide → null', () => {
    expect(normalizeSchool({ id: 'a', name: 'X', level: 'lycee' })?.city).toBeNull()
  })
  it('rejette id/nom vide ou niveau invalide', () => {
    expect(normalizeSchool({ id: '', name: 'X', level: 'college' })).toBeNull()
    expect(normalizeSchool({ id: 'a', name: ' ', level: 'college' })).toBeNull()
    expect(normalizeSchool({ id: 'a', name: 'X', level: 'primaire' })).toBeNull()
    expect(normalizeSchool(null)).toBeNull()
  })
})

describe('normalizeSchoolList', () => {
  it('jette les invalides', () => {
    const list = normalizeSchoolList([
      { id: 'a', name: 'A', level: 'college' },
      'nope',
      { id: 'b', name: '', level: 'college' },
    ])
    expect(list.map((s) => s.id)).toEqual(['a'])
  })
})

describe('normalizeRanking', () => {
  it('normalise un classement complet, trié par rang', () => {
    const r = normalizeRanking({
      school_id: 's1',
      school_name: 'Lycée Hugo',
      my_rank: 3,
      total: 40,
      entries: [
        { id: 'x', name: 'Inès', trophies: 800, rank: 2 },
        { id: 'me', name: 'Lucas', trophies: 900, rank: 1 },
      ],
    })
    expect(r.schoolId).toBe('s1')
    expect(r.schoolName).toBe('Lycée Hugo')
    expect(r.myRank).toBe(3)
    expect(r.total).toBe(40)
    expect(r.entries.map((e) => e.rank)).toEqual([1, 2]) // trié
    expect(r.entries[0].name).toBe('Lucas')
  })

  it('sans école (school_id null) → schoolId null, entries vide', () => {
    const r = normalizeRanking({ school_id: null })
    expect(r.schoolId).toBeNull()
    expect(r.entries).toEqual([])
    expect(r.total).toBe(0)
    expect(r.myRank).toBeNull()
  })

  it('national (pas de school) → schoolId null mais entries présentes', () => {
    const r = normalizeRanking({
      my_rank: 5,
      total: 1000,
      entries: [{ id: 'a', name: 'Léa', trophies: 1200, rank: 1 }],
    })
    expect(r.schoolId).toBeNull()
    expect(r.entries).toHaveLength(1)
    expect(r.myRank).toBe(5)
  })

  it('nom manquant → « Élève », trophées/rang bornés', () => {
    const r = normalizeRanking({
      total: 1,
      entries: [{ id: 'a', trophies: -5, rank: 0 }],
    })
    expect(r.entries[0].name).toBe('Élève')
    expect(r.entries[0].trophies).toBe(0)
    expect(r.entries[0].rank).toBe(1)
  })

  it('forme vide → classement vide sûr', () => {
    expect(normalizeRanking(null)).toEqual({
      schoolId: null,
      schoolName: null,
      myRank: null,
      total: 0,
      entries: [],
    })
  })
})

describe('ordinalFr', () => {
  it('1er puis Ne', () => {
    expect(ordinalFr(1)).toBe('1er')
    expect(ordinalFr(2)).toBe('2e')
    expect(ordinalFr(12)).toBe('12e')
  })
})

describe('rankHeadline', () => {
  it('classé → « Ne sur T »', () => {
    expect(rankHeadline(12, 87)).toBe('12e sur 87')
    expect(rankHeadline(1, 40)).toBe('1er sur 40')
  })
  it('non classé / vide → invite à jouer', () => {
    expect(rankHeadline(null, 0)).toContain('Défi')
    expect(rankHeadline(null, 10)).toContain('Défi')
  })
})
