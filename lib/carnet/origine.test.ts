import { describe, expect, it } from 'vitest'
import { normaliserOrigine, teinteDossier, teinteQuestion } from './origine'

describe('normaliserOrigine', () => {
  it('accepte les quatre origines connues', () => {
    expect(normaliserOrigine('manuel')).toBe('manuel')
    expect(normaliserOrigine('texte')).toBe('texte')
    expect(normaliserOrigine('pdf')).toBe('pdf')
    expect(normaliserOrigine('photo')).toBe('photo')
  })

  it('rend null pour tout le reste (colonne absente, valeur inconnue)', () => {
    expect(normaliserOrigine(undefined)).toBeNull()
    expect(normaliserOrigine(null)).toBeNull()
    expect(normaliserOrigine('scan')).toBeNull()
    expect(normaliserOrigine(3)).toBeNull()
  })
})

describe('teinteQuestion', () => {
  it('est rouge pour une question issue d’un PDF, quel que soit son type', () => {
    expect(teinteQuestion({ type: 'qcm', origine: 'pdf' })).toBe('pdf')
    expect(teinteQuestion({ type: 'flashcard', origine: 'pdf' })).toBe('pdf')
  })

  it('est violette pour une flashcard qui ne vient pas d’un PDF', () => {
    expect(teinteQuestion({ type: 'flashcard', origine: null })).toBe('flashcard')
    expect(teinteQuestion({ type: 'flashcard', origine: 'manuel' })).toBe('flashcard')
    expect(teinteQuestion({ type: 'flashcard', origine: 'photo' })).toBe('flashcard')
  })

  it('est neutre sinon', () => {
    expect(teinteQuestion({ type: 'qcm', origine: null })).toBe('neutre')
    expect(teinteQuestion({ type: 'vrai_faux', origine: 'texte' })).toBe('neutre')
  })
})

describe('teinteDossier', () => {
  it('est neutre pour un dossier vide ou sans flashcard ni PDF', () => {
    expect(teinteDossier([])).toBe('neutre')
    expect(teinteDossier([{ type: 'qcm', origine: 'manuel' }])).toBe('neutre')
  })

  it('est violette dès qu’il contient une flashcard', () => {
    expect(
      teinteDossier([
        { type: 'qcm', origine: null },
        { type: 'flashcard', origine: null },
      ]),
    ).toBe('flashcard')
  })

  it('est rouge dès qu’un PDF y a été inséré, même au milieu de flashcards', () => {
    expect(
      teinteDossier([
        { type: 'flashcard', origine: null },
        { type: 'qcm', origine: 'pdf' },
        { type: 'flashcard', origine: 'texte' },
      ]),
    ).toBe('pdf')
  })
})
