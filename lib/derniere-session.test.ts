import { describe, expect, it } from 'vitest'
import {
  chapitreParLecon,
  chapitreParQuiz,
  derniereSession,
  tracesDeLaMatiere,
} from './derniere-session'

const catalog = [
  {
    id: 'ch-1',
    lessons: [
      { id: 'l-1', quizzes: [{ id: 'q-1' }, { id: 'q-2' }] },
      { id: 'l-2', quizzes: [] },
    ],
  },
  { id: 'ch-2', lessons: [{ id: 'l-3', quizzes: [{ id: 'q-3' }] }] },
]

describe('chapitreParQuiz / chapitreParLecon', () => {
  it('remontent du quiz et de la leçon au chapitre', () => {
    expect(chapitreParQuiz(catalog).get('q-2')).toBe('ch-1')
    expect(chapitreParQuiz(catalog).get('q-3')).toBe('ch-2')
    expect(chapitreParLecon(catalog).get('l-2')).toBe('ch-1')
    expect(chapitreParLecon(catalog).get('inconnue')).toBeUndefined()
  })
})

describe('derniereSession', () => {
  it('retient le chapitre de la trace la plus récente', () => {
    // Arrange
    const traces = [
      { chapterId: 'ch-1', at: '2026-09-10T10:00:00Z' },
      { chapterId: 'ch-2', at: '2026-09-16T18:30:00Z' },
      { chapterId: 'ch-1', at: '2026-09-12T08:00:00Z' },
    ]

    // Act / Assert
    expect(derniereSession(traces)).toBe('ch-2')
  })

  it('rend null sans trace, et ignore une date illisible', () => {
    expect(derniereSession([])).toBeNull()
    expect(derniereSession([{ chapterId: 'ch-1', at: 'hier' }])).toBeNull()
    expect(
      derniereSession([
        { chapterId: 'ch-1', at: 'hier' },
        { chapterId: 'ch-2', at: '2026-09-01T00:00:00Z' },
      ]),
    ).toBe('ch-2')
  })
})

describe('tracesDeLaMatiere', () => {
  it('assemble quiz joués et cours lus, et écarte ce qui n’est pas du programme', () => {
    const traces = tracesDeLaMatiere(
      catalog,
      [
        { quiz_id: 'q-3', created_at: '2026-09-15T09:00:00Z' },
        { quiz_id: 'q-autre-matiere', created_at: '2026-09-17T09:00:00Z' },
        { quiz_id: null, created_at: '2026-09-17T09:00:00Z' },
      ],
      [
        { lesson_id: 'l-2', created_at: '2026-09-16T09:00:00Z' },
        { lesson_id: 'l-histoire', created_at: '2026-09-17T09:00:00Z' },
        { lesson_id: 'l-1', created_at: null },
      ],
    )

    expect(traces).toEqual([
      { chapterId: 'ch-2', at: '2026-09-15T09:00:00Z' },
      { chapterId: 'ch-1', at: '2026-09-16T09:00:00Z' },
    ])
    expect(derniereSession(traces)).toBe('ch-1')
  })
})
