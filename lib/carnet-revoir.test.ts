import { describe, it, expect } from 'vitest'
import {
  REVOIR_INTERVALS,
  isQuestionDue,
  revoirSummary,
  revoirMinutes,
  crownsForCourse,
  type RevoirAttempt,
} from './carnet-revoir'

const at = (day: string, h = 10): string => `${day}T${String(h).padStart(2, '0')}:00:00.000Z`

const ok = (day: string, h?: number): RevoirAttempt => ({
  questionId: 'q1',
  isCorrect: true,
  answeredAt: at(day, h),
})
const ko = (day: string, h?: number): RevoirAttempt => ({
  questionId: 'q1',
  isCorrect: false,
  answeredAt: at(day, h),
})

describe('isQuestionDue', () => {
  it('une question jamais tentée est due', () => {
    expect(isQuestionDue([], '2026-07-29')).toBe(true)
  })

  it('un dernier essai faux rend la question due immédiatement', () => {
    expect(isQuestionDue([ok('2026-07-28'), ko('2026-07-29')], '2026-07-29')).toBe(
      true,
    )
  })

  it('un premier essai juste repousse au lendemain (J+1)', () => {
    const attempts = [ok('2026-07-29')]
    expect(isQuestionDue(attempts, '2026-07-29')).toBe(false)
    expect(isQuestionDue(attempts, '2026-07-30')).toBe(true)
  })

  it('deux essais justes consécutifs repoussent à J+3', () => {
    const attempts = [ok('2026-07-25'), ok('2026-07-27')]
    expect(isQuestionDue(attempts, '2026-07-29')).toBe(false)
    expect(isQuestionDue(attempts, '2026-07-30')).toBe(true)
  })

  it('un échec au milieu remet la suite à zéro', () => {
    // juste, FAUX, juste → la suite finale ne compte qu'un succès → J+1.
    const attempts = [ok('2026-07-20'), ko('2026-07-25'), ok('2026-07-28')]
    expect(isQuestionDue(attempts, '2026-07-28')).toBe(false)
    expect(isQuestionDue(attempts, '2026-07-29')).toBe(true)
  })

  it("l'ordre d'arrivée des tentatives n'importe pas", () => {
    const attempts = [ok('2026-07-28'), ko('2026-07-25'), ok('2026-07-20')]
    // Même historique que ci-dessus, mélangé : due à J+1 seulement.
    expect(isQuestionDue(attempts, '2026-07-28')).toBe(false)
    expect(isQuestionDue(attempts, '2026-07-29')).toBe(true)
  })

  it('le palier plafonne au dernier intervalle (J+35)', () => {
    const days = [
      '2026-01-01',
      '2026-01-02',
      '2026-01-05',
      '2026-01-12',
      '2026-01-26',
      '2026-03-02',
      '2026-04-06',
    ]
    const attempts = days.map((d) => ok(d))
    const last = days[days.length - 1]
    const maxInterval = REVOIR_INTERVALS[REVOIR_INTERVALS.length - 1]
    // 34 jours après : pas due ; 35 jours après : due.
    expect(isQuestionDue(attempts, '2026-05-10')).toBe(false)
    expect(isQuestionDue(attempts, '2026-05-11')).toBe(true)
    expect(maxInterval).toBe(35)
    expect(last).toBe('2026-04-06')
  })

  it('un horodatage illisible rend la question due (jamais bloquée)', () => {
    expect(
      isQuestionDue([{ questionId: 'q1', isCorrect: true, answeredAt: 'n/a' }], '2026-07-29'),
    ).toBe(true)
  })
})

describe('revoirSummary', () => {
  it('compte les questions dues par cours', () => {
    const questions = [
      { id: 'a', courseId: 'anglais' },
      { id: 'b', courseId: 'anglais' },
      { id: 'c', courseId: 'svt' },
    ]
    const attempts: RevoirAttempt[] = [
      // « a » vient d'être réussie → pas due aujourd'hui.
      { questionId: 'a', isCorrect: true, answeredAt: at('2026-07-29') },
      // « b » ratée hier → due.
      { questionId: 'b', isCorrect: false, answeredAt: at('2026-07-28') },
      // « c » jamais tentée → due.
    ]
    const s = revoirSummary(questions, attempts, '2026-07-29')
    expect(s.total).toBe(2)
    expect(s.dueIds).toEqual(['b', 'c'])
    expect(s.dueByCourse.get('anglais')).toBe(1)
    expect(s.dueByCourse.get('svt')).toBe(1)
  })

  it('sans question, le bilan est vide', () => {
    const s = revoirSummary([], [], '2026-07-29')
    expect(s.total).toBe(0)
    expect(s.dueIds).toEqual([])
    expect(s.dueByCourse.size).toBe(0)
  })
})

describe('revoirMinutes', () => {
  it('compte ~30 s par question, minimum 1 min', () => {
    expect(revoirMinutes(0)).toBe(0)
    expect(revoirMinutes(1)).toBe(1)
    expect(revoirMinutes(12)).toBe(6)
    expect(revoirMinutes(13)).toBe(7)
  })
})

describe('crownsForCourse', () => {
  it('gradue de 0 à 3 couronnes selon la part maîtrisée', () => {
    expect(crownsForCourse(0, 0)).toBe(0)
    expect(crownsForCourse(0, 10)).toBe(0)
    expect(crownsForCourse(4, 10)).toBe(1)
    expect(crownsForCourse(7, 10)).toBe(2)
    expect(crownsForCourse(10, 10)).toBe(3)
  })
})
