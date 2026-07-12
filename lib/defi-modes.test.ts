import { describe, it, expect } from 'vitest'
import {
  GAME_MODES,
  MODE_XP_BONUS,
  FEATURED_XP_MULTIPLIER,
  featuredModeId,
  modeXpBonus,
  modeStatus,
  roundWinner,
  duelScore,
  duelWinner,
  ghostRound,
  ghostRoundFrom,
  seededRng,
  blitzMultiplier,
  blitzPoints,
  chronoAfterAnswer,
  bossAfterAnswer,
  bossOutcome,
  ROUND_SIZE,
  ROUNDS_TO_WIN,
  BLITZ_MAX_MULTIPLIER,
  BLITZ_BASE_POINTS,
  CHRONO_START_SECONDS,
  CHRONO_GAIN_SECONDS,
  CHRONO_LOSS_SECONDS,
  CHRONO_MAX_SECONDS,
  BOSS_HP,
  BOSS_LIVES,
  type GameMode,
  type RoundResult,
} from '@/lib/defi-modes'

const round = (
  me: number,
  them: number,
  myTimeMs = 20_000,
  theirTimeMs = 30_000,
): RoundResult => ({ me, them, myTimeMs, theirTimeMs })

describe('modeStatus', () => {
  const fake = (over: Partial<GameMode>): GameMode => ({
    id: 'blitz',
    name: 'Test',
    tagline: '',
    unlockLevel: 1,
    implemented: true,
    ...over,
  })

  it('un mode construit et au niveau est jouable', () => {
    expect(modeStatus(fake({}), 1)).toBe('playable')
  })

  it('le verrou de niveau prime : la promesse reste affichée', () => {
    expect(modeStatus(fake({ unlockLevel: 5 }), 1)).toBe('locked')
  })

  it('niveau atteint mais mode pas construit → bientôt', () => {
    expect(modeStatus(fake({ implemented: false }), 4)).toBe('soon')
  })

  it('le catalogue actuel est entièrement ouvert dès le niveau 1', () => {
    for (const mode of GAME_MODES) {
      expect(modeStatus(mode, 1)).toBe('playable')
    }
  })

  it('chaque mode a un bonus d’XP', () => {
    for (const mode of GAME_MODES) {
      expect(MODE_XP_BONUS[mode.id]).toBeGreaterThan(0)
    }
  })
})

describe('mode du jour', () => {
  it('est déterministe : même jour → même mode', () => {
    expect(featuredModeId('2026-07-08')).toBe(featuredModeId('2026-07-08'))
  })

  it('jamais le même mode deux jours de suite', () => {
    const days = [
      '2026-07-06',
      '2026-07-07',
      '2026-07-08',
      '2026-07-09',
      '2026-07-10',
      '2026-07-11',
    ]
    for (let i = 1; i < days.length; i++) {
      expect(featuredModeId(days[i])).not.toBe(featuredModeId(days[i - 1]))
    }
  })

  it('tous les modes passent en vedette sur un cycle', () => {
    const seen = new Set<string>()
    for (let d = 1; d <= GAME_MODES.length; d++) {
      seen.add(featuredModeId(`2026-07-${String(d).padStart(2, '0')}`))
    }
    expect(seen.size).toBe(GAME_MODES.length)
  })

  it('le bonus du mode en vedette est doublé, les autres inchangés', () => {
    const day = '2026-07-08'
    const star = featuredModeId(day)
    expect(modeXpBonus(star, day)).toBe(
      MODE_XP_BONUS[star] * FEATURED_XP_MULTIPLIER,
    )
    const other = GAME_MODES.find((m) => m.id !== star)!.id
    expect(modeXpBonus(other, day)).toBe(MODE_XP_BONUS[other])
  })
})

