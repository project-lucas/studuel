import { describe, it, expect } from 'vitest'
import {
  DUEL_SECONDS,
  DUEL_MS,
  POINTS_BASE,
  POINTS_SPEED_MAX,
  SPEED_FAST_MS,
  SPEED_SLOW_MS,
  MAX_COMBO_MULTIPLIER,
  comboMultiplier,
  speedBonus,
  answerPoints,
  rivalAccuracy,
  buildRival,
  rivalScoreAt,
  duel90Outcome,
  duel90Trophies,
  duel90Xp,
  duel90Result,
  accuracyLabel,
  outcomeHeadline,
  clockLabel,
  TROPHIES_WIN,
  TROPHIES_LOSS,
} from './duel90'

describe('format du duel', () => {
  it('dure 90 secondes', () => {
    expect(DUEL_SECONDS).toBe(90)
    expect(DUEL_MS).toBe(90_000)
  })
})

describe('comboMultiplier', () => {
  it('vaut 1 avant 3 bonnes réponses d’affilée', () => {
    expect(comboMultiplier(0)).toBe(1)
    expect(comboMultiplier(2)).toBe(1)
  })

  it('passe à 2 à 3 d’affilée, à 3 à 6', () => {
    expect(comboMultiplier(3)).toBe(2)
    expect(comboMultiplier(5)).toBe(2)
    expect(comboMultiplier(6)).toBe(3)
  })

  it('plafonne au multiplicateur maximum', () => {
    expect(comboMultiplier(50)).toBe(MAX_COMBO_MULTIPLIER)
  })

  it('encaisse une valeur incohérente sans casser', () => {
    expect(comboMultiplier(-5)).toBe(1)
    expect(comboMultiplier(Number.NaN)).toBe(1)
  })
})

describe('speedBonus', () => {
  it('donne le bonus plein sous le seuil rapide', () => {
    expect(speedBonus(0)).toBe(POINTS_SPEED_MAX)
    expect(speedBonus(SPEED_FAST_MS)).toBe(POINTS_SPEED_MAX)
  })

  it('ne donne rien au-delà du seuil lent', () => {
    expect(speedBonus(SPEED_SLOW_MS)).toBe(0)
    expect(speedBonus(30_000)).toBe(0)
  })

  it('décroît entre les deux seuils', () => {
    const milieu = speedBonus((SPEED_FAST_MS + SPEED_SLOW_MS) / 2)
    expect(milieu).toBeGreaterThan(0)
    expect(milieu).toBeLessThan(POINTS_SPEED_MAX)
    expect(speedBonus(3000)).toBeGreaterThan(speedBonus(6000))
  })
})

describe('answerPoints', () => {
  it('combine la base, la vitesse et la série', () => {
    // 3 d'affilée → ×2 ; réponse instantanée → bonus plein.
    expect(answerPoints(3, 0)).toBe((POINTS_BASE + POINTS_SPEED_MAX) * 2)
  })

  it('rapporte toujours au moins la base', () => {
    expect(answerPoints(0, 60_000)).toBe(POINTS_BASE)
  })
})

describe('rivalAccuracy', () => {
  it('monte avec l’écart de niveau et reste bornée', () => {
    expect(rivalAccuracy(10, 1)).toBeGreaterThan(rivalAccuracy(1, 10))
    expect(rivalAccuracy(99, 1)).toBeLessThanOrEqual(0.85)
    expect(rivalAccuracy(1, 99)).toBeGreaterThanOrEqual(0.45)
  })
})

describe('buildRival', () => {
  it('est déterministe : même clé, même adversaire', () => {
    const a = buildRival('duel-42', 'Léa', 5, 5)
    const b = buildRival('duel-42', 'Léa', 5, 5)
    expect(b.ticks).toEqual(a.ticks)
    expect(b.finalScore).toBe(a.finalScore)
  })

  it('donne des adversaires différents pour des clés différentes', () => {
    const a = buildRival('duel-1', 'Léa', 5, 5)
    const b = buildRival('duel-2', 'Léa', 5, 5)
    expect(b.finalScore).not.toBe(a.finalScore)
  })

  it('ne joue jamais au-delà des 90 secondes', () => {
    const r = buildRival('duel-borne', 'Max', 8, 3)
    for (const t of r.ticks) expect(t.atMs).toBeLessThanOrEqual(DUEL_MS)
  })

  it('a un score croissant et un nom non vide', () => {
    const r = buildRival('duel-croissant', '   ', 4, 4)
    expect(r.name).toBe('Rival')
    let last = -1
    for (const t of r.ticks) {
      expect(t.total).toBeGreaterThanOrEqual(last)
      last = t.total
    }
    expect(r.finalScore).toBe(r.ticks[r.ticks.length - 1]?.total ?? 0)
  })

  it('marque des points sur un duel complet', () => {
    expect(buildRival('duel-actif', 'Sam', 5, 5).finalScore).toBeGreaterThan(0)
  })
})

