import { describe, expect, it } from 'vitest'
import { migrationSql } from '@/lib/migrations-lecture'
import { JEUX_RETIRES, SALONS } from '@/lib/jeux/catalog'
import {
  BOSS_POINTS_PAR_COEUR,
  BOSS_POINTS_PAR_COUP,
  BOSS_PRIME_VICTOIRE,
  DUEL_PRIME_SECHE,
  DUEL_PRIME_VICTOIRE,
  EPREUVES,
  EPREUVES_JEUX,
  EPREUVE_IDS,
  JEU_IDS,
  JEU_MAX_SCORE,
  JEU_MIN_MS_PAR_POINT,
  isJeuId,
  bossScore,
  duelFantomeScore,
  epreuve,
  epreuveHref,
  formatScore,
  isEpreuveId,
  scorePlausible,
} from './epreuves'

describe('le catalogue des épreuves', () => {
  it('compte les cinq modes de l’Arène, chacun une fois', () => {
    expect(EPREUVE_IDS).toEqual(['blitz', 'chrono', 'survie', 'boss', 'duel'])
    expect(new Set(EPREUVE_IDS).size).toBe(5)
  })

  it('reconnaît un id et rejette le reste', () => {
    expect(isEpreuveId('blitz')).toBe(true)
    expect(isEpreuveId('ranked')).toBe(false)
    expect(isEpreuveId(42)).toBe(false)
  })

  it('mène à la salle de jeu, mode ouvert', () => {
    expect(epreuveHref('survie')).toBe('/defi/jouer?mode=survie')
  })

  it('refuse une épreuve inconnue plutôt que de rendre undefined', () => {
    expect(() => epreuve('x' as never)).toThrow()
  })
})

describe('le miroir SQL (migration 352)', () => {
  const sql = migrationSql('352_palmares_modes.sql')

  it('chaque épreuve figure dans mode_catalog avec les mêmes bornes', () => {
    for (const e of EPREUVES) {
      const motif = new RegExp(
        `\\('${e.id}',\\s*${e.maxScore},\\s*${e.minMsParPoint}\\)`,
      )
      expect(sql, `${e.id} : bornes différentes entre TS et SQL`).toMatch(motif)
    }
  })

  it('le SQL ne connaît aucune épreuve absente du TS', () => {
    const dansLeSql = [...sql.matchAll(/^\s*\('([a-z]+)',\s*\d+,\s*\d+\)/gm)].map(
      (m) => m[1],
    )
    expect(dansLeSql.sort()).toEqual([...EPREUVE_IDS].sort())
  })
})

describe('formatScore', () => {
  it('groupe les milliers à la française et accorde l’unité', () => {
    expect(formatScore('blitz', 1250)).toBe('1 250 pts')
    expect(formatScore('blitz', 1)).toBe('1 pt')
    expect(formatScore('chrono', 1)).toBe('1 bonne réponse')
    expect(formatScore('chrono', 12)).toBe('12 bonnes réponses')
    expect(formatScore('survie', 7)).toBe('7 d’affilée')
  })

  it('ne rend jamais un score négatif', () => {
    expect(formatScore('blitz', -3)).toBe('0 pts')
  })
})

describe('bossScore', () => {
  it('une défaite garde ses coups', () => {
    expect(bossScore({ correct: 6, won: false, livesLeft: 0 })).toBe(6 * BOSS_POINTS_PAR_COUP)
  })

  it('une victoire ajoute la prime et les cœurs restants', () => {
    expect(bossScore({ correct: 10, won: true, livesLeft: 2 })).toBe(
      10 * BOSS_POINTS_PAR_COUP + BOSS_PRIME_VICTOIRE + 2 * BOSS_POINTS_PAR_COEUR,
    )
  })

  it('gagner sans être touché bat toute victoire touchée', () => {
    const propre = bossScore({ correct: 10, won: true, livesLeft: 3 })
    const touchee = bossScore({ correct: 12, won: true, livesLeft: 1 })
    expect(propre).toBeGreaterThan(touchee)
  })

  it('reste sous la borne du catalogue', () => {
    expect(bossScore({ correct: 30, won: true, livesLeft: 3 })).toBeLessThanOrEqual(
      epreuve('boss').maxScore,
    )
  })
})

