import { describe, expect, test } from 'vitest'
import { buildChapterSupports, type SupportLesson } from './chapter-supports'

const lesson = (over: Partial<SupportLesson> & { id: string }): SupportLesson => ({
  title: `Leçon ${over.id}`,
  quizId: `q-${over.id}`,
  questionCount: 10,
  dueCount: 0,
  best: null,
  ownQuiz: true,
  read: false,
  ...over,
})

type Exercice = { best: { note: number; sur: number } | null; premium: boolean }

const input = (
  lessons: SupportLesson[],
  carteAvailable = true,
  erreurs = 0,
  exercice: Exercice = { best: null, premium: true },
) => ({
  subjectSlug: 'anglais',
  chapterId: 'ch1',
  lessons,
  carte: { available: carteAvailable, locked: false },
  exercice,
  erreurs,
})

describe('ce que la fiche dit de l’avancement', () => {
  test('coche le COURS quand la leçon a été terminée', () => {
    // Le seul jalon que l'élève pose lui-même. Il valait `false` en dur : sous
    // une fiche dépliée, aucun des six supports ne portait jamais de marque, et
    // on ne pouvait pas savoir ce qu'on avait déjà fait sans tout rouvrir.
    const nonLue = buildChapterSupports(input([lesson({ id: 'l1' })]))
    expect(nonLue.find((c) => c.kind === 'cours')?.done).toBe(false)

    const lue = buildChapterSupports(input([lesson({ id: 'l1', read: true })]))
    expect(lue.find((c) => c.kind === 'cours')?.done).toBe(true)
  })

  test('coche le QUIZ à partir du seuil de maîtrise, pas avant', () => {
    const rate = buildChapterSupports(
      input([lesson({ id: 'l1', best: { score: 5, total: 10, ratio: 0.5 } })]),
    )
    expect(rate.find((c) => c.kind === 'quiz')?.done).toBe(false)

    const reussi = buildChapterSupports(
      input([lesson({ id: 'l1', best: { score: 9, total: 10, ratio: 0.9 } })]),
    )
    expect(reussi.find((c) => c.kind === 'quiz')?.done).toBe(true)
  })

  test('DIT le score du quiz, et dit aussi qu’on n’a pas essayé', () => {
    // « --/10 » n'est pas un trou : c'est l'information « jamais tenté », et
    // c'est elle qui manquait le plus sous une fiche dépliée.
    const jamais = buildChapterSupports(input([lesson({ id: 'l1' })]))
    expect(jamais.find((c) => c.kind === 'quiz')?.badge).toBe('--/10')

    const tente = buildChapterSupports(
      input([lesson({ id: 'l1', best: { score: 7, total: 10, ratio: 0.7 } })]),
    )
    expect(tente.find((c) => c.kind === 'quiz')?.badge).toBe('7/10')
  })

  test('NE COCHE JAMAIS les flashcards, même quand rien n’est dû', () => {
    // Un paquet jamais ouvert et un paquet à jour ont le même `dueCount` : 0.
    // Cocher sur cette base afficherait « à jour » sur des cartes jamais vues.
    const chips = buildChapterSupports(
      input([lesson({ id: 'l1', dueCount: 0 })]),
    )
    const cartes = chips.find((c) => c.kind === 'flashcards')
    expect(cartes?.done).toBe(false)
    // Le badge, lui, dit l'état sans mentir.
    expect(cartes?.badge).toBe('10 cartes')
  })

  test('coche l’EXERCICE à partir du seuil de maîtrise, comme le quiz', () => {
    const moyen = buildChapterSupports(
      input([lesson({ id: 'l1' })], true, 0, {
        best: { note: 12, sur: 20 },
        premium: true,
      }),
    )
    expect(moyen.find((c) => c.kind === 'exercice')?.done).toBe(false)
    expect(moyen.find((c) => c.kind === 'exercice')?.badge).toBe('12/20')

    const bon = buildChapterSupports(
      input([lesson({ id: 'l1' })], true, 0, {
        best: { note: 16, sur: 20 },
        premium: true,
      }),
    )
    expect(bon.find((c) => c.kind === 'exercice')?.done).toBe(true)
  })
})

