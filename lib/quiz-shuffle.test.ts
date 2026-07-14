import { describe, it, expect } from 'vitest'
import { permuteOptions, permuteQuizOptions } from './quiz-shuffle'

describe('permuteOptions', () => {
  const options = ['Paris', 'Londres', 'Berlin', 'Madrid']

  it("garde la bonne réponse sur la même chaîne après permutation", () => {
    const result = permuteOptions(options, 0, 'q-1')
    expect(result.options[result.correctIndex]).toBe('Paris')
  })

  it('conserve exactement le même ensemble d’options', () => {
    const result = permuteOptions(options, 2, 'q-42')
    expect([...result.options].sort()).toEqual([...options].sort())
    expect(result.options).toHaveLength(options.length)
  })

  it('est déterministe : même seed → même ordre', () => {
    const a = permuteOptions(options, 1, 'stable-seed')
    const b = permuteOptions(options, 1, 'stable-seed')
    expect(a.options).toEqual(b.options)
    expect(a.correctIndex).toBe(b.correctIndex)
  })

  it('produit des ordres différents selon le seed', () => {
    // Sur assez de graines, au moins une doit différer de l’ordre d’origine.
    const seeds = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    const orders = seeds.map((s) => permuteOptions(options, 0, s).options.join('|'))
    const changed = orders.some((o) => o !== options.join('|'))
    expect(changed).toBe(true)
  })

  it('renvoie la bonne réponse correcte quel que soit son index de départ', () => {
    for (let ci = 0; ci < options.length; ci++) {
      const result = permuteOptions(options, ci, `seed-${ci}`)
      expect(result.options[result.correctIndex]).toBe(options[ci])
    }
  })

  it('ne touche rien avec moins de 2 options', () => {
    expect(permuteOptions(['Seul'], 0, 's')).toEqual({ options: ['Seul'], correctIndex: 0 })
    expect(permuteOptions([], 0, 's')).toEqual({ options: [], correctIndex: 0 })
  })

  it('renvoie tel quel si correctIndex est hors bornes', () => {
    expect(permuteOptions(options, -1, 's')).toEqual({ options, correctIndex: -1 })
    expect(permuteOptions(options, 9, 's')).toEqual({ options, correctIndex: 9 })
  })

  it('est déterministe pour un même seed (hôte/invité produisent le même ordre)', () => {
    // Coop/Duel en direct : hôte et invité chargent leurs questions séparément
    // mais sèment par `question.id` → même ordre des deux côtés.
    const host = permuteOptions(options, 1, 'q-shared-id')
    const guest = permuteOptions(options, 1, 'q-shared-id')
    expect(host).toEqual(guest)
  })
})

describe('permuteQuizOptions', () => {
  const options = ['Paris', 'Londres', 'Berlin', 'Madrid']

  it('ne touche pas un vrai/faux (garde « Vrai » puis « Faux »)', () => {
    const vf = ['Vrai', 'Faux']
    expect(permuteQuizOptions('true_false', vf, 0, 'seed')).toEqual({ options: vf, correctIndex: 0 })
    expect(permuteQuizOptions('true_false', vf, 1, 'seed')).toEqual({ options: vf, correctIndex: 1 })
  })

  it('mélange un QCM en gardant la bonne réponse', () => {
    const r = permuteQuizOptions('mcq', options, 2, 'seed-xyz')
    expect(r.options[r.correctIndex]).toBe('Berlin')
    expect([...r.options].sort()).toEqual([...options].sort())
  })

  it('donne le même ordre des deux côtés pour un même id (hôte/invité)', () => {
    const host = permuteQuizOptions('mcq', options, 3, 'q-42')
    const guest = permuteQuizOptions('mcq', options, 3, 'q-42')
    expect(host).toEqual(guest)
  })
})
