import { describe, expect, it } from 'vitest'
import {
  DRIVERS,
  LEVERS,
  PLAFOND_TARGET,
  SLEEP_CATALOG_ID,
  HYDRATION_CATALOG_ID,
  QUESTIONS_CATALOG_ID,
  computeDriverScores,
  computeCapacite,
  computePlafond,
} from './capacite-drivers'
import { REVISION_CATALOG_ID } from './habits'
import type { Habit, HabitLog } from './types'

// 2026-07-20 est un lundi (index 0).
const TODAY = '2026-07-20'

const habit = (id: string, catalogId: string, days?: number[]): Habit =>
  ({
    id,
    catalog_id: catalogId,
    target: days ? { days } : {},
    created_at: '2026-01-01T00:00:00Z',
    habit_catalog: null,
  }) as unknown as Habit

const log = (habitId: string, date: string, completed = true): HabitLog =>
  ({
    id: `${habitId}|${date}`,
    habit_id: habitId,
    date,
    completed,
    auto_validated: false,
  }) as HabitLog

describe('computeDriverScores', () => {
  it('renvoie null pour un driver sans habitude activée', () => {
    const scores = computeDriverScores([], [], TODAY)
    expect(scores).toHaveLength(DRIVERS.length)
    for (const s of scores) expect(s.score).toBeNull()
  })

  it('score 100 quand tous les jours planifiés des 14 derniers jours sont validés', () => {
    const h = habit('h1', SLEEP_CATALOG_ID) // tous les jours par défaut
    const logs: HabitLog[] = []
    for (let i = 0; i < 14; i++) {
      const d = new Date('2026-07-20T12:00:00Z')
      d.setUTCDate(d.getUTCDate() - i)
      logs.push(log('h1', d.toISOString().slice(0, 10)))
    }
    const scores = computeDriverScores([h], logs, TODAY)
    const sommeil = scores.find((s) => s.key === 'sommeil')!
    expect(sommeil.score).toBe(100)
  })

  it('score 50 quand la moitié des jours est validée', () => {
    const h = habit('h1', HYDRATION_CATALOG_ID)
    const logs: HabitLog[] = []
    for (let i = 0; i < 14; i += 2) {
      const d = new Date('2026-07-20T12:00:00Z')
      d.setUTCDate(d.getUTCDate() - i)
      logs.push(log('h1', d.toISOString().slice(0, 10)))
    }
    const scores = computeDriverScores([h], logs, TODAY)
    const hydratation = scores.find((s) => s.key === 'hydratation')!
    expect(hydratation.score).toBe(50)
  })

  it('ne compte que les jours planifiés de l’habitude', () => {
    // Planifiée seulement le lundi (0) : 2 lundis dans la fenêtre de 14 jours,
    // les deux validés → 100 %, pas 14 occurrences attendues.
    const h = habit('h1', SLEEP_CATALOG_ID, [0])
    const logs = [log('h1', '2026-07-20'), log('h1', '2026-07-13')]
    const scores = computeDriverScores([h], logs, TODAY)
    expect(scores.find((s) => s.key === 'sommeil')!.score).toBe(100)
  })

  it('ignore les jours antérieurs à la création de l’habitude', () => {
    const h = {
      ...habit('h1', SLEEP_CATALOG_ID),
      created_at: '2026-07-14T09:00:00Z',
    } as Habit
    // 7 jours planifiés (14 → 20 juillet), tous validés.
    const logs: HabitLog[] = []
    for (let i = 0; i < 7; i++) {
      const d = new Date('2026-07-20T12:00:00Z')
      d.setUTCDate(d.getUTCDate() - i)
      logs.push(log('h1', d.toISOString().slice(0, 10)))
    }
    const scores = computeDriverScores([h], logs, TODAY)
    expect(scores.find((s) => s.key === 'sommeil')!.score).toBe(100)
  })

  it('un log non complété ne compte pas', () => {
    const h = habit('h1', SLEEP_CATALOG_ID, [0])
    const logs = [log('h1', '2026-07-20', false), log('h1', '2026-07-13')]
    const scores = computeDriverScores([h], logs, TODAY)
    expect(scores.find((s) => s.key === 'sommeil')!.score).toBe(50)
  })
})

describe('computeCapacite', () => {
  it('moyenne pondérée des drivers renseignés', () => {
    const scores = DRIVERS.map((d) => ({
      key: d.key,
      label: d.label,
      score: 50,
    }))
    expect(computeCapacite(scores, null)).toBe(50)
  })

  it('ignore les drivers null (renormalise les poids)', () => {
    const scores = DRIVERS.map((d, i) => ({
      key: d.key,
      label: d.label,
      score: i === 0 ? 80 : null,
    }))
    expect(computeCapacite(scores, null)).toBe(80)
  })

  it('repli sur le score du quiz quand aucun driver', () => {
    const scores = DRIVERS.map((d) => ({ key: d.key, label: d.label, score: null }))
    expect(computeCapacite(scores, 62)).toBe(62)
    expect(computeCapacite(scores, null)).toBeNull()
  })
})

describe('computePlafond', () => {
  it('remonte chaque driver à la cible', () => {
    const scores = DRIVERS.map((d) => ({ key: d.key, label: d.label, score: 50 }))
    expect(computePlafond(scores, 50)).toBe(PLAFOND_TARGET)
  })

  it('un driver déjà au-dessus de la cible est conservé', () => {
    const scores = DRIVERS.map((d) => ({ key: d.key, label: d.label, score: 98 }))
    expect(computePlafond(scores, 98)).toBe(98)
  })

  it('null si capacité null, cible si capacité issue du quiz seul', () => {
    const empty = DRIVERS.map((d) => ({ key: d.key, label: d.label, score: null }))
    expect(computePlafond(empty, null)).toBeNull()
    expect(computePlafond(empty, 62)).toBe(PLAFOND_TARGET)
  })

  it('jamais en dessous de la capacité', () => {
    const scores = DRIVERS.map((d) => ({ key: d.key, label: d.label, score: 96 }))
    expect(computePlafond(scores, 96)).toBeGreaterThanOrEqual(96)
  })

  it('jamais en dessous de la capacité NON PLUS sans aucun driver suivi', () => {
    // Le cas qui affichait « 100 actuel · 95 possible » : capacité issue du
    // seul quiz, au-dessus de la cible, et pas une habitude cochée.
    const empty = DRIVERS.map((d) => ({ key: d.key, label: d.label, score: null }))
    expect(computePlafond(empty, 100)).toBe(100)
    expect(computePlafond(empty, 96)).toBe(96)
  })
})

describe('LEVERS', () => {
  it('chaque levier pointe une habitude du catalogue et un driver existant', () => {
    const driverKeys = new Set(DRIVERS.map((d) => d.key))
    for (const lever of LEVERS) {
      expect(lever.catalogId).toMatch(/^55555555-5555-4555-8555-5555555555\d\d$/)
      expect(driverKeys.has(lever.driverKey)).toBe(true)
      expect(lever.points).toBeGreaterThan(0)
    }
  })

  it('couvre les 4 leviers de la maquette', () => {
    expect(LEVERS.map((l) => l.catalogId)).toEqual([
      SLEEP_CATALOG_ID,
      HYDRATION_CATALOG_ID,
      REVISION_CATALOG_ID,
      QUESTIONS_CATALOG_ID,
    ])
  })

  it('chaque catalogId de levier est couvert par son driver', () => {
    for (const lever of LEVERS) {
      const driver = DRIVERS.find((d) => d.key === lever.driverKey)!
      expect(driver.catalogIds).toContain(lever.catalogId)
    }
  })
})
