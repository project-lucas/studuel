import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import {
  QUEST_CATALOG,
  ALL_DONE_XP,
  ALL_DONE_GEMS,
} from '@/lib/quests'
import {
  CLAN_POINTS,
  DAILY_CONTRIBUTION_CAP,
  MIN_POINTS_TO_CLAIM,
  clanWeekReward,
} from '@/lib/clan-week'
import {
  CROWNS,
  DAILY_CROWN_CAP,
  CROWNS_PER_TIER,
  TIER_COUNT,
  rewardFor,
} from '@/lib/saison'

// Garde des MIROIRS lib ↔ SQL de la vague « boucle quotidienne » (204/205/207).
//
// Les barèmes des quêtes du jour, du clan hebdo et de la saison existent en
// DOUBLE : côté serveur (le client n'envoie jamais un montant) et côté lib
// (l'affichage promet AVANT que le serveur ne verse). Une dérive ne casse
// rien : l'écran promet un montant, le serveur en verse un autre — en silence.
// Même famille de piège que la rotation des boss (corrigée par la 194) ; ce
// fichier suit le modèle de lib/bosses-mirror.test.ts.

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

/** La DERNIÈRE migration définissant une fonction gagne (CREATE OR REPLACE). */
function effectiveSql(fnName: string): { file: string; sql: string } {
  const found = migrationsInOrder()
    .filter((m) => m.sql.includes(`FUNCTION public.${fnName}`))
    .at(-1)
  expect(found, `aucune migration ne définit ${fnName}`).toBeDefined()
  return found!
}

/** Les paires `WHEN 'evenement' THEN montant` d'un CASE de barème. */
function caseEntries(sql: string, anchor: string): Record<string, number> {
  const start = sql.indexOf(anchor)
  expect(start, `« ${anchor} » introuvable`).toBeGreaterThanOrEqual(0)
  const block = sql.slice(start, sql.indexOf('END;', start))
  const out: Record<string, number> = {}
  for (const m of block.matchAll(/WHEN\s+'([a-z0-9_]+)'\s*THEN\s+(\d+)/gi)) {
    out[m[1]] = Number(m[2])
  }
  return out
}

describe('quêtes du jour : lib/quests.ts ↔ quest_catalog (205)', () => {
  const { file, sql } = effectiveSql('quest_catalog')

  it('liste EXACTEMENT les mêmes quêtes (id, objectif, XP, gemmes)', () => {
    const block = sql.match(/FROM\s*\(VALUES([\s\S]*?)\)\s*AS\s+c/i)
    expect(block, `catalogue illisible dans ${file}`).not.toBeNull()
    const rows = [...block![1].matchAll(/\('(\w+)',\s*(\d+),\s*(\d+),\s*(\d+)\)/g)]
      .map((m) => ({ id: m[1], goal: +m[2], xp: +m[3], gems: +m[4] }))
    expect(rows).toEqual(
      QUEST_CATALOG.map(({ id, goal, xp, gems }) => ({ id, goal, xp, gems })),
    )
  })

  it('paie le bonus « journée complète » au montant promis', () => {
    const claim = effectiveSql('quest_claim')
    const m = claim.sql.match(/'__jour__',\s*(\d+),\s*(\d+)\)/)
    expect(m, `bonus __jour__ illisible dans ${claim.file}`).not.toBeNull()
    expect(Number(m![1]), 'gemmes du bonus').toBe(ALL_DONE_GEMS)
    expect(Number(m![2]), 'XP du bonus').toBe(ALL_DONE_XP)
  })

  it("VERSE l'XP réclamée au portefeuille (le chiffre affiché doit exister)", () => {
    // Le défaut d'origine : quest_claim renvoyait l'XP pour l'écran sans jamais
    // la créditer. Si cet appel disparaît, l'écran recommence à mentir.
    expect(effectiveSql('quest_claim').sql).toMatch(
      /wallet_grant_xp\(v_user,\s*'quests'/,
    )
  })
})

