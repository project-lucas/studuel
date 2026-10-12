import { describe, expect, it } from 'vitest'
import type { AmiClasse } from '@/lib/moi/classement-amis'
import { courseDeLaSemaine, courseEpreuve, libelleEpreuve, niveauxGagnes, valeurEpreuve } from '@/lib/moi/course-amis'

function joueur(p: Partial<AmiClasse> & { id: string }): AmiClasse {
  return {
    nom: p.id,
    portrait: '',
    moi: false,
    trophees: 0,
    tropheesSemaine: 0,
    secondes: 0,
    secondesSemaine: 0,
    xp: 0,
    xpSemaine: 0,
    ...p,
  }
}

const moi = joueur({ id: 'moi', nom: 'Lucas', moi: true, xp: 1200, xpSemaine: 150, tropheesSemaine: 8 })
const lea = joueur({ id: 'lea', nom: 'Léa', xp: 3000, xpSemaine: 400, tropheesSemaine: 20 })
const rayan = joueur({ id: 'rayan', nom: 'Rayan', xp: 500, xpSemaine: 0, tropheesSemaine: -4 })

describe('niveauxGagnes', () => {
  it('compte les niveaux franchis depuis lundi', () => {
    // 100 XP = niveau 2, 300 XP = niveau 3.
    expect(niveauxGagnes(300, 250)).toBe(2)
    expect(niveauxGagnes(300, 0)).toBe(0)
  })
  it('ne descend jamais sous zéro', () => {
    expect(niveauxGagnes(50, 500)).toBe(0)
  })
})

describe('valeurEpreuve', () => {
  it('rend null pour l’XP tant que la 558 manque', () => {
    const sans = joueur({ id: 'x', xp: null, xpSemaine: null })
    expect(valeurEpreuve(sans, 'xp')).toBeNull()
    expect(valeurEpreuve(sans, 'niveaux')).toBeNull()
    expect(valeurEpreuve(sans, 'trophees')).toBe(0)
  })
})

describe('courseEpreuve', () => {
  it('dit qui mène et qui est juste devant moi', () => {
    const c = courseEpreuve([moi, lea, rayan], 'xp')!
    expect(c.lignes.map((l) => l.id)).toEqual(['lea', 'moi', 'rayan'])
    expect(c.tete?.id).toBe('lea')
    expect(c.moi?.rang).toBe(2)
    expect(c.devant).toEqual({ joueur: expect.objectContaining({ id: 'lea' }), manque: 251 })
    expect(c.phrase).toBe('Encore 251 XP pour passer Léa.')
  })

  it('à égalité, l’ami reste devant : il faut un point de plus', () => {
    const egal = joueur({ id: 'zoe', nom: 'Zoé', xp: 1000, xpSemaine: 150 })
    const c = courseEpreuve([moi, egal], 'xp')!
    expect(c.lignes[0].id).toBe('zoe')
    expect(c.devant?.manque).toBe(1)
  })

  it('quand je mène, le dit', () => {
    const c = courseEpreuve([moi, rayan], 'trophees')!
    expect(c.moi?.rang).toBe(1)
    expect(c.phrase).toBe('Tu mènes. Garde ta place jusqu’à dimanche.')
  })

  it('personne n’a marqué : pas de tête', () => {
    const a = joueur({ id: 'a', moi: true })
    const b = joueur({ id: 'b' })
    const c = courseEpreuve([a, b], 'xp')!
    expect(c.tete).toBeNull()
    expect(c.phrase).toContain('prends la tête')
  })

  it('seul : pas de course', () => {
    expect(courseEpreuve([moi], 'xp')).toBeNull()
  })
})

describe('courseDeLaSemaine', () => {
  it('rend les trois épreuves avec la 558, seulement les trophées sans elle', () => {
    expect(courseDeLaSemaine([moi, lea]).map((c) => c.epreuve)).toEqual(['xp', 'trophees', 'niveaux'])
    const sans = [moi, lea].map((j) => ({ ...j, xp: null, xpSemaine: null }))
    expect(courseDeLaSemaine(sans).map((c) => c.epreuve)).toEqual(['trophees'])
  })
})

describe('libelleEpreuve', () => {
  it('écrit chaque épreuve dans son unité', () => {
    expect(libelleEpreuve('xp', 1250)).toBe('1 250 XP')
    expect(libelleEpreuve('trophees', -4)).toBe('−4')
    expect(libelleEpreuve('trophees', 12)).toBe('+12')
    expect(libelleEpreuve('niveaux', 2)).toBe('+2 niv.')
  })
})
