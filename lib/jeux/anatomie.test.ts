import { describe, expect, it } from 'vitest'
import {
  ORGANS,
  PLANCHE_HAUTEUR,
  PLANCHE_LARGEUR,
  ZONES,
  buildAnatomiePool,
  isGoodPick,
  organsForPalier,
  zoneAt,
  zoneLabel,
  zoneLignes,
} from '@/lib/jeux/anatomie'
import { CORPS_D, FONDU_DEPUIS } from '@/lib/jeux/anatomie-planche'
import { PALIER_LEVELS } from '@/lib/jeux/paliers'
import { aplatirChemin, pointDansForme } from '@/lib/jeux/svg-chemin'

// La planche se MESURE : on la quadrille au demi-millimètre (unités du
// viewBox) et on demande à `zoneAt` qui possède chaque case. C'est la seule
// façon de savoir ce qu'un doigt peut vraiment atteindre, halos et
// recouvrements compris.
const PAS = 0.5
const AIRE_CASE = PAS * PAS

function airesEffectives(): Map<string, number> {
  const aires = new Map<string, number>(ZONES.map((z) => [z.id, 0]))
  for (let y = 0; y <= PLANCHE_HAUTEUR; y += PAS) {
    for (let x = 0; x <= PLANCHE_LARGEUR; x += PAS) {
      const zone = zoneAt(x, y)
      if (zone) aires.set(zone.id, (aires.get(zone.id) ?? 0) + AIRE_CASE)
    }
  }
  return aires
}

/** L'aire DESSINÉE d'une zone (sans halo, sans tenir compte des recouvrements). */
function aireDessinee(id: string): number {
  const zone = ZONES.find((z) => z.id === id)!
  let aire = 0
  const lignes = zoneLignes(id)
  for (let y = 0; y <= PLANCHE_HAUTEUR; y += PAS) {
    for (let x = 0; x <= PLANCHE_LARGEUR; x += PAS) {
      if (zone.forme.type === 'plein') {
        if (pointDansForme(lignes, x, y)) aire += AIRE_CASE
      }
    }
  }
  return aire
}

const CORPS = aplatirChemin(CORPS_D)

