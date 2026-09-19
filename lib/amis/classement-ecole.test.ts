import { describe, expect, it } from 'vitest'
import type { SchoolMate } from '@/lib/social'
import {
  LIGNES_REPLIEES,
  PODIUM,
  ligneDivision,
  lignesEcole,
  monRang,
  peutDeplier,
  railDivisions,
  sousTitreEcole,
  titreEcole,
  trophees,
} from './classement-ecole'

function mate(id: string, trophies: number, isMe = false): SchoolMate {
  return { id, name: id, emoji: '🙂', trophies, isMe }
}

/** n élèves aux trophées décroissants ; « moi » à la position demandée (1 = premier). */
function ecole(n: number, maPlace: number): SchoolMate[] {
  return Array.from({ length: n }, (_, i) =>
    mate(i + 1 === maPlace ? 'moi' : `e${i + 1}`, n - i, i + 1 === maPlace),
  )
}

describe('lignesEcole', () => {
  it('trie aux trophées et pose le bandeau sous la 3e place', () => {
    const lignes = lignesEcole(ecole(5, 4), true)
    const kinds = lignes.map((l) => l.kind)
    expect(kinds).toEqual(['eleve', 'eleve', 'eleve', 'separateur', 'eleve', 'eleve'])
    const ranks = lignes.flatMap((l) => (l.kind === 'eleve' ? [l.rank] : []))
    expect(ranks).toEqual([1, 2, 3, 4, 5])
    const podium = lignes.flatMap((l) => (l.kind === 'eleve' ? [l.podium] : []))
    expect(podium).toEqual([true, true, true, false, false])
  })

  it('ne pose pas de bandeau qui ne séparerait rien', () => {
    expect(lignesEcole(ecole(3, 1), true).map((l) => l.kind)).toEqual([
      'eleve',
      'eleve',
      'eleve',
    ])
    expect(lignesEcole(ecole(2, 1), true).map((l) => l.kind)).not.toContain('separateur')
  })

  it('replié : les dix premiers, puis une ellipse, ma ligne et celle derrière', () => {
    const lignes = lignesEcole(ecole(30, 17), false)
    const eleves = lignes.filter((l) => l.kind === 'eleve')
    expect(eleves.map((l) => (l.kind === 'eleve' ? l.rank : 0))).toEqual([
      ...Array.from({ length: LIGNES_REPLIEES }, (_, i) => i + 1),
      17,
      18,
    ])
    const ellipse = lignes.find((l) => l.kind === 'ellipse')
    expect(ellipse).toEqual({ kind: 'ellipse', caches: 6 }) // les places 11 à 16
    // Ma ligne est là sans tap de plus.
    expect(eleves.some((l) => l.kind === 'eleve' && l.mate.isMe)).toBe(true)
  })

  it('replié : pas d’ellipse si je suis juste sous le pli', () => {
    const lignes = lignesEcole(ecole(30, 11), false)
    expect(lignes.some((l) => l.kind === 'ellipse')).toBe(false)
    const ranks = lignes.flatMap((l) => (l.kind === 'eleve' ? [l.rank] : []))
    expect(ranks.at(-2)).toBe(11)
    expect(ranks.at(-1)).toBe(12)
  })

  it('replié : dans le top dix, la liste s’arrête à dix', () => {
    const lignes = lignesEcole(ecole(30, 2), false)
    const ranks = lignes.flatMap((l) => (l.kind === 'eleve' ? [l.rank] : []))
    expect(ranks).toHaveLength(LIGNES_REPLIEES)
    expect(lignes.some((l) => l.kind === 'ellipse')).toBe(false)
  })

  it('déplié : tout le monde', () => {
    const lignes = lignesEcole(ecole(30, 17), true)
    expect(lignes.filter((l) => l.kind === 'eleve')).toHaveLength(30)
    expect(lignes.some((l) => l.kind === 'ellipse')).toBe(false)
  })
})

describe('peutDeplier / monRang', () => {
  it('ne propose « voir tout » que s’il reste des lignes cachées', () => {
    expect(peutDeplier(ecole(8, 3))).toBe(false)
    expect(peutDeplier(ecole(30, 2))).toBe(true)
  })

  it('donne mon rang après tri, ou null si je n’y suis pas', () => {
    expect(monRang(ecole(9, 4))).toBe(4)
    expect(monRang([mate('a', 3), mate('b', 5)])).toBeNull()
  })
})

describe('titreEcole / sousTitreEcole', () => {
  it('dit ma place en une phrase', () => {
    expect(titreEcole(3, 'ton collège')).toBe('Tu es n°3 du classement de ton collège')
    expect(titreEcole(1, 'ton lycée')).toBe('Tu es 1er du classement de ton lycée')
    expect(titreEcole(null, 'la France')).toBe('Le classement de la France')
  })

  it('chiffre l’écart avec celui juste devant, ou mon avance si je mène', () => {
    const m = [mate('Rayan', 330), mate('moi', 280, true), mate('Léa', 270)]
    expect(sousTitreEcole(m, 'ton collège')).toBe('50 trophées pour doubler Rayan')
    const tete = [mate('moi', 410, true), mate('Naïla', 409)]
    expect(sousTitreEcole(tete, 'ton collège')).toBe('1 trophée d’avance sur Naïla')
    const egal = [mate('Rayan', 300), mate('moi', 300, true)]
    expect(sousTitreEcole(egal, 'ton collège')).toMatch(/égalité avec Rayan/)
  })

  it('accorde « trophée » en nombre', () => {
    expect(trophees(1)).toBe('1 trophée')
    expect(trophees(40)).toBe('40 trophées')
    expect(trophees(-3)).toBe('0 trophées')
  })

  it('ne chiffre rien quand je suis seul ou absent', () => {
    expect(sousTitreEcole([mate('moi', 4, true)], 'ton collège')).toMatch(/seul/)
    expect(sousTitreEcole([mate('a', 4)], 'ta région')).toMatch(/ta région/)
  })

  it('le podium fait trois places', () => {
    expect(PODIUM).toBe(3)
  })
})

describe('railDivisions / ligneDivision', () => {
  it('le blason courant au milieu, ceux d’avant passés, ceux d’après verrouillés', () => {
    // 2 300 trophées = Argent (2 000 → 4 000, cf. lib/rank).
    const rail = railDivisions(2300)
    expect(rail.map((d) => d.tier.id)).toEqual([
      'bronze',
      'argent',
      'or',
      'platine',
      'diamant',
      'maitre',
    ])
    expect(rail.map((d) => d.etat)).toEqual([
      'passee',
      'courante',
      'verrouillee',
      'verrouillee',
      'verrouillee',
      'verrouillee',
    ])
  })

  it('à zéro, seul le bronze est découvert ; au sommet, plus rien n’est verrouillé', () => {
    expect(railDivisions(0).filter((d) => d.etat === 'verrouillee')).toHaveLength(5)
    const sommet = railDivisions(20000)
    expect(sommet.at(-1)?.etat).toBe('courante')
    expect(sommet.some((d) => d.etat === 'verrouillee')).toBe(false)
  })

  it('nomme la division et le prochain blason à débloquer', () => {
    expect(ligneDivision(320)).toBe('Division Bronze · Argent dans 1680 trophées')
    expect(ligneDivision(20000)).toBe('Division Maître · le sommet')
  })
})
