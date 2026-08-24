import { describe, expect, it } from 'vitest'
import {
  libelleSerie,
  phraseSerie,
  preparerCelebration,
  type JourSerie,
} from '@/lib/serie-celebration'

/** Une semaine où `indexAujourdhui` est le jour courant. */
const semaine = (
  faits: readonly number[],
  indexAujourdhui: number,
): JourSerie[] =>
  Array.from({ length: 7 }, (_, i) => ({
    done: faits.includes(i),
    isToday: i === indexAujourdhui,
    isFuture: i > indexAujourdhui,
  }))

describe('preparerCelebration', () => {
  it('célèbre quand la case du jour était VIDE', () => {
    const c = preparerCelebration(semaine([], 0), 0)
    expect(c.celebrer).toBe(true)
    expect(c.indexDuJour).toBe(0)
  })

  it('remplit la case du jour, et elle seule', () => {
    const c = preparerCelebration(semaine([0, 1], 2), 2)
    expect(c.avant[2].done).toBe(false)
    expect(c.apres[2].done).toBe(true)
    // Les autres jours sont intacts.
    expect(c.apres.map((j) => j.done)).toEqual([
      true, true, true, false, false, false, false,
    ])
  })

  it('NE célèbre PAS si le jour était déjà fait', () => {
    // Un élève qui enchaîne cinq quiz ne veut pas voir cinq fois la même fête.
    const c = preparerCelebration(semaine([0], 0), 3)
    expect(c.celebrer).toBe(false)
    expect(c.apres).toEqual(c.avant)
    expect(c.serie).toBe(3)
  })

  it('incrémente la série d’un seul jour', () => {
    expect(preparerCelebration(semaine([0, 1], 2), 2).serie).toBe(3)
  })

  it('une première activité donne toujours au moins 1', () => {
    // Le serveur peut renvoyer 0 avant l'écriture : la case qu'on vient de
    // remplir vaut au minimum un jour.
    expect(preparerCelebration(semaine([], 0), 0).serie).toBe(1)
  })

  it('ne célèbre pas si aucun jour n’est marqué « aujourd’hui »', () => {
    // Semaine mal formée : mieux vaut ne rien fêter que remplir une case au
    // hasard.
    const bancale = semaine([], -1)
    const c = preparerCelebration(bancale, 4)
    expect(c.celebrer).toBe(false)
    expect(c.indexDuJour).toBe(-1)
    expect(c.serie).toBe(4)
  })

  it('ne modifie pas la semaine reçue', () => {
    const source = semaine([], 1)
    preparerCelebration(source, 0)
    expect(source[1].done).toBe(false)
  })

  it('fonctionne un dimanche (dernier jour de la bande)', () => {
    const c = preparerCelebration(semaine([0, 1, 2, 3, 4, 5], 6), 6)
    expect(c.celebrer).toBe(true)
    expect(c.apres[6].done).toBe(true)
    expect(c.serie).toBe(7)
  })
})

describe('phraseSerie', () => {
  it('change avec le palier — la même phrase trente jours devient un bruit', () => {
    const paliers = [1, 2, 5, 7, 12, 30, 100].map(phraseSerie)
    expect(new Set(paliers).size).toBe(paliers.length)
  })

  it('accueille le tout premier jour par une question, pas un bilan', () => {
    expect(phraseSerie(1)).toContain('?')
  })

  it('a toujours quelque chose à dire, même très haut', () => {
    expect(phraseSerie(365).length).toBeGreaterThan(0)
  })
})

describe('libelleSerie', () => {
  it('accorde le pluriel', () => {
    expect(libelleSerie(1)).toBe('1 jour !')
    expect(libelleSerie(2)).toBe('2 jours !')
  })

  it('ne rend jamais de valeur absurde', () => {
    expect(libelleSerie(-3)).toBe('0 jour !')
    expect(libelleSerie(Number.NaN)).toBe('0 jour !')
  })
})
