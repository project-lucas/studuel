import { describe, expect, it } from 'vitest'
import {
  BOUCLE_SECONDES,
  PAS_MIN,
  PLANCHE_HAUTEUR,
  PLANCHE_LARGEUR,
  SCENES_VIVANTES,
  delaiDePhase,
  feuilleDeScene,
  fichiersDeScene,
  imagesCles,
  mouvementsDeScene,
  onde,
  pasDe,
  pulsation,
  sceneVivanteDe,
  tousLesMouvements,
  type Mouvement,
  type SceneVivante,
  type Zone,
} from './arena-vivante'

const scenes = Object.values(SCENES_VIVANTES) as SceneVivante[]

const dansLaPlanche = (z: Zone) =>
  z.x >= 0 &&
  z.y >= 0 &&
  z.x + z.w <= PLANCHE_LARGEUR &&
  z.y + z.h <= PLANCHE_HAUTEUR

const pointDansLaPlanche = (x: number, y: number) =>
  x >= 0 && y >= 0 && x <= PLANCHE_LARGEUR && y <= PLANCHE_HAUTEUR

describe('SCENES_VIVANTES', () => {
  it("l'aube et le soir ont leur scène, chacune sous la clé de sa plage", () => {
    expect(sceneVivanteDe('dawn')).toBeDefined()
    expect(sceneVivanteDe('evening')).toBeDefined()
    for (const [period, scene] of Object.entries(SCENES_VIVANTES)) {
      expect(scene.period).toBe(period)
    }
  })

  it('chaque élément détouré est posé dans la planche, avec une phase de boucle', () => {
    for (const scene of scenes) {
      expect(scene.nuages.length).toBeGreaterThan(0)
      for (const el of [...scene.nuages, ...scene.rochers]) {
        expect(dansLaPlanche(el), el.src).toBe(true)
        expect(el.phase).toBeGreaterThanOrEqual(0)
        expect(el.phase).toBeLessThan(1)
      }
      for (const nuage of scene.nuages) {
        // Le balancement ne sort pas un nuage de plus que sa propre largeur :
        // il reste un nuage du ciel, pas un intrus.
        expect(nuage.amplitude).toBeGreaterThan(0)
        expect(nuage.amplitude).toBeLessThan(nuage.w)
      }
    }
  })

  it('les lumières (étoiles, lanternes, lueur) sont centrées dans la planche', () => {
    for (const scene of scenes) {
      for (const e of scene.etoiles) expect(pointDansLaPlanche(e.x, e.y)).toBe(true)
      for (const l of scene.lanternes) expect(pointDansLaPlanche(l.x, l.y)).toBe(true)
      const { x, y, w, h } = scene.lueur
      // La lueur peut déborder d'un halo (celle du soir fait 1 080 de côté
      // décalés de 4 px) ; c'est son CENTRE qui doit être dans la planche.
      expect(pointDansLaPlanche(x + w / 2, y + h / 2)).toBe(true)
    }
  })

  it('la bougie, la cascade et son écume tiennent dans la planche', () => {
    for (const scene of scenes) {
      for (const z of [scene.bougie, scene.cascade, scene.ecume]) {
        expect(dansLaPlanche(z)).toBe(true)
      }
      // L'écume est au pied de la cascade, pas ailleurs.
      expect(scene.ecume.y).toBeGreaterThanOrEqual(scene.cascade.y + scene.cascade.h * 0.5)
      expect(Number.isInteger(scene.cascade.passages)).toBe(true)
      expect(scene.cascade.course).toBeGreaterThan(scene.cascade.h)
    }
  })

  it('les nappes de brume roulent dans la moitié basse, chacune dans un sens', () => {
    for (const scene of scenes) {
      expect(scene.brume.length).toBeGreaterThan(0)
      expect(scene.couleurBrume).toMatch(/^\d{1,3}, \d{1,3}, \d{1,3}$/)
      for (const nappe of scene.brume) {
        expect(nappe.y).toBeGreaterThan(PLANCHE_HAUTEUR / 2)
        expect(nappe.y + nappe.h).toBeLessThanOrEqual(PLANCHE_HAUTEUR)
        expect([1, -1]).toContain(nappe.sens)
        expect(nappe.opacite).toBeGreaterThan(0)
        expect(nappe.opacite).toBeLessThanOrEqual(1)
        expect(nappe.phase).toBeGreaterThanOrEqual(0)
        expect(nappe.phase).toBeLessThan(1)
      }
    }
  })

  it('chaque fréquence est un nombre entier de cycles par boucle', () => {
    // C'est ce qui referme la boucle sans à-coup : un mouvement à 2,5 cycles
    // sauterait d'une demi-période toutes les dix secondes.
    for (const scene of scenes) {
      const ks = [
        ...scene.etoiles.map((e) => e.k),
        ...scene.bougie.ondes.map((o) => o.k),
        ...scene.lanternes.flatMap((l) => l.ondes.map((o) => o.k)),
        scene.ecume.k,
      ]
      for (const k of ks) {
        expect(Number.isInteger(k)).toBe(true)
        expect(k).toBeGreaterThanOrEqual(1)
      }
    }
  })
})

