import { describe, expect, test } from 'vitest'
import {
  buildCourseTree,
  canMoveChapter,
  canonicalAnswer,
  chapterDepth,
  computeCourseStats,
  emptyQuestionContent,
  gradeLibre,
  gradeQcm,
  gradeTrous,
  gradeVraiFaux,
  isQuestionReady,
  isQuestionType,
  normalizeCourseColor,
  normalizeCourseIcon,
  normalizeDescription,
  normalizeQcm,
  normalizeQuestionContent,
  normalizeTitle,
  parseTrous,
  questionSummary,
  sessionQuestions,
  trousAnswers,
  type CourseChapter,
  type CourseQuestion,
  type QcmContent,
} from './carnet-cours'

// ------------------------------------------------------------ normalisation

describe('normalizeTitle', () => {
  test('rogne, borne et ne renvoie jamais vide', () => {
    expect(normalizeTitle('  Anglais 3e  ')).toBe('Anglais 3e')
    expect(normalizeTitle('')).toBe('Sans titre')
    expect(normalizeTitle(42)).toBe('Sans titre')
    expect(normalizeTitle('x'.repeat(500)).length).toBe(120)
  })

  test('accepte un repli personnalisé', () => {
    expect(normalizeTitle('', 'Nouveau chapitre')).toBe('Nouveau chapitre')
  })
})

describe('normalizeDescription', () => {
  test('null quand vide, texte rogné sinon', () => {
    expect(normalizeDescription('   ')).toBeNull()
    expect(normalizeDescription(' intro ')).toBe('intro')
  })
})

describe('normalizeCourseColor / normalizeCourseIcon', () => {
  test('retombe sur les valeurs par défaut', () => {
    expect(normalizeCourseColor('menthe')).toBe('menthe')
    expect(normalizeCourseColor('rouge-vif')).toBe('violet')
    expect(normalizeCourseIcon('languages')).toBe('languages')
    expect(normalizeCourseIcon('nimporte')).toBe('book-open')
  })
})

describe('normalizeQcm', () => {
  test('filtre les choix vides sans inventer de bonne réponse', () => {
    const qcm = normalizeQcm({
      enonce: 'Capitale de la France ?',
      choix: [
        { texte: 'Paris', correct: false },
        { texte: '', correct: true },
        { texte: 'Lyon', correct: false },
      ],
    })
    expect(qcm.choix).toHaveLength(2)
    // Le choix coché était le choix VIDE : il disparaît, et rien ne le
    // remplace. Cocher la 1re option d'office fabriquait un corrigé — ici
    // « Paris », par chance juste ; sur « Lyon / Paris » ç'aurait été faux.
    expect(qcm.choix[0]).toEqual({ texte: 'Paris', correct: false })
  })

  test('un QCM sans bonne réponse n’est jamais « réussi », même en ne cochant rien', () => {
    // Deux ensembles vides sont égaux : sans ce garde-fou, ne rien cocher
    // validait la question. `recordAttempt` corrige sans passer par
    // `isQuestionReady`, donc le flux « brouillon hors session » ne suffit pas.
    const sansCorrige = normalizeQcm({
      enonce: 'Capitale de la France ?',
      choix: [
        { texte: 'Lyon', correct: false },
        { texte: 'Paris', correct: false },
      ],
    })
    expect(gradeQcm(sansCorrige, [])).toBe(false)
    expect(gradeQcm(sansCorrige, [1])).toBe(false)
  })

  test('une question sans bonne réponse cochée est un BROUILLON, pas une question fausse', () => {
    const content = normalizeQcm({
      enonce: 'Capitale de la France ?',
      choix: [
        { texte: 'Lyon', correct: false },
        { texte: 'Paris', correct: false },
      ],
    })
    // `isQuestionReady` refuse : la question sort donc des sessions de
    // révision (cf. `sessionQuestions`) au lieu d'y être comptée fausse à
    // chaque passage.
    expect(isQuestionReady('qcm', content)).toBe(false)
    expect(sessionQuestions([], [{ id: 'q1', chapterId: null, type: 'qcm', position: 0, content }], null)).toEqual([])
  })

  test('feedback vide → null', () => {
    expect(normalizeQcm({ feedback: '  ' }).feedback).toBeNull()
    expect(normalizeQcm({ feedback: 'Bien vu' }).feedback).toBe('Bien vu')
  })
})

