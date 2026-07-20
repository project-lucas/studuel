import { describe, expect, it } from 'vitest'
import {
  DEBRIEF_CATALOG,
  DEBRIEF_REWARD_COINS,
  debriefComplete,
  debriefDailyReward,
  debriefIcon,
  debriefMessage,
  debriefScore,
  debriefYearStats,
  isDebriefOutcome,
  isDebriefPairId,
  type DebriefLogEntry,
} from './debrief'

describe('DEBRIEF_CATALOG', () => {
  it('a des identifiants uniques', () => {
    const ids = DEBRIEF_CATALOG.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('a un frein, une habitude saine et un bénéfice sur chaque paire', () => {
    for (const p of DEBRIEF_CATALOG) {
      expect(p.bad.length).toBeGreaterThan(0)
      expect(p.good.length).toBeGreaterThan(0)
      expect(p.benefit.length).toBeGreaterThan(0)
      expect(p.badEmoji.length).toBeGreaterThan(0)
      expect(p.goodEmoji.length).toBeGreaterThan(0)
    }
  })
})

describe('debriefIcon', () => {
  it("reste indéfinie tant que l'image n'est pas déposée", () => {
    expect(debriefIcon('hydratation', 'bad')).toBeUndefined()
    expect(debriefIcon('inconnue', 'good')).toBeUndefined()
  })
})

describe('isDebriefOutcome / isDebriefPairId', () => {
  it('ne reconnaît que bad et good', () => {
    expect(isDebriefOutcome('bad')).toBe(true)
    expect(isDebriefOutcome('good')).toBe(true)
    expect(isDebriefOutcome('meh')).toBe(false)
    expect(isDebriefOutcome(null)).toBe(false)
  })

  it('valide un id du catalogue et rejette le reste', () => {
    expect(isDebriefPairId('hydratation')).toBe(true)
    expect(isDebriefPairId('inconnue')).toBe(false)
  })
})

describe('debriefScore', () => {
  it('compte victoires, rechutes et sans réponse', () => {
    const score = debriefScore(['a', 'b', 'c', 'd'], {
      a: 'good',
      b: 'bad',
      c: 'good',
    })
    expect(score).toEqual({ wins: 2, slips: 1, pending: 1, total: 4 })
  })

  it('ignore les issues hors sélection', () => {
    const score = debriefScore(['a'], { a: 'good', z: 'bad' })
    expect(score).toEqual({ wins: 1, slips: 0, pending: 0, total: 1 })
  })

  it('sélection vide → tout à zéro', () => {
    expect(debriefScore([], {})).toEqual({
      wins: 0,
      slips: 0,
      pending: 0,
      total: 0,
    })
  })
})

describe('debriefMessage', () => {
  it('reste vide sans habitude référencée', () => {
    expect(debriefMessage(0, 0)).toBe('')
  })

  it('célèbre la journée parfaite', () => {
    expect(debriefMessage(3, 3)).toContain('parfaite')
  })

  it('encourage à partir de la moitié', () => {
    expect(debriefMessage(2, 4)).toContain('Belle journée')
  })

  it('valorise la moindre victoire', () => {
    expect(debriefMessage(1, 4)).toContain('victoire')
  })

  it('relance sans culpabiliser à zéro victoire', () => {
    expect(debriefMessage(0, 4)).toContain('Demain')
  })
})

describe('debriefComplete', () => {
  it('vrai quand chaque habitude référencée a une issue', () => {
    expect(debriefComplete(['a', 'b'], { a: 'good', b: 'bad' })).toBe(true)
  })

  it('faux tant qu\'une habitude reste sans réponse', () => {
    expect(debriefComplete(['a', 'b'], { a: 'good' })).toBe(false)
  })

  it('faux sur une sélection vide (rien à raconter)', () => {
    expect(debriefComplete([], {})).toBe(false)
  })

  it('ignore les issues hors sélection', () => {
    expect(debriefComplete(['a'], { a: 'good', z: 'bad' })).toBe(true)
  })
})

describe('debriefDailyReward', () => {
  it('donne le forfait quand le débrief du jour est terminé', () => {
    expect(debriefDailyReward(['a', 'b'], { a: 'good', b: 'good' })).toBe(
      DEBRIEF_REWARD_COINS,
    )
  })

  it('donne 0 tant que le débrief n\'est pas terminé', () => {
    expect(debriefDailyReward(['a', 'b'], { a: 'good' })).toBe(0)
    expect(debriefDailyReward([], {})).toBe(0)
  })
})

describe('debriefYearStats', () => {
  const id0 = DEBRIEF_CATALOG[0].id
  const id1 = DEBRIEF_CATALOG[1].id
  const logs: DebriefLogEntry[] = [
    { pair_id: id0, date: '2026-01-01', outcome: 'good' },
    { pair_id: id0, date: '2026-01-02', outcome: 'good' },
    { pair_id: id0, date: '2026-01-03', outcome: 'bad' },
    { pair_id: id1, date: '2026-01-01', outcome: 'bad' },
    { pair_id: 'inconnue', date: '2026-01-01', outcome: 'good' }, // ignorée
  ]

  it('agrège victoires, rechutes et réponses par habitude', () => {
    const stats = debriefYearStats([id0, id1], logs)
    const p0 = stats.perPair.find((p) => p.id === id0)!
    expect(p0).toMatchObject({ wins: 2, slips: 1, answered: 3 })
    const p1 = stats.perPair.find((p) => p.id === id1)!
    expect(p1).toMatchObject({ wins: 0, slips: 1, answered: 1 })
  })

  it('détaille les issues jour par jour (byDate) pour la heatmap', () => {
    const stats = debriefYearStats([id0, id1], logs)
    const p0 = stats.perPair.find((p) => p.id === id0)!
    expect(p0.byDate).toEqual({
      '2026-01-01': 'good',
      '2026-01-02': 'good',
      '2026-01-03': 'bad',
    })
    const p1 = stats.perPair.find((p) => p.id === id1)!
    expect(p1.byDate).toEqual({ '2026-01-01': 'bad' })
  })

  it('calcule les totaux, les jours coachés et le taux de victoires', () => {
    const stats = debriefYearStats([id0, id1], logs)
    expect(stats.totalWins).toBe(2)
    expect(stats.totalSlips).toBe(2)
    expect(stats.totalAnswered).toBe(4)
    expect(stats.daysCoached).toBe(3) // 3 dates distinctes valides
    expect(stats.winRate).toBeCloseTo(0.5)
    expect(stats.bestPairId).toBe(id0)
  })

  it('inclut une habitude historique même si elle n\'est plus référencée', () => {
    const stats = debriefYearStats([], logs)
    expect(stats.perPair.map((p) => p.id)).toContain(id0)
  })

  it('restreint le bilan à l’année civile demandée', () => {
    // La page charge 366 jours glissants (donc 2 années civiles) alors que les
    // heatmaps ne dessinent que l'année en cours : sans ce filtre, le bandeau
    // compterait des jours invisibles dans les grilles.
    const across: DebriefLogEntry[] = [
      ...logs,
      { pair_id: id0, date: '2025-12-31', outcome: 'good' },
      { pair_id: id0, date: '2025-06-15', outcome: 'good' },
    ]

    const stats = debriefYearStats([id0, id1], across, '2026')

    expect(stats.totalWins).toBe(2) // les 2 victoires de 2025 sont exclues
    expect(stats.daysCoached).toBe(3)
    expect(Object.keys(stats.perPair.find((p) => p.id === id0)!.byDate)).not.toContain(
      '2025-12-31',
    )
  })

  it('sans année précisée, garde tout l’historique', () => {
    const across: DebriefLogEntry[] = [
      ...logs,
      { pair_id: id0, date: '2025-12-31', outcome: 'good' },
    ]

    expect(debriefYearStats([id0, id1], across).totalWins).toBe(3)
  })

  it('sélection et historique vides → tout à zéro, pas de meilleure habitude', () => {
    const stats = debriefYearStats([], [])
    expect(stats).toMatchObject({
      totalWins: 0,
      totalSlips: 0,
      totalAnswered: 0,
      daysCoached: 0,
      winRate: 0,
      bestPairId: null,
    })
    expect(stats.perPair).toEqual([])
  })
})