describe('la planche est bien dessinée', () => {
  it('a un corps fermé, symétrique, qui tient dans le viewBox', () => {
    expect(CORPS).toHaveLength(1)
    for (const [x, y] of CORPS[0]) {
      expect(x).toBeGreaterThanOrEqual(0)
      expect(x).toBeLessThanOrEqual(PLANCHE_LARGEUR)
      expect(y).toBeGreaterThanOrEqual(0)
      expect(y).toBeLessThanOrEqual(PLANCHE_HAUTEUR)
      // Le miroir : chaque point a son reflet.
      const reflet = CORPS[0].find(
        ([rx, ry]) => Math.abs(rx - (PLANCHE_LARGEUR - x)) < 0.01 && Math.abs(ry - y) < 0.01,
      )
      expect(reflet, `pas de reflet pour (${x}, ${y})`).toBeDefined()
    }
    expect(FONDU_DEPUIS).toBeLessThan(PLANCHE_HAUTEUR)
  })

  it('dessine chaque organe DANS le corps', () => {
    for (const zone of ZONES) {
      for (const ligne of zoneLignes(zone.id)) {
        for (const [x, y] of ligne) {
          expect(
            pointDansForme(CORPS, x, y),
            `${zone.id} sort du corps en (${x}, ${y})`,
          ).toBe(true)
        }
      }
    }
  })

  it('donne à chaque zone un id, un nom, une ancre et une forme lisible', () => {
    for (const z of ZONES) {
      expect(z.id).toMatch(/^[a-z-]+$/)
      expect(z.nom.length).toBeGreaterThan(3)
      expect(z.halo).toBeGreaterThanOrEqual(0)
      expect(() => aplatirChemin(z.forme.d)).not.toThrow()
      for (const d of z.details ?? []) expect(() => aplatirChemin(d)).not.toThrow()
    }
    expect(new Set(ZONES.map((z) => z.id)).size).toBe(ZONES.length)
  })

  it('fait désigner chaque zone par sa propre ancre', () => {
    // Une ancre qui tombe sur une autre zone, c'est un organe caché sous un
    // voisin dessiné par-dessus : injouable, et parfaitement silencieux.
    for (const z of ZONES) {
      expect(zoneAt(z.ancre[0], z.ancre[1])?.id, z.id).toBe(z.id)
    }
  })

  it('laisse à chaque zone de quoi poser un doigt', () => {
    // La planche est rendue au plus large sur ~360 px pour 100 unités, soit
    // 3,6 px par unité. La règle des 44 px du projet donne une cible de
    // 44 / 3,6 ≈ 12 unités de côté, soit ~150 unités² ; on exige 110 pour les
    // plus fins (trachée, diaphragme), qui gagnent en plus le halo autour d'eux
    // — mesuré ici, puisque `zoneAt` le compte.
    const MIN_AIRE = 110
    const aires = airesEffectives()
    for (const z of ZONES) {
      expect(aires.get(z.id), `${z.id} : ${aires.get(z.id)} unités² touchables`).toBeGreaterThanOrEqual(MIN_AIRE)
    }
  })

  it('ne cache jamais plus de la moitié d’un organe sous un autre', () => {
    // Le foie recouvre le haut des reins, le côlon leur bas : c'est la planche.
    // Mais un organe aux trois quarts caché n'est plus reconnaissable.
    const aires = airesEffectives()
    for (const z of ZONES) {
      if (z.forme.type !== 'plein') continue
      const dessinee = aireDessinee(z.id)
      const visible = aires.get(z.id) ?? 0
      expect(visible / dessinee, `${z.id} : ${Math.round((visible / dessinee) * 100)} % visible`).toBeGreaterThan(0.5)
    }
  })

  it('rend null hors de tout organe', () => {
    expect(zoneAt(2, 150)).toBeNull()
    expect(zoneAt(99, 2)).toBeNull()
    // Dans la main : le corps, mais aucun organe.
    expect(zoneAt(13, 122)).toBeNull()
  })
})

describe('la banque des organes', () => {
  it('ne demande que des zones qui existent', () => {
    const ids = new Set(ZONES.map((z) => z.id))
    for (const o of ORGANS) {
      expect(o.zones.length).toBeGreaterThan(0)
      for (const z of o.zones) expect(ids.has(z), `${o.id} → ${z}`).toBe(true)
      expect(o.from).toBeLessThanOrEqual(o.to)
    }
  })

  it('donne un id, un nom et un repère à chaque organe', () => {
    for (const o of ORGANS) {
      expect(o.id).toMatch(/^[a-z-]+$/)
      expect(o.name.length).toBeGreaterThan(2)
      expect(o.hint.length).toBeGreaterThan(10)
    }
    expect(new Set(ORGANS.map((o) => o.id)).size).toBe(ORGANS.length)
  })

  it('grandit avec le palier, sans jamais laisser une zone sans organe', () => {
    expect(organsForPalier(1).map((o) => o.id)).toEqual(organsForPalier(2).map((o) => o.id))
    expect(organsForPalier(1)).toHaveLength(8)
    expect(organsForPalier(3)).toHaveLength(11)
    expect(organsForPalier(4)).toHaveLength(12)
    expect(organsForPalier(5)).toHaveLength(13)
    // À chaque palier, toute zone dessinée est la bonne réponse d'AU MOINS un
    // organe demandable : rien sur la planche n'est un leurre pur… sauf au bas
    // de l'échelle, où les organes fins attendent leur tour.
    for (const level of PALIER_LEVELS) {
      const couvertes = new Set(organsForPalier(level).flatMap((o) => o.zones))
      const attendu = level <= 2 ? 8 + 1 : level === 3 ? 11 : level === 4 ? 12 : 13
      expect(couvertes.size, `palier ${level}`).toBe(attendu)
    }
    expect(new Set(organsForPalier(5).flatMap((o) => o.zones)).size).toBe(ZONES.length)
  })

  it('accepte les deux intestins pour « les intestins », un seul ensuite', () => {
    const intestins = ORGANS.find((o) => o.id === 'intestins')!
    const grele = ZONES.find((z) => z.id === 'intestin-grele')!
    const colon = ZONES.find((z) => z.id === 'gros-intestin')!
    expect(isGoodPick(intestins, grele)).toBe(true)
    expect(isGoodPick(intestins, colon)).toBe(true)
    const seulGrele = ORGANS.find((o) => o.id === 'intestin-grele')!
    expect(isGoodPick(seulGrele, colon)).toBe(false)
    expect(isGoodPick(seulGrele, null)).toBe(false)
  })
})

