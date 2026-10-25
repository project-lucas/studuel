import { describe, expect, it } from 'vitest'
import { joursAvant, libelleReveil, reveilDuMois, sommeilDe } from './sommeil'

const LE_19_OCTOBRE = new Date(Date.UTC(2026, 9, 19, 14, 0))

describe('Marcel dort', () => {
  it('se réveille le 1er du mois suivant', () => {
    expect(reveilDuMois(LE_19_OCTOBRE)).toBe('2026-11-01')
    expect(reveilDuMois(new Date(Date.UTC(2026, 11, 31)))).toBe('2027-01-01')
    expect(libelleReveil('2026-11-01')).toBe('le 1er novembre')
    expect(joursAvant('2026-11-01', LE_19_OCTOBRE)).toBe(13)
  })

  it('dort quand tout est bu, et propose un café', () => {
    const s = sommeilDe({ possible: false, source: 'vide', restants: 0, jetons: 0 }, 200, LE_19_OCTOBRE)
    expect(s.etat).toBe('endormi')
    expect(s.titre).toBe('Marcel dort.')
    expect(s.phrase).toContain('dans 13 jours, le 1er novembre')
    expect(s.phrase).toContain('si tu lui offres un café')
    expect(s.recharger).toBe(true)
  })

  it('dit « demain » la veille du réveil', () => {
    const s = sommeilDe({ possible: false, source: 'vide', restants: 0, jetons: 0 }, 200, new Date(Date.UTC(2026, 9, 31, 20)))
    expect(s.phrase).toContain('demain')
  })

  it('bâille sous 10 % sans recharge, en comptant les cafés', () => {
    const s = sommeilDe({ possible: true, source: 'credit', restants: 20, jetons: 0 }, 200, LE_19_OCTOBRE)
    expect(s.etat).toBe('fatigue')
    expect(s.phrase).toBe('Encore 20 cafés avant qu’il s’endorme jusqu’au 1er novembre.')
    expect(sommeilDe({ possible: true, source: 'credit', restants: 1, jetons: 0 }, 200, LE_19_OCTOBRE).phrase).toMatch(/^Encore 1 café /)
    expect(sommeilDe({ possible: true, source: 'credit', restants: 21, jetons: 0 }, 200, LE_19_OCTOBRE).etat).toBe('eveille')
    expect(sommeilDe({ possible: true, source: 'credit', restants: 5, jetons: 30 }, 200, LE_19_OCTOBRE).etat).toBe('eveille')
  })

  it('est réveillé par un café : les cafés du mois bus, la recharge le tient debout', () => {
    const s = sommeilDe({ possible: true, source: 'jeton', restants: 0, jetons: 40 }, 200, LE_19_OCTOBRE)
    expect(s.etat).toBe('reveille')
    expect(s.titre).toBe('Marcel est réveillé !')
    expect(s.phrase).toContain('40 cafés de recharge')
    expect(s.recharger).toBe(false)
  })

  it('se repose au plafond du jour, sans café possible', () => {
    const s = sommeilDe({ possible: false, source: 'plafond', restants: 100, jetons: 0 }, 200, LE_19_OCTOBRE)
    expect(s.etat).toBe('repos')
    expect(s.recharger).toBe(false)
  })

  it('renvoie le gratuit vers Studuel+', () => {
    const s = sommeilDe({ possible: false, source: 'abonnement', restants: 0, jetons: 0 }, 0, LE_19_OCTOBRE)
    expect(s.etat).toBe('abonnement')
    expect(s.recharger).toBe(false)
  })

  it('ne dit jamais « crédit » à l’écran', () => {
    const tous = [
      sommeilDe({ possible: false, source: 'vide', restants: 0, jetons: 0 }, 200, LE_19_OCTOBRE),
      sommeilDe({ possible: true, source: 'credit', restants: 3, jetons: 0 }, 200, LE_19_OCTOBRE),
      sommeilDe({ possible: true, source: 'jeton', restants: 0, jetons: 7 }, 200, LE_19_OCTOBRE),
      sommeilDe({ possible: false, source: 'plafond', restants: 9, jetons: 0 }, 200, LE_19_OCTOBRE),
      sommeilDe({ possible: false, source: 'abonnement', restants: 0, jetons: 0 }, 0, LE_19_OCTOBRE),
    ]
    for (const s of tous) expect(`${s.titre} ${s.phrase}`).not.toMatch(/cr[ée]dit|jeton/i)
  })
})
