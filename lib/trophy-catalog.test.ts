import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { JEUX_RETIRES, SALONS } from './jeux/catalog'
import { PROGRAMME_GAME_ID, programmeSlug } from './jeux/programme'
import { BAND_SPAN, SEASON_KEEP_FLOOR, TROPHY_BANDS } from './trophy-road'
import { cheminMigration } from '@/lib/migrations-lecture'

// Le miroir SQL ↔ TypeScript de la Route des trophées.
//
// Ce projet a déjà payé le prix d'une double source de vérité : deux échelles
// trophées → palier avaient fini par rendre « Bronze III » d'un côté et
// « Salle d'étude » de l'autre pour le même total (cf. l'en-tête de
// lib/rank.ts). La migration 238 rejoue la courbe de lib/trophy-road.ts et la
// liste blanche de lib/jeux/catalog.ts : ce fichier relit le SQL et vérifie
// qu'aucun des deux n'a dérivé.

const SQL = readFileSync(
  cheminMigration('238_route_des_trophees.sql'),
  'utf8',
)
// Les jeux de Musique et de Sport (14/10/2026) entrent dans la liste blanche
// par la 578 : le miroir relit les deux.
const SQL_578 = readFileSync(cheminMigration('578_jeux_musique_sport.sql'), 'utf8')
// Le Musée (arts plastiques, 14/10/2026) par la 579.
const SQL_579 = readFileSync(cheminMigration('579_jeu_le_musee.sql'), 'utf8')

function pairsOf(sql: string, nom: string): string[] {
  const insert = sql.split('INSERT INTO public.game_catalog')[1]
  if (!insert) throw new Error(`INSERT game_catalog introuvable dans la ${nom}`)
  const body = insert.split('ON CONFLICT')[0]
  return [...body.matchAll(/\(\s*'([^']+)'\s*,\s*'([^']+)'\s*\)/g)].map((m) => `${m[1]}:${m[2]}`)
}

/** Les couples (slug de matière, id de jeu) réellement insérés : la 238, puis la 578. */
function seededPairs(): Set<string> {
  return new Set([...pairsOf(SQL, '238'), ...pairsOf(SQL_578, '578'), ...pairsOf(SQL_579, '579')])
}

/** Ce que le code attend : les jeux jouables + le Programme dans chaque matière. */
function expectedPairs(): Set<string> {
  const pairs = new Set<string>()
  for (const salon of SALONS) {
    const slug = programmeSlug(salon.subject)
    for (const game of salon.games) {
      if (game.implemented) pairs.add(`${slug}:${game.id}`)
    }
    pairs.add(`${slug}:${PROGRAMME_GAME_ID}`)
  }
  return pairs
}

describe('la liste blanche du serveur suit le catalogue du code', () => {
  it('n’oublie aucun jeu jouable (sinon la RPC refuse ses trophées)', () => {
    const seeded = seededPairs()
    const missing = [...expectedPairs()].filter((p) => !seeded.has(p))
    expect(missing, `absents de la migration 238 : ${missing.join(', ')}`).toEqual([])
  })

  it('n’ouvre aucun couple que le code ne connaît pas', () => {
    const expected = expectedPairs()
    // Les jeux retirés le 19/09/2026 restent en base, sans effet (JEUX_RETIRES).
    const extra = [...seededPairs()].filter(
      (p) => !expected.has(p) && !JEUX_RETIRES.includes(p.split(':')[1]),
    )
    expect(extra, `en trop dans la migration 238 : ${extra.join(', ')}`).toEqual([])
  })

  it('donne le Programme à toutes les matières (l’égalisation du catalogue)', () => {
    const seeded = seededPairs()
    for (const salon of SALONS) {
      expect(
        seeded.has(`${programmeSlug(salon.subject)}:${PROGRAMME_GAME_ID}`),
        `${salon.subject} n’a pas son Programme`,
      ).toBe(true)
    }
  })

  it('amène chaque matière à au moins trois jeux porteurs de trophées', () => {
    // C'est la raison d'être du Programme : une matière à deux jeux aurait un
    // plafond inférieur d'un tiers, et « je suis fort en SVT » deviendrait
    // illisible face à « fort en Maths ».
    const counts = new Map<string, number>()
    for (const pair of seededPairs()) {
      const slug = pair.split(':')[0]
      counts.set(slug, (counts.get(slug) ?? 0) + 1)
    }
    // Sport n'a qu'un jeu de salon, Muscles express : Lucas a retiré le second
    // le 14/10/2026 (« le classement de sport tu peux l'oublier »). Avec le
    // Programme, deux jeux porteurs de trophées — l'exception est assumée.
    // Sport et arts plastiques n'ont qu'un jeu de salon (Muscles express, Le Musée) en plus du Programme.
    const DEUX_SUFFISENT = new Set(['sport', 'arts-plastiques'])
    for (const [slug, count] of counts) {
      expect(count, `${slug} n’a que ${count} jeu(x)`).toBeGreaterThanOrEqual(
        DEUX_SUFFISENT.has(slug) ? 2 : 3,
      )
    }
  })
})

