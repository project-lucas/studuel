import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { ALL_BOSSES, weeklyBoss, weeklyTrophyId } from '@/lib/bosses'
import { WIN_COINS, WIN_COINS_DAILY_CAP } from '@/lib/defi/duel-record'
import { DAILY_GOAL_OPTIONS } from '@/lib/daily-goal'
import {
  chasseOfDay,
  CHASSE_MULTIPLIER,
  NOX_GEMS,
  TRAQUE_APRES_DEFAITE,
  TRAQUE_FENETRE_MINUTES,
  TRAQUE_GEMS,
  TRAQUE_GEMS_WEEK_CAP,
  TRAQUE_PLAFOND_JOUR,
  TRAQUE_SEUIL,
} from '@/lib/traque'

// Une semaine de référence, lundi → vendredi (2026-07-27 est un lundi). Le
// week-end n'y figure pas : la chasse y est ouverte à TOUS, sans liste.
const LUNDI_TO_VENDREDI = [
  '2026-07-27',
  '2026-07-28',
  '2026-07-29',
  '2026-07-30',
  '2026-07-31',
]

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

describe('La Traque : lib/traque.ts ↔ migrations SQL', () => {
  // Même piège que la rotation des boss, en pire : ici une dérive ne se voit
  // pas du tout. Le seuil côté app dirait « boss débusqué » quand le serveur
  // dirait « jauge à 80 % », et le combat serait refusé sans un mot d'erreur.
  //
  // On ne lit PAS un fichier unique : la traque est répartie sur plusieurs
  // migrations (212 la crée, 213 remplace ses RPC) et chaque CREATE OR REPLACE
  // écrase la précédente. Ce qui compte est donc, pour chaque règle, la
  // DERNIÈRE écriture dans l'ordre des migrations — exactement ce que la base
  // aura appliqué.
  const lastMatch = (re: RegExp): { file: string; m: RegExpMatchArray } | null => {
    let found: { file: string; m: RegExpMatchArray } | null = null
    for (const { file, sql } of migrationsInOrder()) {
      const m = sql.match(re)
      if (m) found = { file, m }
    }
    return found
  }

  /** Le match effectif, ou un échec de test explicite. */
  const effective = (re: RegExp, what: string): RegExpMatchArray => {
    const hit = lastMatch(re)
    expect(hit, `${what} introuvable dans les migrations`).not.toBeNull()
    return hit!.m
  }

  /** Corps d'une fonction SQL constante : `SELECT <valeur>`. */
  const constant = (name: string): string =>
    effective(
      new RegExp(`FUNCTION public\\.${name}\\(\\)[\\s\\S]*?SELECT ([^\\s$]+)`),
      `constante ${name}`,
    )[1]

  it('applique le MÊME seuil, plafond et retombée après défaite', () => {
    expect(Number(constant('traque_seuil'))).toBe(TRAQUE_SEUIL)
    expect(Number(constant('traque_plafond_jour'))).toBe(TRAQUE_PLAFOND_JOUR)
    expect(Number(constant('traque_apres_defaite'))).toBe(TRAQUE_APRES_DEFAITE)
    expect(Number(constant('traque_gems_week_cap'))).toBe(TRAQUE_GEMS_WEEK_CAP)
  })

  it('ouvre la MÊME fenêtre de combat', () => {
    const m = effective(
      /traque_fenetre[\s\S]*?INTERVAL '(\d+) minutes'/,
      'fenêtre de combat',
    )
    expect(Number(m[1])).toBe(TRAQUE_FENETRE_MINUTES)
  })

  it('fait chasser les mêmes boss les mêmes jours', () => {
    // La RPC parle en isodow (lundi = 1) ; l'app en index lundi = 0.
    const body = effective(
      /traque_en_chasse[\s\S]*?CASE v_dow([\s\S]*?)END\s*\n\s*\);/,
      'calendrier de la chasse',
    )
    const rows = [...body[1].matchAll(/ARRAY\[([^\]]*)\]/g)].map((m) =>
      [...m[1].matchAll(/'([a-z0-9-]+)'/g)].map((x) => x[1]),
    )
    // Quatre WHEN (lundi→jeudi) + le ELSE (vendredi) ; le week-end est traité
    // à part (tout le monde chasse), donc absent du CASE.
    expect(rows).toHaveLength(5)
    for (const [i, ids] of rows.entries()) {
      const day = LUNDI_TO_VENDREDI[i]
      expect(chasseOfDay(day).map((b) => b.id), `jour ${day}`).toEqual(ids)
    }
  })

  it('paie les mêmes gemmes, rang par rang', () => {
    const m = effective(
      /CASE v_rank WHEN 1 THEN (\d+) WHEN 2 THEN (\d+) ELSE (\d+) END/,
      'barème de gemmes',
    )
    expect([1, 2, 3].map((r) => TRAQUE_GEMS[r as 1 | 2 | 3])).toEqual([
      Number(m[1]),
      Number(m[2]),
      Number(m[3]),
    ])
    // Nox vaut un chapitre entier, et n'est jamais doublé.
    const nox = effective(
      /v_boss = 'nox' THEN\s*\n\s*v_amount := (\d+)/,
      'montant de Nox',
    )
    expect(Number(nox[1])).toBe(NOX_GEMS)
    effective(
      new RegExp(`v_amount \\* ${CHASSE_MULTIPLIER}`),
      'bonus du boss en chasse',
    )
  })

  it('déclare bien la nouvelle source de gemmes', () => {
    // Sans l'ALTER du CHECK, l'INSERT de traque_victoire lèverait — la victoire
    // serait comptée et la gemme jamais versée.
    effective(/gem_events_source_check[\s\S]*?'traque_win'/, 'source traque_win')
  })

  // LE contrat de la traque, celui que la 212 trahissait : le gardien sort
  // pour une heure et perdre ne la lui reprend pas. Si une migration future
  // remet `debusque_at = NULL` dans traque_defaite, ce test tombe.
  it('ne referme pas la fenêtre sur une défaite', () => {
    const defaite = lastMatch(
      /FUNCTION public\.traque_defaite\([^)]*\)([\s\S]*?)\$\$;/,
    )
    expect(defaite, 'RPC traque_defaite introuvable').not.toBeNull()
    expect(defaite!.m[1]).not.toMatch(/debusque_at\s*=\s*NULL/)
    expect(defaite!.m[1]).toMatch(/attempts\s*=\s*attempts \+ 1/)
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
