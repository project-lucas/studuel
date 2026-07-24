import { describe, it, expect } from 'vitest'
import {
  isBadgeEarned,
  earnedBadgeSlugs,
  parseCondition,
  normalizeEquipped,
  cardBadges,
  MAX_EQUIPPED,
  type Badge,
  type BadgeStats,
  type BadgeState,
} from './badges'

// Un jeu de stats « neutre » (rien de gagné) qu'on ajuste par test.
const zeroStats: BadgeStats = {
  bestStreak: 0,
  bestCommuteStreak: 0,
  bestHabitStreak: 0,
  habitsCount: 0,
  quizCount: 0,
  commuteQuizzes: 0,
  studyMinutes: 0,
  hasPerfectQuiz: false,
}

describe('isBadgeEarned', () => {
  it('accorde un badge de série au seuil exact', () => {
    expect(
      isBadgeEarned({ type: 'streak', days: 7 }, { ...zeroStats, bestStreak: 7 }),
    ).toBe(true)
  })

  it('refuse un badge de série sous le seuil', () => {
    expect(
      isBadgeEarned({ type: 'streak', days: 7 }, { ...zeroStats, bestStreak: 6 }),
    ).toBe(false)
  })

  it('accorde au-delà du seuil (jalon acquis pour toujours)', () => {
    expect(
      isBadgeEarned({ type: 'quiz_count', count: 10 }, { ...zeroStats, quizCount: 42 }),
    ).toBe(true)
  })

  it('évalue perfect_quiz sur le drapeau booléen', () => {
    expect(isBadgeEarned({ type: 'perfect_quiz' }, zeroStats)).toBe(false)
    expect(
      isBadgeEarned({ type: 'perfect_quiz' }, { ...zeroStats, hasPerfectQuiz: true }),
    ).toBe(true)
  })

  it('mappe chaque type de condition à la bonne stat', () => {
    expect(
      isBadgeEarned({ type: 'commute_streak', days: 5 }, { ...zeroStats, bestCommuteStreak: 5 }),
    ).toBe(true)
    expect(
      isBadgeEarned({ type: 'habit_anchored', days: 21 }, { ...zeroStats, bestHabitStreak: 21 }),
    ).toBe(true)
    expect(
      isBadgeEarned({ type: 'habits_count', count: 1 }, { ...zeroStats, habitsCount: 1 }),
    ).toBe(true)
    expect(
      isBadgeEarned({ type: 'commute_quizzes', count: 10 }, { ...zeroStats, commuteQuizzes: 10 }),
    ).toBe(true)
    expect(
      isBadgeEarned({ type: 'study_minutes', minutes: 600 }, { ...zeroStats, studyMinutes: 600 }),
    ).toBe(true)
  })

  it('ne mélange pas les stats entre conditions', () => {
    // Une grosse série ne doit pas accorder un badge de quiz.
    expect(
      isBadgeEarned({ type: 'quiz_count', count: 10 }, { ...zeroStats, bestStreak: 999 }),
    ).toBe(false)
  })
})

// Petit catalogue de test.
const badge = (slug: string, condition: Badge['condition']): Badge => ({
  id: `id-${slug}`,
  slug,
  title: slug,
  description: '',
  icon: '🏅',
  condition,
})

describe('earnedBadgeSlugs', () => {
  it('ne renvoie que les badges mérités, dans l’ordre du catalogue', () => {
    const catalog: Badge[] = [
      badge('serie-7', { type: 'streak', days: 7 }),
      badge('quiz-10', { type: 'quiz_count', count: 10 }),
      badge('sans-faute', { type: 'perfect_quiz' }),
    ]
    const stats: BadgeStats = {
      ...zeroStats,
      bestStreak: 8,
      quizCount: 3,
      hasPerfectQuiz: true,
    }
    expect(earnedBadgeSlugs(catalog, stats)).toEqual(['serie-7', 'sans-faute'])
  })

  it('renvoie un tableau vide si rien n’est mérité', () => {
    const catalog = [badge('serie-7', { type: 'streak', days: 7 })]
    expect(earnedBadgeSlugs(catalog, zeroStats)).toEqual([])
  })
})