describe('normalizeQuestionContent / emptyQuestionContent', () => {
  test('chaque type produit sa forme', () => {
    for (const type of [
      'qcm',
      'flashcard',
      'vrai_faux',
      'texte_a_trous',
      'reponse_libre',
    ] as const) {
      expect(isQuestionType(type)).toBe(true)
      const empty = emptyQuestionContent(type)
      // La normalisation d'un contenu vide reste stable (pas d'invention).
      const renorm = normalizeQuestionContent(type, empty)
      if (type === 'qcm') {
        // Les choix vides du gabarit sont filtrés à l'enregistrement.
        expect((renorm as QcmContent).choix).toHaveLength(0)
      } else {
        expect(renorm).toEqual(empty)
      }
    }
    expect(isQuestionType('essai')).toBe(false)
  })

  test('flashcard : langues inconnues → null', () => {
    const c = normalizeQuestionContent('flashcard', {
      recto: 'dog',
      verso: 'chien',
      langue_recto: 'en',
      langue_verso: 'klingon',
    })
    expect(c).toEqual({
      recto: 'dog',
      verso: 'chien',
      langue_recto: 'en',
      langue_verso: null,
    })
  })

  test('réponse libre : réponses vides filtrées', () => {
    const c = normalizeQuestionContent('reponse_libre', {
      enonce: '8 × 7 ?',
      reponses: [' 56 ', '', 'cinquante-six'],
    })
    expect(c).toEqual({ enonce: '8 × 7 ?', reponses: ['56', 'cinquante-six'] })
  })
})

// ------------------------------------------------------------ texte à trous

describe('parseTrous', () => {
  test('découpe texte et trous dans l’ordre', () => {
    expect(parseTrous('La [Seine] traverse [Paris].')).toEqual([
      { type: 'texte', valeur: 'La ' },
      { type: 'trou', valeur: 'Seine' },
      { type: 'texte', valeur: ' traverse ' },
      { type: 'trou', valeur: 'Paris' },
      { type: 'texte', valeur: '.' },
    ])
  })

  test('crochets vides ou non fermés : pas de trou', () => {
    // Un crochet vide reste du texte tel quel (aucun trou créé).
    expect(parseTrous('a [] b')).toEqual([
      { type: 'texte', valeur: 'a [] b' },
    ])
    expect(trousAnswers('rien [ici')).toEqual([])
  })
})

// ---------------------------------------------------------------- correction

describe('canonicalAnswer', () => {
  test('minuscules, accents retirés, espaces réduits', () => {
    expect(canonicalAnswer('  École   Élève ')).toBe('ecole eleve')
  })
})

describe('gradeQcm', () => {
  const qcm: QcmContent = {
    enonce: 'Sélectionne les voyelles',
    choix: [
      { texte: 'a', correct: true },
      { texte: 'b', correct: false },
      { texte: 'e', correct: true },
    ],
    feedback: null,
  }

  test('vrai si l’ensemble coché égale l’ensemble correct', () => {
    expect(gradeQcm(qcm, [0, 2])).toBe(true)
    expect(gradeQcm(qcm, [2, 0])).toBe(true)
  })

  test('faux si en trop, manquant ou hors bornes', () => {
    expect(gradeQcm(qcm, [0])).toBe(false)
    expect(gradeQcm(qcm, [0, 1, 2])).toBe(false)
    expect(gradeQcm(qcm, [0, 2, 99])).toBe(false)
  })
})

describe('gradeVraiFaux', () => {
  test('compare au booléen attendu', () => {
    expect(
      gradeVraiFaux({ enonce: 'x', reponse: true, feedback: null }, true),
    ).toBe(true)
    expect(
      gradeVraiFaux({ enonce: 'x', reponse: true, feedback: null }, false),
    ).toBe(false)
  })
})

