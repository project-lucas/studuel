import { describe, it, expect } from 'vitest'
import {
  PLACEMENT_SIZE,
  ensurePlacement,
  fallbackPlacement,
  type PlacementQuestion,
} from '@/lib/placement'

function q(id: string, question: string): PlacementQuestion {
  return { id, question, options: ['a', 'b'], correctIndex: 0 }
}

describe('fallbackPlacement', () => {
  it('sert le collège par défaut et le lycée pour 2de/1re/Tle', () => {
    expect(fallbackPlacement('4e')[0].id).toContain('col')
    expect(fallbackPlacement('1re')[0].id).toContain('lyc')
    expect(fallbackPlacement(null)[0].id).toContain('col')
  })
})

describe('ensurePlacement', () => {
  it('complète jusqu’à 5 questions avec la banque de repli', () => {
    const out = ensurePlacement([q('1', 'Une question maison')], '4e')
    expect(out).toHaveLength(PLACEMENT_SIZE)
    expect(out[0].question).toBe('Une question maison')
  })

  it('ne dépasse jamais la taille demandée', () => {
    const many = Array.from({ length: 9 }, (_, i) => q(`m${i}`, `Q${i}`))
    expect(ensurePlacement(many, '4e')).toHaveLength(PLACEMENT_SIZE)
  })

  it('évite les doublons de libellé (repli déjà présent en base)', () => {
    const dup = q('db', 'Combien font 15 % de 80 ?')
    const out = ensurePlacement([dup], '4e')
    const count = out.filter(
      (x) => x.question === 'Combien font 15 % de 80 ?',
    ).length
    expect(count).toBe(1)
    expect(out).toHaveLength(PLACEMENT_SIZE)
  })
})
