import { describe, it, expect } from 'vitest'
import {
  BONUS_ECLAIR,
  ECLAIR_SECONDES,
  POINTS_BASE,
  QUIZ_PILOTES,
  consigneArene,
  estEclair,
  etoilesQuiz,
  jaugeEclair,
  meilleureManche,
  objectifCouronne,
  pointsReponse,
  quizEnArene,
  titreArene,
  urgenceEclair,
} from '@/lib/quiz-arene'

describe('quizEnArene — le pilote', () => {
  it('sert l’arène aux quiz du pilote, et à eux seuls', () => {
    for (const id of QUIZ_PILOTES) expect(quizEnArene(id)).toBe(true)
    expect(quizEnArene('un-autre-quiz')).toBe(false)
  })

  it('se force par l’URL pour comparer n’importe quel chapitre', () => {
    expect(quizEnArene('un-autre-quiz', '1')).toBe(true)
    expect(quizEnArene('un-autre-quiz', ['true'])).toBe(true)
    expect(quizEnArene('un-autre-quiz', '0')).toBe(false)
    expect(quizEnArene('un-autre-quiz', null)).toBe(false)
  })
})

describe('la jauge éclair', () => {
  it('reste éclair tant que la jauge n’est pas vide, puis s’éteint', () => {
    expect(estEclair(0)).toBe(true)
    expect(estEclair(ECLAIR_SECONDES * 1000 - 1)).toBe(true)
    expect(estEclair(ECLAIR_SECONDES * 1000)).toBe(false)
    expect(estEclair(Number.NaN)).toBe(false)
    expect(estEclair(-5)).toBe(false)
  })

  it('fond linéairement de 1 à 0', () => {
    expect(jaugeEclair(0)).toBe(1)
    expect(jaugeEclair((ECLAIR_SECONDES * 1000) / 2)).toBeCloseTo(0.5)
    expect(jaugeEclair(ECLAIR_SECONDES * 1000 * 3)).toBe(0)
  })

  it('ne bat que sur les dernières secondes, de plus en plus fort', () => {
    expect(urgenceEclair(10)).toBeNull()
    expect(urgenceEclair(0)).toBeNull()
    expect(urgenceEclair(2.4)).toBeCloseTo(1 / 3)
    expect(urgenceEclair(0.4)).toBe(1)
  })
})

describe('pointsReponse — les points de la manche', () => {
  it('ne paye rien sur une erreur, même éclair', () => {
    expect(pointsReponse({ bonne: false, serieAvant: 5, eclair: true })).toEqual({
      points: 0,
      eclair: false,
      multiplicateur: 2,
    })
  })

  it('paye la base, puis la base plus l’éclair', () => {
    expect(pointsReponse({ bonne: true, serieAvant: 0, eclair: false }).points).toBe(
      POINTS_BASE,
    )
    expect(pointsReponse({ bonne: true, serieAvant: 0, eclair: true }).points).toBe(
      POINTS_BASE + BONUS_ECLAIR,
    )
  })

  it('multiplie la base par la série, jamais l’éclair', () => {
    const v = pointsReponse({ bonne: true, serieAvant: 3, eclair: true })
    expect(v.multiplicateur).toBe(2)
    expect(v.points).toBe(POINTS_BASE * 2 + BONUS_ECLAIR)
  })
})

describe('le bilan', () => {
  it('vise le seuil de maîtrise, arrondi au-dessus', () => {
    expect(objectifCouronne(10)).toBe(8)
    expect(objectifCouronne(5)).toBe(4)
    expect(objectifCouronne(7)).toBe(6)
    expect(objectifCouronne(0)).toBe(0)
  })

  it('compte les étoiles sur les seuils des paliers', () => {
    expect(etoilesQuiz(5, 10)).toBe(0)
    expect(etoilesQuiz(6, 10)).toBe(1)
    expect(etoilesQuiz(8, 10)).toBe(2)
    expect(etoilesQuiz(10, 10)).toBe(3)
    expect(etoilesQuiz(0, 0)).toBe(0)
  })

  it('retient la meilleure manche au ratio, et rien sans passage', () => {
    expect(meilleureManche([])).toBeNull()
    expect(
      meilleureManche([
        { score: 7, total: 10 },
        { score: 4, total: 5 },
        { score: 3, total: 0 },
      ]),
    ).toEqual({ score: 4, total: 5 })
  })
})

describe('l’affichage', () => {
  it('retire le préfixe « Quiz — » du titre', () => {
    expect(titreArene('Quiz — Dénombrables, indénombrables')).toBe(
      'Dénombrables, indénombrables',
    )
    expect(titreArene('Quiz : Les articles')).toBe('Les articles')
    expect(titreArene('Les articles')).toBe('Les articles')
    expect(titreArene('Quiz — ')).toBe('Quiz —')
  })

  it('réduit la consigne au geste', () => {
    expect(consigneArene({ kind: 'mcq', question: 'Capitale ?', trou: false })).toBe(
      'Choisis',
    )
    expect(consigneArene({ kind: 'mcq', question: 'x ___ y', trou: true })).toBe(
      'Complète',
    )
    expect(
      consigneArene({ kind: 'true_false', question: 'Vrai ?', trou: false }),
    ).toBe('Vrai ou faux ?')
    expect(
      consigneArene({ kind: 'mcq', question: 'Traduis « apple »', trou: false }),
    ).toBe('Traduis')
  })
})
