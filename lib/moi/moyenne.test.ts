import { describe, it, expect } from 'vitest'
import { bilanMoyenne, formatMoyenne, phraseDelta } from './moyenne'
import type { TermPoint } from '@/lib/trajectoire-bac'

const vide: TermPoint[] = [
  { t: 1, avg: null, source: null },
  { t: 2, avg: null, source: null },
  { t: 3, avg: null, source: null },
]

describe('bilanMoyenne', () => {
  it('rend un bilan vide sans aucune moyenne', () => {
    const b = bilanMoyenne(vide)
    expect(b.moyenne).toBeNull()
    expect(b.trimestre).toBeNull()
    expect(b.delta).toBeNull()
  })

  it('retient le trimestre le plus récent, pas la moyenne de l’année', () => {
    const b = bilanMoyenne([
      { t: 1, avg: 11, source: 'notes' },
      { t: 2, avg: 14, source: 'notes' },
      { t: 3, avg: null, source: null },
    ])
    expect(b.moyenne).toBe(14)
    expect(b.trimestre).toBe(2)
    expect(b.delta).toBe(3)
    expect(b.precedent).toBe(1)
  })

  it('ne compare rien quand un seul trimestre est renseigné', () => {
    const b = bilanMoyenne([
      { t: 1, avg: 13, source: 'manuel' },
      { t: 2, avg: null, source: null },
      { t: 3, avg: null, source: null },
    ])
    expect(b.delta).toBeNull()
    expect(b.precedent).toBeNull()
    expect(b.source).toBe('manuel')
  })

  it('saute un trimestre creux pour comparer aux deux renseignés', () => {
    const b = bilanMoyenne([
      { t: 1, avg: 12, source: 'notes' },
      { t: 2, avg: null, source: null },
      { t: 3, avg: 12.4, source: 'notes' },
    ])
    expect(b.trimestre).toBe(3)
    expect(b.precedent).toBe(1)
    expect(b.delta).toBe(0.4)
  })

  it('arrondit l’écart au dixième (pas de 0,40000000000000036)', () => {
    const b = bilanMoyenne([
      { t: 1, avg: 13.4, source: 'notes' },
      { t: 2, avg: 13.8, source: 'notes' },
      { t: 3, avg: null, source: null },
    ])
    expect(b.delta).toBe(0.4)
  })

  it('annonce « stable » sous le dixième plutôt qu’une fausse précision', () => {
    const b = bilanMoyenne([
      { t: 1, avg: 13.4, source: 'notes' },
      { t: 2, avg: 13.42, source: 'notes' },
      { t: 3, avg: null, source: null },
    ])
    expect(b.delta).toBe(0)
  })
})

describe('formatMoyenne', () => {
  it('formate à la française', () => {
    expect(formatMoyenne(bilanMoyenne([{ t: 1, avg: 13.4, source: 'notes' }]))).toBe(
      '13,4',
    )
  })

  it('rend null sans moyenne', () => {
    expect(formatMoyenne(bilanMoyenne(vide))).toBeNull()
  })
})

describe('phraseDelta', () => {
  it('annonce une progression', () => {
    const b = bilanMoyenne([
      { t: 1, avg: 13, source: 'notes' },
      { t: 2, avg: 13.4, source: 'notes' },
      { t: 3, avg: null, source: null },
    ])
    expect(phraseDelta(b)).toBe('+0,4 vs T1')
  })

  it('annonce une baisse sans la maquiller', () => {
    const b = bilanMoyenne([
      { t: 1, avg: 14, source: 'notes' },
      { t: 2, avg: 13.5, source: 'notes' },
      { t: 3, avg: null, source: null },
    ])
    expect(phraseDelta(b)).toBe('-0,5 vs T1')
  })

  it('dit « stable » plutôt que « +0 »', () => {
    const b = bilanMoyenne([
      { t: 1, avg: 13, source: 'notes' },
      { t: 2, avg: 13, source: 'notes' },
      { t: 3, avg: null, source: null },
    ])
    expect(phraseDelta(b)).toBe('stable vs T1')
  })

  it('se tait quand il n’y a rien à comparer', () => {
    expect(phraseDelta(bilanMoyenne(vide))).toBeNull()
  })
})
