import { describe, expect, it } from 'vitest'
import { dragOffset, resolveSwipe } from './swipe'

describe('resolveSwipe', () => {
  it('renvoie « left » quand le doigt part franchement vers la gauche', () => {
    expect(resolveSwipe({ dx: -120, dy: 10, dt: 200 })).toBe('left')
  })

  it('renvoie « right » quand le doigt part franchement vers la droite', () => {
    expect(resolveSwipe({ dx: 120, dy: 10, dt: 200 })).toBe('right')
  })

  it('ignore un geste trop court', () => {
    expect(resolveSwipe({ dx: -30, dy: 0, dt: 600 })).toBeNull()
  })

  it('valide un geste court mais rapide (flick)', () => {
    expect(resolveSwipe({ dx: -30, dy: 0, dt: 50 })).toBe('left')
  })

  it('ignore un geste plus vertical qu’horizontal (c’est un scroll)', () => {
    expect(resolveSwipe({ dx: -80, dy: 70, dt: 200 })).toBeNull()
  })

  it('ignore un geste trop lent (l’utilisateur hésite)', () => {
    expect(resolveSwipe({ dx: -200, dy: 0, dt: 1500 })).toBeNull()
  })
})

describe('dragOffset', () => {
  it('suit le doigt en s’amortissant', () => {
    expect(dragOffset(100, true)).toBeCloseTo(35)
  })

  it('plafonne le décalage', () => {
    expect(dragOffset(500, true)).toBe(48)
    expect(dragOffset(-500, true)).toBe(-48)
  })

  it('résiste quand il n’y a pas d’onglet de ce côté', () => {
    expect(Math.abs(dragOffset(100, false))).toBeLessThan(
      Math.abs(dragOffset(100, true)),
    )
  })
})
