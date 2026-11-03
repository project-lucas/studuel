import { describe, expect, test } from 'vitest'
import { coeursDuDuel } from './coeurs'
import { chargeSuper, coeursAvant, coupDeLaCourse, coupDuDuel, coupDuGardien, coupRate, estSuper, type InstantCourse } from './coup'

describe('le super', () => {
  test('la jauge se remplit cran par cran et se vide au super', () => {
    expect([0, 1, 2, 3, 4].map(chargeSuper)).toEqual([0, 1, 2, 0, 1])
  })

  test('la 3e, la 6e bonne réponse d’affilée sont des supers', () => {
    expect([1, 2, 3, 4, 6].map(estSuper)).toEqual([false, false, true, false, true])
    expect(estSuper(0)).toBe(false)
  })
})

describe('le coup du duel classé', () => {
  test('une erreur ne frappe pas', () => {
    expect(coupDuDuel({ id: 1, camp: 'moi', points: 0, pvCible: 1000, golden: false, serieApres: 0, atMs: 0 })).toBeNull()
  })

  test('les dégâts sont plafonnés aux PV de la cible', () => {
    const c = coupDuDuel({ id: 1, camp: 'moi', points: 240, pvCible: 100, golden: true, serieApres: 1, atMs: 0 })
    expect(c?.degats).toBe(100)
    expect(c?.quartsPerdus).toBe(2)
    expect(c?.critique).toBe(true)
  })

  test('les quarts perdus suivent les cœurs de la course', () => {
    const c = coupDuDuel({ id: 1, camp: 'rival', points: 150, pvCible: 1000, golden: false, serieApres: 0, atMs: 0 })
    expect(c?.quartsPerdus).toBe(3)
    expect(c?.super).toBe(false)
  })

  test('seul mon coup peut être un super (la série du rival ne se voit pas)', () => {
    const moi = coupDuDuel({ id: 1, camp: 'moi', points: 120, pvCible: 1000, golden: false, serieApres: 3, atMs: 0 })
    const lui = coupDuDuel({ id: 2, camp: 'rival', points: 120, pvCible: 1000, golden: false, serieApres: 3, atMs: 0 })
    expect(moi?.super).toBe(true)
    expect(lui?.super).toBe(false)
  })
})

describe('le coup du combat de gardien', () => {
  test('ma bonne réponse lui retire un demi-cœur', () => {
    expect(coupDuGardien({ id: 1, bonne: true, serieApres: 1, atMs: 0 })).toMatchObject({ camp: 'moi', quartsPerdus: 2, degats: null })
  })

  test('mon erreur : il attaque, je perds un cœur', () => {
    expect(coupDuGardien({ id: 1, bonne: false, serieApres: 0, atMs: 0 })).toMatchObject({ camp: 'rival', quartsPerdus: 4, super: false })
  })
})

test('l’attaque ratée ne coûte rien à la cible', () => {
  const c = coupRate({ id: 4, camp: 'rival', atMs: 10 })
  expect(c).toMatchObject({ camp: 'rival', rate: true, quartsPerdus: 0, degats: null, super: false, critique: false })
  expect(coeursAvant(coeursDuDuel(600), c)).toEqual(coeursDuDuel(600))
})

test('un coup qui porte n’est jamais raté', () => {
  expect(coupDuDuel({ id: 1, camp: 'moi', points: 100, pvCible: 1000, golden: false, serieApres: 1, atMs: 0 })?.rate).toBe(false)
  expect(coupDuGardien({ id: 1, bonne: false, serieApres: 0, atMs: 0 }).rate).toBe(false)
})

test('la rangée d’avant le coup', () => {
  const coup = coupDuDuel({ id: 1, camp: 'moi', points: 150, pvCible: 1000, golden: false, serieApres: 1, atMs: 0 })
  expect(coup).not.toBeNull()
  expect(coeursAvant(coeursDuDuel(850), coup!)).toEqual(coeursDuDuel(1000))
})

describe('le coup de la vraie course', () => {
  const zero: InstantCourse = {
    moi: { score: 0, answered: 0, combo: 0 },
    rival: { total: 0, answered: 0, combo: 0 },
    golden: false,
  }

  test('rien ne bouge : pas de coup', () => {
    expect(coupDeLaCourse(zero, zero, 1, 0)).toBeNull()
  })

  test('ma bonne réponse : je frappe, ses cœurs perdent ce que j’ai marqué', () => {
    const apres = { ...zero, moi: { score: 100, answered: 1, combo: 1 } }
    const c = coupDeLaCourse(zero, apres, 7, 1200)
    expect(c).toMatchObject({ id: 7, camp: 'moi', degats: 100, quartsPerdus: 2, rate: false, atMs: 1200 })
  })

  test('ma réponse fausse : mon attaque part et il esquive', () => {
    const apres = { ...zero, moi: { score: 0, answered: 1, combo: 0 } }
    expect(coupDeLaCourse(zero, apres, 2, 0)).toMatchObject({ camp: 'moi', rate: true, quartsPerdus: 0 })
  })

  test('la question dorée frappe en critique, la 3e d’affilée en super', () => {
    const avant = { ...zero, moi: { score: 200, answered: 2, combo: 2 } }
    const apres = { ...zero, golden: true, moi: { score: 400, answered: 3, combo: 3 } }
    expect(coupDeLaCourse(avant, apres, 3, 0)).toMatchObject({ critique: true, super: true })
  })

  test('le rival frappe, ou rate et j’esquive', () => {
    const frappe = { ...zero, rival: { total: 150, answered: 1, combo: 1 } }
    expect(coupDeLaCourse(zero, frappe, 4, 0)).toMatchObject({ camp: 'rival', degats: 150, super: false })
    const rate = { ...zero, rival: { total: 0, answered: 1, combo: 0 } }
    expect(coupDeLaCourse(zero, rate, 5, 0)).toMatchObject({ camp: 'rival', rate: true })
  })

  test('les deux au même instant : c’est mon coup qui se joue', () => {
    const apres = { ...zero, moi: { score: 100, answered: 1, combo: 1 }, rival: { total: 100, answered: 1, combo: 1 } }
    expect(coupDeLaCourse(zero, apres, 6, 0)?.camp).toBe('moi')
  })

  test('les dégâts sont plafonnés à ce qui reste', () => {
    const avant = { ...zero, moi: { score: 950, answered: 9, combo: 0 } }
    const apres = { ...zero, moi: { score: 1100, answered: 10, combo: 1 } }
    expect(coupDeLaCourse(avant, apres, 8, 0)?.degats).toBe(50)
  })
})
