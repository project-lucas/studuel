import { describe, expect, it } from 'vitest'
import {
  anneeMatrix,
  displayedTrimestre,
  formatNote,
  gradesOfTrimestre,
  normalizeGrade,
  normalizeGradeList,
  noteSur20,
  subjectAverages,
  trimestreDelta,
  trimestreOf,
  trimestreSummaries,
  trimestreTrendMessage,
  weightedAverage20,
  type SchoolGrade,
} from './notes'

const grade = (over: Partial<SchoolGrade> = {}): SchoolGrade => ({
  id: 'g1',
  subject: 'maths',
  label: null,
  score: 12,
  outOf: 20,
  coefficient: 1,
  date: '2025-10-10',
  ...over,
})

describe('normalizeGrade', () => {
  it('accepte une ligne de la base (snake_case out_of)', () => {
    const g = normalizeGrade({
      id: 'abc',
      subject: 'maths',
      label: '  Contrôle ch. 3  ',
      score: '14.5',
      out_of: '20',
      coefficient: '2',
      date: '2025-11-03',
    })
    expect(g).toEqual({
      id: 'abc',
      subject: 'maths',
      label: 'Contrôle ch. 3',
      score: 14.5,
      outOf: 20,
      coefficient: 2,
      date: '2025-11-03',
    })
  })

  it('rejette les formes invalides', () => {
    expect(normalizeGrade(null)).toBeNull()
    expect(normalizeGrade({})).toBeNull()
    // note au-dessus du barème
    expect(normalizeGrade(grade({ score: 25 }))).toBeNull()
    // barème nul ou négatif
    expect(normalizeGrade(grade({ outOf: 0 }))).toBeNull()
    // coefficient hors bornes
    expect(normalizeGrade(grade({ coefficient: 0 }))).toBeNull()
    expect(normalizeGrade(grade({ coefficient: 11 }))).toBeNull()
    // date invalide
    expect(normalizeGrade(grade({ date: '10/10/2025' }))).toBeNull()
  })

  it('un label vide devient null', () => {
    expect(normalizeGrade(grade({ label: '   ' }))?.label).toBeNull()
  })
})

describe('normalizeGradeList', () => {
  it('jette les entrées invalides et trie plus récentes d’abord', () => {
    const list = normalizeGradeList([
      grade({ id: 'a', date: '2025-09-15' }),
      { id: 'bad' },
      grade({ id: 'b', date: '2025-11-02' }),
    ])
    expect(list.map((g) => g.id)).toEqual(['b', 'a'])
  })

  it('renvoie [] pour une valeur non-tableau', () => {
    expect(normalizeGradeList(undefined)).toEqual([])
  })
})

describe('trimestreOf', () => {
  it('découpe l’année scolaire en 3 trimestres', () => {
    expect(trimestreOf('2025-09-01')).toEqual({ year: 2025, t: 1 })
    expect(trimestreOf('2025-11-30')).toEqual({ year: 2025, t: 1 })
    expect(trimestreOf('2025-12-01')).toEqual({ year: 2025, t: 2 })
    expect(trimestreOf('2026-02-28')).toEqual({ year: 2025, t: 2 })
    expect(trimestreOf('2026-03-01')).toEqual({ year: 2025, t: 3 })
    expect(trimestreOf('2026-06-30')).toEqual({ year: 2025, t: 3 })
  })

  it('rattache l’été à l’année scolaire écoulée', () => {
    expect(trimestreOf('2026-07-17')).toEqual({ year: 2025, t: 3 })
    expect(trimestreOf('2026-08-31')).toEqual({ year: 2025, t: 3 })
  })

  it('rejette les clés invalides', () => {
    expect(trimestreOf('pas-une-date')).toBeNull()
  })
})

describe('moyennes', () => {
  it('ramène les barèmes sur 20', () => {
    expect(noteSur20(grade({ score: 5, outOf: 10 }))).toBe(10)
  })

  it('pondère par coefficient', () => {
    const avg = weightedAverage20([
      grade({ score: 10, coefficient: 1 }),
      grade({ score: 20, coefficient: 3 }),
    ])
    expect(avg).toBeCloseTo(17.5)
  })

  it('null sans note', () => {
    expect(weightedAverage20([])).toBeNull()
  })
})

describe('trimestreSummaries', () => {
  const grades = [
    grade({ id: 'a', date: '2025-10-01', score: 10 }), // T1
    grade({ id: 'b', date: '2025-12-05', score: 14 }), // T2
    grade({ id: 'c', date: '2026-01-20', score: 16 }), // T2
    grade({ id: 'z', date: '2024-10-01', score: 2 }), // autre année : ignorée
  ]

  it('regroupe par trimestre de l’année scolaire en cours', () => {
    const s = trimestreSummaries(grades, '2026-01-25')
    expect(s).toHaveLength(3)
    expect(s[0]).toMatchObject({ t: 1, count: 1 })
    expect(s[0].avg).toBeCloseTo(10)
    expect(s[1]).toMatchObject({ t: 2, count: 2 })
    expect(s[1].avg).toBeCloseTo(15)
    expect(s[2]).toMatchObject({ t: 3, count: 0, avg: null })
  })

  it('affiche le trimestre courant s’il a des notes, sinon le dernier rempli', () => {
    const s = trimestreSummaries(grades, '2026-01-25')
    expect(displayedTrimestre(s, '2026-01-25')?.t).toBe(2)
    // En T3 sans note de T3 → on retombe sur le T2.
    const s3 = trimestreSummaries(grades, '2026-04-10')
    expect(displayedTrimestre(s3, '2026-04-10')?.t).toBe(2)
  })

  it('null quand l’année est vide', () => {
    const s = trimestreSummaries([], '2026-01-25')
    expect(displayedTrimestre(s, '2026-01-25')).toBeNull()
  })
})

