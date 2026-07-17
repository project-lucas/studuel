import { describe, it, expect } from 'vitest'
import {
  buildLiveSessions,
  buildSchoolBoard,
  sortSchool,
  schoolNoun,
  schoolTotalSeconds,
  getMockSchool,
  getMockGeoBoard,
  geoScopeLabel,
  geoScopeTitle,
  geoScopePossessive,
  GEO_SCOPES,
  type GeoScope,
  sinceLabel,
  mapFriendsOverview,
  addFriendMessage,
  duelStatus,
  duelView,
  sortStreaks,
  type FriendOverviewRow,
  type StreakEntry,
} from '@/lib/social'

describe('sortSchool', () => {
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

describe('schoolNoun / getMockSchool', () => {
  it('nomme l’établissement selon le cycle', () => {
    expect(schoolNoun('college')).toBe('collège')
    expect(schoolNoun('lycee')).toBe('lycée')
  })

  it('l’aperçu suit le cycle (nom et level cohérents avec le titre)', () => {
    expect(getMockSchool(0).name).toBe('Collège Jean-Moulin')
    expect(getMockSchool(0).level).toBe('college')
    expect(getMockSchool(0, 'lycee').name).toBe('Lycée Jean-Moulin')
    expect(getMockSchool(0, 'lycee').level).toBe('lycee')
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

  it('marque « added » (scan de QR) comme succès immédiat', () => {
    const res = addFriendMessage('added')
    expect(res.ok).toBe(true)
    expect(res.message.length).toBeGreaterThan(0)
  })

  it('marque tous les autres statuts comme échec avec un message', () => {
    for (const s of ['already', 'self', 'not_found', 'error'] as const) {
      const res = addFriendMessage(s)
      expect(res.ok).toBe(false)
      expect(res.message.length).toBeGreaterThan(0)
    }
  })
})

describe('duelStatus', () => {
  it('compare les scores quand les deux ont joué', () => {
    expect(duelStatus(5, 3)).toBe('won')
    expect(duelStatus(2, 4)).toBe('lost')
    expect(duelStatus(3, 3)).toBe('tie')
  })

  it("attend l'adversaire quand seul moi ai joué", () => {
    expect(duelStatus(5, null)).toBe('outgoing')
  })

  it('me réclame de jouer quand je n’ai pas encore joué', () => {
    expect(duelStatus(null, 4)).toBe('incoming')
    expect(duelStatus(null, null)).toBe('incoming')
  })
})

describe('duelView', () => {
  const me = 'me-id'
  const opp = { id: 'opp', name: 'Léa', emoji: '🦊', level: 0 }

  it('lit mes scores selon mon rôle (challenger)', () => {
    const row = {
      id: 'd1',
      challenger_id: me,
      opponent_id: 'opp',
      subject: 'Maths',
      total: 5,
      challenger_score: 4,
      opponent_score: 2,
    }
    const v = duelView(row, me, opp)
    expect(v.myScore).toBe(4)
    expect(v.theirScore).toBe(2)
    expect(v.status).toBe('won')
    expect(v.opponent.name).toBe('Léa')
  })

  it('inverse les scores quand je suis l’adversaire', () => {
    const row = {
      id: 'd2',
      challenger_id: 'opp',
      opponent_id: me,
      subject: 'Histoire',
      total: 5,
      challenger_score: 5,
      opponent_score: null,
    }
    const v = duelView(row, me, opp)
    expect(v.myScore).toBeNull()
    expect(v.theirScore).toBe(5)
    expect(v.status).toBe('incoming')
  })
})

describe('sortStreaks', () => {
  const base: StreakEntry[] = [
    { id: 'a', name: 'Alice', emoji: '🦊', streak: 3 },
    { id: 'me', name: 'Toi', emoji: '🔥', streak: 7, isMe: true },
    { id: 'b', name: 'Bob', emoji: '🐼', streak: 12 },
  ]

  it('classe par série décroissante sans muter l’original', () => {
    const sorted = sortStreaks(base)
    expect(sorted.map((e) => e.id)).toEqual(['b', 'me', 'a'])
    expect(base[0].id).toBe('a') // original intact
  })

  it('à égalité de série, « Toi » passe devant', () => {
    const tie: StreakEntry[] = [
      { id: 'x', name: 'Zoé', emoji: '🐝', streak: 5 },
      { id: 'me', name: 'Toi', emoji: '🔥', streak: 5, isMe: true },
    ]
    expect(sortStreaks(tie).map((e) => e.id)).toEqual(['me', 'x'])
  })

  it('à égalité sans moi, ordre alphabétique stable', () => {
    const tie: StreakEntry[] = [
      { id: 'z', name: 'Zoé', emoji: '🐝', streak: 4 },
      { id: 'a', name: 'Ana', emoji: '🦉', streak: 4 },
    ]
    expect(sortStreaks(tie).map((e) => e.name)).toEqual(['Ana', 'Zoé'])
  })
})

describe('buildLiveSessions', () => {
  it('mappe les lignes friends_live en sessions (type → activité)', () => {
    const sessions = buildLiveSessions([
      { friend_id: 'f1', full_name: 'Léa Martin', kind: 'defi', minutes: 3 },
      { friend_id: 'f2', full_name: 'Rayan', kind: 'quiz', minutes: 12 },
      { friend_id: 'f3', full_name: 'Inès', kind: 'inconnu', minutes: 0 },
    ])
    expect(sessions).toHaveLength(3)
    expect(sessions[0].friend.name).toBe('Léa') // prénom seul
    expect(sessions[0].activity).toBe('fait un défi')
    expect(sessions[0].minutes).toBe(3)
    expect(sessions[1].subject).toBe('Quiz')
    // Type inconnu → repli sur « révise ».
    expect(sessions[2].activity).toBe('révise')
  })

  it('jette les lignes sans id, tolère un non-tableau', () => {
    expect(buildLiveSessions([{ full_name: 'X', kind: 'defi' }])).toEqual([])
    expect(buildLiveSessions(null)).toEqual([])
  })
})

describe('buildSchoolBoard', () => {
  it('construit le tableau école, marque « Toi », trie par temps', () => {
    const board = buildSchoolBoard(
      {
        school_name: 'Lycée Hugo',
        mates: [
          { id: 'a', name: 'Ana', seconds: 100 },
          { id: 'me', name: 'Lucas', seconds: 500 },
        ],
      },
      'me',
    )
    expect(board.name).toBe('Lycée Hugo')
    expect(board.mates[0]).toMatchObject({ id: 'me', name: 'Toi', isMe: true })
    expect(board.mates[1]).toMatchObject({ id: 'a', name: 'Ana' })
  })

  it('porte le cycle demandé (collège par défaut)', () => {
    expect(buildSchoolBoard(null, 'me').level).toBe('college')
    expect(buildSchoolBoard(null, 'me', 'lycee').level).toBe('lycee')
  })

  it('forme vide → école sans nom, sans camarade', () => {
    expect(buildSchoolBoard(null, 'me')).toEqual({
      name: '',
      emoji: '🏫',
      level: 'college',
      mates: [],
    })
  })
})

describe('échelons géographiques', () => {
  it('couvre les 4 échelons dans l’ordre', () => {
    expect(GEO_SCOPES).toEqual(['school', 'dept', 'region', 'national'])
  })

  it('libellé d’onglet : l’établissement suit le cycle', () => {
    expect(geoScopeLabel('school', 'lycee')).toBe('Lycée')
    expect(geoScopeLabel('school', 'college')).toBe('Collège')
    expect(geoScopeLabel('dept', 'lycee')).toBe('Département')
    expect(geoScopeLabel('national', 'college')).toBe('National')
  })

  it('titre et groupe nominal cohérents par échelon', () => {
    expect(geoScopeTitle('school', 'lycee')).toBe('Ton lycée')
    expect(geoScopeTitle('region', 'lycee')).toBe('Ta région')
    expect(geoScopePossessive('national', 'college')).toBe('la France')
    expect(geoScopePossessive('school', 'college')).toBe('ton collège')
  })

  it('échelon établissement → réutilise l’aperçu d’école', () => {
    const board = getMockGeoBoard('school', 10 * 3600, 'lycee')
    expect(board).toEqual(getMockSchool(10 * 3600, 'lycee'))
  })

  it('échelon large → me place au bon rang selon mon vrai temps', () => {
    // Petit temps : « Toi » finit dernier du vivier national (on grimpe en bossant).
    const low = getMockGeoBoard('national', 1 * 3600, 'lycee')
    expect(low.name).toBe('France')
    expect(low.mates.at(-1)).toMatchObject({ id: 'me', isMe: true })

    // Gros temps : « Toi » remonte en tête.
    const high = getMockGeoBoard('national', 9999 * 3600, 'lycee')
    expect(high.mates[0]).toMatchObject({ id: 'me', isMe: true })
  })

  it('chaque échelon large porte un nom, un vivier et un seul « Toi »', () => {
    for (const scope of GEO_SCOPES.filter((s) => s !== 'school') as GeoScope[]) {
      const board = getMockGeoBoard(scope, 5 * 3600, 'college')
      expect(board.name.length).toBeGreaterThan(0)
      expect(board.mates.length).toBeGreaterThan(1)
      expect(board.mates.filter((m) => m.isMe)).toHaveLength(1)
    }
  })
})
