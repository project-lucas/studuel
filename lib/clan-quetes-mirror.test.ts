import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import {
  CLAN_POINTS,
  DAILY_CONTRIBUTION_CAP,
  MIN_POINTS_TO_CLAIM,
  clanWeekReward,
  type ClanEvent,
} from '@/lib/clan-week'
import {
  QUEST_CATALOG,
  QUESTS_PER_DAY,
  ALL_DONE_XP,
  ALL_DONE_GEMS,
} from '@/lib/quests'

// Garde des MIROIRS lib ↔ SQL de la boucle hebdomadaire (clan 204, quêtes 205).
//
// Même piège que la rotation des boss et La Traque : le barème vit DES DEUX
// CÔTÉS (le client envoie un NOM d'événement, jamais un nombre ; le SQL fixe la
// valeur) et une dérive ne casse RIEN de visible — l'écran promet une récompense
// que la RPC ne verse pas, ou l'inverse, sans une erreur. Ce projet s'est fait
// mordre cinq fois par un miroir qui dérive ; ces deux-là n'étaient pas encore
// gardés. On lit le SQL et on le compare aux constantes de `lib/`.

const SUPABASE_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'supabase',
)

function allSql(): string[] {
  return readdirSync(SUPABASE_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort()
    .map((file) => readFileSync(path.join(SUPABASE_DIR, file), 'utf8'))
}

/** Le corps d'une fonction plpgsql — de sa signature (paramètres compris)
 *  jusqu'à son `$$;` — tel que la BASE le verra : la DERNIÈRE migration qui
 *  la DÉFINIT gagne (et non celle qui la mentionne dans un GRANT ou un
 *  commentaire). */
function fnBody(name: string): string {
  const re = new RegExp(
    `FUNCTION public\\.${name}\\s*\\([^)]*\\)([\\s\\S]*?)\\$\\$;`,
  )
  let body: string | null = null
  for (const sql of allSql()) {
    const m = sql.match(re)
    if (m) body = m[1]
  }
  expect(body, `définition de ${name} introuvable`).not.toBeNull()
  return body!
}

describe('clan hebdo : lib/clan-week.ts ↔ migration 204', () => {
  const contribute = fnBody('clan_week_contribute')
  const claim = fnBody('clan_week_claim')

  it('accorde les mêmes points par événement de contribution', () => {
    const bareme = contribute.match(/v_base := CASE p_event([\s\S]*?)END/)
    expect(bareme, 'barème CASE p_event introuvable').not.toBeNull()
    const sqlPoints: Partial<Record<ClanEvent, number>> = {}
    for (const m of bareme![1].matchAll(/WHEN '([a-z_]+)'\s+THEN (\d+)/g)) {
      sqlPoints[m[1] as ClanEvent] = Number(m[2])
    }
    // Exactement les mêmes clés, exactement les mêmes valeurs des deux côtés.
    expect(sqlPoints).toEqual(CLAN_POINTS)
  })

  it('applique le même plafond quotidien de contribution', () => {
    const m = contribute.match(/GREATEST\(0,\s*(\d+)\s*-\s*COALESCE/)
    expect(m, 'plafond quotidien introuvable').not.toBeNull()
    expect(Number(m![1])).toBe(DAILY_CONTRIBUTION_CAP)
  })

  it('exige la même contribution personnelle minimale pour réclamer', () => {
    const m = claim.match(/v_mine\s*<\s*(\d+)/)
    expect(m, 'seuil minimal de réclamation introuvable').not.toBeNull()
    expect(Number(m![1])).toBe(MIN_POINTS_TO_CLAIM)
  })

  it('paie les mêmes gemmes et XP, palier par palier', () => {
    // La RPC : `v_tier := '<tier>'; v_gems := <g>; v_xp := <x>`. On compare à
    // ce que clanWeekReward rend pour un rang de chaque palier (myPoints élevé
    // pour passer le seuil MIN_POINTS_TO_CLAIM).
    const tierOf = (tier: string): { gems: number; xp: number } => {
      const m = claim.match(
        new RegExp(`'${tier}';\\s*v_gems := (\\d+);\\s*v_xp := (\\d+)`),
      )
      expect(m, `palier ${tier} introuvable`).not.toBeNull()
      return { gems: Number(m![1]), xp: Number(m![2]) }
    }
    const rangs: [number, string][] = [
      [1, 'or'],
      [3, 'argent'],
      [10, 'bronze'],
      [11, 'participation'],
    ]
    for (const [rank, tier] of rangs) {
      const lib = clanWeekReward(rank, 999)
      const sql = tierOf(tier)
      expect({ tier: lib.tier, gems: lib.gems, xp: lib.xp }).toEqual({
        tier,
        gems: sql.gems,
        xp: sql.xp,
      })
    }
  })
})

describe('quêtes du jour : lib/quests.ts ↔ migration 205', () => {
  const catalog = fnBody('quest_catalog')
  const claim = fnBody('quest_claim')

  it('déclare EXACTEMENT le même catalogue (id, objectif, XP, gemmes)', () => {
    const sqlCat = [
      ...catalog.matchAll(/\('([a-z0-9]+)',\s*(\d+),\s*(\d+),\s*(\d+)\)/g),
    ].map((m) => ({
      id: m[1],
      goal: Number(m[2]),
      xp: Number(m[3]),
      gems: Number(m[4]),
    }))
    const libCat = QUEST_CATALOG.map((q) => ({
      id: q.id,
      goal: q.goal,
      xp: q.xp,
      gems: q.gems,
    }))
    // Même contenu, même ordre : le tirage déterministe ne partage pas la liste,
    // mais l'égalité stricte attrape aussi bien un ajout que la moindre valeur.
    expect(sqlCat).toEqual(libCat)
  })

  it('verse le même bonus de journée complète', () => {
    // INSERT ... VALUES (v_user, v_today, '__jour__', <gems>, <xp>)
    const m = claim.match(/'__jour__',\s*(\d+),\s*(\d+)\)/)
    expect(m, 'bonus __jour__ introuvable').not.toBeNull()
    expect(Number(m![1])).toBe(ALL_DONE_GEMS)
    expect(Number(m![2])).toBe(ALL_DONE_XP)
  })

  it('borne la réclamation au même nombre de quêtes par jour', () => {
    const m = claim.match(/v_asked\s*>\s*(\d+)/)
    expect(m, 'borne du nombre de quêtes introuvable').not.toBeNull()
    expect(Number(m![1])).toBe(QUESTS_PER_DAY)
  })
})
