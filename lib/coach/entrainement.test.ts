import { describe, it, expect } from 'vitest'
import {
  CONTROLE_MIN_QUESTIONS,
  controleHref,
  controleMinutes,
  countPretes,
  entrainementsFor,
} from './entrainement'
import { EXAM_MAX_QUESTIONS, EXAM_SECONDS_PER_QUESTION } from '../exam-blanc'

const MATIERES = [
  { slug: 'maths', name: 'Mathématiques' },
  { slug: 'francais', name: 'Français' },
  { slug: 'sport', name: 'EPS' },
]

function counts(over: Record<string, number> = {}) {
  return { maths: 30, francais: 12, sport: 0, ...over }
}

describe('entrainementsFor', () => {
  it('ne propose un contrôle que s’il y a de quoi le remplir', () => {
    // Six questions ne disent rien d'une matière, et le bilan par chapitre bâti
    // dessus ne serait que du bruit.
    const liste = entrainementsFor({
      matieres: MATIERES,
      disponiblesBySlug: counts({ francais: CONTROLE_MIN_QUESTIONS - 1 }),
    })

    expect(liste.find((m) => m.slug === 'maths')?.pret).toBe(true)
    expect(liste.find((m) => m.slug === 'francais')?.pret).toBe(false)
    expect(liste.find((m) => m.slug === 'sport')?.pret).toBe(false)
  })

  it('accepte tout juste le seuil', () => {
    const liste = entrainementsFor({
      matieres: MATIERES,
      disponiblesBySlug: counts({ francais: CONTROLE_MIN_QUESTIONS }),
    })
    expect(liste.find((m) => m.slug === 'francais')?.pret).toBe(true)
  })

  it('plafonne le sujet comme l’examen blanc', () => {
    const liste = entrainementsFor({
      matieres: MATIERES,
      disponiblesBySlug: counts({ maths: 400 }),
    })
    const maths = liste.find((m) => m.slug === 'maths')!

    expect(maths.disponibles).toBe(400)
    expect(maths.questions).toBe(EXAM_MAX_QUESTIONS)
  })

  it('n’annonce jamais plus de questions qu’il n’en existe', () => {
    const liste = entrainementsFor({
      matieres: MATIERES,
      disponiblesBySlug: counts({ maths: 11 }),
    })
    expect(liste.find((m) => m.slug === 'maths')?.questions).toBe(11)
  })

  it('remonte les matières jouables en tête, sans cacher les autres', () => {
    // « Il me manque des questions ici » est une information utile ; un trou
    // silencieux ne l'est pas.
    const liste = entrainementsFor({
      matieres: [
        { slug: 'sport', name: 'EPS' },
        { slug: 'francais', name: 'Français' },
        { slug: 'maths', name: 'Mathématiques' },
      ],
      disponiblesBySlug: counts(),
    })

    expect(liste.map((m) => m.slug)).toEqual(['maths', 'francais', 'sport'])
    expect(liste).toHaveLength(3)
  })

  it('porte le régime de chaque matière, ou rien si elle est hors doctrine', () => {
    const liste = entrainementsFor({
      matieres: MATIERES,
      disponiblesBySlug: counts(),
    })

    expect(liste.find((m) => m.slug === 'maths')?.regime).toBe('pratique')
    expect(liste.find((m) => m.slug === 'francais')?.regime).toBe('expression')
    expect(liste.find((m) => m.slug === 'sport')?.regime).toBeNull()
  })

  it('encaisse un comptage absent ou aberrant', () => {
    const liste = entrainementsFor({
      matieres: MATIERES,
      disponiblesBySlug: { maths: Number.NaN, francais: -12 },
    })

    for (const matiere of liste) {
      expect(matiere.disponibles).toBe(0)
      expect(matiere.questions).toBe(0)
      expect(matiere.pret).toBe(false)
      expect(matiere.minutes).toBeGreaterThanOrEqual(1)
    }
  })

  it('rend une liste vide sans matière, sans jeter', () => {
    expect(entrainementsFor({ matieres: [], disponiblesBySlug: {} })).toEqual([])
  })
})

describe('countPretes', () => {
  it('compte les matières réellement jouables', () => {
    const liste = entrainementsFor({
      matieres: MATIERES,
      disponiblesBySlug: counts(),
    })
    expect(countPretes(liste)).toBe(2)
  })
})

describe('controleMinutes', () => {
  it('suit le chrono de l’examen blanc', () => {
    expect(controleMinutes(20)).toBe(
      Math.round((20 * EXAM_SECONDS_PER_QUESTION) / 60),
    )
  })

  it('n’annonce jamais « 0 min »', () => {
    expect(controleMinutes(0)).toBe(1)
    expect(controleMinutes(-4)).toBe(1)
  })
})

describe('controleHref', () => {
  it('joue chez Réviser, pas chez Marcel', () => {
    expect(controleHref('maths')).toBe('/reviser/examen-blanc?subject=maths')
  })

  it('échappe un slug exotique', () => {
    expect(controleHref('a b')).toBe('/reviser/examen-blanc?subject=a%20b')
  })
})
