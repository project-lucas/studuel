import { describe, it, expect } from 'vitest'
import { CHEST_REWARDS, drawChestReward } from '@/lib/tresor'

describe('drawChestReward', () => {
  it('rand = 0 → première récompense (la plus fréquente)', () => {
    expect(drawChestReward(0)).toBe(CHEST_REWARDS[0])
  })

  it('rand proche de 1 → dernière récompense (la plus rare)', () => {
    expect(drawChestReward(0.9999)).toBe(CHEST_REWARDS[CHEST_REWARDS.length - 1])
  })

  it('respecte les frontières de poids cumulés', () => {
    const total = CHEST_REWARDS.reduce((s, r) => s + r.weight, 0)
    // Juste sous / juste sur la frontière du premier poids.
    const first = CHEST_REWARDS[0].weight
    expect(drawChestReward((first - 0.01) / total)).toBe(CHEST_REWARDS[0])
    expect(drawChestReward((first + 0.01) / total)).toBe(CHEST_REWARDS[1])
  })

  it('chaque tirage renvoie bien une récompense du catalogue', () => {
    for (let i = 0; i < 20; i++) {
      expect(CHEST_REWARDS).toContain(drawChestReward(i / 20))
    }
  })
})
