import { describe, expect, it } from 'vitest'
import { etatsDesPiliers } from './etats'

describe('ce que chaque pilier dit à un élève', () => {
  it('compte les crédits et la recharge de l’abonné', () => {
    const e = etatsDesPiliers({ abonne: true, classe: '3e', creditsRestants: 1, creditsRecharge: 50, examen: null, annales: 42 })
    expect(e.marcel).toBe('1 café ce mois-ci · 50 en recharge')
    expect(e.annales).toBe('42 sujets, tous ouverts pour toi')
  })

  it('dit le jour J et la phase', () => {
    const e = etatsDesPiliers({ abonne: true, classe: '3e', creditsRestants: 200, creditsRecharge: 0, examen: { nom: 'Le brevet', jours: 30 }, annales: 1 })
    expect(e.examen).toBe('Le brevet · J-30 · le sprint')
  })

  it('n’annonce la prépa du supérieur qu’au lycée qui s’oriente', () => {
    expect(etatsDesPiliers({ abonne: false, classe: 'Tle', creditsRestants: 0, creditsRecharge: 0, examen: null, annales: 0 }).prepa).toMatch(/dis-nous/)
    expect(etatsDesPiliers({ abonne: false, classe: '4e', creditsRestants: 0, creditsRecharge: 0, examen: null, annales: 0 }).prepa).toMatch(/1re et la Terminale/)
  })
})
