import { describe, expect, it } from 'vitest'
import { SALONS } from '@/lib/jeux/catalog'
import { PROGRAMME_GAME_ID, programmeSlug } from '@/lib/jeux/programme'
import {
  bestNextGame,
  buildRoster,
  rosterTotal,
  subjectBySlug,
  trophyKey,
  trophyMap,
} from './roster'

const EMPTY = new Map<string, number>()

describe('buildRoster', () => {
  it('rend une entrée par matière du catalogue', () => {
    const roster = buildRoster(EMPTY)
    expect(roster).toHaveLength(SALONS.length)
    expect(roster.map((r) => r.subject)).toEqual(SALONS.map((s) => s.subject))
  })

  it('donne au moins trois jeux à chaque matière (l’égalisation par le Programme)', () => {
    for (const entry of buildRoster(EMPTY)) {
      expect(entry.games.length, entry.subject).toBeGreaterThanOrEqual(3)
    }
  })

  it('termine chaque matière par son Programme', () => {
    for (const entry of buildRoster(EMPTY)) {
      expect(entry.games[entry.games.length - 1].gameId).toBe(PROGRAMME_GAME_ID)
      expect(entry.games[entry.games.length - 1].isProgramme).toBe(true)
    }
  })

  it('n’inscrit jamais un jeu non construit', () => {
    const roster = buildRoster(EMPTY)
    const soon = SALONS.flatMap((s) =>
      s.games.filter((g) => !g.implemented).map((g) => g.id),
    )
    const listed = roster.flatMap((r) => r.games.map((g) => g.gameId))
    for (const id of soon) expect(listed).not.toContain(id)
  })

  it('donne un lien jouable à chaque jeu de salon', () => {
    for (const entry of buildRoster(EMPTY)) {
      for (const game of entry.games) {
        if (game.isProgramme) continue
        expect(game.href, game.gameId).toBe(`/defi/jeux/${game.gameId}`)
      }
    }
  })

  it('annonce une accroche non vide partout (jamais un « Jouer » nu)', () => {
    for (const entry of buildRoster(EMPTY)) {
      for (const game of entry.games) {
        expect(game.teaser.trim().length, game.gameId).toBeGreaterThan(0)
      }
    }
  })
})

describe('les compteurs et le barème des tuiles', () => {
  const maths = programmeSlug('Maths')
  const trophies = trophyMap([
    { subject: maths, gameId: 'calcul-mental', trophies: 890 },
    { subject: maths, gameId: 'compte-est-bon', trophies: 350 },
  ])

  it('reporte le compteur sur la bonne tuile', () => {
    const entry = subjectBySlug(buildRoster(trophies), maths)
    const calcul = entry?.games.find((g) => g.gameId === 'calcul-mental')
    expect(calcul?.trophies).toBe(890)
  })

  it('laisse à zéro un jeu jamais joué', () => {
    const entry = subjectBySlug(buildRoster(trophies), maths)
    const suite = entry?.games.find((g) => g.gameId === 'suite-logique')
    expect(suite?.trophies).toBe(0)
  })

  it('attache à chaque tuile ce que vaut sa prochaine victoire', () => {
    const entry = subjectBySlug(buildRoster(trophies), maths)
    // 890 trophées → dernière bande : +2 / −8.
    expect(entry?.games.find((g) => g.gameId === 'calcul-mental')?.nextWin).toBe(2)
    // Jamais joué → bande du débutant : +10, et rien à perdre.
    const suite = entry?.games.find((g) => g.gameId === 'suite-logique')
    expect(suite?.nextWin).toBe(10)
    expect(suite?.nextLoss).toBe(0)
  })

  it('somme les jeux pour le total de la matière', () => {
    const entry = subjectBySlug(buildRoster(trophies), maths)
    expect(entry?.total).toBe(1240)
  })

  it('somme les matières pour le total global', () => {
    expect(rosterTotal(buildRoster(trophies))).toBe(1240)
  })

  it('ne mélange pas deux matières partageant un id de jeu', () => {
    // « traduction-flash » (Anglais) et « traduccion-flash » (Espagnol) sont
    // distincts, mais la clé doit de toute façon porter la matière : deux
    // matières pourraient un jour partager un id.
    const map = trophyMap([
      { subject: 'anglais', gameId: 'traduction-flash', trophies: 200 },
    ])
    expect(map.get(trophyKey('anglais', 'traduction-flash'))).toBe(200)
    expect(map.get(trophyKey('espagnol', 'traduction-flash'))).toBeUndefined()
  })
})

describe('la disponibilité du Programme', () => {
  it('éteint la tuile d’une matière sans banque suffisante', () => {
    const roster = buildRoster(EMPTY, { programmeReady: new Set(['maths']) })
    const svt = subjectBySlug(roster, 'svt')
    const programme = svt?.games.find((g) => g.isProgramme)
    expect(programme?.href).toBeNull()
    expect(programme?.unavailable).toBeTruthy()
  })

  it('allume celle d’une matière servie', () => {
    const roster = buildRoster(EMPTY, { programmeReady: new Set(['maths']) })
    const maths = subjectBySlug(roster, 'maths')
    const programme = maths?.games.find((g) => g.isProgramme)
    expect(programme?.href).toBe('/defi/programme/maths')
    expect(programme?.unavailable).toBeUndefined()
  })

  it('allume tout quand aucune liste n’est fournie (le serveur n’a pas tranché)', () => {
    for (const entry of buildRoster(EMPTY)) {
      expect(entry.games.find((g) => g.isProgramme)?.href).not.toBeNull()
    }
  })
})

describe('bestNextGame — la ligne de conseil', () => {
  it('désigne un jeu jamais joué quand tout est neuf', () => {
    const best = bestNextGame(buildRoster(EMPTY))
    expect(best?.game.nextWin).toBe(10)
    expect(best?.game.trophies).toBe(0)
  })

  it('évite le jeu déjà haut au profit du jeu neuf', () => {
    const maths = programmeSlug('Maths')
    const roster = buildRoster(
      trophyMap([{ subject: maths, gameId: 'calcul-mental', trophies: 890 }]),
    )
    expect(best(roster)).not.toBe('calcul-mental')
  })

  it('ne conseille jamais un jeu non jouable', () => {
    const roster = buildRoster(EMPTY, { programmeReady: new Set() })
    const chosen = bestNextGame(roster)
    expect(chosen?.game.isProgramme).toBe(false)
    expect(chosen?.game.href).not.toBeNull()
  })

  it('rend null si plus rien n’est jouable', () => {
    const roster = buildRoster(EMPTY).map((entry) => ({
      ...entry,
      games: entry.games.map((game) => ({ ...game, href: null })),
    }))
    expect(bestNextGame(roster)).toBeNull()
  })

  it('est stable : deux appels sur le même roster donnent le même conseil', () => {
    const roster = buildRoster(EMPTY)
    expect(best(roster)).toBe(best(roster))
  })

  function best(roster: ReturnType<typeof buildRoster>): string | undefined {
    return bestNextGame(roster)?.game.gameId
  }
})
