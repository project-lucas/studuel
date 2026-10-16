import { describe, expect, it } from 'vitest'
import { piegesParChapitre } from './pieges'

describe('tes pièges', () => {
  it('additionne les erreurs par chapitre et garde les trois pires', () => {
    const titres = new Map([
      ['a', 'Accords'],
      ['b', 'Homophones'],
      ['c', 'Conjugaison'],
      ['d', 'Ponctuation'],
    ])
    const p = piegesParChapitre(
      [
        { chapitre: 'a', erreurs: 2 },
        { chapitre: 'a', erreurs: 2 },
        { chapitre: 'b', erreurs: 3 },
        { chapitre: 'c', erreurs: 1 },
        { chapitre: 'd', erreurs: 1 },
        { chapitre: null, erreurs: 9 },
        { chapitre: 'z', erreurs: 9 },
      ],
      titres,
    )
    expect(p.map((x) => [x.titre, x.erreurs])).toEqual([
      ['Accords', 4],
      ['Homophones', 3],
      ['Conjugaison', 1],
    ])
  })
})
