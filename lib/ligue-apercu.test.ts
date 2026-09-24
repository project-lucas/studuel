import { describe, expect, it } from 'vitest'
import { ligueApercu } from './ligue-apercu'
import { TAILLE_GROUPE } from './ligue'

describe('la ligue d’exemple', () => {
  const maintenant = new Date('2026-09-24T10:00:00Z')

  it('remplit un groupe de 30, classé, avec ma ligne au rang demandé', () => {
    const etat = ligueApercu({ maintenant, monRang: 12 })
    expect(etat.groupe).toHaveLength(TAILLE_GROUPE)
    expect(etat.groupe.map((m) => m.rang)).toEqual(Array.from({ length: 30 }, (_, i) => i + 1))
    expect(etat.groupe.filter((m) => m.moi).map((m) => m.rang)).toEqual([12])
    for (let i = 1; i < etat.groupe.length; i++) {
      expect(etat.groupe[i].xp).toBeLessThan(etat.groupe[i - 1].xp)
    }
    expect(new Set(etat.groupe.map((m) => m.cle)).size).toBe(TAILLE_GROUPE)
    expect(etat.xpSemaine).toBe(etat.groupe[11].xp)
    expect(etat.semaine).toBe('2026-09-21')
    expect(etat.fin).toBe('2026-09-28T00:00:00.000Z')
  })

  it('montre l’état « pas encore dans la ligue »', () => {
    const etat = ligueApercu({ maintenant, inscrit: false })
    expect(etat.inscrit).toBe(false)
    expect(etat.groupe).toEqual([])
    expect(etat.xpSemaine).toBe(0)
  })
})
