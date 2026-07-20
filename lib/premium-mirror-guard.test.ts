import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { canAccessMindMaps, type Tier } from './subscription'

// Garde du MIROIR SQL ↔ application des paliers premium.
//
// Le gate des cartes mentales est écrit DEUX fois : en TypeScript
// (`PREMIUM_TIERS` dans lib/subscription.ts) et en SQL (la RPC
// `chapter_mind_map`, migration 181, qui revérifie l'abonnement côté serveur
// puisque le client n'est pas digne de confiance). Les deux listes doivent
// rester identiques.
//
// Ce projet s'est déjà fait prendre par des miroirs divergents (deux échelles
// de paliers concurrentes, `8bd76f8`). Une divergence ici serait pire que
// visible : soit un abonné payant se voit refuser ce qu'il a acheté, soit un
// gratuit lit du contenu payant — et dans les deux cas rien ne casse, aucun
// test ne rougit. D'où cette garde, qui lit la migration réelle.

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const MIGRATION = path.join(ROOT, 'supabase', '181_cartes_mentales_acces.sql')

const ALL_TIERS: Tier[] = ['anonymous', 'free', 'tier1', 'tier2', 'tier3']

// Les paliers cités par le `NOT IN (...)` du gate de la RPC.
function tiersFromMigration(): string[] {
  const sql = readFileSync(MIGRATION, 'utf8')
  const gate = sql.match(/v_tier\s+NOT\s+IN\s*\(([^)]*)\)/i)
  if (!gate) throw new Error('Gate de tier introuvable dans la migration 181')
  return [...gate[1].matchAll(/'([^']+)'/g)].map((m) => m[1]).sort()
}

describe('miroir SQL ↔ app du gate premium', () => {
  it('la RPC 181 autorise EXACTEMENT les mêmes paliers que canAccessMindMaps', () => {
    const cotedApp = ALL_TIERS.filter((t) => canAccessMindMaps(t)).sort()

    expect(tiersFromMigration()).toEqual(cotedApp)
  })

  it('aucun palier gratuit ne passe, d’aucun des deux côtés', () => {
    const sql = tiersFromMigration()
    for (const tier of ['free', 'anonymous'] as Tier[]) {
      expect(canAccessMindMaps(tier)).toBe(false)
      expect(sql).not.toContain(tier)
    }
  })
})
