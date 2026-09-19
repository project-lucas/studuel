import { describe, expect, it } from 'vitest'
import { SLUG_MAX, normaliserPrioritaires, separerPrioritaires } from './matieres-prioritaires'

describe('normaliserPrioritaires', () => {
  it('rend une liste vide pour tout ce qui n’est pas un tableau', () => {
    expect(normaliserPrioritaires(null)).toEqual([])
    expect(normaliserPrioritaires(undefined)).toEqual([])
    expect(normaliserPrioritaires('maths')).toEqual([])
    expect(normaliserPrioritaires({ maths: true })).toEqual([])
  })

  it('ne garde que des slugs propres, sans doublon, dans l’ordre', () => {
    expect(normaliserPrioritaires(['maths', ' anglais ', 42, '', 'maths', null])).toEqual(['maths', 'anglais'])
  })

  it('rejette un slug trop long', () => {
    expect(normaliserPrioritaires(['x'.repeat(SLUG_MAX + 1), 'svt'])).toEqual(['svt'])
  })
})

describe('separerPrioritaires', () => {
  const maths = { slug: 'maths', name: 'Maths' }
  const anglais = { slug: 'anglais', name: 'Anglais' }
  const svt = { slug: 'svt', name: 'SVT' }

  it('met les prioritaires devant, chaque moitié dans l’ordre reçu', () => {
    const r = separerPrioritaires([maths, anglais, svt], ['svt', 'maths'])
    expect(r.prioritaires.map((m) => m.slug)).toEqual(['maths', 'svt'])
    expect(r.autres.map((m) => m.slug)).toEqual(['anglais'])
  })

  it('accepte un Set comme un tableau', () => {
    const r = separerPrioritaires([maths, anglais], new Set(['anglais']))
    expect(r.prioritaires).toEqual([anglais])
  })

  it('ignore une matière prioritaire absente de la liste', () => {
    const r = separerPrioritaires([maths], ['latin'])
    expect(r).toEqual({ prioritaires: [], autres: [maths] })
  })
})
