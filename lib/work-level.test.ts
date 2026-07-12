import { describe, it, expect } from 'vitest'
import { workLevel } from '@/lib/work-level'

const HOUR = 3600

describe('workLevel', () => {
  it('démarre Recrue à 0 s, progression vers 1 h', () => {
    const level = workLevel(0)
    expect(level.level).toBe(1)
    expect(level.title).toBe('Recrue')
    expect(level.progress).toBe(0)
    expect(level.nextHours).toBe(1)
  })

  it('franchit un palier pile au seuil', () => {
    expect(workLevel(HOUR - 1).title).toBe('Recrue')
    expect(workLevel(HOUR).title).toBe('Apprenti')
  })

  it('progression à mi-chemin entre deux paliers', () => {
    // Apprenti (1 h) → Curieux (3 h) : à 2 h, mi-chemin.
    expect(workLevel(2 * HOUR).progress).toBeCloseTo(0.5)
  })

  it('les secondes négatives sont traitées comme 0', () => {
    expect(workLevel(-500).level).toBe(1)
  })

  it('au sommet : Légende, progress = 1, pas de palier suivant', () => {
    const top = workLevel(5000 * HOUR)
    expect(top.title).toBe('Légende')
    expect(top.progress).toBe(1)
    expect(top.nextHours).toBeNull()
  })
})
