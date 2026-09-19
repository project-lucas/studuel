import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

import {
  AUCUN_BOOST,
  MAX_BOUCLIERS,
  OFFRES,
  boostXpDejaAchete,
  finBoostXp,
  etatOffre,
  etiquetteOffre,
  libelleCompteARebours,
  normaliserBoosts,
  offreDuMarche,
  type BoostsActifs,
  type IdOffre,
  type Offre,
} from './offres'

// Vendredi 18 septembre 2026, midi UTC.
const VENDREDI = new Date('2026-09-18T12:00:00Z')

const offre = (id: IdOffre): Offre => {
  const o = OFFRES.find((x) => x.id === id)
  if (!o) throw new Error(`offre absente : ${id}`)
  return o
}

const boosts = (patch: Partial<BoostsActifs>): BoostsActifs => ({ ...AUCUN_BOOST, ...patch })

describe('le Marché (OFFRES)', () => {
  it('le boost XP et le bouclier, aux prix provisoires annoncés', () => {
    const prix = Object.fromEntries(OFFRES.map((o) => [o.id, o.prixGemmes]))
    expect(prix).toEqual({ 'double-xp-2h': 20, 'bouclier-trophees': 25 })
    expect(offre('double-xp-2h').kind).toBe('double_xp')
    expect(offre('bouclier-trophees').kind).toBe('bouclier_trophees')
  })

  it('pas chers : chacun coûte moins d’une journée de quêtes (36 gemmes au plus)', () => {
    for (const o of OFFRES) expect(o.prixGemmes).toBeLessThan(36)
  })

  it('un nom court pour la carte, une étiquette pour l’écrin', () => {
    expect(offre('double-xp-2h').nom).toBe('Boost XP')
    expect(offre('bouclier-trophees').nom).toBe('Bouclier (PVP)')
    expect(etiquetteOffre(offre('double-xp-2h'))).toBe('×2 · 2 h')
    expect(etiquetteOffre(offre('bouclier-trophees'))).toBe('1 fois')
  })

  it('la valeur dit la durée (boost XP) ou le nombre de boucliers', () => {
    expect(offre('double-xp-2h').valeur).toBe(2)
    expect(offre('bouclier-trophees').valeur).toBe(MAX_BOUCLIERS)
  })

  it('est le miroir exact des seeds de boutique_offres (migrations 370 et 371)', () => {
    // Le prix DÉBITÉ est lu en base : un écart ici afficherait un prix et en
    // prélèverait un autre. Les INSERT sont alignés à la main : on compare
    // sans les espaces.
    const sql = ['370_boutique_marche.sql', '371_bouclier_trophees.sql']
      .map((f) => readFileSync(path.resolve(process.cwd(), 'supabase', f), 'utf8'))
      .join('\n')
      .split(' ')
      .join('')
    for (const o of OFFRES) {
      expect(sql, `${o.id} absente ou mal payée dans la 370/371`).toContain(
        `('${o.id}','${o.kind}',${o.prixGemmes},${o.valeur})`,
      )
    }
  })

  it('le plafond de boucliers est celui du CHECK de la 371', () => {
    const sql = readFileSync(path.resolve(process.cwd(), 'supabase/371_bouclier_trophees.sql'), 'utf8')
    expect(sql).toContain(`CHECK (boucliers_trophees BETWEEN 0 AND ${MAX_BOUCLIERS})`)
  })

  it('retrouve une offre du Marché, et rien pour une ancienne ou une inconnue', () => {
    expect(offreDuMarche('bouclier-trophees')?.prixGemmes).toBe(25)
    expect(offreDuMarche('trophees-x2-2h')).toBeNull()
    expect(offreDuMarche('gel-serie')).toBeNull()
    expect(offreDuMarche('n’importe quoi')).toBeNull()
  })
})

describe('libelleCompteARebours', () => {
  const dans = (minutes: number) => new Date(VENDREDI.getTime() + minutes * 60_000)

  it('jours et heures au-delà d’un jour', () => {
    expect(libelleCompteARebours(dans((3 * 24 + 4) * 60 + 30), VENDREDI)).toBe('3 j 4 h')
    expect(libelleCompteARebours(dans(2 * 24 * 60), VENDREDI)).toBe('2 j')
  })

  it('heures et minutes sous un jour', () => {
    expect(libelleCompteARebours(dans(1 * 60 + 12), VENDREDI)).toBe('1 h 12 min')
    expect(libelleCompteARebours(dans(2 * 60), VENDREDI)).toBe('2 h')
  })

  it('minutes sous une heure, jamais « 0 min » tant que ça court', () => {
    expect(libelleCompteARebours(dans(12), VENDREDI)).toBe('12 min')
    expect(libelleCompteARebours(new Date(VENDREDI.getTime() + 20_000), VENDREDI)).toBe('1 min')
  })

  it('« Terminé » une fois l’échéance passée', () => {
    expect(libelleCompteARebours(VENDREDI, VENDREDI)).toBe('Terminé')
    expect(libelleCompteARebours(dans(-5), VENDREDI)).toBe('Terminé')
    expect(libelleCompteARebours(new Date(Number.NaN), VENDREDI)).toBe('Terminé')
  })
})

