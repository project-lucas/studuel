import { describe, it, expect } from 'vitest'
import {
  weekdayIndex,
  weekKeyOf,
  weekBounds,
  daysLeftInWeek,
  countdownLabel,
  isEndgame,
  clanPointsFor,
  cappedContribution,
  clanWeekReward,
  gapHeadline,
  myShare,
  normalizeClanWeekBoard,
  DAILY_CONTRIBUTION_CAP,
  MIN_POINTS_TO_CLAIM,
  CLAN_POINTS,
  type ClanWeekBoard,
} from './clan-week'

// 2026-07-20 = lundi · 2026-07-25 = samedi · 2026-07-26 = dimanche
const LUNDI = '2026-07-20'
const SAMEDI = '2026-07-25'
const DIMANCHE = '2026-07-26'

describe('weekdayIndex', () => {
  it('place lundi à 0 et dimanche à 6 (convention projet)', () => {
    expect(weekdayIndex(LUNDI)).toBe(0)
    expect(weekdayIndex(SAMEDI)).toBe(5)
    expect(weekdayIndex(DIMANCHE)).toBe(6)
  })

  it('retombe sur 0 pour une date illisible', () => {
    expect(weekdayIndex('pas-une-date')).toBe(0)
  })
})

describe('weekKeyOf', () => {
  it('donne le lundi de la semaine', () => {
    expect(weekKeyOf(SAMEDI)).toBe(LUNDI)
    expect(weekKeyOf(DIMANCHE)).toBe(LUNDI)
    expect(weekKeyOf(LUNDI)).toBe(LUNDI)
  })

  it('bascule de semaine le lundi suivant', () => {
    expect(weekKeyOf('2026-07-27')).toBe('2026-07-27')
  })

  it('traverse un changement de mois', () => {
    // 2026-08-02 est un dimanche : sa semaine commence le 27 juillet.
    expect(weekKeyOf('2026-08-02')).toBe('2026-07-27')
  })
})

describe('weekBounds', () => {
  it('va du lundi au dimanche', () => {
    expect(weekBounds(LUNDI)).toEqual({ start: LUNDI, end: DIMANCHE })
  })

  it('se normalise depuis n’importe quel jour de la semaine', () => {
    expect(weekBounds(SAMEDI)).toEqual({ start: LUNDI, end: DIMANCHE })
  })
})

describe('daysLeftInWeek', () => {
  it('compte 7 jours le lundi et 1 le dimanche', () => {
    expect(daysLeftInWeek(LUNDI)).toBe(7)
    expect(daysLeftInWeek(SAMEDI)).toBe(2)
    expect(daysLeftInWeek(DIMANCHE)).toBe(1)
  })

  it('n’atteint jamais zéro tant que la semaine court', () => {
    for (const d of [LUNDI, SAMEDI, DIMANCHE]) {
      expect(daysLeftInWeek(d)).toBeGreaterThan(0)
    }
  })
})

describe('countdownLabel & isEndgame', () => {
  it('durcit le ton en fin de semaine', () => {
    expect(countdownLabel(LUNDI)).toBe('7 jours restants')
    expect(countdownLabel(SAMEDI)).toBe('Plus que 2 jours')
    expect(countdownLabel(DIMANCHE)).toBe('Dernier jour !')
  })

  it('déclare la fin de partie à deux jours', () => {
    expect(isEndgame(LUNDI)).toBe(false)
    expect(isEndgame(SAMEDI)).toBe(true)
    expect(isEndgame(DIMANCHE)).toBe(true)
  })
})

describe('barème de contribution', () => {
  it('récompense la victoire plus que la participation', () => {
    expect(clanPointsFor('duel_win')).toBeGreaterThan(clanPointsFor('duel_play'))
  })

  it('récompense la présence même sans victoire', () => {
    expect(clanPointsFor('duel_play')).toBeGreaterThan(0)
  })

  it('couvre tous les événements du barème', () => {
    for (const key of Object.keys(CLAN_POINTS)) {
      expect(clanPointsFor(key as keyof typeof CLAN_POINTS)).toBeGreaterThan(0)
    }
  })
})

describe('cappedContribution', () => {
  it('laisse passer un gain sous le plafond', () => {
    expect(cappedContribution(0, 30)).toBe(30)
    expect(cappedContribution(100, 50)).toBe(50)
  })

  it('écrête au plafond quotidien', () => {
    expect(cappedContribution(DAILY_CONTRIBUTION_CAP - 10, 100)).toBe(10)
    expect(cappedContribution(DAILY_CONTRIBUTION_CAP, 100)).toBe(0)
    expect(cappedContribution(DAILY_CONTRIBUTION_CAP + 500, 100)).toBe(0)
  })

  it('ignore les valeurs négatives', () => {
    expect(cappedContribution(-50, -10)).toBe(0)
  })
})

describe('clanWeekReward', () => {
  it('refuse la récompense sans contribution personnelle suffisante', () => {
    expect(clanWeekReward(1, MIN_POINTS_TO_CLAIM - 1).tier).toBe('aucune')
    expect(clanWeekReward(1, MIN_POINTS_TO_CLAIM - 1).gems).toBe(0)
  })

  it('ouvre le coffre dès le seuil atteint', () => {
    expect(clanWeekReward(1, MIN_POINTS_TO_CLAIM).tier).toBe('or')
  })

  it('décroît avec le rang', () => {
    const or = clanWeekReward(1, 500)
    const argent = clanWeekReward(3, 500)
    const bronze = clanWeekReward(10, 500)
    const part = clanWeekReward(42, 500)
    expect(or.gems).toBeGreaterThan(argent.gems)
    expect(argent.gems).toBeGreaterThan(bronze.gems)
    expect(bronze.gems).toBeGreaterThan(part.gems)
    expect(part.gems).toBeGreaterThan(0)
  })

  it('ne récompense pas un clan sans classement', () => {
    expect(clanWeekReward(null, 500).tier).toBe('aucune')
    expect(clanWeekReward(0, 500).tier).toBe('aucune')
  })
})

