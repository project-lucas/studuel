import { describe, it, expect } from 'vitest'
import {
  habitDays,
  habitTimeForDay,
  habitDuration,
  dayIndexOf,
  isInCommuteSlot,
  longestRun,
  autoHabitLogs,
} from '@/lib/habits'
import type { Habit } from '@/lib/types'

// Fixture minimale : seuls target et habit_catalog.default_target comptent
// pour les helpers purs testés ici.
function makeHabit(
  target: Record<string, unknown>,
  defaultTarget: Record<string, unknown> | null = null,
): Habit {
  return {
    id: 'h1',
    catalog_id: 'c1',
    target,
    created_at: '2026-01-01T00:00:00Z',
    habit_catalog: defaultTarget
      ? ({ default_target: defaultTarget } as Habit['habit_catalog'])
      : null,
  }
}

describe('dayIndexOf', () => {
  it('ramène lundi = 0 et dimanche = 6', () => {
    expect(dayIndexOf('2026-07-06')).toBe(0) // lundi
    expect(dayIndexOf('2026-07-12')).toBe(6) // dimanche
  })
})

describe('habitDays', () => {
  it('privilégie les jours propres à l’habitude', () => {
    expect(habitDays(makeHabit({ days: [1, 3] }, { days: [0] }))).toEqual([1, 3])
  })

  it('retombe sur le default_target du catalogue', () => {
    expect(habitDays(makeHabit({}, { days: [2, 5] }))).toEqual([2, 5])
  })

  it('retombe sur tous les jours en dernier recours', () => {
    expect(habitDays(makeHabit({}))).toEqual([0, 1, 2, 3, 4, 5, 6])
  })
})

describe('habitTimeForDay', () => {
  it("l'heure du jour précis prime sur l'heure globale", () => {
    const habit = makeHabit({ time: '18:00', times: { '2': '17:30' } })
    expect(habitTimeForDay(habit, 2)).toBe('17:30')
    expect(habitTimeForDay(habit, 0)).toBe('18:00')
  })
})

describe('habitDuration', () => {
  it('durée propre > minutes du catalogue > 10 min par défaut', () => {
    expect(habitDuration(makeHabit({ duration: 45 }, { minutes: 30 }))).toBe(45)
    expect(habitDuration(makeHabit({}, { minutes: 30 }))).toBe(30)
    expect(habitDuration(makeHabit({}))).toBe(10)
  })
})

describe('isInCommuteSlot (heure de Paris depuis un horodatage UTC)', () => {
  const slot = [{ start: '08:00', end: '09:00' }]

  it("hiver : 07:30 UTC = 08:30 à Paris → dans le créneau", () => {
    expect(isInCommuteSlot('2026-01-15T07:30:00Z', slot)).toBe(true)
  })

  it("été : 07:30 UTC = 09:30 à Paris → hors créneau", () => {
    expect(isInCommuteSlot('2026-07-15T07:30:00Z', slot)).toBe(false)
  })

  it('bornes incluses', () => {
    expect(isInCommuteSlot('2026-07-15T06:00:00Z', slot)).toBe(true) // 08:00
    expect(isInCommuteSlot('2026-07-15T07:00:00Z', slot)).toBe(true) // 09:00
  })

  it('minuit à Paris est bien 00:xx (jamais 24:xx)', () => {
    const night = [{ start: '00:00', end: '01:00' }]
    expect(isInCommuteSlot('2026-01-15T23:30:00Z', night)).toBe(true) // 00:30
  })

  it('horodatage invalide ou aucun créneau → false', () => {
    expect(isInCommuteSlot('pas-une-date', slot)).toBe(false)
    expect(isInCommuteSlot('2026-01-15T07:30:00Z', [])).toBe(false)
  })
})

describe('longestRun', () => {
  it('trouve la plus longue suite de jours consécutifs', () => {
    const days = new Set([
      '2026-03-01',
      '2026-03-02',
      '2026-03-03', // série de 3
      '2026-03-10',
      '2026-03-11', // série de 2
    ])
    expect(longestRun(days)).toBe(3)
  })

  it('gère le passage de mois', () => {
    expect(longestRun(new Set(['2026-01-31', '2026-02-01']))).toBe(2)
  })

  it('ensemble vide → 0', () => {
    expect(longestRun(new Set())).toBe(0)
  })
})

