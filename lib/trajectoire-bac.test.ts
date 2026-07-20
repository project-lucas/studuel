import { describe, expect, it } from 'vitest'
import {
  MAX_UPLIFT,
  computeBacTrajectory,
  mergeTermAverages,
  normalizeTermGrades,
} from './trajectoire-bac'
import type { TrimestreSummary } from './notes'

const summaries = (
  t1: number | null,
  t2: number | null,
  t3: number | null,
): TrimestreSummary[] => [
  { t: 1, avg: t1, count: t1 === null ? 0 : 3 },
  { t: 2, avg: t2, count: t2 === null ? 0 : 3 },
  { t: 3, avg: t3, count: t3 === null ? 0 : 3 },
]

describe('normalizeTermGrades', () => {
  it('garde les lignes valides de l’année demandée', () => {
    const rows = normalizeTermGrades(
      [
        { school_year: 2025, term: 1, average: 12.5 },
        { school_year: 2024, term: 2, average: 11 }, // autre année → ignorée
        { school_year: 2025, term: 4, average: 15 }, // trimestre invalide
        { school_year: 2025, term: 2, average: 25 }, // moyenne hors bornes
      ],
      2025,
    )
    expect(rows).toEqual([{ term: 1, average: 12.5 }])
  })

  it('liste vide sur entrée non-tableau', () => {
    expect(normalizeTermGrades(null, 2025)).toEqual([])
    expect(normalizeTermGrades('x', 2025)).toEqual([])
  })
})

describe('mergeTermAverages', () => {
  it('la moyenne calculée depuis les notes gagne sur la saisie manuelle', () => {
    const merged = mergeTermAverages(summaries(12.8, null, null), [
      { term: 1, average: 15 },
      { term: 2, average: 13.1 },
    ])
    expect(merged[0]).toEqual({ t: 1, avg: 12.8, source: 'notes' })
    expect(merged[1]).toEqual({ t: 2, avg: 13.1, source: 'manuel' })
    expect(merged[2]).toEqual({ t: 3, avg: null, source: null })
  })
})

describe('computeBacTrajectory', () => {
  const terms = mergeTermAverages(summaries(12.8, 13.1, null), [])

  it('projection plate « sans changement » depuis la dernière moyenne connue', () => {
    const traj = computeBacTrajectory(terms, 68, 89)
    expect(traj.sansChangement).toBe(13.1)
  })

  it('uplift = écart de capacité × 0,1, plafonné à +2', () => {
    const traj = computeBacTrajectory(terms, 68, 89) // écart 21 → 2.1 → cap 2
    expect(traj.uplift).toBe(MAX_UPLIFT)
    expect(traj.avecLeviers).toBe(13.1 + MAX_UPLIFT)

    const small = computeBacTrajectory(terms, 80, 89) // écart 9 → +0.9
    expect(small.uplift).toBe(0.9)
    expect(small.avecLeviers).toBe(14)
  })

  it('« avec leviers » ne dépasse jamais 20', () => {
    const high = mergeTermAverages(summaries(19.5, 19.6, null), [])
    const traj = computeBacTrajectory(high, 60, 90)
    expect(traj.avecLeviers).toBe(20)
  })

  it('sans capacité connue : pas de projection « avec leviers »', () => {
    const traj = computeBacTrajectory(terms, null, null)
    expect(traj.sansChangement).toBe(13.1)
    expect(traj.uplift).toBeNull()
    expect(traj.avecLeviers).toBeNull()
  })

  it('aucune moyenne connue → état vide', () => {
    const traj = computeBacTrajectory(mergeTermAverages(summaries(null, null, null), []), 68, 89)
    expect(traj.sansChangement).toBeNull()
    expect(traj.avecLeviers).toBeNull()
    expect(traj.hasData).toBe(false)
  })

  it('T3 déjà noté → plus de projection (année terminée)', () => {
    const done = mergeTermAverages(summaries(12.8, 13.1, 14.2), [])
    const traj = computeBacTrajectory(done, 68, 89)
    expect(traj.sansChangement).toBeNull()
    expect(traj.avecLeviers).toBeNull()
    expect(traj.hasData).toBe(true)
  })

  it('l’écart de capacité négatif ne donne jamais un uplift négatif', () => {
    const traj = computeBacTrajectory(terms, 95, 95)
    expect(traj.uplift).toBe(0)
    expect(traj.avecLeviers).toBe(13.1)
  })
})
