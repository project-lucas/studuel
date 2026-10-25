import { describe, expect, it, vi } from 'vitest'
import { migrationSql } from '@/lib/migrations-lecture'
import { DECOUVERTES } from '@/lib/decouverte/catalogue'

// Le garde relit `supabase/` : sous charge, les 5 s par défaut ne suffisent pas.
vi.setConfig({ testTimeout: 30_000 })

// La migration 601 RECOPIE la liste des clés du catalogue dans
// `decouverte_marquer` : une clé ajoutée au catalogue et oubliée en SQL
// rendrait « inconnue » pour toujours. Ce test relit le fichier.
describe('miroir de la 601', () => {
  const sql = migrationSql('601_decouvertes.sql')

  it('decouverte_marquer accepte exactement les clés du catalogue, dans le même ordre', () => {
    const bloc = /NOT IN \(([\s\S]*?)\)\s*THEN/.exec(sql)
    expect(bloc).not.toBeNull()
    const clesSql = Array.from(bloc![1].matchAll(/'([a-z-]+)'/g), (m) => m[1])
    expect(clesSql).toEqual(DECOUVERTES.map((d) => d.cle))
  })

  it('pose decouverte_depuis en DEFAULT now() puis remet les anciens profils à NULL', () => {
    expect(sql).toMatch(/ADD COLUMN decouverte_depuis TIMESTAMPTZ DEFAULT now\(\)/)
    expect(sql).toMatch(/UPDATE public\.profiles SET decouverte_depuis = NULL/)
  })

  it('n’ouvre aucune écriture directe sur decouvertes', () => {
    expect(sql).toMatch(/GRANT SELECT ON TABLE public\.decouvertes TO authenticated/)
    expect(sql).not.toMatch(/GRANT (INSERT|UPDATE|DELETE|ALL) ON TABLE public\.decouvertes/)
    expect(sql).toMatch(/ON DELETE CASCADE/)
  })
})
