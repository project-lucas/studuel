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

describe('fallbackPlacement — une banque par cycle', () => {
  it('sert au primaire des questions de primaire, pas de collège', () => {
    // Le défaut réel : un CP recevait « 15 % de 80 » et la prise de la Bastille.
    for (const g of ['CP', 'CE1', 'CE2', 'CM1', 'CM2']) {
      const ids = fallbackPlacement(g).map((q) => q.id)
      expect(ids.every((id) => id.startsWith('fb-pri-')), g).toBe(true)
    }
  })

  it('sert au collège ses questions, à la 3e comme à la 6e', () => {
    for (const g of ['6e', '5e', '4e', '3e']) {
      expect(fallbackPlacement(g).every((q) => q.id.startsWith('fb-col-')), g).toBe(
        true,
      )
    }
  })

  it('sert au lycée ses questions, voie technologique comprise', () => {
    for (const g of ['2de', '1re', '1re techno', 'Tle', 'Tle techno']) {
      expect(fallbackPlacement(g).every((q) => q.id.startsWith('fb-lyc-')), g).toBe(
        true,
      )
    }
  })

  it('retombe sur le collège sans classe connue', () => {
    expect(fallbackPlacement(null)[0].id).toContain('fb-col-')
  })

  it('donne toujours de quoi remplir le test', () => {
    for (const g of ['CP', '3e', 'Tle techno', null]) {
      expect(fallbackPlacement(g).length, String(g)).toBeGreaterThanOrEqual(
        PLACEMENT_SIZE,
      )
    }
  })
})
