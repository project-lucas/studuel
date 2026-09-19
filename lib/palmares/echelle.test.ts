import { describe, expect, it } from 'vitest'
import {
  indiceRupture,
  maLigne,
  metalDuRang,
  parseEchelle,
  phraseEchelleVide,
} from './echelle'

const lignes = [
  { rank: 1, name: 'Nour', avatar: { seed: 'a' }, score: 2100, is_me: false },
  { rank: 2, name: 'Léa', avatar: null, score: 1370, is_me: false },
  { rank: 3, name: 'Sam', avatar: {}, score: 1300, is_me: false },
  { rank: 14, name: 'Moi', avatar: {}, score: 900, is_me: true },
]

describe('parseEchelle', () => {
  it('lit les lignes de mode_ladder', () => {
    const l = parseEchelle(lignes)
    expect(l).toHaveLength(4)
    expect(l[0]).toEqual({ rank: 1, name: 'Nour', avatar: { seed: 'a' }, score: 2100, isMe: false })
    expect(l[1].avatar).toBeNull()
    expect(l[3].isMe).toBe(true)
  })

  it('rend vide sur autre chose qu’un tableau, et saute les lignes cassées', () => {
    expect(parseEchelle(null)).toEqual([])
    expect(parseEchelle({})).toEqual([])
    expect(parseEchelle([{ rank: 'x', score: 1 }, { rank: 0, score: 1 }, null])).toEqual([])
  })
})

describe('le podium', () => {
  it('or, argent, bronze, puis rien', () => {
    expect(metalDuRang(1)).toBe('or')
    expect(metalDuRang(2)).toBe('argent')
    expect(metalDuRang(3)).toBe('bronze')
    expect(metalDuRang(4)).toBeNull()
  })
})

describe('la rupture et ma ligne', () => {
  it('trouve la ligne isolée sous le top', () => {
    expect(indiceRupture(parseEchelle(lignes))).toBe(3)
  })

  it('n’en trouve pas quand tout se suit', () => {
    expect(indiceRupture(parseEchelle(lignes.slice(0, 3)))).toBe(-1)
    expect(indiceRupture([])).toBe(-1)
  })

  it('retrouve ma ligne', () => {
    expect(maLigne(parseEchelle(lignes))?.rank).toBe(14)
    expect(maLigne(parseEchelle(lignes.slice(0, 3)))).toBeNull()
  })
})

describe('l’échelle vide', () => {
  it('invite à prendre la première place', () => {
    expect(phraseEchelleVide('semaine')).toMatch(/première place/)
    expect(phraseEchelleVide('toujours')).toMatch(/premier record/)
  })
})
