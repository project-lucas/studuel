import { describe, it, expect } from 'vitest'
import {
  composeExam,
  buildReport,
  verdictFor,
  examDurationSeconds,
  EXAM_SECONDS_PER_QUESTION,
  type ExamQuestion,
} from '@/lib/exam-blanc'

const q = (id: string, subject: string, chapterId: string | null = null): ExamQuestion => ({
  id,
  prompt: `Q${id}`,
  options: ['a', 'b'],
  correctIndex: 0,
  explanation: null,
  subject,
  subjectSlug: subject.toLowerCase(),
  chapterId,
  chapterTitle: chapterId ? `Chapitre ${chapterId}` : null,
})

describe('examDurationSeconds', () => {
  it('45 secondes par question', () => {
    expect(examDurationSeconds(20)).toBe(20 * EXAM_SECONDS_PER_QUESTION)
    expect(examDurationSeconds(0)).toBe(0)
  })
})

describe('composeExam', () => {
  it('équilibre les matières en round-robin', () => {
    const bySubject = new Map([
      ['Maths', [q('m1', 'Maths'), q('m2', 'Maths'), q('m3', 'Maths')]],
      ['Anglais', [q('a1', 'Anglais'), q('a2', 'Anglais')]],
    ])
    const exam = composeExam(bySubject, 4)
    const maths = exam.filter((x) => x.subject === 'Maths').length
    const anglais = exam.filter((x) => x.subject === 'Anglais').length
    expect(exam).toHaveLength(4)
    expect(maths).toBe(2)
    expect(anglais).toBe(2)
  })

  it("épuise les pools sans dépasser le plafond ni boucler à l'infini", () => {
    const bySubject = new Map([['Maths', [q('m1', 'Maths')]]])
    expect(composeExam(bySubject, 20)).toHaveLength(1)
    expect(composeExam(new Map(), 20)).toHaveLength(0)
  })
})

describe('verdictFor', () => {
  it('≥ 75 % solide, ≥ 50 % fragile, sinon à revoir', () => {
    expect(verdictFor(1)).toBe('solide')
    expect(verdictFor(0.75)).toBe('solide')
    expect(verdictFor(0.6)).toBe('fragile')
    expect(verdictFor(0.5)).toBe('fragile')
    expect(verdictFor(0.4)).toBe('a_revoir')
  })
})

describe('buildReport', () => {
  it('agrège par chapitre et classe les « à revoir » d’abord', () => {
    const questions = [
      q('1', 'Maths', 'ch-fractions'),
      q('2', 'Maths', 'ch-fractions'),
      q('3', 'Anglais', 'ch-past'),
      q('4', 'Anglais', 'ch-past'),
    ]
    const good = new Map([
      ['1', true],
      ['2', true], // fractions : 2/2 solide
      ['3', false],
      ['4', false], // past : 0/2 à revoir
    ])
    const report = buildReport(questions, good)
    expect(report).toHaveLength(2)
    expect(report[0].chapterId).toBe('ch-past')
    expect(report[0].verdict).toBe('a_revoir')
    expect(report[1].chapterId).toBe('ch-fractions')
    expect(report[1].verdict).toBe('solide')
  })

  it('une question sans réponse compte fausse (temps écoulé)', () => {
    const report = buildReport([q('1', 'Maths', 'ch')], new Map())
    expect(report[0].correct).toBe(0)
    expect(report[0].verdict).toBe('a_revoir')
  })

  it('les questions sans chapitre sont agrégées par matière', () => {
    const report = buildReport(
      [q('1', 'Philo'), q('2', 'Philo')],
      new Map([
        ['1', true],
        ['2', true],
      ]),
    )
    expect(report).toHaveLength(1)
    expect(report[0].chapterId).toBeNull()
    expect(report[0].subject).toBe('Philo')
    expect(report[0].verdict).toBe('solide')
  })
})
