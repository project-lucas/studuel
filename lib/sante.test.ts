import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import {
  MIGRATIONS_SANTE,
  interpreterSonde,
  PERMISSION_DENIED,
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

  it('couvre TOUTES les migrations du dépôt (187 → 189, puis 192 et au-delà)', () => {
    // La dette : 188 puis 192 → 213. Un numéro qui manque ici est une migration
    // que ni /admin/sante ni la sonde CLI ne surveillent — exactement le trou
    // silencieux que ce module existe pour fermer. La 209 est la reprise du
    // durcissement échoué dans 192→207 (déjà exécutées au 28/07), la 211 celle
    // des contrôles hérités de 087. La borne haute se lit sur le DÉPÔT, pas sur
    // un nombre écrit à la main : une migration ajoutée sans entrée ici fait
    // passer ce test au rouge (c'est ce qui était arrivé à la 213).
    const ids = MIGRATIONS_SANTE.map((m) => m.id).sort()
    // La liste attendue se lit sur les FICHIERS présents, et non sur la plage
    // 192→dernière : une migration écrite puis ABANDONNÉE (la 235, les six axes
    // d'anglais, remplacée par la 243) laisse un trou de numérotation qui est
    // volontaire. Ce qui doit rester vrai, c'est qu'aucun fichier du dépôt
    // n'échappe à la surveillance.
    const duDepot = readdirSync(path.join(ROOT, 'supabase'))
      .map((f) => Number(f.slice(0, 3)))
      .filter((n) => Number.isFinite(n) && n >= 192)
      .map(String)
    // 187 et 189 ont rejoint le catalogue le 01/08/2026 : elles étaient
    // sondables (term_grades, avatar_items) et pourtant hors surveillance —
    // l'audit du 31/07 relevait justement que « leur état réel est inconnu ».
    // 190 et 191 restent dehors : ce sont des seeds de contenu déjà en base
    // (leurs matières répondent), pas de la dette.
    const attendues = ['187', '188', '189', ...duDepot].sort()
    expect(ids).toEqual(attendues)
  })

  // `_ASSOCIE/` est gitignoré : la copie CLI de la sonde vit en local (là où
  // Lucas et l'agent la maintiennent), pas dans le dépôt. Sur un clone frais
  // le fichier est absent — on SAUTE plutôt que de jeter (ENOENT ferait tomber
  // toute la suite). Le garde anti-dérive reste actif partout où la sonde existe.
  const sondeCli = path.join(ROOT, '_ASSOCIE', 'sonde-base.mjs')
  it.skipIf(!existsSync(sondeCli))('la sonde CLI (_ASSOCIE/sonde-base.mjs) mentionne chaque migration', () => {
    // Le CLI ne peut pas importer ce module TS : il en tient une copie. Ce
    // test est le fil qui empêche la copie de dériver en silence.
    const cli = readFileSync(sondeCli, 'utf8')
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

describe('interpreterSonde — « accès refusé » n’est pas « absente »', () => {
  // Le bug du 26/08/2026. Toute erreur était lue comme « éteinte », si bien que
  // la sonde déclarait mortes précisément les migrations dont les tables sont
  // les mieux protégées — celles qui n'accordent AUCUN GRANT à `anon`, par
  // conception : journal d'envoi push, quota d'appels IA, intentions de
  // paiement. Les trois étaient en base depuis des semaines.
  it('rend « vivante » sur un 42501 : la table est là, on n’y a pas accès', () => {
    const sonde = { type: 'table', table: 'ai_call_attempts' } as const
    expect(interpreterSonde(sonde, { code: PERMISSION_DENIED }, 0)).toBe('vivante')
  })

  it('rend « vivante » sur un 42501 de colonne', () => {
    const sonde = { type: 'colonne', table: 'push_send_log', colonne: 'sent_on' } as const
    expect(interpreterSonde(sonde, { code: PERMISSION_DENIED }, 0)).toBe('vivante')
  })

  it('distingue toujours 42501 de 42P01 (relation absente)', () => {
    const sonde = { type: 'table', table: 'parent_prefs' } as const
    expect(interpreterSonde(sonde, { code: '42P01' }, 0)).toBe('eteinte')
    expect(interpreterSonde(sonde, { code: 'PGRST205' }, 0)).toBe('eteinte')
  })

  it('rend « non-sondable » sur une sonde de LIGNE refusée', () => {
    // La sonde 'ligne' ne demande pas « la table existe » mais « cette ligne y
    // est ». Un accès refusé ne répond pas à cette question : on ne conclut pas.
    const sonde = {
      type: 'ligne',
      table: 'chapters',
      colonne: 'theme',
      valeur: 'Internet',
    } as const
    expect(interpreterSonde(sonde, { code: PERMISSION_DENIED }, 0)).toBe(
      'non-sondable',
    )
  })
})
