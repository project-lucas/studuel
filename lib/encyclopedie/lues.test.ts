import { describe, expect, it } from 'vitest'
import { MAX_LUES, ajouterLue } from './lues'

describe('ajouterLue', () => {
  it('ajoute une fiche en tête', () => {
    expect(ajouterLue(['clovis'], 'saint-louis')).toEqual(['saint-louis', 'clovis'])
  })

  it('remonte une fiche déjà lue au lieu de la doubler', () => {
    // C'est aussi l'historique « reprendre où j'en étais » : rouvrir une fiche
    // doit la remettre devant, pas créer une seconde ligne.
    expect(ajouterLue(['clovis', 'saint-louis'], 'saint-louis')).toEqual([
      'saint-louis',
      'clovis',
    ])
  })

  it('borne la liste', () => {
    const pleine = Array.from({ length: MAX_LUES }, (_, i) => `fiche-${i}`)
    const apres = ajouterLue(pleine, 'jeanne-d-arc')
    expect(apres).toHaveLength(MAX_LUES)
    expect(apres[0]).toBe('jeanne-d-arc')
    expect(apres).not.toContain(`fiche-${MAX_LUES - 1}`)
  })

  it('ne modifie pas la liste qu’on lui donne', () => {
    const avant = ['clovis']
    ajouterLue(avant, 'saint-louis')
    expect(avant).toEqual(['clovis'])
  })
})
