import { describe, it, expect } from 'vitest'
import {
  normalizeNextExam,
  isExamActive,
  examCountdownLabel,
  normalizeExamList,
  activeExams,
  examChapterIds,
  examProximity,
  examCardLabel,
  examHintsBySubject,
  examHeroUrgency,
  MAX_UPCOMING_EXAMS,
  type NextExam,
} from './next-exam'

const base: NextExam = {
  subject: 'physique-chimie',
  chapterId: '11111111-1111-4111-8111-111111111107',
  chapterTitle: 'Les états de la matière',
  level: '1re',
  date: '2026-07-20',
}

describe('normalizeNextExam', () => {
  it('accepte une cible bien formée', () => {
    expect(normalizeNextExam({ ...base })).toEqual(base)
  })

  it('accepte une cible sans date (date → null)', () => {
    expect(normalizeNextExam({ ...base, date: undefined })).toEqual({
      ...base,
      date: null,
    })
  })

  it('ramène une date mal formée à null', () => {
    expect(normalizeNextExam({ ...base, date: '20/07/2026' })?.date).toBeNull()
  })

  it('rejette une cible sans matière ou sans chapitre', () => {
    expect(normalizeNextExam({ ...base, subject: '' })).toBeNull()
    expect(normalizeNextExam({ ...base, chapterId: '' })).toBeNull()
  })

  it('rejette les valeurs non-objet', () => {
    expect(normalizeNextExam(null)).toBeNull()
    expect(normalizeNextExam('coucou')).toBeNull()
  })
})

describe('isExamActive', () => {
  it('est inactif si aucune cible', () => {
    expect(isExamActive(null, '2026-07-14')).toBe(false)
  })

  it('est actif si la date est aujourd’hui ou plus tard', () => {
    expect(isExamActive(base, '2026-07-14')).toBe(true)
    expect(isExamActive(base, '2026-07-20')).toBe(true)
  })

  it('est inactif une fois la date passée', () => {
    expect(isExamActive(base, '2026-07-21')).toBe(false)
  })

  it('reste actif indéfiniment sans date', () => {
    expect(isExamActive({ ...base, date: null }, '2030-01-01')).toBe(true)
  })
})

describe('examCountdownLabel', () => {
  it('null sans date', () => {
    expect(examCountdownLabel({ ...base, date: null }, '2026-07-14')).toBeNull()
  })

  it('formule le compte à rebours en français', () => {
    expect(examCountdownLabel(base, '2026-07-20')).toBe("c'est aujourd'hui")
    expect(examCountdownLabel(base, '2026-07-19')).toBe('demain')
    expect(examCountdownLabel(base, '2026-07-14')).toBe('dans 6 jours')
    expect(examCountdownLabel(base, '2026-07-21')).toBe('contrôle passé')
  })
})

const other: NextExam = {
  subject: 'maths',
  chapterId: '22222222-2222-4222-8222-222222222222',
  chapterTitle: 'Théorème de Pythagore',
  level: '1re',
  date: '2026-07-16',
}

describe('normalizeExamList', () => {
  it('renvoie [] pour un non-tableau', () => {
    expect(normalizeExamList(null)).toEqual([])
    expect(normalizeExamList({})).toEqual([])
  })

  it('filtre les entrées invalides', () => {
    expect(normalizeExamList([base, { subject: '' }, 42])).toEqual([base])
  })

  it('dédoublonne par chapitre (la dernière gagne)', () => {
    const dup = { ...base, date: '2026-07-25' }
    expect(normalizeExamList([base, dup])).toEqual([dup])
  })

  it('borne la liste à MAX_UPCOMING_EXAMS', () => {
    const many = Array.from({ length: MAX_UPCOMING_EXAMS + 5 }, (_, i) => ({
      ...base,
      chapterId: `chap-${i}`,
    }))
    expect(normalizeExamList(many)).toHaveLength(MAX_UPCOMING_EXAMS)
  })

  it('garde les plus RÉCENTS quand la liste dépasse la borne', () => {
    const many = Array.from({ length: MAX_UPCOMING_EXAMS + 3 }, (_, i) => ({
      ...base,
      chapterId: `chap-${i}`,
    }))
    const ids = normalizeExamList(many).map((e) => e.chapterId)
    // Les 3 premiers (plus anciens) sont jetés, les derniers conservés.
    expect(ids).not.toContain('chap-0')
    expect(ids).not.toContain('chap-2')
    expect(ids[ids.length - 1]).toBe(`chap-${MAX_UPCOMING_EXAMS + 2}`)
  })
})

