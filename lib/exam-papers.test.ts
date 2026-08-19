import { describe, expect, test } from 'vitest'
import {
  chaptersOfPaper,
  formatCoefficient,
  formatDuration,
  groupPapersBySession,
  parseExamPapers,
  totalPoints,
  type ExamPaper,
} from '@/lib/exam-papers'

const ligne = (over: Record<string, unknown> = {}) => ({
  id: 'p1',
  exam: 'brevet',
  session: '2026',
  center: '',
  title: 'Brevet 2026 — Maths',
  duration_min: 120,
  coefficient: '2.00',
  position: 1,
  outline: [
    {
      title: 'Automatismes',
      minutes: 20,
      points: 6,
      chapters: ['Arithmétique'],
      expected: 'Questions courtes sans calculatrice.',
    },
  ],
  ...over,
})

describe('parseExamPapers', () => {
  test('renvoie un tableau vide quand la requête n’a rien rendu', () => {
    expect(parseExamPapers(null)).toEqual([])
    expect(parseExamPapers(undefined)).toEqual([])
    expect(parseExamPapers([])).toEqual([])
  })

  test('met en forme une épreuve complète', () => {
    const [paper] = parseExamPapers([ligne()])
    expect(paper.title).toBe('Brevet 2026 — Maths')
    expect(paper.durationMin).toBe(120)
    expect(paper.parts).toHaveLength(1)
    expect(paper.parts[0].chapters).toEqual(['Arithmétique'])
  })

  test('lit un coefficient rendu en CHAÎNE par PostgREST', () => {
    // NUMERIC arrive en texte pour ne pas perdre de précision : « 1.50 » doit
    // devenir le nombre 1,5, sans quoi le coefficient du brevet disparaît.
    const [paper] = parseExamPapers([ligne({ coefficient: '1.50' })])
    expect(paper.coefficient).toBe(1.5)
  })

  test('accepte un coefficient absent', () => {
    const [paper] = parseExamPapers([ligne({ coefficient: null })])
    expect(paper.coefficient).toBeNull()
  })

  test('écarte une ligne sans épreuve reconnue plutôt que de la garder', () => {
    expect(parseExamPapers([ligne({ exam: 'concours-blanc' })])).toEqual([])
  })

  test('écarte une ligne dont l’outline n’est pas un tableau', () => {
    // `outline` est du JSONB : rien côté base ne garantit sa forme.
    expect(parseExamPapers([ligne({ outline: { title: 'x' } })])).toEqual([])
    expect(parseExamPapers([ligne({ outline: null })])).toEqual([])
  })

  test('écarte les parties sans titre ou sans attendu, et l’épreuve si rien ne reste', () => {
    const partielle = ligne({
      outline: [
        { title: '', expected: 'x' },
        { title: 'Partie 2', minutes: 10, points: 5, chapters: [], expected: 'Attendu.' },
      ],
    })
    const [paper] = parseExamPapers([partielle])
    expect(paper.parts).toHaveLength(1)
    expect(paper.parts[0].title).toBe('Partie 2')

    expect(parseExamPapers([ligne({ outline: [{ title: 'Sans attendu' }] })])).toEqual([])
  })

  test('ignore les chapitres qui ne sont pas des chaînes', () => {
    const [paper] = parseExamPapers([
      ligne({
        outline: [
          { title: 'P', expected: 'Attendu.', chapters: ['Bon', 42, null, ''] },
        ],
      }),
    ])
    expect(paper.parts[0].chapters).toEqual(['Bon'])
  })

  test('classe la session la plus récente en premier', () => {
    const papers = parseExamPapers([
      ligne({ id: 'a', session: '2024' }),
      ligne({ id: 'b', session: '2026' }),
      ligne({ id: 'c', session: '2025' }),
    ])
    expect(papers.map((p) => p.session)).toEqual(['2026', '2025', '2024'])
  })

  test('à session égale, garde l’ordre voulu par le contenu', () => {
    const papers = parseExamPapers([
      ligne({ id: 'b', position: 2 }),
      ligne({ id: 'a', position: 1 }),
    ])
    expect(papers.map((p) => p.id)).toEqual(['a', 'b'])
  })
})

describe('groupPapersBySession', () => {
  const paper = (session: string, id: string): ExamPaper => ({
    id,
    exam: 'bac',
    session,
    center: '',
    title: id,
    durationMin: 240,
    coefficient: 8,
    parts: [],
    position: 1,
  })

  test('ne rend aucun groupe sans épreuve', () => {
    expect(groupPapersBySession([])).toEqual([])
  })

  test('regroupe par session en conservant l’ordre d’arrivée', () => {
    const groups = groupPapersBySession([
      paper('2026', 'a'),
      paper('2026', 'b'),
      paper('2025', 'c'),
    ])
    expect(groups.map((g) => g.session)).toEqual(['2026', '2025'])
    expect(groups[0].papers.map((p) => p.id)).toEqual(['a', 'b'])
  })
})

describe('formatDuration', () => {
  test('écrit les minutes seules sous l’heure', () => {
    expect(formatDuration(20)).toBe('20 min')
    expect(formatDuration(59)).toBe('59 min')
  })

  test('écrit les heures rondes sans minutes', () => {
    expect(formatDuration(60)).toBe('1 h')
    expect(formatDuration(240)).toBe('4 h')
  })

  test('écrit les heures et minutes, minutes sur deux chiffres', () => {
    expect(formatDuration(210)).toBe('3 h 30')
    expect(formatDuration(65)).toBe('1 h 05')
  })
})

describe('formatCoefficient', () => {
  test('n’écrit rien quand il n’y a pas de coefficient', () => {
    expect(formatCoefficient(null)).toBeNull()
  })

  test('écrit la virgule décimale et supprime les zéros inutiles', () => {
    expect(formatCoefficient(2)).toBe('coef. 2')
    expect(formatCoefficient(1.5)).toBe('coef. 1,5')
    expect(formatCoefficient(0.5)).toBe('coef. 0,5')
  })
})

describe('totalPoints', () => {
  const avec = (points: (number | null)[]): ExamPaper => ({
    id: 'p',
    exam: 'brevet',
    session: '2026',
    center: '',
    title: 'x',
    durationMin: 120,
    coefficient: 2,
    position: 1,
    parts: points.map((p, i) => ({
      title: `P${i}`,
      minutes: null,
      points: p,
      chapters: [],
      expected: 'x',
    })),
  })

  test('additionne le barème', () => {
    expect(totalPoints(avec([6, 14]))).toBe(20)
  })

  test('ne rend AUCUN total si une partie n’est pas barémée', () => {
    // Un total partiel serait un total faux — pire qu'un total absent.
    expect(totalPoints(avec([6, null]))).toBeNull()
  })
})

describe('chaptersOfPaper', () => {
  test('dédoublonne en gardant l’ordre d’apparition', () => {
    const paper: ExamPaper = {
      id: 'p',
      exam: 'brevet',
      session: '2026',
      center: '',
      title: 'x',
      durationMin: 120,
      coefficient: 2,
      position: 1,
      parts: [
        { title: 'A', minutes: null, points: null, chapters: ['Thalès', 'Proba'], expected: 'x' },
        { title: 'B', minutes: null, points: null, chapters: ['Proba', 'Fonctions'], expected: 'x' },
      ],
    }
    expect(chaptersOfPaper(paper)).toEqual(['Thalès', 'Proba', 'Fonctions'])
  })
})
