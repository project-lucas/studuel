import { describe, expect, it } from 'vitest'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { herosDeLAvatar, herosHumeurSrc, HUMEURS_PRETES } from './humeurs'
import { HEROS_KEYS, herosVisageSrc } from './eleves'

describe('les humeurs des héros', () => {
  it('chaque héros prêt a ses deux visages servis dans public/', () => {
    for (const cle of HUMEURS_PRETES) {
      for (const humeur of ['victoire', 'defaite'] as const) {
        expect(existsSync(join(process.cwd(), 'public', herosHumeurSrc(cle, humeur)))).toBe(true)
      }
    }
  })

  it('les quinze héros ont leurs deux humeurs', () => {
    for (const cle of HEROS_KEYS) expect(HUMEURS_PRETES.has(cle)).toBe(true)
    expect(herosHumeurSrc('troll-pont', 'defaite')).not.toBe(herosVisageSrc('troll-pont'))
  })

  it('reconnaît le héros d’un avatar, blason converti compris', () => {
    expect(herosDeLAvatar('elfe-rodeur')).toBe('elfe-rodeur')
    expect(herosDeLAvatar('2')).toBe('elfe-rodeur')
    expect(herosDeLAvatar('ia:1234')).toBeNull()
    expect(herosDeLAvatar(undefined)).toBeNull()
  })
})
