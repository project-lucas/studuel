import { describe, expect, it } from 'vitest'
import { nextDialogFocus } from './dialog-focus'

describe('nextDialogFocus', () => {
  it('boucle du dernier au premier avec Tab', () => {
    expect(nextDialogFocus(3, 2, false)).toBe(0)
  })

  it('boucle du premier au dernier avec Maj+Tab', () => {
    expect(nextDialogFocus(3, 0, true)).toBe(2)
  })

  it('laisse filer un déplacement interne', () => {
    expect(nextDialogFocus(3, 1, false)).toBeNull()
    expect(nextDialogFocus(3, 1, true)).toBeNull()
  })

  it('ramène le focus dans le dialogue quand il est ailleurs', () => {
    // -1 = focus sur le panneau lui-même, ou échappé derrière la modale.
    expect(nextDialogFocus(3, -1, false)).toBe(0)
    expect(nextDialogFocus(3, -1, true)).toBe(2)
  })

  it('gère un dialogue à un seul élément focalisable', () => {
    // Le seul élément est à la fois premier et dernier : Tab doit y rester.
    expect(nextDialogFocus(1, 0, false)).toBe(0)
    expect(nextDialogFocus(1, 0, true)).toBe(0)
  })

  it('ne cible rien quand le dialogue n’a aucun élément focalisable', () => {
    expect(nextDialogFocus(0, -1, false)).toBeNull()
    expect(nextDialogFocus(0, 0, true)).toBeNull()
  })
})
