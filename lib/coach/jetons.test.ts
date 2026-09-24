import { describe, it, expect } from 'vitest'
import {
  GEMMES_PAR_PACK,
  JETONS_PAR_PACK,
  PLAFOND_ABSOLU,
  coutEnGemmes,
  etatDemande,
  jetonsPour,
  manqueGemmes,
  peutAcheter,
} from './jetons'

describe('etatDemande (crédits du mois, migration 378)', () => {
  it('ferme Marcel au gratuit : il fait partie de Studuel+', () => {
    const etat = etatDemande({ tier: 'free', utilisesAujourdhui: 0, depensesMois: 0, jetons: 10 })
    expect(etat.possible).toBe(false)
    expect(etat.source).toBe('abonnement')
    expect(etat.message).toMatch(/Studuel\+/)
  })

  it('puise d’abord dans les crédits du mois, jetons intacts', () => {
    const etat = etatDemande({ tier: 'tier1', utilisesAujourdhui: 3, depensesMois: 25, jetons: 10 })
    expect(etat).toMatchObject({ possible: true, source: 'credit', restants: 175, jetons: 10 })
    expect(etat.message).toBe('Il te reste 175 crédits ce mois-ci.')
  })

  it('bascule sur les jetons une fois les crédits épuisés', () => {
    const etat = etatDemande({ tier: 'tier1', utilisesAujourdhui: 0, depensesMois: 200, jetons: 1 })
    expect(etat).toMatchObject({ possible: true, source: 'jeton', restants: 0 })
    expect(etat.message).toContain('1 jeton.')
  })

  it('ferme la porte quand il n’y a plus ni crédit ni jeton', () => {
    const etat = etatDemande({ tier: 'tier2', utilisesAujourdhui: 0, depensesMois: 200, jetons: 0 })
    expect(etat).toMatchObject({ possible: false, source: 'vide' })
    expect(etat.message).toContain('1er du mois')
  })

  it('le PLAFOND ABSOLU ne se lève ni avec des crédits ni avec des jetons', () => {
    const etat = etatDemande({ tier: 'tier3', utilisesAujourdhui: PLAFOND_ABSOLU, depensesMois: 0, jetons: 9_999 })
    expect(etat.possible).toBe(false)
    expect(etat.source).toBe('plafond')
  })

  it('accorde le singulier du dernier crédit', () => {
    expect(etatDemande({ tier: 'tier1', utilisesAujourdhui: 0, depensesMois: 199, jetons: 0 }).message).toBe(
      'Il te reste 1 crédit ce mois-ci.',
    )
  })

  it('encaisse des compteurs négatifs ou fractionnaires', () => {
    const etat = etatDemande({ tier: 'tier1', utilisesAujourdhui: -12, depensesMois: -3.5, jetons: -3 })
    expect(etat).toMatchObject({ possible: true, restants: 200, jetons: 0 })
  })
})

describe('l’achat en gemmes', () => {
  it('compte les packs sans jamais rendre un montant négatif', () => {
    expect(coutEnGemmes(2)).toBe(2 * GEMMES_PAR_PACK)
    expect(jetonsPour(2)).toBe(2 * JETONS_PAR_PACK)
    expect(coutEnGemmes(-4)).toBe(0)
    expect(jetonsPour(-4)).toBe(0)
  })

  it('sait si le solde suffit', () => {
    expect(peutAcheter(GEMMES_PAR_PACK)).toBe(true)
    expect(peutAcheter(GEMMES_PAR_PACK - 1)).toBe(false)
  })

  it('dit ce qui manque, au singulier comme au pluriel', () => {
    expect(manqueGemmes(GEMMES_PAR_PACK)).toBeNull()
    expect(manqueGemmes(GEMMES_PAR_PACK - 1)).toBe('Il te manque 1 gemme')
    expect(manqueGemmes(0)).toBe(`Il te manque ${GEMMES_PAR_PACK} gemmes`)
  })
})
