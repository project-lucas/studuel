import { describe, it, expect } from 'vitest'
import { parseNiveau } from '@/lib/francais/niveau-store'

// Le stockage local est éditable par n'importe qui depuis la console du
// navigateur. Ce que ces tests gardent : rien d'inattendu ne ressort de
// `parseNiveau` — un pourcentage à 900 ou un palier inventé s'afficheraient
// tels quels sur la carte de l'onglet Mode de jeu.

const bon = { pourcentage: 78, niveau: 'confirme', jour: '2026-08-23' }

describe('parseNiveau', () => {
  it('relit un instantané valide', () => {
    expect(parseNiveau(JSON.stringify(bon))).toEqual(bon)
  })

  it('rend null sur du vide ou du JSON cassé', () => {
    expect(parseNiveau(null)).toBeNull()
    expect(parseNiveau('')).toBeNull()
    expect(parseNiveau('{pas du json')).toBeNull()
    expect(parseNiveau('"une chaîne"')).toBeNull()
  })

  it('refuse un pourcentage hors bornes', () => {
    for (const p of [-1, 101, 900, NaN, Infinity]) {
      expect(parseNiveau(JSON.stringify({ ...bon, pourcentage: p }))).toBeNull()
    }
  })

  it('refuse une date qui n’est pas une clé de jour', () => {
    for (const j of ['hier', '23/08/2026', '2026-8-3', 42, null]) {
      expect(parseNiveau(JSON.stringify({ ...bon, jour: j }))).toBeNull()
    }
  })

  it('ramène un palier inventé à null sans jeter le reste', () => {
    // Le pourcentage et la date restent lisibles : on perd le calibrage, pas
    // le score que l'élève a sous les yeux.
    const r = parseNiveau(JSON.stringify({ ...bon, niveau: 'legendaire' }))
    expect(r).toEqual({ ...bon, niveau: null })
  })

  it('arrondit un pourcentage flottant', () => {
    expect(parseNiveau(JSON.stringify({ ...bon, pourcentage: 77.8 }))
      ?.pourcentage).toBe(78)
  })
})
