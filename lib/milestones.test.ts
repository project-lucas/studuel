import { describe, it, expect } from 'vitest'
import { computeMilestones, MAX_MILESTONES } from '@/lib/milestones'

const q = (date: string, score = 5, total = 10) => ({ date, score, total })

const empty = {
  quizzes: [],
  lessonDates: [],
  challengeDates: [],
  activityDays: [],
}

describe('computeMilestones', () => {
  it('aucune donnée → aucun jalon', () => {
    expect(computeMilestones(empty)).toEqual([])
  })

  it('premières fois : leçon, quiz, défi (à leur plus petite date)', () => {
    const m = computeMilestones({
      ...empty,
      lessonDates: ['2026-07-10', '2026-07-05'],
      quizzes: [q('2026-07-08'), q('2026-07-06')],
      challengeDates: ['2026-07-09'],
    })
    const first = m.filter((x) => x.kind === 'first')
    expect(first).toContainEqual({
      date: '2026-07-05',
      kind: 'first',
      label: 'Première leçon terminée',
    })
    expect(first).toContainEqual({
      date: '2026-07-06',
      kind: 'first',
      label: 'Premier quiz joué',
    })
    expect(first).toContainEqual({
      date: '2026-07-09',
      kind: 'first',
      label: 'Premier défi relevé',
    })
  })

  it('premier quiz parfait à la 1re date où score === total', () => {
    const m = computeMilestones({
      ...empty,
      quizzes: [q('2026-07-06', 5, 10), q('2026-07-08', 10, 10), q('2026-07-10', 10, 10)],
    })
    expect(m.find((x) => x.kind === 'perfect')).toEqual({
      date: '2026-07-08',
      kind: 'perfect',
      label: 'Premier quiz parfait (100 %)',
    })
  })

  it('un quiz total 0 ne compte pas comme parfait', () => {
    const m = computeMilestones({ ...empty, quizzes: [q('2026-07-06', 0, 0)] })
    expect(m.find((x) => x.kind === 'perfect')).toBeUndefined()
  })

  it('palier de volume : date du Nᵉ quiz en ordre chronologique', () => {
    const quizzes = Array.from({ length: 12 }, (_, i) =>
      q(`2026-07-${String(i + 1).padStart(2, '0')}`),
    )
    const m = computeMilestones({ ...empty, quizzes })
    // 10e quiz = 2026-07-10.
    expect(m.find((x) => x.label === '10 quiz joués')).toEqual({
      date: '2026-07-10',
      kind: 'volume',
      label: '10 quiz joués',
    })
    // Pas encore 25 quiz.
    expect(m.find((x) => x.label === '25 quiz joués')).toBeUndefined()
  })

  it('palier de série : date de première atteinte du palier', () => {
    // 7 jours consécutifs 13→19 juillet → palier 3 atteint le 15, palier 7 le 19.
    const activityDays = [
      '2026-07-13',
      '2026-07-14',
      '2026-07-15',
      '2026-07-16',
      '2026-07-17',
      '2026-07-18',
      '2026-07-19',
    ]
    const m = computeMilestones({ ...empty, activityDays })
    expect(m.find((x) => x.label === 'Série de 3 jours atteinte')?.date).toBe(
      '2026-07-15',
    )
    expect(m.find((x) => x.label === 'Série de 7 jours atteinte')?.date).toBe(
      '2026-07-19',
    )
  })

  it('une coupure casse la série (le palier se réatteint plus tard)', () => {
    // 13,14 puis trou, puis 16,17,18 : le palier 3 est atteint le 18 (course 3),
    // jamais avant (aucune course de 3 avant la coupure).
    const activityDays = ['2026-07-13', '2026-07-14', '2026-07-16', '2026-07-17', '2026-07-18']
    const m = computeMilestones({ ...empty, activityDays })
    expect(m.find((x) => x.label === 'Série de 3 jours atteinte')?.date).toBe(
      '2026-07-18',
    )
  })

  it('jours d’activité dédoublonnés (deux sessions le même jour = 1 jour)', () => {
    const m = computeMilestones({
      ...empty,
      activityDays: ['2026-07-13', '2026-07-13', '2026-07-14', '2026-07-15'],
    })
    expect(m.find((x) => x.label === 'Série de 3 jours atteinte')?.date).toBe(
      '2026-07-15',
    )
  })

  it('trie du plus récent au plus ancien et borne à MAX_MILESTONES', () => {
    const quizzes = Array.from({ length: 250 }, (_, i) => {
      const d = new Date(Date.parse('2026-01-01T00:00:00Z') + i * 86_400_000)
      return q(d.toISOString().slice(0, 10), 10, 10)
    })
    const m = computeMilestones({ ...empty, quizzes })
    expect(m.length).toBeLessThanOrEqual(MAX_MILESTONES)
    // Ordre décroissant strict par date.
    for (let i = 1; i < m.length; i++) {
      expect(m[i - 1].date >= m[i].date).toBe(true)
    }
  })
})
