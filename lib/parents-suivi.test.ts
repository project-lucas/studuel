import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  ALERT_DAYS_BOUNDS,
  CONTROLE_IMMINENT_DAYS,
  DEFAULT_PARENT_PREFS,
  GOAL_MINUTES_BOUNDS,
  GOAL_PRESETS,
  TREND_STABLE_RATIO,
  chaptersLabel,
  clampParentPrefs,
  controleViews,
  goalProgress,
  inactivityAlert,
  subjectRows,
  trendSentence,
  weekLabel,
  weekLabelShort,
  weekTrend,
  type WeekPoint,
} from './parents-suivi'

// Un lundi, pour que les libellés de semaine soient lisibles dans les tests.
const LUNDI = '2026-08-24'

function semaines(...secondes: number[]): WeekPoint[] {
  return secondes.map((s, i) => ({
    start: `2026-08-${String(3 + i * 7).padStart(2, '0')}`,
    seconds: s,
    active_days: s > 0 ? 3 : 0,
  }))
}

describe('clampParentPrefs — le formulaire refuse avant Postgres', () => {
  it('garde une saisie valide telle quelle', () => {
    expect(clampParentPrefs({ weeklyGoalMinutes: 150, alertAfterDays: 5 })).toEqual({
      weeklyGoalMinutes: 150,
      alertAfterDays: 5,
    })
  })

  it('ramène une saisie hors bornes sur la borne, sans échouer', () => {
    expect(clampParentPrefs({ weeklyGoalMinutes: 99_999, alertAfterDays: 400 })).toEqual({
      weeklyGoalMinutes: GOAL_MINUTES_BOUNDS.max,
      alertAfterDays: ALERT_DAYS_BOUNDS.max,
    })
    expect(clampParentPrefs({ weeklyGoalMinutes: 0, alertAfterDays: -3 })).toEqual({
      weeklyGoalMinutes: GOAL_MINUTES_BOUNDS.min,
      alertAfterDays: ALERT_DAYS_BOUNDS.min,
    })
  })

  it('retombe sur les valeurs par défaut quand la saisie n’est pas un nombre', () => {
    expect(clampParentPrefs({})).toEqual(DEFAULT_PARENT_PREFS)
    expect(
      clampParentPrefs({
        weeklyGoalMinutes: Number.NaN,
        alertAfterDays: Number.NaN,
      }),
    ).toEqual(DEFAULT_PARENT_PREFS)
  })

  it('0 jour reste 0 : c’est « alerte désactivée », pas une valeur invalide', () => {
    expect(clampParentPrefs({ alertAfterDays: 0 }).alertAfterDays).toBe(0)
  })

  it('tous les paliers proposés tiennent dans les bornes', () => {
    for (const preset of GOAL_PRESETS) {
      expect(preset.minutes).toBeGreaterThanOrEqual(GOAL_MINUTES_BOUNDS.min)
      expect(preset.minutes).toBeLessThanOrEqual(GOAL_MINUTES_BOUNDS.max)
    }
  })
})

describe('DEFAULT_PARENT_PREFS — miroir de la migration 319', () => {
  // Le mode de panne visé : quelqu'un change un DEFAULT côté SQL, l'écran
  // continue d'annoncer l'ancien au parent qui n'a rien réglé, et les deux
  // divergent sans qu'aucune erreur ne soit levée.
  const sql = readFileSync(
    join(process.cwd(), 'supabase', '319_espace_parents_v2.sql'),
    'utf8',
  )

  it('l’objectif par défaut est celui de la table', () => {
    const m = sql.match(/weekly_goal_minutes\s+INTEGER NOT NULL DEFAULT (\d+)/)
    expect(m).not.toBeNull()
    expect(Number(m![1])).toBe(DEFAULT_PARENT_PREFS.weeklyGoalMinutes)
  })

  it('le seuil d’alerte par défaut est celui de la table', () => {
    const m = sql.match(/alert_after_days\s+INTEGER NOT NULL DEFAULT (\d+)/)
    expect(m).not.toBeNull()
    expect(Number(m![1])).toBe(DEFAULT_PARENT_PREFS.alertAfterDays)
  })

  it('les bornes du formulaire sont celles des CHECK', () => {
    expect(sql).toContain(
      `weekly_goal_minutes BETWEEN ${GOAL_MINUTES_BOUNDS.min} AND ${GOAL_MINUTES_BOUNDS.max}`,
    )
    expect(sql).toContain(
      `alert_after_days BETWEEN ${ALERT_DAYS_BOUNDS.min} AND ${ALERT_DAYS_BOUNDS.max}`,
    )
  })
})

