import { describe, expect, it } from 'vitest'
import { estRaison, messageSignalement, questionAvant } from './ia-signalement'

describe('questionAvant', () => {
  const fil = [
    { id: '1', role: 'eleve', texte: 'Première question' },
    { id: '2', role: 'marcel', texte: 'Première réponse' },
    { id: '3', role: 'eleve', texte: 'Deuxième question' },
    { id: '4', role: 'marcel', texte: 'Deuxième réponse' },
    { id: '5', role: 'marcel', texte: 'Complément' },
  ]

  it('trouve la question qui précède la réponse', () => {
    expect(questionAvant(fil, '2')).toBe('Première question')
    expect(questionAvant(fil, '4')).toBe('Deuxième question')
  })

  it('remonte au-delà de plusieurs réponses de suite', () => {
    expect(questionAvant(fil, '5')).toBe('Deuxième question')
  })

  it('rend une chaîne vide sans question avant, ou pour un id inconnu', () => {
    expect(questionAvant([{ id: 'a', role: 'marcel', texte: 'Bonjour' }], 'a')).toBe('')
    expect(questionAvant(fil, 'inconnu')).toBe('')
  })
})

describe('estRaison', () => {
  it('n’accepte que les trois raisons', () => {
    expect(estRaison('faux')).toBe(true)
    expect(estRaison('choquant')).toBe(true)
    expect(estRaison('nul')).toBe(false)
  })
})

describe('messageSignalement', () => {
  it('retombe sur la panne pour une réponse inconnue', () => {
    expect(messageSignalement('xyz')).toBe(messageSignalement('panne'))
    expect(messageSignalement('ok')).not.toBe(messageSignalement('panne'))
  })
})
