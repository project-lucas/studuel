import { describe, expect, it } from 'vitest'
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  ORGANS,
  buildAnatomiePool,
  isInZone,
  organAt,
  zoneLabel,
} from '@/lib/jeux/anatomie'

describe('les zones sont posées correctement', () => {
  it('tient entièrement dans le schéma', () => {
    for (const o of ORGANS) {
      const { cx, cy, r } = o.zone
      expect(cx - r, `${o.id} déborde à gauche`).toBeGreaterThanOrEqual(0)
      expect(cx + r, `${o.id} déborde à droite`).toBeLessThanOrEqual(BOARD_WIDTH)
      expect(cy - r, `${o.id} déborde en haut`).toBeGreaterThanOrEqual(0)
      expect(cy + r, `${o.id} déborde en bas`).toBeLessThanOrEqual(BOARD_HEIGHT)
    }
  })

  it('ne fait JAMAIS se chevaucher deux zones', () => {
    // Deux zones superposées, c'est une bonne réponse acceptée ou refusée selon
    // le pixel touché — injouable, et parfaitement silencieux.
    for (let i = 0; i < ORGANS.length; i++) {
      for (let j = i + 1; j < ORGANS.length; j++) {
        const a = ORGANS[i].zone
        const b = ORGANS[j].zone
        const dist = Math.hypot(a.cx - b.cx, a.cy - b.cy)
        expect(
          dist,
          `${ORGANS[i].id} et ${ORGANS[j].id} se chevauchent`,
        ).toBeGreaterThan(a.r + b.r)
      }
    }
  })

  it('garde des zones assez grandes pour un doigt', () => {
    // Le seuil vient de la règle des 44 px du projet, ramenée aux unités du
    // schéma : la planche est rendue au plus large sur 260 px pour 100 unités,
    // soit 2,6 px par unité. Une cible de 44 px demande donc un DIAMÈTRE de
    // 44 / 2,6 ≈ 17 unités, c'est-à-dire un rayon d'au moins 8,5.
    const MIN_RADIUS = 8.5
    for (const o of ORGANS) {
      expect(o.zone.r, `${o.id} : zone trop petite`).toBeGreaterThanOrEqual(
        MIN_RADIUS,
      )
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
})

describe('détection du tap', () => {
  const coeur = ORGANS.find((o) => o.id === 'coeur')!

  it('accepte le centre de la zone', () => {
    expect(isInZone(coeur.zone, coeur.zone.cx, coeur.zone.cy)).toBe(true)
  })

  it('accepte le bord et refuse juste au-delà', () => {
    const { cx, cy, r } = coeur.zone
    expect(isInZone(coeur.zone, cx + r, cy)).toBe(true)
    expect(isInZone(coeur.zone, cx + r + 0.5, cy)).toBe(false)
  })

  it('retrouve chaque organe depuis son propre centre', () => {
    for (const o of ORGANS) {
      expect(organAt(o.zone.cx, o.zone.cy)?.id, o.id).toBe(o.id)
    }
  })

  it('rend null sur une zone vide du schéma', () => {
    expect(organAt(2, 210)).toBeNull()
    expect(organAt(99, 2)).toBeNull()
  })
})

describe('zoneLabel — nommer une zone sans donner la réponse', () => {
  const labels = ORGANS.map((o, i) => zoneLabel(o.zone, i))

  it('donne un libellé unique à chaque zone', () => {
    // Deux zones homonymes sont indistinguables à l'oreille : le lecteur
    // d'écran annoncerait deux fois « à droite du milieu du tronc ».
    expect(new Set(labels).size).toBe(ORGANS.length)
  })

  it('ne laisse JAMAIS fuiter le nom d’un organe', () => {
    // C'est tout l'intérêt du libellé positionnel : si le nom de l'organe s'y
    // glissait, il suffirait de tabuler jusqu'à celui qu'on demande.
    for (const label of labels) {
      for (const organ of ORGANS) {
        const bare = organ.name.replace(/^(le |la |les |l’)/, '')
        expect(label.toLowerCase(), `« ${label} » trahit ${organ.id}`).not.toContain(bare)
      }
    }
  })

  it('situe la zone par son côté et sa hauteur', () => {
    expect(zoneLabel({ cx: 50, cy: 20, r: 12 }, 0)).toContain('au centre')
    expect(zoneLabel({ cx: 50, cy: 20, r: 12 }, 0)).toContain('de la tête')
    expect(zoneLabel({ cx: 20, cy: 100, r: 9 }, 1)).toContain('à gauche')
    expect(zoneLabel({ cx: 80, cy: 100, r: 9 }, 1)).toContain('du milieu du tronc')
    expect(zoneLabel({ cx: 50, cy: 150, r: 9 }, 2)).toContain('du bas du tronc')
  })
})

describe('buildAnatomiePool', () => {
  it('sert le nombre d’organes demandé', () => {
    expect(buildAnatomiePool('g', 5)).toHaveLength(5)
    expect(buildAnatomiePool('g', 8)).toHaveLength(8)
  })

  it('ne répète pas un organe tant que le stock suffit', () => {
    const pool = buildAnatomiePool('g', ORGANS.length)
    expect(new Set(pool.map((r) => r.target.id)).size).toBe(ORGANS.length)
  })

  it('donne un id unique à chaque manche, même en recyclant', () => {
    const pool = buildAnatomiePool('g', ORGANS.length + 4)
    expect(new Set(pool.map((r) => r.id)).size).toBe(pool.length)
  })

  it('est déterministe', () => {
    expect(buildAnatomiePool('graine', 6)).toEqual(buildAnatomiePool('graine', 6))
  })

  it('varie d’une graine à l’autre', () => {
    expect(buildAnatomiePool('a', 8)).not.toEqual(buildAnatomiePool('b', 8))
  })
})
