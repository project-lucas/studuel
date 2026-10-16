import { describe, expect, it } from 'vitest'
import {
  EXAMENS,
  compteARebours,
  examenDe,
  hrefRessource,
  joursAvantExamen,
  objectifsDeLaSemaine,
  phaseDe,
} from './parcours'

describe('le mode examen', () => {
  it('trouve l’examen de chaque classe à examen, et seulement d’elles', () => {
    expect(examenDe('3e')?.id).toBe('brevet')
    expect(examenDe('1re')?.id).toBe('bac-francais')
    expect(examenDe('1re techno')?.id).toBe('bac-francais')
    expect(examenDe('Tle')?.id).toBe('bac')
    expect(examenDe('Tle techno')?.id).toBe('bac')
    expect(examenDe('4e')).toBeNull()
    expect(examenDe('2de')).toBeNull()
    expect(examenDe(null)).toBeNull()
  })

  it('prépare l’écrit ET l’oral', () => {
    for (const e of EXAMENS) {
      expect(e.epreuves.some((x) => x.nature === 'ecrit')).toBe(true)
      expect(e.epreuves.some((x) => x.nature === 'oral')).toBe(true)
    }
  })

  it('suit le Grand oral de la session 2027', () => {
    const go = examenDe('Tle')?.epreuves.find((e) => e.id === 'grand-oral')
    expect(go?.coefficient).toBe('8 (voie technologique : 12)')
    expect(go?.format.join(' ')).toMatch(/dix minutes/)
  })

  it('compte les jours et nomme la phase', () => {
    const brevet = examenDe('3e')!
    expect(joursAvantExamen(brevet, '2027-06-14')).toBe(10)
    expect(phaseDe(200).id).toBe('fondations')
    expect(phaseDe(120).id).toBe('entrainement')
    expect(phaseDe(45).id).toBe('sprint')
    expect(phaseDe(7).id).toBe('derniers-jours')
    expect(phaseDe(0).id).toBe('derniers-jours')
    expect(phaseDe(-1).id).toBe('apres')
    expect(compteARebours(34)).toBe('J-34')
    expect(compteARebours(0)).toBe('Jour J')
  })

  it('donne toujours trois objectifs avec un lien', () => {
    for (const e of EXAMENS) {
      for (const j of [200, 100, 30, 3, -5]) {
        const o = objectifsDeLaSemaine(e, phaseDe(j), { pointsFaibles: 2, aCommencer: 5, matierePrincipale: null })
        expect(o).toHaveLength(3)
        for (const x of o) expect(x.href.startsWith('/')).toBe(true)
      }
    }
  })

  it('parle des points faibles quand il y en a', () => {
    const o = objectifsDeLaSemaine(examenDe('3e')!, phaseDe(200), { pointsFaibles: 1, aCommencer: 0, matierePrincipale: 'maths' })
    expect(o[1].texte).toBe('Reprendre 1 point faible')
    expect(o[0].href).toBe('/reviser/maths')
  })

  it('relie chaque ressource à un écran qui existe', () => {
    expect(hrefRessource({ type: 'annales', matiere: 'svt' })).toBe('/reviser/svt?onglet=annales')
    expect(hrefRessource({ type: 'oral-francais' })).toBe('/marcel?vue=oral')
  })
})
