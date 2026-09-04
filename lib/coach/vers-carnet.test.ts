import { describe, it, expect } from 'vitest'
import {
  MAX_RECTO_LEN,
  MAX_VERSO_LEN,
  carteDepuis,
  veutCarnet,
} from '@/lib/coach/vers-carnet'

describe('veutCarnet', () => {
  it('reconnaît la phrase de l’élève, quelle que soit sa forme', () => {
    for (const phrase of [
      'envoie ça dans mon carnet',
      'Envoie ÇA dans mon carnet !',
      'mets ça dans mon carnet stp',
      'tu peux l’ajouter à mon carnet ?',
      'range ça dans le carnet',
      'note ça dans mon carnet',
      'garde ça dans mon carnet',
      'enregistre dans mon carnet',
    ]) {
      expect(veutCarnet(phrase), phrase).toBe(true)
    }
  })

  it('laisse passer les vraies questions qui parlent de carnet', () => {
    // Sans cette exigence, « c'est quoi un carnet de bord ? » écrirait une
    // carte au lieu de recevoir une réponse.
    for (const phrase of [
      'c’est quoi un carnet de bord ?',
      'à quoi sert mon carnet ?',
      'explique-moi le carnet de Lucas',
      'comment on révise ?',
    ]) {
      expect(veutCarnet(phrase), phrase).toBe(false)
    }
  })

  it('respecte la négation', () => {
    // Écrire dans les données de l'élève CONTRE son ordre serait la pire des
    // erreurs de ce module : la négation l'emporte.
    expect(veutCarnet('n’envoie pas ça dans mon carnet')).toBe(false)
    expect(veutCarnet('ne mets pas ça dans mon carnet')).toBe(false)
  })

  it('refuse ce qui n’est pas une chaîne', () => {
    expect(veutCarnet(null)).toBe(false)
    expect(veutCarnet(undefined)).toBe(false)
    expect(veutCarnet(12)).toBe(false)
  })
})

describe('carteDepuis', () => {
  it('fait le recto avec la question et le verso avec la réponse', () => {
    expect(carteDepuis('  Le théorème  de Thalès ? ', ' Repère les parallèles. ')).toEqual({
      recto: 'Le théorème de Thalès ?',
      verso: 'Repère les parallèles.',
    })
  })

  it('borne les deux faces', () => {
    const carte = carteDepuis('q'.repeat(900), 'r'.repeat(5_000))
    expect(carte?.recto.length).toBe(MAX_RECTO_LEN)
    expect(carte?.verso.length).toBe(MAX_VERSO_LEN)
  })

  it('null plutôt qu’une carte vide', () => {
    expect(carteDepuis('   ', 'une réponse')).toBeNull()
    expect(carteDepuis('une question', '  ')).toBeNull()
  })
})
