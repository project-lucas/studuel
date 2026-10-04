import { describe, expect, it } from 'vitest'
import {
  PAS_ALLUMAGE_MS,
  enSerie,
  etatDuJour,
  geometrieMeche,
  mechesDeLaSemaine,
  phraseSemaine,
  retardAllumage,
  semaineParfaite,
  type JourSemaine,
} from './serie-semaine'

/** « xx.T--- » : x fait, . manqué, g gelé, T aujourd'hui pas fait, X aujourd'hui fait, - à venir. */
function semaine(motif: string): JourSemaine[] {
  return [...motif].map((c) => ({
    done: c === 'x' || c === 'X',
    isToday: c === 'T' || c === 'X',
    isFuture: c === '-',
    gele: c === 'g',
  }))
}

describe('l’état d’un jour', () => {
  it('distingue fait, aujourd’hui, manqué et à venir', () => {
    expect(semaine('x.T-').map(etatDuJour)).toEqual(['fait', 'manque', 'aujourdhui', 'avenir'])
    expect(etatDuJour({ done: true, isToday: true, isFuture: false })).toBe('fait')
  })
})

describe('les mèches', () => {
  it('relient les jours faits d’affilée, jamais un jour seul', () => {
    expect(mechesDeLaSemaine(semaine('xx.xxxT'))).toEqual([
      { debut: 0, fin: 1 },
      { debut: 3, fin: 5 },
    ])
    expect(mechesDeLaSemaine(semaine('x.x.x.X'))).toEqual([])
  })

  it('vont jusqu’au dernier jour quand la semaine finit en série', () => {
    expect(mechesDeLaSemaine(semaine('...xxxX'))).toEqual([{ debut: 3, fin: 6 }])
    expect(mechesDeLaSemaine(semaine('xxxxxxX'))).toEqual([{ debut: 0, fin: 6 }])
  })

  it('se placent d’un centre de jeton à l’autre', () => {
    const g = geometrieMeche({ debut: 0, fin: 6 })
    expect(g.gauche).toBeCloseTo(100 / 14)
    expect(g.largeur).toBeCloseTo((600 / 7))
  })
})

describe('les jours gelés', () => {
  it('se dessinent en glace', () => {
    expect(semaine('xgX').map(etatDuJour)).toEqual(['fait', 'gele', 'fait'])
  })

  it('ne cassent pas la mèche, qui commence et finit sur un jour fait', () => {
    expect(mechesDeLaSemaine(semaine('xxgxX--'))).toEqual([{ debut: 0, fin: 4 }])
    expect(mechesDeLaSemaine(semaine('gxg.xX-'))).toEqual([{ debut: 4, fin: 5 }])
    expect(mechesDeLaSemaine(semaine('xg.xX--'))).toEqual([{ debut: 3, fin: 4 }])
  })
})

describe('la semaine parfaite', () => {
  it('demande les sept jours', () => {
    expect(semaineParfaite(semaine('xxxxxxX'))).toBe(true)
    expect(semaineParfaite(semaine('xxxxxxT'))).toBe(false)
    expect(semaineParfaite(semaine('xxxxxX-'))).toBe(false)
  })
})

describe('en série', () => {
  it('quand le jour est fait et que la veille l’est aussi', () => {
    expect(enSerie(semaine('xX-----'), 1)).toBe(true)
    expect(enSerie(semaine('.X-----'), 1)).toBe(false)
    expect(enSerie(semaine('xT-----'), 5)).toBe(false)
  })

  it('le lundi, sur la foi de la série stockée', () => {
    expect(enSerie(semaine('X------'), 4)).toBe(true)
    expect(enSerie(semaine('X------'), 1)).toBe(false)
  })
})

describe('l’allumage', () => {
  it('suit l’ordre des jours, à partir du premier jour fait', () => {
    const s = semaine('.xx.xX-')
    expect([1, 2, 4, 5].map((i) => retardAllumage(s, i))).toEqual(
      [0, 1, 3, 4].map((n) => n * PAS_ALLUMAGE_MS),
    )
    expect(retardAllumage(s, 0)).toBe(0)
  })
})

describe('la phrase', () => {
  it('dit ce qui reste pour la semaine parfaite, tant qu’elle est possible', () => {
    expect(phraseSemaine(semaine('xxxX---'))).toBe('Encore 3 jours pour une semaine parfaite.')
    expect(phraseSemaine(semaine('xxxxxxT'))).toBe('Encore aujourd’hui et la semaine est parfaite.')
    expect(phraseSemaine(semaine('xxxxxxX'))).toBe('Semaine parfaite : sept jours sur sept !')
    expect(phraseSemaine(semaine('x.xX---'))).toBe('3 jours sur 7 cette semaine.')
  })
})
