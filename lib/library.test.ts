import { describe, it, expect } from 'vitest'
import {
  isLibraryKind,
  normalizeTitle,
  normalizeFiche,
  normalizeQuizQuestion,
  normalizeQuizContent,
  normalizeCarte,
  normalizeContent,
  emptyContent,
  carteWithModel,
  CARTE_MODEL_BRANCHES,
  isContentReady,
  toQuizQuestions,
  MAX_TITLE_LEN,
  MAX_QUIZ_QUESTIONS,
} from '@/lib/library'

describe('isLibraryKind', () => {
  it('ne reconnaît que fiche/quiz/carte', () => {
    expect(isLibraryKind('fiche')).toBe(true)
    expect(isLibraryKind('quiz')).toBe(true)
    expect(isLibraryKind('carte')).toBe(true)
    expect(isLibraryKind('flashcard')).toBe(false)
    expect(isLibraryKind(null)).toBe(false)
  })
})

describe('normalizeTitle', () => {
  it('rogne, borne, et retombe sur « Sans titre » si vide', () => {
    expect(normalizeTitle('  Mon cours  ')).toBe('Mon cours')
    expect(normalizeTitle('   ')).toBe('Sans titre')
    expect(normalizeTitle(42)).toBe('Sans titre')
    expect(normalizeTitle('x'.repeat(200)).length).toBe(MAX_TITLE_LEN)
  })
})

describe('normalizeFiche', () => {
  it('extrait le markdown en chaîne bornée', () => {
    expect(normalizeFiche({ markdown: 'Bonjour' })).toEqual({
      markdown: 'Bonjour',
    })
    expect(normalizeFiche(null)).toEqual({ markdown: '' })
    expect(normalizeFiche({ markdown: 42 })).toEqual({ markdown: '' })
  })
})

describe('normalizeQuizQuestion', () => {
  it('accepte une question bien formée', () => {
    expect(
      normalizeQuizQuestion({
        question: '  Capitale de la France ?  ',
        options: ['Paris', 'Lyon', ''],
        correct_index: 0,
        explanation: '  C’est Paris.  ',
      }),
    ).toEqual({
      question: 'Capitale de la France ?',
      options: ['Paris', 'Lyon'], // l'option vide est retirée
      correct_index: 0,
      explanation: 'C’est Paris.',
    })
  })

  it('rejette une question vide ou < 2 options non vides', () => {
    expect(normalizeQuizQuestion({ question: '  ', options: ['a', 'b'] })).toBeNull()
    expect(
      normalizeQuizQuestion({ question: 'Q', options: ['seule', ''] }),
    ).toBeNull()
    expect(normalizeQuizQuestion(null)).toBeNull()
  })

  it('ramène un correct_index hors bornes à 0', () => {
    expect(
      normalizeQuizQuestion({ question: 'Q', options: ['a', 'b'], correct_index: 9 })
        ?.correct_index,
    ).toBe(0)
    expect(
      normalizeQuizQuestion({ question: 'Q', options: ['a', 'b'], correct_index: -1 })
        ?.correct_index,
    ).toBe(0)
  })

  it('explication vide → null', () => {
    expect(
      normalizeQuizQuestion({ question: 'Q', options: ['a', 'b'], explanation: '   ' })
        ?.explanation,
    ).toBeNull()
  })
})

describe('normalizeQuizContent', () => {
  it('jette les questions invalides et borne le nombre', () => {
    const questions = Array.from({ length: MAX_QUIZ_QUESTIONS + 5 }, (_, i) => ({
      question: `Q${i}`,
      options: ['a', 'b'],
      correct_index: 1,
    }))
    const c = normalizeQuizContent({ questions: [...questions, { question: '' }] })
    expect(c.questions).toHaveLength(MAX_QUIZ_QUESTIONS)
    expect(c.questions[0].correct_index).toBe(1)
  })

  it('non-tableau → aucune question', () => {
    expect(normalizeQuizContent({ questions: 'x' })).toEqual({ questions: [] })
    expect(normalizeQuizContent(null)).toEqual({ questions: [] })
  })
})

