import { describe, expect, it } from 'vitest'
import { compterParStatut, statutSuivant, trierDemandes } from './demandes'

describe('les demandes de bilan Scolaria', () => {
  it('une demande avance : à rappeler → contactée → close, puis plus rien', () => {
    expect(statutSuivant('nouvelle')).toBe('contactee')
    expect(statutSuivant('contactee')).toBe('close')
    expect(statutSuivant('close')).toBeNull()
  })

  it('compte les demandes par statut', () => {
    expect(compterParStatut([{ statut: 'nouvelle' }, { statut: 'nouvelle' }, { statut: 'close' }])).toEqual({ nouvelle: 2, contactee: 0, close: 1 })
  })

  it('les nouvelles d’abord, la plus ancienne en tête ; puis le reste, la plus récente en tête', () => {
    const tri = trierDemandes([
      { statut: 'close', cree_le: '2026-10-10T10:00:00Z' },
      { statut: 'nouvelle', cree_le: '2026-10-15T10:00:00Z' },
      { statut: 'contactee', cree_le: '2026-10-14T10:00:00Z' },
      { statut: 'nouvelle', cree_le: '2026-10-12T10:00:00Z' },
    ])
    expect(tri.map((d) => `${d.statut}@${d.cree_le.slice(8, 10)}`)).toEqual(['nouvelle@12', 'nouvelle@15', 'contactee@14', 'close@10'])
  })
})