describe('parseCondition', () => {
  it('parse les conditions à seuil', () => {
    expect(parseCondition({ type: 'streak', days: 7 })).toEqual({ type: 'streak', days: 7 })
    expect(parseCondition({ type: 'quiz_count', count: 10 })).toEqual({
      type: 'quiz_count',
      count: 10,
    })
    expect(parseCondition({ type: 'study_minutes', minutes: 60 })).toEqual({
      type: 'study_minutes',
      minutes: 60,
    })
  })

  it('parse perfect_quiz sans champ', () => {
    expect(parseCondition({ type: 'perfect_quiz' })).toEqual({ type: 'perfect_quiz' })
  })

  it('renvoie null pour une condition malformée ou inconnue', () => {
    expect(parseCondition(null)).toBeNull()
    expect(parseCondition('nope')).toBeNull()
    expect(parseCondition({ type: 'streak' })).toBeNull() // days manquant
    expect(parseCondition({ type: 'mystere', value: 1 })).toBeNull()
    expect(parseCondition({ type: 'streak', days: 'sept' })).toBeNull()
  })
})

describe('normalizeEquipped', () => {
  const earned = new Set(['a', 'b', 'c', 'd'])

  it('borne à MAX_EQUIPPED en gardant l’ordre', () => {
    expect(normalizeEquipped(['a', 'b', 'c', 'd'], earned)).toEqual(['a', 'b', 'c'])
    expect(MAX_EQUIPPED).toBe(3)
  })

  it('exclut les badges non acquis', () => {
    expect(normalizeEquipped(['a', 'z', 'b'], earned)).toEqual(['a', 'b'])
  })

  it('retire les doublons', () => {
    expect(normalizeEquipped(['a', 'a', 'b'], earned)).toEqual(['a', 'b'])
  })

  it('renvoie vide si rien n’est acquis', () => {
    expect(normalizeEquipped(['a', 'b'], new Set())).toEqual([])
  })
})

describe('cardBadges', () => {
  const state = (id: string, earned: boolean): BadgeState => ({
    id,
    slug: id,
    title: id,
    description: '',
    icon: '🏅',
    condition: { type: 'perfect_quiz' },
    earned,
    unlockedAt: earned ? '2026-07-24' : null,
  })

  it('affiche les équipés dans l’ordre choisi', () => {
    // Seuls les équipés sont acquis : pas de remplissage à observer ici.
    const states = [state('a', true), state('b', false), state('c', true)]
    expect(cardBadges(states, ['c', 'a']).map((s) => s.id)).toEqual(['c', 'a'])
  })

  it('complète l’ordre choisi avec les acquis restants jusqu’à 3', () => {
    const states = [state('a', true), state('b', true), state('c', true)]
    expect(cardBadges(states, ['c', 'a']).map((s) => s.id)).toEqual(['c', 'a', 'b'])
  })

  it('complète avec les acquis restants quand moins de 3 équipés', () => {
    const states = [state('a', true), state('b', true), state('c', true)]
    expect(cardBadges(states, ['b']).map((s) => s.id)).toEqual(['b', 'a', 'c'])
  })

  it('ignore un badge équipé mais non acquis', () => {
    const states = [state('a', false), state('b', true)]
    expect(cardBadges(states, ['a', 'b']).map((s) => s.id)).toEqual(['b'])
  })

  it('ne dépasse jamais MAX_EQUIPPED', () => {
    const states = [state('a', true), state('b', true), state('c', true), state('d', true)]
    expect(cardBadges(states, ['a', 'b', 'c', 'd'])).toHaveLength(MAX_EQUIPPED)
  })
})
