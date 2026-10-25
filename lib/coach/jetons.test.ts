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

describe('etatDemande (cafés du mois, migration 378)', () => {
  it('ferme Marcel au gratuit : il fait partie de Studuel+', () => {
    const etat = etatDemande({ tier: 'free', utilisesAujourdhui: 0, depensesMois: 0, jetons: 10 })
    expect(etat.possible).toBe(false)
    expect(etat.source).toBe('abonnement')
    expect(etat.message).toMatch(/Studuel\+/)
    expect(etat.message).toContain('200 cafés par mois')
  })

  it('puise d’abord dans les cafés du mois, recharge intacte', () => {
    const etat = etatDemande({ tier: 'tier1', utilisesAujourdhui: 3, depensesMois: 25, jetons: 10 })
    expect(etat).toMatchObject({ possible: true, source: 'credit', restants: 175, jetons: 10 })
    expect(etat.message).toBe('Il te reste 175 cafés ce mois-ci.')
  })

  it('bascule sur les cafés de recharge une fois ceux du mois bus', () => {
    const etat = etatDemande({ tier: 'tier1', utilisesAujourdhui: 0, depensesMois: 200, jetons: 1 })
    expect(etat).toMatchObject({ possible: true, source: 'jeton', restants: 0 })
    expect(etat.message).toBe('Tes cafés du mois sont bus — il te reste 1 café de recharge.')
    expect(etatDemande({ tier: 'tier1', utilisesAujourdhui: 0, depensesMois: 200, jetons: 40 }).message).toContain(
      '40 cafés de recharge',
    )
  })

  it('ferme la porte quand il n’y a plus aucun café', () => {
    const etat = etatDemande({ tier: 'tier2', utilisesAujourdhui: 0, depensesMois: 200, jetons: 0 })
    expect(etat).toMatchObject({ possible: false, source: 'vide' })
    expect(etat.message).toContain('1er du mois')
    expect(etat.message).toMatch(/Marcel dort/)
  })

  it('le PLAFOND ABSOLU ne se lève ni avec les cafés du mois ni avec la recharge', () => {
    const etat = etatDemande({ tier: 'tier3', utilisesAujourdhui: PLAFOND_ABSOLU, depensesMois: 0, jetons: 9_999 })
    expect(etat.possible).toBe(false)
    expect(etat.source).toBe('plafond')
  })

  it('accorde le singulier du dernier café', () => {
    expect(etatDemande({ tier: 'tier1', utilisesAujourdhui: 0, depensesMois: 199, jetons: 0 }).message).toBe(
      'Il te reste 1 café ce mois-ci.',
    )
  })

  it('ne dit plus jamais « crédit » à l’écran', () => {
    const cas = [
      { tier: 'free', utilisesAujourdhui: 0, depensesMois: 0, jetons: 0 },
      { tier: 'tier1', utilisesAujourdhui: 0, depensesMois: 0, jetons: 0 },
      { tier: 'tier1', utilisesAujourdhui: 0, depensesMois: 200, jetons: 3 },
      { tier: 'tier1', utilisesAujourdhui: 0, depensesMois: 200, jetons: 0 },
      { tier: 'tier1', utilisesAujourdhui: PLAFOND_ABSOLU, depensesMois: 0, jetons: 0 },
    ] as const
    for (const c of cas) expect(etatDemande(c).message).not.toMatch(/cr[ée]dit|jeton/i)
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
