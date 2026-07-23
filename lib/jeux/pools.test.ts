import { describe, expect, it } from 'vitest'
import {
  COUNTDOWN_BUILDERS,
  ORDER_BUILDERS,
  POOL_BUILDERS,
  ZONE_BUILDERS,
  buildOrderPool,
  buildSalonPool,
  buildZonePool,
  idsWithPool,
  poolKind,
} from './pools'
import { SALONS, playableSalonGame, type SalonGameId } from './catalog'
import { GAME_FORMATS, poolSizeFor } from './formats'
import { isBoardComplete, isNextInOrder } from './ordering'

// Tous les ids de jeux marqués « implemented » dans le catalogue.
const implementedIds = SALONS.flatMap((s) =>
  s.games.filter((g) => g.implemented).map((g) => g.id),
)

// Trois formes de banque, trois registres : des QCM, des tableaux à remettre
// dans l'ordre, des tirages de plaques.
const qcmIds = implementedIds.filter((id) => poolKind(id) === 'qcm')
const orderIds = implementedIds.filter((id) => poolKind(id) === 'ordre')
const countdownIds = implementedIds.filter((id) => poolKind(id) === 'compte')
const zoneIds = implementedIds.filter((id) => poolKind(id) === 'zones')

describe('cohérence catalogue ↔ banques de questions', () => {
  it('chaque jeu jouable a une banque enregistrée (aucun cul-de-sac)', () => {
    for (const id of implementedIds) {
      expect(idsWithPool(), `banque manquante pour « ${id} »`).toContain(id)
    }
  })

  it('aucune banque orpheline (chaque builder cible un jeu implémenté)', () => {
    for (const id of idsWithPool()) {
      expect(implementedIds, `builder « ${id} » sans jeu implémenté`).toContain(id)
    }
  })

  it('range chaque jeu dans exactement un registre', () => {
    for (const id of qcmIds) expect(POOL_BUILDERS[id]).toBeDefined()
    for (const id of orderIds) expect(ORDER_BUILDERS[id]).toBeDefined()
    for (const id of countdownIds) expect(COUNTDOWN_BUILDERS[id]).toBeDefined()
    for (const id of zoneIds) expect(ZONE_BUILDERS[id]).toBeDefined()
    // Chaque jeu jouable tombe dans une forme, et une seule.
    expect(
      qcmIds.length + orderIds.length + countdownIds.length + zoneIds.length,
    ).toBe(implementedIds.length)
  })

  it('n’inscrit jamais un jeu dans deux registres à la fois', () => {
    const all = [
      ...Object.keys(POOL_BUILDERS),
      ...Object.keys(ORDER_BUILDERS),
      ...Object.keys(COUNTDOWN_BUILDERS),
      ...Object.keys(ZONE_BUILDERS),
    ]
    expect(new Set(all).size).toBe(all.length)
  })

  it('rend null pour un id sans aucune banque', () => {
    expect(poolKind('pointe-carte')).toBeNull()
  })

  it('sert des zones pour le jeu de désignation, et rien d’autre', () => {
    expect(buildZonePool('anatomie-express', 'v', 8)).toHaveLength(8)
    expect(buildZonePool('capitales', 'v', 8)).toBeNull()
  })

  it('playableSalonGame résout exactement les jeux ayant une banque', () => {
    for (const id of idsWithPool()) {
      expect(playableSalonGame(id)).not.toBeNull()
    }
  })
})

