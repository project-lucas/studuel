import { existsSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { NAV_TABS, neighborTabPath, tabIndexForPath } from './nav-tabs'

/** Les illustrations servies par la barre d'onglets, depuis la racine du dépôt. */
const NAV_DIR = path.join(import.meta.dirname, '..', 'public', 'images', 'nav')

describe('tabIndexForPath', () => {
  it('reconnaît un onglet exact', () => {
    expect(tabIndexForPath('/defi')).toBe(3)
  })

  it('reconnaît une sous-page comme appartenant à son onglet', () => {
    expect(tabIndexForPath('/defi/jeux')).toBe(3)
  })

  it('renvoie -1 hors des onglets principaux', () => {
    expect(tabIndexForPath('/compte')).toBe(-1)
  })

  it('ne confond pas un préfixe partiel avec un onglet', () => {
    expect(tabIndexForPath('/amistad')).toBe(-1)
  })
})

describe('NAV_TABS', () => {
  it('compte 6 onglets (Coffre a fusionné dans Trésor, Marcel s’est ajouté)', () => {
    expect(NAV_TABS).toHaveLength(6)
    expect(NAV_TABS.some((tab) => tab.path === '/coffre')).toBe(false)
    expect(NAV_TABS.some((tab) => tab.path === '/marcel')).toBe(true)
  })

  it('pose Marcel juste à gauche du Défi, à droite de Réviser', () => {
    // Marcel dit quoi faire et pourquoi, Réviser est l'endroit où on le fait :
    // on passe de l'un à l'autre en permanence, ils doivent se toucher.
    const paths = NAV_TABS.map((tab) => tab.path)
    expect(paths.indexOf('/marcel')).toBe(paths.indexOf('/reviser') + 1)
    expect(paths.indexOf('/marcel')).toBe(paths.indexOf('/defi') - 1)
  })

  it('donne une icône à chaque onglet', () => {
    for (const tab of NAV_TABS) {
      expect(tab.icon, tab.name).toBeTruthy()
    }
  })

  it('nomme chaque icône comme son onglet', () => {
    // Garde-fou contre la confusion qui avait cours dans public/images/nav :
    // deux fichiers voisins, `ami.webp` et `amis.webp`, pour des dessins sans
    // rapport. Tant que la clé d'icône est le chemin de l'onglet, on ne peut
    // plus se tromper de dessin.
    for (const tab of NAV_TABS) {
      expect(tab.icon, tab.name).toBe(tab.path.slice(1))
    }
  })

  it('a bien, sur le disque, le fichier de chaque onglet', () => {
    // La barre est le premier chrome de l'app : une icône manquante n'y fait pas
    // planter le rendu, elle y laisse un TROU — et ça ne se découvre qu'à l'œil,
    // en prod. Les dessins sont régénérés par `scripts/nav-icones.mjs` à partir
    // d'originaux LOCAUX (assets-sources/ est dans .gitignore) : c'est
    // exactement le genre de chaîne où un fichier peut ne jamais être commité.
    for (const tab of NAV_TABS) {
      const chemin = path.join(NAV_DIR, `${tab.icon}.webp`)
      expect(existsSync(chemin), chemin).toBe(true)
    }
  })

  it('a le cadre de laurier qui entoure l’avatar', () => {
    // Sans lui l'onglet Moi ne casse pas non plus : il montre juste un visage nu
    // et minuscule (58 % de sa case, la taille du trou du cadre) au milieu de
    // cinq objets peints. Un défaut discret, donc à verrouiller.
    expect(existsSync(path.join(NAV_DIR, 'cadre-avatar.webp'))).toBe(true)
  })

  it('n’a qu’un seul onglet central', () => {
    expect(NAV_TABS.filter((tab) => tab.center)).toHaveLength(1)
  })

  it('ne réutilise jamais deux fois la même icône', () => {
    const icons = NAV_TABS.map((tab) => tab.icon)
    expect(new Set(icons).size).toBe(icons.length)
  })
})

describe('neighborTabPath', () => {
  it('balayer vers la gauche avance vers l’onglet de droite', () => {
    expect(neighborTabPath('/defi', 'left')).toBe('/moi')
  })

  it('balayer vers la droite recule vers l’onglet de gauche', () => {
    expect(neighborTabPath('/defi', 'right')).toBe('/marcel')
  })

  it('s’arrête au premier onglet', () => {
    expect(neighborTabPath(NAV_TABS[0].path, 'right')).toBeNull()
  })

  it('s’arrête au dernier onglet', () => {
    expect(neighborTabPath(NAV_TABS[NAV_TABS.length - 1].path, 'left')).toBeNull()
  })

  it('ne fait rien hors des onglets principaux', () => {
    expect(neighborTabPath('/compte', 'left')).toBeNull()
  })
})
