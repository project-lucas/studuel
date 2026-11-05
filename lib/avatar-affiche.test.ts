import { describe, expect, it } from 'vitest'
import { avatarAffiche } from './avatar-affiche'

describe('l’avatar prêt à afficher', () => {
  it('rend le héros d’un ancien blason, visage déjà recadré (05/11/2026)', () => {
    expect(avatarAffiche({ portrait: '7' })).toEqual({ src: '/images/heros/eleves/demi-elfe-orage-visage2.webp', visage: false })
  })

  it('rend le premier héros pour un compte d’avant sans portrait', () => {
    expect(avatarAffiche({})).toEqual({ src: '/images/heros/eleves/elfe-rodeur-visage2.webp', visage: false })
  })
})
