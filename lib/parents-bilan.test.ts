import { describe, expect, it } from 'vitest'
import type { ChildDashboard } from './parents'
import { DEFAULT_PARENT_PREFS } from './parents-suivi'
import { CONSEILS } from './parents-conseils'
import { MAX_GESTES, bilanSemaine, gestesDeLaSemaine, type BilanEntree } from './parents-bilan'

// Un jeudi.
const TODAY = '2026-09-24'

function dashboard(over: Partial<ChildDashboard> = {}): ChildDashboard {
  return {
    full_name: 'Léa',
    work_seconds: 5 * 3600,
    week_seconds: 80 * 60,
    week_active_days: 4,
    active_days: ['2026-09-21', '2026-09-22', '2026-09-23', '2026-09-24'],
    sessions_total: 30,
    sessions_7: 6,
    avg_ratio: 0.7,
    per_subject: [
      { subject: 'Mathématiques', ratio: 0.45, attempts: 6 },
      { subject: 'Histoire-Géo', ratio: 0.88, attempts: 5 },
      { subject: 'Anglais', ratio: 0.7, attempts: 1 },
    ],
    grade_level: '4e',
    weeks: [
      { start: '2026-08-31', seconds: 40 * 60, active_days: 2 },
      { start: '2026-09-07', seconds: 50 * 60, active_days: 3 },
      { start: '2026-09-14', seconds: 60 * 60, active_days: 3 },
      { start: '2026-09-21', seconds: 80 * 60, active_days: 4 },
    ],
    controles: [],
    last_activity: '2026-09-24',
    ...over,
  }
}

function entree(over: Partial<BilanEntree> = {}): BilanEntree {
  return {
    displayName: 'Léa',
    dashboard: dashboard(),
    prefs: DEFAULT_PARENT_PREFS,
    streak: 4,
    today: TODAY,
    subjectNames: { maths: 'Mathématiques', 'histoire-geo': 'Histoire-Géo' },
    ...over,
  }
}

describe('bilanSemaine — les phrases qu’un parent lit en dix secondes', () => {
  it('ouvre sur le temps de la semaine, rapporté à l’objectif', () => {
    const b = bilanSemaine(entree())
    expect(b.phrases[0]).toBe(
      'Léa a révisé 1 h 20 sur 4 jours cette semaine, soit 89 % de l’objectif.',
    )
    expect(b.ton).toBe('neutre')
  })

  it('dit la pente, la série, le point fort et la matière à surveiller', () => {
    const texte = bilanSemaine(entree()).phrases.join(' ')
    expect(texte).toContain('plus que la semaine dernière (+33 %)')
    expect(texte).toContain('Sa série tient depuis 4 jours.')
    expect(texte).toContain('Point fort : Histoire-Géo (88 %)')
    expect(texte).toContain('À surveiller : Mathématiques (45 %)')
  })

  it('ne juge pas une matière sur un seul quiz', () => {
    const texte = bilanSemaine(entree()).phrases.join(' ')
    expect(texte).not.toContain('Anglais')
  })

  it('fête un objectif atteint', () => {
    const b = bilanSemaine(
      entree({ dashboard: dashboard({ week_seconds: 100 * 60, week_active_days: 5 }) }),
    )
    expect(b.phrases[0]).toContain('objectif atteint')
    expect(b.ton).toBe('bravo')
  })

  it('nomme le prochain contrôle en mots', () => {
    const b = bilanSemaine(
      entree({
        dashboard: dashboard({
          controles: [
            { id: 'c1', subject_slug: 'maths', chapters: [], exam_date: '2026-09-25' },
            { id: 'c2', subject_slug: 'histoire-geo', chapters: [], exam_date: '2026-10-05' },
          ],
        }),
      }),
    )
    expect(b.phrases.at(-1)).toBe('Prochain contrôle : Mathématiques, demain.')
  })

  it('distingue « pas commencé » de « inactif »', () => {
    const neuf = bilanSemaine(
      entree({
        streak: 0,
        dashboard: dashboard({
          work_seconds: 0,
          week_seconds: 0,
          week_active_days: 0,
          sessions_total: 0,
          sessions_7: 0,
          per_subject: [],
          active_days: [],
          last_activity: null,
        }),
      }),
    )
    expect(neuf.phrases).toHaveLength(1)
    expect(neuf.phrases[0]).toContain('pas encore commencé')
    expect(neuf.ton).toBe('neutre')

    const decroche = bilanSemaine(
      entree({
        streak: 0,
        dashboard: dashboard({
          week_seconds: 0,
          week_active_days: 0,
          last_activity: '2026-09-10',
          weeks: [
            { start: '2026-08-31', seconds: 40 * 60, active_days: 2 },
            { start: '2026-09-07', seconds: 50 * 60, active_days: 3 },
            { start: '2026-09-14', seconds: 0, active_days: 0 },
            { start: '2026-09-21', seconds: 0, active_days: 0 },
          ],
        }),
      }),
    )
    expect(decroche.phrases[0]).toBe('Léa n’a pas révisé ces sept derniers jours.')
    expect(decroche.ton).toBe('attention')
    // Une semaine à zéro ne se commente pas d'un « −100 % ».
    expect(decroche.phrases.join(' ')).not.toContain('semaine dernière')
  })

  it('ne dit « à surveiller » que d’une matière fragile', () => {
    const b = bilanSemaine(
      entree({
        dashboard: dashboard({
          per_subject: [
            { subject: 'Français', ratio: 0.62, attempts: 4 },
            { subject: 'Mathématiques', ratio: 0.58, attempts: 3 },
          ],
        }),
      }),
    )
    const texte = b.phrases.join(' ')
    expect(texte).toContain('Point fort : Français (62 %).')
    expect(texte).not.toContain('À surveiller')
  })

  it('se passe d’objectif et de tendance quand la migration 319 n’est pas passée', () => {
    const b = bilanSemaine(
      entree({ dashboard: dashboard({ weeks: undefined, controles: undefined }) }),
    )
    expect(b.phrases[0]).toBe('Léa a révisé 1 h 20 sur 4 jours cette semaine.')
    expect(b.phrases.join(' ')).not.toContain('semaine dernière')
    expect(b.phrases.join(' ')).not.toContain('contrôle')
  })
})

