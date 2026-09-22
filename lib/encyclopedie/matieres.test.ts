import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { MATIERES_ENCYCLOPEDIE, aUneEncyclopedie, hrefEncyclopedie, hrefFiche } from './matieres'

describe('aUneEncyclopedie', () => {
  it('reconnaît la matière qui en a une', () => {
    expect(aUneEncyclopedie('histoire-geo')).toBe(true)
  })

  it('refuse les autres, et le vide', () => {
    expect(aUneEncyclopedie('maths')).toBe(false)
    expect(aUneEncyclopedie(null)).toBe(false)
    expect(aUneEncyclopedie(undefined)).toBe(false)
    expect(aUneEncyclopedie('')).toBe(false)
  })

  it('donne les adresses du rayon et d’une fiche', () => {
    expect(hrefEncyclopedie('histoire-geo')).toBe('/reviser/histoire-geo/encyclopedie')
    expect(hrefFiche('histoire-geo', 'jeanne-d-arc')).toBe(
      '/reviser/histoire-geo/encyclopedie/jeanne-d-arc',
    )
  })

  it('ne liste que des slugs de matière plausibles', () => {
    for (const slug of MATIERES_ENCYCLOPEDIE) {
      expect(slug).toMatch(/^[a-z0-9-]+$/)
    }
  })
})

// ---------------------------------------------------------------------------
// LE GARDE-FOU DU BUNDLE.
//
// Le corpus fait plus de deux méga-octets de texte. S'il partait dans le
// navigateur, l'encyclopédie coûterait à elle seule quarante fois le poids de
// supabase-js — et la règle du projet est explicite : un module `lib/*`
// importé par un composant CLIENT ne tire ni `lib/catalog` ni `lib/supabase`
// (CLAUDE.md). `lib/encyclopedie/contenu` est de cette famille-là.
//
// Ce test le vérifie sur le disque plutôt que de faire confiance : c'est le
// genre de régression qu'un import ajouté « juste pour afficher un nom »
// introduit en silence, et qu'on ne voit qu'en mesurant.
// ---------------------------------------------------------------------------

function fichiersSous(dossier: string): string[] {
  const trouves: string[] = []
  for (const entree of readdirSync(dossier, { withFileTypes: true })) {
    const chemin = join(dossier, entree.name)
    if (entree.isDirectory()) trouves.push(...fichiersSous(chemin))
    else if (/\.(ts|tsx)$/.test(entree.name)) trouves.push(chemin)
  }
  return trouves
}

describe('le corpus ne descend pas dans le navigateur', () => {
  it('aucun composant client n’importe lib/encyclopedie/contenu', () => {
    const coupables: string[] = []
    for (const chemin of fichiersSous('components')) {
      const source = readFileSync(chemin, 'utf8')
      const estClient = /^\s*['"]use client['"]/.test(source)
      if (estClient && source.includes('@/lib/encyclopedie/contenu')) {
        coupables.push(chemin)
      }
    }
    expect(coupables).toEqual([])
  })

  it('le module des matières reste sans dépendance', () => {
    // Il est lu par la barre d'onglets du dossier, donc par du client : tout ce
    // qu'il importerait partirait dans le bundle de TOUTES les matières.
    const source = readFileSync('lib/encyclopedie/matieres.ts', 'utf8')
    expect(source).not.toMatch(/^\s*import\s/m)
  })
})
