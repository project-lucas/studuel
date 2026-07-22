import { describe, expect, test } from 'vitest'
import {
  carteMeta,
  chapterStatus,
  chapterValue,
  crowns,
  defiMeta,
  defiTitle,
  flashcardsMeta,
  isNewToSubject,
  quizMeta,
  subjectProgress,
} from './subject-template'

describe('chapterValue', () => {
  test('vaut 0 sans aucune activité', () => {
    expect(chapterValue({ bestQuizRatio: null, lessonDone: false })).toBe(0)
  })

  test('prend le meilleur ratio de quiz', () => {
    expect(chapterValue({ bestQuizRatio: 0.7, lessonDone: false })).toBe(0.7)
  })

  test('applique le plancher de 30 % quand une leçon est terminée', () => {
    expect(chapterValue({ bestQuizRatio: null, lessonDone: true })).toBe(0.3)
    expect(chapterValue({ bestQuizRatio: 0.1, lessonDone: true })).toBe(0.3)
  })

  test('le plancher ne rabaisse jamais un bon score', () => {
    expect(chapterValue({ bestQuizRatio: 0.9, lessonDone: true })).toBe(0.9)
  })

  test('borne la valeur entre 0 et 1', () => {
    expect(chapterValue({ bestQuizRatio: 1.4, lessonDone: false })).toBe(1)
    expect(chapterValue({ bestQuizRatio: -0.2, lessonDone: false })).toBe(0)
  })
})

describe('chapterStatus', () => {
  test('non commencé à zéro', () => {
    expect(chapterStatus(0)).toBe('non_commence')
  })

  test('en cours dès la moindre activité', () => {
    expect(chapterStatus(0.1)).toBe('en_cours')
    expect(chapterStatus(0.79)).toBe('en_cours')
  })

  test('complété à partir de 80 %', () => {
    expect(chapterStatus(0.8)).toBe('complete')
    expect(chapterStatus(1)).toBe('complete')
  })
})

describe('crowns', () => {
  test('0 couronne sans activité', () => {
    expect(crowns(0)).toBe(0)
  })

  test('paliers 30 % / 60 % / 80 %', () => {
    expect(crowns(0.29)).toBe(0)
    expect(crowns(0.3)).toBe(1)
    expect(crowns(0.6)).toBe(2)
    expect(crowns(0.8)).toBe(3)
    expect(crowns(1)).toBe(3)
  })
})

describe('subjectProgress', () => {
  test('matière vide → 0/0 · 0 %', () => {
    expect(subjectProgress([])).toEqual({ done: 0, total: 0, pct: 0 })
  })

  test('compte les chapitres complétés et la moyenne', () => {
    expect(subjectProgress([1, 0.8, 0.4, 0])).toEqual({
      done: 2,
      total: 4,
      pct: 55,
    })
  })
})

describe('isNewToSubject', () => {
  test('vrai quand aucun chapitre entamé', () => {
    expect(isNewToSubject([0, 0, 0])).toBe(true)
  })

  test('faux dès la moindre activité', () => {
    expect(isNewToSubject([0, 0.1, 0])).toBe(false)
  })

  test('faux sans chapitre (rien à commencer)', () => {
    expect(isNewToSubject([])).toBe(false)
  })
})

describe('quizMeta', () => {
  test('meilleur essai quand le quiz a été joué', () => {
    expect(quizMeta({ score: 7, total: 10 }, 10)).toBe('7/10')
  })

  test('« Jamais tenté » sinon', () => {
    expect(quizMeta(null, 12)).toBe('Jamais tenté')
  })

  test('un essai à total nul ne compte pas', () => {
    expect(quizMeta({ score: 0, total: 0 }, 10)).toBe('Jamais tenté')
  })
})

describe('flashcardsMeta', () => {
  test('cartes seules', () => {
    expect(flashcardsMeta(12, 0)).toBe('12 cartes')
    expect(flashcardsMeta(1, 0)).toBe('1 carte')
  })

  test('avec la file à revoir', () => {
    expect(flashcardsMeta(12, 4)).toBe('12 cartes · 4 à revoir')
  })
})

describe('defiTitle', () => {
  test('nomme l’item « Défi · N questions », pluriel compris', () => {
    expect(defiTitle(1)).toBe('Défi · 1 question')
    expect(defiTitle(10)).toBe('Défi · 10 questions')
  })
})

describe('defiMeta', () => {
  test('dit si le défi a déjà été relevé', () => {
    expect(defiMeta(false)).toBe('Jamais tenté')
    expect(defiMeta(true)).toBe('Relevé')
  })
})

describe('carteMeta', () => {
  test('« Débloquer » quand le chapitre est verrouillé', () => {
    expect(carteMeta(true)).toBe('Débloquer')
  })

  test('« Vue d’ensemble » quand la carte est accessible', () => {
    expect(carteMeta(false)).toBe('Vue d’ensemble')
  })
})
