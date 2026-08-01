import { describe, it, expect } from 'vitest'
import {
  chapitreCommence,
  gainSiMaitrise,
  prioriteFor,
  prioriteMaitrise,
  progressionGlobale,
  progressionMatiere,
  type ChapitreProgression,
} from '@/lib/progression'
import type { ChapterState } from '@/lib/mastery'

const chap = (
  value: number,
  state: ChapterState,
  vuEnCours = false,
): ChapitreProgression => ({ value, state, vuEnCours })

describe('chapitreCommence', () => {
  it('un chapitre déclaré vu en cours compte, même sans activité dans l’app', () => {
    expect(chapitreCommence(chap(0, 'a_commencer', true))).toBe(true)
  })

  it('un chapitre travaillé dans l’app compte sans avoir à être coché', () => {
    // Demander de cocher un chapitre dont on vient de jouer le quiz reviendrait
    // à faire ressaisir ce que l'app a sous les yeux — et le premier oubli
    // ferait remonter le pourcentage sans raison.
    for (const state of ['maitrise', 'en_cours', 'fragile'] as const) {
      expect(chapitreCommence(chap(0.5, state)), state).toBe(true)
    }
  })

  it('un chapitre ni vu ni ouvert ne compte pas', () => {
    expect(chapitreCommence(chap(0, 'a_commencer'))).toBe(false)
  })
})

describe('gainSiMaitrise', () => {
  it('rend exactement ce que la barre gagnera, pas une estimation', () => {
    // 5 chapitres commencés, celui-ci à 0 % : le porter à 100 % ajoute 100/5 = 20
    // points à la moyenne. Le bouton promet 20, la barre bougera de 20.
    const chapitres = [
      chap(0, 'fragile', true),
      ...Array.from({ length: 4 }, () => chap(0.5, 'en_cours', true)),
    ]
    const avant = progressionMatiere(chapitres).pct

    expect(gainSiMaitrise(chapitres, 0)).toBe(20)

    const apres = progressionMatiere(
      chapitres.map((c, i) => (i === 0 ? chap(1, 'maitrise', true) : c)),
    ).pct
    expect(apres - avant).toBe(20)
  })

  it('un chapitre déjà à 100 % ne promet plus rien', () => {
    const chapitres = [chap(1, 'maitrise', true), chap(0.4, 'fragile', true)]
    expect(gainSiMaitrise(chapitres, 0)).toBe(0)
  })

  it('ne promet RIEN sur un chapitre pas encore commencé', () => {
    // L'ouvrir l'ajoute au dénominateur : la matière peut même baisser. Ici,
    // 100 % sur 1 chapitre deviendrait 50 % sur 2 — un « + » serait un mensonge.
    const chapitres = [chap(1, 'maitrise', true), chap(0, 'a_commencer')]
    expect(gainSiMaitrise(chapitres, 1)).toBe(0)
  })

  it('plus la matière est large, plus un chapitre pèse peu', () => {
    const large = Array.from({ length: 20 }, () => chap(0.5, 'en_cours', true))
    expect(gainSiMaitrise(large, 0)).toBe(3) // 50/20 = 2,5 → arrondi de l'écart
  })

  it('ne parle pas d’un chapitre qui n’existe pas', () => {
    expect(gainSiMaitrise([], 0)).toBe(0)
  })
})

describe('progressionMatiere', () => {
  it('LE CAS DE LUCAS : 1 chapitre sur 10 commencé à 80 % donne 80 %, pas 8 %', () => {
    const chapitres = [
      chap(0.8, 'en_cours', true),
      ...Array.from({ length: 9 }, () => chap(0, 'a_commencer')),
    ]
    const p = progressionMatiere(chapitres)
    expect(p.pct).toBe(80)
    // Et le contexte part avec, pour qu'aucun écran ne puisse afficher 80 %
    // sans pouvoir dire « sur 1 chapitre des 10 ».
    expect(p.commences).toBe(1)
    expect(p.total).toBe(10)
    expect(p.jamais).toBe(9)
  })

  it('les chapitres jamais ouverts ne tirent plus la moyenne vers le bas', () => {
    const avecTrous = progressionMatiere([
      chap(1, 'maitrise', true),
      chap(0, 'a_commencer'),
      chap(0, 'a_commencer'),
    ])
    const sansTrous = progressionMatiere([chap(1, 'maitrise', true)])
    expect(avecTrous.pct).toBe(sansTrous.pct)
    expect(avecTrous.pct).toBe(100)
  })

  it('compte solides et en route parmi les seuls commencés', () => {
    const p = progressionMatiere([
      chap(1, 'maitrise', true),
      chap(0.6, 'en_cours', true),
      chap(0.2, 'fragile'),
      chap(0, 'a_commencer'),
    ])
    expect(p.commences).toBe(3)
    expect(p.solides).toBe(1)
    expect(p.enRoute).toBe(2)
    expect(p.jamais).toBe(1)
    expect(p.pct).toBe(60) // (1 + 0.6 + 0.2) / 3
  })

  it('aucun chapitre commencé : 0 %, et commences le dit', () => {
    const p = progressionMatiere([chap(0, 'a_commencer'), chap(0, 'a_commencer')])
    expect(p.pct).toBe(0)
    expect(p.commences).toBe(0)
    expect(p.total).toBe(2)
  })

  it('matière vide', () => {
    expect(progressionMatiere([])).toEqual({
      pct: 0,
      commences: 0,
      total: 0,
      solides: 0,
      enRoute: 0,
      jamais: 0,
    })
  })

  it('borne les valeurs aberrantes du catalogue', () => {
    // Le contenu est alimenté par des migrations écrites à la main : une valeur
    // hors [0,1] ou NaN ne doit pas produire un pourcentage impossible.
    const p = progressionMatiere([
      chap(4, 'maitrise', true),
      chap(Number.NaN, 'en_cours', true),
      chap(-2, 'fragile', true),
    ])
    expect(p.pct).toBe(33) // (1 + 0 + 0) / 3
  })
})

