import { describe, it, expect } from 'vitest'
import { computeWeeklyRecap } from '@/lib/weekly-recap'

// Semaine de référence : lundi 2026-07-13 → dimanche 2026-07-19.
const MON = '2026-07-13'
const TUE = '2026-07-14'
const WED = '2026-07-15'
const SUN = '2026-07-19'
// Semaine précédente : lundi 2026-07-06 → dimanche 2026-07-12.
const PREV_MON = '2026-07-06'
const PREV_TUE = '2026-07-07'

const quiz = (date: string, score: number, total: number) => ({
  date,
  score,
  total,
})

describe('computeWeeklyRecap', () => {
  it('semaine vide → tout à zéro + accroche de démarrage', () => {
    const r = computeWeeklyRecap(MON, [], [])
    expect(r.sessions).toBe(0)
    expect(r.activeDays).toBe(0)
    expect(r.quizCount).toBe(0)
    expect(r.quizAvg).toBeNull()
    expect(r.bestDay).toBeNull()
    expect(r.headline).toContain('nouvelle semaine')
  })

  it('compte les sessions de la semaine et ignore les autres semaines', () => {
    const r = computeWeeklyRecap(
      MON,
      [MON, MON, TUE, PREV_TUE, '2026-06-01'],
      [],
    )
    expect(r.sessions).toBe(3) // MON, MON, TUE
    expect(r.activeDays).toBe(2) // lundi + mardi
  })

  it('calcule l’écart vs la semaine précédente', () => {
    const r = computeWeeklyRecap(
      MON,
      [MON, TUE, WED, PREV_MON], // 3 cette semaine, 1 la précédente
      [],
    )
    expect(r.sessionsDelta).toBe(2)
    expect(r.headline).toContain('de plus')
  })

  it('écart négatif possible (semaine plus calme)', () => {
    const r = computeWeeklyRecap(
      MON,
      [MON, PREV_MON, PREV_TUE], // 1 cette semaine, 2 la précédente
      [],
    )
    expect(r.sessionsDelta).toBe(-1)
  })

  it('moyenne aux quiz de la semaine, quiz notés seulement', () => {
    const r = computeWeeklyRecap(
      MON,
      [MON, TUE],
      [
        quiz(MON, 8, 10), // 80 %
        quiz(TUE, 6, 10), // 60 %
        quiz(WED, 0, 0), // non noté → ignoré
        quiz(PREV_TUE, 10, 10), // autre semaine → ignoré
      ],
    )
    expect(r.quizCount).toBe(2)
    expect(r.quizAvg).toBe(70)
  })

  it('aucun quiz noté → moyenne null', () => {
    const r = computeWeeklyRecap(MON, [MON], [quiz(MON, 0, 0)])
    expect(r.quizCount).toBe(0)
    expect(r.quizAvg).toBeNull()
  })

  it('repère le jour le plus actif (index 0 = lundi)', () => {
    const r = computeWeeklyRecap(MON, [MON, WED, WED, WED, TUE], [])
    expect(r.bestDay).toEqual({ index: 2, count: 3 }) // mercredi
  })

  it('jour le plus actif : le premier en cas d’égalité (déterministe)', () => {
    const r = computeWeeklyRecap(MON, [MON, TUE], [])
    expect(r.bestDay).toEqual({ index: 0, count: 1 }) // lundi gagne
  })

  it('rythme salué à partir de 5 jours actifs (sans progression)', () => {
    // 5 jours actifs cette semaine, autant la précédente (delta 0).
    const r = computeWeeklyRecap(
      MON,
      [MON, TUE, WED, '2026-07-16', '2026-07-17', PREV_MON, PREV_TUE, '2026-07-08', '2026-07-09', '2026-07-10'],
      [],
    )
    expect(r.activeDays).toBe(5)
    expect(r.headline).toContain('rythme')
  })

  it('dimanche compté dans la semaine (frontière lundi→dimanche)', () => {
    const r = computeWeeklyRecap(MON, [SUN], [])
    expect(r.sessions).toBe(1)
    expect(r.bestDay).toEqual({ index: 6, count: 1 }) // dimanche
  })
})