describe('gradeTrous', () => {
  const content = { texte: 'La [Seine] traverse [Paris].' }

  test('tolérant aux accents et à la casse', () => {
    expect(gradeTrous(content, ['seine', 'PARIS'])).toBe(true)
  })

  test('faux si mauvais mot, mauvais compte ou aucun trou', () => {
    expect(gradeTrous(content, ['Loire', 'Paris'])).toBe(false)
    expect(gradeTrous(content, ['Seine'])).toBe(false)
    expect(gradeTrous({ texte: 'sans trou' }, [])).toBe(false)
  })
})

describe('gradeLibre', () => {
  const content = { enonce: '8 × 7 ?', reponses: ['56', 'cinquante-six'] }

  test('accepte toute réponse acceptée, en forme canonique', () => {
    expect(gradeLibre(content, ' 56')).toBe(true)
    expect(gradeLibre(content, 'Cinquante-Six')).toBe(true)
  })

  test('refuse le vide et les mauvaises réponses', () => {
    expect(gradeLibre(content, '')).toBe(false)
    expect(gradeLibre(content, '54')).toBe(false)
  })
})

// ------------------------------------------------------------------- complétude

describe('isQuestionReady', () => {
  test('QCM prêt : énoncé + 2 choix + une bonne réponse', () => {
    expect(isQuestionReady('qcm', emptyQuestionContent('qcm'))).toBe(false)
    expect(
      isQuestionReady('qcm', {
        enonce: 'Q',
        choix: [
          { texte: 'a', correct: true },
          { texte: 'b', correct: false },
        ],
        feedback: null,
      }),
    ).toBe(true)
  })

  test('texte à trous prêt : au moins un trou', () => {
    expect(isQuestionReady('texte_a_trous', { texte: 'aucun' })).toBe(false)
    expect(isQuestionReady('texte_a_trous', { texte: 'un [trou]' })).toBe(true)
  })

  test('flashcard prête : recto ET verso', () => {
    expect(
      isQuestionReady('flashcard', {
        recto: 'dog',
        verso: '',
        langue_recto: null,
        langue_verso: null,
      }),
    ).toBe(false)
  })
})

describe('questionSummary', () => {
  test('trous affichés en ___ et replis lisibles', () => {
    expect(questionSummary('texte_a_trous', { texte: 'La [Seine] coule' })).toBe(
      'La ___ coule',
    )
    expect(questionSummary('qcm', emptyQuestionContent('qcm'))).toBe(
      'Question vide',
    )
  })
})

// ---------------------------------------------------------------------- arbre

const chapter = (
  id: string,
  parent: string | null,
  position = 0,
): CourseChapter => ({
  id,
  parentChapterId: parent,
  title: id,
  position,
})

const question = (
  id: string,
  chapterId: string | null,
  position = 0,
): CourseQuestion => ({
  id,
  chapterId,
  type: 'vrai_faux',
  position,
  content: { enonce: `Q${id}`, reponse: true, feedback: null },
})

describe('buildCourseTree', () => {
  test('imbrique, trie par position et compte les questions descendantes', () => {
    const chapters = [
      chapter('b', null, 1),
      chapter('a', null, 0),
      chapter('a1', 'a', 0),
    ]
    const questions = [
      question('q-root', null, 0),
      question('q-a', 'a', 1),
      question('q-a-first', 'a', 0),
      question('q-a1', 'a1', 0),
    ]
    const { chapters: tree, rootQuestions } = buildCourseTree(
      chapters,
      questions,
    )
    expect(tree.map((c) => c.id)).toEqual(['a', 'b'])
    expect(tree[0].children.map((c) => c.id)).toEqual(['a1'])
    expect(tree[0].questions.map((q) => q.id)).toEqual(['q-a-first', 'q-a'])
    expect(tree[0].totalQuestions).toBe(3)
    expect(tree[1].totalQuestions).toBe(0)
    expect(rootQuestions.map((q) => q.id)).toEqual(['q-root'])
  })

  test('chapitre orphelin rattaché à la racine, question orpheline à la racine', () => {
    const { chapters: tree, rootQuestions } = buildCourseTree(
      [chapter('perdu', 'inexistant')],
      [question('q', 'nulle-part')],
    )
    expect(tree.map((c) => c.id)).toEqual(['perdu'])
    expect(rootQuestions.map((q) => q.id)).toEqual(['q'])
  })
})