describe('normaliserBoosts', () => {
  it('ligne absente → aucun boost', () => {
    expect(normaliserBoosts(null)).toBe(AUCUN_BOOST)
    expect(normaliserBoosts(undefined)).toBe(AUCUN_BOOST)
  })

  it('lit les colonnes de la 368 et de la 371', () => {
    expect(
      normaliserBoosts({ double_xp_jusqua: '2026-09-18T14:00:00+00:00', boucliers_trophees: 1 }),
    ).toEqual({ doubleXpJusqua: '2026-09-18T14:00:00+00:00', doubleXpAcheteLe: null, boucliers: 1 })
  })

  it('colonne 371 absente (migration en attente) : aucun bouclier, le boost XP reste lu', () => {
    expect(normaliserBoosts({ double_xp_jusqua: '2026-09-18T14:00:00+00:00' })).toEqual({
      doubleXpJusqua: '2026-09-18T14:00:00+00:00',
      doubleXpAcheteLe: null,
      boucliers: 0,
    })
  })

  it('porte l’instant du dernier Boost XP acheté (journal des achats), même sans ligne de portefeuille', () => {
    expect(normaliserBoosts({}, '2026-09-18T08:00:00+00:00').doubleXpAcheteLe).toBe(
      '2026-09-18T08:00:00+00:00',
    )
    expect(normaliserBoosts(null, '2026-09-18T08:00:00+00:00').doubleXpAcheteLe).toBe(
      '2026-09-18T08:00:00+00:00',
    )
    expect(normaliserBoosts({}, 'pas une date').doubleXpAcheteLe).toBeNull()
  })

  it('écarte l’illisible et borne la réserve', () => {
    expect(normaliserBoosts({ double_xp_jusqua: 'pas une date', boucliers_trophees: 'x' })).toEqual(
      AUCUN_BOOST,
    )
    expect(normaliserBoosts({ boucliers_trophees: 9 }).boucliers).toBe(MAX_BOUCLIERS)
    expect(normaliserBoosts({ boucliers_trophees: -2 }).boucliers).toBe(0)
  })
})

describe('etatOffre', () => {
  const dans = (minutes: number) => new Date(VENDREDI.getTime() + minutes * 60_000).toISOString()

  it('boost XP en cours : « actif » avec le temps restant, même sans le sou', () => {
    expect(etatOffre(offre('double-xp-2h'), boosts({ doubleXpJusqua: dans(75) }), 0, VENDREDI)).toEqual({
      kind: 'active',
      libelle: 'Actif · 1 h 15 min',
      reste: '1 h 15 min',
    })
  })

  it('boost XP échu, acheté un autre jour : la carte redevient achetable', () => {
    expect(
      etatOffre(
        offre('double-xp-2h'),
        boosts({ doubleXpJusqua: dans(-1), doubleXpAcheteLe: '2026-09-17T20:00:00Z' }),
        20,
        VENDREDI,
      ),
    ).toEqual({ kind: 'achetable' })
  })

  it('UN Boost XP par jour : acheté aujourd’hui et fini, la carte dit « demain »', () => {
    expect(
      etatOffre(
        offre('double-xp-2h'),
        boosts({ doubleXpJusqua: dans(-1), doubleXpAcheteLe: '2026-09-18T09:00:00Z' }),
        100,
        VENDREDI,
      ),
    ).toEqual({ kind: 'demain' })
  })

  it('le jour est un jour UTC, comme les clés de jour de l’app (et le refus de la 373)', () => {
    // Acheté à 23 h 59 UTC la veille : c'était hier.
    expect(boostXpDejaAchete('2026-09-17T23:59:00Z', VENDREDI)).toBe(false)
    expect(boostXpDejaAchete('2026-09-18T00:00:00Z', VENDREDI)).toBe(true)
    expect(boostXpDejaAchete(null, VENDREDI)).toBe(false)
    expect(boostXpDejaAchete('n’importe quoi', VENDREDI)).toBe(false)
  })

  it('finBoostXp : la fin d’un boost qui court, rien sinon', () => {
    expect(finBoostXp(dans(30), VENDREDI)?.toISOString()).toBe(dans(30))
    expect(finBoostXp(dans(-30), VENDREDI)).toBeNull()
    expect(finBoostXp(null, VENDREDI)).toBeNull()
  })

  it('la 373 refuse le second Boost XP du jour UTC (miroir de boostXpDejaAchete)', () => {
    const sql = readFileSync(
      path.resolve(process.cwd(), 'supabase/373_boost_jour_gemmes_paliers.sql'),
      'utf8',
    )
    expect(sql).toContain("(a.created_at AT TIME ZONE 'UTC')::date = (now() AT TIME ZONE 'UTC')::date")
    expect(sql).toContain("'raison', 'deja_aujourdhui'")
  })

  it('bouclier en réserve : « en réserve », même sans le sou, sans toucher au boost XP', () => {
    const b = boosts({ boucliers: 1 })
    expect(etatOffre(offre('bouclier-trophees'), b, 0, VENDREDI)).toEqual({ kind: 'en-reserve' })
    expect(etatOffre(offre('double-xp-2h'), b, 100, VENDREDI)).toEqual({ kind: 'achetable' })
  })

  it('bouclier consommé : la carte redevient achetable', () => {
    expect(etatOffre(offre('bouclier-trophees'), boosts({ boucliers: 0 }), 25, VENDREDI)).toEqual({
      kind: 'achetable',
    })
  })

  it('trop chère : dit combien il manque', () => {
    expect(etatOffre(offre('bouclier-trophees'), AUCUN_BOOST, 10, VENDREDI)).toEqual({
      kind: 'trop-chere',
      manque: 15,
    })
    expect(etatOffre(offre('double-xp-2h'), AUCUN_BOOST, Number.NaN, VENDREDI)).toEqual({
      kind: 'trop-chere',
      manque: 20,
    })
  })
})
