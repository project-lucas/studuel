import { describe, expect, it } from 'vitest'

import {
  MESSAGE_ANONYME,
  MESSAGE_PANNE,
  idObjetValide,
  lireReponseAchat,
  messageRefusObjet,
  messageRefusOffre,
} from './achat'

describe('lireReponseAchat', () => {
  it('un succès rend le solde après débit', () => {
    expect(lireReponseAchat({ ok: true, gemmes: 40 })).toEqual({ ok: true, gemmes: 40 })
  })

  it('un refus rend sa raison', () => {
    expect(lireReponseAchat({ ok: false, raison: 'pas_assez' })).toEqual({
      ok: false,
      raison: 'pas_assez',
    })
  })

  it('une réponse illisible n’est JAMAIS un succès', () => {
    expect(lireReponseAchat(null)).toEqual({ ok: false, raison: 'panne' })
    expect(lireReponseAchat('ok')).toEqual({ ok: false, raison: 'panne' })
    expect(lireReponseAchat({ ok: 'true', gemmes: 3 })).toEqual({ ok: false, raison: 'panne' })
    expect(lireReponseAchat({ ok: true, gemmes: 'x' })).toEqual({ ok: true, gemmes: 0 })
  })
})

describe('messages de refus', () => {
  it('chaque raison d’une offre a sa phrase', () => {
    const raisons = ['inconnue', 'deja_actif', 'plein', 'pas_assez']
    const phrases = raisons.map(messageRefusOffre)
    expect(new Set(phrases).size).toBe(raisons.length)
    expect(phrases).not.toContain(MESSAGE_PANNE)
    expect(messageRefusOffre('plein')).toContain('bouclier')
    // Un Boost XP par jour (373) : on dit QUAND il revient.
    expect(messageRefusOffre('deja_aujourdhui')).toMatch(/demain/)
    expect(messageRefusOffre('anonyme')).toBe(MESSAGE_ANONYME)
    expect(messageRefusOffre('???')).toBe(MESSAGE_PANNE)
  })

  it('chaque raison d’un objet a sa phrase', () => {
    const raisons = ['inconnu', 'deja', 'pas_assez']
    const phrases = raisons.map(messageRefusObjet)
    expect(new Set(phrases).size).toBe(raisons.length)
    expect(phrases).not.toContain(MESSAGE_PANNE)
    expect(messageRefusObjet('anonyme')).toBe(MESSAGE_ANONYME)
    expect(messageRefusObjet('panne')).toBe(MESSAGE_PANNE)
  })
})

describe('idObjetValide', () => {
  it('accepte la forme des ids du vestiaire', () => {
    expect(idObjetValide('banner-couronne-royale')).toBe(true)
    expect(idObjetValide('equip-casque')).toBe(true)
  })

  it('refuse le reste', () => {
    expect(idObjetValide('')).toBe(false)
    expect(idObjetValide('Banner')).toBe(false)
    expect(idObjetValide("x'; drop")).toBe(false)
    expect(idObjetValide('a'.repeat(81))).toBe(false)
    expect(idObjetValide(42)).toBe(false)
  })
})
