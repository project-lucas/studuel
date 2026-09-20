import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import { categorieObjet, normaliserObjetsProfil } from './objets-profil'
import { cheminMigration } from '@/lib/migrations-lecture'

const ligne = (patch: Record<string, unknown>) => ({
  id: 'banner-cosmos',
  category: 'banner',
  name: 'Cosmos studieux',
  asset_key: 'cosmos',
  prix_gemmes: 200,
  ...patch,
})

describe('categorieObjet', () => {
  it('range bannières, tenues et accessoires', () => {
    expect(categorieObjet('banner')).toBe('banniere')
    expect(categorieObjet('outfit')).toBe('tenue')
    expect(categorieObjet('equipment')).toBe('accessoire')
  })

  it('refuse les rayons qui ne se vendent pas en gemmes', () => {
    expect(categorieObjet('hair_style')).toBeNull()
    expect(categorieObjet('body_skin')).toBeNull()
    expect(categorieObjet(null)).toBeNull()
    // Pas de fuite par le prototype.
    expect(categorieObjet('toString')).toBeNull()
  })
})

describe('normaliserObjetsProfil', () => {
  it('lit les lignes et marque ce que l’élève possède', () => {
    const objets = normaliserObjetsProfil(
      [ligne({}), ligne({ id: 'equip-casque', category: 'equipment', name: 'Casque audio', prix_gemmes: 180 })],
      new Set(['equip-casque']),
    )
    expect(objets).toEqual([
      { id: 'equip-casque', categorie: 'accessoire', nom: 'Casque audio', image: null, cle: 'cosmos', prixGemmes: 180, possede: true },
      { id: 'banner-cosmos', categorie: 'banniere', nom: 'Cosmos studieux', image: null, cle: 'cosmos', prixGemmes: 200, possede: false },
    ])
  })

  it('écarte les lignes illisibles', () => {
    const objets = normaliserObjetsProfil(
      [
        ligne({ id: '' }),
        ligne({ name: '  ' }),
        ligne({ category: 'hair_style' }),
        ligne({ prix_gemmes: null }),
        ligne({ prix_gemmes: -5 }),
        ligne({ prix_gemmes: '100' }),
        null,
        'x',
      ],
      new Set(),
    )
    expect(objets).toEqual([])
  })

  it('rend une liste vide sur une réponse qui n’est pas un tableau', () => {
    expect(normaliserObjetsProfil(null, new Set())).toEqual([])
    expect(normaliserObjetsProfil({}, new Set())).toEqual([])
  })

  it('trie du moins cher au plus cher, puis par nom', () => {
    const objets = normaliserObjetsProfil(
      [
        ligne({ id: 'b', name: 'Zèbre', prix_gemmes: 100 }),
        ligne({ id: 'c', name: 'Aube', prix_gemmes: 300 }),
        ligne({ id: 'a', name: 'Écume', prix_gemmes: 100 }),
      ],
      new Set(),
    )
    expect(objets.map((o) => o.id)).toEqual(['a', 'b', 'c'])
  })
})

describe('les six objets en gemmes de la migration 368', () => {
  it('sont des bannières, tenues et accessoires qui existent au vestiaire', () => {
    const sql = readFileSync(cheminMigration('368_boutique_gemmes.sql'), 'utf8')
    const bloc = sql.slice(sql.indexOf('-- LES SIX OBJETS'), sql.indexOf('-- FIN DES SIX OBJETS'))
    const ids = [...bloc.matchAll(/\('([a-z0-9-]+)',\s*(\d+)\)/g)].map((m) => [m[1], Number(m[2])] as const)
    expect(ids).toHaveLength(6)
    for (const [, prix] of ids) {
      expect(prix).toBeGreaterThanOrEqual(100)
      expect(prix).toBeLessThanOrEqual(400)
    }
    // Chaque id est seedé par une migration du vestiaire (189, 200, 240).
    const vestiaire = ['189_avatar_vestiaire.sql', '200_profil_defi.sql', '240_vestiaire_open_peeps.sql']
      .map((f) => readFileSync(cheminMigration(f), 'utf8'))
      .join('\n')
    for (const [id] of ids) {
      expect(vestiaire, `${id} n'est seedé par aucune migration du vestiaire`).toContain(`('${id}',`)
    }
  })
})
