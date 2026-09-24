import { existsSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { NAV_TABS, cheminAffiche, ongletVivant, tabIndexForPath } from './nav-tabs'

/** Les illustrations servies par la barre d'onglets, depuis la racine du dépôt. */
const NAV_DIR = path.join(import.meta.dirname, '..', 'public', 'images', 'nav')

describe('tabIndexForPath', () => {
  it('reconnaît un onglet exact', () => {
    expect(tabIndexForPath('/defi')).toBe(2)
  })

  it('reconnaît une sous-page comme appartenant à son onglet', () => {
    expect(tabIndexForPath('/defi/jeux')).toBe(2)
  })

  it('renvoie -1 hors des onglets principaux', () => {
    expect(tabIndexForPath('/compte')).toBe(-1)
  })

  it('ne confond pas un préfixe partiel avec un onglet', () => {
    expect(tabIndexForPath('/amistad')).toBe(-1)
  })
})

describe('NAV_TABS', () => {
  it('compte 5 onglets (Coffre a fusionné dans Trésor, Marcel n’en est plus un)', () => {
    expect(NAV_TABS).toHaveLength(5)
    expect(NAV_TABS.some((tab) => tab.path === '/coffre')).toBe(false)
  })

  it('n’a plus d’onglet Marcel — le coach se rejoint depuis Réviser', () => {
    // Sa tête est un bouton flottant sur /reviser
    // (components/reviser/MarcelFab). Rendre l'onglet ici ferait DEUX portes
    // pour la même page, et remettrait la barre à six destinations.
    expect(NAV_TABS.some((tab) => tab.path === '/marcel')).toBe(false)
  })

  it('range les onglets comme Clash Royale, du bord vers le pouce', () => {
    // L'ordre n'est pas un plan de l'app, c'est une ERGONOMIE : la boutique au
    // bord (on y va avec une intention), Réviser et Amis collés au Défi (les
    // deux moitiés de la boucle, à un balayage), Moi au coin le moins
    // accessible. Verrouillé en entier parce que c'est justement le genre de
    // décision qu'un futur ajout d'onglet défait sans s'en rendre compte.
    expect(NAV_TABS.map((tab) => tab.path)).toEqual([
      '/tresor',
      '/reviser',
      '/defi',
      '/amis',
      '/moi',
    ])
  })

  it('donne au Défi ses deux voisins : Réviser à gauche, Amis à droite', () => {
    // « Je révise » puis « je me mesure » d'un côté, le classement de l'autre :
    // les deux écrans que l'atterrissage doit rendre gratuits.
    const paths = NAV_TABS.map((tab) => tab.path)
    expect(paths.indexOf('/defi')).toBe(paths.indexOf('/reviser') + 1)
    expect(paths.indexOf('/amis')).toBe(paths.indexOf('/defi') + 1)
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

  it('n’a qu’un seul onglet central', () => {
    expect(NAV_TABS.filter((tab) => tab.center)).toHaveLength(1)
  })

  it('ne réutilise jamais deux fois la même icône', () => {
    const icons = NAV_TABS.map((tab) => tab.icon)
    expect(new Set(icons).size).toBe(icons.length)
  })
})


describe('cheminAffiche', () => {
  it('suit l’URL quand aucun onglet n’a été touché', () => {
    expect(cheminAffiche('/defi', null)).toBe('/defi')
  })

  it('montre l’onglet touché avant que l’URL ne change', () => {
    expect(cheminAffiche('/defi', { cible: '/reviser', depuis: '/defi' })).toBe('/reviser')
  })

  it('rend la main à l’URL dès qu’elle a bougé', () => {
    const vise = { cible: '/reviser', depuis: '/defi' }
    expect(cheminAffiche('/reviser', vise)).toBe('/reviser')
    // Arrivé ailleurs entre-temps (un lien dans la page) : l’URL l’emporte.
    expect(cheminAffiche('/amis', vise)).toBe('/amis')
  })

  it('vaut aussi depuis une sous-page', () => {
    expect(cheminAffiche('/reviser/maths', { cible: '/defi', depuis: '/reviser/maths' })).toBe('/defi')
  })
})

describe('ongletVivant', () => {
  it('reconnaît la racine exacte de chaque onglet', () => {
    for (const tab of NAV_TABS) expect(ongletVivant(tab.path)).toBe(tab.path)
  })

  it('ne prend pas une sous-page pour l’onglet : elle vit dans la page ordinaire', () => {
    expect(ongletVivant('/reviser/maths')).toBeNull()
    expect(ongletVivant('/defi/jouer')).toBeNull()
    expect(ongletVivant('/moi/avatar')).toBeNull()
  })

  it('renvoie null hors des onglets', () => {
    expect(ongletVivant('/')).toBeNull()
    expect(ongletVivant('/marcel')).toBeNull()
    expect(ongletVivant('/defis')).toBeNull()
  })
})
