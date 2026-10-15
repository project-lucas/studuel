import { existsSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  MOUVEMENTS,
  MUSEE_TIER_BRIEF,
  OEUVRES_ART,
  SIECLES,
  buildMuseePool,
  imageOeuvre,
  oeuvresDuPalier,
  sortesPossibles,
} from './le-musee'

describe('Le Musée — la banque', () => {
  it('a des identifiants uniques, un titre, un siècle connu et un repère daté', () => {
    expect(new Set(OEUVRES_ART.map((o) => o.id)).size).toBe(OEUVRES_ART.length)
    for (const o of OEUVRES_ART) {
      expect(o.id).toMatch(/^[a-z0-9-]+$/)
      expect(o.titre.length).toBeGreaterThan(3)
      expect(SIECLES).toContain(o.siecle)
      if (o.mouvement) expect(MOUVEMENTS).toContain(o.mouvement)
      // Le repère date l'œuvre : la correction situe, elle ne se contente pas de nommer.
      expect(o.tip, o.id).toMatch(/\d{3,}|siècle/)
    }
  })

  it('a une illustration servie par l’app pour chaque œuvre', () => {
    for (const o of OEUVRES_ART) {
      expect(existsSync(path.join(process.cwd(), 'public', imageOeuvre(o.id))), o.id).toBe(true)
    }
  })

  it('n’illustre que le domaine public : aucun artiste mort il y a moins de 70 ans', () => {
    const exclus = ['Picasso', 'Dalí', 'Magritte', 'Warhol', 'Kahlo', 'Chagall', 'Miró']
    for (const o of OEUVRES_ART) {
      for (const nom of exclus) expect(o.artiste ?? '', o.id).not.toContain(nom)
    }
  })

  it('offre assez d’artistes distincts pour quatre réponses', () => {
    expect(new Set(OEUVRES_ART.flatMap((o) => (o.artiste ? [o.artiste] : []))).size).toBeGreaterThanOrEqual(20)
  })

  it('commence doucement : les chefs-d’œuvre d’abord, l’Antiquité et les maîtres rares ensuite', () => {
    expect(oeuvresDuPalier(1)).toHaveLength(12)
    expect(oeuvresDuPalier(2)).toHaveLength(12)
    expect(oeuvresDuPalier(3).length).toBeGreaterThan(20)
    expect(oeuvresDuPalier(5)).toHaveLength(OEUVRES_ART.length)
    expect(oeuvresDuPalier(1).some((o) => o.id === 'joconde')).toBe(true)
    expect(oeuvresDuPalier(1).some((o) => o.id === 'lascaux')).toBe(false)
    // Aux deux premiers paliers, on demande l'artiste : jamais une œuvre anonyme.
    for (const o of oeuvresDuPalier(2)) expect(o.artiste, o.id).toBeDefined()
    for (const level of [1, 2, 3, 4, 5] as const) expect(MUSEE_TIER_BRIEF[level].length).toBeGreaterThan(10)
  })

  it('fait monter la QUESTION avec le palier', () => {
    const joconde = OEUVRES_ART.find((o) => o.id === 'joconde')!
    expect(sortesPossibles(joconde, 1)).toEqual(['artiste-titre'])
    expect(sortesPossibles(joconde, 2)).toEqual(['artiste'])
    expect(sortesPossibles(joconde, 3)).toEqual(['artiste', 'titre'])
    expect(sortesPossibles(joconde, 4)).toEqual(['artiste', 'titre', 'mouvement', 'siecle'])
    // Une œuvre anonyme ne demande jamais d'artiste ; sans mouvement, jamais de mouvement.
    const lascaux = OEUVRES_ART.find((o) => o.id === 'lascaux')!
    expect(sortesPossibles(lascaux, 4)).toEqual(['titre', 'mouvement', 'siecle'])
    const manet = OEUVRES_ART.find((o) => o.id === 'dejeuner-herbe')!
    expect(sortesPossibles(manet, 5)).not.toContain('mouvement')
  })
})

describe('buildMuseePool', () => {
  it('est déterministe et sert le nombre demandé', () => {
    expect(buildMuseePool('a', 12, 3)).toEqual(buildMuseePool('a', 12, 3))
    expect(buildMuseePool('a', 20, 1)).toHaveLength(20)
  })

  it('pose quatre réponses distinctes dont la bonne, et l’image de l’œuvre', () => {
    for (const level of [1, 2, 3, 4, 5]) {
      for (const q of buildMuseePool('z', 60, level)) {
        expect(q.options).toHaveLength(4)
        expect(new Set(q.options).size, `${q.id} : ${q.options.join(' | ')}`).toBe(4)
        expect(q.correctIndex).toBeGreaterThanOrEqual(0)
        expect(q.image).toMatch(/^\/images\/jeux\/musee\/[a-z0-9-]+\.webp$/)
      }
    }
  })

  it('donne le titre au palier 1, jamais ensuite, et ne le souffle pas dans l’image', () => {
    for (const q of buildMuseePool('t', 30, 1)) expect(q.prompt).toMatch(/^« .+ » : qui l’a réalisée \?$/)
    for (const q of buildMuseePool('t', 30, 2)) {
      expect(q.prompt).toBe('Qui a réalisé cette œuvre ?')
      expect(q.imageAlt).toBe('Une œuvre d’art à reconnaître')
    }
  })

  it('au palier Maître, choisit les siècles voisins comme leurres', () => {
    const siecles = buildMuseePool('m', 200, 5).filter((q) => q.prompt.startsWith('De quand'))
    expect(siecles.length).toBeGreaterThan(5)
    for (const q of siecles) {
      const i = SIECLES.indexOf(q.options[q.correctIndex] as (typeof SIECLES)[number])
      for (const o of q.options) {
        const d = Math.abs(SIECLES.indexOf(o as (typeof SIECLES)[number]) - i)
        expect(d, `${q.id} : ${o}`).toBeLessThanOrEqual(3)
      }
    }
  })
})
