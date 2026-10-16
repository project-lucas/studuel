import { describe, expect, it } from 'vitest'
import { APPEL_TYPE, coutAppel, coutMoyenCredit, libelleCout, margeAbonne, tarifDe } from './cout'
import { CREDITS_MENSUELS } from './credits'
import { RECHARGES } from './recharges'

describe('ce que coûte Marcel', () => {
  it('compte le cache moins cher que l’entrée pleine', () => {
    const sansCache = coutAppel('deepseek-chat', { entree: 1000, sortie: 0 })
    const avecCache = coutAppel('deepseek-chat', { entree: 1000, entreeCache: 1000, sortie: 0 })
    expect(avecCache).toBeLessThan(sansCache / 5)
  })

  it('prend le tarif le plus prudent pour un modèle inconnu', () => {
    expect(tarifDe('modele-inconnu').sortie).toBeGreaterThanOrEqual(tarifDe('deepseek-chat').sortie)
  })

  it('une fiche coûte plus qu’une question', () => {
    expect(coutAppel('deepseek-chat', APPEL_TYPE.fiche)).toBeGreaterThan(coutAppel('deepseek-chat', APPEL_TYPE.question))
  })

  it('laisse l’IA sous 5 % de l’abonnement, même crédits vidés', () => {
    for (const modele of ['deepseek-chat', 'gpt-4o-mini']) {
      const m = margeAbonne({ prixTTC: 4.99, credits: CREDITS_MENSUELS, coutCredit: coutMoyenCredit(modele) })
      expect(m.partIa).toBeLessThan(0.05)
      expect(m.marge).toBeGreaterThan(3)
    }
  })

  it('garde une marge sur chaque recharge, même au modèle prudent', () => {
    for (const r of RECHARGES) {
      const cout = r.credits * coutMoyenCredit('inconnu')
      expect(cout).toBeLessThan((r.prixEuros / 1.2) * 0.85 * 0.25)
    }
  })

  it('écrit un coût lisible', () => {
    expect(libelleCout(0.0004)).toBe('0,04 c')
    expect(libelleCout(0.021)).toBe('2,1 c')
    expect(libelleCout(1.2)).toBe('1,20 €')
  })
})
