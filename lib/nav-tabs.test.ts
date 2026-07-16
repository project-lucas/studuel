import { describe, expect, it } from 'vitest'
import { NAV_TABS, neighborTabPath, tabIndexForPath } from './nav-tabs'

describe('tabIndexForPath', () => {
  it('reconnaît un onglet exact', () => {
    expect(tabIndexForPath('/defi')).toBe(2)
  })

  it('reconnaît une sous-page comme appartenant à son onglet', () => {
    expect(tabIndexForPath('/defi/jeux')).toBe(2)
  })

  it('renvoie -1 hors des onglets principaux', () => {
    expect(tabIndexForPath('/compte')).toBe(-1)
  })

  it('ne confond pas un préfixe partiel avec un onglet', () => {
    expect(tabIndexForPath('/amistad')).toBe(-1)
  })
})

describe('neighborTabPath', () => {
  it('balayer vers la gauche avance vers l’onglet de droite', () => {
    expect(neighborTabPath('/defi', 'left')).toBe('/moi')
  })

  it('balayer vers la droite recule vers l’onglet de gauche', () => {
    expect(neighborTabPath('/defi', 'right')).toBe('/reviser')
  })

  it('s’arrête au premier onglet', () => {
    expect(neighborTabPath(NAV_TABS[0].path, 'right')).toBeNull()
  })

  it('s’arrête au dernier onglet', () => {
    expect(neighborTabPath(NAV_TABS[NAV_TABS.length - 1].path, 'left')).toBeNull()
  })

  it('ne fait rien hors des onglets principaux', () => {
    expect(neighborTabPath('/compte', 'left')).toBeNull()
  })
})
