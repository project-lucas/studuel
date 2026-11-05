import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import {
  CASCADE,
  ECLATS,
  FENETRE,
  FUMEE,
  HIBOU,
  NUAGES,
  OISEAUX,
  POUSSIERES,
  doitJouerLaVideo,
  enPourcentDePlanche,
} from './arena-fenetre'

const ICI = path.dirname(fileURLToPath(import.meta.url))
const CSS = readFileSync(path.join(ICI, '..', 'components', 'defi', 'FenetreVivante.module.css'), 'utf8')

describe('la géométrie de la fenêtre', () => {
  it('pose la boîte de la vue autour de l’ouverture, avec une marge de chaque côté', () => {
    const { vue, ouverture } = FENETRE
    expect(vue.x).toBeLessThan(ouverture.gauche)
    expect(vue.x + vue.l).toBeGreaterThan(ouverture.droite)
    expect(vue.y).toBeLessThan(ouverture.sommet)
    expect(vue.y + vue.h).toBeGreaterThan(ouverture.appui)
  })

  it('garde la boîte de la vue au rapport de l’affiche et de la vidéo (974 × 1530)', () => {
    expect(FENETRE.vue.l / FENETRE.vue.h).toBeCloseTo(974 / 1530, 3)
  })

  it('traduit une zone de la planche en pourcentages', () => {
    expect(enPourcentDePlanche({ x: 0, y: 0, l: 768, h: 1376 })).toEqual({
      left: '0%',
      top: '0%',
      width: '100%',
      height: '100%',
    })
    expect(enPourcentDePlanche({ x: 384, y: 688, l: 192, h: 344 })).toEqual({
      left: '50%',
      top: '50%',
      width: '25%',
      height: '25%',
    })
  })
})

describe('la vue', () => {
  it('reste FIXE : ni dérive ni parallaxe sur sa boîte (Lucas, 05/11/2026)', () => {
    // Le corps de la règle `.nom { … }` du module CSS.
    const regle = (nom: string) => new RegExp(`\\.${nom}\\s*\\{([^}]*)\\}`).exec(CSS)?.[1] ?? null
    for (const nom of ['boite', 'vue', 'proche']) {
      const corps = regle(nom)
      expect(corps, nom).not.toBeNull()
      expect(corps).not.toMatch(/animation|transform|will-change/)
    }
    expect(CSS).not.toMatch(/@keyframes derive/)
  })
})

describe('la vidéo de la vue', () => {
  it('joue par défaut, même quand le navigateur ne dit rien du réseau', () => {
    expect(doitJouerLaVideo({ mouvementReduit: false, economieDeDonnees: false })).toBe(true)
    expect(doitJouerLaVideo({ mouvementReduit: false, economieDeDonnees: false, reseau: '4g' })).toBe(true)
    expect(doitJouerLaVideo({ mouvementReduit: false, economieDeDonnees: false, reseau: '3g' })).toBe(true)
  })

  it('ne se charge ni en mouvement réduit, ni en économie de données, ni en 2G', () => {
    expect(doitJouerLaVideo({ mouvementReduit: true, economieDeDonnees: false })).toBe(false)
    expect(doitJouerLaVideo({ mouvementReduit: false, economieDeDonnees: true })).toBe(false)
    expect(doitJouerLaVideo({ mouvementReduit: false, economieDeDonnees: false, reseau: '2g' })).toBe(false)
    expect(doitJouerLaVideo({ mouvementReduit: false, economieDeDonnees: false, reseau: 'slow-2g' })).toBe(false)
  })
})

describe('la vie légère', () => {
  const dansLaVue = (x: number, y: number) => x >= 0 && x <= 100 && y >= 0 && y <= 100

  it('pose chaque élément dans la vue, avec une durée positive', () => {
    for (const e of ECLATS) {
      expect(dansLaVue(e.x, e.y)).toBe(true)
      expect(e.duree).toBeGreaterThan(0)
      expect(e.taille).toBeGreaterThan(0)
    }
    expect(dansLaVue(CASCADE.boite.x, CASCADE.boite.y)).toBe(true)
    expect(dansLaVue(CASCADE.ecume.x, CASCADE.ecume.y)).toBe(true)
    expect(dansLaVue(FUMEE.x, FUMEE.y)).toBe(true)
    for (const o of OISEAUX) expect(dansLaVue(o.x, o.y)).toBe(true)
  })

  it('garde les nuages dans le ciel (au-dessus des montagnes)', () => {
    for (const n of NUAGES) {
      const hauteur = (n.largeur * n.rapport * FENETRE.vue.l) / FENETRE.vue.h
      expect(n.haut).toBeGreaterThanOrEqual(0)
      expect(n.haut + hauteur).toBeLessThan(30)
      expect(n.duree).toBeGreaterThanOrEqual(60)
      // Un départ négatif : le ciel n'est jamais vide à l'ouverture de l'écran.
      expect(n.retard).toBeLessThan(0)
    }
  })

  it('fait voyager à la même vitesse les nuages d’un même couloir', () => {
    const [grand, moyen] = NUAGES
    expect(grand.duree).toBe(moyen.duree)
    // À une demi-traversée d'écart : ils ne se rattrapent jamais.
    expect(Math.abs(grand.retard - moyen.retard)).toBe(grand.duree / 2)
  })

  it('pose la poussière sur la planche, sur l’une des trois trajectoires du CSS', () => {
    for (const p of POUSSIERES) {
      expect(dansLaVue(p.x, p.y)).toBe(true)
      expect([1, 2, 3]).toContain(p.trajet)
      expect(CSS).toContain(`@keyframes flotte-${p.trajet}`)
    }
  })
})