describe('normalizeCarte', () => {
  it('valide centre + branches (titre requis, enfants nettoyés)', () => {
    expect(
      normalizeCarte({
        centre: '  Photosynthèse  ',
        branches: [
          { titre: 'Réactifs', enfants: ['CO₂', 'H₂O', ''] },
          { titre: '', enfants: ['ignorée'] }, // titre vide → jetée
          'invalide',
        ],
      }),
    ).toEqual({
      centre: 'Photosynthèse',
      branches: [{ titre: 'Réactifs', enfants: ['CO₂', 'H₂O'] }],
    })
  })

  it('formes vides → structure vide sûre', () => {
    expect(normalizeCarte(null)).toEqual({ centre: '', branches: [] })
  })
})

describe('normalizeContent / emptyContent', () => {
  it('dispatch selon le type', () => {
    expect(normalizeContent('fiche', { markdown: 'x' })).toEqual({ markdown: 'x' })
    expect(normalizeContent('quiz', { questions: [] })).toEqual({ questions: [] })
    expect(normalizeContent('carte', {})).toEqual({ centre: '', branches: [] })
  })

  it('emptyContent donne le squelette par type', () => {
    expect(emptyContent('fiche')).toEqual({ markdown: '' })
    expect(emptyContent('quiz')).toEqual({ questions: [] })
    expect(emptyContent('carte')).toEqual({ centre: '', branches: [] })
  })
})

describe('carteWithModel', () => {
  it('propose un modèle de branches vides sur une carte vierge', () => {
    const carte = carteWithModel({ centre: '', branches: [] })

    expect(carte.branches).toHaveLength(CARTE_MODEL_BRANCHES)
    expect(carte.branches.every((b) => b.titre === '')).toBe(true)
  })

  it('ne touche pas une carte qui a déjà des branches', () => {
    const rempli = { centre: 'Eau', branches: [{ titre: 'États', enfants: [] }] }

    expect(carteWithModel(rempli)).toEqual(rempli)
  })

  it('conserve le centre déjà saisi en amorçant les branches', () => {
    // Cas réel : l'élève nomme son cœur, enregistre, revient — il doit
    // retrouver son centre ET le modèle de branches.
    expect(carteWithModel({ centre: 'Eau', branches: [] })).toMatchObject({
      centre: 'Eau',
    })
  })

  it('le modèle non rempli ne persiste pas en base', () => {
    // Contrat : les branches d'amorce sont une aide de SAISIE ; enregistrée
    // telle quelle, la carte doit repartir vide (normalizeCarte les retire).
    const modele = carteWithModel({ centre: '', branches: [] })

    expect(normalizeContent('carte', modele)).toEqual({
      centre: '',
      branches: [],
    })
  })
})

describe('isContentReady', () => {
  it('fiche prête si markdown non vide', () => {
    expect(isContentReady('fiche', { markdown: '' })).toBe(false)
    expect(isContentReady('fiche', { markdown: 'Notes' })).toBe(true)
  })
  it('quiz prêt s’il a au moins une question', () => {
    expect(isContentReady('quiz', { questions: [] })).toBe(false)
    expect(
      isContentReady('quiz', {
        questions: [{ question: 'Q', options: ['a', 'b'], correct_index: 0, explanation: null }],
      }),
    ).toBe(true)
  })
  it('carte prête si centre + au moins une branche', () => {
    expect(isContentReady('carte', { centre: '', branches: [] })).toBe(false)
    expect(
      isContentReady('carte', { centre: 'C', branches: [{ titre: 'B', enfants: [] }] }),
    ).toBe(true)
  })
})

describe('toQuizQuestions', () => {
  it('convertit en questions jouables (ids synthétiques, QCM)', () => {
    const qs = toQuizQuestions('abc', {
      questions: [
        { question: 'Q1', options: ['a', 'b'], correct_index: 1, explanation: 'x' },
      ],
    })
    expect(qs).toEqual([
      {
        id: 'abc-0',
        quiz_id: 'abc',
        question: 'Q1',
        kind: 'mcq',
        options: ['a', 'b'],
        correct_index: 1,
        explanation: 'x',
        position: 0,
      },
    ])
  })
})