describe('sceneVivanteDe', () => {
  it('rend undefined sans plage ou pour une plage restée fixe', () => {
    expect(sceneVivanteDe(null)).toBeUndefined()
    expect(sceneVivanteDe(undefined)).toBeUndefined()
    expect(sceneVivanteDe('noon')).toBeUndefined()
  })
})

describe('fichiersDeScene', () => {
  it('liste la planche, ses nuages et ses rochers, tous en webp sous le dossier de la scène', () => {
    for (const scene of scenes) {
      const fichiers = fichiersDeScene(scene)
      expect(fichiers[0]).toBe(scene.plate)
      expect(fichiers).toHaveLength(1 + scene.nuages.length + scene.rochers.length)
      for (const f of fichiers) {
        expect(f).toMatch(
          new RegExp(`^/images/arene/vivante/${scene.period}-[a-z0-9-]+\\.webp$`),
        )
      }
      expect(new Set(fichiers).size).toBe(fichiers.length)
    }
  })
})

describe('onde et pulsation (les « wave » et « pulse » de l’export)', () => {
  it('suivent la sinusoïde, bornée à [−1, 1] puis à [0, 1]', () => {
    expect(onde(0)).toBeCloseTo(0)
    expect(onde(0.25)).toBeCloseTo(1)
    expect(onde(0, 0.25)).toBeCloseTo(1)
    expect(onde(0.125, 0, 2)).toBeCloseTo(1)
    expect(pulsation(0)).toBeCloseTo(0.5)
    expect(pulsation(0.25)).toBeCloseTo(1)
    expect(pulsation(0.75)).toBeCloseTo(0)
  })
})

describe('delaiDePhase', () => {
  it('recule le départ d’une fraction de cycle', () => {
    expect(delaiDePhase(0)).toBe(-0)
    expect(delaiDePhase(0.3)).toBeCloseTo(-0.3 * BOUCLE_SECONDES)
    expect(delaiDePhase(0.5, 4)).toBe(-2)
  })
})

