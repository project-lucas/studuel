import { describe, it, expect } from 'vitest'
import {
  bossForSubject,
  dominantSubject,
  rankFromVictories,
  mondayKeyOf,
  weeklyBoss,
  weeklyTrophyId,
  ALL_BOSSES,
  FALLBACK_BOSS,
  RANK_STATS,
  WEEKLY_BOSS_STATS,
} from '@/lib/bosses'
import type { ModeQuestion } from '@/lib/defi-modes'

const q = (subject: string | null): ModeQuestion => ({
  id: subject ?? 'x',
  prompt: '',
  options: [],
  correctIndex: 0,
  explanation: null,
  subject,
})

describe('bossForSubject', () => {
  it('reconnaît les matières usuelles, accents et casse compris', () => {
    expect(bossForSubject('Maths').id).toBe('delta')
    expect(bossForSubject('Mathématiques expertes').id).toBe('delta')
    expect(bossForSubject('Français').id).toBe('grammatork')
    expect(bossForSubject('Histoire-Géo').id).toBe('chronos')
    expect(bossForSubject('HGGSP').id).toBe('chronos')
    expect(bossForSubject('Anglais').id).toBe('bigben')
    expect(bossForSubject('Physique-Chimie').id).toBe('plasma')
    expect(bossForSubject('SVT').id).toBe('mitochondrix')
    expect(bossForSubject('Philosophie').id).toBe('sphinx')
    expect(bossForSubject('NSI').id).toBe('bugzilla')
  })

  it('départage les libellés qui contiennent « scient »', () => {
    // « Sciences économiques et sociales » ne doit PAS tomber sur Nova.
    expect(bossForSubject('Sciences économiques et sociales').id).toBe('krach')
    expect(bossForSubject('Sciences de la Vie et de la Terre').id).toBe(
      'mitochondrix',
    )
    expect(bossForSubject('Enseignement scientifique').id).toBe('nova')
  })

  it('matière inconnue ou absente → boss générique', () => {
    expect(bossForSubject('Arts plastiques').id).toBe(FALLBACK_BOSS.id)
    expect(bossForSubject(null).id).toBe(FALLBACK_BOSS.id)
  })
})

describe('dominantSubject', () => {
  it('renvoie la matière la plus représentée du pool', () => {
    expect(
      dominantSubject([q('Maths'), q('Anglais'), q('Maths'), q(null)]),
    ).toBe('Maths')
  })

  it('pool vide ou sans matière → null', () => {
    expect(dominantSubject([])).toBeNull()
    expect(dominantSubject([q(null), q(null)])).toBeNull()
  })

  it('égalité → la première matière rencontrée (le chapitre fragile est en tête)', () => {
    expect(dominantSubject([q('SVT'), q('Maths')])).toBe('SVT')
  })
})

describe('rangs de boss', () => {
  it('monte d’un rang par victoire, plafonné au rang III', () => {
    expect(rankFromVictories(0)).toBe(1)
    expect(rankFromVictories(1)).toBe(2)
    expect(rankFromVictories(2)).toBe(3)
    expect(rankFromVictories(10)).toBe(3)
    expect(rankFromVictories(-1)).toBe(1)
  })

  it('chaque rang durcit le combat (PV en hausse)', () => {
    expect(RANK_STATS[2].hp).toBeGreaterThan(RANK_STATS[1].hp)
    expect(RANK_STATS[3].hp).toBeGreaterThan(RANK_STATS[2].hp)
  })
})

describe('boss de la semaine', () => {
  it('mondayKeyOf ramène au lundi de la semaine (UTC)', () => {
    expect(mondayKeyOf('2026-07-08')).toBe('2026-07-06') // mercredi → lundi
    expect(mondayKeyOf('2026-07-06')).toBe('2026-07-06') // lundi → lui-même
    expect(mondayKeyOf('2026-07-12')).toBe('2026-07-06') // dimanche → lundi
  })

  it('le boss est le même toute la semaine et change lundi', () => {
    const wednesday = weeklyBoss('2026-07-08')
    expect(weeklyBoss('2026-07-06')).toEqual(wednesday)
    expect(weeklyBoss('2026-07-12')).toEqual(wednesday)
    expect(weeklyBoss('2026-07-13')).not.toEqual(wednesday)
  })

  it('la rotation couvre tous les boss du catalogue', () => {
    const seen = new Set<string>()
    for (let w = 0; w < ALL_BOSSES.length; w++) {
      const d = new Date(Date.UTC(2026, 0, 5 + w * 7)) // des lundis successifs
      seen.add(weeklyBoss(d.toISOString().slice(0, 10)).id)
    }
    expect(seen.size).toBe(ALL_BOSSES.length)
  })

  it('le boss de la semaine est plus coriace que le rang III', () => {
    expect(WEEKLY_BOSS_STATS.hp).toBeGreaterThan(RANK_STATS[3].hp)
    expect(WEEKLY_BOSS_STATS.lives).toBeLessThanOrEqual(RANK_STATS[3].lives)
  })

  it('chaque boss a un id de trophée stable', () => {
    expect(weeklyTrophyId('delta')).toBe('trophee-delta')
  })
})
