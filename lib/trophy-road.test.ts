import { describe, expect, it } from 'vitest'
import {
  BAND_SPAN,
  TROPHY_BANDS,
  applyGameResult,
  globalTotal,
  holdRate,
  mostRewarding,
  restingTrophies,
  seasonReset,
  SEASON_KEEP_FLOOR,
  subjectTotal,
  subjectTotals,
  trophyBand,
  trophyDeltaFor,
  type GameTrophyRow,
} from './trophy-road'

describe('la table des bandes', () => {
  it('couvre la droite des trophées sans trou ni recouvrement', () => {
    for (let i = 0; i < TROPHY_BANDS.length - 1; i++) {
      expect(TROPHY_BANDS[i].ceiling).toBe(TROPHY_BANDS[i + 1].floor)
    }
    expect(TROPHY_BANDS[0].floor).toBe(0)
    expect(TROPHY_BANDS[TROPHY_BANDS.length - 1].ceiling).toBeNull()
  })

  it('fait décroître le gain et croître la perte à mesure qu’on monte', () => {
    for (let i = 0; i < TROPHY_BANDS.length - 1; i++) {
      expect(TROPHY_BANDS[i + 1].win).toBeLessThan(TROPHY_BANDS[i].win)
      expect(TROPHY_BANDS[i + 1].loss).toBeGreaterThan(TROPHY_BANDS[i].loss)
    }
  })

  it('ne coûte rien sur la bande du débutant (filet)', () => {
    expect(TROPHY_BANDS[0].loss).toBe(0)
  })

  it('garde un gain strictement positif partout — on ne joue jamais pour rien', () => {
    for (const band of TROPHY_BANDS) expect(band.win).toBeGreaterThan(0)
  })
})

describe('trophyBand', () => {
  it('range un compteur dans sa bande', () => {
    expect(trophyBand(0).floor).toBe(0)
    expect(trophyBand(99).floor).toBe(0)
    expect(trophyBand(100).floor).toBe(100)
    expect(trophyBand(742).floor).toBe(700)
  })

  it('plafonne sur la dernière bande, ouverte vers le haut', () => {
    const last = TROPHY_BANDS[TROPHY_BANDS.length - 1]
    expect(trophyBand(800)).toBe(last)
    expect(trophyBand(5000)).toBe(last)
  })

  it('traite un compteur négatif ou décimal comme un entier positif', () => {
    expect(trophyBand(-50).floor).toBe(0)
    expect(trophyBand(199.9).floor).toBe(100)
  })

  it('a une largeur de bande cohérente avec la table', () => {
    expect(TROPHY_BANDS[1].floor - TROPHY_BANDS[0].floor).toBe(BAND_SPAN)
  })
})

describe('trophyDeltaFor', () => {
  it('donne le gain de la bande en victoire', () => {
    expect(trophyDeltaFor(0, true)).toBe(10)
    expect(trophyDeltaFor(700, true)).toBe(3)
  })

  it('donne la perte de la bande, négative, en défaite', () => {
    expect(trophyDeltaFor(0, false)).toBe(0)
    expect(trophyDeltaFor(700, false)).toBe(-7)
  })
})

describe('applyGameResult', () => {
  it('monte le compteur en victoire', () => {
    const change = applyGameResult(150, true)
    expect(change.before).toBe(150)
    expect(change.after).toBe(159)
    expect(change.delta).toBe(9)
  })

  it('descend le compteur en défaite', () => {
    expect(applyGameResult(650, false).after).toBe(644)
  })

  it('ne descend jamais sous zéro', () => {
    // Bande du débutant : la défaite ne coûte rien, donc on reste à 0…
    expect(applyGameResult(0, false).after).toBe(0)
    // …et même en forçant un compteur incohérent, le plancher tient.
    expect(applyGameResult(-30, false).after).toBe(0)
  })

  it('annonce le delta RÉEL après écrêtage, pas le barème théorique', () => {
    // 3 trophées en bande 100..199 ne peut pas arriver par le jeu, mais un
    // reset de saison peut poser un compteur bas : le delta doit suivre le
    // mouvement observé du compteur.
    const change = applyGameResult(2, false)
    expect(change.after).toBe(2)
    expect(change.delta).toBe(0)
  })

  it('signale le changement de bande', () => {
    expect(applyGameResult(95, true).crossedBand).toBe(true)
    expect(applyGameResult(150, true).crossedBand).toBe(false)
    expect(applyGameResult(300, false).crossedBand).toBe(true)
  })
})

describe('l’équilibre des bandes', () => {
  it('exige un taux de victoire croissant pour se maintenir', () => {
    const rates = TROPHY_BANDS.map(holdRate)
    for (let i = 0; i < rates.length - 1; i++) {
      expect(rates[i + 1]).toBeGreaterThan(rates[i])
    }
  })

  it('rend la bande du débutant impossible à quitter par le bas', () => {
    expect(holdRate(TROPHY_BANDS[0])).toBe(0)
  })

  it('stabilise un élève moyen vers 500 et un bon vers 700', () => {
    expect(restingTrophies(0.5)).toBe(500)
    expect(restingTrophies(0.55)).toBe(500)
    expect(restingTrophies(0.7)).toBe(700)
  })

  it('laisse un élève qui ne gagne jamais sur la bande du filet', () => {
    expect(restingTrophies(0)).toBe(0)
  })
})

