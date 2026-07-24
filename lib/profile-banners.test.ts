import { describe, it, expect } from 'vitest'
import {
  PROFILE_BANNERS,
  DEFAULT_PROFILE_BANNER,
  bannerFor,
} from './profile-banners'

describe('PROFILE_BANNERS', () => {
  it('a des clés uniques', () => {
    const keys = PROFILE_BANNERS.map((b) => b.key)
    expect(new Set(keys).size).toBe(keys.length)
  })

  it('la bannière par défaut existe dans le catalogue', () => {
    expect(PROFILE_BANNERS.some((b) => b.key === DEFAULT_PROFILE_BANNER)).toBe(true)
  })
})

describe('bannerFor', () => {
  it('renvoie la bannière demandée', () => {
    expect(bannerFor('flamme-serie').name).toBe('Flamme de série')
  })

  it('retombe sur le défaut pour une clé inconnue', () => {
    expect(bannerFor('inexistante').key).toBe(DEFAULT_PROFILE_BANNER)
  })

  it('retombe sur le défaut pour null/undefined', () => {
    expect(bannerFor(null).key).toBe(DEFAULT_PROFILE_BANNER)
    expect(bannerFor(undefined).key).toBe(DEFAULT_PROFILE_BANNER)
  })
})