describe('clan hebdo : lib/clan-week.ts ↔ 204', () => {
  it('crédite les mêmes points par événement', () => {
    const { sql } = effectiveSql('clan_week_contribute')
    expect(caseEntries(sql, 'v_base := CASE p_event')).toEqual({
      ...CLAN_POINTS,
    })
  })

  it('applique le même plafond quotidien', () => {
    const { file, sql } = effectiveSql('clan_week_contribute')
    const m = sql.match(/GREATEST\(0,\s*(\d+)\s*-\s*COALESCE\(v_done/)
    expect(m, `plafond illisible dans ${file}`).not.toBeNull()
    expect(Number(m![1])).toBe(DAILY_CONTRIBUTION_CAP)
  })

  it('exige la même contribution minimale pour le coffre', () => {
    const { file, sql } = effectiveSql('clan_week_claim')
    const m = sql.match(/v_mine\s*<\s*(\d+)/)
    expect(m, `minimum illisible dans ${file}`).not.toBeNull()
    expect(Number(m![1])).toBe(MIN_POINTS_TO_CLAIM)
  })

  it('paie les mêmes coffres par rang (gemmes ET XP)', () => {
    const { file, sql } = effectiveSql('clan_week_claim')
    const tiers = [
      ...sql.matchAll(
        /v_tier := '(\w+)';\s*v_gems := (\d+);\s*v_xp := (\d+);/g,
      ),
    ].map((m) => ({ tier: m[1], gems: +m[2], xp: +m[3] }))
    expect(tiers.length, `paliers illisibles dans ${file}`).toBe(4)
    // Rangs représentatifs de chaque palier SQL : 1er, podium, top 10, au-delà.
    const byRank = [
      { rank: 1, tier: 'or' },
      { rank: 3, tier: 'argent' },
      { rank: 10, tier: 'bronze' },
      { rank: 42, tier: 'participation' },
    ]
    for (const { rank, tier } of byRank) {
      const sqlTier = tiers.find((t) => t.tier === tier)
      const libTier = clanWeekReward(rank, MIN_POINTS_TO_CLAIM)
      expect(libTier.tier, `rang ${rank}`).toBe(tier)
      expect(sqlTier, `palier SQL « ${tier} » absent`).toBeDefined()
      expect(
        { gems: sqlTier!.gems, xp: sqlTier!.xp },
        `coffre du palier « ${tier} »`,
      ).toEqual({ gems: libTier.gems, xp: libTier.xp })
    }
  })

  it("VERSE l'XP du coffre au portefeuille", () => {
    expect(effectiveSql('clan_week_claim').sql).toMatch(
      /wallet_grant_xp\(v_user,\s*'clan_week'/,
    )
  })
})

describe('saison : lib/saison.ts ↔ 207', () => {
  it('crédite les mêmes couronnes par événement', () => {
    const { sql } = effectiveSql('season_add_crowns')
    expect(caseEntries(sql, 'v_base := CASE p_event')).toEqual({ ...CROWNS })
  })

  it('applique le même plafond quotidien de couronnes', () => {
    const { file, sql } = effectiveSql('season_add_crowns')
    const m = sql.match(/GREATEST\(0,\s*(\d+)\s*-\s*COALESCE\(v_done/)
    expect(m, `plafond illisible dans ${file}`).not.toBeNull()
    expect(Number(m![1])).toBe(DAILY_CROWN_CAP)
  })

  it('découpe la piste aux mêmes paliers (largeur et nombre)', () => {
    const per = effectiveSql('season_crowns_for_tier')
    const width = per.sql.match(/GREATEST\(0,\s*p_tier\s*-\s*1\)\s*\*\s*(\d+)/)
    expect(width, `largeur illisible dans ${per.file}`).not.toBeNull()
    expect(Number(width![1])).toBe(CROWNS_PER_TIER)

    const cap = effectiveSql('season_tier_for')
    const count = cap.sql.match(/LEAST\((\d+),\s*GREATEST\(0,\s*p_crowns\)/)
    expect(count, `plafond de palier illisible dans ${cap.file}`).not.toBeNull()
    expect(Number(count![1])).toBe(TIER_COUNT)
  })

  it('paie chaque palier de chaque voie comme lib/saison.rewardFor', () => {
    const { file, sql } = effectiveSql('season_claim')
    // Les trois montants du CASE de season_claim…
    const libre = sql.match(
      /p_lane = 'libre' THEN\s*v_kind := 'gemmes';\s*v_amount := CASE WHEN p_tier % 5 = 0 THEN (\d+) ELSE (\d+) END;/,
    )
    expect(libre, `barème libre illisible dans ${file}`).not.toBeNull()
    const prestige = sql.match(/ELSE\s*v_kind := 'gemmes';\s*v_amount := (\d+);/)
    expect(prestige, `barème prestige illisible dans ${file}`).not.toBeNull()
    // …et les titres (l'apostrophe TYPOGRAPHIQUE compte : le titre écrit en
    // base doit être strictement égal à celui que la piste affiche).
    const titlesBlock = sql.match(/v_titles\s+TEXT\[\]\s*:=\s*ARRAY\[([\s\S]*?)\];/)
    expect(titlesBlock, `titres illisibles dans ${file}`).not.toBeNull()
    const sqlTitles = [...titlesBlock![1].matchAll(/'((?:[^']|'')*)'/g)].map(
      (m) => m[1].replaceAll("''", "'"),
    )

    // On rejoue les 30 paliers × 2 voies avec la formule SQL parsée, et on
    // exige le même verdict que rewardFor.
    for (let tier = 1; tier <= TIER_COUNT; tier++) {
      const libLibre = rewardFor(tier, 'libre')
      expect(
        { kind: 'gemmes', amount: tier % 5 === 0 ? +libre![1] : +libre![2] },
        `voie libre, palier ${tier}`,
      ).toEqual({ kind: libLibre.kind, amount: libLibre.amount })

      const libPrestige = rewardFor(tier, 'prestige')
      if (tier % 5 === 0) {
        const sqlTitle = sqlTitles[Math.min(sqlTitles.length, tier / 5) - 1]
        expect(libPrestige.kind, `prestige, palier ${tier}`).toBe('titre')
        expect(sqlTitle, `titre du palier ${tier}`).toBe(libPrestige.title)
      } else {
        expect(
          { kind: 'gemmes', amount: +prestige![1] },
          `voie prestige, palier ${tier}`,
        ).toEqual({ kind: libPrestige.kind, amount: libPrestige.amount })
      }
    }
  })
})
