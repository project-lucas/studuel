import { describe, expect, it } from 'vitest'
import {
  SECTIONS_CARNET,
  angleSousLeDoigt,
  courbePage,
  courbeRetour,
  dureeDeRetour,
  feuillesATourner,
  gesteAbouti,
  indexSection,
  ombreDeFeuille,
  pile,
  sectionDepuis,
} from '@/lib/moi/carnet'

describe('sections du carnet', () => {
  it("ouvre sur l'identité, puis les quatre intercalaires dans l'ordre de la maquette", () => {
    expect(SECTIONS_CARNET.map((s) => s.titre)).toEqual(['Moi', 'Progrès', 'Amis', 'Collection', 'Palmarès'])
    expect(indexSection('amis')).toBe(2)
  })

  it("lit la section de l'URL et retombe sur la première sinon", () => {
    expect(sectionDepuis('palmares')).toBe(4)
    expect(sectionDepuis('inconnue')).toBe(0)
    expect(sectionDepuis(null)).toBe(0)
  })
})

describe('angleSousLeDoigt', () => {
  it('garde à plat une page que le doigt n’a pas déplacée', () => {
    expect(angleSousLeDoigt(300, 200, 100, 60)).toBeCloseTo(0)
  })

  it('met la page de chant quand le doigt arrive à la spirale', () => {
    expect(angleSousLeDoigt(200, 200, 100, 60)).toBeCloseTo(90)
  })

  it('la pose à gauche quand le doigt est allé aussi loin de l’autre côté', () => {
    expect(angleSousLeDoigt(100, 200, 100, 60)).toBeCloseTo(180)
    expect(angleSousLeDoigt(-500, 200, 100, 60)).toBeCloseTo(180)
  })

  it('suit le point saisi : à mi-chemin du rayon, 60°', () => {
    expect(angleSousLeDoigt(250, 200, 100, 60)).toBeCloseTo(60)
  })

  it('ne s’emballe pas pour un doigt posé près de la spirale', () => {
    // Saisie à 10 px : sans rayon minimal, 10 px de geste suffiraient à 90°.
    expect(angleSousLeDoigt(200, 200, 10, 80)).toBeCloseTo(90)
    expect(angleSousLeDoigt(240, 200, 10, 80)).toBeCloseTo(60)
  })

  it('fonctionne pour une page saisie à gauche (retour en arrière)', () => {
    expect(angleSousLeDoigt(100, 200, -100, 60)).toBeCloseTo(180)
    expect(angleSousLeDoigt(150, 200, -100, 60)).toBeCloseTo(120)
  })
})

describe('gesteAbouti', () => {
  it('finit la page qui a passé la verticale', () => {
    expect(gesteAbouti('avant', 100, 0)).toBe(true)
    expect(gesteAbouti('avant', 80, 0)).toBe(false)
    expect(gesteAbouti('arriere', 80, 0)).toBe(true)
    expect(gesteAbouti('arriere', 100, 0)).toBe(false)
  })

  it('finit un lancer franc même court', () => {
    expect(gesteAbouti('avant', 25, -0.6)).toBe(true)
    expect(gesteAbouti('arriere', 155, 0.6)).toBe(true)
  })

  it('ignore un lancer qui ne décolle pas la page', () => {
    expect(gesteAbouti('avant', 3, -1)).toBe(false)
  })

  it('rend la page lancée dans le mauvais sens, même passée la verticale', () => {
    expect(gesteAbouti('avant', 120, 0.8)).toBe(false)
    expect(gesteAbouti('arriere', 60, -0.8)).toBe(false)
  })
})

describe('feuillesATourner', () => {
  it('en avant, de la feuille du dessus de la pile de droite à la dernière', () => {
    expect(feuillesATourner(0, 3)).toEqual([
      { feuille: 0, vers: 180 },
      { feuille: 1, vers: 180 },
      { feuille: 2, vers: 180 },
    ])
  })

  it('en arrière, de la feuille du dessus de la pile de gauche', () => {
    expect(feuillesATourner(4, 2)).toEqual([
      { feuille: 3, vers: 0 },
      { feuille: 2, vers: 0 },
    ])
  })

  it('ne tourne rien sur place', () => {
    expect(feuillesATourner(2, 2)).toEqual([])
  })
})

describe('pile', () => {
  it('à droite, la feuille d’indice bas dessus ; à gauche, l’indice haut', () => {
    const p = pile([180, 180, 0, 0], [false, false, false, false])
    expect(p[1].z).toBeGreaterThan(p[0].z)
    expect(p[2].z).toBeGreaterThan(p[3].z)
  })

  it('ne peint que le dessus de chaque pile quand rien ne bouge', () => {
    expect(pile([180, 180, 0, 0], [false, false, false, false]).map((f) => f.peinte)).toEqual([
      false,
      true,
      true,
      false,
    ])
  })

  it('peint la feuille qui tourne ET celle qu’elle découvre', () => {
    // Double page 1 → 2 : la feuille 1 tourne, la 2 apparaît dessous, la 0
    // reste dessous à gauche (la 1 n’y est pas encore arrivée).
    const p = pile([180, 40, 0, 0], [false, true, false, false])
    expect(p.map((f) => f.peinte)).toEqual([true, true, true, false])
    expect(p[1].z).toBeGreaterThan(p[2].z)
  })

  it('pose la feuille qui passe la verticale sur le dessus de la pile de gauche', () => {
    const p = pile([180, 120, 0, 0], [false, true, false, false])
    expect(p[1].z).toBeGreaterThan(p[0].z)
  })
})

describe('courbes et durées', () => {
  it('partent de 0 et arrivent à 1', () => {
    for (const f of [courbePage, courbeRetour]) {
      expect(f(0)).toBe(0)
      expect(f(1)).toBe(1)
      expect(f(2)).toBe(1)
    }
  })

  it('un retour court est plus bref qu’un retour long', () => {
    expect(dureeDeRetour(20, 0)).toBeLessThan(dureeDeRetour(170, 0))
  })

  it('l’ombre est nulle à plat et pleine de chant', () => {
    expect(ombreDeFeuille(0)).toBeCloseTo(0)
    expect(ombreDeFeuille(90)).toBeCloseTo(1)
    expect(ombreDeFeuille(180)).toBeCloseTo(0)
  })
})
