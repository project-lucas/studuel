import { describe, expect, it, vi } from 'vitest'
import { abonnerSupports, signalerSupportsPerimes, versionSupports } from './supports-perimes'

describe('les supports d’une fiche périment après une lecture', () => {
  it('le numéro monte et prévient les abonnés, pas les désabonnés', () => {
    const avant = versionSupports()
    const f = vi.fn()
    const quitter = abonnerSupports(f)
    signalerSupportsPerimes()
    expect(versionSupports()).toBe(avant + 1)
    expect(f).toHaveBeenCalledTimes(1)
    quitter()
    signalerSupportsPerimes()
    expect(f).toHaveBeenCalledTimes(1)
    expect(versionSupports()).toBe(avant + 2)
  })
})
