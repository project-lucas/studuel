import { describe, expect, it } from 'vitest'
import { ficheDuCatalogue, reponseFicheExistante } from './fiche-catalogue'
import type { IndexFiches } from '@/lib/reviser/recherche-globale'

const INDEX: IndexFiches = {
  matieres: [
    { slug: 'histoire-geo', nom: 'Histoire-Géographie' },
    { slug: 'maths', nom: 'Mathématiques' },
  ],
  fiches: [
    { id: 'c1', t: 'La Révolution française', m: 'histoire-geo' },
    { id: 'c2', t: 'La Première Guerre mondiale', m: 'histoire-geo' },
    { id: 'c3', t: 'La Seconde Guerre mondiale', m: 'histoire-geo' },
    { id: 'c4', t: 'Les fractions', m: 'maths' },
    { id: 'c5', t: 'Le théorème de Pythagore', m: 'maths' },
  ],
}

describe('la fiche existe déjà', () => {
  it('reconnaît un chapitre nommé clairement', () => {
    expect(ficheDuCatalogue('Fais-moi une fiche sur la révolution française', INDEX)?.chapitreId).toBe('c1')
    expect(ficheDuCatalogue('fiche pythagore', INDEX)?.href).toBe('/reviser/maths/c5/carte')
    expect(ficheDuCatalogue('une fiche sur la fraction', INDEX)?.chapitreId).toBe('c4')
  })

  it('ne devine pas quand plusieurs chapitres répondent', () => {
    expect(ficheDuCatalogue('fais une fiche sur la guerre mondiale', INDEX)).toBeNull()
  })

  it('laisse au modèle une demande vide ou inconnue', () => {
    expect(ficheDuCatalogue('fais-moi une fiche', INDEX)).toBeNull()
    expect(ficheDuCatalogue('fiche sur la photosynthèse', INDEX)).toBeNull()
  })

  it('le dit sans le modèle, et laisse insister', () => {
    const f = ficheDuCatalogue('fiche révolution française', INDEX)!
    expect(reponseFicheExistante(f)).toContain('« La Révolution française »')
    expect(reponseFicheExistante(f)).toMatch(/TON cours/)
  })
})
