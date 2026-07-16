import { describe, expect, it } from 'vitest'
import {
  normalizeRankedHistory,
  duelHistorySummary,
  dayLabelFr,
} from './history'

function row(over: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    id: 'm1',
    won: true,
    delta: 30,
    trophies: 550,
    opponent: 'Fantôme de Rayan',
    created_at: '2026-07-16T10:00:00.000Z',
    ...over,
  }
}

describe('normalizeRankedHistory', () => {
  it('normalise une ligne valide', () => {
    const [e] = normalizeRankedHistory([row()])
    expect(e).toEqual({
      id: 'm1',
      won: true,
      delta: 30,
      trophies: 550,
      opponent: 'Fantôme de Rayan',
      dayKey: '2026-07-16',
    })
  })

  it('renvoie [] pour une entrée non-tableau', () => {
    expect(normalizeRankedHistory(null)).toEqual([])
    expect(normalizeRankedHistory({})).toEqual([])
    expect(normalizeRankedHistory('x')).toEqual([])
  })

  it('ignore les lignes invalides (id, date ou nombres manquants)', () => {
    const rows = [
      row({ id: '' }),
      row({ created_at: 'pas-une-date' }),
      row({ delta: 'NaN' }),
      row({ trophies: undefined }),
      row({ id: 'ok' }),
    ]
    const entries = normalizeRankedHistory(rows)
    expect(entries.map((e) => e.id)).toEqual(['ok'])
  })

  it("remplace un adversaire vide par « Adversaire mystère »", () => {
    const [e] = normalizeRankedHistory([row({ opponent: '  ' })])
    expect(e.opponent).toBe('Adversaire mystère')
    const [f] = normalizeRankedHistory([row({ opponent: null })])
    expect(f.opponent).toBe('Adversaire mystère')
  })

  it('borne le delta à ±100 et plancher les trophées à 0', () => {
    const [e] = normalizeRankedHistory([row({ delta: 999, trophies: -12 })])
    expect(e.delta).toBe(100)
    expect(e.trophies).toBe(0)
    const [f] = normalizeRankedHistory([row({ delta: -999 })])
    expect(f.delta).toBe(-100)
  })

  it('trie du plus récent au plus ancien', () => {
    const entries = normalizeRankedHistory([
      row({ id: 'vieux', created_at: '2026-07-10T08:00:00Z' }),
      row({ id: 'recent', created_at: '2026-07-16T09:00:00Z' }),
      row({ id: 'milieu', created_at: '2026-07-12T12:00:00Z' }),
    ])
    expect(entries.map((e) => e.id)).toEqual(['recent', 'milieu', 'vieux'])
  })
})

describe('duelHistorySummary', () => {
  it('compte victoires, défaites et taux de victoire', () => {
    const entries = normalizeRankedHistory([
      row({ id: 'a', won: true }),
      row({ id: 'b', won: false }),
      row({ id: 'c', won: true }),
    ])
    expect(duelHistorySummary(entries)).toEqual({
      total: 3,
      wins: 2,
      losses: 1,
      winRate: 67,
    })
  })

  it('gère la liste vide sans division par zéro', () => {
    expect(duelHistorySummary([])).toEqual({
      total: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
    })
  })
})

describe('dayLabelFr', () => {
  const today = '2026-07-16'

  it("dit « Aujourd'hui » et « Hier »", () => {
    expect(dayLabelFr('2026-07-16', today)).toBe("Aujourd'hui")
    expect(dayLabelFr('2026-07-15', today)).toBe('Hier')
  })

  it('formate les jours plus anciens en français', () => {
    expect(dayLabelFr('2026-07-01', today)).toBe('1 juil.')
    expect(dayLabelFr('2026-02-28', today)).toBe('28 févr.')
  })

  it("ajoute l'année quand elle diffère", () => {
    expect(dayLabelFr('2025-12-31', today)).toBe('31 déc. 2025')
  })

  it('rend la clé brute si la date est illisible', () => {
    expect(dayLabelFr('n-importe-quoi', today)).toBe('n-importe-quoi')
  })
})