describe('chapterDepth / canMoveChapter', () => {
  const chapters = [
    chapter('racine', null),
    chapter('enfant', 'racine'),
    chapter('petit', 'enfant'),
    chapter('autre', null),
  ]

  test('profondeurs', () => {
    expect(chapterDepth(chapters, 'racine')).toBe(1)
    expect(chapterDepth(chapters, 'enfant')).toBe(2)
    expect(chapterDepth(chapters, 'petit')).toBe(3)
  })

  test('interdit les cycles (sous soi-même ou un descendant)', () => {
    expect(canMoveChapter(chapters, 'racine', 'racine')).toBe(false)
    expect(canMoveChapter(chapters, 'racine', 'petit')).toBe(false)
  })

  test('interdit de dépasser la profondeur max', () => {
    // « racine » a une hauteur de 3 : impossible sous quoi que ce soit.
    expect(canMoveChapter(chapters, 'racine', 'autre')).toBe(false)
    // « petit » (feuille) peut aller sous « enfant » mais pas sous « petit ».
    expect(canMoveChapter(chapters, 'autre', 'enfant')).toBe(true)
    expect(canMoveChapter(chapters, 'autre', 'petit')).toBe(false)
  })

  test('retour à la racine toujours permis', () => {
    expect(canMoveChapter(chapters, 'petit', null)).toBe(true)
  })
})

// ----------------------------------------------------------------- statistiques

describe('computeCourseStats', () => {
  test('le dernier essai décide de l’état de chaque question', () => {
    const stats = computeCourseStats(
      ['q1', 'q2', 'q3'],
      [
        { questionId: 'q1', isCorrect: false, answeredAt: '2026-07-01' },
        { questionId: 'q1', isCorrect: true, answeredAt: '2026-07-02' },
        { questionId: 'q2', isCorrect: false, answeredAt: '2026-07-02' },
      ],
    )
    expect(stats).toEqual({
      totalAttempts: 3,
      correctAttempts: 1,
      successPct: 33,
      neverSeen: 1,
      struggling: 1,
      mastered: 1,
    })
  })

  test('aucune tentative → successPct null', () => {
    expect(computeCourseStats(['q1'], []).successPct).toBeNull()
  })
})

// ----------------------------------------------------------- file de session

describe('sessionQuestions', () => {
  const chapters = [chapter('a', null, 0), chapter('a1', 'a', 0)]
  const questions = [
    question('racine', null, 0),
    question('dans-a', 'a', 0),
    question('dans-a1', 'a1', 0),
  ]

  test('tout le cours : racine puis parcours en profondeur', () => {
    expect(
      sessionQuestions(chapters, questions, null).map((q) => q.id),
    ).toEqual(['racine', 'dans-a', 'dans-a1'])
  })

  test('un chapitre : ses questions + celles de ses descendants', () => {
    expect(sessionQuestions(chapters, questions, 'a').map((q) => q.id)).toEqual(
      ['dans-a', 'dans-a1'],
    )
    expect(
      sessionQuestions(chapters, questions, 'a1').map((q) => q.id),
    ).toEqual(['dans-a1'])
  })

  test('les brouillons sont exclus', () => {
    const draft: CourseQuestion = {
      id: 'brouillon',
      chapterId: null,
      type: 'qcm',
      position: 5,
      content: emptyQuestionContent('qcm'),
    }
    expect(
      sessionQuestions(chapters, [...questions, draft], null).map((q) => q.id),
    ).not.toContain('brouillon')
  })
})