describe('mouvementsDeScene', () => {
  const tous = scenes.flatMap((s) => tousLesMouvements(mouvementsDeScene(s)))

  it('donne un mouvement par couche périodique de la scène', () => {
    for (const scene of scenes) {
      const m = mouvementsDeScene(scene)
      expect(m.etoiles).toHaveLength(scene.etoiles.length)
      expect(m.nuages).toHaveLength(scene.nuages.length)
      expect(m.rochers).toHaveLength(scene.rochers.length)
      expect(m.lanternes).toHaveLength(scene.lanternes.length)
    }
  })

  it('nomme chaque mouvement d’un nom unique dans toute l’app', () => {
    const noms = tous.map((m) => m.nom)
    expect(new Set(noms).size).toBe(noms.length)
    for (const nom of noms) expect(nom).toMatch(/^av-[a-z]+-[a-z0-9-]+$/)
  })

  it("n'anime que l'opacité et la transformation, avec des opacités dans [0, 1]", () => {
    for (const m of tous) {
      for (let i = 0; i <= 40; i++) {
        const image = m.image(i / 40)
        expect(Object.keys(image).every((p) => p === 'opacity' || p === 'transform')).toBe(true)
        if (image.opacity !== undefined) {
          const o = Number(image.opacity)
          expect(o, m.nom).toBeGreaterThanOrEqual(0)
          expect(o, m.nom).toBeLessThanOrEqual(1)
        }
      }
    }
  })

  it('referme chaque boucle : la dernière image vaut la première', () => {
    // À l'arrondi près : sin(2πk + φ) n'est pas exactement sin(φ) en flottant,
    // et une valeur qui tombe sur 0,6625 s'arrondit d'un côté ou de l'autre.
    const nombres = (m: Mouvement, t: number) =>
      Object.values(m.image(t)).join(' ').match(/-?\d+(\.\d+)?/g)!.map(Number)
    for (const m of tous) {
      const fin = nombres(m, 1)
      const debut = nombres(m, 0)
      expect(fin, m.nom).toHaveLength(debut.length)
      fin.forEach((n, i) => expect(Math.abs(n - debut[i]), m.nom).toBeLessThanOrEqual(0.01))
    }
  })

  it('suit la formule de l’export pour un nuage de l’aube', () => {
    const aube = sceneVivanteDe('dawn')!
    const nuage = mouvementsDeScene(aube).nuages[1]
    // cloud-2 : 46 px d’amplitude, phase 0,3. À t = 0 : dx = 46 · sin(2π · 0,3),
    // écrit en % de la largeur du nuage (translate se lit en % de l’élément).
    const largeur = aube.nuages[1].w
    const dx = Math.round(((100 * 46 * Math.sin(2 * Math.PI * 0.3)) / largeur) * 1000) / 1000
    expect(nuage.image(0).transform).toContain(`translate(${dx}%`)
  })

  it('n’écrit aucune variable dans une image-clé : le compositeur joue tout', () => {
    // Une image-clé qui lit `var()` fait tourner l’animation sur le fil
    // principal — l’arène recalculait ses styles à chaque image.
    for (const scene of scenes) expect(feuilleDeScene(scene)).not.toContain('var(')
  })
})

describe('imagesCles', () => {
  const mouvementTest: Mouvement = {
    nom: 'av-test-couche',
    frequence: 3,
    image: (t) => ({ opacity: String(Math.round(pulsation(t, 0, 3) * 1000) / 1000) }),
  }

  it("échantillonne au moins huit fois par cycle de l'harmonique la plus haute", () => {
    expect(pasDe({ ...mouvementTest, frequence: 1 })).toBe(PAS_MIN)
    expect(pasDe(mouvementTest)).toBe(24)
    expect(pasDe({ ...mouvementTest, frequence: 18 })).toBe(144)
  })

  it('écrit des images-clés de 0 % à 100 %, la dernière égale à la première', () => {
    const css = imagesCles(mouvementTest)
    expect(css.startsWith('@keyframes av-test-couche{0%{opacity:0.5}')).toBe(true)
    expect(css.endsWith('100%{opacity:0.5}}')).toBe(true)
    expect(css.match(/%\{/g)).toHaveLength(pasDe(mouvementTest) + 1)
  })
})

describe('feuilleDeScene', () => {
  it('rassemble les images-clés de tous les mouvements, sans rien de non fermé', () => {
    for (const scene of scenes) {
      const feuille = feuilleDeScene(scene)
      const nb = tousLesMouvements(mouvementsDeScene(scene)).length
      expect(feuille.match(/@keyframes /g)).toHaveLength(nb)
      expect(feuille.split('{').length).toBe(feuille.split('}').length)
      expect(feuille).not.toMatch(/NaN|undefined|Infinity/)
    }
  })
})
