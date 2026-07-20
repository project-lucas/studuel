import { describe, expect, test } from 'vitest'
import {
  TOUR_STEPS,
  bubblePosition,
  nextAvailableStep,
  spotlightRect,
  EDGE_MARGIN,
} from './tour'

const viewport = { width: 400, height: 800 }

describe('TOUR_STEPS', () => {
  test('contient 8 étapes aux ids uniques', () => {
    expect(TOUR_STEPS).toHaveLength(8)
    expect(new Set(TOUR_STEPS.map((s) => s.id)).size).toBe(8)
  })

  test('commence par une étape de bienvenue sans cible', () => {
    expect(TOUR_STEPS[0].target).toBeNull()
    expect(TOUR_STEPS.slice(1).every((s) => s.target !== null)).toBe(true)
  })

  test('couvre les 5 onglets de la bottom nav', () => {
    const targets = TOUR_STEPS.map((s) => s.target)
    for (const tab of ['reviser', 'defi', 'amis', 'moi', 'tresor']) {
      expect(targets).toContain(`tab-${tab}`)
    }
  })
})

describe('spotlightRect', () => {
  test('ajoute la marge autour de la cible', () => {
    const rect = spotlightRect(
      { top: 100, left: 50, width: 40, height: 20 },
      viewport,
      8,
    )
    expect(rect).toEqual({ top: 92, left: 42, width: 56, height: 36 })
  })

  test('reste borné au viewport', () => {
    const rect = spotlightRect(
      { top: 790, left: 380, width: 40, height: 20 },
      viewport,
      8,
    )
    expect(rect.left + rect.width).toBeLessThanOrEqual(viewport.width)
    expect(rect.top + rect.height).toBeLessThanOrEqual(viewport.height)
    expect(rect.top).toBeGreaterThanOrEqual(0)
    expect(rect.left).toBeGreaterThanOrEqual(0)
  })
})

describe('bubblePosition', () => {
  const bubble = { width: 300, height: 160 }

  test('centre la bulle sans cible (étape bienvenue)', () => {
    const pos = bubblePosition(null, bubble, viewport)
    expect(pos).toEqual({ top: 320, left: 50 })
  })

  test('place la bulle sous la cible quand la place existe', () => {
    const target = { top: 100, left: 50, width: 40, height: 20 }
    const pos = bubblePosition(target, bubble, viewport)
    expect(pos.top).toBeGreaterThan(target.top + target.height)
  })

  test("place la bulle au-dessus d'une cible du bas d'écran (bottom nav)", () => {
    const target = { top: 740, left: 160, width: 64, height: 48 }
    const pos = bubblePosition(target, bubble, viewport)
    expect(pos.top + bubble.height).toBeLessThanOrEqual(target.top)
  })

  test("ramène la bulle dans l'écran sur une cible collée au bord", () => {
    const target = { top: 740, left: 380, width: 20, height: 40 }
    const pos = bubblePosition(target, bubble, viewport)
    expect(pos.left).toBeGreaterThanOrEqual(EDGE_MARGIN)
    expect(pos.left + bubble.width).toBeLessThanOrEqual(
      viewport.width - EDGE_MARGIN,
    )
  })
})

describe('nextAvailableStep', () => {
  const hasAll = () => true

  test('renvoie la même étape quand sa cible existe', () => {
    expect(nextAvailableStep(TOUR_STEPS, hasAll, 2)).toBe(2)
  })

  test('saute une étape dont la cible est absente (file du jour vide)', () => {
    const sansFile = (t: string) => t !== 'file-du-jour'
    expect(nextAvailableStep(TOUR_STEPS, sansFile, 2)).toBe(3)
  })

  test('renvoie null après la dernière étape', () => {
    expect(nextAvailableStep(TOUR_STEPS, hasAll, TOUR_STEPS.length)).toBeNull()
  })

  test('remonte en arrière avec direction -1', () => {
    const sansFile = (t: string) => t !== 'file-du-jour'
    expect(nextAvailableStep(TOUR_STEPS, sansFile, 2, -1)).toBe(1)
  })
})