describe('gestesDeLaSemaine — ce que le parent peut faire', () => {
  it('n’en donne jamais plus de trois, et jamais zéro', () => {
    expect(gestesDeLaSemaine(entree()).length).toBeLessThanOrEqual(MAX_GESTES)
    expect(gestesDeLaSemaine(entree()).length).toBeGreaterThan(0)
    const vide = entree({
      streak: 0,
      dashboard: dashboard({ per_subject: [], controles: undefined, weeks: undefined }),
    })
    expect(gestesDeLaSemaine(vide).length).toBeGreaterThan(0)
  })

  it('relie chaque geste à une fiche de conseil qui existe', () => {
    const ids = new Set(CONSEILS.map((c) => c.id))
    const cas = [
      entree(),
      entree({
        dashboard: dashboard({
          controles: [{ id: 'c1', subject_slug: 'maths', chapters: [], exam_date: '2026-09-25' }],
        }),
      }),
      entree({ streak: 0, dashboard: dashboard({ last_activity: '2026-09-10', week_seconds: 0 }) }),
      entree({ dashboard: dashboard({ work_seconds: 0, sessions_total: 0, last_activity: null }) }),
    ]
    for (const c of cas) {
      for (const g of gestesDeLaSemaine(c)) expect(ids.has(g.conseilId), g.id).toBe(true)
    }
  })

  it('met le contrôle imminent en premier, avec le passage à froid', () => {
    const g = gestesDeLaSemaine(
      entree({
        dashboard: dashboard({
          controles: [{ id: 'c1', subject_slug: 'maths', chapters: [], exam_date: '2026-09-25' }],
        }),
      }),
    )
    expect(g[0].id).toBe('controle-c1')
    expect(g[0].texte).toContain('Contrôle de Mathématiques demain')
    expect(g[0].texte).toContain('passage à froid')
  })

  it('propose le premier passage pour un contrôle à une semaine', () => {
    const g = gestesDeLaSemaine(
      entree({
        dashboard: dashboard({
          controles: [{ id: 'c2', subject_slug: 'maths', chapters: [], exam_date: '2026-09-30' }],
        }),
      }),
    )
    expect(g[0].id).toBe('controle-c2')
    expect(g[0].texte).toContain('premier passage')
  })

  it('relance sans reproche quand l’alerte d’inactivité est armée', () => {
    const g = gestesDeLaSemaine(
      entree({
        streak: 0,
        dashboard: dashboard({ last_activity: '2026-09-18', week_seconds: 0, week_active_days: 0 }),
      }),
    )
    expect(g.map((x) => x.id)).toContain('relancer')
    expect(g.find((x) => x.id === 'relancer')?.texte).toContain('Aucune activité depuis 6 jours.')
  })

  it('pointe la matière fragile avec la bonne question', () => {
    const g = gestesDeLaSemaine(entree())
    const fragile = g.find((x) => x.id.startsWith('fragile-'))
    expect(fragile?.texte).toContain('Mathématiques à 45 %')
    expect(fragile?.conseilId).toBe('mauvaise-note')
  })

  it('fait féliciter la série ou l’objectif — ce qui va bien se dit', () => {
    const serie = gestesDeLaSemaine(entree({ dashboard: dashboard({ per_subject: [] }) }))
    expect(serie.map((x) => x.id)).toContain('feliciter-serie')
    const objectif = gestesDeLaSemaine(
      entree({ dashboard: dashboard({ per_subject: [], week_seconds: 120 * 60 }) }),
    )
    expect(objectif.map((x) => x.id)).toContain('objectif-atteint')
    expect(objectif.map((x) => x.id)).not.toContain('feliciter-serie')
  })

  it('demande les dates de contrôle quand aucune n’est déclarée', () => {
    const g = gestesDeLaSemaine(entree({ dashboard: dashboard({ per_subject: [] }) }))
    expect(g.map((x) => x.id)).toContain('declarer-controle')
  })

  it('accueille une première semaine sans reproche', () => {
    const g = gestesDeLaSemaine(
      entree({
        streak: 0,
        dashboard: dashboard({
          work_seconds: 0,
          week_seconds: 0,
          sessions_total: 0,
          per_subject: [],
          last_activity: null,
        }),
      }),
    )
    expect(g[0].id).toBe('premiere-semaine')
    expect(g.map((x) => x.id)).not.toContain('relancer')
  })
})