// La dette de banque constatée le 2026-07-23 (34 questions manquantes sur six
// jeux) a été REMBOURSÉE le même jour : la liste de tolérance qui vivait ici
// n'a plus lieu d'être, et le contrôle ci-dessous est redevenu strict. Ajouter
// un jeu dont la banque est plus courte que ce que sa mécanique consomme fait
// donc échouer les tests immédiatement — c'est voulu.
describe('buildSalonPool', () => {
  it('sert VRAIMENT le nombre de questions que le format consomme', () => {
    // Le vrai invariant, celui qui manquait : un plancher fixe de 10 ne dit
    // rien. Ce qui compte est que la banque tienne la partie que la MÉCANIQUE
    // va jouer — sinon la table reboucle sur `pool[i % n]` et re-sert la même
    // question, mêmes options, même ordre, en pleine partie.
    // On collecte TOUS les manques avant d'échouer : s'arrêter au premier
    // cache les suivants et fait corriger la banque une par une, à l'aveugle.
    const manques: string[] = []
    for (const id of qcmIds) {
      const attendu = poolSizeFor(GAME_FORMATS[id as SalonGameId])
      const pool = buildSalonPool(id, 'verif', attendu)
      expect(pool, `pool null pour « ${id} »`).not.toBeNull()
      if (pool!.length < attendu) {
        manques.push(`${id} : ${pool!.length}/${attendu}`)
      }
    }
    expect(manques, `banque trop courte → ${manques.join(' · ')}`).toEqual([])
  })

  it('produit un pool non vide et bien formé pour chaque jeu à QCM', () => {
    for (const id of qcmIds) {
      const pool = buildSalonPool(id, 'verif', 30)
      expect(pool, `pool null pour « ${id} »`).not.toBeNull()
      // Assez de questions pour tenir une partie complète sans recyclage
      // trop visible.
      expect(pool!.length).toBeGreaterThanOrEqual(10)
      for (const q of pool!) {
        expect(q.prompt.length).toBeGreaterThan(0)
        expect(q.options.length).toBeGreaterThanOrEqual(2)
        expect(q.correctIndex).toBeGreaterThanOrEqual(0)
        expect(q.correctIndex).toBeLessThan(q.options.length)
        expect(q.options[q.correctIndex]).toBeTruthy()
        expect(q.subject).toBeTruthy()
        // Deux options identiques = deux boutons identiques, dont un est
        // compté FAUX. L'élève a raison et le jeu lui dit qu'il a tort : rien
        // n'est plus destructeur pour la confiance dans le contenu. Rien ne
        // gardait ça, alors que chaque banque ajoutée en fait courir le risque
        // (un leurre écrit à l'identique de la bonne réponse dans un autre item).
        expect(
          new Set(q.options).size,
          `options en double dans « ${id} » : ${q.options.join(' / ')}`,
        ).toBe(q.options.length)
      }
      // Une même question servie deux fois dans la même partie : c'est le
      // symptôme d'une entrée dupliquée en banque.
      const ids = pool!.map((q) => q.id)
      expect(new Set(ids).size, `questions en double dans « ${id} »`).toBe(
        ids.length,
      )
    }
  })

  it('renvoie null pour un id sans banque de QCM', () => {
    // La Frise folle EXISTE, mais sert des tableaux : elle n'a rien à faire ici.
    expect(buildSalonPool('frise-folle', 'x', 10)).toBeNull()
    expect(buildSalonPool('nimporte-quoi', 'x', 10)).toBeNull()
  })
})

describe('buildOrderPool', () => {
  it('produit des tableaux cohérents et jouables jusqu’au bout', () => {
    for (const id of orderIds) {
      const format = GAME_FORMATS[id as keyof typeof GAME_FORMATS]
      const boards = buildOrderPool(id, 'verif', 6)
      expect(boards, `tableaux null pour « ${id} »`).not.toBeNull()
      expect(boards!.length).toBe(6)

      for (const board of boards!) {
        expect(board.prompt.length).toBeGreaterThan(0)
        // La solution couvre exactement les tuiles, une fois chacune.
        expect(board.solution.length).toBe(board.items.length)
        expect(new Set(board.solution).size).toBe(board.items.length)
        for (const i of board.solution) {
          expect(i).toBeGreaterThanOrEqual(0)
          expect(i).toBeLessThan(board.items.length)
        }
        for (const item of board.items) {
          expect(item.label.length).toBeGreaterThan(0)
          expect(item.hint.length).toBeGreaterThan(0)
        }

        // On rejoue la solution : chaque tap attendu est accepté, et le tableau
        // se termine pile au bon moment.
        for (let placed = 0; placed < board.solution.length; placed++) {
          expect(isBoardComplete(board, placed)).toBe(false)
          expect(isNextInOrder(board, placed, board.solution[placed])).toBe(true)
          // Toute autre tuile est refusée.
          const wrong = board.solution[(placed + 1) % board.solution.length]
          if (wrong !== board.solution[placed]) {
            expect(isNextInOrder(board, placed, wrong)).toBe(false)
          }
        }
        expect(isBoardComplete(board, board.solution.length)).toBe(true)
      }

      // `itemsPerBoard` est un MAXIMUM : les tableaux peuvent être plus courts
      // (une phrase anglaise fait 4 à 6 mots), jamais plus longs — sinon la
      // partie se bloquerait sur un tableau que le moteur ne sait pas boucler.
      if (format.params.mechanic === 'ordre') {
        for (const board of boards!) {
          expect(board.items.length).toBeGreaterThanOrEqual(3)
          expect(board.items.length).toBeLessThanOrEqual(
            format.params.ordre.itemsPerBoard,
          )
        }
      }
    }
  })

  it('est déterministe : même graine, mêmes tableaux', () => {
    const a = buildOrderPool('frise-folle', 'graine', 3)
    const b = buildOrderPool('frise-folle', 'graine', 3)
    expect(a).toEqual(b)
  })

  it('mélange vraiment (deux graines ne donnent pas le même tirage)', () => {
    const a = buildOrderPool('frise-folle', 'graine-a', 4)
    const b = buildOrderPool('frise-folle', 'graine-b', 4)
    expect(a).not.toEqual(b)
  })

  it('renvoie null pour un id sans banque de tableaux', () => {
    expect(buildOrderPool('capitales', 'x', 3)).toBeNull()
    expect(buildOrderPool('nimporte-quoi', 'x', 3)).toBeNull()
  })
})