describe('zoneLabel — nommer une zone sans donner la réponse', () => {
  const labels = ZONES.map((z, i) => zoneLabel(z, i))

  it('donne un libellé unique à chaque zone', () => {
    expect(new Set(labels).size).toBe(ZONES.length)
  })

  it('ne laisse JAMAIS fuiter le nom d’un organe', () => {
    const noms = [
      ...ORGANS.map((o) => o.name),
      ...ZONES.map((z) => z.nom),
    ].map((n) => n.replace(/^(le |la |les |l’|un |une )/, '').toLowerCase())
    for (const label of labels) {
      for (const nom of noms) {
        expect(label.toLowerCase(), `« ${label} » trahit ${nom}`).not.toContain(nom)
      }
    }
  })

  it('situe la zone par son côté et sa hauteur', () => {
    const cerveau = ZONES.find((z) => z.id === 'cerveau')!
    expect(zoneLabel(cerveau, 0)).toContain('au centre de la tête')
    const foie = ZONES.find((z) => z.id === 'foie')!
    expect(zoneLabel(foie, 1)).toContain('à gauche du milieu du tronc')
    const vessie = ZONES.find((z) => z.id === 'vessie')!
    expect(zoneLabel(vessie, 2)).toContain('du bas du tronc')
  })
})

describe('buildAnatomiePool', () => {
  it('sert le nombre d’organes demandé', () => {
    expect(buildAnatomiePool('g', 5)).toHaveLength(5)
    expect(buildAnatomiePool('g', 8)).toHaveLength(8)
  })

  it('ne répète pas un organe tant que le stock suffit', () => {
    const pool = buildAnatomiePool('g', 8, 1)
    expect(new Set(pool.map((r) => r.target.id)).size).toBe(8)
    const maitre = buildAnatomiePool('g', 13, 5)
    expect(new Set(maitre.map((r) => r.target.id)).size).toBe(13)
  })

  it('ne demande que les organes du palier', () => {
    for (const r of buildAnatomiePool('g', 20, 1)) {
      expect(r.target.from).toBe(1)
      expect(['rate', 'pancreas', 'trachee', 'diaphragme']).not.toContain(r.target.id)
    }
    expect(buildAnatomiePool('g', 20, 3).some((r) => r.target.id === 'intestins')).toBe(false)
    expect(buildAnatomiePool('g', 20, 5).some((r) => r.target.id === 'rate')).toBe(true)
  })

  it('donne un id unique à chaque manche, même en recyclant', () => {
    const pool = buildAnatomiePool('g', 12, 1)
    expect(new Set(pool.map((r) => r.id)).size).toBe(pool.length)
  })

  it('est déterministe et varie d’une graine à l’autre', () => {
    expect(buildAnatomiePool('graine', 6)).toEqual(buildAnatomiePool('graine', 6))
    expect(buildAnatomiePool('a', 8)).not.toEqual(buildAnatomiePool('b', 8))
  })

  it('retombe sur le palier de référence pour un palier hors échelle', () => {
    expect(buildAnatomiePool('g', 4, Number.NaN)).toHaveLength(4)
  })
})
