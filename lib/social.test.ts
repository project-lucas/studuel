import { describe, it, expect } from 'vitest'
import {
  leagueZone,
  sortLeague,
  sortSchool,
  schoolTotalSeconds,
  duelMissionAvailable,
  sinceLabel,
} from '@/lib/social'

describe('leagueZone', () => {
  it('les 5 premiers montent, les 5 derniers descendent', () => {
    expect(leagueZone(1, 30)).toBe('promote')
    expect(leagueZone(5, 30)).toBe('promote')
    expect(leagueZone(6, 30)).toBe('safe')
    expect(leagueZone(25, 30)).toBe('safe')
    expect(leagueZone(26, 30)).toBe('relegate')
    expect(leagueZone(30, 30)).toBe('relegate')
  })
})

describe('sortLeague / sortSchool', () => {
  it('classe par XP décroissant sans muter l’original', () => {
    const entries = [
      { id: 'a', name: 'A', emoji: '🦊', xp: 10 },
      { id: 'b', name: 'B', emoji: '🐼', xp: 30 },
    ]
    const sorted = sortLeague(entries)
    expect(sorted.map((e) => e.id)).toEqual(['b', 'a'])
    expect(entries[0].id).toBe('a') // pas de mutation
  })

  it('classe l’école au temps de travail décroissant', () => {
    const mates = [
      { id: 'a', name: 'A', emoji: '🦊', seconds: 100 },
      { id: 'b', name: 'B', emoji: '🐼', seconds: 500 },
    ]
    expect(sortSchool(mates)[0].id).toBe('b')
  })
})

describe('schoolTotalSeconds', () => {
  it('somme les élèves en ignorant les valeurs négatives', () => {
    expect(
      schoolTotalSeconds([
        { id: 'a', name: 'A', emoji: '🦊', seconds: 100 },
        { id: 'b', name: 'B', emoji: '🐼', seconds: -50 },
      ]),
    ).toBe(100)
  })
})

describe('duelMissionAvailable', () => {
  it('une seule mission duel par jour', () => {
    expect(duelMissionAvailable(null, '2026-07-06')).toBe(true)
    expect(duelMissionAvailable('2026-07-05', '2026-07-06')).toBe(true)
    expect(duelMissionAvailable('2026-07-06', '2026-07-06')).toBe(false)
  })
})

describe('sinceLabel', () => {
  it('formate la présence en session', () => {
    expect(sinceLabel(0)).toBe("à l'instant")
    expect(sinceLabel(12)).toBe('depuis 12 min')
    expect(sinceLabel(90)).toBe('depuis 1 h')
  })
})
