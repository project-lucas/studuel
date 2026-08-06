import { describe, expect, test } from 'vitest'
import {
  carteMeta,
  chapterStatus,
  chapterValue,
  countWords,
  crowns,
  defiMeta,
  defiTitle,
  estimateMinutes,
  examBannerOnTop,
  flashcardsBadge,
  flashcardsMeta,
  groupChaptersByTheme,
  minutesLabel,
  modeFromParam,
  modesFor,
  openGroupIndex,
  quizBadge,
  quizMeta,
  resumeCta,
  subjectProgress,
  type ChapterRow,
} from './subject-template'

describe('chapterValue', () => {
  test('vaut 0 sans aucune activité', () => {
    expect(chapterValue({ bestQuizRatio: null, lessonDone: false })).toBe(0)
  })

  test('prend le meilleur ratio de quiz', () => {
    expect(chapterValue({ bestQuizRatio: 0.7, lessonDone: false })).toBe(0.7)
  })

  test('applique le plancher de 30 % quand une leçon est terminée', () => {
    expect(chapterValue({ bestQuizRatio: null, lessonDone: true })).toBe(0.3)
    expect(chapterValue({ bestQuizRatio: 0.1, lessonDone: true })).toBe(0.3)
  })

  test('le plancher ne rabaisse jamais un bon score', () => {
    expect(chapterValue({ bestQuizRatio: 0.9, lessonDone: true })).toBe(0.9)
  })

  test('borne la valeur entre 0 et 1', () => {
    expect(chapterValue({ bestQuizRatio: 1.4, lessonDone: false })).toBe(1)
    expect(chapterValue({ bestQuizRatio: -0.2, lessonDone: false })).toBe(0)
  })
})

describe('chapterStatus', () => {
  test('non commencé à zéro', () => {
    expect(chapterStatus(0)).toBe('non_commence')
  })

  test('en cours dès la moindre activité', () => {
    expect(chapterStatus(0.1)).toBe('en_cours')
    expect(chapterStatus(0.79)).toBe('en_cours')
  })

  test('complété à partir de 80 %', () => {
    expect(chapterStatus(0.8)).toBe('complete')
    expect(chapterStatus(1)).toBe('complete')
  })
})

describe('crowns', () => {
  test('0 couronne sans activité', () => {
    expect(crowns(0)).toBe(0)
  })

  test('paliers 30 % / 60 % / 80 %', () => {
    expect(crowns(0.29)).toBe(0)
    expect(crowns(0.3)).toBe(1)
    expect(crowns(0.6)).toBe(2)
    expect(crowns(0.8)).toBe(3)
    expect(crowns(1)).toBe(3)
  })
})

describe('subjectProgress', () => {
  test('matière vide → 0/0 · 0 %', () => {
    expect(subjectProgress([])).toEqual({ done: 0, total: 0, pct: 0 })
  })

  test('compte les chapitres complétés et la moyenne', () => {
    expect(subjectProgress([1, 0.8, 0.4, 0])).toEqual({
      done: 2,
      total: 4,
      pct: 55,
    })
  })
})

describe('resumeCta', () => {
  test('« Commencer » sur le premier chapitre d’un élève neuf', () => {
    expect(
      resumeCta([
        { id: 'a', status: 'non_commence' },
        { id: 'b', status: 'non_commence' },
      ]),
    ).toEqual({ chapterId: 'a', label: 'Commencer' })
  })

  test('« Reprendre » sur le chapitre entamé, même s’il n’est pas le premier', () => {
    expect(
      resumeCta([
        { id: 'a', status: 'complete' },
        { id: 'b', status: 'en_cours' },
        { id: 'c', status: 'non_commence' },
      ]),
    ).toEqual({ chapterId: 'b', label: 'Reprendre' })
  })

  test('un chapitre entamé passe devant un chapitre neuf plus haut dans la liste', () => {
    expect(
      resumeCta([
        { id: 'a', status: 'non_commence' },
        { id: 'b', status: 'en_cours' },
      ]),
    ).toEqual({ chapterId: 'b', label: 'Reprendre' })
  })

  test('aucun CTA quand tout est complété', () => {
    expect(resumeCta([{ id: 'a', status: 'complete' }])).toBeNull()
  })

  test('aucun CTA sans chapitre', () => {
    expect(resumeCta([])).toBeNull()
  })
})