describe('la chouette au courrier', () => {
  it('garde la taille qu’elle avait dans la peinture (une case = 138 px des 974 de la vue)', () => {
    expect(HIBOU.largeur).toBeCloseTo((HIBOU.caseL / 974) * 100, 1)
    expect(HIBOU.poses).toBeGreaterThanOrEqual(8)
    expect(HIBOU.battement).toBeGreaterThan(0)
  })

  it('part de sa place d’origine, y revient, et y reste en mouvement réduit', () => {
    // Les images-clés du module CSS sont en valeurs littérales : elles doivent
    // être le miroir de la place écrite ici.
    const enX = `translate3d(${HIBOU.repos.x}%, 0, 0)`
    const enY = `translate3d(0, ${HIBOU.repos.y}%, 0)`
    // Quatre fois dans les images-clés (elle y est, elle part, elle revient, la
    // boucle se referme), une fois en mouvement réduit.
    expect(CSS.split(enX).length - 1).toBe(5)
    expect(CSS.split(enY).length - 1).toBe(5)
    // La tournée est une boucle : elle commence et finit à sa place, sans saut.
    for (const [nom, place] of [['hibou-x', enX], ['hibou-y', enY]] as const) {
      const bloc = new RegExp(`@keyframes ${nom}\\s*\\{([\\s\\S]*?)\\n\\}`).exec(CSS)?.[1] ?? ''
      const pas = [...bloc.matchAll(/transform: ([^;]+);/g)].map((m) => m[1])
      expect(pas[0], nom).toBe(place)
      expect(pas.at(-1), nom).toBe(place)
    }
  })

  it('reste en vue : une seule sortie, à gauche, derrière le lierre', () => {
    const bloc = /@keyframes hibou-x\s*\{([\s\S]*?)\n\}/.exec(CSS)?.[1] ?? ''
    const places = [...bloc.matchAll(/translate3d\((-?[\d.]+)%, 0, 0\)/g)].map((m) => Number(m[1]))
    // Hors de la vue : le centre de la chouette à plus d'une demi-case du bord.
    const dehors = places.filter((x) => x < -HIBOU.largeur / 2 || x > 100 + HIBOU.largeur / 2)
    expect(dehors.length).toBe(2)
    for (const x of dehors) expect(x).toBeLessThan(0)
  })

  it('ne traverse jamais le dragon : elle passe dessous ou dessus', () => {
    // Le dragon occupe 21,7 → 27,1 % de la hauteur de la vue.
    const bloc = /@keyframes hibou-y\s*\{([\s\S]*?)\n\}/.exec(CSS)?.[1] ?? ''
    const hauteurs = [...bloc.matchAll(/translate3d\(0, ([\d.]+)%, 0\)/g)].map((m) => Number(m[1]))
    expect(hauteurs.length).toBeGreaterThanOrEqual(6)
    for (const y of hauteurs) expect(y <= 15 || y >= 26).toBe(true)
  })
})

describe('le module CSS', () => {
  it('n’anime que des transformations et des opacités, en valeurs littérales', () => {
    const blocs = [...CSS.matchAll(/@keyframes [\w-]+\s*\{([\s\S]*?)\n\}/g)].map((m) => m[1])
    expect(blocs.length).toBeGreaterThan(5)
    for (const bloc of blocs) {
      expect(bloc).not.toMatch(/var\(/)
      const proprietes = [...bloc.matchAll(/^\s*([a-z-]+)\s*:/gm)].map((m) => m[1])
      // `animation-timing-function` n'est pas une propriété animée : c'est
      // l'allure de l'étape qui part de cette image-clé.
      for (const p of proprietes) expect(['transform', 'opacity', 'animation-timing-function']).toContain(p)
    }
  })
})
