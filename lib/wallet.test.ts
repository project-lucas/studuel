import { describe, expect, it } from 'vitest'
import {
  GEM_AWARDS,
  XP_AWARDS,
  isQuizTop,
  isStreakMilestone,
  levelFromXp,
  nextStreak,
  quizXpSource,
  walletLevelInfo,
  xpChip,
  xpForLevel,
  xpForQuiz,
} from './wallet'

describe('barème XP', () => {
  it('paye le forfait du quiz, avec bonus à partir de 8/10', () => {
    expect(xpForQuiz(7, 10)).toBe(XP_AWARDS.quiz)
    expect(xpForQuiz(8, 10)).toBe(XP_AWARDS.quiz + XP_AWARDS.quizBonus)
    expect(xpForQuiz(10, 10)).toBe(XP_AWARDS.quiz + XP_AWARDS.quizBonus)
  })

  it('ne verse jamais le bonus sur un quiz vide', () => {
    expect(isQuizTop(0, 0)).toBe(false)
    expect(xpForQuiz(0, 0)).toBe(XP_AWARDS.quiz)
  })

  it('mappe le score vers la source RPC', () => {
    expect(quizXpSource(5, 10)).toBe('quiz')
    expect(quizXpSource(9, 10)).toBe('quiz_top')
  })
})

describe('niveaux (100 XP × niveau)', () => {
  it('cumule les paliers : 0, 100, 300, 600, 1000…', () => {
    expect(xpForLevel(1)).toBe(0)
    expect(xpForLevel(2)).toBe(100)
    expect(xpForLevel(3)).toBe(300)
    expect(xpForLevel(4)).toBe(600)
    expect(xpForLevel(5)).toBe(1000)
  })

  it('retrouve le niveau depuis le total, bornes comprises', () => {
    expect(levelFromXp(0)).toBe(1)
    expect(levelFromXp(99)).toBe(1)
    expect(levelFromXp(100)).toBe(2)
    expect(levelFromXp(299)).toBe(2)
    expect(levelFromXp(300)).toBe(3)
    expect(levelFromXp(600)).toBe(4)
    expect(levelFromXp(-5)).toBe(1)
  })

  it('inverse xpForLevel sur une large plage', () => {
    for (let level = 1; level <= 60; level++) {
      expect(levelFromXp(xpForLevel(level))).toBe(level)
      expect(levelFromXp(xpForLevel(level + 1) - 1)).toBe(level)
    }
  })

  it('décrit la progression vers le prochain palier', () => {
    const info = walletLevelInfo(150)
    expect(info.level).toBe(2)
    expect(info.nextAt).toBe(300)
    expect(info.progress).toBeCloseTo(0.25)
    expect(info.title).toBe('Apprenti 🌱')
  })

  it('garde le dernier titre au-delà des paliers connus', () => {
    expect(walletLevelInfo(xpForLevel(25)).title).toBe('Légende 👑')
  })
})

describe('série stockée', () => {
  it('démarre à 1 le premier jour', () => {
    expect(nextStreak({ streakDays: 0, lastActivityDate: null }, '2026-07-21'))
      .toEqual({ streakDays: 1, lastActivityDate: '2026-07-21' })
  })

  it("ne bouge pas deux activités le même jour", () => {
    const prev = { streakDays: 3, lastActivityDate: '2026-07-21' }
    expect(nextStreak(prev, '2026-07-21')).toBe(prev)
  })

  it('prolonge la série le lendemain, y compris à cheval sur un mois', () => {
    expect(
      nextStreak({ streakDays: 3, lastActivityDate: '2026-07-20' }, '2026-07-21')
        .streakDays,
    ).toBe(4)
    expect(
      nextStreak({ streakDays: 6, lastActivityDate: '2026-06-30' }, '2026-07-01')
        .streakDays,
    ).toBe(7)
  })

  it('repart à 1 après un jour manqué', () => {
    expect(
      nextStreak({ streakDays: 9, lastActivityDate: '2026-07-18' }, '2026-07-21')
        .streakDays,
    ).toBe(1)
  })

  it('récompense chaque palier de 7 jours, et seulement lui', () => {
    expect(isStreakMilestone(6)).toBe(false)
    expect(isStreakMilestone(7)).toBe(true)
    expect(isStreakMilestone(8)).toBe(false)
    expect(isStreakMilestone(14)).toBe(true)
    expect(isStreakMilestone(0)).toBe(false)
  })
})

describe('gemmes de jeu', () => {
  it('garde des montants rares et jalonnés (échelle ×30)', () => {
    expect(GEM_AWARDS).toEqual({
      chapterCrowns: 30,
      streak7: 20,
      defiWin: 10,
      levelUp: 15,
    })
  })
})

describe('libellés', () => {
  it('affiche la promesse « +20 XP »', () => {
    expect(xpChip(20)).toBe('+20 XP')
    expect(xpChip(-3)).toBe('+0 XP')
  })
})
