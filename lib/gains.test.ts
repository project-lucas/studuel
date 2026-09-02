import { describe, expect, it } from 'vitest'

import {
  ECART_MAX,
  JETONS_MAX,
  JETONS_MIN,
  SALVE_MAX,
  UNITES,
  aDesGains,
  agregerGains,
  definition,
  dureeVolee,
  jetonsPour,
  libelleGain,
  repartir,
  volJeton,
  type Gain,
} from './gains'

describe('le catalogue', () => {
  it('couvre chaque unité une fois', () => {
    const unites = UNITES.map((d) => d.unite)
    expect(new Set(unites).size).toBe(unites.length)
  })

  it('ne donne de cible QU’aux unités qui ont un compteur dans le bandeau', () => {
    // Le bandeau porte le niveau, les écus et les cristaux — rien d'autre.
    // Couronnes et trophées vivent dans leurs écrans : leur faire traverser
    // l'écran vers un coin vide promettrait un compteur qui n'existe pas.
    const avecCible = UNITES.filter((d) => d.cible).map((d) => d.unite)
    expect(avecCible.sort()).toEqual(['ecu', 'gemme', 'xp'])
  })

  it('accorde le libellé en nombre', () => {
    expect(libelleGain({ unite: 'ecu', montant: 1 })).toBe('1 écu')
    expect(libelleGain({ unite: 'ecu', montant: 12 })).toBe('12 écus')
    // L'XP est invariable — le pluriel naïf « 5 XPs » se lit mal.
    expect(libelleGain({ unite: 'xp', montant: 5 })).toBe('5 XP')
  })

  it('rend une définition pour chaque unité du type', () => {
    for (const d of UNITES) expect(definition(d.unite).unite).toBe(d.unite)
  })
})

describe('agréger les gains', () => {
  it('ADDITIONNE deux gains de la même unité', () => {
    // Une fin de quiz verse l'XP de la 2e couronne PUIS celle de la 3e. Deux
    // versements, une seule chose du point de vue de l'élève.
    const gains: Gain[] = [
      { unite: 'xp', montant: 40 },
      { unite: 'xp', montant: 60 },
    ]
    expect(agregerGains(gains)).toEqual([{ unite: 'xp', montant: 100 }])
  })

  it('jette les montants nuls, négatifs et absurdes', () => {
    const gains: Gain[] = [
      { unite: 'xp', montant: 0 },
      { unite: 'ecu', montant: -5 },
      { unite: 'gemme', montant: Number.NaN },
      { unite: 'couronne', montant: 3 },
    ]
    expect(agregerGains(gains)).toEqual([{ unite: 'couronne', montant: 3 }])
  })

  it('rend l’ordre du catalogue, pas celui de l’appelant', () => {
    const gains: Gain[] = [
      { unite: 'gemme', montant: 30 },
      { unite: 'xp', montant: 5 },
      { unite: 'ecu', montant: 12 },
    ]
    expect(agregerGains(gains).map((g) => g.unite)).toEqual([
      'xp',
      'ecu',
      'gemme',
    ])
  })

  it('encaisse une liste absente plutôt que de jeter', () => {
    // Ces gains traversent une Server Action : une page encore ouverte pendant
    // un déploiement peut recevoir une réponse d'avant leur existence. Un écran
    // de fin ne tombe pas parce que sa décoration manque.
    expect(agregerGains(undefined)).toEqual([])
    expect(agregerGains(null)).toEqual([])
    expect(
      agregerGains([null as unknown as Gain, { unite: 'xp', montant: 5 }]),
    ).toEqual([{ unite: 'xp', montant: 5 }])
  })

  it('dit s’il y a quelque chose à fêter', () => {
    expect(aDesGains([])).toBe(false)
    expect(aDesGains([{ unite: 'xp', montant: 0 }])).toBe(false)
    expect(aDesGains([{ unite: 'xp', montant: 5 }])).toBe(true)
  })
})

describe('le nombre de jetons', () => {
  it('rend zéro pour un gain vide', () => {
    expect(jetonsPour(0)).toBe(0)
    expect(jetonsPour(-10)).toBe(0)
    expect(jetonsPour(Number.NaN)).toBe(0)
  })

  it('reste dans ses bornes', () => {
    for (const m of [1, 5, 30, 100, 250, 10000]) {
      expect(jetonsPour(m)).toBeGreaterThanOrEqual(JETONS_MIN)
      expect(jetonsPour(m)).toBeLessThanOrEqual(JETONS_MAX)
    }
  })

  it('croît avec le montant, sans jamais décroître', () => {
    let precedent = 0
    for (let m = 1; m <= 400; m += 1) {
      const n = jetonsPour(m)
      expect(n).toBeGreaterThanOrEqual(precedent)
      precedent = n
    }
  })

  it('sépare les petits gains et sature sur les gros', () => {
    // C'est ce que la racine carrée achète : 5 et 30 se distinguent à l'œil,
    // 250 et 10 000 non — et c'est bien ainsi, personne ne compte au-delà.
    expect(jetonsPour(5)).toBe(3)
    expect(jetonsPour(30)).toBe(6)
    expect(jetonsPour(250)).toBe(JETONS_MAX)
    expect(jetonsPour(10000)).toBe(JETONS_MAX)
  })
})

