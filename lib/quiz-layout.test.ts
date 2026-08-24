import { describe, it, expect } from 'vitest'
import {
  GRILLE_MAX_CARACTERES,
  layoutForQuestion,
} from '@/lib/quiz-layout'

// Ce que ces tests gardent : la disposition se déduit de la FORME des options
// (leur nombre, leur longueur), jamais de la matière ni du `kind` déclaré en
// base — un « vrai / faux » saisi comme un QCM à deux choix doit tomber sur le
// même écran que celui qui porte l'étiquette.

const q = (options: string[], kind?: string) => ({ kind, options })

describe('layoutForQuestion', () => {
  it('sert le duo dès qu’il n’y a que deux options', () => {
    expect(layoutForQuestion(q(['Vrai', 'Faux'], 'true_false'))).toBe('duo')
    // Même sans l'étiquette : c'est le nombre de choix qui décide.
    expect(layoutForQuestion(q(['Oui', 'Non']))).toBe('duo')
  })

  it('range quatre réponses courtes en grille', () => {
    expect(layoutForQuestion(q(['1789', '1815', '1848', '1870']))).toBe('grille')
  })

  it('garde la liste dès qu’une seule réponse est longue', () => {
    const long = 'La rotation de la Terre sur elle-même en 24 heures'
    expect(layoutForQuestion(q(['1789', '1815', '1848', long]))).toBe('liste')
  })

  it('garde la liste sur trois options — la grille laisserait un trou', () => {
    expect(layoutForQuestion(q(['Un', 'Deux', 'Trois']))).toBe('liste')
  })

  it('mesure la longueur sans les espaces de bord', () => {
    const pile = 'x'.repeat(GRILLE_MAX_CARACTERES)
    expect(layoutForQuestion(q([`  ${pile}  `, pile, pile, pile]))).toBe('grille')
    expect(layoutForQuestion(q([pile + 'x', pile, pile, pile]))).toBe('liste')
  })

  it('ne casse pas sur une question sans options', () => {
    expect(layoutForQuestion(q([]))).toBe('liste')
  })
})
