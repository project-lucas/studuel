import { describe, expect, it } from 'vitest'
import { appareilDepuisLargeur, creerFile, normaliserPage, nouvelleSession, propsPropres } from './evenements'

describe('normaliserPage', () => {
  it('nomme les paramètres de Réviser', () => {
    expect(normaliserPage('/reviser/maths/3f2a1b4c-1111-2222-3333-444455556666/quiz?x=1')).toBe('/reviser/[matiere]/[chapitre]/quiz')
  })
  it('garde un segment fixe après un paramètre', () => {
    expect(normaliserPage('/reviser/histoire-geo/encyclopedie')).toBe('/reviser/[matiere]/encyclopedie')
  })
  it('remplace les identifiants et les nombres ailleurs', () => {
    expect(normaliserPage('/coach/eleves/3f2a1b4c-1111-2222-3333-444455556666')).toBe('/coach/eleves/[id]')
    expect(normaliserPage('/test/42')).toBe('/test/[n]')
  })
  it('ne touche pas une page simple', () => {
    expect(normaliserPage('/defi')).toBe('/defi')
    expect(normaliserPage('')).toBe('/')
  })
  it('un code de parrainage ne fuit pas', () => {
    expect(normaliserPage('/parrain/ABCD2345')).toBe('/parrain/[code]')
  })
})

describe('divers', () => {
  it('appareil d’après la largeur', () => {
    expect(appareilDepuisLargeur(390)).toBe('mobile')
    expect(appareilDepuisLargeur(800)).toBe('tablette')
    expect(appareilDepuisLargeur(1440)).toBe('ordinateur')
  })
  it('une session de 20 caractères sûrs', () => {
    const s = nouvelleSession()
    expect(s).toMatch(/^[A-Za-z0-9]{20}$/)
  })
  it('propsPropres borne et filtre', () => {
    expect(propsPropres({ texte: 'x'.repeat(100), ok: true, objet: { a: 1 }, 'Mauvaise-Cle': 1, n: 3 })).toEqual({ texte: 'x'.repeat(60), ok: true, n: 3 })
  })
})

describe('creerFile', () => {
  it('écarte un nom invalide, borne la file, rend des lots', () => {
    const f = creerFile(3)
    f.ajouter({ nom: 'MAUVAIS', t: 'x' })
    for (let i = 0; i < 5; i++) f.ajouter({ nom: 'page_vue', page: `/${i}`, t: 'x' })
    expect(f.taille()).toBe(3)
    expect(f.prendre(2).map((e) => e.page)).toEqual(['/2', '/3'])
    expect(f.taille()).toBe(1)
  })
})
