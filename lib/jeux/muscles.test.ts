import { existsSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  MUSCLES,
  PLANCHES_MUSCLES,
  buildMusclesPool,
  musclesForPalier,
} from '@/lib/jeux/muscles'
import { IMAGE_ECORCHE, VUES_MUSCLES, type VueMuscles } from '@/lib/jeux/muscles-planche'
import { isGoodPick, questionPour, type Planche } from '@/lib/jeux/planche'
import { PALIER_LEVELS } from '@/lib/jeux/paliers'
import { plancheDe } from '@/lib/jeux/planches'
import { aplatirChemin, pointDansForme } from '@/lib/jeux/svg-chemin'

// L'écorché se MESURE, comme la planche d'anatomie : on le quadrille et on
// demande à `zoneAt` qui possède chaque case. Pas de 1 unité (la toile fait
// 100 × 180) : assez fin pour un doigt, assez rapide pour la suite complète.
const PAS = 1

function airesEffectives(p: Planche): Map<string, number> {
  const aires = new Map<string, number>(p.zones.map((z) => [z.id, 0]))
  for (let y = 0; y <= p.hauteur; y += PAS) {
    for (let x = 0; x <= p.largeur; x += PAS) {
      const zone = p.zoneAt(x, y)
      if (zone) aires.set(zone.id, (aires.get(zone.id) ?? 0) + PAS * PAS)
    }
  }
  return aires
}

function aireDessinee(p: Planche, id: string): number {
  const lignes = p.zoneLignes(id)
  let aire = 0
  for (let y = 0; y <= p.hauteur; y += PAS) {
    for (let x = 0; x <= p.largeur; x += PAS) {
      if (pointDansForme(lignes, x, y)) aire += PAS * PAS
    }
  }
  return aire
}

/** Les muscles qui ne se dédoublent pas : un seul morceau sur la planche. */
const D_UN_SEUL_TENANT = new Set(['abdominaux', 'cou', 'trapezes', 'fessiers', 'couturier'])

describe.each(VUES_MUSCLES)('l’écorché, vue de %s', (vue: VueMuscles) => {
  const p = PLANCHES_MUSCLES[vue]

  it('a son image peinte, servie par l’app', () => {
    expect(p.image).toBe(IMAGE_ECORCHE[vue])
    expect(existsSync(path.join(process.cwd(), 'public', IMAGE_ECORCHE[vue]))).toBe(true)
  })

  it('garde chaque zone DANS la toile', () => {
    for (const z of p.zones) {
      for (const ligne of p.zoneLignes(z.id)) {
        for (const [x, y] of ligne) {
          expect(x >= 0 && x <= p.largeur && y >= 0 && y <= p.hauteur, `${z.id} (${x}, ${y})`).toBe(true)
        }
      }
    }
  })

  it('dédouble chaque muscle pair : un morceau à gauche, un à droite', () => {
    for (const z of p.zones) {
      const morceaux = p.zoneLignes(z.id).length
      if (D_UN_SEUL_TENANT.has(z.id)) expect(morceaux, z.id).toBeGreaterThanOrEqual(1)
      else expect(morceaux, `${vue}/${z.id}`).toBe(2)
    }
  })

  it('donne à chaque zone un id, un nom, un repère et une forme lisible', () => {
    for (const z of p.zones) {
      expect(z.id).toMatch(/^[a-z-]+$/)
      expect(z.nom.length).toBeGreaterThan(3)
      expect(z.repere, z.id).toBeDefined()
      expect(() => aplatirChemin(z.forme.d)).not.toThrow()
    }
    expect(new Set(p.zones.map((z) => z.id)).size).toBe(p.zones.length)
  })

  it('fait désigner chaque zone par sa propre ancre', () => {
    for (const z of p.zones) {
      expect(p.zoneAt(z.ancre[0], z.ancre[1])?.id, `${vue}/${z.id}`).toBe(z.id)
    }
  })

  it('laisse à chaque muscle de quoi poser un doigt', () => {
    // 40 unités² ≈ un carré de 6 × 6 unités : sur un téléphone, la planche
    // fait ~2,7 px par unité, soit 17 × 17 px au moins — et le muscle est long.
    const MIN_AIRE = 40
    const aires = airesEffectives(p)
    for (const z of p.zones) {
      expect(aires.get(z.id), `${vue}/${z.id} : ${aires.get(z.id)} unités² touchables`).toBeGreaterThanOrEqual(MIN_AIRE)
    }
  })

  it('ne cache jamais plus de la moitié d’un muscle sous un autre', () => {
    const aires = airesEffectives(p)
    for (const z of p.zones) {
      const dessinee = aireDessinee(p, z.id)
      const visible = aires.get(z.id) ?? 0
      expect(visible / dessinee, `${vue}/${z.id} : ${Math.round((visible / dessinee) * 100)} % visible`).toBeGreaterThan(0.5)
    }
  })

  it('rend null hors de tout muscle', () => {
    expect(p.zoneAt(2, 175)).toBeNull()
    expect(p.zoneAt(48, 15)).toBeNull() // la tête : aucun muscle
  })

  it('nomme chaque zone sans jamais trahir le muscle', () => {
    const labels = p.zones.map((z, i) => p.zoneLabel(z, i))
    expect(new Set(labels).size).toBe(p.zones.length)
    const noms = [...MUSCLES.map((m) => m.name), ...p.zones.map((z) => z.nom)].map((n) =>
      n.replace(/^(le |la |les |l’|un |une )/, '').toLowerCase(),
    )
    for (const label of labels) {
      for (const nom of noms) {
        expect(label.toLowerCase(), `« ${label} » trahit ${nom}`).not.toContain(nom)
      }
    }
  })
})

