import { describe, it, expect } from 'vitest'
import { ENTRAINEMENT_TAILLE, veutEntrainement } from '@/lib/quiz-session'

// Ce que ces tests gardent : la première fois, on passe l'ÉVALUATION entière —
// c'est elle qui donne la note et la couronne. Et on ne compose jamais une
// séance qui vaudrait le quiz complet, sans quoi elle recompterait dans la
// maîtrise du chapitre en se faisant passer pour un entraînement.

describe('veutEntrainement', () => {
  it('sert le quiz entier au premier passage', () => {
    expect(veutEntrainement({ dejaPasse: false, total: 10 })).toBe(false)
  })

  it('compose une séance dès le deuxième passage d’un quiz assez long', () => {
    expect(veutEntrainement({ dejaPasse: true, total: 10 })).toBe(true)
  })

  it('renonce quand le quiz n’est pas plus long que la séance', () => {
    // Tirer 5 parmi 5 ne choisit rien, et le paquet ne serait pas partiel :
    // il recompterait dans la maîtrise.
    expect(
      veutEntrainement({ dejaPasse: true, total: ENTRAINEMENT_TAILLE }),
    ).toBe(false)
    expect(
      veutEntrainement({ dejaPasse: true, total: ENTRAINEMENT_TAILLE - 1 }),
    ).toBe(false)
    expect(
      veutEntrainement({ dejaPasse: true, total: ENTRAINEMENT_TAILLE + 1 }),
    ).toBe(true)
  })
})
