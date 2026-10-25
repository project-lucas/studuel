import { describe, expect, it } from 'vitest'
import {
  cleDemandee,
  decouverteProgressiveActive,
  ETAT_TOUT_OUVERT,
  estFermee,
  nouveauteSurLaPage,
  nouveautesAAnnoncer,
  ongletDuChemin,
  ongletsVerrouilles,
  prochaineDecouverte,
  progressionVersNiveau,
  verrouDeLOnglet,
  verrouDuChemin,
  xpManquante,
  type EtatDecouverte,
} from '@/lib/decouverte/etat'
import { DECOUVERTES, decouverteParCle } from '@/lib/decouverte/catalogue'

const DEPUIS = '2026-10-25T10:00:00.000Z'

const etat = (partiel: Partial<EtatDecouverte>): EtatDecouverte => ({
  niveau: 1,
  xp: 0,
  vues: [],
  depuis: DEPUIS,
  ...partiel,
})

describe('decouverteProgressiveActive', () => {
  it('ne s’applique qu’aux comptes datés', () => {
    expect(decouverteProgressiveActive(null)).toBe(false)
    expect(decouverteProgressiveActive(DEPUIS)).toBe(true)
  })
})

describe('ongletsVerrouilles', () => {
  it('ferme Défi, Amis et Boutique à un nouveau compte de niveau 1', () => {
    const verrous = ongletsVerrouilles(1, [], DEPUIS).map((d) => d.onglet)
    expect(verrous).toEqual(['defi', 'amis', 'tresor'])
  })

  it('ouvre Défi au niveau 2, Amis et Boutique au niveau 3', () => {
    expect(ongletsVerrouilles(2, [], DEPUIS).map((d) => d.onglet)).toEqual(['amis', 'tresor'])
    expect(ongletsVerrouilles(3, [], DEPUIS).map((d) => d.onglet)).toEqual([])
  })

  it('NULL = ancien compte : rien n’est jamais verrouillé, même au niveau 1', () => {
    expect(ongletsVerrouilles(1, [], null)).toEqual([])
  })

  it('une découverte déjà vue ne se referme jamais, même sous le niveau', () => {
    expect(ongletsVerrouilles(1, ['defi'], DEPUIS).map((d) => d.onglet)).toEqual(['amis', 'tresor'])
  })

  it('ne verrouille jamais Réviser ni Moi', () => {
    const verrous = ongletsVerrouilles(1, [], DEPUIS).map((d) => d.onglet)
    expect(verrous).not.toContain('reviser')
    expect(verrous).not.toContain('moi')
  })
})

describe('verrouDeLOnglet · verrouDuChemin', () => {
  it('rend la découverte qui ferme l’onglet, ou null', () => {
    const e = etat({ niveau: 1 })
    expect(verrouDeLOnglet('defi', e)?.cle).toBe('defi')
    expect(verrouDeLOnglet('reviser', e)).toBeNull()
    expect(verrouDeLOnglet('defi', ETAT_TOUT_OUVERT)).toBeNull()
  })

  it('reconnaît un chemin sous un onglet fermé', () => {
    const e = etat({ niveau: 2 })
    expect(verrouDuChemin('/amis', e)?.cle).toBe('amis')
    expect(verrouDuChemin('/amis/ligue?x=1', e)?.cle).toBe('amis')
    expect(verrouDuChemin('/defi', e)).toBeNull()
    expect(verrouDuChemin('/reviser', e)).toBeNull()
  })
})

describe('estFermee', () => {
  it('suit le niveau d’ouverture du catalogue', () => {
    const gardiens = decouverteParCle('gardiens')!
    expect(estFermee(gardiens, 3, [], DEPUIS)).toBe(true)
    expect(estFermee(gardiens, 4, [], DEPUIS)).toBe(false)
    expect(estFermee(gardiens, 1, [], null)).toBe(false)
  })
})

