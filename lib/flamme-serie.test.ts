import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { FICHIER_FLAMME, avantPalierSuivant, palierFlamme, type PalierFlamme } from './flamme-serie'

describe('les paliers de la flamme', () => {
  it('orange jusqu’à 4 jours, bleue dès 5 — et pas de troisième palier', () => {
    expect([0, 1, 2, 4, 5, 6, 7, 30].map(palierFlamme)).toEqual([
      'feu', 'feu', 'feu', 'feu', 'bleue', 'bleue', 'bleue', 'bleue',
    ])
    expect(palierFlamme(Number.NaN)).toBe('feu')
  })

  it('dit ce qu’il reste avant la flamme bleue', () => {
    expect(avantPalierSuivant(2)).toEqual({ palier: 'bleue', jours: 3 })
    expect(avantPalierSuivant(5)).toBeNull()
  })

  it('a ses flammes animées, et leur image fixe', () => {
    for (const p of ['feu', 'bleue'] as PalierFlamme[]) {
      for (const suffixe of ['', '-fixe']) {
        const f = join(process.cwd(), 'public', 'images', 'serie', `${FICHIER_FLAMME[p]}${suffixe}.webp`)
        expect(existsSync(f), f).toBe(true)
      }
    }
  })
})
