import { describe, it, expect } from 'vitest'
import {
  UI_MAX_PEAK,
  openTones,
  swipeTones,
  edgeBumpTones,
  battleTones,
} from './ui-audio'
import type { ToneSpec } from './game-audio'

// Invariants communs à TOUS les sons d'UI : des notes bien formées et bornées.
// C'est le garde-fou qui empêche un futur réglage de partir en fréquence
// négative ou en volume qui hurle.
function expectWellFormed(tones: ToneSpec[]) {
  expect(tones.length).toBeGreaterThan(0)
  for (const t of tones) {
    expect(t.freq).toBeGreaterThan(0)
    expect(t.at).toBeGreaterThanOrEqual(0)
    expect(t.dur).toBeGreaterThan(0)
    expect(t.peak).toBeGreaterThan(0)
    expect(t.peak).toBeLessThanOrEqual(UI_MAX_PEAK)
  }
}

describe('openTones', () => {
  it('produit des notes bien formées et bornées', () => {
    expectWellFormed(openTones())
  })

  it('MONTE : la dernière note est plus aiguë que la première', () => {
    const tones = openTones()
    expect(tones[tones.length - 1].freq).toBeGreaterThan(tones[0].freq)
  })
})

describe('swipeTones', () => {
  it('produit des notes bien formées et bornées', () => {
    expectWellFormed(swipeTones('up'))
    expectWellFormed(swipeTones('down'))
  })

  it('monte vers le haut, descend vers le bas — un glissando lisible', () => {
    const up = swipeTones('up')
    const down = swipeTones('down')
    expect(up[up.length - 1].freq).toBeGreaterThan(up[0].freq)
    expect(down[down.length - 1].freq).toBeLessThan(down[0].freq)
  })

  it('les deux directions parcourent le même intervalle, en miroir', () => {
    const up = swipeTones('up')
    const down = swipeTones('down')
    expect(up[0].freq).toBeCloseTo(down[down.length - 1].freq)
    expect(up[up.length - 1].freq).toBeCloseTo(down[0].freq)
  })

  it('reste discret : un swish, pas une mélodie', () => {
    for (const t of swipeTones('up')) {
      expect(t.peak).toBeLessThanOrEqual(0.02)
    }
  })
})

describe('edgeBumpTones', () => {
  it('produit des notes bien formées et bornées', () => {
    expectWellFormed(edgeBumpTones())
  })

  it('reste GRAVE : un « bwomp », pas un tintement', () => {
    for (const t of edgeBumpTones()) {
      expect(t.freq).toBeLessThan(200)
    }
  })
})

describe('battleTones', () => {
  it('produit des notes bien formées et bornées', () => {
    expectWellFormed(battleTones())
  })

  it('porte un coup GRAVE — le poids qui rend le hit épique', () => {
    const lowest = Math.min(...battleTones().map((t) => t.freq))
    expect(lowest).toBeLessThan(100)
  })

  it('est le son le plus FORT de l’UI — plus que l’ouverture d’un dossier', () => {
    const battleMax = Math.max(...battleTones().map((t) => t.peak))
    const openMax = Math.max(...openTones().map((t) => t.peak))
    expect(battleMax).toBeGreaterThan(openMax)
  })

  it('est une LEVÉE puis un accord : la levée précède le hit', () => {
    const tones = battleTones()
    const hitStart = Math.max(...tones.map((t) => t.at))
    expect(tones[0].at).toBeLessThan(hitStart)
  })
})
