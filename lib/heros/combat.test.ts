import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { HEROS, TEMPLIER, herosParId } from './catalogue'
import {
  PV_MAX,
  coupDeReponse,
  estKo,
  partPv,
  pvRestants,
  tonPv,
  victoireDisponible,
  victoireJouee,
  victoireParDefaut,
} from './combat'

describe('pvRestants', () => {
  it('rend tous les PV tant que l’adversaire n’a rien marqué', () => {
    expect(pvRestants(0)).toBe(PV_MAX)
    expect(pvRestants(Number.NaN)).toBe(PV_MAX)
  })

  it('retire les points de l’adversaire, jamais sous zéro', () => {
    expect(pvRestants(340)).toBe(660)
    expect(pvRestants(1250)).toBe(0)
  })
})

describe('partPv et tonPv', () => {
  it('suit le feu tricolore', () => {
    expect(tonPv(partPv(1000))).toBe('plein')
    expect(tonPv(partPv(400))).toBe('entame')
    expect(tonPv(partPv(150))).toBe('critique')
  })

  it('borne la part entre 0 et 1', () => {
    expect(partPv(-5)).toBe(0)
    expect(partPv(5000)).toBe(1)
  })
})

describe('estKo', () => {
  it('ne déclare K.O. qu’à zéro PV', () => {
    expect(estKo(0)).toBe(true)
    expect(estKo(1)).toBe(false)
  })
})

describe('coupDeReponse', () => {
  it('ne frappe pas sur une erreur', () => {
    expect(coupDeReponse({ id: 1, camp: 'moi', points: 0, golden: false, pvCible: 1000 })).toBeNull()
  })

  it('porte les points de la réponse en dégâts', () => {
    expect(coupDeReponse({ id: 2, camp: 'rival', points: 120, golden: false, pvCible: 800 })).toEqual({
      id: 2,
      camp: 'rival',
      degats: 120,
      critique: false,
    })
  })

  it('plafonne les dégâts aux PV qui restent, et marque le critique de la dorée', () => {
    expect(coupDeReponse({ id: 3, camp: 'moi', points: 260, golden: true, pvCible: 90 })).toEqual({
      id: 3,
      camp: 'moi',
      degats: 90,
      critique: true,
    })
  })
})

describe('les cinématiques de victoire', () => {
  it('joue celle par défaut quand rien n’est choisi', () => {
    expect(victoireJouee(TEMPLIER, null, []).id).toBe('serment')
  })

  it('refuse une cinématique payante qui n’est pas achetée', () => {
    expect(victoireJouee(TEMPLIER, 'charge-celeste', []).id).toBe('serment')
  })

  it('joue la cinématique achetée et choisie', () => {
    expect(victoireJouee(TEMPLIER, 'charge-celeste', ['charge-celeste']).id).toBe('charge-celeste')
  })

  it('retombe sur la cinématique par défaut si le choix n’existe plus', () => {
    expect(victoireJouee(TEMPLIER, 'disparue', ['disparue']).id).toBe('serment')
  })

  it('tient une offerte pour toujours disponible', () => {
    expect(victoireDisponible(victoireParDefaut(TEMPLIER), [])).toBe(true)
  })
})

describe('le catalogue des héros', () => {
  it('a des identifiants uniques et se retrouve par son id', () => {
    const ids = HEROS.map((h) => h.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(herosParId('templier')).toBe(TEMPLIER)
    expect(herosParId('inconnu')).toBeNull()
  })

  it('offre toujours la première cinématique de chaque héros', () => {
    for (const h of HEROS) expect(h.victoires[0].prixGemmes).toBe(0)
  })

  it('pointe vers des images qui existent dans public/', () => {
    for (const h of HEROS) {
      const chemins = [
        ...Object.values(h.poses),
        ...h.victoires.flatMap((v) => v.tableaux.map((t) => t.image)),
      ]
      for (const c of chemins) {
        expect(fs.existsSync(path.join(process.cwd(), 'public', c)), c).toBe(true)
      }
    }
  })
})
