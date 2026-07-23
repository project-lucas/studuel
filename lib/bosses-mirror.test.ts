import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { ALL_BOSSES, weeklyBoss, weeklyTrophyId } from '@/lib/bosses'
import { WIN_COINS, WIN_COINS_DAILY_CAP } from '@/lib/defi/duel-record'
import { DAILY_GOAL_OPTIONS } from '@/lib/daily-goal'

// Garde des MIROIRS lib ↔ SQL.
//
// Plusieurs RPC recalculent en SQL ce que l'app calcule en TypeScript — c'est
// volontaire : le client ne doit pas pouvoir choisir sa récompense. Le prix de
// cette sécurité, c'est une duplication qui peut DÉRIVER, et une dérive ne
// casse rien : la RPC répond simplement `false`, la récompense n'arrive jamais,
// et personne ne voit d'erreur.
//
// C'est arrivé : trois boss (coach-turbo, kaiser-fang, fiscus) ont été ajoutés
// à `ALL_BOSSES` sans migration miroir. La rotation SQL en comptait 14, l'app
// 17 — le boss de la semaine annoncé n'était plus celui attendu par la RPC, et
// le trophée hebdomadaire ne pouvait plus être réclamé. Corrigé par la
// migration 194 ; ce fichier existe pour que ça ne se reproduise pas.

const SUPABASE_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'supabase',
)

function migrationsInOrder(): { file: string; sql: string }[] {
  return readdirSync(SUPABASE_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort()
    .map((file) => ({
      file,
      sql: readFileSync(path.join(SUPABASE_DIR, file), 'utf8'),
    }))
}

/**
 * La rotation des boss telle que la BASE la verra : la DERNIÈRE définition de
 * `v_ids` dans l'ordre des migrations gagne (chaque migration remplace la
 * fonction par CREATE OR REPLACE).
 */
function effectiveRotation(): { file: string; ids: string[] } | null {
  let found: { file: string; ids: string[] } | null = null
  for (const { file, sql } of migrationsInOrder()) {
    if (!sql.includes('claim_weekly_trophy')) continue
    const block = sql.match(/v_ids\s+TEXT\[\]\s*:=\s*ARRAY\[([\s\S]*?)\]/i)
    if (!block) continue
    found = {
      file,
      ids: [...block[1].matchAll(/'([a-z0-9-]+)'/g)].map((m) => m[1]),
    }
  }
  return found
}

describe('rotation des boss : lib/bosses.ts ↔ claim_weekly_trophy', () => {
  const rotation = effectiveRotation()

  it('trouve bien la rotation dans les migrations', () => {
    expect(rotation, 'aucune rotation v_ids trouvée').not.toBeNull()
    expect(rotation!.ids.length).toBeGreaterThan(5)
  })

  it('liste EXACTEMENT les mêmes boss, dans le même ordre', () => {
    // L'ordre compte autant que le contenu : le boss de la semaine se calcule
    // par `semaine % taille`, donc une simple permutation décale toute la
    // rotation.
    expect(rotation!.ids, `miroir désaligné (${rotation!.file})`).toEqual(
      ALL_BOSSES.map((b) => b.id),
    )
  })

  it('désigne le même boss que l’app, semaine après semaine', () => {
    // On rejoue deux ans de lundis : c'est le seul moyen d'attraper une dérive
    // de modulo, qui ne se voit pas les premières semaines.
    const ids = rotation!.ids
    for (let week = 0; week < 104; week++) {
      const day = new Date(Date.UTC(1970, 0, 1) + (week * 7 + 4) * 86_400_000)
      const key = day.toISOString().slice(0, 10)
      const days = Math.floor(Date.parse(`${key}T00:00:00Z`) / 86_400_000)
      const sqlWeek = Math.floor((days + 3) / 7)
      const sqlId = ids[sqlWeek % ids.length]
      expect(weeklyBoss(key).id, `semaine ${week} (${key})`).toBe(sqlId)
    }
  })

  it('réclame un id de trophée que la RPC sait reconstruire', () => {
    // La RPC compose 'trophee-' || id : le helper de l'app doit faire pareil.
    for (const boss of ALL_BOSSES) {
      expect(weeklyTrophyId(boss.id)).toBe(`trophee-${boss.id}`)
    }
  })
})

describe('barème des duels : lib/defi/duel-record.ts ↔ record_duel_result', () => {
  it('accorde les mêmes pièces et le même plafond quotidien', () => {
    const sql = migrationsInOrder()
      .filter((m) => m.sql.includes('record_duel_result'))
      .at(-1)
    expect(sql, 'migration record_duel_result introuvable').toBeDefined()
    // La RPC écrit `LEAST(<gain>, <plafond> - v_already)`.
    const m = sql!.sql.match(/LEAST\(\s*(\d+)\s*,\s*(\d+)\s*-/)
    expect(m, `barème illisible dans ${sql!.file}`).not.toBeNull()
    expect(Number(m![1]), 'pièces par victoire').toBe(WIN_COINS)
    expect(Number(m![2]), 'plafond quotidien').toBe(WIN_COINS_DAILY_CAP)
  })
})

describe('objectif quotidien : lib/daily-goal.ts ↔ CHECK SQL', () => {
  it('propose exactement les valeurs que la base accepte', () => {
    const sql = migrationsInOrder()
      .filter((m) => /daily_goal_minutes\s+IN\s*\(/i.test(m.sql))
      .at(-1)
    expect(sql, 'CHECK daily_goal_minutes introuvable').toBeDefined()
    const m = sql!.sql.match(/daily_goal_minutes\s+IN\s*\(([^)]*)\)/i)
    const allowed = [...m![1].matchAll(/\d+/g)].map((x) => Number(x[0]))
    // Une option proposée mais refusée par le CHECK = enregistrement en échec
    // silencieux (l'action ne throw pas), l'objectif ne change jamais.
    expect(allowed.sort()).toEqual([...DAILY_GOAL_OPTIONS].sort())
  })
})