describe('goalProgress — la jauge de la semaine', () => {
  it('rapporte le temps fait à l’objectif', () => {
    // 45 min faites sur un objectif de 90 min.
    const p = goalProgress(45 * 60, 90)
    expect(p.percent).toBe(50)
    expect(p.reached).toBe(false)
    expect(p.remainingSeconds).toBe(45 * 60)
  })

  it('écrête la barre mais signale le dépassement', () => {
    const p = goalProgress(300 * 60, 90)
    expect(p.ratio).toBe(1)
    expect(p.percent).toBe(100)
    expect(p.reached).toBe(true)
    expect(p.remainingSeconds).toBe(0)
  })

  it('une semaine vide vaut 0 %, pas une division par zéro', () => {
    expect(goalProgress(0, 0).percent).toBe(0)
    expect(goalProgress(0, 90).remainingSeconds).toBe(90 * 60)
  })
})

describe('weekTrend — ça monte ou ça descend ?', () => {
  it('sans donnée, ne prétend aucune tendance', () => {
    expect(weekTrend([])).toEqual({
      points: [],
      direction: 'inconnue',
      deltaPercent: null,
    })
    expect(weekTrend(undefined).direction).toBe('inconnue')
  })

  it('rapporte chaque barre à la plus haute des quatre, pas à l’objectif', () => {
    const t = weekTrend(semaines(600, 1200, 0, 2400))
    expect(t.points.map((p) => p.ratio)).toEqual([0.25, 0.5, 0, 1])
  })

  it('nomme une hausse et la chiffre', () => {
    const t = weekTrend(semaines(600, 600, 1000, 2000))
    expect(t.direction).toBe('hausse')
    expect(t.deltaPercent).toBe(100)
  })

  it('nomme une baisse', () => {
    const t = weekTrend(semaines(600, 600, 2000, 1000))
    expect(t.direction).toBe('baisse')
    expect(t.deltaPercent).toBe(-50)
  })

  it('ne transforme pas du bruit en flèche', () => {
    // +10 % : sous le seuil, donc « stable ».
    const t = weekTrend(semaines(600, 600, 1000, 1100))
    expect(Math.abs(t.deltaPercent!) / 100).toBeLessThan(TREND_STABLE_RATIO)
    expect(t.direction).toBe('stable')
  })

  it('repartir de zéro est une hausse, mais sans pourcentage', () => {
    // Diviser par une semaine à zéro donnerait « +∞ % » : on nomme la
    // direction et on renonce au chiffre.
    const t = weekTrend(semaines(600, 600, 0, 1800))
    expect(t.direction).toBe('hausse')
    expect(t.deltaPercent).toBeNull()
  })

  it('deux semaines vides d’affilée ne sont pas une tendance', () => {
    const t = weekTrend(semaines(600, 600, 0, 0))
    expect(t.direction).toBe('inconnue')
    expect(t.deltaPercent).toBeNull()
  })

  it('chaque direction a sa phrase', () => {
    for (const d of ['hausse', 'stable', 'baisse', 'inconnue'] as const) {
      expect(trendSentence(d).length).toBeGreaterThan(10)
    }
  })
})

describe('weekLabel — une semaine se nomme, elle ne se date pas', () => {
  it('situe les semaines par rapport à aujourd’hui', () => {
    expect(weekLabel('2026-08-24', LUNDI)).toBe('Cette semaine')
    expect(weekLabel('2026-08-17', LUNDI)).toBe('Semaine dernière')
    expect(weekLabel('2026-08-10', LUNDI)).toBe('Il y a 2 semaines')
    expect(weekLabel('2026-08-03', LUNDI)).toBe('Il y a 3 semaines')
  })

  it('marche depuis n’importe quel jour de la semaine, pas seulement lundi', () => {
    // Dimanche 30/08 : la semaine du 24 reste « cette semaine ».
    expect(weekLabel('2026-08-24', '2026-08-30')).toBe('Cette semaine')
    expect(weekLabel('2026-08-17', '2026-08-30')).toBe('Semaine dernière')
  })

  it('a une version courte pour l’axe du graphique', () => {
    expect(weekLabelShort('2026-08-24', LUNDI)).toBe('Cette sem.')
    expect(weekLabelShort('2026-08-10', LUNDI)).toBe('S-2')
  })
})

describe('inactivityAlert — alerter sans accuser', () => {
  it('alerte au-delà du seuil réglé', () => {
    const a = inactivityAlert('2026-08-20', 3, LUNDI)
    expect(a).not.toBeNull()
    expect(a!.daysSince).toBe(4)
    expect(a!.message).toContain('4 jours')
  })

  it('se tait tant que le seuil n’est pas atteint', () => {
    expect(inactivityAlert('2026-08-22', 3, LUNDI)).toBeNull()
  })

  it('se tait si le parent a désactivé l’alerte', () => {
    expect(inactivityAlert('2026-01-01', 0, LUNDI)).toBeNull()
  })

  it('n’accuse jamais un compte qui n’a jamais rien fait', () => {
    // Le mode de panne visé : accueillir chaque nouveau parent par
    // « inactif depuis toujours ».
    expect(inactivityAlert(null, 3, LUNDI)).toBeNull()
    expect(inactivityAlert(undefined, 3, LUNDI)).toBeNull()
  })

  it('accorde le message au singulier', () => {
    expect(inactivityAlert('2026-08-23', 1, LUNDI)!.message).toContain('hier')
  })
})

