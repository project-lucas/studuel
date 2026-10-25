import { describe, expect, it } from 'vitest'
import { messageSuppression, motConfirme } from './suppression-compte'

describe('motConfirme', () => {
  it('accepte le mot, en majuscules ou non, avec des espaces autour', () => {
    expect(motConfirme('SUPPRIMER')).toBe(true)
    expect(motConfirme('  supprimer ')).toBe(true)
  })

  it('refuse un mot vide, approchant ou incomplet', () => {
    expect(motConfirme('')).toBe(false)
    expect(motConfirme('SUPPRIME')).toBe(false)
    expect(motConfirme('SUPPRIMER MON COMPTE')).toBe(false)
  })
})

describe('messageSuppression', () => {
  it('a un message pour chaque refus de la base', () => {
    for (const code of ['confirmation', 'anonyme', 'admin', 'coach']) {
      expect(messageSuppression(code)).not.toBe(messageSuppression('panne'))
    }
  })

  it('retombe sur la panne pour une réponse inconnue', () => {
    expect(messageSuppression('inattendu')).toBe(messageSuppression('panne'))
  })
})