describe('buildChapterSupports', () => {
  test('les supports, dans l’ordre des trois groupes : apprendre · mémoriser · se tester', () => {
    // Cours et Fiche (apprendre), Flashcards (mémoriser), Quiz · Exercice ·
    // Moi vs IA (se tester). C'est l'ordre que suit la fiche dépliée, qui ne
    // connaît pas les groupes.
    const chips = buildChapterSupports(input([lesson({ id: 'l1' })]))
    expect(chips.map((c) => c.kind)).toEqual([
      'cours',
      'carte',
      'flashcards',
      'quiz',
      'exercice',
      'ia',
    ])
  })

  test('pas de carte mentale quand le chapitre n’en a pas', () => {
    const chips = buildChapterSupports(input([lesson({ id: 'l1' })], false))
    expect(chips.map((c) => c.kind)).toEqual([
      'cours',
      'flashcards',
      'quiz',
      'exercice',
      'ia',
    ])
  })

  test('un chapitre sans quiz garde son cours — et son exercice, qui se rédige sur le cours', () => {
    const chips = buildChapterSupports(
      input(
        [lesson({ id: 'l1', quizId: null, questionCount: 0, ownQuiz: false })],
        false,
      ),
    )
    expect(chips.map((c) => c.kind)).toEqual(['cours', 'exercice', 'ia'])
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
    // Les flashcards, elles, se jouent sur le quiz emprunté.
    expect(chips.map((c) => c.kind)).toEqual([
      'cours',
      'flashcards',
      'exercice',
      'ia',
    ])
  })

  test('la leçon lue épingle les supports du pied de cours', () => {
    const chips = buildChapterSupports(
      input([
        lesson({ id: 'l1', best: { score: 4, total: 10, ratio: 0.4 } }),
        lesson({ id: 'l2', dueCount: 3 }),
      ]),
      'l2',
    )
    expect(chips.find((c) => c.kind === 'quiz')?.href).toBe('/test/q-l2')
    expect(chips.find((c) => c.kind === 'flashcards')?.meta).toBe(
      '10 cartes · 3 à revoir',
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
      exercice: { best: null, premium: true },
      erreurs: 0,
    })
    const carte = chips.find((c) => c.kind === 'carte')
    expect(carte?.locked).toBe(true)
    expect(carte?.meta).toBe('Débloquer')
  })

  test('l’exercice est du CHAPITRE, coiffé de la couronne, verrouillé sans abonnement', () => {
    const sans = buildChapterSupports(
      input([lesson({ id: 'l1' })], true, 0, { best: null, premium: false }),
    )
    const exercice = sans.find((c) => c.kind === 'exercice')
    expect(exercice?.href).toBe('/reviser/anglais/ch1/exercice')
    expect(exercice?.premium).toBe(true)
    expect(exercice?.locked).toBe(true)
    expect(exercice?.meta).toBe('Jamais tenté')
    expect(exercice?.badge).toBe('--/20')

    const avec = buildChapterSupports(input([lesson({ id: 'l1' })]))
    expect(avec.find((c) => c.kind === 'exercice')?.locked).toBe(false)
  })

  test('« Moi vs IA » est un bloc réservé : « Bientôt », sans destination', () => {
    const chips = buildChapterSupports(input([lesson({ id: 'l1' })]))
    const ia = chips.find((c) => c.kind === 'ia')
    expect(ia?.bientot).toBe(true)
    expect(ia?.premium).toBe(true)
    expect(ia?.badge).toBe('Bientôt')
    expect(ia?.href).toBe('')
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
    // Elle vit dans MÉMORISER, juste après les flashcards : on corrige ce
    // qu'on a mal retenu, avant d'aller se tester.
    expect(chips.map((c) => c.kind)).toEqual([
      'cours',
      'carte',
      'flashcards',
      'erreurs',
      'quiz',
      'exercice',
      'ia',
    ])
  })

  test('ne promet plus d’XP sur un geste qui n’en paye plus', () => {
    // Les tuiles annonçaient « +20 XP », « +10 XP », « +25 XP ». Depuis que
    // l'XP se gagne sur l'ACQUIS (lib/wallet.XP_AWARDS), ces gestes n'en
    // versent plus directement : le quiz paye par les COURONNES qu'il allume,
    // les flashcards par les cartes qu'elles font passer en « acquise ».
    // Afficher un chiffre ici serait devenu une promesse fausse — et une
    // promesse fausse sur une récompense se paye cher en confiance.
    const chips = buildChapterSupports(input([lesson({ id: 'l1' })]))
    expect(chips.find((c) => c.kind === 'quiz')?.xp).toBeUndefined()
    expect(chips.find((c) => c.kind === 'flashcards')?.xp).toBeUndefined()
    expect(chips.find((c) => c.kind === 'exercice')?.xp).toBeUndefined()
    expect(chips.find((c) => c.kind === 'carte')?.xp).toBeUndefined()
  })
})
