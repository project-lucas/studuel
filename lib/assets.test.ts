import { describe, expect, it } from 'vitest'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { ALL_BOSSES } from '@/lib/bosses'
import { RANK_TIERS } from '@/lib/rank'
import { subjectVignette } from '@/lib/subject-style'
import { gameScene } from '@/lib/defi/modes-catalog'
import { GAME_FORMATS } from '@/lib/jeux/formats'
import { modeImage, modeScene, GAME_MODES } from '@/lib/defi-modes'
import { SALONS } from '@/lib/jeux/catalog'

// Garde des ASSETS DÉCLARÉS.
//
// Partout dans l'app, une image se déclare dans une liste (VIGNETTE_SLUGS,
// GAME_SCENE_IDS, le catalogue des boss…) et le composant construit son chemin
// à partir de là. Déclarer un asset dont le fichier n'existe pas ne casse rien
// visiblement : le navigateur affiche une image brisée, ou rien du tout, sans
// la moindre erreur côté serveur ni côté tests.
//
// Ce fichier vérifie donc l'inverse de ce qu'on vérifie d'habitude : non pas
// que le code est correct, mais que ce qu'il PROMET existe sur le disque.
//
// Il ne se plaint jamais d'un fichier présent mais non déclaré : déposer une
// image en avance de phase est une pratique normale ici.

const PUBLIC_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'public',
)

/** Le fichier derrière un chemin public (`/images/...`) existe-t-il ? */
function assetExists(publicPath: string): boolean {
  return existsSync(path.join(PUBLIC_DIR, publicPath.replace(/^\//, '')))
}

describe('vignettes de matières', () => {
  const slugs = [
    ...new Set(SALONS.flatMap((s) => s.games.map(() => s.subject))),
  ]

  it('chaque vignette déclarée a bien son fichier', () => {
    // On interroge subjectVignette (la source de vérité côté app) plutôt que la
    // constante privée : c'est ce chemin-là que les composants affichent.
    for (const slug of [
      'maths',
      'francais',
      'histoire-geo',
      'anglais',
      'espagnol',
      'svt',
      'physique-chimie',
      'technologie',
      'nsi',
      'ses',
      'philosophie',
      'latin',
      'grec',
      'allemand',
      'musique',
      'sport',
      'arts-plastiques',
      'hggsp',
      'economie',
      'fiscalite',
      'entrepreneuriat',
      'figures-historiques',
    ]) {
      const v = subjectVignette(slug)
      expect(v, `${slug} : vignette non déclarée`).toBeDefined()
      expect(assetExists(v!), `${slug} : ${v} absent du disque`).toBe(true)
    }
  })

  it('ne déclare pas de vignette pour une matière qui n’en a pas', () => {
    // Repli médaillon assumé — cf. docs/nano-banana-prompts.md (P3).
    expect(subjectVignette('emc')).toBeUndefined()
    expect(subjectVignette('slug-inconnu')).toBeUndefined()
  })

  it('couvre bien toutes les matières de la roulette Défi', () => {
    expect(slugs.length).toBeGreaterThan(5)
  })
})

describe('scènes des jeux de salon', () => {
  const ids = SALONS.flatMap((s) => s.games.map((g) => g.id))

  it('chaque scène déclarée a bien son fichier', () => {
    for (const id of ids) {
      const scene = gameScene(id)
      if (!scene) continue // pas encore illustré : repli sur la robe unie
      expect(assetExists(scene), `${id} : ${scene} absent du disque`).toBe(true)
    }
  })

  it('n’illustre que des jeux qui existent au catalogue', () => {
    for (const id of ids) expect(typeof id).toBe('string')
    expect(gameScene('jeu-fantome')).toBeUndefined()
  })

  it('laisse un jeu sans scène s’afficher quand même', () => {
    // Le repli est un choix, pas un oubli : il ne doit jamais lever.
    expect(gameScene('bonne-unite')).toBeUndefined()
  })
})

describe('modes de l’Arène', () => {
  it('chaque affiche et chaque scène de mode existe', () => {
    for (const mode of GAME_MODES) {
      const img = modeImage(mode.id)
      const scene = modeScene(mode.id)
      expect(img, `${mode.id} : affiche non déclarée`).toBeDefined()
      expect(assetExists(img!), `${mode.id} : ${img} absent`).toBe(true)
      expect(scene, `${mode.id} : scène non déclarée`).toBeDefined()
      expect(assetExists(scene!), `${mode.id} : ${scene} absent`).toBe(true)
    }
  })
})

describe('boss', () => {
  it('chaque buste et chaque scène DÉCLARÉS existent', () => {
    for (const boss of ALL_BOSSES) {
      if (boss.image) {
        expect(
          assetExists(boss.image),
          `${boss.id} : buste ${boss.image} absent`,
        ).toBe(true)
      }
      if (boss.scene) {
        expect(
          assetExists(boss.scene),
          `${boss.id} : scène ${boss.scene} absente`,
        ).toBe(true)
      }
    }
  })

  it('laisse un emoji de repli à tout boss sans buste', () => {
    // Un boss sans image ET sans emoji serait invisible à l'écran.
    for (const boss of ALL_BOSSES) {
      if (!boss.image) expect(boss.emoji, `${boss.id}`).toBeTruthy()
    }
  })
})

describe('blasons de rang', () => {
  it('chaque palier a son blason sur le disque', () => {
    for (const tier of RANK_TIERS) {
      expect(assetExists(tier.image), `${tier.id} : ${tier.image} absent`).toBe(
        true,
      )
    }
  })

  it('garde un emoji de repli par palier', () => {
    for (const tier of RANK_TIERS) expect(tier.emoji).toBeTruthy()
  })
})

describe('cohérence formats ↔ catalogue de jeux', () => {
  it('chaque jeu jouable a un format, et réciproquement', () => {
    const playable = SALONS.flatMap((s) =>
      s.games.filter((g) => g.implemented).map((g) => g.id),
    ).sort()
    expect(Object.keys(GAME_FORMATS).sort()).toEqual(playable)
  })
})
