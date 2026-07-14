import { describe, it, expect } from 'vitest'
import {
  leagueZone,
  sortLeague,
  sortSchool,
  schoolTotalSeconds,
  duelMissionAvailable,
  sinceLabel,
  mapFriendsOverview,
  addFriendMessage,
  type FriendOverviewRow,
} from '@/lib/social'

describe('leagueZone', () => {
  it('les 5 premiers montent, les 5 derniers descendent', () => {
    expect(leagueZone(1, 30)).toBe('promote')
    expect(leagueZone(5, 30)).toBe('promote')
    expect(leagueZone(6, 30)).toBe('safe')
    expect(leagueZone(25, 30)).toBe('safe')
    expect(leagueZone(26, 30)).toBe('relegate')
    expect(leagueZone(30, 30)).toBe('relegate')
  })
})

describe('sortLeague / sortSchool', () => {
  it('classe par XP décroissant sans muter l’original', () => {
    const entries = [
      { id: 'a', name: 'A', emoji: '🦊', xp: 10 },
      { id: 'b', name: 'B', emoji: '🐼', xp: 30 },
    ]
    const sorted = sortLeague(entries)
    expect(sorted.map((e) => e.id)).toEqual(['b', 'a'])
    expect(entries[0].id).toBe('a') // pas de mutation
  })

  it('classe l’école au temps de travail décroissant', () => {
    const mates = [
      { id: 'a', name: 'A', emoji: '🦊', seconds: 100 },
      { id: 'b', name: 'B', emoji: '🐼', seconds: 500 },
    ]
    expect(sortSchool(mates)[0].id).toBe('b')
  })
})

describe('schoolTotalSeconds', () => {
  it('somme les élèves en ignorant les valeurs négatives', () => {
    expect(
      schoolTotalSeconds([
        { id: 'a', name: 'A', emoji: '🦊', seconds: 100 },
        { id: 'b', name: 'B', emoji: '🐼', seconds: -50 },
      ]),
    ).toBe(100)
  })
})

describe('duelMissionAvailable', () => {
  it('une seule mission duel par jour', () => {
    expect(duelMissionAvailable(null, '2026-07-06')).toBe(true)
    expect(duelMissionAvailable('2026-07-05', '2026-07-06')).toBe(true)
    expect(duelMissionAvailable('2026-07-06', '2026-07-06')).toBe(false)
  })
})

describe('sinceLabel', () => {
  it('formate la présence en session', () => {
    expect(sinceLabel(0)).toBe("à l'instant")
    expect(sinceLabel(12)).toBe('depuis 12 min')
    expect(sinceLabel(90)).toBe('depuis 1 h')
  })
})

describe('mapFriendsOverview', () => {
  const rows: FriendOverviewRow[] = [
    { friend_id: 'a', full_name: 'Léa Martin', status: 'accepted', incoming: false },
    { friend_id: 'b', full_name: 'Tom', status: 'pending', incoming: true },
    { friend_id: 'c', full_name: 'Inès Dubois', status: 'pending', incoming: false },
  ]

  it('éclate les lignes en amis acceptés, demandes reçues et envoyées', () => {
    const { accepted, incoming, outgoing } = mapFriendsOverview(rows)
    expect(accepted.map((f) => f.id)).toEqual(['a'])
    expect(incoming.map((r) => r.id)).toEqual(['b'])
    expect(outgoing.map((r) => r.id)).toEqual(['c'])
  })

  it("n'affiche que le prénom et marque les amis comme réels", () => {
    const { accepted } = mapFriendsOverview(rows)
    expect(accepted[0].name).toBe('Léa')
    expect(accepted[0].real).toBe(true)
  })

  it('repli « Ami » quand le nom est vide ou nul', () => {
    const { incoming } = mapFriendsOverview([
      { friend_id: 'x', full_name: null, status: 'pending', incoming: true },
      { friend_id: 'y', full_name: '   ', status: 'pending', incoming: true },
    ])
    expect(incoming.map((r) => r.name)).toEqual(['Ami', 'Ami'])
  })

  it('ignore les lignes sans identifiant et gère null', () => {
    const dirty = [
      { friend_id: '', full_name: 'Vide', status: 'accepted', incoming: false },
    ] as FriendOverviewRow[]
    expect(mapFriendsOverview(dirty).accepted).toEqual([])
    expect(mapFriendsOverview(null).accepted).toEqual([])
  })

  it('donne un avatar stable dérivé de l’identifiant', () => {
    const first = mapFriendsOverview(rows).accepted[0].emoji
    const again = mapFriendsOverview(rows).accepted[0].emoji
    expect(first).toBe(again)
  })
})

describe('addFriendMessage', () => {
  it('marque « sent » comme succès', () => {
    expect(addFriendMessage('sent').ok).toBe(true)
  })

  it('marque tous les autres statuts comme échec avec un message', () => {
    for (const s of ['already', 'self', 'not_found', 'error'] as const) {
      const res = addFriendMessage(s)
      expect(res.ok).toBe(false)
      expect(res.message.length).toBeGreaterThan(0)
    }
  })
})