describe('modeFromParam', () => {
  const tabs = modesFor('Tle')
  const sansExamen = modesFor('4e')

  test('accepte les onglets courants', () => {
    expect(modeFromParam('jeu', tabs)).toBe('jeu')
    expect(modeFromParam('programme', tabs)).toBe('programme')
    expect(modeFromParam('annales', tabs)).toBe('annales')
  })

  test('les anciennes clés de format retombent sur « Mode de jeu »', () => {
    expect(modeFromParam('boss', tabs)).toBe('jeu')
    expect(modeFromParam('quiz', tabs)).toBe('jeu')
    expect(modeFromParam('flashcards', tabs)).toBe('jeu')
    expect(modeFromParam('cartes', tabs)).toBe('jeu')
    expect(modeFromParam('defis', tabs)).toBe('jeu')
  })

  test('les noms d’onglets d’avant le renommage restent valides', () => {
    expect(modeFromParam('chapitres', tabs)).toBe('programme')
    expect(modeFromParam('entrainement', tabs)).toBe('jeu')
  })

  test('« erreurs », qui n’a plus d’onglet, retombe sur le programme', () => {
    expect(modeFromParam('erreurs', tabs)).toBe('programme')
  })

  test('un onglet que la classe n’a pas ne s’ouvre pas', () => {
    expect(modeFromParam('annales', sansExamen)).toBeUndefined()
  })

  test('undefined pour une valeur inconnue ou absente', () => {
    expect(modeFromParam('nawak', tabs)).toBeUndefined()
    expect(modeFromParam(undefined, tabs)).toBeUndefined()
  })
})

describe('modesFor', () => {
  test('deux onglets les années sans examen', () => {
    expect(modesFor('4e').map((m) => m.key)).toEqual(['programme', 'jeu'])
    expect(modesFor('2de').map((m) => m.key)).toEqual(['programme', 'jeu'])
  })

  test('« Annales » s’ajoute en 3e, 1re et Tle', () => {
    for (const grade of ['3e', '1re', 'Tle']) {
      expect(modesFor(grade).map((m) => m.key)).toEqual([
        'programme',
        'jeu',
        'annales',
      ])
    }
  })

  test('sans classe connue, on reste sur les deux onglets sûrs', () => {
    expect(modesFor(null).map((m) => m.key)).toEqual(['programme', 'jeu'])
  })
})

describe('estimateMinutes', () => {
  test('null quand il n’y a rien à estimer', () => {
    expect(estimateMinutes({ words: 0, questions: 0 })).toBeNull()
  })

  test('temps de lecture à 180 mots/minute', () => {
    expect(estimateMinutes({ words: 900, questions: 0 })).toBe(5)
  })

  test('30 secondes par question', () => {
    expect(estimateMinutes({ words: 0, questions: 10 })).toBe(5)
  })

  test('jamais moins d’une minute quand il y a du contenu', () => {
    expect(estimateMinutes({ words: 12, questions: 0 })).toBe(1)
  })

  test('cumule lecture et questions', () => {
    expect(estimateMinutes({ words: 540, questions: 6 })).toBe(6)
  })
})

describe('minutesLabel', () => {
  test('annonce une estimation, pas une promesse', () => {
    expect(minutesLabel(6)).toBe('~6 min')
  })
})

describe('countWords', () => {
  test('compte les mots d’un cours', () => {
    expect(countWords('Le chat dort  sur   le tapis')).toBe(6)
  })

  test('0 pour un contenu vide ou absent', () => {
    expect(countWords('')).toBe(0)
    expect(countWords('   ')).toBe(0)
    expect(countWords(null)).toBe(0)
    expect(countWords(undefined)).toBe(0)
  })
})

describe('examBannerOnTop', () => {
  test('en tête dès 30 % de la matière', () => {
    expect(examBannerOnTop(30, null)).toBe(true)
    expect(examBannerOnTop(29, null)).toBe(false)
  })

  test('en tête quand un contrôle approche, même à 0 %', () => {
    expect(examBannerOnTop(0, 14)).toBe(true)
    expect(examBannerOnTop(0, 15)).toBe(false)
  })
})

const row = (
  id: string,
  theme: string | null,
  position: number,
): ChapterRow => ({
  id,
  position,
  title: `Chapitre ${position}`,
  status: 'non_commence',
  crowns: 0,
  href: `/reviser/anglais/${id}`,
  examHint: null,
  minutes: null,
  theme,
})

