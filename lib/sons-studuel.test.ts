import { describe, expect, it } from 'vitest'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { adresseSon, demiTonsPerle, NOMS_SONS, tauxDeLecture, TIC_HZ } from './sons-studuel'

describe('demiTonsPerle — la vague de tics monte en pentatonique de do', () => {
  it('la première perle sonne en sol (G6)', () => {
    expect(TIC_HZ * tauxDeLecture(demiTonsPerle(0))).toBeCloseTo(1567.98, 1)
  })

  it('chaque perle est plus haute que la précédente, jusqu’au plafond', () => {
    const hauteurs = Array.from({ length: 10 }, (_, i) => demiTonsPerle(i))
    for (let i = 1; i < hauteurs.length; i++) expect(hauteurs[i]).toBeGreaterThan(hauteurs[i - 1])
    expect(demiTonsPerle(30)).toBe(demiTonsPerle(9))
  })

  it('toutes les notes sont dans la gamme de do (sol, la, do, ré, mi)', () => {
    const DO_MAJEUR_PENTA = new Set([0, 2, 4, 7, 9])
    for (let i = 0; i < 10; i++) {
      const hz = TIC_HZ * tauxDeLecture(demiTonsPerle(i))
      const depuisDo = Math.round(12 * Math.log2(hz / 261.63)) % 12
      expect(DO_MAJEUR_PENTA.has(depuisDo)).toBe(true)
    }
  })

  it('un rang absurde reste sur la première perle', () => {
    expect(demiTonsPerle(-3)).toBe(demiTonsPerle(0))
    expect(demiTonsPerle(Number.NaN)).toBe(demiTonsPerle(0))
  })
})

describe('les fichiers des bruitages', () => {
  it('chaque son du catalogue est servi dans public/', () => {
    for (const nom of NOMS_SONS) {
      expect(existsSync(join(process.cwd(), 'public', adresseSon(nom)))).toBe(true)
    }
  })
})
