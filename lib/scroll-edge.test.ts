import { describe, it, expect } from 'vitest'
import { overscrollDirection, EDGE_THRESHOLD } from './scroll-edge'

const base = { atTop: false, atBottom: false, dy: 0, scrollable: true }

describe('overscrollDirection', () => {
  it('rebondit en HAUT quand on tire vers le bas alors qu’on est déjà en haut', () => {
    expect(
      overscrollDirection({ ...base, atTop: true, dy: EDGE_THRESHOLD + 5 }),
    ).toBe('top')
  })

  it('rebondit en BAS quand on tire vers le haut alors qu’on est déjà en bas', () => {
    expect(
      overscrollDirection({ ...base, atBottom: true, dy: -(EDGE_THRESHOLD + 5) }),
    ).toBe('bottom')
  })

  it('ne rebondit pas sous le seuil (un simple frémissement du doigt)', () => {
    expect(
      overscrollDirection({ ...base, atTop: true, dy: EDGE_THRESHOLD - 1 }),
    ).toBeNull()
  })

  it('ne rebondit pas en tirant vers l’intérieur de la liste', () => {
    // En haut mais on descend dans la liste (dy négatif) : scroll normal.
    expect(overscrollDirection({ ...base, atTop: true, dy: -60 })).toBeNull()
    // En bas mais on remonte dans la liste (dy positif) : scroll normal.
    expect(overscrollDirection({ ...base, atBottom: true, dy: 60 })).toBeNull()
  })

  it('ne rebondit jamais sur une zone qui ne défile pas', () => {
    expect(
      overscrollDirection({
        atTop: true,
        atBottom: true,
        dy: 200,
        scrollable: false,
      }),
    ).toBeNull()
  })

  it('respecte un seuil personnalisé', () => {
    expect(
      overscrollDirection({ ...base, atTop: true, dy: 10, threshold: 8 }),
    ).toBe('top')
  })
})
