import { describe, it, expect } from 'vitest'
import {
  MAX_WEEKLY_GOALS,
  currentWeekStart,
  normalizeWeeklyGoal,
  normalizeWeeklyGoalsList,
  goalsForWeek,
  addWeeklyGoal,
  toggleWeeklyGoal,
  removeWeeklyGoal,
  weeklyGoalsProgress,
  type WeeklyGoal,
} from '@/lib/weekly-goals'

const WEEK = '2026-07-13' // un lundi
const PREV = '2026-07-06' // le lundi précédent

const goal = (
  id: string,
  text = `But ${id}`,
  done = false,
  week = WEEK,
): WeeklyGoal => ({ id, text, done, week })

describe('currentWeekStart', () => {
  it('renvoie le lundi de la semaine (UTC)', () => {
    // 2026-07-16 est un jeudi → lundi = 2026-07-13.
    expect(currentWeekStart(new Date('2026-07-16T09:00:00Z'))).toBe('2026-07-13')
    // Un lundi renvoie lui-même.
    expect(currentWeekStart(new Date('2026-07-13T00:00:00Z'))).toBe('2026-07-13')
    // Un dimanche renvoie le lundi de la même semaine.
    expect(currentWeekStart(new Date('2026-07-19T23:00:00Z'))).toBe('2026-07-13')
  })
})

describe('normalizeWeeklyGoal', () => {
  it('accepte un objectif bien formé, rogne le texte, done par défaut false', () => {
    expect(
      normalizeWeeklyGoal({ id: 'a', text: '  Réviser  ', week: WEEK }),
    ).toEqual({ id: 'a', text: 'Réviser', done: false, week: WEEK })
  })

  it('rejette id/texte vide ou semaine invalide', () => {
    expect(normalizeWeeklyGoal({ id: '', text: 'x', week: WEEK })).toBeNull()
    expect(normalizeWeeklyGoal({ id: 'a', text: ' ', week: WEEK })).toBeNull()
    expect(normalizeWeeklyGoal({ id: 'a', text: 'x', week: 'nope' })).toBeNull()
    expect(normalizeWeeklyGoal(null)).toBeNull()
  })

  it('done ne vaut true que si strictement true', () => {
    expect(
      normalizeWeeklyGoal({ id: 'a', text: 'x', week: WEEK, done: 'yes' })?.done,
    ).toBe(false)
    expect(
      normalizeWeeklyGoal({ id: 'a', text: 'x', week: WEEK, done: true })?.done,
    ).toBe(true)
  })
})

describe('normalizeWeeklyGoalsList', () => {
  it('jette les invalides et dédoublonne par id', () => {
    const list = normalizeWeeklyGoalsList([
      goal('a', 'Un'),
      'bidon',
      { id: 'a', text: 'Écrasé', week: WEEK, done: true },
      goal('b'),
    ])
    expect(list.map((g) => g.id)).toEqual(['a', 'b'])
    expect(list[0]).toMatchObject({ text: 'Écrasé', done: true })
  })
})

describe('goalsForWeek', () => {
  it('ne garde que les objectifs de la semaine visée', () => {
    const list = [goal('a'), goal('b', 'B', false, PREV), goal('c')]
    expect(goalsForWeek(list, WEEK).map((g) => g.id)).toEqual(['a', 'c'])
  })
})

describe('addWeeklyGoal', () => {
  it('purge les objectifs des autres semaines (reset hebdo)', () => {
    const list = [goal('old', 'Vieux', true, PREV)]
    const next = addWeeklyGoal(list, goal('new'))
    expect(next.map((g) => g.id)).toEqual(['new'])
  })

  it('refuse au-delà de MAX pour la semaine', () => {
    const list = [goal('a'), goal('b'), goal('c')] // déjà 3
    const next = addWeeklyGoal(list, goal('d'))
    expect(next).toBe(list) // inchangé (même référence)
    expect(goalsForWeek(next, WEEK)).toHaveLength(MAX_WEEKLY_GOALS)
  })

  it('remplace un objectif de même id sans compter double', () => {
    const list = [goal('a'), goal('b')]
    const next = addWeeklyGoal(list, goal('a', 'A bis'))
    expect(next).toHaveLength(2)
    expect(next.find((g) => g.id === 'a')?.text).toBe('A bis')
  })
})

describe('toggleWeeklyGoal', () => {
  it('bascule le bon objectif uniquement', () => {
    const next = toggleWeeklyGoal([goal('a'), goal('b')], 'a')
    expect(next[0].done).toBe(true)
    expect(next[1].done).toBe(false)
    // Re-basculer revient en arrière.
    expect(toggleWeeklyGoal(next, 'a')[0].done).toBe(false)
  })
})

describe('removeWeeklyGoal', () => {
  it('retire par id', () => {
    expect(
      removeWeeklyGoal([goal('a'), goal('b')], 'a').map((g) => g.id),
    ).toEqual(['b'])
  })
})

describe('weeklyGoalsProgress', () => {
  it('compte done/total sur la semaine visée', () => {
    const list = [
      goal('a', 'A', true),
      goal('b', 'B', false),
      goal('c', 'C', true, PREV), // autre semaine → ignoré
    ]
    expect(weeklyGoalsProgress(list, WEEK)).toEqual({ done: 1, total: 2 })
  })

  it('aucune objectif cette semaine → 0/0', () => {
    expect(weeklyGoalsProgress([], WEEK)).toEqual({ done: 0, total: 0 })
  })
})
