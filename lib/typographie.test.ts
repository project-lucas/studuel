import { describe, expect, it } from 'vitest'
import { typographie } from './typographie'

const NB = ' '

describe('typographie', () => {
  it('rend insécable l’espace avant les deux-points et les ponctuations hautes', () => {
    expect(typographie('Diogène : les écoles')).toBe(`Diogène${NB}: les écoles`)
    expect(typographie('Vraiment ? Oui ! Enfin ; bref')).toBe(`Vraiment${NB}? Oui${NB}! Enfin${NB}; bref`)
  })

  it('rend insécables les espaces à l’intérieur des guillemets', () => {
    expect(typographie('« paix romaine »')).toBe(`«${NB}paix romaine${NB}»`)
  })

  it('ne touche ni une ponctuation collée ni une heure ni une adresse', () => {
    expect(typographie('http://x.fr et 10:30 et a;b')).toBe('http://x.fr et 10:30 et a;b')
  })

  it('ne double pas une insécable déjà là et garde le reste intact', () => {
    expect(typographie(`déjà${NB}: rien`)).toBe(`déjà${NB}: rien`)
    expect(typographie('')).toBe('')
    expect(typographie('Sans ponctuation haute.')).toBe('Sans ponctuation haute.')
  })
})