describe('chronoAfterAnswer', () => {
  it('une bonne réponse rend du temps, une erreur en coûte', () => {
    expect(chronoAfterAnswer(CHRONO_START_SECONDS, true)).toBe(
      CHRONO_START_SECONDS + CHRONO_GAIN_SECONDS,
    )
    expect(chronoAfterAnswer(CHRONO_START_SECONDS, false)).toBe(
      CHRONO_START_SECONDS - CHRONO_LOSS_SECONDS,
    )
  })

  it('plafonne au maximum et ne descend pas sous zéro', () => {
    expect(chronoAfterAnswer(CHRONO_MAX_SECONDS - 1, true)).toBe(
      CHRONO_MAX_SECONDS,
    )
    expect(chronoAfterAnswer(1, false)).toBe(0)
  })
})

describe('boss', () => {
  const start = { hp: BOSS_HP, lives: BOSS_LIVES }

  it('une bonne réponse frappe le boss, une erreur coûte un cœur', () => {
    expect(bossAfterAnswer(start, true)).toEqual({
      hp: BOSS_HP - 1,
      lives: BOSS_LIVES,
    })
    expect(bossAfterAnswer(start, false)).toEqual({
      hp: BOSS_HP,
      lives: BOSS_LIVES - 1,
    })
  })

  it('le combat continue tant que personne n’est à terre', () => {
    expect(bossOutcome(start)).toBeNull()
    expect(bossOutcome({ hp: 1, lives: 1 })).toBeNull()
  })

  it('boss à 0 PV = victoire, 0 cœur = défaite', () => {
    expect(bossOutcome({ hp: 0, lives: 2 })).toBe('won')
    expect(bossOutcome({ hp: 4, lives: 0 })).toBe('lost')
  })

  it('la victoire prime si tout tombe à zéro sur le même coup', () => {
    expect(bossOutcome({ hp: 0, lives: 0 })).toBe('won')
  })
})

describe('roundWinner', () => {
  it('plus de bonnes réponses gagne la manche', () => {
    expect(roundWinner(round(4, 2))).toBe('me')
    expect(roundWinner(round(1, 3))).toBe('them')
  })

  it('égalité de score : le plus rapide gagne', () => {
    expect(roundWinner(round(3, 3, 18_000, 25_000))).toBe('me')
    expect(roundWinner(round(3, 3, 30_000, 25_000))).toBe('them')
  })

  it('égalité parfaite : au joueur', () => {
    expect(roundWinner(round(3, 3, 20_000, 20_000))).toBe('me')
  })
})

describe('duelWinner', () => {
  it('null tant que personne n’a 2 manches', () => {
    expect(duelWinner([])).toBeNull()
    expect(duelWinner([round(4, 2)])).toBeNull()
    expect(duelWinner([round(4, 2), round(1, 3)])).toBeNull() // 1–1
  })

  it('2–0 sec : le duel s’arrête en deux manches', () => {
    const rounds = [round(4, 2), round(5, 3)]
    expect(duelScore(rounds)).toEqual({ me: 2, them: 0 })
    expect(duelWinner(rounds)).toBe('me')
  })

  it('remontada : mené 0–1, victoire 2–1', () => {
    const rounds = [round(1, 4), round(4, 2), round(5, 1)]
    expect(duelScore(rounds)).toEqual({ me: 2, them: 1 })
    expect(duelWinner(rounds)).toBe('me')
  })

  it('défaite 1–2', () => {
    const rounds = [round(4, 1), round(2, 4), round(0, 3)]
    expect(duelWinner(rounds)).toBe('them')
  })

  it('ROUNDS_TO_WIN vaut 2 (BO3)', () => {
    expect(ROUNDS_TO_WIN).toBe(2)
  })
})

describe('seededRng', () => {
  it('est déterministe pour une même clé', () => {
    const a = seededRng('tom-123')
    const b = seededRng('tom-123')
    expect([a(), a(), a()]).toEqual([b(), b(), b()])
  })

  it('des clés différentes divergent', () => {
    const a = seededRng('tom-123')()
    const b = seededRng('lea-123')()
    expect(a).not.toBe(b)
  })
})

