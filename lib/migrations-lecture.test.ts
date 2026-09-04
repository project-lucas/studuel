import { describe, expect, it } from 'vitest'
import {
  derniereDefinition,
  derniereOccurrence,
  migrationSql,
  migrationsDansLOrdre,
  migrationsQuiCollent,
  nomsDesMigrations,
} from '@/lib/migrations-lecture'

// Ce module n'existe que pour une raison : les gardes « miroir » relisaient
// chacune, à CHAQUE assertion, les 21 Mo de `supabase/`. La suite rendait 2 à
// 4 échecs de délai DIFFÉRENTS d'un lancement à l'autre — un filet qui échoue
// au hasard ne garde plus rien. Ces tests fixent le contrat qui rend les
// gardes déterministes : on lit une fois, on cherche une fois.

describe('lecture des migrations', () => {
  it('rend les migrations triées par numéro', () => {
    const noms = migrationsDansLOrdre().map((m) => m.file)
    expect(noms.length).toBeGreaterThan(300)
    expect([...noms]).toEqual([...noms].sort())
    // `schema.sql` n'a pas de numéro : il vient après, et c'est sans effet ici
    // (personne ne l'écrase, il ne redéfinit aucune RPC de barème).
    expect(noms).toContain('schema.sql')
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
