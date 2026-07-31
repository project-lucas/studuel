import { describe, it, expect } from 'vitest'
import {
  GEMMES_PAR_PACK,
  JETONS_PAR_PACK,
  PLAFOND_ABSOLU,
  QUOTA_GRATUIT,
  QUOTA_PREMIUM,
  coutEnGemmes,
  etatDemande,
  jetonsPour,
  manqueGemmes,
  peutAcheter,
  quotaFor,
} from './jetons'

describe('quotaFor', () => {
  it('offre plus à l’abonné, sans jamais rien lui vendre de plus', () => {
    expect(quotaFor('free')).toBe(QUOTA_GRATUIT)
    expect(quotaFor('anonymous')).toBe(QUOTA_GRATUIT)
    expect(quotaFor('tier1')).toBe(QUOTA_PREMIUM)
    expect(quotaFor('tier3')).toBe(QUOTA_PREMIUM)
  })
})

describe('etatDemande', () => {
  it('puise d’abord dans le quota gratuit, jetons intacts', () => {
    const etat = etatDemande({ tier: 'free', utilisesAujourdhui: 0, jetons: 10 })

    expect(etat.possible).toBe(true)
    expect(etat.source).toBe('quota')
    expect(etat.restantes).toBe(QUOTA_GRATUIT)
    expect(etat.jetons).toBe(10)
  })

  it('bascule sur les jetons une fois le quota épuisé', () => {
    const etat = etatDemande({
      tier: 'free',
      utilisesAujourdhui: QUOTA_GRATUIT,
      jetons: 4,
    })

    expect(etat.possible).toBe(true)
    expect(etat.source).toBe('jeton')
    expect(etat.restantes).toBe(0)
  })

  it('ferme la porte quand il n’y a plus ni quota ni jeton', () => {
    const etat = etatDemande({
      tier: 'free',
      utilisesAujourdhui: QUOTA_GRATUIT,
      jetons: 0,
    })

    expect(etat.possible).toBe(false)
    expect(etat.source).toBe('vide')
    expect(etat.message).toContain('demain')
  })

  it('le PLAFOND ABSOLU ne se lève avec aucun jeton', () => {
    // C'est une limite de facture, pas une limite d'usage : sans elle, un élève
    // assis sur 10 000 écus se paierait 10 000 appels dans la nuit.
    const etat = etatDemande({
      tier: 'tier3',
      utilisesAujourdhui: PLAFOND_ABSOLU,
      jetons: 9_999,
    })

    expect(etat.possible).toBe(false)
    expect(etat.source).toBe('plafond')
  })

  it('le plafond absolu domine même un abonné au quota intact', () => {
    const etat = etatDemande({
      tier: 'tier1',
      utilisesAujourdhui: PLAFOND_ABSOLU + 5,
      jetons: 3,
    })
    expect(etat.source).toBe('plafond')
  })

  it('parle toujours à l’endroit : ce qui reste, jamais ce qui est interdit', () => {
    const un = etatDemande({
      tier: 'free',
      utilisesAujourdhui: QUOTA_GRATUIT - 1,
      jetons: 0,
    })
    expect(un.message).toBe('Il te reste 1 question aujourd’hui.')

    const deux = etatDemande({
      tier: 'free',
      utilisesAujourdhui: QUOTA_GRATUIT - 2,
      jetons: 0,
    })
    expect(deux.message).toContain('2 questions')
  })

  it('accorde le singulier du jeton restant', () => {
    const etat = etatDemande({
      tier: 'free',
      utilisesAujourdhui: QUOTA_GRATUIT,
      jetons: 1,
    })
    expect(etat.message).toContain('1 jeton.')
  })

  it('encaisse des compteurs négatifs ou fractionnaires', () => {
    const etat = etatDemande({
      tier: 'free',
      utilisesAujourdhui: -12,
      jetons: -3,
    })

    expect(etat.restantes).toBe(QUOTA_GRATUIT)
    expect(etat.jetons).toBe(0)
    expect(etat.possible).toBe(true)
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
