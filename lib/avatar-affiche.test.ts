import { describe, expect, it } from 'vitest'
import { avatarAffiche } from './avatar-affiche'

describe('l’avatar prêt à afficher', () => {
  it('rend le blason choisi, à cadrer sur le visage', () => {
    expect(avatarAffiche({ portrait: '7' })).toEqual({ src: '/images/profil/7.webp', visage: true })
  })

  it('rend l’avatar composé en image autonome sans blason', () => {
    const a = avatarAffiche({})
    expect(a.visage).toBe(false)
    expect(a.src.startsWith('data:image/svg+xml')).toBe(true)
  })
})