describe('groupChaptersByTheme', () => {
  test('aucun groupe sans chapitre', () => {
    expect(groupChaptersByTheme([])).toEqual([])
  })

  test('un seul groupe anonyme quand la base n’a aucun thème', () => {
    const chapters = [row('a', null, 1), row('b', null, 2)]
    expect(groupChaptersByTheme(chapters)).toEqual([
      { theme: null, chapters },
    ])
  })

  test('un groupe par thème, dans l’ordre d’apparition', () => {
    const groups = groupChaptersByTheme([
      row('a', 'Axe 1', 1),
      row('b', 'Axe 1', 2),
      row('c', 'Axe 2', 3),
    ])
    expect(groups.map((g) => g.theme)).toEqual(['Axe 1', 'Axe 2'])
    expect(groups[0].chapters.map((c) => c.id)).toEqual(['a', 'b'])
    expect(groups[1].chapters.map((c) => c.id)).toEqual(['c'])
  })

  test('regroupe un thème même s’il revient plus loin dans le programme', () => {
    const groups = groupChaptersByTheme([
      row('a', 'Axe 1', 1),
      row('b', 'Axe 2', 2),
      row('c', 'Axe 1', 3),
    ])
    expect(groups).toHaveLength(2)
    expect(groups[0].chapters.map((c) => c.id)).toEqual(['a', 'c'])
  })

  test('les chapitres sans thème d’une matière qui en a gardent leur groupe', () => {
    const groups = groupChaptersByTheme([
      row('a', 'Axe 1', 1),
      row('b', null, 2),
    ])
    expect(groups.map((g) => g.theme)).toEqual(['Axe 1', null])
  })
})

describe('openGroupIndex', () => {
  const groups = groupChaptersByTheme([
    row('a', 'Axe 1', 1),
    row('b', 'Axe 2', 2),
  ])

  test('ouvre le groupe du chapitre à reprendre', () => {
    expect(openGroupIndex(groups, { chapterId: 'b', label: 'Reprendre' })).toBe(1)
  })

  test('ouvre le premier groupe sans CTA', () => {
    expect(openGroupIndex(groups, null)).toBe(0)
  })

  test('ouvre le premier groupe si le chapitre est introuvable', () => {
    expect(openGroupIndex(groups, { chapterId: 'zzz', label: 'Reprendre' })).toBe(0)
  })
})

describe('quizMeta', () => {
  test('meilleur essai quand le quiz a été joué', () => {
    expect(quizMeta({ score: 7, total: 10 })).toBe('7/10')
  })

  test('« Jamais tenté » sinon', () => {
    expect(quizMeta(null)).toBe('Jamais tenté')
  })

  test('un essai à total nul ne compte pas', () => {
    expect(quizMeta({ score: 0, total: 0 })).toBe('Jamais tenté')
  })
})

describe('flashcardsMeta', () => {
  test('cartes seules', () => {
    expect(flashcardsMeta(12, 0)).toBe('12 cartes')
    expect(flashcardsMeta(1, 0)).toBe('1 carte')
  })

  test('avec la file à revoir', () => {
    expect(flashcardsMeta(12, 4)).toBe('12 cartes · 4 à revoir')
  })
})

describe('quizBadge', () => {
  test('le score quand le quiz a été joué', () => {
    expect(quizBadge({ score: 7, total: 10 }, 10)).toBe('7/10')
  })

  test('le barème en attente sinon — « --/10 »', () => {
    expect(quizBadge(null, 10)).toBe('--/10')
  })

  test('rien à annoncer sans question', () => {
    expect(quizBadge(null, 0)).toBeNull()
  })
})

describe('flashcardsBadge', () => {
  test('la file du jour passe devant le paquet', () => {
    expect(flashcardsBadge(12, 4)).toBe('4 à revoir')
  })

  test('le paquet quand rien n’est dû', () => {
    expect(flashcardsBadge(12, 0)).toBe('12 cartes')
    expect(flashcardsBadge(1, 0)).toBe('1 carte')
  })

  test('rien à annoncer sans carte', () => {
    expect(flashcardsBadge(0, 0)).toBeNull()
  })
})

describe('defiTitle', () => {
  test('nomme l’item « Défi · N questions », pluriel compris', () => {
    expect(defiTitle(1)).toBe('Défi · 1 question')
    expect(defiTitle(10)).toBe('Défi · 10 questions')
  })
})

describe('defiMeta', () => {
  test('dit si le défi a déjà été relevé', () => {
    expect(defiMeta(false)).toBe('Jamais tenté')
    expect(defiMeta(true)).toBe('Relevé')
  })
})

describe('carteMeta', () => {
  test('« Débloquer » quand le chapitre est verrouillé', () => {
    expect(carteMeta(true)).toBe('Débloquer')
  })

  test('« Vue d’ensemble » quand la carte est accessible', () => {
    expect(carteMeta(false)).toBe('Vue d’ensemble')
  })
})
