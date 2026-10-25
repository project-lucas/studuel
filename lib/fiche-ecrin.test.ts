import { describe, expect, it } from 'vitest'
import { GEM_COST_CHAPTER } from './gems'
import {
  REPLI_FICHE,
  ROULEAU_FERME,
  ROULEAU_OUVERT,
  TITRE_CONFIRMATION,
  imagesEcrin,
  soldeEcrin,
} from './fiche-ecrin'

describe('le solde lu par l’écrin', () => {
  it('dit ce qui reste quand le solde suffit', () => {
    const s = soldeEcrin(45)
    expect(s.peut).toBe(true)
    expect(s.apres).toBe(45 - GEM_COST_CHAPTER)
    expect(s.manque).toBe(0)
    expect(s.phrase).toBe('Il te reste 45 gemmes')
  })

  it('suffit tout juste au prix exact', () => {
    const s = soldeEcrin(GEM_COST_CHAPTER)
    expect(s.peut).toBe(true)
    expect(s.apres).toBe(0)
  })

  it('dit ce qui manque, et comment en gagner', () => {
    const s = soldeEcrin(10)
    expect(s.peut).toBe(false)
    expect(s.manque).toBe(GEM_COST_CHAPTER - 10)
    expect(s.apres).toBe(10)
    expect(s.phrase).toMatch(/^Il te manque 20 gemmes — invite un ami/)
  })

  it('ne fait pas confiance à un solde absurde', () => {
    expect(soldeEcrin(-3).manque).toBe(GEM_COST_CHAPTER)
    expect(soldeEcrin(Number.NaN).peut).toBe(false)
    expect(soldeEcrin(30.9).peut).toBe(true)
  })

  it('accorde la gemme au singulier', () => {
    expect(soldeEcrin(GEM_COST_CHAPTER - 1).phrase).toMatch(/^Il te manque 1 gemme —/)
  })
})

describe('les images de l’écrin', () => {
  it('sert le rouleau quand il est livré, fermé puis ouvert', () => {
    const i = imagesEcrin({ ferme: ROULEAU_FERME, ouvert: ROULEAU_OUVERT })
    expect(i).toEqual({ ferme: ROULEAU_FERME, ouvert: ROULEAU_OUVERT, repli: false })
  })

  it('fait servir le rouleau fermé pour l’ouvert quand seul le fermé existe', () => {
    const i = imagesEcrin({ ferme: ROULEAU_FERME, ouvert: null })
    expect(i.ouvert).toBe(ROULEAU_FERME)
    expect(i.repli).toBe(false)
  })

  it('se replie sur la fiche du Marché quand rien n’est dessiné', () => {
    expect(imagesEcrin(null)).toEqual({ ferme: REPLI_FICHE, ouvert: REPLI_FICHE, repli: true })
    expect(imagesEcrin({ ferme: null, ouvert: ROULEAU_OUVERT }).repli).toBe(true)
    expect(imagesEcrin(undefined).repli).toBe(true)
  })
})

describe('les textes', () => {
  it('écrit le prix dans la question de confirmation', () => {
    expect(TITRE_CONFIRMATION).toBe(`Dépenser ${GEM_COST_CHAPTER} gemmes ?`)
  })
})
