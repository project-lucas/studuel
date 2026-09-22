import { describe, expect, it } from 'vitest'
import { derniereActiviteLabel, sousTitreParents } from './parents-entete'

const TODAY = '2026-09-24'

describe('derniereActiviteLabel', () => {
  it('parle en mots relatifs', () => {
    expect(derniereActiviteLabel('2026-09-24', TODAY)).toBe('aujourd’hui')
    expect(derniereActiviteLabel('2026-09-23', TODAY)).toBe('hier')
    expect(derniereActiviteLabel('2026-09-20', TODAY)).toBe('il y a 4 jours')
    expect(derniereActiviteLabel('2026-09-15', TODAY)).toBe('il y a une semaine')
    expect(derniereActiviteLabel('2026-09-03', TODAY)).toBe('il y a 3 semaines')
  })

  it('se tait sans date, ou sur une date illisible', () => {
    expect(derniereActiviteLabel(null, TODAY)).toBeNull()
    expect(derniereActiviteLabel('hier', TODAY)).toBeNull()
  })
})

describe('sousTitreParents', () => {
  it('décrit la promesse quand aucun enfant n’est lié', () => {
    expect(sousTitreParents([], TODAY)).toContain('votre enfant')
  })

  it('nomme un enfant unique et sa dernière activité', () => {
    expect(sousTitreParents([{ nom: 'Léa', lastActivity: '2026-09-23' }], TODAY)).toBe(
      'Vous suivez Léa ici · dernière activité hier.',
    )
    expect(sousTitreParents([{ nom: 'Tom', lastActivity: null }], TODAY)).toBe(
      'Vous suivez Tom ici · aucune activité pour l’instant.',
    )
  })

  it('compte les enfants et prend l’activité la plus récente', () => {
    expect(
      sousTitreParents(
        [
          { nom: 'Léa', lastActivity: '2026-09-10' },
          { nom: 'Tom', lastActivity: '2026-09-24' },
        ],
        TODAY,
      ),
    ).toBe('Vous suivez 2 enfants ici · dernière activité aujourd’hui.')
  })
})
