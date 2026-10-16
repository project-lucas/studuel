import { describe, expect, it } from 'vitest'
import { verdictDefilement } from './replie'

describe('la tête du bureau qui se replie', () => {
  it('ne se replie que si le contenu reste défilable une fois repliée', () => {
    expect(verdictDefilement(false, { haut: 30, depassement: 400 }, 170)).toBe(true)
    expect(verdictDefilement(false, { haut: 30, depassement: 150 }, 170)).toBe(false)
    expect(verdictDefilement(false, { haut: 10, depassement: 400 }, 170)).toBe(false)
  })

  it('ne se déplie qu’en haut de la liste', () => {
    expect(verdictDefilement(true, { haut: 60, depassement: 230 }, 170)).toBe(true)
    expect(verdictDefilement(true, { haut: 0, depassement: 230 }, 170)).toBe(false)
  })
})
