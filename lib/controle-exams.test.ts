import { describe, expect, it } from 'vitest'
import {
  controleToExams,
  controlesToExams,
  mergeExamSources,
} from './controle-exams'
import { activeExams, examChapterIds, examHintsBySubject } from './next-exam'
import type { Controle } from './prep-plan'
import type { NextExam } from './next-exam'

function controle(over: Partial<Controle> = {}): Controle {
  return {
    id: 'c1',
    subject: 'maths',
    chapters: [{ id: 'ch1', title: 'Théorème de Thalès' }],
    date: '2026-08-10',
    grade: '3e',
    note: null,
    notePrompted: false,
    snoozeDate: null,
    sessions: [],
    ...over,
  }
}

describe('controleToExams', () => {
  it('produit une cible par chapitre, avec la matière et la date du contrôle', () => {
    const exams = controleToExams(
      controle({
        chapters: [
          { id: 'ch1', title: 'Thalès' },
          { id: 'ch2', title: 'Pythagore' },
        ],
      }),
    )

    expect(exams).toEqual([
      {
        subject: 'maths',
        chapterId: 'ch1',
        chapterTitle: 'Thalès',
        date: '2026-08-10',
      },
      {
        subject: 'maths',
        chapterId: 'ch2',
        chapterTitle: 'Pythagore',
        date: '2026-08-10',
      },
    ])
  })

  it('garde un contrôle sans date (date null = toujours actif)', () => {
    expect(controleToExams(controle({ date: null }))[0].date).toBeNull()
  })

  it('écarte les chapitres à id ou titre vide (donnée corrompue)', () => {
    const exams = controleToExams(
      controle({
        chapters: [
          { id: '', title: 'Sans id' },
          { id: 'ch2', title: '' },
          { id: 'ch3', title: 'Valide' },
        ],
      }),
    )
    expect(exams.map((e) => e.chapterId)).toEqual(['ch3'])
  })
})

describe('controlesToExams', () => {
  it('aplatit plusieurs contrôles de matières différentes', () => {
    const exams = controlesToExams([
      controle({ id: 'c1', subject: 'maths' }),
      controle({
        id: 'c2',
        subject: 'histoire',
        chapters: [{ id: 'ch9', title: 'La Révolution' }],
        date: '2026-08-03',
      }),
    ])
    expect(exams).toHaveLength(2)
    expect(exams[1]).toEqual({
      subject: 'histoire',
      chapterId: 'ch9',
      chapterTitle: 'La Révolution',
      date: '2026-08-03',
    })
  })

  it('renvoie [] sans contrôle', () => {
    expect(controlesToExams([])).toEqual([])
  })
})

describe('mergeExamSources', () => {
  const legacy: NextExam[] = [
    {
      subject: 'maths',
      chapterId: 'ch1',
      chapterTitle: 'Ancien titre',
      level: '3e',
      date: '2026-09-01',
    },
    {
      subject: 'anglais',
      chapterId: 'ch7',
      chapterTitle: 'Present perfect',
      level: '3e',
      date: '2026-08-20',
    },
  ]

  it('le contrôle moderne écrase la ligne héritée du même chapitre', () => {
    const merged = mergeExamSources(controlesToExams([controle()]), legacy)
    const ch1 = merged.find((e) => e.chapterId === 'ch1')
    expect(ch1?.chapterTitle).toBe('Théorème de Thalès')
    expect(ch1?.date).toBe('2026-08-10')
    // Et le chapitre hérité SANS équivalent moderne survit (reprise 211 pas
    // encore passée : on ne perd pas un contrôle déjà déclaré).
    expect(merged.map((e) => e.chapterId).sort()).toEqual(['ch1', 'ch7'])
  })

  it('sans source moderne, rend exactement la source héritée', () => {
    expect(mergeExamSources([], legacy)).toEqual(legacy)
  })

  it('sans source héritée, rend exactement la source moderne', () => {
    const modern = controlesToExams([controle()])
    expect(mergeExamSources(modern, [])).toEqual(modern)
  })
})

describe('le résultat se branche sur les helpers existants de next-exam', () => {
  const today = '2026-08-01'
  const merged = mergeExamSources(
    controlesToExams([
      controle({
        chapters: [
          { id: 'ch1', title: 'Thalès' },
          { id: 'ch2', title: 'Pythagore' },
        ],
      }),
      controle({
        id: 'c2',
        subject: 'histoire',
        chapters: [{ id: 'ch9', title: 'La Révolution' }],
        date: '2026-07-20', // passé
      }),
    ]),
    [],
  )

  it('activeExams écarte le contrôle passé et trie par échéance', () => {
    const active = activeExams(merged, today)
    expect(active.map((e) => e.chapterId)).toEqual(['ch1', 'ch2'])
  })

  it('examChapterIds donne au Défi les chapitres à prioriser', () => {
    expect(examChapterIds(activeExams(merged, today))).toEqual(['ch1', 'ch2'])
  })

  it('examHintsBySubject annote le dossier de la matière', () => {
    const hints = examHintsBySubject(activeExams(merged, today), today)
    expect(hints.maths).toEqual({
      proximity: 'far',
      label: 'dans 9 jours',
      chapterTitle: 'Thalès',
    })
    expect(hints.histoire).toBeUndefined()
  })
})
