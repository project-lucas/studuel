import { describe, expect, it } from 'vitest'

import {
  PROMO_REMISE,
  SHOP_CATALOG,
  TAILLE_VITRINE,
  boutiqueDuJour,
  type ShopItem,
} from './tresor'

const JOUR = '2026-09-01'

describe('la boutique du jour', () => {
  it('présente TAILLE_VITRINE articles, et un seul en promo', () => {
    const vitrine = boutiqueDuJour(JOUR)
    expect(vitrine).toHaveLength(TAILLE_VITRINE)
    expect(vitrine.filter((a) => a.promo)).toHaveLength(1)
  })

  it('ne montre jamais deux fois le même article le même jour', () => {
    const ids = boutiqueDuJour(JOUR).map((a) => a.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('EST STABLE : le même jour donne la même vitrine', () => {
    // Le test qui compte. Un tirage au hasard donnerait une vitrine qui change
    // à chaque rechargement — donc une vitrine à laquelle on ne peut pas se
    // fier, et une promo qu'on ne peut pas décider d'attendre.
    const a = boutiqueDuJour(JOUR)
    const b = boutiqueDuJour(JOUR)
    expect(b).toEqual(a)
  })

  it('change d’un jour à l’autre', () => {
    const a = boutiqueDuJour('2026-09-01').map((x) => x.id)
    const b = boutiqueDuJour('2026-09-02').map((x) => x.id)
    expect(b).not.toEqual(a)
  })

  it('applique la remise, et à elle seule', () => {
    const vitrine = boutiqueDuJour(JOUR)
    for (const article of vitrine) {
      const attendu = article.promo
        ? Math.max(1, Math.round(article.price * (1 - PROMO_REMISE)))
        : article.price
      expect(article.prixAffiche, article.id).toBe(attendu)
    }
  })

  it('finit par montrer TOUT le catalogue', () => {
    // La rotation avance d'un cran par jour : sur assez de jours, aucun article
    // ne reste au fond du tiroir. C'est ce qu'un tirage au sort ne garantit
    // pas — et c'est justement l'article attendu qui n'en sortirait jamais.
    const vus = new Set<string>()
    for (let j = 1; j <= 60; j += 1) {
      const jour = `2026-09-${String(j).padStart(2, '0')}`
      for (const a of boutiqueDuJour(jour)) vus.add(a.id)
    }
    expect(vus.size).toBe(SHOP_CATALOG.length)
  })
})

describe('les cas limites', () => {
  it('rend une vitrine vide sur un catalogue vide', () => {
    expect(boutiqueDuJour(JOUR, [])).toEqual([])
  })

  it('ne demande jamais plus d’articles que le catalogue n’en a', () => {
    const petit: ShopItem[] = SHOP_CATALOG.slice(0, 2)
    const vitrine = boutiqueDuJour(JOUR, petit)
    expect(vitrine).toHaveLength(2)
    expect(vitrine.filter((a) => a.promo)).toHaveLength(1)
  })

  it('ne descend jamais un prix sous 1 écu', () => {
    const gratuit: ShopItem[] = [
      { id: 'test', name: 'Test', desc: '', price: 1, emoji: '·', kind: 'boost' },
    ]
    const [article] = boutiqueDuJour(JOUR, gratuit, 1)
    expect(article.prixAffiche).toBeGreaterThanOrEqual(1)
  })
})

describe('le catalogue', () => {
  it('porte les trois consommables qui servent à apprendre', () => {
    const ids = SHOP_CATALOG.map((a) => a.id)
    expect(ids).toContain('indice')
    expect(ids).toContain('seconde-chance')
    expect(ids).toContain('relance-coffre')
  })

  it('n’a aucun article qui vende du CONTENU', () => {
    // La ligne qui sépare l'écu de la gemme : l'écu achète du temps, du confort
    // et du décor. Le jour où un article déverrouille un chapitre, la doctrine
    // de lib/gems.ts tombe — et avec elle la contrepartie de Studuel+.
    // On traque le GESTE de déverrouillage, pas le vocabulaire scolaire : les
    // « lunettes de savant » du compagnon parlent de leçons sans rien ouvrir.
    const suspects = SHOP_CATALOG.filter((a) =>
      /déverrouill|débloqu|accès|illimité|premium/i.test(`${a.name} ${a.desc}`),
    )
    expect(suspects.map((a) => a.id)).toEqual([])
  })
})
