import { describe, it, expect } from 'vitest'
import {
  couvertureFor,
  couvertureGlobale,
  type ChapitreCouvert,
} from './couverture'
import { REGIMES } from './regimes'
import type { ChapterState } from '../mastery'

function ch(
  subjectSlug: string,
  state: ChapterState,
  value = 0,
  subjectName = subjectSlug,
): ChapitreCouvert {
  return { subjectSlug, subjectName, state, value }
}

describe('couvertureFor', () => {
  it('compte séparément le solide, l’entamé et le JAMAIS ouvert', () => {
    // C'est le « jamais ouvert » qui fait tout l'intérêt : le SRS ne connaît que
    // ce qui a déjà été vu, il ne peut pas signaler ce qui manque.
    const [maths] = couvertureFor([
      ch('maths', 'maitrise', 1),
      ch('maths', 'en_cours', 0.5),
      ch('maths', 'fragile', 0.2),
      ch('maths', 'a_commencer', 0),
    ])

    expect(maths.solide).toBe(1)
    expect(maths.enRoute).toBe(2)
    expect(maths.jamais).toBe(1)
    expect(maths.total).toBe(4)
  })

  it('déclare « vide » une matière jamais ouverte', () => {
    const [svt] = couvertureFor([
      ch('svt', 'a_commencer'),
      ch('svt', 'a_commencer'),
    ])

    expect(svt.etat).toBe('vide')
    expect(svt.constat).toContain('aucun chapitre')
  })

  it('déclare « en retard » une matière à peine entamée', () => {
    const [hg] = couvertureFor([
      ch('histoire-geo', 'en_cours', 0.4),
      ch('histoire-geo', 'a_commencer'),
      ch('histoire-geo', 'a_commencer'),
      ch('histoire-geo', 'a_commencer'),
    ])

    expect(hg.etat).toBe('retard')
    expect(hg.constat).toContain('3 chapitres sur 4')
  })

  it('déclare « solide » une matière largement maîtrisée', () => {
    const [anglais] = couvertureFor([
      ch('anglais', 'maitrise', 1),
      ch('anglais', 'maitrise', 1),
      ch('anglais', 'maitrise', 0.9),
      ch('anglais', 'en_cours', 0.6),
    ])

    expect(anglais.etat).toBe('solide')
  })

  it('accorde le singulier quand un seul chapitre manque', () => {
    const [maths] = couvertureFor([
      ch('maths', 'en_cours', 0.3),
      ch('maths', 'a_commencer'),
    ])
    // 1 ouvert sur 2 = 50 % → en route, pas en retard.
    expect(maths.etat).toBe('en_route')

    const [francais] = couvertureFor([
      ch('francais', 'a_commencer'),
      ch('francais', 'en_cours', 0.2),
      ch('francais', 'a_commencer'),
    ])
    expect(francais.constat).toContain('2 chapitres sur 3')
  })

  it('remonte les matières les plus en retard en tête', () => {
    // L'ordre utile, pas l'alphabet.
    const liste = couvertureFor([
      ch('anglais', 'maitrise', 1),
      ch('maths', 'a_commencer'),
      ch('francais', 'en_cours', 0.5),
      ch('francais', 'maitrise', 1),
    ])

    expect(liste.map((m) => m.slug)).toEqual(['maths', 'francais', 'anglais'])
  })

  it('porte la consigne du régime, et rien sur une matière hors doctrine', () => {
    const liste = couvertureFor([
      ch('maths', 'en_cours', 0.5),
      ch('sport', 'en_cours', 0.5),
    ])

    expect(liste.find((m) => m.slug === 'maths')?.consigne).toBe(
      REGIMES.pratique.consigne,
    )
    expect(liste.find((m) => m.slug === 'sport')?.consigne).toBeNull()
  })

  it('calcule une maîtrise moyenne bornée', () => {
    const [maths] = couvertureFor([
      ch('maths', 'maitrise', 3), // valeur aberrante
      ch('maths', 'a_commencer', -1),
    ])

    expect(maths.pct).toBe(50) // (1 + 0) / 2
  })

  it('ne parle pas d’une matière sans chapitre', () => {
    expect(couvertureFor([])).toEqual([])
  })
})

describe('couvertureGlobale', () => {
  it('pondère par le nombre de chapitres, pas par le nombre de matières', () => {
    // Une matière à 10 chapitres ne pèse pas comme une matière à 1 chapitre.
    const liste = couvertureFor([
      ...Array.from({ length: 9 }, () => ch('maths', 'maitrise', 1)),
      ch('maths', 'maitrise', 1),
      ch('francais', 'a_commencer', 0),
    ])

    expect(couvertureGlobale(liste)).toBe(91)
  })

  it('rend 0 sans rien à mesurer', () => {
    expect(couvertureGlobale([])).toBe(0)
  })
})
