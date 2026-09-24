import { describe, expect, it } from 'vitest'
import {
  HAUTEUR_MIN_PCT,
  hauteursColonnes,
  libelleQuestions,
  lireRevisionParQuiz,
  matieresRevisees,
  nomCourtMatiere,
  plierSeances,
} from './matieres-revisees'

const MATIERES = [
  { id: 'm-maths', slug: 'maths', name: 'Mathématiques' },
  { id: 'm-fr', slug: 'francais', name: 'Français' },
  { id: 'm-hg', slug: 'histoire-geo', name: 'Histoire-Géographie' },
]

const quizLecon = new Map([
  ['q1', 'l1'],
  ['q2', 'l2'],
  ['q3', 'l3'],
  ['q-hors', 'l-hors'],
])
const leconChapitre = new Map([
  ['l1', 'c-maths'],
  ['l2', 'c-maths-2'],
  ['l3', 'c-fr'],
  ['l-hors', 'c-hors'],
])
const chapitreMatiere = new Map([
  ['c-maths', 'm-maths'],
  ['c-maths-2', 'm-maths'],
  ['c-fr', 'm-fr'],
])

describe('les matières que je révise le plus', () => {
  it('additionne les questions par matière et range de la plus travaillée à la moins travaillée', () => {
    const revisions = [
      { quizId: 'q1', seances: 2, questions: 20 },
      { quizId: 'q2', seances: 1, questions: 15 },
      { quizId: 'q3', seances: 5, questions: 50 },
    ]
    expect(matieresRevisees({ revisions, quizLecon, leconChapitre, chapitreMatiere, matieres: MATIERES })).toEqual([
      { subjectId: 'm-fr', slug: 'francais', nom: 'Français', questions: 50, seances: 5 },
      { subjectId: 'm-maths', slug: 'maths', nom: 'Mathématiques', questions: 35, seances: 3 },
    ])
  })

  it('ignore les quiz hors du périmètre et les matières jamais révisées', () => {
    const revisions = [
      { quizId: 'q-hors', seances: 9, questions: 90 },
      { quizId: 'inconnu', seances: 1, questions: 10 },
    ]
    expect(matieresRevisees({ revisions, quizLecon, leconChapitre, chapitreMatiere, matieres: MATIERES })).toEqual([])
  })

  it('départage une égalité par l’ordre du catalogue', () => {
    const revisions = [
      { quizId: 'q3', seances: 1, questions: 10 },
      { quizId: 'q1', seances: 1, questions: 10 },
    ]
    const r = matieresRevisees({ revisions, quizLecon, leconChapitre, chapitreMatiere, matieres: MATIERES })
    expect(r.map((m) => m.slug)).toEqual(['maths', 'francais'])
  })

  it('relit l’agrégat de la migration 381, et plie les séances brutes à l’identique', () => {
    expect(
      lireRevisionParQuiz([
        { quiz_id: 'q1', seances: 2, questions: 20 },
        { quiz_id: 'q2', seances: '1', questions: '15' },
        { quiz_id: '', seances: 1, questions: 5 },
        { quiz_id: 'q3', seances: 1, questions: 0 },
        null,
      ]),
    ).toEqual([
      { quizId: 'q1', seances: 2, questions: 20 },
      { quizId: 'q2', seances: 1, questions: 15 },
    ])
    expect(lireRevisionParQuiz(null)).toEqual([])
    expect(
      plierSeances([
        { quiz_id: 'q1', total: 10 },
        { quiz_id: 'q1', total: 10 },
        { quiz_id: 'q2', total: 15 },
        { quiz_id: null, total: 12 },
        { quiz_id: 'q3', total: 0 },
      ]),
    ).toEqual([
      { quizId: 'q1', seances: 2, questions: 20 },
      { quizId: 'q2', seances: 1, questions: 15 },
    ])
  })

  it('donne à chaque colonne sa hauteur, la plus haute à 100, la plus petite visible', () => {
    expect(hauteursColonnes([{ questions: 240 }, { questions: 120 }, { questions: 1 }])).toEqual([
      100,
      50,
      HAUTEUR_MIN_PCT,
    ])
    expect(hauteursColonnes([])).toEqual([])
  })

  it('écrit les noms courts et les questions à la française', () => {
    expect(nomCourtMatiere('histoire-geo', 'Histoire-Géographie')).toBe('Hist-Géo')
    expect(nomCourtMatiere('grand-oral', 'Grand oral')).toBe('Grand oral')
    expect(libelleQuestions(1)).toBe('1 question')
    expect(libelleQuestions(1240)).toBe('1 240 questions')
  })
})