describe('la banque des muscles', () => {
  it('ne demande que des zones qui existent DANS SA VUE', () => {
    for (const m of MUSCLES) {
      const ids = new Set(PLANCHES_MUSCLES[m.vue].zones.map((z) => z.id))
      expect(m.zones.length).toBeGreaterThan(0)
      for (const z of m.zones) expect(ids.has(z), `${m.id} (${m.vue}) → ${z}`).toBe(true)
      expect(m.from).toBeLessThanOrEqual(m.to)
    }
    expect(new Set(MUSCLES.map((m) => m.id)).size).toBe(MUSCLES.length)
  })

  it('cherche chaque muscle sur la bonne vue', () => {
    for (const m of MUSCLES) {
      const p = plancheDe('muscles', m)
      expect(p.vue).toBe(m.vue)
      expect(p.zones.some((z) => isGoodPick(m, z)), m.id).toBe(true)
    }
  })

  it('grandit avec le palier, de six muscles à seize, de face ET de dos', () => {
    expect(musclesForPalier(1).map((m) => m.id)).toEqual(musclesForPalier(2).map((m) => m.id))
    expect(musclesForPalier(1)).toHaveLength(6)
    expect(musclesForPalier(3)).toHaveLength(11)
    expect(musclesForPalier(4)).toHaveLength(14)
    expect(musclesForPalier(5)).toHaveLength(16)
    for (const level of PALIER_LEVELS) {
      const vues = new Set(musclesForPalier(level).map((m) => m.vue))
      expect(vues, `palier ${level}`).toEqual(new Set(['face', 'dos']))
    }
  })

  it('accorde la consigne au singulier et au pluriel', () => {
    expect(questionPour(MUSCLES[0])).toBe('Où se trouvent')
    expect(questionPour(MUSCLES.find((m) => m.id === 'couturier')!)).toBe('Où se trouve')
    expect(isGoodPick(MUSCLES[0], null)).toBe(false)
  })
})

describe('buildMusclesPool', () => {
  it('sert le nombre de muscles demandé, sans répétition tant que le stock suffit', () => {
    expect(buildMusclesPool('g', 6)).toHaveLength(6)
    expect(new Set(buildMusclesPool('g', 6, 1).map((r) => r.target.id)).size).toBe(6)
    expect(new Set(buildMusclesPool('g', 16, 5).map((r) => r.target.id)).size).toBe(16)
  })

  it('est déterministe et ne demande que les muscles du palier', () => {
    expect(buildMusclesPool('x', 8, 3)).toEqual(buildMusclesPool('x', 8, 3))
    for (const r of buildMusclesPool('g', 20, 1)) expect(r.target.from).toBe(1)
    expect(buildMusclesPool('g', 20, 2).some((r) => r.target.id === 'trapezes')).toBe(false)
  })
})
