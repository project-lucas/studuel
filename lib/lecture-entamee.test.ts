import { describe, expect, test } from 'vitest'
import {
  LECTURE_DUREE_MS,
  LECTURES_MAX,
  avecLecture,
  defilementDeReprise,
  estEntamee,
  lectureARappeler,
  lectureDe,
  parserLecture,
  parserStockLectures,
  partAtteinte,
  pourcentLu,
  sansLecture,
  type LectureEntamee,
} from './lecture-entamee'

const MAINTENANT = Date.parse('2026-10-28T12:00:00.000Z')

const lecture = (over: Partial<LectureEntamee> = {}): LectureEntamee => ({
  lessonId: 'l1',
  titre: 'Les noms',
  matiere: 'Anglais',
  subjectSlug: 'anglais',
  href: '/reviser/anglais/c1/l1/cours',
  part: 0.6,
  at: new Date(MAINTENANT - 60_000).toISOString(),
  ...over,
})

describe('parserLecture', () => {
  test('une lecture bien formée passe', () => {
    expect(parserLecture(JSON.parse(JSON.stringify(lecture())))).toEqual(lecture())
  })

  test('une adresse qui n’est pas un cours de l’app est refusée', () => {
    expect(parserLecture(lecture({ href: 'https://ailleurs.example/cours' }))).toBeNull()
    expect(parserLecture(lecture({ href: '/reviser/anglais' }))).toBeNull()
  })

  test('la part est ramenée entre 0 et 1', () => {
    expect(parserLecture({ ...lecture(), part: 3 })?.part).toBe(1)
    expect(parserLecture({ ...lecture(), part: 'beaucoup' })).toBeNull()
  })

  test('un stock illisible est vide', () => {
    expect(parserStockLectures('pas du json')).toEqual({})
    expect(parserStockLectures(null)).toEqual({})
  })
})

describe('le stock', () => {
  test('la part ne recule jamais, l’horodatage avance', () => {
    const avant = avecLecture({}, lecture({ part: 0.7 }))
    const apres = avecLecture(avant, lecture({ part: 0.3, at: new Date(MAINTENANT).toISOString() }))
    expect(apres.l1.part).toBe(0.7)
    expect(apres.l1.at).toBe(new Date(MAINTENANT).toISOString())
  })

  test('retirer une lecture, sans toucher à l’original', () => {
    const stock = avecLecture({}, lecture())
    expect(sansLecture(stock, 'l1')).toEqual({})
    expect(stock.l1).toBeDefined()
    expect(sansLecture(stock, 'l2')).toBe(stock)
  })

  test('au-delà du maximum, les plus anciennes sont oubliées', () => {
    let stock = {}
    for (let i = 0; i < LECTURES_MAX + 2; i++) {
      stock = avecLecture(stock, lecture({ lessonId: `l${i}`, at: new Date(MAINTENANT - (100 - i) * 1000).toISOString() }))
    }
    expect(Object.keys(stock)).toHaveLength(LECTURES_MAX)
    expect(Object.keys(stock)).not.toContain('l0')
  })
})

describe('un cours entamé', () => {
  test('ni à peine ouvert, ni lu jusqu’au bout, ni trop vieux', () => {
    expect(estEntamee(lecture(), MAINTENANT)).toBe(true)
    expect(estEntamee(lecture({ part: 0.05 }), MAINTENANT)).toBe(false)
    expect(estEntamee(lecture({ part: 0.97 }), MAINTENANT)).toBe(false)
    expect(estEntamee(lecture({ at: new Date(MAINTENANT - LECTURE_DUREE_MS - 1).toISOString() }), MAINTENANT)).toBe(false)
  })

  test('la lecture d’une leçon, et la plus récente à rappeler', () => {
    const stock = avecLecture(
      avecLecture({}, lecture()),
      lecture({ lessonId: 'l2', href: '/reviser/anglais/c1/l2/cours', at: new Date(MAINTENANT - 1000).toISOString() }),
    )
    expect(lectureDe(stock, 'l1', MAINTENANT)?.lessonId).toBe('l1')
    expect(lectureDe(stock, 'inconnue', MAINTENANT)).toBeNull()
    expect(lectureDe(stock, null, MAINTENANT)).toBeNull()
    expect(lectureARappeler(stock, MAINTENANT)?.lessonId).toBe('l2')
  })

  test('« lu à 60 % » s’arrondit à la dizaine', () => {
    expect(pourcentLu(0.57)).toBe(60)
    expect(pourcentLu(0.04)).toBe(0)
  })
})

describe('la position dans la page', () => {
  test('la part atteinte par le bas de l’écran', () => {
    expect(partAtteinte({ defilement: 0, hauteurEcran: 800, debut: 200, hauteur: 2000 })).toBeCloseTo(0.3)
    expect(partAtteinte({ defilement: 5000, hauteurEcran: 800, debut: 200, hauteur: 2000 })).toBe(1)
    expect(partAtteinte({ defilement: 0, hauteurEcran: 100, debut: 400, hauteur: 2000 })).toBe(0)
    expect(partAtteinte({ defilement: 0, hauteurEcran: 800, debut: 0, hauteur: 0 })).toBe(0)
  })

  test('reprendre remet la dernière ligne lue en bas de l’écran, avec une marge', () => {
    expect(defilementDeReprise({ part: 0.5, hauteurEcran: 800, debut: 200, hauteur: 2000 })).toBe(520)
    expect(defilementDeReprise({ part: 0.1, hauteurEcran: 800, debut: 0, hauteur: 2000 })).toBe(0)
  })
})