describe('autoHabitLogs', () => {
  // 2026-07-20 est un LUNDI (index 0 dans la convention du projet).
  const TODAY = '2026-07-20'

  function autoHabit(
    validationType: 'auto_revision' | 'auto_commute',
    target: Record<string, unknown> = {},
  ): Habit {
    return {
      id: `h-${validationType}`,
      catalog_id: 'c1',
      target,
      created_at: '2026-01-01T00:00:00Z',
      habit_catalog: {
        validation_type: validationType,
        days: [0, 1, 2, 3, 4, 5, 6],
      } as unknown as Habit['habit_catalog'],
    }
  }

  const noSessions = { tests: [], studies: [], lessons: [], challenges: [] }

  it('ne renvoie rien sans habitude automatique', () => {
    expect(autoHabitLogs('u1', [], [], noSessions, TODAY)).toEqual([])
  })

  it('valide la révision quand l’objectif de sessions est atteint', () => {
    const logs = autoHabitLogs(
      'u1',
      [autoHabit('auto_revision', { sessions: 2 })],
      [],
      { ...noSessions, tests: [{ created_at: `${TODAY}T09:00:00Z` }, { created_at: `${TODAY}T10:00:00Z` }] },
      TODAY,
    )

    expect(logs).toHaveLength(1)
    expect(logs[0]).toMatchObject({ completed: true, date: TODAY, auto_validated: true })
  })

  it('ne valide pas la révision sous l’objectif', () => {
    const logs = autoHabitLogs(
      'u1',
      [autoHabit('auto_revision', { sessions: 3 })],
      [],
      { ...noSessions, tests: [{ created_at: `${TODAY}T09:00:00Z` }] },
      TODAY,
    )

    expect(logs[0].completed).toBe(false)
  })

  it('ignore les sessions des AUTRES jours', () => {
    // Le cœur du correctif de perf : les listes reçues couvrent tout
    // l'historique (la page les charge déjà), la journée est filtrée ici.
    const logs = autoHabitLogs(
      'u1',
      [autoHabit('auto_revision', { sessions: 1 })],
      [],
      {
        ...noSessions,
        tests: [
          { created_at: '2026-07-19T09:00:00Z' },
          { created_at: '2026-01-02T09:00:00Z' },
        ],
      },
      TODAY,
    )

    expect(logs[0].completed).toBe(false)
  })

  it('tolère un horodatage illisible sans le compter', () => {
    const logs = autoHabitLogs(
      'u1',
      [autoHabit('auto_revision', { sessions: 1 })],
      [],
      { ...noSessions, tests: [{ created_at: 'pas-une-date' }, { created_at: null }] },
      TODAY,
    )

    expect(logs[0].completed).toBe(false)
  })

  it('valide le trajet si un quiz OU un défi tombe dans un créneau', () => {
    // 08:30 Europe/Paris en été = 06:30 UTC.
    const slots = [{ start: '08:00', end: '09:00' }] as never

    const parQuiz = autoHabitLogs(
      'u1',
      [autoHabit('auto_commute')],
      slots,
      { ...noSessions, tests: [{ created_at: `${TODAY}T06:30:00Z` }] },
      TODAY,
    )
    const parDefi = autoHabitLogs(
      'u1',
      [autoHabit('auto_commute')],
      slots,
      { ...noSessions, challenges: [{ created_at: `${TODAY}T06:30:00Z` }] },
      TODAY,
    )

    expect(parQuiz[0].completed).toBe(true)
    expect(parDefi[0].completed).toBe(true)
  })

  it('ne valide pas le trajet hors créneau', () => {
    const logs = autoHabitLogs(
      'u1',
      [autoHabit('auto_commute')],
      [{ start: '08:00', end: '09:00' }] as never,
      { ...noSessions, tests: [{ created_at: `${TODAY}T15:00:00Z` }] },
      TODAY,
    )

    expect(logs[0].completed).toBe(false)
  })
})
