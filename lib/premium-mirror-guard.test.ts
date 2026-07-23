import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { canAccessMindMaps, type Tier } from './subscription'

// Garde du MIROIR SQL ↔ application des paliers premium.
//
// Le gate premium est écrit des deux côtés : en TypeScript (`PREMIUM_TIERS`
// dans lib/subscription.ts) et en SQL, dans chaque policy ou RPC qui revérifie
// l'abonnement côté serveur (le client n'est pas digne de confiance). Les
// listes doivent rester identiques : une divergence, et soit un abonné payant
// se voit refuser ce qu'il a acheté, soit un compte gratuit lit du contenu
// payant — dans les deux cas sans que rien ne casse ni qu'aucun test rougisse.
//
// ⚠️ Cette garde lisait UNE migration nommée en dur (la 181, pour la RPC
// `chapter_mind_map`). Or la 183 REDÉFINIT cette fonction (`CREATE OR
// REPLACE`) : la garde validait donc un corps qui n'est plus déployé, et
// modifier la 183 ne faisait rougir personne. Même famille de piège que le test
// à plancher constant des banques de jeu et que le `REVOKE` par colonne — un
// garde-fou qui ne peut pas échouer n'en est pas un.
//
// Elle balaye désormais TOUTES les migrations, ce qui la rend insensible aux
// redéfinitions comme aux ajouts (7 gates au 2026-07-23 : 002, 007, 181, 183×2,
// 184, 192).

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const MIGRATIONS_DIR = path.join(ROOT, 'supabase')

const ALL_TIERS: Tier[] = ['anonymous', 'free', 'tier1', 'tier2', 'tier3']

type Gate = { file: string; tiers: string[]; isDomain: boolean }

/**
 * Toutes les listes de paliers des migrations : toute énumération entre
 * parenthèses qui cite `tier1`. On ne cible aucune fonction en particulier —
 * c'est précisément ce ciblage qui avait rendu la garde aveugle.
 *
 * Deux natures à ne pas confondre :
 *  - le DOMAINE (`CHECK (subscription_tier IN (…))` du schéma) énumère les
 *    valeurs valides, `free` compris ;
 *  - un GATE (policy ou RPC) énumère les paliers qui DONNENT ACCÈS.
 * On les distingue par le mot-clé `CHECK` qui précède, pas par la présence de
 * `free` : un gate qui laisserait passer `free` serait sinon reclassé en
 * domaine et échapperait au contrôle — soit exactement le trou à surveiller.
 */
function tierListsInMigrations(): Gate[] {
  const gates: Gate[] = []
  const files = readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith('.sql'))
  for (const file of files) {
    const sql = readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8')
    for (const m of sql.matchAll(/\(\s*('[^)]*')\s*\)/g)) {
      const tiers = [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1])
      if (!tiers.includes('tier1')) continue
      const avant = sql.slice(Math.max(0, m.index - 60), m.index)
      gates.push({
        file,
        tiers: [...tiers].sort(),
        isDomain: /\bCHECK\b/i.test(avant),
      })
    }
  }
  return gates
}

const tierGatesInMigrations = (): Gate[] =>
  tierListsInMigrations().filter((g) => !g.isDomain)

describe('miroir SQL ↔ app du gate premium', () => {
  it('chaque gate SQL autorise EXACTEMENT les paliers de canAccessMindMaps', () => {
    const cotedApp = ALL_TIERS.filter((t) => canAccessMindMaps(t)).sort()
    const gates = tierGatesInMigrations()

    // Sans ce plancher, une regex cassée ferait passer le test avec ZÉRO gate
    // trouvé — exactement l'échec silencieux qu'on cherche à empêcher. C'est un
    // minimum, pas un compte exact : ajouter un gate renforce la garde au lieu
    // de la casser.
    expect(
      gates.length,
      'aucun gate de palier trouvé dans supabase/ : la garde ne garde plus rien',
    ).toBeGreaterThanOrEqual(7)

    for (const gate of gates) {
      expect(gate.tiers, `gate divergent dans ${gate.file}`).toEqual(cotedApp)
    }
  })

  it('le domaine SQL accepte exactement les paliers connus de l’app', () => {
    // `anonymous` est une notion applicative (pas connecté) : la base ne la
    // stocke jamais. Le reste doit correspondre, sinon un palier existe d'un
    // côté sans exister de l'autre.
    const domaines = tierListsInMigrations().filter((g) => g.isDomain)
    expect(domaines.length).toBeGreaterThanOrEqual(1)
    const attendu = ALL_TIERS.filter((t) => t !== 'anonymous').sort()
    for (const d of domaines) {
      expect(d.tiers, `domaine divergent dans ${d.file}`).toEqual(attendu)
    }
  })

  it('aucun palier gratuit ne passe, d’aucun des deux côtés', () => {
    for (const tier of ['free', 'anonymous'] as Tier[]) {
      expect(canAccessMindMaps(tier)).toBe(false)
    }
    for (const gate of tierGatesInMigrations()) {
      expect(gate.tiers, `gate trop permissif dans ${gate.file}`).not.toContain(
        'free',
      )
      expect(gate.tiers).not.toContain('anonymous')
    }
  })
})
