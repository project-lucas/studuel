import { describe, it, expect } from 'vitest'
import {
  chapitreSuivant,
  compteAcquises,
  estAcquise,
  premierQuiz,
  questionsAcquises,
  quizDeLaLeconSuivante,
  xpPromise,
  type LeconRef,
} from './quiz-suivant'
import { initialState, type QuestionState } from './questions/engine'
import { XP_AWARDS } from './wallet'

const lecon = (over: Partial<LeconRef> & { id: string }): LeconRef => ({
  position: 0,
  quizId: null,
  quizTitre: null,
  ...over,
})

const LECONS: LeconRef[] = [
  lecon({ id: 'l1', position: 1, quizId: 'q1', quizTitre: 'Quiz 1' }),
  lecon({ id: 'l2', position: 2 }),
  lecon({ id: 'l3', position: 3, quizId: 'q3', quizTitre: 'Quiz 3' }),
  lecon({ id: 'l4', position: 4, quizId: 'q4', quizTitre: 'Quiz 4' }),
]

describe('quizDeLaLeconSuivante', () => {
  it('saute les leçons sans quiz et prend le premier quiz qui suit', () => {
    expect(quizDeLaLeconSuivante(LECONS, 'q1')).toEqual({
      quizId: 'q3',
      titre: 'Quiz 3',
    })
  })

  it('suit la POSITION, pas l’ordre de la liste', () => {
    const melange = [LECONS[3], LECONS[0], LECONS[2], LECONS[1]]
    expect(quizDeLaLeconSuivante(melange, 'q3')?.quizId).toBe('q4')
  })

  it('rend null au dernier quiz du chapitre, ou si le quiz est inconnu', () => {
    expect(quizDeLaLeconSuivante(LECONS, 'q4')).toBeNull()
    expect(quizDeLaLeconSuivante(LECONS, 'inconnu')).toBeNull()
  })
})

describe('chapitreSuivant / premierQuiz', () => {
  const CHAPITRES = [
    { id: 'c3', position: 3 },
    { id: 'c1', position: 1 },
    { id: 'c2', position: 2 },
  ]

  it('rend le chapitre d’après dans l’ordre du programme', () => {
    expect(chapitreSuivant(CHAPITRES, 'c1')?.id).toBe('c2')
    expect(chapitreSuivant(CHAPITRES, 'c3')).toBeNull()
    expect(chapitreSuivant(CHAPITRES, 'zz')).toBeNull()
  })

  it('premierQuiz : le premier quiz du chapitre, « Quiz » sans titre', () => {
    expect(premierQuiz(LECONS)).toEqual({ quizId: 'q1', titre: 'Quiz 1' })
    expect(
      premierQuiz([lecon({ id: 'a', position: 1, quizId: 'qa' })]),
    ).toEqual({ quizId: 'qa', titre: 'Quiz' })
    expect(premierQuiz([lecon({ id: 'a' })])).toBeNull()
  })
})

describe('xpPromise', () => {
  it('promet la PROCHAINE couronne, et rien quand les trois sont acquises', () => {
    expect(xpPromise(0)).toBe(XP_AWARDS.couronne1)
    expect(xpPromise(0.3)).toBe(XP_AWARDS.couronne2)
    expect(xpPromise(0.6)).toBe(XP_AWARDS.couronne3)
    expect(xpPromise(1)).toBe(0)
  })

  it('borne une valeur aberrante', () => {
    expect(xpPromise(-4)).toBe(XP_AWARDS.couronne1)
    expect(xpPromise(7)).toBe(0)
  })
})

describe('questions acquises', () => {
  const ref = (id: string) => ({
    questionId: id,
    chapterId: null,
    subjectId: null,
    level: null,
  })
  const etat = (id: string, box: number, timesSeen = 1): QuestionState => ({
    ...initialState(ref(id), 0),
    box,
    timesSeen,
  })

  it('acquise = vue et sortie de la boîte 1', () => {
    expect(estAcquise(undefined)).toBe(false)
    expect(estAcquise(etat('a', 1))).toBe(false)
    expect(estAcquise(etat('a', 2))).toBe(true)
    expect(estAcquise(etat('a', 3, 0))).toBe(false)
  })

  it('filtre les ids du quiz par leur état', () => {
    const states = new Map([
      ['a', etat('a', 2)],
      ['b', etat('b', 1)],
      ['c', etat('c', 5)],
    ])
    expect(questionsAcquises(['a', 'b', 'c', 'd'], states)).toEqual(['a', 'c'])
  })

  it('compteAcquises : union sans doublon, bornée au total', () => {
    expect(compteAcquises(['a', 'c'], ['a', 'b'], 4)).toBe(3)
    expect(compteAcquises(['a', 'c'], ['b', 'd', 'e'], 4)).toBe(4)
    expect(compteAcquises([], [], 4)).toBe(0)
    expect(compteAcquises(['a'], [], 0)).toBe(0)
  })
})