describe('répartir un montant sur les jetons', () => {
  it('somme EXACTEMENT le montant, quel que soit le découpage', () => {
    // Le test qui compte. Un arrondi qui dépasse ferait monter le compteur
    // au-dessus du solde réel, puis redescendre au rafraîchissement suivant —
    // un solde qui recule tout seul, que personne ne saurait reproduire.
    for (let montant = 0; montant <= 260; montant += 1) {
      const n = Math.max(1, jetonsPour(montant))
      const parts = repartir(montant, n)
      expect(parts).toHaveLength(n)
      expect(parts.reduce((s, p) => s + p, 0), `montant ${montant}`).toBe(montant)
    }
  })

  it('n’a que des parts positives ou nulles', () => {
    for (const p of repartir(5, 12)) expect(p).toBeGreaterThanOrEqual(0)
  })

  it('met le reste sur les DERNIERS jetons', () => {
    // 5 sur 3 → 1, 2, 2 : le compteur finit sur les plus gros pas, au moment
    // où le regard est déjà sur lui.
    expect(repartir(5, 3)).toEqual([1, 2, 2])
  })

  it('encaisse les cas limites sans jeter', () => {
    expect(repartir(10, 0)).toEqual([])
    expect(repartir(0, 3)).toEqual([0, 0, 0])
    expect(repartir(Number.NaN, 2)).toEqual([0, 0])
  })
})

describe('le trajet d’un jeton', () => {
  it('échelonne les départs sans jamais dépasser la salve', () => {
    for (const n of [1, 3, 6, 12]) {
      const retards = Array.from({ length: n }, (_, i) => volJeton(i, n).retard)
      expect(retards[0]).toBe(0)
      expect(Math.max(...retards)).toBeLessThanOrEqual(SALVE_MAX)
      // Strictement croissants : deux jetons ne partent jamais ensemble.
      for (let i = 1; i < n; i += 1) {
        expect(retards[i]).toBeGreaterThan(retards[i - 1])
      }
    }
  })

  it('ne laisse jamais deux départs s’écarter de plus de ECART_MAX', () => {
    const n = 12
    for (let i = 1; i < n; i += 1) {
      const ecart = volJeton(i, n).retard - volJeton(i - 1, n).retard
      expect(ecart).toBeLessThanOrEqual(ECART_MAX)
    }
  })

  it('ouvre un éventail CENTRÉ sur le point de départ', () => {
    // Les écarts se compensent : la volée part du milieu de la pastille, elle
    // ne dérive pas d'un côté.
    const n = 6
    const somme = Array.from({ length: n }, (_, i) => volJeton(i, n).ecartX).reduce(
      (s, x) => s + x,
      0,
    )
    expect(Math.abs(somme)).toBeLessThanOrEqual(1)
  })

  it('varie les durées pour que les jetons n’arrivent pas en rang', () => {
    const durees = new Set(
      Array.from({ length: 6 }, (_, i) => volJeton(i, 6).duree),
    )
    expect(durees.size).toBeGreaterThan(1)
  })

  it('est DÉTERMINISTE — deux appels donnent le même trajet', () => {
    // Sans ça, on ne peut ni tester l'animation ni la corriger : on ne peut
    // pas régler ce qu'on ne peut pas rejouer.
    expect(volJeton(3, 8)).toEqual(volJeton(3, 8))
  })

  it('borne un index hors plage au lieu de rendre NaN', () => {
    expect(volJeton(99, 3)).toEqual(volJeton(2, 3))
    expect(volJeton(-4, 3)).toEqual(volJeton(0, 3))
  })

  it('sait quand la volée entière est arrivée', () => {
    expect(dureeVolee(0)).toBe(0)
    const n = 8
    const fin = dureeVolee(n)
    for (let i = 0; i < n; i += 1) {
      const v = volJeton(i, n)
      expect(v.retard + v.duree).toBeLessThanOrEqual(fin)
    }
  })
})
