import { describe, expect, test } from 'vitest'
import { sigleEpreuve, titreEpreuve } from './epreuve'

describe('titreEpreuve — le nom de l’épreuve, sur l’écran et la couverture', () => {
  test('le bac, le bac de français, l’épreuve anticipée de maths, le brevet', () => {
    expect(titreEpreuve({ examen: 'bac', matiere: 'philosophie', annee: 2025 })).toBe('Bac 2025')
    expect(titreEpreuve({ examen: 'bac-anticipe', matiere: 'francais', annee: 2024 })).toBe(
      'Bac de français 2024',
    )
    // La maths anticipée n'est PAS le bac de français (c'était le titre affiché
    // jusqu'au 29/09/2026).
    expect(titreEpreuve({ examen: 'bac-anticipe', matiere: 'maths', annee: 2026 })).toBe(
      'Épreuve anticipée 2026',
    )
    expect(titreEpreuve({ examen: 'brevet', matiere: 'maths', annee: 2025 })).toBe('Brevet 2025')
  })
})

describe('sigleEpreuve — la vignette de la carte d’annale', () => {
  test('« Bac » pour le bac et les épreuves anticipées, « Brevet » pour le brevet', () => {
    expect(sigleEpreuve('bac')).toBe('Bac')
    expect(sigleEpreuve('bac-anticipe')).toBe('Bac')
    expect(sigleEpreuve('brevet')).toBe('Brevet')
  })
})
