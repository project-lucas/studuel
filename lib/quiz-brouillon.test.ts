import { describe, expect, test } from 'vitest'
import {
  BROUILLON_DUREE_MS,
  BROUILLONS_MAX,
  CHRONO_REPRISE_MIN,
  avecBrouillon,
  avecClose,
  copieEncoreValable,
  parserCloses,
  brouillonARappeler,
  chronoDeReprise,
  creerBrouillon,
  estFrais,
  parserBrouillon,
  parserStockBrouillons,
  plusRecent,
  questionsRestantes,
  reconstruirePaquet,
  sansBrouillon,
  type BrouillonQuiz,
} from './quiz-brouillon'
import { CHRONO_MAX_SECONDES } from './quiz-chrono'

const MAINTENANT = Date.parse('2026-10-28T12:00:00.000Z')

const brouillon = (over: Partial<BrouillonQuiz> = {}): BrouillonQuiz => ({
  ...creerBrouillon({
    quizId: 'quiz-1',
    titre: 'Le théorème de Thalès',
    matiere: 'Mathématiques',
    subjectSlug: 'maths',
    questionIds: ['q1', 'q2', 'q3', 'q4'],
    choix: [0, 1],
    secondes: 42,
    maintenant: new Date(MAINTENANT - 60_000),
  }),
  ...over,
})

describe('parserBrouillon — ce qui ne se reprend pas de travers', () => {
  test('un brouillon bien formé passe tel quel', () => {
    const b = brouillon()
    expect(parserBrouillon(JSON.parse(JSON.stringify(b)))).toEqual(b)
  })

  test('une manche finie ou pas commencée n’est pas un brouillon', () => {
    expect(parserBrouillon({ ...brouillon(), choix: [] })).toBeNull()
    expect(parserBrouillon({ ...brouillon(), choix: [0, 1, 0, 1] })).toBeNull()
  })

  test('les index de réponse aberrants sont refusés, « sans réponse » accepté', () => {
    expect(parserBrouillon({ ...brouillon(), choix: [0, 42] })).toBeNull()
    expect(parserBrouillon({ ...brouillon(), choix: [0.5] })).toBeNull()
    expect(parserBrouillon({ ...brouillon(), choix: [-1] })?.choix).toEqual([-1])
  })

  test('une question en double, une autre version, une date illisible : refusés', () => {
    expect(parserBrouillon({ ...brouillon(), questionIds: ['q1', 'q1', 'q2'] })).toBeNull()
    expect(parserBrouillon({ ...brouillon(), v: 2 })).toBeNull()
    expect(parserBrouillon({ ...brouillon(), at: 'hier' })).toBeNull()
    expect(parserBrouillon(null)).toBeNull()
    expect(parserBrouillon([brouillon()])).toBeNull()
  })

  test('le chrono stocké ne dépasse jamais le plafond', () => {
    expect(parserBrouillon({ ...brouillon(), secondes: 9999 })?.secondes).toBe(CHRONO_MAX_SECONDES)
    expect(parserBrouillon({ ...brouillon(), secondes: null })?.secondes).toBeNull()
    expect(parserBrouillon({ ...brouillon(), secondes: -3 })).toBeNull()
  })
})

describe('le stock du navigateur', () => {
  test('un JSON tronqué ou un tableau donne un stock vide', () => {
    expect(parserStockBrouillons('{"a":')).toEqual({})
    expect(parserStockBrouillons('[1,2]')).toEqual({})
    expect(parserStockBrouillons(null)).toEqual({})
  })

  test('poser puis retirer, sans toucher à l’original', () => {
    const vide = {}
    const plein = avecBrouillon(vide, brouillon())
    expect(vide).toEqual({})
    expect(Object.keys(plein)).toEqual(['quiz-1'])
    expect(sansBrouillon(plein, 'quiz-1')).toEqual({})
    expect(sansBrouillon(plein, 'autre')).toBe(plein)
  })

  test('au-delà du maximum, les plus anciennes manches sont oubliées', () => {
    let stock = {}
    for (let i = 0; i < BROUILLONS_MAX + 3; i++) {
      stock = avecBrouillon(
        stock,
        brouillon({ quizId: `quiz-${i}`, at: new Date(MAINTENANT - (100 - i) * 1000).toISOString() }),
      )
    }
    const ids = Object.keys(stock)
    expect(ids).toHaveLength(BROUILLONS_MAX)
    expect(ids).not.toContain('quiz-0')
    expect(ids).toContain(`quiz-${BROUILLONS_MAX + 2}`)
  })

  test('relu depuis le JSON, le stock est le même', () => {
    const stock = avecBrouillon({}, brouillon())
    expect(parserStockBrouillons(JSON.stringify(stock))).toEqual(stock)
  })
})

