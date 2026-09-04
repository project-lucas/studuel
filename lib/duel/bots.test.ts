import { describe, expect, it } from 'vitest'
import { BOTS, botById, pickBot, temperamentLabel } from '@/lib/duel/bots'
import { AVATAR_FIELDS, normalizeAvatarConfig } from '@/lib/avatar'
import { TEMPERAMENTS } from '@/lib/duel/rival'

describe('le banc des rivaux', () => {
  it('a vingt-quatre robots, tous distincts', () => {
    expect(BOTS).toHaveLength(24)
    expect(new Set(BOTS.map((b) => b.id)).size).toBe(24)
    expect(new Set(BOTS.map((b) => b.name)).size).toBe(24)
  })

  it('chaque avatar n’utilise que des options du vestiaire', () => {
    // `normalizeAvatarConfig` remplace toute option inconnue par le défaut :
    // un robot dont le look survit à la normalisation ne porte que du valide.
    for (const bot of BOTS) {
      expect(normalizeAvatarConfig(bot.avatar)).toEqual(bot.avatar)
    }
    expect(AVATAR_FIELDS.length).toBeGreaterThan(0)
  })

  it('les quatre tempéraments sont représentés, la force reste modérée', () => {
    for (const t of TEMPERAMENTS) {
      expect(BOTS.some((b) => b.temperament === t)).toBe(true)
      expect(temperamentLabel(t)).not.toBe('')
    }
    for (const bot of BOTS) {
      expect(Math.abs(bot.strength)).toBeLessThanOrEqual(0.6)
      expect(bot.motto.length).toBeGreaterThan(3)
    }
  })

  it('se tire de la graine, sans homonyme ni rival de la course d’avant', () => {
    const a = pickBot('s')
    expect(pickBot('s')).toEqual(a)
    expect(pickBot('s', { excludeId: a.id }).id).not.toBe(a.id)
    expect(pickBot('s', { excludeName: `${a.name} Dupont` }).name).not.toBe(a.name)
    expect(botById(a.id)).toEqual(a)
    expect(botById('inconnu')).toBeNull()
  })
})
