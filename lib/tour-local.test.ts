import { describe, expect, test } from 'vitest'
import {
  baseFaitAutorite,
  lireTourVu,
  marquerTourVu,
  tourDoitDemarrer,
  CLE_TOUR_VU,
} from './tour-local'

describe('baseFaitAutorite', () => {
  test('vrai dès que la colonne répond, même « null »', () => {
    expect(baseFaitAutorite(true)).toBe(true)
    expect(baseFaitAutorite(false)).toBe(true)
    expect(baseFaitAutorite(null)).toBe(true)
  })

  test('faux quand la colonne n’existe pas (migration 188 en attente)', () => {
    expect(baseFaitAutorite(undefined)).toBe(false)
  })
})

describe('tourDoitDemarrer', () => {
  test('la base dit « déjà vu » : pas de tour, même si le local l’ignore', () => {
    expect(tourDoitDemarrer(true, false)).toBe(false)
  })

  test('la base dit « jamais vu » : tour, même si le local dit vu', () => {
    // La base fait autorité : elle suit l'élève d'un appareil à l'autre.
    expect(tourDoitDemarrer(false, true)).toBe(true)
    expect(tourDoitDemarrer(null, true)).toBe(true)
  })

  test('colonne absente : la mémoire locale tranche', () => {
    expect(tourDoitDemarrer(undefined, false)).toBe(true)
    expect(tourDoitDemarrer(undefined, true)).toBe(false)
  })

  test('le cas qui a rendu la fonctionnalité invisible : colonne absente, rien en local', () => {
    // Avant : `tutorial_completed === false` valait `false` (undefined !== false)
    // et le tour ne partait JAMAIS. C'est ce cas précis que ce test verrouille.
    expect(tourDoitDemarrer(undefined, false)).toBe(true)
  })
})

function fauxStorage(initial?: string) {
  const carte = new Map<string, string>()
  if (initial !== undefined) carte.set(CLE_TOUR_VU, initial)
  return {
    getItem: (k: string) => carte.get(k) ?? null,
    setItem: (k: string, v: string) => void carte.set(k, v),
    lu: () => carte.get(CLE_TOUR_VU),
  }
}

describe('mémoire locale', () => {
  test('lit « vu » uniquement sur la valeur attendue', () => {
    expect(lireTourVu(fauxStorage('1'))).toBe(true)
    expect(lireTourVu(fauxStorage('0'))).toBe(false)
    expect(lireTourVu(fauxStorage())).toBe(false)
  })

  test('marque puis relit', () => {
    const s = fauxStorage()
    marquerTourVu(s)
    expect(s.lu()).toBe('1')
    expect(lireTourVu(s)).toBe(true)
  })

  test('un stockage qui lève ne casse rien', () => {
    const casse = {
      getItem: () => {
        throw new Error('stockage bloqué')
      },
      setItem: () => {
        throw new Error('stockage bloqué')
      },
    }
    expect(lireTourVu(casse)).toBe(false)
    expect(() => marquerTourVu(casse)).not.toThrow()
  })
})
