import { describe, expect, it } from 'vitest'
import { RESULTATS_MAX, chercherFiches, construireIndex, type IndexFiches } from './recherche-globale'

const INDEX: IndexFiches = {
  matieres: [
    { slug: 'maths', nom: 'Maths' },
    { slug: 'histoire-geo', nom: 'Histoire-Géo' },
    { slug: 'anglais', nom: 'Anglais' },
  ],
  fiches: [
    { id: 'a1', t: 'Le théorème de Thalès', m: 'maths', th: 'Espace et géométrie' },
    { id: 'a2', t: 'Les fractions', m: 'maths', th: 'Nombres et calculs' },
    { id: 'b1', t: 'La Révolution française', m: 'histoire-geo', th: 'Le XVIIIe siècle' },
    { id: 'c1', t: 'Le present perfect', m: 'anglais' },
    { id: 'z1', t: 'Orpheline', m: 'inconnue' },
  ],
}

describe('chercherFiches', () => {
  it('une recherche vide ne rend rien', () => {
    expect(chercherFiches(INDEX, '')).toEqual([])
    expect(chercherFiches(INDEX, '   ')).toEqual([])
  })

  it('répond comme un élève tape : sans accent, sans casse, mots dans le désordre', () => {
    expect(chercherFiches(INDEX, 'thales').map((r) => r.fiche.id)).toEqual(['a1'])
    expect(chercherFiches(INDEX, 'REVOLUTION francaise').map((r) => r.fiche.id)).toEqual(['b1'])
    expect(chercherFiches(INDEX, 'francaise revolution').map((r) => r.fiche.id)).toEqual(['b1'])
  })

  it('cherche aussi dans le thème et le nom de la matière', () => {
    expect(chercherFiches(INDEX, 'géométrie').map((r) => r.fiche.id)).toEqual(['a1'])
    expect(chercherFiches(INDEX, 'anglais').map((r) => r.fiche.id)).toEqual(['c1'])
    expect(chercherFiches(INDEX, 'maths').map((r) => r.fiche.id)).toEqual(['a1', 'a2'])
  })

  it('tous les mots doivent être présents', () => {
    expect(chercherFiches(INDEX, 'fractions thales')).toEqual([])
  })

  it('donne le lien de la fiche et sa matière', () => {
    const [r] = chercherFiches(INDEX, 'perfect')
    expect(r.href).toBe('/reviser/anglais/c1')
    expect(r.matiere.nom).toBe('Anglais')
  })

  it('ignore une fiche dont la matière est inconnue', () => {
    expect(chercherFiches(INDEX, 'orpheline')).toEqual([])
  })

  it('borne le nombre de résultats', () => {
    const gros: IndexFiches = {
      matieres: [{ slug: 'm', nom: 'M' }],
      fiches: Array.from({ length: 100 }, (_, i) => ({ id: `f${i}`, t: `Fiche ${i}`, m: 'm' })),
    }
    expect(chercherFiches(gros, 'fiche')).toHaveLength(RESULTATS_MAX)
    expect(chercherFiches(gros, 'fiche', 5)).toHaveLength(5)
  })
})

describe('construireIndex', () => {
  it('relie les chapitres à leur matière par id et ne garde que les matières qui ont des fiches', () => {
    const index = construireIndex(
      [
        { id: 'S1', slug: 'maths', name: 'Maths' },
        { id: 'S2', slug: 'latin', name: 'Latin' },
      ],
      [
        { id: 'c1', subject_id: 'S1', title: 'Thalès', theme: 'Géométrie' },
        { id: 'c2', subject_id: 'S1', title: 'Fractions', theme: null },
        { id: 'c3', subject_id: 'S9', title: 'Perdue' },
      ],
    )
    expect(index.matieres).toEqual([{ slug: 'maths', nom: 'Maths' }])
    expect(index.fiches).toEqual([
      { id: 'c1', t: 'Thalès', m: 'maths', th: 'Géométrie' },
      { id: 'c2', t: 'Fractions', m: 'maths' },
    ])
  })
})
