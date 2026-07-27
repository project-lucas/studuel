import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  parseMissingColumn,
  narrowColumns,
  readRowTolerant,
  resetMissingColumnsCache,
} from './profile-read'
import type { SupabaseClient } from '@supabase/supabase-js'

describe('parseMissingColumn', () => {
  it('extrait le nom de la colonne du message Postgres 42703', () => {
    expect(
      parseMissingColumn('column profiles.tutorial_completed does not exist'),
    ).toBe('tutorial_completed')
  })

  it('accepte le nom sans préfixe de table', () => {
    expect(parseMissingColumn('column oral_texts does not exist')).toBe(
      'oral_texts',
    )
  })

  it('renvoie null sur un message sans rapport', () => {
    expect(parseMissingColumn('permission denied for table profiles')).toBeNull()
    expect(parseMissingColumn(undefined)).toBeNull()
  })
})

describe('narrowColumns', () => {
  it('retire les colonnes connues absentes', () => {
    expect(narrowColumns(['a', 'b', 'c'], new Set(['b']))).toEqual(['a', 'c'])
  })

  it('ne touche à rien quand aucune colonne ne manque', () => {
    expect(narrowColumns(['a', 'b'], new Set())).toEqual(['a', 'b'])
  })
})

// Faux client Supabase : enregistre les colonnes demandées et simule une base
// où certaines colonnes n'existent pas encore (migration non exécutée).
function fakeClient(schema: Set<string>, row: Record<string, unknown>) {
  const asked: string[][] = []
  const client = {
    from: () => ({
      select: (cols: string) => {
        const list = cols.split(',')
        asked.push(list)
        const absent = list.find((c) => !schema.has(c))
        const result = absent
          ? { data: null, error: { message: `column profiles.${absent} does not exist` } }
          : {
              data: Object.fromEntries(list.map((c) => [c, row[c] ?? null])),
              error: null,
            }
        const chain = {
          eq: () => chain,
          maybeSingle: async () => result,
        }
        return chain
      },
    }),
  }
  return { client: client as unknown as SupabaseClient, asked }
}

describe('readRowTolerant', () => {
  beforeEach(() => {
    resetMissingColumnsCache()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('lit tout en UNE requête quand toutes les colonnes existent', async () => {
    const { client, asked } = fakeClient(new Set(['full_name', 'coins']), {
      full_name: 'Lucas',
      coins: 12,
    })
    const row = await readRowTolerant(client, 'profiles', 'id', 'u1', [
      'full_name',
      'coins',
    ])
    expect(row).toEqual({ full_name: 'Lucas', coins: 12 })
    expect(asked).toHaveLength(1)
  })

  it('retire la colonne manquante et renvoie le reste', async () => {
    const { client, asked } = fakeClient(new Set(['full_name']), {
      full_name: 'Lucas',
    })
    const row = await readRowTolerant(client, 'profiles', 'id', 'u1', [
      'full_name',
      'tutorial_completed',
    ])
    expect(row).toEqual({ full_name: 'Lucas' })
    expect(asked).toHaveLength(2)
    expect(asked[1]).toEqual(['full_name'])
  })

  it('ne repaie la reprise qu\'une fois : le 2e appel demande déjà le bon jeu', async () => {
    const schema = new Set(['full_name'])
    const first = fakeClient(schema, { full_name: 'Lucas' })
    await readRowTolerant(first.client, 'profiles', 'id', 'u1', [
      'full_name',
      'tutorial_completed',
    ])
    expect(first.asked).toHaveLength(2)

    const second = fakeClient(schema, { full_name: 'Lucas' })
    await readRowTolerant(second.client, 'profiles', 'id', 'u1', [
      'full_name',
      'tutorial_completed',
    ])
    expect(second.asked).toHaveLength(1)
    expect(second.asked[0]).toEqual(['full_name'])
  })

  it('retire plusieurs colonnes tardives successives', async () => {
    const { client } = fakeClient(new Set(['full_name']), { full_name: 'Lucas' })
    const row = await readRowTolerant(client, 'profiles', 'id', 'u1', [
      'full_name',
      'tutorial_completed',
      'season_title',
    ])
    expect(row).toEqual({ full_name: 'Lucas' })
  })

  it('dégrade proprement sur une erreur qui n\'est pas une colonne absente', async () => {
    const client = {
      from: () => ({
        select: () => {
          const chain = {
            eq: () => chain,
            maybeSingle: async () => ({
              data: null,
              error: { message: 'permission denied for table profiles' },
            }),
          }
          return chain
        },
      }),
    } as unknown as SupabaseClient
    expect(
      await readRowTolerant(client, 'profiles', 'id', 'u1', ['full_name']),
    ).toEqual({})
  })
})