describe('prioriteFor', () => {
  it('rien à réviser quand le prof n’a rien traité — ce n’est PAS une alerte', () => {
    // L'ancien écran peignait ces matières en rouge à 0 % : il reprochait à
    // l'élève le calendrier de son établissement.
    expect(prioriteFor(progressionMatiere([chap(0, 'a_commencer')]))).toBe('rien')
  })

  it('urgente sous 50 %, attention sous 80 %, ok au-delà', () => {
    expect(prioriteFor(progressionMatiere([chap(0.3, 'fragile', true)]))).toBe(
      'urgente',
    )
    expect(prioriteFor(progressionMatiere([chap(0.65, 'en_cours', true)]))).toBe(
      'attention',
    )
    expect(prioriteFor(progressionMatiere([chap(0.9, 'maitrise', true)]))).toBe('ok')
  })

  it('les bascules tombent pile sur les seuils de maîtrise d’un chapitre', () => {
    expect(prioriteFor(progressionMatiere([chap(0.5, 'en_cours', true)]))).toBe(
      'attention',
    )
    expect(prioriteFor(progressionMatiere([chap(0.8, 'maitrise', true)]))).toBe('ok')
  })
})

describe('progressionGlobale', () => {
  it('pondère par les chapitres commencés, pas par le programme entier', () => {
    // Maths : 1 chapitre commencé sur 10, à 100 %. Anglais : 4 sur 4, à 50 %.
    // Pondérer par le TOTAL donnerait un poids écrasant aux maths sur la foi
    // d'un seul chapitre réellement travaillé.
    const maths = progressionMatiere([
      chap(1, 'maitrise', true),
      ...Array.from({ length: 9 }, () => chap(0, 'a_commencer')),
    ])
    const anglais = progressionMatiere(
      Array.from({ length: 4 }, () => chap(0.5, 'en_cours', true)),
    )
    expect(progressionGlobale([maths, anglais])).toBe(60) // (100×1 + 50×4) / 5
  })

  it('une matière sans rien de commencé ne pèse rien', () => {
    const vide = progressionMatiere([chap(0, 'a_commencer')])
    const solide = progressionMatiere([chap(0.9, 'maitrise', true)])
    expect(progressionGlobale([vide, solide])).toBe(90)
  })

  it('rien nulle part : 0 %', () => {
    expect(progressionGlobale([])).toBe(0)
    expect(progressionGlobale([progressionMatiere([])])).toBe(0)
  })
})

describe('prioriteMaitrise', () => {
  // Les mêmes seuils que `prioriteFor`, appliqués à un pourcentage seul : c'est
  // ce qui permet à une ligne de chapitre de porter la couleur de sa matière
  // sans redéfinir « fragile » dans le composant.
  it('reprend les seuils de maîtrise, sans assiette', () => {
    expect(prioriteMaitrise(0)).toBe('urgente')
    expect(prioriteMaitrise(49)).toBe('urgente')
    expect(prioriteMaitrise(50)).toBe('attention')
    expect(prioriteMaitrise(79)).toBe('attention')
    expect(prioriteMaitrise(80)).toBe('ok')
    expect(prioriteMaitrise(100)).toBe('ok')
  })

  it('ne peut pas contredire prioriteFor sur une matière commencée', () => {
    for (const value of [0, 0.3, 0.5, 0.79, 0.8, 1]) {
      const p = progressionMatiere([chap(value, 'en_cours', true)])
      expect(prioriteFor(p)).toBe(prioriteMaitrise(p.pct))
    }
  })
})
