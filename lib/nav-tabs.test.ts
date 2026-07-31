import { describe, expect, it } from 'vitest'
import { NAV_TABS, neighborTabPath, tabIndexForPath } from './nav-tabs'

describe('tabIndexForPath', () => {
  it('reconnaît un onglet exact', () => {
    expect(tabIndexForPath('/defi')).toBe(3)
  })

  it('reconnaît une sous-page comme appartenant à son onglet', () => {
    expect(tabIndexForPath('/defi/jeux')).toBe(3)
  })

  it('renvoie -1 hors des onglets principaux', () => {
    expect(tabIndexForPath('/compte')).toBe(-1)
  })

  it('ne confond pas un préfixe partiel avec un onglet', () => {
    expect(tabIndexForPath('/amistad')).toBe(-1)
  })
})

describe('NAV_TABS', () => {
  it('compte 6 onglets (Coffre a fusionné dans Trésor, Marcel s’est ajouté)', () => {
    expect(NAV_TABS).toHaveLength(6)
    expect(NAV_TABS.some((tab) => tab.path === '/coffre')).toBe(false)
    expect(NAV_TABS.some((tab) => tab.path === '/marcel')).toBe(true)
  })

  it('pose Marcel juste à gauche du Défi, à droite de Réviser', () => {
    // Marcel dit quoi faire et pourquoi, Réviser est l'endroit où on le fait :
    // on passe de l'un à l'autre en permanence, ils doivent se toucher.
    const paths = NAV_TABS.map((tab) => tab.path)
    expect(paths.indexOf('/marcel')).toBe(paths.indexOf('/reviser') + 1)
    expect(paths.indexOf('/marcel')).toBe(paths.indexOf('/defi') - 1)
  })

  it('donne une icône et un rôle à chaque onglet', () => {
    for (const tab of NAV_TABS) {
      expect(tab.icon, tab.name).toBeTruthy()
      expect(['action', 'recompense'], tab.name).toContain(tab.role)
    }
  })

  it('n’a qu’un seul onglet central', () => {
    expect(NAV_TABS.filter((tab) => tab.center)).toHaveLength(1)
  })

  it('ne réutilise jamais deux fois la même icône', () => {
    const icons = NAV_TABS.map((tab) => tab.icon)
    expect(new Set(icons).size).toBe(icons.length)
  })
})

describe('neighborTabPath', () => {
  it('balayer vers la gauche avance vers l’onglet de droite', () => {
    expect(neighborTabPath('/defi', 'left')).toBe('/moi')
  })

  it('balayer vers la droite recule vers l’onglet de gauche', () => {
    expect(neighborTabPath('/defi', 'right')).toBe('/marcel')
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
