import { describe, it, expect } from 'vitest'
import {
  BARS,
  HORIZONS,
  MIN_COHORT,
  SESSIONS_TARGET,
  aggregate,
  averageSessionsPerUser,
  cohortView,
  funnelView,
  headline,
  normalizeDashboard,
  percent,
  rate,
  sessionsPerUser,
  verdictFor,
  worstStep,
  type Cohort,
  type Dashboard,
} from './retention'

function cohort(
  day: string,
  size: number,
  d1: number,
  d7 = 0,
  d30 = 0,
  measurable = { d1: true, d7: true, d30: true },
): Cohort {
  return { day, size, retained: { d1, d7, d30 }, measurable }
}

describe('rate', () => {
  it('calcule un taux borné', () => {
    expect(rate(50, 100)).toBe(0.5)
    expect(rate(200, 100)).toBe(1)
    expect(rate(-5, 100)).toBe(0)
  })

  it('renvoie null sur une cohorte vide (0/0 n’est pas 0 %)', () => {
    expect(rate(0, 0)).toBeNull()
    expect(rate(5, -1)).toBeNull()
    expect(rate(Number.NaN, 10)).toBeNull()
  })
})

describe('verdictFor', () => {
  it('classe par rapport aux barres', () => {
    expect(verdictFor('d1', 0.2, 100)).toBe('alerte')
    expect(verdictFor('d1', 0.42, 100)).toBe('correct')
    expect(verdictFor('d1', 0.6, 100)).toBe('bon')
  })

  it('refuse de juger une cohorte trop petite', () => {
    expect(verdictFor('d1', 0.5, MIN_COHORT - 1)).toBe('inconnu')
    expect(verdictFor('d1', 0.5, MIN_COHORT)).toBe('bon')
  })

  it('refuse de juger une valeur absente', () => {
    expect(verdictFor('d7', null, 500)).toBe('inconnu')
  })

  it('a des barres décroissantes de J+1 à J+30', () => {
    expect(BARS.d1.alerte).toBeGreaterThan(BARS.d7.alerte)
    expect(BARS.d7.alerte).toBeGreaterThan(BARS.d30.alerte)
    for (const h of HORIZONS) expect(BARS[h].bon).toBeGreaterThan(BARS[h].alerte)
  })
})

describe('percent', () => {
  it('formate à l’entier avec l’espace insécable du français', () => {
    expect(percent(0.427)).toBe('43 %')
    expect(percent(0)).toBe('0 %')
    expect(percent(null)).toBe('—')
  })
})

describe('cohortView', () => {
  it('calcule taux et verdicts par horizon', () => {
    const v = cohortView(cohort('2026-07-01', 100, 50, 25, 10))
    expect(v.rates.d1).toBe(0.5)
    expect(v.verdicts.d1).toBe('bon')
    expect(v.verdicts.d7).toBe('bon')
    expect(v.verdicts.d30).toBe('correct')
  })

  it('n’invente pas un taux pour un horizon pas encore atteint', () => {
    const v = cohortView(
      cohort('2026-07-24', 100, 50, 0, 0, { d1: true, d7: false, d30: false }),
    )
    expect(v.rates.d1).toBe(0.5)
    // Une cohorte d'hier ne peut pas avoir de J+7 : null, pas 0 %.
    expect(v.rates.d7).toBeNull()
    expect(v.rates.d30).toBeNull()
    expect(v.verdicts.d7).toBe('inconnu')
  })
})

describe('aggregate', () => {
  it('pondère par la taille des cohortes, pas par leur nombre', () => {
    const cohorts = [
      cohort('2026-07-01', 1000, 400), // 40 %
      cohort('2026-07-02', 10, 10), // 100 % mais 10 élèves
    ]
    const agg = aggregate(cohorts, 'd1')
    // Moyenne des taux = 70 % ; pondérée = 410/1010 ≈ 41 %.
    expect(agg.rate).toBeCloseTo(410 / 1010, 5)
    expect(agg.size).toBe(1010)
  })

  it('ignore les cohortes non mesurables', () => {
    const cohorts = [
      cohort('2026-07-01', 100, 50),
      cohort('2026-07-24', 100, 0, 0, 0, { d1: false, d7: false, d30: false }),
    ]
    const agg = aggregate(cohorts, 'd1')
    expect(agg.size).toBe(100)
    expect(agg.rate).toBe(0.5)
  })

  it('renvoie null sans aucune cohorte mesurable', () => {
    const agg = aggregate([], 'd30')
    expect(agg.rate).toBeNull()
    expect(agg.verdict).toBe('inconnu')
  })
})

describe('funnelView', () => {
  const steps = [
    { id: 'inscrits', label: 'Inscrits', count: 100 },
    { id: 'classe', label: 'Classe choisie', count: 80 },
    { id: 'activite', label: 'Première activité', count: 30 },
    { id: 'j1', label: 'Revenus J+1', count: 20 },
  ]

  it('calcule la part de l’étape précédente et du total', () => {
    const v = funnelView(steps)
    expect(v[0].ofPrevious).toBe(1)
    expect(v[1].ofPrevious).toBe(0.8)
    expect(v[2].ofPrevious).toBeCloseTo(30 / 80, 5)
    expect(v[3].ofTotal).toBe(0.2)
  })

  it('compte les perdus à chaque marche', () => {
    const v = funnelView(steps)
    expect(v[1].lost).toBe(20)
    expect(v[2].lost).toBe(50)
  })

  it('survit à un entonnoir vide', () => {
    expect(funnelView([])).toEqual([])
    const zero = funnelView([{ id: 'a', label: 'A', count: 0 }])
    expect(zero[0].ofTotal).toBeNull()
  })
})

