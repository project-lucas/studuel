import { describe, expect, it } from 'vitest'
import { centreVisible, premierCentreVisible } from './hud-gains'

/** Un faux élément dont on fixe le rectangle. */
const boite = (left: number, top: number, width: number, height: number) =>
  ({ getBoundingClientRect: () => ({ left, top, width, height }) }) as unknown as Element

describe('centreVisible', () => {
  it('rend le centre d’un élément visible', () => {
    expect(centreVisible(boite(10, 20, 40, 20))).toEqual({ x: 30, y: 30 })
  })

  it('ignore un élément masqué (rectangle vide) ou absent', () => {
    expect(centreVisible(boite(0, 0, 0, 0))).toBeNull()
    expect(centreVisible(null)).toBeNull()
  })
})

describe('premierCentreVisible', () => {
  it('vise le premier exemplaire VISIBLE, pas le premier du document', () => {
    // La pastille de l’arène, cachée (onglet gardé en arrière-plan), vient
    // avant celle du bandeau dans l’ordre du document.
    const cachee = boite(0, 0, 0, 0)
    const bandeau = boite(300, 10, 20, 20)
    expect(premierCentreVisible([cachee, bandeau])).toEqual({ x: 310, y: 20 })
  })

  it('rend null quand aucune cible n’est visible', () => {
    expect(premierCentreVisible([boite(0, 0, 0, 0)])).toBeNull()
    expect(premierCentreVisible([])).toBeNull()
  })
})
