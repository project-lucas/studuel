import { describe, expect, test } from 'vitest'
import { buildChapterSupports, type SupportLesson } from './chapter-supports'

const lesson = (over: Partial<SupportLesson> & { id: string }): SupportLesson => ({
  title: `Leçon ${over.id}`,
  quizId: `q-${over.id}`,
  questionCount: 10,
  dueCount: 0,
  best: null,
  defiAttempted: false,
  ownQuiz: true,
  ...over,
})

const input = (
  lessons: SupportLesson[],
  carteAvailable = true,
  erreurs = 0,
) => ({
  subjectSlug: 'anglais',
  chapterId: 'ch1',
  lessons,
  carte: { available: carteAvailable, locked: false },
  erreurs,
})

describe('buildChapterSupports', () => {
  test('les cinq supports, dans l’ordre d’usage', () => {
    const chips = buildChapterSupports(input([lesson({ id: 'l1' })]))
    expect(chips.map((c) => c.kind)).toEqual([
      'cours',
      'quiz',
      'flashcards',
      'carte',
      'defi',
    ])
  })

  test('pas de carte mentale quand le chapitre n’en a pas', () => {
    const chips = buildChapterSupports(input([lesson({ id: 'l1' })], false))
    expect(chips.map((c) => c.kind)).toEqual([
      'cours',
      'quiz',
      'flashcards',
      'defi',
    ])
  })

  test('un chapitre sans quiz garde son cours', () => {
    const chips = buildChapterSupports(
      input([lesson({ id: 'l1', quizId: null, questionCount: 0, ownQuiz: false })], false),
    )
    expect(chips.map((c) => c.kind)).toEqual(['cours'])
  })

  test('le cours ouvre la première leçon du chapitre', () => {
    const chips = buildChapterSupports(
      input([lesson({ id: 'l1' }), lesson({ id: 'l2' })]),
    )
    const cours = chips.find((c) => c.kind === 'cours')
    expect(cours?.href).toBe('/reviser/anglais/ch1/l1/cours')
    expect(cours?.meta).toBe('Leçon l1')
  })

  test('en pied de cours, le cours pointe la leçon SUIVANTE', () => {
    const chips = buildChapterSupports(
      input([lesson({ id: 'l1' }), lesson({ id: 'l2' })]),
      'l1',
    )
    const cours = chips.find((c) => c.kind === 'cours')
    expect(cours?.href).toBe('/reviser/anglais/ch1/l2/cours')
    expect(cours?.meta).toBe('Leçon l2')
  })

  test('pas de cours sur la dernière leçon : il n’y a plus rien à lire', () => {
    const chips = buildChapterSupports(
      input([lesson({ id: 'l1' }), lesson({ id: 'l2' })]),
      'l2',
    )
    expect(chips.some((c) => c.kind === 'cours')).toBe(false)
  })

  test('le quiz pointe vers le premier non acquis', () => {
    const chips = buildChapterSupports(
      input([
        lesson({ id: 'l1', best: { score: 10, total: 10, ratio: 1 } }),
        lesson({ id: 'l2', best: { score: 4, total: 10, ratio: 0.4 } }),
      ]),
    )
    const quiz = chips.find((c) => c.kind === 'quiz')
    expect(quiz?.href).toBe('/test/q-l2')
    expect(quiz?.meta).toBe('4/10')
    expect(quiz?.done).toBe(false)
  })

  test('tout acquis : le quiz retombe sur le premier, marqué fait', () => {
    const chips = buildChapterSupports(
      input([lesson({ id: 'l1', best: { score: 10, total: 10, ratio: 1 } })]),
    )
    const quiz = chips.find((c) => c.kind === 'quiz')
    expect(quiz?.href).toBe('/test/q-l1')
    expect(quiz?.done).toBe(true)
  })

  test('un quiz emprunté au chapitre n’est jamais proposé comme quiz de leçon', () => {
    const chips = buildChapterSupports(
      input([lesson({ id: 'l1', ownQuiz: false, quizId: 'q-autre' })], false),
    )
    expect(chips.some((c) => c.kind === 'quiz')).toBe(false)
    // Les flashcards et le défi, eux, se jouent sur le quiz emprunté.
    expect(chips.map((c) => c.kind)).toEqual(['cours', 'flashcards', 'defi'])
  })

  test('le défi vise la leçon dont il n’a pas encore été relevé', () => {
    const chips = buildChapterSupports(
      input([
        lesson({ id: 'l1', defiAttempted: true }),
        lesson({ id: 'l2', defiAttempted: false }),
      ]),
    )
    const defi = chips.find((c) => c.kind === 'defi')
    expect(defi?.href).toBe('/reviser/anglais/ch1/l2/defi')
    expect(defi?.meta).toBe('Jamais tenté')
  })

  test('tous les défis relevés : retour au premier, marqué relevé', () => {
    const chips = buildChapterSupports(
      input([lesson({ id: 'l1', defiAttempted: true })]),
    )
    const defi = chips.find((c) => c.kind === 'defi')
    expect(defi?.href).toBe('/reviser/anglais/ch1/l1/defi')
    expect(defi?.done).toBe(true)
  })

  test('la leçon lue épingle les supports du pied de cours', () => {
    const chips = buildChapterSupports(
      input([
        lesson({ id: 'l1', best: { score: 4, total: 10, ratio: 0.4 } }),
        lesson({ id: 'l2', dueCount: 3, defiAttempted: true }),
      ]),
      'l2',
    )
    expect(chips.find((c) => c.kind === 'quiz')?.href).toBe('/test/q-l2')
    expect(chips.find((c) => c.kind === 'flashcards')?.meta).toBe(
      '10 cartes · 3 à revoir',
    )
    expect(chips.find((c) => c.kind === 'defi')?.href).toBe(
      '/reviser/anglais/ch1/l2/defi',
    )
  })

  test('leçon lue sans quiz propre : le quiz retombe sur le chapitre', () => {
    const chips = buildChapterSupports(
      input([
        lesson({ id: 'l1' }),
        lesson({ id: 'l2', ownQuiz: false, quizId: 'q-l1' }),
      ]),
      'l2',
    )
    expect(chips.find((c) => c.kind === 'quiz')?.href).toBe('/test/q-l1')
    // …mais les flashcards restent celles de la leçon lue.
    expect(chips.find((c) => c.kind === 'flashcards')?.href).toBe(
      '/reviser/anglais/ch1/l2/flashcards',
    )
  })

  test('la carte verrouillée s’annonce comme telle', () => {
    const chips = buildChapterSupports({
      subjectSlug: 'anglais',
      chapterId: 'ch1',
      lessons: [lesson({ id: 'l1' })],
      carte: { available: true, locked: true },
      erreurs: 0,
    })
    const carte = chips.find((c) => c.kind === 'carte')
    expect(carte?.locked).toBe(true)
    expect(carte?.meta).toBe('Débloquer')
  })

  test('« Mes erreurs » n’apparaît que s’il y a des notions à corriger', () => {
    expect(
      buildChapterSupports(input([lesson({ id: 'l1' })], true, 0)).some(
        (c) => c.kind === 'erreurs',
      ),
    ).toBe(false)

    const chips = buildChapterSupports(input([lesson({ id: 'l1' })], true, 3))
    const erreurs = chips.find((c) => c.kind === 'erreurs')
    expect(erreurs?.badge).toBe('3 à revoir')
    expect(erreurs?.meta).toBe('3 notions à revoir')
    // La file lancée est celle DU CHAPITRE, pas celle de toute la matière.
    expect(erreurs?.href).toBe('/reviser/revoir?matiere=anglais&chapitre=ch1')
    // Elle ferme la marche : on corrige après avoir travaillé.
    expect(chips[chips.length - 1].kind).toBe('erreurs')
  })

  test('les récompenses promises sont celles du portefeuille', () => {
    const chips = buildChapterSupports(input([lesson({ id: 'l1' })]))
    expect(chips.find((c) => c.kind === 'quiz')?.xp).toBe(20)
    expect(chips.find((c) => c.kind === 'flashcards')?.xp).toBe(10)
    expect(chips.find((c) => c.kind === 'defi')?.xp).toBe(25)
    expect(chips.find((c) => c.kind === 'carte')?.xp).toBeUndefined()
  })
})