describe('duelFantomeScore', () => {
  it('un duel perdu compte ses bonnes réponses', () => {
    expect(duelFantomeScore({ correct: 12, won: false, roundsLost: 2 })).toBe(1200)
  })

  it('une victoire sèche vaut la prime et le bonus 2-0', () => {
    expect(duelFantomeScore({ correct: 8, won: true, roundsLost: 0 })).toBe(
      800 + DUEL_PRIME_VICTOIRE + DUEL_PRIME_SECHE,
    )
  })

  it('un duel perdu en jouant bien peut valoir plus qu’un duel gagné mal', () => {
    const perduBien = duelFantomeScore({ correct: 12, won: false, roundsLost: 2 })
    const gagneMal = duelFantomeScore({ correct: 6, won: true, roundsLost: 1 })
    expect(perduBien).toBeGreaterThan(gagneMal)
  })
})

describe('scorePlausible', () => {
  it('accepte une partie de Blitz normale', () => {
    expect(scorePlausible('blitz', 2400, 60_000)).toBe(true)
  })

  it('refuse un score au-dessus de la borne', () => {
    expect(scorePlausible('survie', 501, 600_000)).toBe(false)
  })

  it('refuse un score gagné trop vite', () => {
    // 50 bonnes réponses d’affilée en 3 secondes : personne.
    expect(scorePlausible('survie', 50, 3_000)).toBe(false)
  })

  it('refuse une durée nulle, négative ou au-delà d’une heure', () => {
    expect(scorePlausible('blitz', 100, 0)).toBe(false)
    expect(scorePlausible('blitz', 100, -5)).toBe(false)
    expect(scorePlausible('blitz', 100, 3_600_001)).toBe(false)
  })

  it('accepte le zéro : une partie à zéro est une partie', () => {
    expect(scorePlausible('chrono', 0, 20_000)).toBe(true)
  })
})

describe('les jeux de salon, épreuves eux aussi', () => {
  it('reprend chaque jeu jouable du catalogue des salons, une fois', () => {
    expect(JEU_IDS.length).toBe(
      SALONS.reduce((n, s) => n + s.games.filter((g) => g.implemented).length, 0),
    )
    expect(new Set(JEU_IDS).size).toBe(JEU_IDS.length)
    expect(JEU_IDS).toContain('calcul-mental')
    expect(JEU_IDS).toContain('chasse-faute')
    // Un jeu retiré (19/09/2026) ne se classe plus.
    expect(JEU_IDS).not.toContain('orthographe')
    // Un jeu annoncé « bientôt » ne se classe pas.
    expect(JEU_IDS).not.toContain('pointe-carte')
  })

  it('les jeux ne recouvrent jamais un mode de l’Arène', () => {
    for (const id of JEU_IDS) expect(EPREUVE_IDS).not.toContain(id)
    expect(isJeuId('blitz')).toBe(false)
    expect(isEpreuveId('calcul-mental')).toBe(true)
  })

  it('chaque jeu porte sa matière et le barème commun', () => {
    const calcul = EPREUVES_JEUX.find((e) => e.id === 'calcul-mental')
    expect(calcul?.matiere).toBe('Maths')
    expect(calcul?.maxScore).toBe(JEU_MAX_SCORE)
    expect(calcul?.minMsParPoint).toBe(JEU_MIN_MS_PAR_POINT)
    expect(epreuve('calcul-mental').nom).toBe('Calcul mental éclair')
  })

  it('mène à la carte du jeu, pas à la salle de l’Arène', () => {
    expect(epreuveHref('calcul-mental')).toBe('/defi/jeux/calcul-mental')
    expect(formatScore('chasse-faute', 1250)).toBe('1 250 pts')
  })

  it('un score de jeu plausible passe, un score impossible non', () => {
    expect(scorePlausible('calcul-mental', 8000, 20_000)).toBe(true)
    expect(scorePlausible('calcul-mental', 8000, 5_000)).toBe(false)
    expect(scorePlausible('calcul-mental', JEU_MAX_SCORE + 1, 60_000)).toBe(false)
  })
})

describe('le miroir SQL des jeux (migration 355)', () => {
  const sql = migrationSql('355_palmares_jeux_salon.sql')

  it('chaque jeu jouable figure dans mode_catalog avec les bornes communes', () => {
    for (const e of EPREUVES_JEUX) {
      const motif = new RegExp(`\\('${e.id}',\\s*${e.maxScore},\\s*${e.minMsParPoint}\\)`)
      expect(sql, `${e.id} : absent ou bornes différentes dans la 355`).toMatch(motif)
    }
  })

  it('le SQL ne connaît aucun jeu absent du catalogue (hors jeux retirés)', () => {
    const dansLeSql = [...sql.matchAll(/^\s*\('([a-z-]+)',\s*\d+,\s*\d+\)/gm)].map((m) => m[1])
    // Les jeux retirés le 19/09/2026 restent en base, sans effet (JEUX_RETIRES).
    expect(dansLeSql.filter((id) => !JEUX_RETIRES.includes(id)).sort()).toEqual([...JEU_IDS].sort())
  })
})
