import { describe, it, expect } from 'vitest'
import {
  UI_MAX_PEAK,
  openTones,
  edgeBumpTones,
  battleTones,
  NOTICE_MAX_PEAK,
  noticeOkTones,
  noticeKoTones,
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

describe('les sons de toast', () => {
  it('produisent des notes bien formées', () => {
    expectWellFormed(noticeOkTones())
    expectWellFormed(noticeKoTones())
  })

  it('restent SOUS le plafond des toasts, plus bas que celui de l’UI', () => {
    // Un toast peut tomber trois fois de suite pendant qu'on tâtonne dans un
    // formulaire : c'est le son le plus répété de l'app, donc le plus discret.
    expect(NOTICE_MAX_PEAK).toBeLessThan(UI_MAX_PEAK)
    for (const t of [...noticeOkTones(), ...noticeKoTones()]) {
      expect(t.peak).toBeLessThanOrEqual(NOTICE_MAX_PEAK)
    }
  })

  it('sont plus courts que l’ouverture d’un dossier', () => {
    const fin = (tones: { at: number; dur: number }[]) =>
      Math.max(...tones.map((t) => t.at + t.dur))
    expect(fin(noticeOkTones())).toBeLessThan(fin(openTones()) + 0.05)
    expect(fin(noticeKoTones())).toBeLessThan(0.25)
  })

  it('la confirmation MONTE', () => {
    const t = noticeOkTones()
    expect(t[t.length - 1].freq).toBeGreaterThan(t[0].freq)
  })

  it('le refus ne bouge PAS : deux fois la même note', () => {
    // Une descente voudrait dire « on recule » — c'est déjà le sens de
    // press('back'). Un refus n'est pas un retour : on n'a pas bougé.
    const t = noticeKoTones()
    expect(t.length).toBe(2)
    expect(t[1].freq).toBe(t[0].freq)
    expect(t[1].at).toBeGreaterThan(t[0].at + t[0].dur)
  })

  it('ne se confondent pas l’un avec l’autre', () => {
    expect(noticeOkTones()[0].freq).not.toBe(noticeKoTones()[0].freq)
  })
})
