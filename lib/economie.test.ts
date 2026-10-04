import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import { derniereDefinition } from '@/lib/migrations-lecture'
import {
  ACTIVITES_XP,
  BAREME_XP,
  PLAFOND_GEMMES_SEMAINE,
  gemmesEpreuve,
  gemmesExerciceCahier,
  xpActivite,
  xpDansLePlafond,
  xpEtoilePalier,
  xpTraque,
  type Epreuve,
} from '@/lib/economie'

vi.setConfig({ testTimeout: 30_000 })

/** Le corps de la DERNIÈRE définition d'une fonction (pas toute la migration). */
function sqlDe(fn: string): string {
  const found = derniereDefinition(fn)
  expect(found, `aucune migration ne définit ${fn}`).not.toBeNull()
  const sql = found!.sql
  const debut = sql.lastIndexOf(`FUNCTION public.${fn}(`)
  const corps = sql.indexOf('$$', sql.indexOf('AS $$', debut) + 5)
  return sql.slice(debut, corps)
}

describe('le barème d’XP', () => {
  it('suit l’effort : base + par bonne réponse, plafonné à la partie', () => {
    expect(xpActivite('quiz', 8, 10)).toBe(26)
    expect(xpActivite('quiz', 10, 10)).toBe(40)
    expect(xpActivite('quiz', 40, 40)).toBe(50)
    expect(xpActivite('quiz', 0, 10)).toBe(10)
    expect(xpActivite('revision', 12, 15)).toBe(24)
    expect(xpActivite('dictee', 16, 20)).toBe(42)
    expect(xpActivite('annale', 0, 0)).toBe(150)
  })

  it('ne compte jamais plus de bonnes réponses que de questions', () => {
    expect(xpActivite('quiz', 99, 5)).toBe(xpActivite('quiz', 5, 5))
    expect(xpActivite('jeu', -3, 10)).toBe(0)
    expect(xpActivite('jeu', Number.NaN, 10)).toBe(0)
  })

  it('donne de l’XP à tout ce qui est du travail, et plus au travail scolaire qu’au jeu', () => {
    for (const a of ACTIVITES_XP) expect(BAREME_XP[a].plafondJour, a).toBeGreaterThan(0)
    expect(BAREME_XP.annale.maxPartie).toBeGreaterThan(BAREME_XP.quiz.maxPartie)
    expect(BAREME_XP.quiz.plafondJour).toBeGreaterThan(BAREME_XP.jeu.plafondJour)
    expect(BAREME_XP.examen_blanc.maxPartie).toBeGreaterThan(BAREME_XP.arene.maxPartie)
  })

  it('borne chaque activité à son plafond du jour', () => {
    expect(xpDansLePlafond('jeu', 15, 50)).toBe(10)
    expect(xpDansLePlafond('jeu', 15, 60)).toBe(0)
    expect(xpDansLePlafond('quiz', 26, 0)).toBe(26)
  })

  it('paie les étoiles et la Traque en XP', () => {
    expect([1, 2, 3, 4, 5].map(xpEtoilePalier)).toEqual([5, 10, 15, 20, 25])
    expect(xpEtoilePalier(0)).toBe(0)
    expect(xpTraque(1, false, false)).toBe(30)
    expect(xpTraque(2, false, true)).toBe(90)
    expect(xpTraque(3, true, true)).toBe(90)
  })
})

describe('les gemmes, rares', () => {
  it('ne tombent qu’au-dessus du seuil d’une vraie épreuve', () => {
    expect(gemmesEpreuve('dictee', 15.5)).toBe(0)
    expect(gemmesEpreuve('dictee', 16)).toBe(5)
    expect(gemmesEpreuve('dictee', 19)).toBe(10)
    expect(gemmesEpreuve('controle', 13.5)).toBe(0)
    expect(gemmesEpreuve('controle', 14)).toBe(5)
    expect(gemmesEpreuve('controle', 17)).toBe(10)
    expect(gemmesEpreuve('examen_blanc', 14.9)).toBe(0)
    expect(gemmesEpreuve('examen_blanc', 15)).toBe(10)
    expect(gemmesEpreuve('annale', 0)).toBe(10)
    expect(gemmesExerciceCahier(2)).toBe(0)
    expect(gemmesExerciceCahier(3)).toBe(5)
  })
})

describe('miroir SQL (557)', () => {
  it('xp_activite_bareme a les mêmes règles que BAREME_XP', () => {
    const sql = sqlDe('xp_activite_bareme')
    const lignes = [...sql.matchAll(/\('([a-z_]+)',\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)/g)]
    const sqlBareme = Object.fromEntries(
      lignes.map((m) => [m[1], { base: +m[2], parPoint: +m[3], parfait: +m[4], maxPartie: +m[5] }]),
    )
    expect(Object.keys(sqlBareme).sort()).toEqual([...ACTIVITES_XP].sort())
    for (const a of ACTIVITES_XP) {
      const { base, parPoint, parfait, maxPartie } = BAREME_XP[a]
      expect(sqlBareme[a], a).toEqual({ base, parPoint, parfait, maxPartie })
    }
  })

  it('xp_activite_plafond a les mêmes plafonds', () => {
    const sql = sqlDe('xp_activite_plafond')
    const plafonds = Object.fromEntries(
      [...sql.matchAll(/WHEN\s+'([a-z_]+)'\s+THEN\s+(\d+)/g)].map((m) => [m[1], +m[2]]),
    )
    for (const a of ACTIVITES_XP) expect(plafonds[a], a).toBe(BAREME_XP[a].plafondJour)
  })

  it('epreuve_gemmes a les mêmes seuils', () => {
    const sql = sqlDe('epreuve_gemmes')
    for (const [type, notes] of [
      ['dictee', [15, 16, 19]],
      ['controle', [13, 14, 17]],
      ['examen_blanc', [14, 15]],
    ] as const) {
      const bloc = sql.slice(sql.indexOf(`WHEN '${type}'`)).split('\n')[0]
      for (const n of notes) {
        const paliers = [...bloc.matchAll(/p_note >= (\d+) THEN (\d+)/g)].map((m) => [+m[1], +m[2]])
        const attendu = paliers.find(([s]) => n >= s)?.[1] ?? 0
        expect(gemmesEpreuve(type as Epreuve, n), `${type} ${n}`).toBe(attendu)
      }
    }
    expect(sqlDe('epreuve_gemmes_semaine_max')).toContain(`SELECT ${PLAFOND_GEMMES_SEMAINE}`)
  })

  it('annale_connue connaît EXACTEMENT les annales du dépôt (contenu/annales)', () => {
    const sql = sqlDe('annale_connue')
    const enBase = [...sql.matchAll(/'([a-z0-9-]+)'/g)].map((m) => m[1]).sort()
    const auDepot = readdirSync(join(process.cwd(), 'contenu', 'annales'))
      .filter((f) => f.endsWith('.json'))
      .map((f) => f.slice(0, -'.json'.length))
      .sort()
    // Une annale ajoutée au dépôt sans migration ne se validerait pas (ni XP ni
    // gemmes) : redéfinir annale_connue dans une migration suivante.
    expect(enBase).toEqual(auDepot)
  })

  it('le portefeuille ne verse plus de gemme de niveau ni de série', () => {
    for (const fn of ['wallet_grant_xp', 'wallet_award_xp', 'wallet_touch']) {
      const sql = sqlDe(fn)
      expect(sql, fn).not.toMatch(/INSERT INTO public\.gem_events/)
    }
  })
})
