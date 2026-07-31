import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import {
  MIGRATIONS_SANTE,
  interpreterSonde,
  restantes,
  type Verdict,
} from '@/lib/sante'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

describe('MIGRATIONS_SANTE — le catalogue colle au dépôt', () => {
  it('chaque fichier listé existe dans supabase/', () => {
    const files = new Set(readdirSync(path.join(ROOT, 'supabase')))
    for (const m of MIGRATIONS_SANTE) {
      expect(files.has(m.fichier), `${m.fichier} introuvable`).toBe(true)
    }
  })

  it('couvre TOUTES les migrations en attente (188, 192 → 213), sans trou', () => {
    // La dette : 188 puis 192 → 213. Un numéro qui manque ici est une migration
    // que ni /admin/sante ni la sonde CLI ne surveillent — exactement le trou
    // silencieux que ce module existe pour fermer. La 209 est la reprise du
    // durcissement échoué dans 192→207 (déjà exécutées au 28/07), la 211 celle
    // des contrôles hérités de 087. La borne haute se lit sur le DÉPÔT, pas sur
    // un nombre écrit à la main : une migration ajoutée sans entrée ici fait
    // passer ce test au rouge (c'est ce qui était arrivé à la 213).
    const ids = MIGRATIONS_SANTE.map((m) => m.id).sort()
    const derniere = Math.max(
      ...readdirSync(path.join(ROOT, 'supabase'))
        .map((f) => Number(f.slice(0, 3)))
        .filter((n) => Number.isFinite(n) && n >= 192),
    )
    const attendues = [
      '188',
      ...Array.from({ length: derniere - 191 }, (_, i) => String(192 + i)),
    ].sort()
    expect(ids).toEqual(attendues)
  })

  it('la sonde CLI (_ASSOCIE/sonde-base.mjs) mentionne chaque migration', () => {
    // Le CLI ne peut pas importer ce module TS : il en tient une copie. Ce
    // test est le fil qui empêche la copie de dériver en silence.
    const cli = readFileSync(path.join(ROOT, '_ASSOCIE', 'sonde-base.mjs'), 'utf8')
    for (const m of MIGRATIONS_SANTE) {
      expect(cli.includes(m.id), `migration ${m.id} absente de la sonde CLI`).toBe(
        true,
      )
    }
  })

  it('une décision est bien posée sur la 193 (coquilles vides)', () => {
    const m193 = MIGRATIONS_SANTE.find((m) => m.id === '193')
    expect(m193?.decision).toBeTruthy()
  })
})

describe('interpreterSonde', () => {
  it('table absente = éteinte, table sous RLS vide = vivante', () => {
    const sonde = { type: 'table', table: 'user_wallet' } as const
    expect(interpreterSonde(sonde, { code: '42P01' }, 0)).toBe('eteinte')
    expect(interpreterSonde(sonde, null, 0)).toBe('vivante')
  })

  it('colonne absente = éteinte', () => {
    const sonde = {
      type: 'colonne',
      table: 'profiles',
      colonne: 'gamertag',
    } as const
    expect(interpreterSonde(sonde, { code: '42703' }, 0)).toBe('eteinte')
    expect(interpreterSonde(sonde, null, 1)).toBe('vivante')
  })

  it('RPC : PGRST202 = éteinte, « not authenticated » = vivante', () => {
    const sonde = { type: 'rpc', fn: 'profile_stats', args: {} } as const
    expect(interpreterSonde(sonde, { code: 'PGRST202' }, 0)).toBe('eteinte')
    // La fonction existe mais refuse l'anonyme : c'est une PREUVE de présence.
    expect(
      interpreterSonde(sonde, { code: 'P0001', message: 'not authenticated' }, 0),
    ).toBe('vivante')
    expect(interpreterSonde(sonde, null, 0)).toBe('vivante')
  })

  it('ligne : présence de données requise, pas seulement absence d’erreur', () => {
    const sonde = {
      type: 'ligne',
      table: 'subjects',
      colonne: 'slug',
      valeur: 'snt',
    } as const
    expect(interpreterSonde(sonde, null, 0)).toBe('eteinte')
    expect(interpreterSonde(sonde, null, 1)).toBe('vivante')
  })
})

describe('restantes', () => {
  it('écarte les vivantes, garde les éteintes ET les non sondables', () => {
    const verdicts = new Map<string, Verdict>(
      MIGRATIONS_SANTE.map((m) => [
        m.id,
        m.sonde === null ? 'non-sondable' : 'vivante',
      ]),
    )
    verdicts.set('204', 'eteinte')
    const restes = restantes(verdicts)
    const ids = restes.map((m) => m.id)
    expect(ids).toContain('204')
    // Les non sondables restent (rejeu idempotent par sécurité)…
    expect(ids).toContain('194')
    expect(ids).toContain('208')
    // …les vivantes sortent.
    expect(ids).not.toContain('188')
    expect(ids).not.toContain('192')
  })
})