describe('ghostRound', () => {
  it('est déterministe : même clé + manche → même résultat', () => {
    const a = ghostRound('tom-42', 0, 5, 3)
    const b = ghostRound('tom-42', 0, 5, 3)
    expect(a).toEqual(b)
  })

  it('varie d’une manche à l’autre du même duel', () => {
    const rounds = [0, 1, 2].map((i) => ghostRound('tom-42', i, 5, 3))
    const distinct = new Set(rounds.map((r) => `${r.correct}-${r.timeMs}`))
    expect(distinct.size).toBeGreaterThan(1)
  })

  it('reste dans les bornes de la manche', () => {
    for (let i = 0; i < 20; i++) {
      const g = ghostRound(`seed-${i}`, i % 3, 9, 1)
      expect(g.correct).toBeGreaterThanOrEqual(0)
      expect(g.correct).toBeLessThanOrEqual(ROUND_SIZE)
      expect(g.timeMs).toBeGreaterThanOrEqual(ROUND_SIZE * 4000)
      expect(g.timeMs).toBeLessThanOrEqual(ROUND_SIZE * 10_000)
    }
  })

  it('un adversaire bien plus fort vise plus juste en moyenne', () => {
    const avg = (opp: number, mine: number) => {
      let sum = 0
      for (let i = 0; i < 50; i++) {
        sum += ghostRound(`k-${i}`, 0, opp, mine).correct
      }
      return sum / 50
    }
    expect(avg(9, 1)).toBeGreaterThan(avg(1, 9))
  })
})

describe('ghostRoundFrom', () => {
  it("rejoue l'enregistrement réel quand il couvre la manche", () => {
    const recorded = [
      { correct: 4, timeMs: 21_000 },
      { correct: 2, timeMs: 30_000 },
    ]
    expect(ghostRoundFrom(recorded, 'k', 0, 5, 5)).toEqual({
      correct: 4,
      timeMs: 21_000,
    })
    expect(ghostRoundFrom(recorded, 'k', 1, 5, 5)).toEqual({
      correct: 2,
      timeMs: 30_000,
    })
  })

  it('revalide les bornes (la donnée vient du réseau)', () => {
    const g = ghostRoundFrom([{ correct: 99, timeMs: 5 }], 'k', 0, 5, 5)
    expect(g.correct).toBe(ROUND_SIZE)
    expect(g.timeMs).toBe(1000)
  })

  it('repli sur la simulation : manche non couverte ou pas d’enregistrement', () => {
    const simulated = ghostRound('k', 2, 5, 3)
    expect(ghostRoundFrom([{ correct: 3, timeMs: 20_000 }], 'k', 2, 5, 3)).toEqual(
      simulated,
    )
    expect(ghostRoundFrom(null, 'k', 2, 5, 3)).toEqual(simulated)
  })
})

describe('blitz', () => {
  it('multiplicateur : ×1 puis ×2 à 3 d’affilée, ×3 à 6, ×4 à 9', () => {
    expect(blitzMultiplier(0)).toBe(1)
    expect(blitzMultiplier(2)).toBe(1)
    expect(blitzMultiplier(3)).toBe(2)
    expect(blitzMultiplier(5)).toBe(2)
    expect(blitzMultiplier(6)).toBe(3)
    expect(blitzMultiplier(9)).toBe(4)
  })

  it('plafonne à ×4 même sur une série folle', () => {
    expect(blitzMultiplier(50)).toBe(BLITZ_MAX_MULTIPLIER)
  })

  it('les points suivent le multiplicateur', () => {
    expect(blitzPoints(0)).toBe(BLITZ_BASE_POINTS)
    expect(blitzPoints(9)).toBe(BLITZ_BASE_POINTS * 4)
  })
})