describe('la bascule de saison', () => {
  it('ne reprend rien sous le plancher', () => {
    expect(seasonReset(0)).toBe(0)
    expect(seasonReset(200)).toBe(200)
    expect(seasonReset(SEASON_KEEP_FLOOR)).toBe(SEASON_KEEP_FLOOR)
  })

  it('ne garde que la moitié de ce qui dépasse', () => {
    expect(seasonReset(600)).toBe(550)
    expect(seasonReset(900)).toBe(700)
  })

  it('ne descend jamais sous le plancher, même de très haut', () => {
    expect(seasonReset(5000)).toBeGreaterThanOrEqual(SEASON_KEEP_FLOOR)
  })

  it('rend de la marge de progression à qui plafonnait', () => {
    // Tout l'intérêt : repasser d'une bande lente à une bande plus généreuse.
    const before = trophyBand(900).win
    const after = trophyBand(seasonReset(900)).win
    expect(after).toBeGreaterThan(before)
  })

  it('converge sans jamais franchir le plancher (saisons enchaînées)', () => {
    let t = 900
    for (let i = 0; i < 20; i++) t = seasonReset(t)
    expect(t).toBe(SEASON_KEEP_FLOOR)
  })

  it('est idempotente une fois au plancher', () => {
    expect(seasonReset(seasonReset(SEASON_KEEP_FLOOR))).toBe(SEASON_KEEP_FLOOR)
  })
})

// --------------------------------------------------------------- agrégation

const ROWS: GameTrophyRow[] = [
  { subject: 'Maths', gameId: 'calcul-mental', trophies: 890 },
  { subject: 'Maths', gameId: 'compte-est-bon', trophies: 350 },
  { subject: 'Maths', gameId: 'suite-logique', trophies: 0 },
  { subject: 'Français', gameId: 'orthographe', trophies: 220 },
]

describe('les totaux', () => {
  it('somme les jeux d’une matière', () => {
    expect(subjectTotal(ROWS, 'Maths')).toBe(1240)
    expect(subjectTotal(ROWS, 'Français')).toBe(220)
  })

  it('rend 0 pour une matière jamais jouée', () => {
    expect(subjectTotal(ROWS, 'SVT')).toBe(0)
  })

  it('donne les totaux de toutes les matières présentes', () => {
    const totals = subjectTotals(ROWS)
    expect(totals.get('Maths')).toBe(1240)
    expect(totals.get('Français')).toBe(220)
    expect(totals.has('SVT')).toBe(false)
  })

  it('somme tout pour le global', () => {
    expect(globalTotal(ROWS)).toBe(1460)
  })

  it('ignore les compteurs négatifs au lieu de les soustraire', () => {
    expect(globalTotal([{ subject: 'X', gameId: 'y', trophies: -100 }])).toBe(0)
  })
})

describe('mostRewarding', () => {
  it('désigne le jeu dont la victoire vaut le plus', () => {
    expect(mostRewarding(ROWS)?.gameId).toBe('suite-logique')
  })

  it('à gain égal, pousse vers le compteur le plus bas', () => {
    const sameBand: GameTrophyRow[] = [
      { subject: 'Maths', gameId: 'a', trophies: 280 },
      { subject: 'Maths', gameId: 'b', trophies: 210 },
    ]
    expect(mostRewarding(sameBand)?.gameId).toBe('b')
  })

  it('garde l’ordre d’entrée à égalité parfaite (affichage stable)', () => {
    const tied: GameTrophyRow[] = [
      { subject: 'Maths', gameId: 'a', trophies: 250 },
      { subject: 'Maths', gameId: 'b', trophies: 250 },
    ]
    expect(mostRewarding(tied)?.gameId).toBe('a')
  })

  it('rend null sans aucun jeu', () => {
    expect(mostRewarding([])).toBeNull()
  })
})

describe('l’incitation à étaler (la propriété qui fait tourner le système)', () => {
  // La démonstration chiffrée : à effort et talent égaux, dix matchs sur un jeu
  // neuf rapportent beaucoup plus que dix matchs sur un jeu déjà haut. C'est
  // CE delta qui remplace les quêtes « joue 3 matières différentes ».
  function simulate(start: number, matches: number, wins: number): number {
    let t = start
    for (let i = 0; i < matches; i++) {
      t = applyGameResult(t, i < wins).after
    }
    return t - start
  }

  it('rapporte nettement plus sur un jeu neuf que sur un jeu déjà haut', () => {
    const neuf = simulate(0, 10, 6)
    const haut = simulate(700, 10, 6)
    expect(neuf).toBeGreaterThan(haut)
    expect(neuf - haut).toBeGreaterThan(50)
  })

  it('rend un jeu très haut quasi stérile à taux de victoire moyen', () => {
    expect(simulate(800, 10, 5)).toBeLessThanOrEqual(0)
  })
})
