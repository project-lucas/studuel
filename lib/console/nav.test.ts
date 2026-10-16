import { describe, expect, it } from 'vitest'
import { lienActif, sectionsConsole } from './nav'

describe('sectionsConsole', () => {
  it('un coach ne voit que le coaching', () => {
    const s = sectionsConsole({ coach: true, admin: false })
    expect(s.map((x) => x.titre)).toEqual(['Coaching'])
  })
  it('l’admin voit le coaching et l’administration', () => {
    const s = sectionsConsole({ coach: false, admin: true })
    expect(s.map((x) => x.titre)).toEqual(['Coaching', 'Administration'])
  })
  it('personne d’autre ne voit rien', () => {
    expect(sectionsConsole({ coach: false, admin: false })).toEqual([])
  })
  it('chaque lien est unique', () => {
    const hrefs = sectionsConsole({ coach: true, admin: true }).flatMap((s) => s.liens.map((l) => l.href))
    expect(new Set(hrefs).size).toBe(hrefs.length)
  })
})

describe('lienActif', () => {
  const s = sectionsConsole({ coach: true, admin: true })
  it('la fiche d’un élève allume le Tableau', () => {
    expect(lienActif('/coach/eleves/abc', s)).toBe('/coach')
  })
  it('le plus long préfixe gagne', () => {
    expect(lienActif('/coach/messages?fil=x', s)).toBe('/coach/messages')
    expect(lienActif('/admin/insights', s)).toBe('/admin/insights')
  })
  it('une page du studio allume le Studio', () => {
    expect(lienActif('/admin/matiere/123', s)).toBe('/admin')
  })
  it('une barre finale ne change rien', () => {
    expect(lienActif('/coach/groupes/', s)).toBe('/coach/groupes')
  })
  it('hors console : rien', () => {
    expect(lienActif('/reviser', s)).toBeNull()
  })
})
