import { describe, expect, it } from 'vitest'
import { compterPar, contactables, estSuperieur } from './site-leads'

describe('les demandes du site Studuel', () => {
  it('reconnaît une inscription au supérieur', () => {
    expect(estSuperieur({ matiere: 'sup-droit' })).toBe(true)
    expect(estSuperieur({ matiere: 'maths' })).toBe(false)
  })

  it('compte et trie par clé, le plus demandé d’abord', () => {
    const l = [{ m: 'maths' }, { m: 'svt' }, { m: 'maths' }]
    expect(compterPar(l, (x) => x.m)).toEqual([
      { cle: 'maths', n: 2 },
      { cle: 'svt', n: 1 },
    ])
  })

  it('ne garde que les e-mails qui ont accepté les nouvelles, sans doublon', () => {
    expect(
      contactables([
        { email: 'A@x.fr', nouvelles: true },
        { email: 'a@x.fr', nouvelles: true },
        { email: 'b@x.fr', nouvelles: false },
      ]),
    ).toEqual(['a@x.fr'])
  })
})
