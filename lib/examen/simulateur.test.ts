import { describe, expect, it } from 'vitest'
import { COEFFICIENTS_BAC, MENTIONS, noteNecessaire, phraseVerdict } from './simulateur'

const bien = MENTIONS.find((m) => m.id === 'b')!

describe('ce qu’il te faut en juin', () => {
  it('pèse 100 dans les deux voies', () => {
    for (const c of Object.values(COEFFICIENTS_BAC)) {
      expect(c.controleContinu + c.francaisEcrit + c.francaisOral + c.mathsAnticipees + c.juin).toBe(100)
    }
  })

  it('calcule la moyenne de juin, arrondie au dixième supérieur', () => {
    // 13,4 × 40 + 12 × 5 + 15 × 5 + 14 × 2 = 699 ; il faut 1 400 ; reste 701 sur 48.
    const v = noteNecessaire({ voie: 'generale', controleContinu: 13.4, francaisEcrit: 12, francaisOral: 15, mathsAnticipees: 14 }, 14)
    expect(v).toEqual({ etat: 'possible', moyenne: 14.7 })
  })

  it('dit ce qui manque avant de calculer', () => {
    const v = noteNecessaire({ voie: 'generale', controleContinu: 12, francaisEcrit: null, francaisOral: 11, mathsAnticipees: null }, 12)
    expect(v.etat).toBe('incomplet')
    if (v.etat === 'incomplet') expect(v.manque).toHaveLength(2)
    expect(phraseVerdict(v, bien)).toMatch(/^Donne-moi/)
  })

  it('reconnaît une mention déjà assurée et une mention hors de portée', () => {
    expect(noteNecessaire({ voie: 'generale', controleContinu: 20, francaisEcrit: 20, francaisOral: 20, mathsAnticipees: 20 }, 10).etat).toBe('acquis')
    expect(noteNecessaire({ voie: 'technologique', controleContinu: 6, francaisEcrit: 5, francaisOral: 5, mathsAnticipees: 5 }, 18).etat).toBe('hors-de-portee')
  })

  it('refuse une note hors de 0-20', () => {
    expect(noteNecessaire({ voie: 'generale', controleContinu: 21, francaisEcrit: 10, francaisOral: 10, mathsAnticipees: 10 }, 12).etat).toBe('incomplet')
  })
})