describe('worstStep', () => {
  it('désigne la marche qui saigne le plus', () => {
    const v = funnelView([
      { id: 'a', label: 'A', count: 100 },
      { id: 'b', label: 'B', count: 90 },
      { id: 'c', label: 'C', count: 30 },
    ])
    expect(worstStep(v)?.id).toBe('c')
  })

  it('ne désigne jamais la première marche', () => {
    const v = funnelView([{ id: 'a', label: 'A', count: 100 }])
    expect(worstStep(v)).toBeNull()
  })

  it('renvoie null sur un entonnoir sans perte', () => {
    const v = funnelView([
      { id: 'a', label: 'A', count: 10 },
      { id: 'b', label: 'B', count: 10 },
    ])
    expect(worstStep(v)).toBeNull()
  })
})

describe('activité', () => {
  it('calcule les sessions par élève actif', () => {
    expect(sessionsPerUser({ day: 'x', activeUsers: 40, sessions: 100 })).toBe(2.5)
    expect(sessionsPerUser({ day: 'x', activeUsers: 0, sessions: 0 })).toBeNull()
  })

  it('moyenne en ignorant les jours sans aucun actif', () => {
    const avg = averageSessionsPerUser([
      { day: 'a', activeUsers: 10, sessions: 30 },
      { day: 'b', activeUsers: 0, sessions: 0 },
      { day: 'c', activeUsers: 10, sessions: 10 },
    ])
    expect(avg).toBe(2) // 40 sessions / 20 actifs, le jour vide ne compte pas
  })

  it('renvoie null sans aucune journée active', () => {
    expect(averageSessionsPerUser([])).toBeNull()
    expect(
      averageSessionsPerUser([{ day: 'a', activeUsers: 0, sessions: 5 }]),
    ).toBeNull()
  })

  it('vise une cible d’engagement cohérente avec le jeu', () => {
    expect(SESSIONS_TARGET).toBeGreaterThan(1)
  })
})

function makeDashboard(over: Partial<Dashboard> = {}): Dashboard {
  return { cohorts: [], funnel: [], activity: [], totalUsers: 0, ...over }
}

describe('headline', () => {
  it('refuse de conclure sur trop peu de monde', () => {
    const d = makeDashboard({ cohorts: [cohort('2026-07-01', 5, 3)] })
    expect(headline(d)).toContain('Trop peu')
  })

  it('désigne le premier jour quand J+1 est sous la barre', () => {
    const d = makeDashboard({ cohorts: [cohort('2026-07-01', 200, 40, 20, 10)] })
    expect(headline(d)).toContain('PREMIER jour')
  })

  it('désigne le rendez-vous quotidien quand J+7 lâche', () => {
    const d = makeDashboard({ cohorts: [cohort('2026-07-01', 200, 110, 10, 5)] })
    expect(headline(d)).toContain('revenir')
  })

  it('désigne le clan quand J+30 s’effondre', () => {
    const d = makeDashboard({ cohorts: [cohort('2026-07-01', 200, 110, 60, 4)] })
    expect(headline(d)).toContain('clan')
  })

  it('autorise à investir quand tout tient', () => {
    const d = makeDashboard({ cohorts: [cohort('2026-07-01', 200, 120, 60, 30)] })
    expect(headline(d)).toContain('investir')
  })
})

describe('normalizeDashboard', () => {
  it('lit une réponse complète et trie', () => {
    const d = normalizeDashboard({
      total_users: 412,
      cohorts: [
        { day: '2026-07-01', size: 10, d1: 5, d7: 2, d30: 1, d1_measurable: true, d7_measurable: true, d30_measurable: false },
        { day: '2026-07-02', size: 12, d1: 6, d7: 0, d30: 0, d1_measurable: true, d7_measurable: false, d30_measurable: false },
      ],
      funnel: [{ id: 'inscrits', label: 'Inscrits', count: 100 }],
      activity: [
        { day: '2026-07-02', active_users: 8, sessions: 20 },
        { day: '2026-07-01', active_users: 5, sessions: 10 },
      ],
    })
    expect(d.totalUsers).toBe(412)
    expect(d.cohorts[0].day).toBe('2026-07-02') // cohortes : plus récent d'abord
    expect(d.cohorts[0].measurable.d7).toBe(false)
    expect(d.activity[0].day).toBe('2026-07-01') // activité : chronologique
  })

  it('survit à une réponse nulle ou partielle', () => {
    const d = normalizeDashboard(null)
    expect(d.cohorts).toEqual([])
    expect(d.funnel).toEqual([])
    expect(d.activity).toEqual([])
    expect(d.totalUsers).toBe(0)
  })

  it('écarte les lignes sans identifiant et n’accepte pas de négatif', () => {
    const d = normalizeDashboard({
      cohorts: [{ size: 10 }, { day: '2026-07-01', size: -5, d1: -2 }],
      funnel: [{ label: 'sans id', count: 3 }],
      activity: [{ active_users: 4 }],
    })
    expect(d.cohorts).toHaveLength(1)
    expect(d.cohorts[0].size).toBe(0)
    expect(d.funnel).toEqual([])
    expect(d.activity).toEqual([])
  })
})
