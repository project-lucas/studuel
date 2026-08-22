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
  catalogIsStale,
  chapterUnit,
  chaptersAreNumbered,
  disciplinesOf,
  groupChaptersByTheme,
  matchChapters,
  minutesLabel,
  modeFromParam,
  modesFor,
  openGroupIndex,
  quizBadge,
  searchKey,
  quizMeta,
  tabId,
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
  discipline: null,
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

describe('disciplinesOf', () => {
  test('aucune discipline sur une matière ordinaire', () => {
    expect(disciplinesOf([{ discipline: null }, { discipline: null }])).toEqual(
      [],
    )
  })

  test('une seule discipline ne se filtre pas', () => {
    expect(
      disciplinesOf([{ discipline: 'histoire' }, { discipline: 'histoire' }]),
    ).toEqual([])
  })

  test('deux disciplines, dans l’ordre du programme', () => {
    expect(
      disciplinesOf([
        { discipline: 'histoire' },
        { discipline: 'histoire' },
        { discipline: 'geographie' },
        { discipline: 'geographie' },
      ]),
    ).toEqual(['histoire', 'geographie'])
  })

  test('un chapitre sans discipline ne crée pas de groupe', () => {
    expect(
      disciplinesOf([
        { discipline: 'histoire' },
        { discipline: null },
        { discipline: 'geographie' },
      ]),
    ).toEqual(['histoire', 'geographie'])
  })
})

describe('modesFor et tabId — les matières à deux disciplines', () => {
  test('sans discipline : un onglet Programme, comme avant', () => {
    const tabs = modesFor('3e')
    expect(tabs.map((t) => t.label)).toEqual([
      'Programme',
      'Mode de jeu',
      'Annales',
    ])
    expect(tabs.every((t) => t.discipline === undefined)).toBe(true)
  })

  test('deux disciplines : Programme laisse place à un onglet par discipline', () => {
    const tabs = modesFor('Tle', ['histoire', 'geographie'])
    expect(tabs.map((t) => t.label)).toEqual([
      'Histoire',
      'Géographie',
      'Mode de jeu',
      'Annales',
    ])
    expect(tabs.map(tabId)).toEqual([
      'programme:histoire',
      'programme:geographie',
      'jeu',
      'annales',
    ])
  })

  test('une seule discipline ne dédouble rien', () => {
    expect(modesFor('Tle', ['histoire']).map((t) => t.label)).toEqual([
      'Programme',
      'Mode de jeu',
      'Annales',
    ])
  })

  test('l’identifiant complet ouvre son onglet', () => {
    const tabs = modesFor('Tle', ['histoire', 'geographie'])
    expect(modeFromParam('programme:geographie', tabs)).toBe(
      'programme:geographie',
    )
  })

  test('une clé seule ouvre le premier onglet qui la porte', () => {
    const tabs = modesFor('Tle', ['histoire', 'geographie'])
    expect(modeFromParam('programme', tabs)).toBe('programme:histoire')
  })

  test('les anciennes clés de format restent valides', () => {
    const tabs = modesFor('Tle', ['histoire', 'geographie'])
    expect(modeFromParam('boss', tabs)).toBe('jeu')
    expect(modeFromParam('erreurs', tabs)).toBe('programme:histoire')
  })

  test('une discipline inconnue n’ouvre rien', () => {
    const tabs = modesFor('Tle', ['histoire', 'geographie'])
    expect(modeFromParam('programme:svt', tabs)).toBeUndefined()
  })
})

describe('modesFor — les trois rayons du français', () => {
  test('programme, fiches et grammaire font trois onglets, dans l’ordre', () => {
    const tabs = modesFor('1re', ['programme', 'fiches', 'grammaire'])
    expect(tabs.map((t) => t.label)).toEqual([
      'Programme',
      'Fiches',
      'Grammaire',
      'Mode de jeu',
      'Annales',
    ])
    expect(tabs.map(tabId)).toEqual([
      'programme:programme',
      'programme:fiches',
      'programme:grammaire',
      'jeu',
      'annales',
    ])
  })

  test('l’ordre des onglets suit celui des chapitres, pas l’alphabet', () => {
    const chapitres = [
      { discipline: 'programme' },
      { discipline: 'programme' },
      { discipline: 'fiches' },
      { discipline: 'grammaire' },
    ]
    expect(disciplinesOf(chapitres)).toEqual([
      'programme',
      'fiches',
      'grammaire',
    ])
  })

  test('un lien ancien vers ?onglet=programme ouvre le rayon Programme', () => {
    const tabs = modesFor('1re', ['programme', 'fiches', 'grammaire'])
    expect(modeFromParam('programme', tabs)).toBe('programme:programme')
    expect(modeFromParam('programme:fiches', tabs)).toBe('programme:fiches')
  })
})

