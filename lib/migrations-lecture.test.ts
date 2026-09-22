import { describe, expect, it, vi } from 'vitest'
import {
  derniereDefinition,
  derniereOccurrence,
  migrationSql,
  migrationsDansLOrdre,
  migrationsQuiCollent,
  nomsDesMigrations,
} from '@/lib/migrations-lecture'

// Ces gardes relisent les 22 Mo de `supabase/` : sous charge (un serveur de dev
// qui compile à côté), les 5 s par défaut de Vitest ne suffisent pas et le test
// échoue pour une raison qui n'a rien à voir avec ce qu'il garde. Un garde qui
// échoue au hasard finit par être relancé jusqu'au vert, donc ignoré.
vi.setConfig({ testTimeout: 30_000 })

// Ce module n'existe que pour une raison : les gardes « miroir » relisaient
// chacune, à CHAQUE assertion, les 21 Mo de `supabase/`. La suite rendait 2 à
// 4 échecs de délai DIFFÉRENTS d'un lancement à l'autre — un filet qui échoue
// au hasard ne garde plus rien. Ces tests fixent le contrat qui rend les
// gardes déterministes : on lit une fois, on cherche une fois.

describe('lecture des migrations', () => {
  it('rend les migrations triées par numéro, `schema.sql` en tête', () => {
    const noms = migrationsDansLOrdre().map((m) => m.file)
    expect(noms.length).toBeGreaterThan(300)
    // `schema.sql` est la BASE : il passe avant la 002. Il venait après la 374
    // (tri alphabétique), si bien qu'une recherche de « dernière définition »
    // (`handle_new_user`…) aurait rendu sa version, la plus ancienne.
    expect(noms[0]).toBe('schema.sql')
    const numerotees = noms.slice(1)
    expect([...numerotees]).toEqual([...numerotees].sort())
  })

  it('lit les migrations où qu’elles soient rangées (schema/, contenu/)', () => {
    const noms = migrationsDansLOrdre().map((m) => m.file)
    expect(noms).toContain('008_reviser.sql')
    expect(noms).toContain('216_contenu_emc_sport.sql')
    expect(noms.some((n) => n.startsWith('_'))).toBe(false)
  })

  it('ne lit le dossier QU’UNE FOIS', () => {
    // L'identité de l'objet est le contrat : si un appel relisait le disque,
    // il rendrait un tableau neuf et les gardes repayeraient les 21 Mo.
    expect(migrationsDansLOrdre()).toBe(migrationsDansLOrdre())
  })

  it('liste les noms sans exiger le contenu', () => {
    expect(nomsDesMigrations()).toEqual(migrationsDansLOrdre().map((m) => m.file))
  })

  it('rend le contenu d’une migration nommée, et refuse un nom inconnu', () => {
    expect(migrationSql('schema.sql')).toContain('CREATE TABLE')
    expect(() => migrationSql('999_inexistante.sql')).toThrow(/introuvable/)
  })

  it('filtre par motif de NOM', () => {
    const contenu = migrationsQuiCollent(/^3\d\d_contenu_/)
    expect(contenu.length).toBeGreaterThan(0)
    expect(contenu.every((m) => /^3\d\d_contenu_/.test(m.file))).toBe(true)
  })
})

describe('la DERNIÈRE écriture gagne', () => {
  it('rend la dernière migration qui définit une fonction', () => {
    // `traque_credit` est créée par la 212 puis REMPLACÉE par la 213 : ce que
    // la base applique est la 213. Une garde qui lirait la première trouvée
    // vérifierait un barème que plus personne n'exécute.
    const def = derniereDefinition('traque_credit')
    expect(def).not.toBeNull()
    const toutes = migrationsDansLOrdre()
      .filter((m) => m.sql.includes('FUNCTION public.traque_credit'))
      .map((m) => m.file)
    expect(toutes.length).toBeGreaterThan(1)
    expect(def!.file).toBe(toutes.at(-1))
  })

  it('rend null pour une fonction qui n’existe pas', () => {
    expect(derniereDefinition('fonction_qui_n_existe_pas')).toBeNull()
  })

  it('mémoïse aussi la RECHERCHE, motif par motif', () => {
    const re = /FUNCTION public\.traque_seuil\(\)[\s\S]*?SELECT (\d+)/
    const a = derniereOccurrence(re)
    expect(a).not.toBeNull()
    // Même source, objet RegExp différent : le cache doit répondre quand même,
    // sinon dix-huit recherches rebalayent dix-huit fois le corpus.
    expect(derniereOccurrence(new RegExp(re.source))).toBe(a)
  })

  it('rend null quand le motif ne colle nulle part', () => {
    expect(derniereOccurrence(/MOTIF_ABSENT_DES_MIGRATIONS_XYZ/)).toBeNull()
  })
})
