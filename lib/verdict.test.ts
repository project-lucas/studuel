import { describe, it, expect } from 'vitest'
import { verdictFor } from './verdict'

describe('verdictFor', () => {
  it('garde les mêmes seuils dans les deux cycles', () => {
    // Un 8/10 vaut « bien » que l'on soit en 6e ou en Terminale : c'est le TON
    // qui change, pas l'exigence.
    for (const grade of ['6e', 'Tle']) {
      expect(verdictFor(1, grade)).not.toEqual(verdictFor(0.9, grade))
      expect(verdictFor(0.8, grade)).toEqual(verdictFor(0.9, grade))
      expect(verdictFor(0.5, grade)).toEqual(verdictFor(0.7, grade))
      expect(verdictFor(0.4, grade)).not.toEqual(verdictFor(0.5, grade))
    }
  })

  it('n’envoie pas « Aïeee » à un Terminale', () => {
    // Le défaut corrigé : le ton collège était servi à tout le monde.
    expect(verdictFor(0.2, '6e').message).toContain('Aïeee')
    expect(verdictFor(0.2, 'Tle').message).not.toContain('Aïeee')
    expect(verdictFor(0.2, 'Tle').message).not.toEqual(verdictFor(0.2, '6e').message)
  })

  it('traite 2de, 1re et Tle comme du lycée, le reste comme du collège', () => {
    const lycee = verdictFor(1, 'Tle')
    expect(verdictFor(1, '2de')).toEqual(lycee)
    expect(verdictFor(1, '1re')).toEqual(lycee)

    const college = verdictFor(1, '6e')
    expect(verdictFor(1, '3e')).toEqual(college)
    expect(college).not.toEqual(lycee)
  })

  it('retombe sur le ton collège quand la classe est inconnue', () => {
    // Quiz personnel de la bibliothèque : aucune classe attachée.
    expect(verdictFor(0.9, null)).toEqual(verdictFor(0.9, '6e'))
    expect(verdictFor(0.9, undefined)).toEqual(verdictFor(0.9, '6e'))
  })

  it('donne toujours un emoji et un message non vides', () => {
    for (const ratio of [0, 0.3, 0.5, 0.8, 1]) {
      for (const grade of ['6e', 'Tle', null]) {
        const v = verdictFor(ratio, grade)
        expect(v.emoji.length).toBeGreaterThan(0)
        expect(v.message.length).toBeGreaterThan(0)
      }
    }
  })
})
