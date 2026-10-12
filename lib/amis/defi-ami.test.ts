import { describe, expect, it } from 'vitest'
import { encoderDefi, lienDirect, lienDuMode, lireDefi, lireDefisRecus, messageDefi, modesDuDefi } from '@/lib/amis/defi-ami'
import { isEpreuveId } from '@/lib/palmares/epreuves'

const ID = '0b6a3f2e-4c1d-4e8a-9f00-123456789abc'

describe('le cookie du défi', () => {
  it('se relit tel qu’il a été écrit', () => {
    expect(lireDefi(encoderDefi(ID, 'blitz'))).toEqual({ duelId: ID, mode: 'blitz' })
    expect(lireDefi(encoderDefi(ID, 'calcul-mental'))).toEqual({ duelId: ID, mode: 'calcul-mental' })
  })
  it('refuse ce qui est mal formé', () => {
    expect(lireDefi(undefined)).toBeNull()
    expect(lireDefi('pas-un-uuid|blitz')).toBeNull()
    expect(lireDefi(`${ID}|inconnu`)).toBeNull()
    expect(lireDefi(ID)).toBeNull()
  })
})

describe('modesDuDefi', () => {
  it('ne propose que des modes classés, avec un lien', () => {
    const modes = modesDuDefi('2026-10-05', false)
    expect(modes.length).toBeGreaterThan(5)
    for (const m of modes) {
      expect(isEpreuveId(m.mode)).toBe(true)
      expect(m.ticket.href).toBeTruthy()
      expect(m.ticket.verrou).toBeFalsy()
    }
  })
  it('ouvre plus de jeux à un abonné', () => {
    expect(modesDuDefi('2026-10-05', true).length).toBeGreaterThan(modesDuDefi('2026-10-05', false).length)
  })
  it('donne le lien d’un mode', () => {
    expect(lienDuMode('2026-10-05', false, 'blitz')).toBe('/defi/jouer?mode=blitz')
  })
})

describe('messageDefi', () => {
  it('nomme le lanceur', () => {
    expect(messageDefi('Lucas')).toMatchObject({ title: 'Lucas te défie !', url: '/amis' })
    expect(messageDefi('  ').title).toBe('Un ami te défie !')
  })
})

describe('lireDefisRecus', () => {
  it('relit les défis et écarte le reste', () => {
    const l = lireDefisRecus([
      { id: ID, de: 'x', nom: 'Léa', portrait: '5', mode: 'blitz', son_score: 6200 },
      { id: 'mauvais', de: 'x' },
      null,
    ])
    expect(l).toEqual([{ id: ID, de: 'x', nom: 'Léa', portrait: '5', mode: 'blitz', sonScore: 6200 }])
    expect(lireDefisRecus([{ id: ID, de: 'x', mode: 'inconnu' }])[0]).toMatchObject({ mode: null, sonScore: null, nom: 'Un ami' })
  })
})

describe('lienDirect', () => {
  it('mène au mode de l’arène ou au jeu', () => {
    expect(lienDirect('survie')).toBe('/defi/jouer?mode=survie')
    expect(lienDirect('calcul-mental')).toBe('/defi/jeux/calcul-mental')
  })
})