function makeBoard(over: Partial<ClanWeekBoard> = {}): ClanWeekBoard {
  return {
    weekKey: LUNDI,
    myClan: {
      schoolId: 's2',
      schoolName: 'Collège Jean Moulin',
      points: 800,
      members: 12,
      rank: 2,
    },
    myPoints: 200,
    topMembers: [],
    entries: [
      { schoolId: 's1', schoolName: 'Collège Victor Hugo', points: 950, members: 15, rank: 1 },
      { schoolId: 's2', schoolName: 'Collège Jean Moulin', points: 800, members: 12, rank: 2 },
    ],
    total: 2,
    ...over,
  }
}

describe('gapHeadline', () => {
  it('donne les points qui manquent pour doubler le clan du dessus', () => {
    expect(gapHeadline(makeBoard())).toBe('150 points pour doubler Collège Victor Hugo')
  })

  it('félicite le clan en tête', () => {
    const board = makeBoard({
      myClan: { schoolId: 's1', schoolName: 'A', points: 950, members: 15, rank: 1 },
    })
    expect(gapHeadline(board)).toContain('en tête')
  })

  it('signale une égalité', () => {
    const board = makeBoard({
      myClan: { schoolId: 's2', schoolName: 'B', points: 950, members: 12, rank: 2 },
    })
    expect(gapHeadline(board)).toContain('égalité')
  })

  it('invite à rejoindre une école sans clan', () => {
    expect(gapHeadline(makeBoard({ myClan: null }))).toContain('Rejoins')
  })
})

describe('myShare', () => {
  it('calcule ma part du total du clan', () => {
    expect(myShare(makeBoard())).toBe(25)
  })

  it('vaut zéro sans clan ou sans points', () => {
    expect(myShare(makeBoard({ myClan: null }))).toBe(0)
    expect(
      myShare(
        makeBoard({
          myClan: { schoolId: 's', schoolName: 'X', points: 0, members: 1, rank: 1 },
        }),
      ),
    ).toBe(0)
  })

  it('ne dépasse jamais 100 %', () => {
    expect(myShare(makeBoard({ myPoints: 9999 }))).toBe(100)
  })
})

describe('semaine précédente', () => {
  it('recule d’exactement une semaine, quel que soit le jour', async () => {
    const { lastWeekKey } = await import('./clan-week-server')
    expect(lastWeekKey(LUNDI)).toBe('2026-07-13')
    expect(lastWeekKey(SAMEDI)).toBe('2026-07-13')
    expect(lastWeekKey(DIMANCHE)).toBe('2026-07-13')
  })

  it('traverse un changement de mois', async () => {
    const { lastWeekKey } = await import('./clan-week-server')
    // Semaine du 3 août 2026 (lundi) → semaine du 27 juillet.
    expect(lastWeekKey('2026-08-05')).toBe('2026-07-27')
  })
})

describe('normalizeClanWeekBoard', () => {
  it('lit une réponse complète', () => {
    const board = normalizeClanWeekBoard(
      {
        week_key: LUNDI,
        my_clan: { school_id: 's2', school_name: 'Jean Moulin', points: 800, members: 12, rank: 2 },
        my_points: 200,
        top_members: [
          { id: 'u1', name: 'Léa', points: 300 },
          { id: 'u2', name: 'Sam', points: 500 },
        ],
        entries: [
          { school_id: 's2', school_name: 'Jean Moulin', points: 800, members: 12, rank: 2 },
          { school_id: 's1', school_name: 'Victor Hugo', points: 950, members: 15, rank: 1 },
        ],
        total: 2,
      },
      SAMEDI,
    )
    expect(board.myClan?.schoolName).toBe('Jean Moulin')
    expect(board.myPoints).toBe(200)
    expect(board.entries[0].rank).toBe(1) // trié par rang
    expect(board.topMembers[0].name).toBe('Sam') // trié par points
  })

  it('survit à une réponse vide ou nulle', () => {
    const board = normalizeClanWeekBoard(null, SAMEDI)
    expect(board.weekKey).toBe(LUNDI)
    expect(board.myClan).toBeNull()
    expect(board.entries).toEqual([])
    expect(board.myPoints).toBe(0)
  })

  it('écarte les lignes sans école et nomme les anonymes', () => {
    const board = normalizeClanWeekBoard(
      {
        entries: [{ school_name: 'Sans id' }, { school_id: 's1', points: 10, rank: 1 }],
        top_members: [{ id: 'u1' }, { name: 'orphelin' }],
      },
      SAMEDI,
    )
    expect(board.entries).toHaveLength(1)
    expect(board.entries[0].schoolName).toBe('École')
    expect(board.topMembers).toHaveLength(1)
    expect(board.topMembers[0].name).toBe('Élève')
  })

  it('n’accepte jamais de points négatifs', () => {
    const board = normalizeClanWeekBoard(
      { my_points: -50, entries: [{ school_id: 's1', points: -10, rank: -3 }] },
      SAMEDI,
    )
    expect(board.myPoints).toBe(0)
    expect(board.entries[0].points).toBe(0)
    expect(board.entries[0].rank).toBe(1)
  })
})