describe('rivalScoreAt', () => {
  const rival = buildRival('duel-courbe', 'Léa', 5, 5)

  it('est à zéro au coup d’envoi', () => {
    expect(rivalScoreAt(rival, 0)).toBe(0)
    expect(rivalScoreAt(rival, -100)).toBe(0)
  })

  it('atteint son score final à la fin du duel', () => {
    expect(rivalScoreAt(rival, DUEL_MS)).toBe(rival.finalScore)
  })

  it('ne redescend jamais', () => {
    let last = 0
    for (let ms = 0; ms <= DUEL_MS; ms += 1000) {
      const s = rivalScoreAt(rival, ms)
      expect(s).toBeGreaterThanOrEqual(last)
      last = s
    }
  })

  it('avance par paliers, pas en continu', () => {
    const first = rival.ticks[0]
    expect(rivalScoreAt(rival, first.atMs - 1)).toBe(0)
    expect(rivalScoreAt(rival, first.atMs)).toBe(first.total)
  })
})

describe('duel90Outcome', () => {
  it('tranche en faveur du plus haut score', () => {
    expect(duel90Outcome(500, 400)).toBe('win')
    expect(duel90Outcome(400, 500)).toBe('loss')
  })

  it('appelle égalité une égalité parfaite', () => {
    expect(duel90Outcome(400, 400)).toBe('draw')
  })
})

describe('duel90Trophies', () => {
  it('rapporte deux fois plus qu’une défaite ne coûte', () => {
    expect(duel90Trophies('win')).toBe(TROPHIES_WIN)
    expect(duel90Trophies('loss')).toBe(TROPHIES_LOSS)
    expect(duel90Trophies('draw')).toBe(0)
    expect(TROPHIES_WIN).toBe(-2 * TROPHIES_LOSS)
  })
})

describe('duel90Xp', () => {
  it('récompense d’abord les bonnes réponses', () => {
    const perdu = duel90Xp(10, 'loss')
    const gagne = duel90Xp(10, 'win')
    expect(perdu).toBeGreaterThan(0)
    expect(gagne).toBeGreaterThan(perdu)
    // Une défaite avec 10 bonnes réponses vaut mieux qu'une victoire à 0.
    expect(perdu).toBeGreaterThan(duel90Xp(0, 'win'))
  })
})

describe('duel90Result', () => {
  it('assemble un résultat cohérent', () => {
    const r = duel90Result(820, 7, 9, 4, 640)
    expect(r.outcome).toBe('win')
    expect(r.trophies).toBe(TROPHIES_WIN)
    expect(r.xp).toBe(duel90Xp(7, 'win'))
    expect(r.score).toBe(820)
  })

  it('assainit les valeurs négatives ou fractionnaires', () => {
    const r = duel90Result(-10, 2.6, 4.2, -3, 100)
    expect(r.score).toBe(0)
    expect(r.correct).toBe(3)
    expect(r.answered).toBe(4)
    expect(r.bestCombo).toBe(0)
    expect(r.outcome).toBe('loss')
  })
})

describe('libellés', () => {
  it('affiche la précision bornée par le nombre de réponses', () => {
    expect(accuracyLabel(8, 11)).toBe('8/11')
    expect(accuracyLabel(20, 11)).toBe('11/11')
  })

  it('reste encourageant même dans la défaite', () => {
    expect(outcomeHeadline('win')).toContain('gagné')
    expect(outcomeHeadline('draw')).toContain('Égalité')
    expect(outcomeHeadline('loss')).not.toContain('Perdu')
  })

  it('formate le chrono en minutes:secondes', () => {
    expect(clockLabel(90_000)).toBe('1:30')
    expect(clockLabel(7_000)).toBe('0:07')
    expect(clockLabel(0)).toBe('0:00')
    expect(clockLabel(-500)).toBe('0:00')
  })
})