describe('nouveautesAAnnoncer', () => {
  it('liste ce qui est ouvert et jamais vu, dans l’ordre du catalogue', () => {
    expect(nouveautesAAnnoncer(2, ['reviser'], DEPUIS).map((d) => d.cle)).toEqual([
      'courrier',
      'marcel',
      'bibliotheque',
      'defi',
    ])
  })

  it('rien pour un ancien compte', () => {
    expect(nouveautesAAnnoncer(10, [], null)).toEqual([])
  })

  it('rien quand tout a été vu', () => {
    const toutes = DECOUVERTES.map((d) => d.cle)
    expect(nouveautesAAnnoncer(10, toutes, DEPUIS)).toEqual([])
  })
})

describe('nouveauteSurLaPage', () => {
  it('trouve la nouveauté dont la page est affichée', () => {
    const e = etat({ niveau: 2, vues: ['reviser', 'courrier'] })
    expect(nouveauteSurLaPage('/marcel', e)?.cle).toBe('marcel')
    expect(nouveauteSurLaPage('/defi', e)?.cle).toBe('defi')
    expect(nouveauteSurLaPage('/defi/', e)?.cle).toBe('defi')
    expect(nouveauteSurLaPage('/amis', e)).toBeNull()
  })

  it('les gardiens (niveau 4) passent avant rien sur /defi tant que l’arène n’est pas vue', () => {
    const e = etat({ niveau: 4, vues: ['reviser'] })
    expect(nouveauteSurLaPage('/defi', e)?.cle).toBe('defi')
    expect(nouveauteSurLaPage('/defi', { ...e, vues: ['reviser', 'defi'] })?.cle).toBe('gardiens')
  })

  it('rien pour un ancien compte', () => {
    expect(nouveauteSurLaPage('/defi', ETAT_TOUT_OUVERT)).toBeNull()
  })

  it('ne relance jamais « reviser » sur /reviser : c’est le tour premiers pas qui s’en charge', () => {
    expect(nouveauteSurLaPage('/reviser', etat({ niveau: 1 }))).toBeNull()
  })
})

describe('prochaineDecouverte', () => {
  it('est la première encore fermée', () => {
    expect(prochaineDecouverte(etat({ niveau: 1 }))?.cle).toBe('marcel')
    expect(prochaineDecouverte(etat({ niveau: 3 }))?.cle).toBe('gardiens')
    expect(prochaineDecouverte(etat({ niveau: 4 }))).toBeNull()
    expect(prochaineDecouverte(ETAT_TOUT_OUVERT)).toBeNull()
  })
})

describe('xpManquante · progressionVersNiveau', () => {
  it('compte ce qu’il manque pour le niveau 2 (100 XP)', () => {
    expect(xpManquante(40, 2)).toBe(60)
    expect(xpManquante(100, 2)).toBe(0)
    expect(xpManquante(-5, 3)).toBe(300)
  })

  it('donne une part 0..1, jamais au-delà', () => {
    expect(progressionVersNiveau(50, 2)).toBe(0.5)
    expect(progressionVersNiveau(400, 2)).toBe(1)
    expect(progressionVersNiveau(0, 1)).toBe(1)
  })
})

describe('ongletDuChemin · cleDemandee', () => {
  it('lit l’onglet verrouillable d’un chemin', () => {
    expect(ongletDuChemin('/defi')).toBe('defi')
    expect(ongletDuChemin('/tresor/capsules')).toBe('tresor')
    expect(ongletDuChemin('/reviser')).toBeNull()
    expect(ongletDuChemin('/')).toBeNull()
  })

  it('n’accepte que les clés du catalogue', () => {
    expect(cleDemandee('defi')).toBe('defi')
    expect(cleDemandee('xyz')).toBeNull()
    expect(cleDemandee(null)).toBeNull()
    expect(cleDemandee(undefined)).toBeNull()
  })
})
