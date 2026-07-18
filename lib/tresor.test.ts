import { describe, it, expect } from 'vitest'
import {
  CHEST_REWARDS,
  COLLECTION_CATALOG,
  drawChestReward,
  resolveServerReward,
} from '@/lib/tresor'

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

describe('resolveServerReward', () => {
  it('renvoie null pour un payload nul ou incohérent', () => {
    expect(resolveServerReward(null)).toBeNull()
    expect(resolveServerReward(undefined)).toBeNull()
    expect(resolveServerReward({})).toBeNull()
    expect(resolveServerReward({ kind: 'coins', amount: 0 })).toBeNull()
    expect(resolveServerReward({ kind: 'coins', amount: -50 })).toBeNull()
    expect(resolveServerReward({ kind: 'coins', amount: null })).toBeNull()
    expect(resolveServerReward({ kind: 'sticker' })).toBeNull()
    expect(resolveServerReward({ kind: 'sticker', item_id: 'inconnu' })).toBeNull()
  })

  it('résout un montant de palier connu vers l’entrée soignée du catalogue', () => {
    const jackpot = CHEST_REWARDS.find(
      (r) => r.kind === 'coins' && r.amount === 150,
    )
    expect(resolveServerReward({ kind: 'coins', amount: 150 })).toBe(jackpot)
  })

  it('résout un montant hors palier (repli +25 du serveur) en libellé générique', () => {
    // 25 EST un palier connu : on récupère l'entrée catalogue.
    const r25 = resolveServerReward({ kind: 'coins', amount: 25 })
    expect(r25).toMatchObject({ kind: 'coins', amount: 25 })
    // Un montant arbitraire non catalogué reste affichable proprement.
    const r99 = resolveServerReward({ kind: 'coins', amount: 99 })
    expect(r99).toMatchObject({ kind: 'coins', amount: 99, label: '+99 pièces' })
  })

  it('résout un sticker vers la carte de collection correspondante', () => {
    const card = COLLECTION_CATALOG[0]
    const reward = resolveServerReward({ kind: 'sticker', item_id: card.id })
    expect(reward).toMatchObject({
      kind: 'sticker',
      itemId: card.id,
      emoji: card.emoji,
    })
    expect(reward?.label).toContain(card.name)
  })
})