describe('controleViews — l’agenda du parent', () => {
  const noms = { maths: 'Mathématiques', 'physique-chimie': 'Physique-chimie' }

  const brut = [
    {
      id: 'c2',
      subject_slug: 'physique-chimie',
      chapters: [{ title: 'Les ondes' }],
      exam_date: '2026-09-04',
    },
    {
      id: 'c1',
      subject_slug: 'maths',
      chapters: [{ title: 'Les fonctions affines' }, { title: 'Thalès' }],
      exam_date: '2026-08-26',
    },
  ]

  it('classe du plus proche au plus lointain et nomme la matière', () => {
    const vues = controleViews(brut, noms, LUNDI)
    expect(vues.map((v) => v.id)).toEqual(['c1', 'c2'])
    expect(vues[0].subjectName).toBe('Mathématiques')
    expect(vues[0].chaptersLabel).toBe('Les fonctions affines et Thalès')
  })

  it('compte à rebours en mots et non en J-n', () => {
    const vues = controleViews(brut, noms, LUNDI)
    expect(vues[0].countdown).toBe('Dans 2 jours')
    expect(controleViews(brut, noms, '2026-08-26')[0].countdown).toBe("Aujourd'hui")
    expect(controleViews(brut, noms, '2026-08-25')[0].countdown).toBe('Demain')
  })

  it('marque l’imminence au même seuil que l’écran de l’élève', () => {
    const vues = controleViews(brut, noms, LUNDI)
    expect(CONTROLE_IMMINENT_DAYS).toBe(2)
    expect(vues[0].imminent).toBe(true) // J-2
    expect(vues[1].imminent).toBe(false) // J-11
  })

  it('garde un contrôle dont la matière a quitté le catalogue', () => {
    // La matière n'est plus nommable, mais la DATE reste vraie — et c'est la
    // date qui intéresse le parent.
    const vues = controleViews(brut, {}, LUNDI)
    expect(vues).toHaveLength(2)
    expect(vues[0].subjectName).toBe('maths')
  })

  it('tolère l’absence de la migration 319', () => {
    expect(controleViews(undefined, noms, LUNDI)).toEqual([])
    expect(controleViews(null, noms, LUNDI)).toEqual([])
  })
})

describe('chaptersLabel — une phrase, jamais une liste', () => {
  it('met les titres en phrase et compte le reste au-delà de deux', () => {
    expect(chaptersLabel([{ title: 'A' }])).toBe('A')
    expect(chaptersLabel([{ title: 'A' }, { title: 'B' }])).toBe('A et B')
    expect(chaptersLabel([{ title: 'A' }, { title: 'B' }, { title: 'C' }])).toBe(
      'A, B et 1 autre',
    )
    expect(
      chaptersLabel([{ title: 'A' }, { title: 'B' }, { title: 'C' }, { title: 'D' }]),
    ).toBe('A, B et 2 autres')
  })

  it('le dit quand aucun chapitre n’est renseigné', () => {
    expect(chaptersLabel([])).toBe('Chapitres non précisés')
    expect(chaptersLabel([{ title: '   ' }])).toBe('Chapitres non précisés')
    expect(chaptersLabel(null)).toBe('Chapitres non précisés')
  })
})

describe('subjectRows — toutes les matières, pas seulement les trois pires', () => {
  const per = [
    { subject: 'Maths', ratio: 0.9, attempts: 8 },
    { subject: 'Anglais', ratio: 0.4, attempts: 5 },
    { subject: 'SVT', ratio: 0.2, attempts: 1 }, // pas assez d'essais
    { subject: 'Histoire', ratio: 0.65, attempts: 3 },
  ]

  it('rend TOUTES les matières, de la plus fragile à la mieux tenue', () => {
    const rows = subjectRows(per)
    expect(rows).toHaveLength(4)
    expect(rows.map((r) => r.subject)).toEqual([
      'Anglais',
      'Histoire',
      'Maths',
      'SVT',
    ])
  })

  it('range les matières non jugeables en fin de liste, sans les cacher', () => {
    // Les cacher ferait croire qu'elles n'ont pas été abordées — c'est faux,
    // et c'est justement là qu'un parent peut agir.
    const rows = subjectRows(per)
    expect(rows[rows.length - 1]).toMatchObject({ subject: 'SVT', judgeable: false })
    expect(rows.slice(0, 3).every((r) => r.judgeable)).toBe(true)
  })

  it('ne modifie pas le tableau reçu', () => {
    const copie = [...per]
    subjectRows(per)
    expect(per).toEqual(copie)
  })
})
