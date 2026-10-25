import { describe, expect, it } from 'vitest'
import { ANNALES_GRATUITES_PAR_MATIERE, PILIERS, avantagesStudueLPlus, pilier } from './formule'
import { PLANS } from '@/lib/premium'

describe('la formule Studuel+', () => {
  it('tient en cinq piliers, chacun avec ce que le gratuit en garde', () => {
    expect(PILIERS.map((p) => p.id)).toEqual(['marcel', 'examen', 'annales', 'rente', 'prepa'])
    for (const p of PILIERS) {
      expect(p.gratuit.length).toBeGreaterThan(5)
      expect(p.href.startsWith('/')).toBe(true)
    }
  })

  it('ne vend pas un pilier en construction', () => {
    const avantages = avantagesStudueLPlus().join(' | ')
    expect(avantages).not.toMatch(/prépa du supérieur/i)
    expect(avantages).toMatch(/Marcel/)
    expect(avantages).toMatch(/60 gemmes par semaine/)
  })

  it('paie Marcel en cafés, plus en crédits', () => {
    expect(pilier('marcel').promesse).toBe('200 cafés par mois pour lui parler')
    for (const p of PILIERS) expect(`${p.titre} ${p.promesse} ${p.detail} ${p.gratuit}`).not.toMatch(/cr[ée]dit/i)
  })

  it('donne deux annales par matière au gratuit', () => {
    expect(ANNALES_GRATUITES_PAR_MATIERE).toBe(2)
    expect(pilier('annales').gratuit).toMatch(/^2 annales/)
  })

  it('n’annonce plus les fiches offertes par l’abonnement', () => {
    const plus = PLANS.find((p) => p.id === 'plus')
    expect(plus?.features.join(' ')).not.toMatch(/sans gemme/)
    expect(plus?.features).toEqual(avantagesStudueLPlus())
  })
})