describe('activeExams', () => {
  it('exclut les contrôles passés et trie par date', () => {
    const past = { ...other, chapterId: 'past', date: '2026-07-10' }
    const result = activeExams([base, other, past], '2026-07-14')
    expect(result.map((e) => e.chapterId)).toEqual([other.chapterId, base.chapterId])
  })

  it('place les sans-date à la fin', () => {
    const noDate = { ...base, chapterId: 'nd', date: null }
    const result = activeExams([noDate, other], '2026-07-14')
    expect(result[result.length - 1].chapterId).toBe('nd')
  })
})

describe('examChapterIds', () => {
  it('renvoie les ids de chapitres sans doublon', () => {
    expect(examChapterIds([base, other, base])).toEqual([
      base.chapterId,
      other.chapterId,
    ])
  })
})

describe('examProximity', () => {
  const mk = (date: string | null): NextExam => ({ ...base, date })
  const today = '2026-07-15'

  it('rouge (imminent) à 2 jours ou moins', () => {
    expect(examProximity(mk('2026-07-15'), today)).toBe('imminent') // aujourd'hui
    expect(examProximity(mk('2026-07-17'), today)).toBe('imminent') // dans 2 j
  })

  it('orange (soon) entre 3 et 6 jours', () => {
    expect(examProximity(mk('2026-07-18'), today)).toBe('soon') // 3 j
    expect(examProximity(mk('2026-07-21'), today)).toBe('soon') // 6 j
  })

  it('vert (far) au-delà de 6 jours ou sans date', () => {
    expect(examProximity(mk('2026-07-22'), today)).toBe('far') // 7 j
    expect(examProximity(mk(null), today)).toBe('far')
  })
})

describe('examCardLabel', () => {
  const mk = (date: string | null): NextExam => ({ ...base, date })
  const today = '2026-07-15'

  it('annonce le jour J avec urgence', () => {
    expect(examCardLabel(mk('2026-07-15'), today)).toBe(
      "Contrôle aujourd'hui !",
    )
  })

  it('annonce demain puis le compte en jours', () => {
    expect(examCardLabel(mk('2026-07-16'), today)).toBe('Contrôle demain')
    expect(examCardLabel(mk('2026-07-18'), today)).toBe(
      'Contrôle dans 3 jours',
    )
  })

  it('badge neutre pour un contrôle sans date', () => {
    expect(examCardLabel(mk(null), today)).toBe('Contrôle à venir')
  })
})

describe('examHeroUrgency', () => {
  const today = '2026-07-15'

  it('jaune à 3 jours ou plus, avec le compte en jours', () => {
    expect(examHeroUrgency('2026-07-18', today)).toEqual({
      label: 'Contrôle dans 3 jours',
      tone: 'yellow',
    })
    expect(examHeroUrgency('2026-07-25', today)).toEqual({
      label: 'Contrôle dans 10 jours',
      tone: 'yellow',
    })
  })

  it('corail à 2 jours', () => {
    expect(examHeroUrgency('2026-07-17', today)).toEqual({
      label: 'Contrôle dans 2 jours',
      tone: 'coral',
    })
  })

  it('corail à J-1 avec le libellé « demain »', () => {
    expect(examHeroUrgency('2026-07-16', today)).toEqual({
      label: 'Contrôle demain',
      tone: 'coral',
    })
  })

  it('corail le jour J', () => {
    expect(examHeroUrgency('2026-07-15', today)).toEqual({
      label: "Contrôle aujourd'hui !",
      tone: 'coral',
    })
  })

  it('jaune et neutre sans date', () => {
    expect(examHeroUrgency(null, today)).toEqual({
      label: 'Contrôle à venir',
      tone: 'yellow',
    })
  })
})

describe('examHintsBySubject', () => {
  const today = '2026-07-15'
  it('garde le contrôle le plus proche par matière (liste triée)', () => {
    const list: NextExam[] = [
      { ...base, subject: 'maths', chapterId: 'c1', date: '2026-07-16' },
      { ...base, subject: 'maths', chapterId: 'c2', date: '2026-07-25' },
      { ...base, subject: 'svt', chapterId: 'c3', date: '2026-07-20' },
    ]
    const hints = examHintsBySubject(list, today)
    expect(hints.maths.proximity).toBe('imminent')
    expect(hints.maths.label).toBe('demain')
    expect(hints.svt.proximity).toBe('soon')
    expect(Object.keys(hints).sort()).toEqual(['maths', 'svt'])
  })
})
