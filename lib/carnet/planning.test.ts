import { describe, expect, it } from 'vitest'
import {
  bilanSemaine,
  hrefDuPlan,
  joursDeLaSemaine,
  libelleJours,
  libelleSession,
  lundiDe,
  normalizeDays,
  normalizePlan,
  phraseSemaine,
  planTenu,
  proposerAvantControle,
  semaineDuPlanning,
  type PlanAffiche,
} from './planning'

const plan = (over: Partial<PlanAffiche> = {}): PlanAffiche => ({
  id: 'p1',
  courseId: 'c1',
  chapterId: 'ch1',
  days: [0, 3],
  time: '18:00',
  longueur: 20,
  mode: 'apprentissage',
  courseTitle: 'Anglais',
  courseIcon: null,
  courseColor: null,
  chapterTitle: 'Verbes irréguliers',
  ...over,
})

describe('normalizePlan', () => {
  it('lit une ligne de carnet_plans', () => {
    const p = normalizePlan({
      id: 'p1',
      course_id: 'c1',
      chapter_id: 'ch1',
      days: [3, 0, 3],
      at_time: '18:00',
      length: 20,
      mode: 'entrainement',
    })
    expect(p).toEqual({
      id: 'p1',
      courseId: 'c1',
      chapterId: 'ch1',
      days: [0, 3],
      time: '18:00',
      longueur: 20,
      mode: 'entrainement',
    })
  })

  it('rend null sans id, sans cours ou sans jour', () => {
    expect(normalizePlan(null)).toBeNull()
    expect(normalizePlan({ id: 'p', course_id: 'c', days: [] })).toBeNull()
    expect(normalizePlan({ id: 'p', days: [1] })).toBeNull()
  })

  it('retombe sur les défauts pour une heure, une longueur ou un mode invalides', () => {
    const p = normalizePlan({ id: 'p', course_id: 'c', days: [1], at_time: '25:99', length: 33, mode: 'x' })
    expect(p?.time).toBeNull()
    expect(p?.longueur).toBeNull()
    expect(p?.mode).toBe('apprentissage')
  })

  it('normalizeDays rejette hors bornes et non-entiers', () => {
    expect(normalizeDays([7, -1, 2.5, '4', 4])).toEqual([4])
    expect(normalizeDays('lundi')).toEqual([])
  })
})

describe('les libellés et l’URL', () => {
  it('dit les jours et l’heure', () => {
    expect(libelleJours({ days: [0, 2, 4], time: '18:00' })).toBe('Lun · Mer · Ven à 18:00')
    expect(libelleJours({ days: [6], time: null })).toBe('Le dimanche')
    expect(libelleJours({ days: [0, 1, 2, 3, 4, 5, 6], time: '07:30' })).toBe('Tous les jours à 07:30')
  })

  it('dit la session', () => {
    expect(libelleSession({ longueur: 20, mode: 'apprentissage' })).toBe('20 cartes')
    expect(libelleSession({ longueur: null, mode: 'examen' })).toBe('Tout ce qui est dû · examen blanc')
  })

  it('ouvre la session du plan avec les mêmes paramètres que la feuille d’options', () => {
    expect(hrefDuPlan(plan())).toBe('/carnet/cours/c1/reviser?chapitre=ch1&long=20')
    expect(hrefDuPlan(plan({ chapterId: null, longueur: null, mode: 'examen' }))).toBe(
      '/carnet/cours/c1/reviser?mode=examen',
    )
  })
})