describe('trimestreDelta + message', () => {
  it('compare au trimestre précédent qui a des notes', () => {
    const s = trimestreSummaries(
      [
        grade({ id: 'a', date: '2025-10-01', score: 10 }),
        grade({ id: 'b', date: '2026-01-10', score: 13 }),
      ],
      '2026-01-25',
    )
    const displayed = displayedTrimestre(s, '2026-01-25')
    expect(trimestreDelta(s, displayed)).toBeCloseTo(3)
  })

  it('null sans point de comparaison', () => {
    const s = trimestreSummaries(
      [grade({ id: 'a', date: '2025-10-01' })],
      '2025-10-15',
    )
    expect(trimestreDelta(s, displayedTrimestre(s, '2025-10-15'))).toBeNull()
  })

  it('messages honnêtes selon le delta', () => {
    expect(trimestreTrendMessage(null)).toBeNull()
    expect(trimestreTrendMessage(2)).toMatch(/progression/)
    expect(trimestreTrendMessage(0.5)).toMatch(/monte/)
    expect(trimestreTrendMessage(0)).toMatch(/Stable/)
    expect(trimestreTrendMessage(-0.5)).toMatch(/creux/)
    expect(trimestreTrendMessage(-3)).toMatch(/ensemble/)
  })
})

describe('subjectAverages', () => {
  it('moyenne par matière, mieux fournies d’abord', () => {
    const list = subjectAverages([
      grade({ id: 'a', subject: 'maths', score: 10 }),
      grade({ id: 'b', subject: 'maths', score: 14 }),
      grade({ id: 'c', subject: 'francais', score: 18 }),
    ])
    expect(list.map((s) => s.subject)).toEqual(['maths', 'francais'])
    expect(list[0].avg).toBeCloseTo(12)
    expect(list[0].count).toBe(2)
  })
})

describe('gradesOfTrimestre', () => {
  it('filtre par trimestre de l’année scolaire de today', () => {
    const list = gradesOfTrimestre(
      [
        grade({ id: 'a', date: '2025-10-01' }),
        grade({ id: 'b', date: '2026-01-10' }),
        grade({ id: 'z', date: '2024-10-01' }),
      ],
      '2026-01-25',
      1,
    )
    expect(list.map((g) => g.id)).toEqual(['a'])
  })
})

describe('anneeMatrix', () => {
  const grades = [
    grade({ id: 'a', subject: 'maths', date: '2025-10-01', score: 10 }), // T1
    grade({ id: 'b', subject: 'maths', date: '2026-01-10', score: 14 }), // T2
    grade({ id: 'c', subject: 'maths', date: '2026-04-02', score: 16 }), // T3
    grade({ id: 'd', subject: 'francais', date: '2025-11-05', score: 12 }), // T1
    grade({ id: 'e', subject: 'francais', date: '2025-11-20', score: 8, coefficient: 3 }), // T1
    grade({ id: 'z', subject: 'maths', date: '2024-10-01', score: 2 }), // autre année
  ]

  it('croise matière × trimestre sur l’année scolaire en cours', () => {
    const { rows } = anneeMatrix(grades, '2026-04-10')
    expect(rows.map((r) => r.subject)).toEqual(['maths', 'francais'])

    const maths = rows[0]
    expect(maths.count).toBe(3)
    expect(maths.avgs[0]).toBeCloseTo(10)
    expect(maths.avgs[1]).toBeCloseTo(14)
    expect(maths.avgs[2]).toBeCloseTo(16)

    const francais = rows[1]
    expect(francais.avgs[0]).toBeCloseTo(9) // (12×1 + 8×3) / 4
    expect(francais.avgs[1]).toBeNull()
    expect(francais.avgs[2]).toBeNull()
  })

  it('delta = dernier trimestre noté vs le précédent noté', () => {
    const { rows } = anneeMatrix(grades, '2026-04-10')
    expect(rows[0].delta).toBeCloseTo(2) // maths : T3 16 vs T2 14
    expect(rows[1].delta).toBeNull() // français : un seul trimestre noté
  })

  it('le delta saute les trimestres sans note', () => {
    const { rows } = anneeMatrix(
      [
        grade({ id: 'a', date: '2025-10-01', score: 10 }), // T1
        grade({ id: 'c', date: '2026-04-02', score: 13 }), // T3 (rien en T2)
      ],
      '2026-04-10',
    )
    expect(rows[0].delta).toBeCloseTo(3)
  })

  it('moyenne générale par trimestre, toutes matières pondérées', () => {
    const { general } = anneeMatrix(grades, '2026-04-10')
    // T1 : maths 10×1 + français 12×1 + 8×3 → 46/5
    expect(general[0]).toBeCloseTo(9.2)
    expect(general[1]).toBeCloseTo(14)
    expect(general[2]).toBeCloseTo(16)
  })

  it('vide ou date invalide → matrice vide', () => {
    expect(anneeMatrix([], '2026-04-10').rows).toEqual([])
    expect(anneeMatrix(grades, 'pas-une-date')).toEqual({
      rows: [],
      general: [null, null, null],
    })
  })
})

describe('formatNote', () => {
  it('virgule française, 1 décimale max', () => {
    expect(formatNote(13.54)).toBe('13,5')
    expect(formatNote(15)).toBe('15')
    expect(formatNote(9.96)).toBe('10')
  })
})
