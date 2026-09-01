import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

import {
  HAUTS_FAITS,
  aReclamer,
  estAtteint,
  gemmesAReclamer,
  hautsFaitsAtteints,
  prochainHautFait,
  progression,
  type Compteurs,
} from './hauts-faits'

const vide: Compteurs = { lecons: 0, serie: 0, cartes: 0, chapitres: 0 }
const de = (p: Partial<Compteurs>): Compteurs => ({ ...vide, ...p })

describe('les seuils', () => {
  it('n’ouvre rien à zéro', () => {
    expect(hautsFaitsAtteints(vide)).toEqual([])
  })

  it('ouvre au seuil EXACT, pas un cran avant', () => {
    const hf = HAUTS_FAITS.find((h) => h.id === 'lecons-50')!
    expect(estAtteint(hf, de({ lecons: 49 }))).toBe(false)
    expect(estAtteint(hf, de({ lecons: 50 }))).toBe(true)
  })

  it('ouvre les DEUX paliers d’une mesure quand le second tombe', () => {
    // 200 leçons valent aussi les 50 : on ne saute pas un palier au passage.
    const ids = hautsFaitsAtteints(de({ lecons: 200 })).map((h) => h.id)
    expect(ids).toEqual(['lecons-50', 'lecons-200'])
  })

  it('ignore un compteur absurde plutôt que de planter', () => {
    expect(hautsFaitsAtteints(de({ lecons: -10 }))).toEqual([])
    expect(hautsFaitsAtteints(de({ serie: Number.NaN }))).toEqual([])
  })
})

describe('à réclamer', () => {
  it('retire ce qui est déjà payé', () => {
    const c = de({ lecons: 200 })
    expect(aReclamer(c, new Set(['lecons-50'])).map((h) => h.id)).toEqual([
      'lecons-200',
    ])
  })

  it('additionne les gemmes en attente', () => {
    // lecons-50 (30) + lecons-200 (60) = 90.
    expect(gemmesAReclamer(de({ lecons: 200 }), new Set())).toBe(90)
    expect(gemmesAReclamer(de({ lecons: 200 }), new Set(['lecons-50']))).toBe(60)
  })
})

describe('le prochain objectif', () => {
  it('montre celui dont on est LE PLUS PRÈS, pas le plus cher', () => {
    // 45/50 leçons = 90 % ; 1/10 chapitres = 10 % ; 20/30 jours = 67 %.
    // Le chapitre paye 50 gemmes contre 30, et pourtant ce n'est pas lui :
    // un objectif à 4 % décourage, un objectif à 90 % tire.
    const prochain = prochainHautFait(de({ lecons: 45, serie: 20, chapitres: 1 }))
    expect(prochain?.id).toBe('lecons-50')
  })

  it('ne propose jamais un haut fait déjà atteint', () => {
    const prochain = prochainHautFait(de({ lecons: 60 }))
    expect(prochain?.id).not.toBe('lecons-50')
  })

  it('rend null quand tout est fait', () => {
    const tout = de({ lecons: 999, serie: 999, cartes: 999, chapitres: 999 })
    expect(prochainHautFait(tout)).toBeNull()
  })
})

describe('progression', () => {
  it('plafonne à 1', () => {
    const hf = HAUTS_FAITS.find((h) => h.id === 'serie-30')!
    expect(progression(hf, de({ serie: 15 }))).toBeCloseTo(0.5)
    expect(progression(hf, de({ serie: 90 }))).toBe(1)
  })
})

describe('le miroir SQL', () => {
  it('a les MÊMES montants que la table gem_achievements', () => {
    // Le serveur ne fait confiance qu'à sa table : ce catalogue dit quand
    // réclamer, jamais combien verser. Les deux qui divergent, c'est un écran
    // qui promet 100 gemmes et une base qui en verse 40 — sans erreur nulle
    // part. D'où ce test, qui lit la migration.
    const sql = readFileSync(
      path.resolve(process.cwd(), 'supabase/348_economie_apprendre_et_jouer.sql'),
      'utf8',
    )
    // L'INSERT du catalogue est aligné à la main pour se lire en colonnes :
    // on compare donc en ignorant les espaces, sans les imposer.
    const sansEspaces = sql.split(' ').join('')
    for (const hf of HAUTS_FAITS) {
      expect(sansEspaces, `${hf.id} absent ou mal payé dans la 348`).toContain(
        `('${hf.id}',${hf.gemmes})`,
      )
    }
  })
})
