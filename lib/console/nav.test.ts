import { describe, expect, it } from 'vitest'
import { espaceActif, espacesConsole, lienActif, sectionsConsole } from './nav'

describe('espacesConsole', () => {
  it('un coach ne voit que Scolaria, avec son message aux élèves', () => {
    const e = espacesConsole({ coach: true, admin: false })
    expect(e.map((x) => x.id)).toEqual(['scolaria'])
    const liens = e[0].sections.flatMap((s) => s.liens.map((l) => l.href))
    expect(liens).toContain('/coach/diffusion')
    expect(liens).not.toContain('/admin/coachs')
    expect(liens).not.toContain('/admin/demandes')
  })
  it('l’admin voit Scolaria (coachs, supervision) puis Studuel', () => {
    const e = espacesConsole({ coach: false, admin: true })
    expect(e.map((x) => x.id)).toEqual(['scolaria', 'studuel'])
    const scolaria = e[0].sections.flatMap((s) => s.liens.map((l) => l.href))
    expect(scolaria).toContain('/admin/coachs')
    expect(scolaria).toContain('/admin/supervision')
    expect(scolaria).toContain('/admin/demandes')
    // La diffusion de l'admin vit dans Studuel › Communication, une seule fois.
    expect(scolaria).not.toContain('/coach/diffusion')
    expect(e[1].sections.map((s) => s.titre)).toEqual(['Pilotage', 'Contenu', 'Communication', 'Business', 'Technique'])
  })
  it('personne d’autre ne voit rien', () => {
    expect(espacesConsole({ coach: false, admin: false })).toEqual([])
  })
  it('chaque lien est unique dans la console de l’admin', () => {
    const hrefs = sectionsConsole({ coach: true, admin: true }).flatMap((s) => s.liens.map((l) => l.href))
    expect(new Set(hrefs).size).toBe(hrefs.length)
  })
})

describe('lienActif et espaceActif', () => {
  const espaces = espacesConsole({ coach: true, admin: true })
  const s = sectionsConsole({ coach: true, admin: true })
  it('la fiche d’un élève allume Élèves, dans Scolaria', () => {
    expect(lienActif('/coach/eleves/abc', s)).toBe('/coach')
    expect(espaceActif('/coach/eleves/abc', espaces)?.id).toBe('scolaria')
  })
  it('les coachs sont dans Scolaria même sous /admin', () => {
    expect(espaceActif('/admin/coachs', espaces)?.id).toBe('scolaria')
  })
  it('une page du studio allume le Studio, dans Studuel', () => {
    expect(lienActif('/admin/matiere/123', s)).toBe('/admin')
    expect(espaceActif('/admin/matiere/123', espaces)?.id).toBe('studuel')
  })
  it('la diffusion de l’admin est dans Studuel', () => {
    expect(espaceActif('/coach/diffusion?type=sondage', espaces)?.id).toBe('studuel')
  })
  it('une barre finale ne change rien ; hors console : rien', () => {
    expect(lienActif('/coach/groupes/', s)).toBe('/coach/groupes')
    expect(lienActif('/reviser', s)).toBeNull()
  })
})
