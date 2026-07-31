import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import {
  DEFAULT_GOAL_MINUTES,
  addDays,
  buildSessionDrafts,
  planDates,
  planSessionCount,
} from '@/lib/prep-plan'

// Garde du MIROIR `lib/prep-plan` ↔ migration 211.
//
// La 211 recopie les contrôles hérités de 087 en `controles` + plan de
// préparation. Comme la seule voie légitime de création (`create_controle`) part
// d'un plan calculé côté app, la migration a dû REDESSINER l'algorithme en SQL.
// C'est une duplication, donc une dérive possible — et une dérive ici est
// SILENCIEUSE : les contrôles repris auraient un plan aux mauvaises dates sans
// qu'aucune erreur ne sorte. Ce dépôt s'est fait mordre cinq fois par ce motif
// (boss, coffre, maîtrise, paliers, barème de duel).
//
// Le test lit le SQL et compare ses seuils, ses offsets et sa durée à ce que
// l'implémentation TypeScript produit RÉELLEMENT (valeurs sondées en appelant
// les fonctions, pas recopiées à la main).

const here = path.dirname(fileURLToPath(import.meta.url))
const SQL = readFileSync(
  path.join(here, '..', 'supabase', '211_reprise_controles_depuis_upcoming_exams.sql'),
  'utf8',
)

// Plancher anti-regex-cassée : si le fichier change de forme au point que plus
// rien ne matche, le test doit échouer au lieu de devenir muet.
describe('la migration 211 est bien celle qu’on croit lire', () => {
  it('contient le bloc de plan de préparation', () => {
    expect(SQL).toContain('miroir de planDates()')
    expect(SQL).toContain('v_count')
    expect(SQL.length).toBeGreaterThan(2_000)
  })
})

describe('miroir des seuils de planSessionCount', () => {
  // Sondés, pas recopiés : le plus petit nombre de jours qui donne 3 sessions,
  // puis 2. `today` fixe, la fonction ne dépend que de l'écart.
  const TODAY = '2026-08-01'
  function smallestDeltaFor(count: 1 | 2 | 3): number {
    for (let d = 0; d <= 60; d += 1) {
      if (planSessionCount(addDays(TODAY, d), TODAY) === count) return d
    }
    throw new Error(`aucun écart ne donne ${count} sessions`)
  }

  it('le seuil « 3 sessions » du SQL est celui de planSessionCount', () => {
    const seuil = smallestDeltaFor(3)
    expect(seuil).toBe(5) // garde-fou : si l’app change, le SQL DOIT bouger
    expect(SQL).toMatch(
      new RegExp(`v_delta\\s*>=\\s*${seuil}\\s+THEN\\s+v_count\\s*:=\\s*3`),
    )
  })

  it('le seuil « 2 sessions » du SQL est celui de planSessionCount', () => {
    const seuil = smallestDeltaFor(2)
    expect(seuil).toBe(2)
    expect(SQL).toMatch(
      new RegExp(`v_delta\\s*>=\\s*${seuil}\\s+THEN\\s+v_count\\s*:=\\s*2`),
    )
  })
})

describe('miroir des offsets de planDates', () => {
  const TODAY = '2026-08-01'

  // Offsets réellement produits par l'app pour un contrôle assez lointain pour
  // qu'aucune borne « pas avant aujourd'hui » ne s'applique.
  function offsetsFor(count: 2 | 3): number[] {
    const delta = count === 3 ? 30 : 3
    const exam = addDays(TODAY, delta)
    return planDates(exam, TODAY)
      .map((d) => delta - (Date.parse(`${d}T00:00:00Z`) - Date.parse(`${TODAY}T00:00:00Z`)) / 86_400_000)
      .sort((a, b) => b - a)
  }

  it('les offsets à 3 sessions du SQL sont ceux de planDates', () => {
    const offsets = offsetsFor(3)
    expect(offsets).toEqual([4, 2, 1])
    expect(SQL).toMatch(
      new RegExp(`v_count\\s*=\\s*3\\s+THEN\\s+v_offsets\\s*:=\\s*ARRAY\\[\\s*${offsets.join(',\\s*')}\\s*\\]`),
    )
  })

  it('les offsets à 2 sessions du SQL sont ceux de planDates', () => {
    const offsets = offsetsFor(2)
    expect(offsets).toEqual([2, 1])
    expect(SQL).toMatch(
      new RegExp(`ELSE\\s+v_offsets\\s*:=\\s*ARRAY\\[\\s*${offsets.join(',\\s*')}\\s*\\]`),
    )
  })
})

describe('miroir de la durée de session', () => {
  it('la durée du SQL est DEFAULT_GOAL_MINUTES', () => {
    // Sondée par l'API publique plutôt que par la constante seule : c'est la
    // durée que `buildSessionDrafts` écrit vraiment quand aucun objectif n'est
    // donné, donc celle que la 211 doit reproduire.
    const [draft] = buildSessionDrafts(
      [{ id: 'ch1', title: 'Chapitre' }],
      null,
      '2026-08-01',
    )
    expect(draft.durationMin).toBe(DEFAULT_GOAL_MINUTES)
    expect(SQL).toMatch(
      new RegExp(`v_goal\\s+INTEGER\\s*:=\\s*${draft.durationMin};`),
    )
  })
})

describe('miroir des invariants de forme', () => {
  it('la rotation des chapitres est bien un modulo du nombre de chapitres', () => {
    // Côté app : session i → chapitre (i modulo N).
    const chapters = [
      { id: 'a', title: 'A' },
      { id: 'b', title: 'B' },
    ]
    const drafts = buildSessionDrafts(chapters, '2026-08-20', '2026-08-01')
    expect(drafts.map((d) => d.chapterId)).toEqual(['a', 'b', 'a'])
    expect(SQL).toContain("((v_i - 1) % v_nchap) ->> 'id'")
  })

  it('la migration ne supprime rien (réversibilité)', () => {
    expect(SQL).not.toMatch(/\bDELETE\s+FROM\b/i)
    expect(SQL).not.toMatch(/\bDROP\s+(TABLE|COLUMN|FUNCTION)\b/i)
    expect(SQL).not.toMatch(/UPDATE\s+public\.profiles/i)
  })

  it('elle est idempotente : un groupe déjà repris est ignoré', () => {
    expect(SQL).toContain('IS NOT DISTINCT FROM')
    expect(SQL).toMatch(/EXISTS\s*\(\s*SELECT 1 FROM public\.controles/)
  })
})
