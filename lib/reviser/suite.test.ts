import { describe, expect, it } from 'vitest'
import { buildChapterSupports } from '@/lib/chapter-supports'
import { hrefCours, hrefQuiz, suiteDeFiche, type LeconDeFiche } from '@/lib/reviser/suite'

const lecon = (id: string, over: Partial<LeconDeFiche> = {}): LeconDeFiche => ({
  id,
  lue: false,
  quizId: `quiz-${id}`,
  meilleur: null,
  ...over,
})

const de = (lecons: LeconDeFiche[], terminee = false) =>
  suiteDeFiche({ subjectSlug: 'maths', chapterId: 'c1', lecons, terminee })

describe('suiteDeFiche', () => {
  it('une fiche jamais ouverte mène à son cours', () => {
    expect(de([lecon('l1')])).toEqual({
      genre: 'cours',
      label: 'Cours',
      href: '/reviser/maths/c1/l1/cours',
    })
  })

  it('cours lu : le bouton passe au quiz', () => {
    expect(de([lecon('l1', { lue: true })])).toEqual({
      genre: 'quiz',
      label: 'Quiz',
      href: '/test/quiz-l1',
    })
  })

  it('un quiz raté se repasse, un quiz acquis non', () => {
    expect(de([lecon('l1', { lue: true, meilleur: 0.5 })])?.genre).toBe('quiz')
    expect(de([lecon('l1', { lue: true, meilleur: 0.8 })])?.genre).toBe('revoir')
  })

  it('les leçons se suivent : lire, se tester, puis la suivante', () => {
    const deux = [lecon('l1', { lue: true, meilleur: 0.9 }), lecon('l2')]
    expect(de(deux)?.href).toBe('/reviser/maths/c1/l2/cours')
  })

  it('une leçon sans quiz ne bloque pas la suite', () => {
    const deux = [lecon('l1', { lue: true, quizId: null }), lecon('l2')]
    expect(de(deux)?.href).toBe('/reviser/maths/c1/l2/cours')
    expect(de([lecon('l1', { lue: true, quizId: null })])?.genre).toBe('revoir')
  })

  it('une fiche terminée se revoit, quel que soit le détail de ses leçons', () => {
    expect(de([lecon('l1'), lecon('l2')], true)).toEqual({
      genre: 'revoir',
      label: 'Revoir',
      href: '/reviser/maths/c1/l1/cours',
    })
  })

  it('pas de leçon, pas de bouton', () => {
    expect(de([])).toBeNull()
  })
})

describe('les adresses sont celles des tuiles de l’écran de chapitre', () => {
  const chips = buildChapterSupports({
    subjectSlug: 'maths',
    chapterId: 'c1',
    lessons: [
      { id: 'l1', title: 'Leçon', quizId: 'q1', questionCount: 8, best: null, ownQuiz: true, read: false },
    ],
    carte: { available: false, locked: false },
    exercice: { best: null, premium: true },
    erreurs: 0,
  })

  it('le cours', () => {
    expect(hrefCours('maths', 'c1', 'l1')).toBe(chips.find((c) => c.kind === 'cours')?.href)
  })

  it('le quiz', () => {
    expect(hrefQuiz('q1')).toBe(chips.find((c) => c.kind === 'quiz')?.href)
  })
})