describe('la courbe du serveur suit celle du code', () => {
  it('utilise la même largeur de bande', () => {
    const match = SQL.match(/v_band_span\s+CONSTANT\s+INTEGER\s*:=\s*(\d+)/)
    expect(match?.[1]).toBeDefined()
    expect(Number(match?.[1])).toBe(BAND_SPAN)
  })

  it('plafonne sur la même dernière bande', () => {
    const match = SQL.match(/v_last_band\s+CONSTANT\s+INTEGER\s*:=\s*(\d+)/)
    expect(match?.[1]).toBeDefined()
    expect(Number(match?.[1])).toBe(TROPHY_BANDS.length - 1)
  })

  it('rejoue exactement les gains et les pertes de TROPHY_BANDS', () => {
    // Le SQL dérive le barème de l'index de bande (`v_win := 10 - v_band`) là
    // où le TS l'écrit en toutes lettres. On vérifie que les deux tombent sur
    // les mêmes chiffres, bande par bande — c'est le seul point qui compte.
    const winFormula = SQL.match(/v_win\s*:=\s*(\d+)\s*-\s*v_band/)
    const lossFormula = SQL.match(/v_loss\s*:=\s*v_band/)
    expect(winFormula?.[1], 'formule de gain introuvable dans la 238').toBeDefined()
    expect(lossFormula, 'formule de perte introuvable dans la 238').not.toBeNull()

    const base = Number(winFormula?.[1])
    TROPHY_BANDS.forEach((band, index) => {
      expect(base - index, `gain de la bande ${band.floor}`).toBe(band.win)
      expect(index, `perte de la bande ${band.floor}`).toBe(band.loss)
    })
  })
})

describe('la bascule de saison du serveur suit celle du code', () => {
  it('protège le même plancher', () => {
    const match = SQL.match(/v_season_floor\s+CONSTANT\s+INTEGER\s*:=\s*(\d+)/)
    expect(match?.[1]).toBeDefined()
    expect(Number(match?.[1])).toBe(SEASON_KEEP_FLOOR)
  })

  it('ne garde que la moitié de ce qui dépasse, comme seasonReset', () => {
    expect(SQL).toMatch(
      /v_season_floor \+ \(\(v_before - v_season_floor\) \/ 2\)/,
    )
  })

  it('emploie la même clé de saison que lib/saison (mois calendaire UTC)', () => {
    expect(SQL).toContain("to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM')")
  })

  it('bascule en paresseux, faute de cron dans cette app', () => {
    // La bascule ne peut pas être un job : elle doit se déclencher à la
    // première partie jouée dans la nouvelle saison.
    expect(SQL).toMatch(/v_season IS DISTINCT FROM v_now_season/)
  })
})

describe('les garde-fous du serveur', () => {
  it('refuse tout couple absent du catalogue (anti-farming)', () => {
    expect(SQL).toContain('FROM public.game_catalog')
    expect(SQL).toMatch(/IF NOT EXISTS[\s\S]{0,200}RETURN NULL/)
  })

  it('borne le rythme des parties classées', () => {
    expect(SQL).toMatch(/INTERVAL '1 hour'/)
  })

  it('n’ouvre aucune policy d’écriture sur les compteurs', () => {
    // Les trophées ne s'écrivent que par la RPC SECURITY DEFINER : une policy
    // INSERT/UPDATE sur game_trophies laisserait le client poser son compteur.
    const policies = SQL.match(/CREATE POLICY[\s\S]*?;/g) ?? []
    const writable = policies.filter(
      (p) => p.includes('game_trophies') && !/FOR SELECT/.test(p),
    )
    expect(writable).toEqual([])
  })

  it('verrouille la ligne avant de la modifier (deux parties simultanées)', () => {
    expect(SQL).toContain('FOR UPDATE')
  })

  it('garde le pic de l’ancienne saison avant de remettre à zéro', () => {
    expect(SQL).toContain('legacy_best_trophies')
    // La garde d'idempotence : rejouer la migration ne doit pas écraser le pic
    // conservé au premier passage par les zéros du nouveau barème.
    expect(SQL).toMatch(/WHERE legacy_best_trophies = 0/)
  })
})
