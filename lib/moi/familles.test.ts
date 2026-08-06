import { describe, it, expect } from 'vitest'
import { familleDe, TEINTES, teinteDe } from './familles'
import {
  DRIVERS,
  HYDRATION_CATALOG_ID,
  QUESTIONS_CATALOG_ID,
  SLEEP_CATALOG_ID,
} from '@/lib/capacite-drivers'
import { REVISION_CATALOG_ID } from '@/lib/habits'

describe('familleDe', () => {
  it('rattache chaque levier à son driver', () => {
    expect(familleDe(SLEEP_CATALOG_ID)).toBe('sommeil')
    expect(familleDe(HYDRATION_CATALOG_ID)).toBe('hydratation')
    expect(familleDe(QUESTIONS_CATALOG_ID)).toBe('concentration')
    expect(familleDe(REVISION_CATALOG_ID)).toBe('regularite')
  })

  it('range les habitudes hors driver dans « autre »', () => {
    // Sport / bouger : aucune famille de capacité ne la revendique.
    expect(familleDe('55555555-5555-4555-8555-555555555504')).toBe('autre')
  })

  it('ne casse pas sur un identifiant inconnu', () => {
    expect(familleDe('pas-un-uuid')).toBe('autre')
  })

  it('donne la même couleur à deux habitudes de la même famille', () => {
    // « Pas d'écran avant de dormir » partage la famille du sommeil.
    expect(familleDe('55555555-5555-4555-8555-555555555506')).toBe(
      familleDe(SLEEP_CATALOG_ID),
    )
  })
})

describe('TEINTES', () => {
  it('couvre chaque driver, plus le repli', () => {
    for (const driver of DRIVERS) {
      expect(TEINTES[driver.key]).toBeDefined()
    }
    expect(TEINTES.autre).toBeDefined()
  })

  it('donne un trait, une pastille et un halo à chaque famille', () => {
    for (const teinte of Object.values(TEINTES)) {
      expect(teinte.trait).not.toBe('')
      expect(teinte.pastille).not.toBe('')
      expect(teinte.halo).not.toBe('')
    }
  })
})

describe('teinteDe', () => {
  it('rend la teinte de la famille', () => {
    expect(teinteDe(SLEEP_CATALOG_ID)).toBe(TEINTES.sommeil)
    expect(teinteDe('inconnu')).toBe(TEINTES.autre)
  })
})
