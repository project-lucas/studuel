import { describe, expect, it } from 'vitest'
import { joursDepuisLignes, parseJoursActifs } from './jours-actifs'
import { computeStreak } from './streak'

describe('parseJoursActifs — le tableau de la RPC', () => {
  it('lit les clés UTC', () => {
    expect([...parseJoursActifs(['2026-08-24', '2026-08-25'])]).toEqual([
      '2026-08-24',
      '2026-08-25',
    ])
  })

  it('déduplique', () => {
    expect(parseJoursActifs(['2026-08-24', '2026-08-24']).size).toBe(1)
  })

  it('REFUSE tout ce qui n’est pas une clé de jour', () => {
    // Un faux jour actif prolongerait une série que l'élève n'a pas tenue.
    // C'est le seul mensonge qu'une flamme ne doit jamais faire — mieux vaut
    // une série trop courte qu'une série imméritée.
    const r = parseJoursActifs([
      '2026-08-24',
      '24/08/2026',
      '2026-8-4',
      '2026-08-24T10:00:00Z',
      42,
      null,
      '',
    ])
    expect([...r]).toEqual(['2026-08-24'])
  })

  it('rend un ensemble vide sur un payload absent ou mal formé', () => {
    for (const raw of [null, undefined, {}, 'texte', 42]) {
      expect(parseJoursActifs(raw).size).toBe(0)
    }
  })
})

describe('joursDepuisLignes — le repli', () => {
  it('fusionne les quatre sources en un seul ensemble de jours', () => {
    const r = joursDepuisLignes(
      [{ created_at: '2026-08-24T08:00:00Z' }],
      [{ created_at: '2026-08-24T19:00:00Z' }],
      [{ created_at: '2026-08-25T07:00:00Z' }],
      null,
    )
    expect([...r].sort()).toEqual(['2026-08-24', '2026-08-25'])
  })

  it('ignore une ligne sans date lisible', () => {
    const r = joursDepuisLignes([
      { created_at: '2026-08-24T08:00:00Z' },
      { created_at: null },
      { created_at: 'court' },
      {},
    ])
    expect([...r]).toEqual(['2026-08-24'])
  })

  it('rend le MÊME ensemble que la RPC sur les mêmes journées', () => {
    // L'invariant qui compte : la série d'un élève ne doit pas dépendre de
    // l'exécution d'une migration.
    const parRepli = joursDepuisLignes(
      [{ created_at: '2026-08-24T08:00:00Z' }, { created_at: '2026-08-24T20:00:00Z' }],
      [{ created_at: '2026-08-25T09:00:00Z' }],
    )
    const parRpc = parseJoursActifs(['2026-08-24', '2026-08-25'])
    expect([...parRepli].sort()).toEqual([...parRpc].sort())
  })

  it('nourrit computeStreak à l’identique', () => {
    const jours = parseJoursActifs(['2026-08-24', '2026-08-25', '2026-08-26'])
    expect(computeStreak(jours, new Date('2026-08-26T12:00:00Z'))).toBe(3)
  })
})