describe('quelle manche rappeler', () => {
  test('une manche de plus d’un jour est oubliée', () => {
    expect(estFrais(brouillon(), MAINTENANT)).toBe(true)
    const vieille = brouillon({ at: new Date(MAINTENANT - BROUILLON_DUREE_MS - 1).toISOString() })
    expect(estFrais(vieille, MAINTENANT)).toBe(false)
  })

  test('la plus récente des manches fraîches', () => {
    const a = brouillon({ quizId: 'a', at: new Date(MAINTENANT - 5000).toISOString() })
    const b = brouillon({ quizId: 'b', at: new Date(MAINTENANT - 1000).toISOString() })
    const stock = avecBrouillon(avecBrouillon({}, a), b)
    expect(brouillonARappeler(stock, MAINTENANT)?.quizId).toBe('b')
    expect(brouillonARappeler({}, MAINTENANT)).toBeNull()
  })

  test('entre le navigateur et la base, la plus récente gagne', () => {
    const local = brouillon({ at: new Date(MAINTENANT - 5000).toISOString() })
    const base = brouillon({ choix: [0, 1, 1], at: new Date(MAINTENANT - 1000).toISOString() })
    expect(plusRecent(local, base)).toBe(base)
    expect(plusRecent(local, null)).toBe(local)
    expect(plusRecent(null, null)).toBeNull()
  })
})

describe('reprendre la manche', () => {
  const QUESTIONS = ['q4', 'q3', 'q2', 'q1'].map((id) => ({ id, texte: id }))

  test('le paquet est rejoué dans l’ordre DU BROUILLON, pas celui de la page', () => {
    expect(reconstruirePaquet(brouillon(), QUESTIONS)?.map((q) => q.id)).toEqual(['q1', 'q2', 'q3', 'q4'])
  })

  test('une question disparue du quiz rend la manche irréprenable', () => {
    expect(reconstruirePaquet(brouillon(), QUESTIONS.slice(1))).toBeNull()
  })

  test('le chrono repart du temps restant, jamais sous le plancher', () => {
    expect(chronoDeReprise(42)).toBe(42)
    expect(chronoDeReprise(3)).toBe(CHRONO_REPRISE_MIN)
    expect(chronoDeReprise(null)).toBeNull()
  })

  test('le reste se compte en questions', () => {
    expect(questionsRestantes(brouillon())).toBe(2)
  })
})

describe('les manches closes ici ne ressuscitent pas depuis la base', () => {
  test('une copie plus ancienne que la clôture ne vaut plus', () => {
    const b = brouillon()
    const closes = avecClose({}, 'quiz-1', new Date(MAINTENANT))
    expect(copieEncoreValable(b, closes)).toBeNull()
  })

  test('une copie plus récente (jouée depuis ailleurs) reste valable', () => {
    const b = brouillon({ at: new Date(MAINTENANT).toISOString() })
    const closes = avecClose({}, 'quiz-1', new Date(MAINTENANT - 60_000))
    expect(copieEncoreValable(b, closes)).toBe(b)
    expect(copieEncoreValable(b, {})).toBe(b)
    expect(copieEncoreValable(null, closes)).toBeNull()
  })

  test('le stock des clôtures se relit, et ignore ce qui n’est pas une date', () => {
    const closes = avecClose({}, 'quiz-1', new Date(MAINTENANT))
    expect(parserCloses(JSON.stringify(closes))).toEqual(closes)
    expect(parserCloses('{"quiz-2":"jamais"}')).toEqual({})
    expect(parserCloses('[')).toEqual({})
  })
})
