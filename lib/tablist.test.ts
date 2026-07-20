import { describe, it, expect } from 'vitest'
import { nextTabIndex } from './tablist'

describe('nextTabIndex', () => {
  it('avance et recule d’un onglet', () => {
    expect(nextTabIndex('ArrowRight', 0, 5)).toBe(1)
    expect(nextTabIndex('ArrowLeft', 3, 5)).toBe(2)
  })

  it('boucle aux deux extrémités', () => {
    // Sans bouclage, l'élève reste coincé au bout de la liste.
    expect(nextTabIndex('ArrowRight', 4, 5)).toBe(0)
    expect(nextTabIndex('ArrowLeft', 0, 5)).toBe(4)
  })

  it('accepte les flèches verticales (onglets empilés)', () => {
    expect(nextTabIndex('ArrowDown', 0, 3)).toBe(1)
    expect(nextTabIndex('ArrowUp', 0, 3)).toBe(2)
  })

  it('saute aux extrémités avec Origine et Fin', () => {
    expect(nextTabIndex('Home', 3, 5)).toBe(0)
    expect(nextTabIndex('End', 1, 5)).toBe(4)
  })

  it('ignore les touches qui ne le concernent pas', () => {
    // Important : l'appelant ne doit surtout pas manger Tab, Entrée ou Espace.
    for (const key of ['Tab', 'Enter', ' ', 'a', 'Escape']) {
      expect(nextTabIndex(key, 1, 5)).toBeNull()
    }
  })

  it('ne calcule rien sur un groupe vide', () => {
    expect(nextTabIndex('ArrowRight', 0, 0)).toBeNull()
  })

  it('reste dans les bornes sur un onglet unique', () => {
    expect(nextTabIndex('ArrowRight', 0, 1)).toBe(0)
    expect(nextTabIndex('ArrowLeft', 0, 1)).toBe(0)
  })
})