describe('chapterUnit', () => {
  test('une matière à plat compte ses lignes en chapitres', () => {
    expect(chapterUnit([row('a', null, 1), row('b', null, 2)])).toBe('chapitre')
  })

  test('une matière rangée compte ses lignes en fiches', () => {
    expect(chapterUnit([row('a', 'Le groupe verbal', 1)])).toBe('fiche')
  })

  test('un seul chapitre rangé suffit à changer le mot', () => {
    expect(chapterUnit([row('a', null, 1), row('b', 'Les temps', 2)])).toBe(
      'fiche',
    )
  })

  test('une matière vide reste comptée en chapitres', () => {
    expect(chapterUnit([])).toBe('chapitre')
  })
})

// Le défaut du 20/08/2026 : après la migration 249, le cache de 300 s servait
// les 3 fiches d'allemand supprimées, aucune ne survivait au filtre des
// fantômes, et la page annonçait « arrive bientôt » sur un dossier de 36 fiches.
describe('catalogIsStale', () => {
  const ids = (...v: string[]) => v.map((id) => ({ id }))

  test('un cache qui ignore un chapitre existant est périmé', () => {
    expect(catalogIsStale(ids('vieux'), ids('neuf1', 'neuf2'))).toBe(true)
  })

  test('un cache qui garde un mort en trop n’est pas périmé (le filtre suffit)', () => {
    expect(catalogIsStale(ids('a', 'b', 'mort'), ids('a', 'b'))).toBe(false)
  })

  test('deux listes identiques ne déclenchent rien', () => {
    expect(catalogIsStale(ids('a', 'b'), ids('a', 'b'))).toBe(false)
  })

  test('une base vide ne fait pas passer le cache pour périmé', () => {
    expect(catalogIsStale(ids('a'), [])).toBe(false)
  })
})

describe('chaptersAreNumbered', () => {
  test('la philosophie ne numérote pas ses notions', () => {
    expect(chaptersAreNumbered('philosophie')).toBe(false)
  })

  test('les autres matières gardent leur numérotation', () => {
    for (const slug of ['maths', 'histoire-geo', 'anglais', 'svt']) {
      expect(chaptersAreNumbered(slug)).toBe(true)
    }
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

describe('searchKey', () => {
  test('efface accents, casse et ponctuation', () => {
    expect(searchKey('« Le Bateau ivre », Arthur RIMBAUD')).toBe(
      'le bateau ivre arthur rimbaud',
    )
    expect(searchKey('À l’ombre des jeunes filles en fleurs')).toBe(
      'a l ombre des jeunes filles en fleurs',
    )
  })

  test('défait les ligatures que l’Unicode ne décompose pas', () => {
    // « cœur » n'est pas un « o » accentué : sans ce passage, l'élève qui tape
    // « coeur » ne trouve rien.
    expect(searchKey('Un cœur simple')).toBe('un coeur simple')
    expect(searchKey('Ex æquo')).toBe('ex aequo')
  })
})

describe('matchChapters', () => {
  const fiche = (title: string, theme: string | null = 'Fiches de lecture') => ({
    title,
    theme,
  })
  const rayon = [
    fiche('« Art », Yasmina Reza'),
    fiche('« Le Bateau ivre », Arthur Rimbaud'),
    fiche('« Un cœur simple », Gustave Flaubert'),
    fiche('Les mots de liaison', 'Grammaire'),
  ]

  test('une recherche vide rend la liste entière', () => {
    expect(matchChapters(rayon, '')).toEqual(rayon)
    expect(matchChapters(rayon, '   ')).toEqual(rayon)
  })

  test('tous les mots tapés doivent se retrouver, dans n’importe quel ordre', () => {
    expect(matchChapters(rayon, 'rimbaud bateau')).toEqual([rayon[1]])
    expect(matchChapters(rayon, 'bateau reza')).toEqual([])
  })

  test('cherche aussi dans le chapitre qui coiffe la ligne', () => {
    expect(matchChapters(rayon, 'grammaire')).toEqual([rayon[3]])
  })

  test('trouve à l’accent et à la ligature près', () => {
    expect(matchChapters(rayon, 'coeur')).toEqual([rayon[2]])
    expect(matchChapters(rayon, 'CŒUR')).toEqual([rayon[2]])
  })
})
