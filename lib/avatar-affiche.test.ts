import { describe, expect, it } from 'vitest'
import { avatarAffiche } from './avatar-affiche'

describe('l’avatar prêt à afficher', () => {
  it('rend le blason choisi, à cadrer sur le visage', () => {
    expect(avatarAffiche({ portrait: '7' })).toEqual({ src: '/images/profil/v2/7.webp', visage: true })
  })

  it('rend le premier blason pour un compte d’avant sans portrait (plus d’avatar dessiné)', () => {
    expect(avatarAffiche({})).toEqual({ src: '/images/profil/v2/2.webp', visage: true })
  })
})
