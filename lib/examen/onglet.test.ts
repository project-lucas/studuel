import { describe, expect, it } from 'vitest'
import { examenDe, phaseDe } from './parcours'
import {
  COMPTEURS_VIDES,
  conseilDuSoir,
  epreuvesDeLEleve,
  estJourJProche,
  gesteFait,
  gestesDeLaSemaine,
  pourcent,
  preparationEcrit,
  preparationGlobale,
  sacDeLExamen,
  vueEpreuve,
} from './onglet'

const ctx = { pointsFaibles: 2, aCommencer: 5, matierePrincipale: null }

describe('l’onglet Examen', () => {
  it('coche tout seul un geste quand le compteur atteint sa cible', () => {
    const g = gestesDeLaSemaine(examenDe('3e')!, phaseDe(200), ctx, { ...COMPTEURS_VIDES, lecons: 4, quiz: 1 })
    expect(g).toHaveLength(3)
    expect(g[0].mesure).toEqual({ fait: 3, cible: 3 })
    expect(gesteFait(g[0])).toBe(true)
    expect(gesteFait(g[1])).toBe(false)
    expect(g[2].mesure?.fait).toBe(0)
  })

  it('ne coche jamais à la place de l’élève ce qui ne se mesure pas', () => {
    const g = gestesDeLaSemaine(examenDe('Tle')!, phaseDe(3), ctx, { lecons: 9, quiz: 9, annalesOuvertes: 9, annalesTraitees: 9, blancs: 9 })
    expect(g.every((x) => x.mesure === null && !gesteFait(x))).toBe(true)
  })

  it('remplace « les deux spécialités » par celles de l’élève', () => {
    const e = epreuvesDeLEleve(examenDe('Tle')!, [
      { slug: 'ses', nom: 'SES' },
      { slug: 'hggsp', nom: 'HGGSP' },
    ])
    expect(e.map((x) => x.titre)).toEqual(['Philosophie', 'SES', 'HGGSP', 'Le Grand oral'])
    expect(epreuvesDeLEleve(examenDe('Tle')!, []).some((x) => x.id === 'bac-specialites')).toBe(true)
  })

  it('pèse la préparation d’une épreuve écrite', () => {
    expect(preparationEcrit({ maitrise: 1, annalesFaites: 2, annalesTotal: 6, blancs: 1 })).toBeCloseTo(1)
    expect(preparationEcrit({ maitrise: 0.5, annalesFaites: 0, annalesTotal: 6, blancs: 0 })).toBeCloseTo(0.35)
    // Sans annales en ligne, on ne pénalise pas.
    expect(preparationEcrit({ maitrise: 1, annalesFaites: 0, annalesTotal: 0, blancs: 1 })).toBeCloseTo(1)
  })

  it('donne à l’oral l’avancée de son dossier', () => {
    const oral = examenDe('3e')!.epreuves.find((e) => e.nature === 'oral')!
    const v = vueEpreuve(oral, { chapitres: { maitrises: 0, total: 0, maitrise: 0 }, annales: { faites: 0, total: 0 }, blancs: 0 }, 0.5)
    expect(v.preparation).toBe(0.5)
    expect(v.chapitres).toBeNull()
    expect(v.temps.reduce((s, t) => s + t.minutes, 0)).toBe(15)
  })

  it('arrondit la préparation contre l’élève', () => {
    expect(pourcent(0.319)).toBe(31)
    const ch = { maitrises: 1, total: 4 }
    expect(pourcent(preparationGlobale([{ preparation: 0.2, nature: 'ecrit', chapitres: ch }, { preparation: 0.5, nature: 'oral', chapitres: null }]))).toBe(35)
    // Une épreuve écrite sans chapitre ne tire pas la moyenne vers le bas.
    expect(pourcent(preparationGlobale([{ preparation: 0.6, nature: 'ecrit', chapitres: ch }, { preparation: 0, nature: 'ecrit', chapitres: null }]))).toBe(60)
    expect(preparationGlobale([])).toBe(0)
  })

  it('bascule sur le jour J à une semaine', () => {
    expect(estJourJProche(8)).toBe(false)
    expect(estJourJProche(7)).toBe(true)
    expect(estJourJProche(-1)).toBe(false)
    expect(sacDeLExamen('brevet').some((o) => o.id === 'convocation')).toBe(true)
    expect(conseilDuSoir(0)).toMatch(/aujourd’hui/)
  })
})
