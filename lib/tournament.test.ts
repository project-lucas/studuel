import { describe, expect, it } from 'vitest'
import {
  tournamentWindow,
  tournamentStatusLabel,
  normalizeTournamentStandings,
  normalizeTournamentBoard,
} from './tournament'

// Repères : le 2026-07-16 est un jeudi ; 18-19 juillet = week-end.

describe('tournamentWindow', () => {
  it('vise le week-end à venir en semaine (fenêtre fermée)', () => {
    const w = tournamentWindow('2026-07-16') // jeudi
    expect(w).toEqual({
      id: '2026-07-18',
      startKey: '2026-07-18',
      endKey: '2026-07-19',
      isOpen: false,
    })
  })

  it('est ouvert le samedi, sur le week-end courant', () => {
    const w = tournamentWindow('2026-07-18') // samedi
    expect(w.isOpen).toBe(true)
    expect(w.startKey).toBe('2026-07-18')
    expect(w.endKey).toBe('2026-07-19')
  })

  it('est ouvert le dimanche, toujours rattaché au samedi de la veille', () => {
    const w = tournamentWindow('2026-07-19') // dimanche
    expect(w.isOpen).toBe(true)
    expect(w.id).toBe('2026-07-18')
  })

  it('le lundi, bascule sur le week-end suivant (fermé)', () => {
    const w = tournamentWindow('2026-07-20') // lundi
    expect(w.isOpen).toBe(false)
    expect(w.startKey).toBe('2026-07-25')
  })

  it('tolère une clé illisible sans jeter', () => {
    const w = tournamentWindow('pas-une-date')
    expect(w.isOpen).toBe(false)
    expect(w.id).toBe('pas-une-date')
  })
})

describe('tournamentStatusLabel', () => {
  it('compte à rebours en semaine', () => {
    expect(tournamentStatusLabel('2026-07-13')).toBe('Commence dans 5 jours') // lundi
    expect(tournamentStatusLabel('2026-07-16')).toBe('Commence dans 2 jours') // jeudi
    expect(tournamentStatusLabel('2026-07-17')).toBe('Commence demain') // vendredi
  })

  it('signale le tournoi en cours le week-end', () => {
    expect(tournamentStatusLabel('2026-07-18')).toBe(
      "En cours — jusqu'à dimanche soir",
    )
    expect(tournamentStatusLabel('2026-07-19')).toBe('En cours — dernier jour !')
  })

  it('libellé générique si la clé est illisible', () => {
    expect(tournamentStatusLabel('n/a')).toBe('Chaque week-end')
  })
})

describe('normalizeTournamentStandings', () => {
  const row = (over: Record<string, unknown> = {}) => ({
    school_id: 's1',
    name: 'Collège Jean Moulin',
    city: 'Paris',
    points: 320,
    students: 12,
    ...over,
  })

  it('normalise, trie par points et attribue les rangs', () => {
    const standings = normalizeTournamentStandings([
      row({ school_id: 'a', points: 100 }),
      row({ school_id: 'b', points: 500 }),
      row({ school_id: 'c', points: 300 }),
    ])
    expect(standings.map((s) => [s.schoolId, s.rank])).toEqual([
      ['b', 1],
      ['c', 2],
      ['a', 3],
    ])
  })

  it('ignore les lignes invalides et nettoie les valeurs', () => {
    const standings = normalizeTournamentStandings([
      row({ school_id: '' }),
      row({ name: '   ' }),
      row({ points: 'NaN' }),
      row({ city: '', students: -3, points: 41.6 }),
    ])
    expect(standings).toEqual([
      {
        schoolId: 's1',
        name: 'Collège Jean Moulin',
        city: null,
        points: 42,
        students: 0,
        rank: 1,
      },
    ])
  })

  it('renvoie [] pour une entrée non-tableau', () => {
    expect(normalizeTournamentStandings(null)).toEqual([])
    expect(normalizeTournamentStandings({})).toEqual([])
  })
})

describe('normalizeTournamentBoard', () => {
  it("normalise le payload complet de l'RPC", () => {
    const board = normalizeTournamentBoard({
      tournament_start: '2026-07-18',
      is_open: true,
      my_school_id: 'ecole-1',
      entries: [
        {
          school_id: 'ecole-1',
          name: 'Collège Jean Moulin',
          city: 'Paris',
          points: 320,
          students: 12,
        },
      ],
    })
    expect(board).toEqual({
      tournamentStart: '2026-07-18',
      isOpen: true,
      mySchoolId: 'ecole-1',
      standings: [
        {
          schoolId: 'ecole-1',
          name: 'Collège Jean Moulin',
          city: 'Paris',
          points: 320,
          students: 12,
          rank: 1,
        },
      ],
    })
  })

  it('renvoie null pour une donnée absente ou illisible', () => {
    expect(normalizeTournamentBoard(null)).toBeNull()
    expect(normalizeTournamentBoard('x')).toBeNull()
    expect(normalizeTournamentBoard([])).toBeNull()
  })

  it('dégrade proprement les champs manquants', () => {
    const board = normalizeTournamentBoard({})
    expect(board).toEqual({
      tournamentStart: null,
      isOpen: false,
      mySchoolId: null,
      standings: [],
    })
  })
})
