import { describe, expect, it } from 'vitest'
import { lireFicheJoueur, tauxVictoire } from '@/lib/amis/fiche-joueur'

describe('lireFicheJoueur', () => {
  it('relit la fiche de la 558', () => {
    const f = lireFicheJoueur({
      id: 'b',
      ami: true,
      nom: 'Léa',
      pseudo: 'LéaLaFoudre',
      portrait: '5',
      xp: 3000,
      trophees: 500,
      meilleurs_trophees: 520,
      victoires: 9,
      defaites: 1,
      serie: 4,
      badges: ['premier-pas', 3],
      records: [
        { mode: 'calcul-mental', best: 6000, rang: 2, sur: 20 },
        { mode: 'inconnu', best: 1 },
      ],
    })!
    expect(f.niveau).toBe(8)
    expect(f.badges).toEqual(['premier-pas'])
    expect(f.records).toEqual([{ mode: 'calcul-mental', best: 6000, top: 10 }])
    expect(f.pseudo).toBe('LéaLaFoudre')
  })
  it('refuse ce qui n’est pas une fiche', () => {
    expect(lireFicheJoueur(null)).toBeNull()
    expect(lireFicheJoueur({ nom: 'x' })).toBeNull()
  })
})

describe('tauxVictoire', () => {
  it('se tait avant le premier duel', () => {
    expect(tauxVictoire({ victoires: 0, defaites: 0 })).toBeNull()
    expect(tauxVictoire({ victoires: 9, defaites: 1 })).toBe(90)
  })
})