describe('la semaine', () => {
  it('trouve le lundi et déroule sept jours', () => {
    expect(lundiDe('2026-09-05')).toBe('2026-08-31') // samedi → lundi
    expect(lundiDe('2026-08-31')).toBe('2026-08-31')
    expect(joursDeLaSemaine('2026-08-31')).toEqual([
      '2026-08-31',
      '2026-09-01',
      '2026-09-02',
      '2026-09-03',
      '2026-09-04',
      '2026-09-05',
      '2026-09-06',
    ])
  })

  it('un plan est tenu par une session du même dossier, ou du cours entier, ce jour-là', () => {
    const p = plan()
    expect(planTenu(p, [{ courseId: 'c1', chapterId: 'ch1', dayKey: '2026-09-03' }], '2026-09-03')).toBe(true)
    expect(planTenu(p, [{ courseId: 'c1', chapterId: null, dayKey: '2026-09-03' }], '2026-09-03')).toBe(true)
    expect(planTenu(p, [{ courseId: 'c1', chapterId: 'ch2', dayKey: '2026-09-03' }], '2026-09-03')).toBe(false)
    expect(planTenu(p, [{ courseId: 'c1', chapterId: 'ch1', dayKey: '2026-09-02' }], '2026-09-03')).toBe(false)
  })

  it('pose les plans sur leurs jours, triés par heure, et marque passé / aujourd’hui', () => {
    const jours = semaineDuPlanning(
      [plan(), plan({ id: 'p2', days: [3], time: null, courseTitle: 'Maths', chapterId: null, chapterTitle: null })],
      [{ courseId: 'c1', chapterId: 'ch1', dayKey: '2026-08-31' }],
      '2026-09-03',
    )
    expect(jours).toHaveLength(7)
    expect(jours[0].creneaux.map((c) => c.fait)).toEqual([true])
    expect(jours[0].passe).toBe(true)
    expect(jours[3].aujourdhui).toBe(true)
    expect(jours[3].creneaux.map((c) => c.plan.id)).toEqual(['p1', 'p2'])
    expect(jours[1].creneaux).toEqual([])
  })

  it('fait le bilan et le dit', () => {
    const jours = semaineDuPlanning(
      [plan({ days: [0, 3, 5] })],
      [{ courseId: 'c1', chapterId: 'ch1', dayKey: '2026-08-31' }],
      '2026-09-03',
    )
    const b = bilanSemaine(jours)
    expect(b).toEqual({ prevus: 3, tenus: 1, manques: 0, restantAujourdhui: 1 })
    expect(phraseSemaine(b)).toBe('Une révision t’attend aujourd’hui.')
    expect(phraseSemaine({ prevus: 0, tenus: 0, manques: 0, restantAujourdhui: 0 })).toMatch(/Choisis un dossier/)
    expect(phraseSemaine({ prevus: 3, tenus: 3, manques: 0, restantAujourdhui: 0 })).toMatch(/Tout est fait/)
    expect(phraseSemaine({ prevus: 3, tenus: 1, manques: 1, restantAujourdhui: 0 })).toBe(
      '1 tenue sur 3 — 1 manquée, la suite reste à prendre.',
    )
  })
})

describe('proposerAvantControle', () => {
  const dossiers = [
    { chapterId: 'a', titre: 'A', cartes: 30 },
    { chapterId: 'b', titre: 'B', cartes: 10 },
    { chapterId: 'c', titre: 'C', cartes: 0 },
  ]

  it('rien si le contrôle est passé ou aujourd’hui, ou sans cartes', () => {
    expect(proposerAvantControle('2026-09-01', '2026-09-03', dossiers)).toEqual([])
    expect(proposerAvantControle('2026-09-03', '2026-09-03', dossiers)).toEqual([])
    expect(proposerAvantControle('2026-09-10', '2026-09-03', [{ chapterId: 'c', titre: 'C', cartes: 0 }])).toEqual([])
  })

  it('répartit les dossiers à cartes sur les jours restants, gros dossiers d’abord, veille = révision générale', () => {
    // Jeudi 3 → contrôle mercredi 9 : 6 jours restants, veille = mardi (1).
    const plans = proposerAvantControle('2026-09-09', '2026-09-03', dossiers)
    expect(plans.map((p) => p.chapterId)).toEqual(['a', 'b', null])
    expect(plans[2].days).toEqual([1])
    const tous = plans.slice(0, 2).flatMap((p) => p.days)
    expect(tous).not.toContain(1)
    expect(new Set(tous).size).toBe(tous.length)
    expect(plans[0].days.length).toBeGreaterThanOrEqual(plans[1].days.length)
  })

  it('un contrôle demain : tout le cours aujourd’hui même, sans veille séparée', () => {
    const plans = proposerAvantControle('2026-09-04', '2026-09-03', dossiers)
    expect(plans.every((p) => p.days.length >= 1)).toBe(true)
    expect(plans.some((p) => p.chapterId === null)).toBe(false)
  })
})
