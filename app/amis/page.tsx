import PageHeader from '@/components/PageHeader'
import AmisHome from '@/components/AmisHome'
import { createClient } from '@/lib/supabase/server'
import { toDayKey } from '@/lib/streak'
import {
  getMockLive,
  getMockSchool,
  avatarEmojiFor,
  mapFriendsOverview,
  duelView,
  MOCK_PRIORITY_SUBJECT,
  type Friend,
  type Duel,
  type DuelRow,
  type PendingRequest,
} from '@/lib/social'
import type { RankPlayer } from '@/lib/trophies'

export const metadata = { title: 'Amis — Studuel' }
export const dynamic = 'force-dynamic'

// Onglet social (extrême gauche). Le classement à l'XP mock a été remplacé par
// le VRAI classement aux trophées (mode classé du Défi) : mes trophées +
// ceux de mes amis acceptés (RPC friends_trophies). En direct, duels et école
// restent des données de démonstration pour l'instant.
export default async function AmisPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let mySeconds = 0
  let ranking: RankPlayer[] = []
  let friends: Friend[] = []
  let pendingRequests: PendingRequest[] = []
  let duels: Duel[] = []
  let missionDoneAgainst: string | null = null
  let myFriendCode = ''
  const today = toDayKey(new Date())

  if (user) {
    const [
      { data: profile },
      { data: trophyRow },
      { data: friendTrophyRows },
      { data: overviewRows },
      { data: duelRows },
    ] = await Promise.all([
      // friend_code vit sur profiles depuis 019 (déjà en base) → sûr à lire ici.
      supabase
        .from('profiles')
        .select('work_seconds, friend_code')
        .eq('id', user.id)
        .maybeSingle(),
      // Select ISOLÉ : si la migration 079 n'est pas passée (colonnes
      // absentes), il échoue seul → repli 0, sans casser le reste.
      supabase
        .from('profiles')
        .select('trophies, best_trophies')
        .eq('id', user.id)
        .maybeSingle(),
      // [] tant que 079 n'est pas passée ou qu'aucun ami n'est accepté.
      supabase.rpc('friends_trophies'),
      // Amis acceptés + demandes reçues/envoyées (migration 019).
      supabase.rpc('friends_overview'),
      // Mes duels (RLS : uniquement ceux où je participe), récents d'abord.
      supabase
        .from('duels')
        .select(
          'id, challenger_id, opponent_id, subject, total, challenger_score, opponent_score, day',
        )
        .order('created_at', { ascending: false })
        .limit(20),
    ])

    mySeconds = Number(profile?.work_seconds ?? 0) || 0
    myFriendCode = String(profile?.friend_code ?? '')

    const overview = mapFriendsOverview(
      Array.isArray(overviewRows) ? overviewRows : [],
    )
    friends = overview.accepted
    pendingRequests = overview.incoming

    // Adversaires de duel = amis acceptés → on résout prénom/emoji localement.
    const friendById = new Map(friends.map((f) => [f.id, f]))
    const rows = (Array.isArray(duelRows) ? duelRows : []) as (DuelRow & {
      day?: string
    })[]
    duels = rows.map((row) => {
      const oppId = row.challenger_id === user.id ? row.opponent_id : row.challenger_id
      const opponent: Friend = friendById.get(oppId) ?? {
        id: oppId,
        name: 'Ami',
        emoji: avatarEmojiFor(oppId),
        level: 0,
      }
      return duelView(row, user.id, opponent)
    })

    // Mission du jour déjà lancée ? = un duel créé aujourd'hui par moi.
    const todaysOutgoing = rows.find(
      (r) => r.challenger_id === user.id && String(r.day ?? '') === today,
    )
    if (todaysOutgoing) {
      const oppId = todaysOutgoing.opponent_id
      missionDoneAgainst = friendById.get(oppId)?.name ?? 'un ami'
    }

    const friendRanks: RankPlayer[] = (
      Array.isArray(friendTrophyRows) ? friendTrophyRows : []
    ).flatMap((r) => {
      const id = r?.friend_id
      const trophies = Number(r?.trophies)
      if (!id || !Number.isFinite(trophies)) return []
      return [
        {
          id: String(id),
          name: String(r.full_name ?? 'Ami').split(' ')[0] || 'Ami',
          emoji: avatarEmojiFor(String(id)),
          trophies: Math.max(0, Math.floor(trophies)),
        },
      ]
    })

    ranking = [
      {
        id: 'me',
        name: 'Toi',
        emoji: '🔥',
        trophies: Math.max(0, Math.floor(Number(trophyRow?.trophies ?? 0))),
        isMe: true,
      },
      ...friendRanks,
    ]
  }

  return (
    <div>
      <PageHeader
        title="Amis"
        description="Défie, rejoins, grimpe — ton cerveau contre les leurs."
      />
      <AmisHome
        live={getMockLive()}
        duels={duels}
        ranking={ranking}
        school={getMockSchool(mySeconds)}
        friends={friends}
        pendingRequests={pendingRequests}
        myFriendCode={myFriendCode}
        missionDoneAgainst={missionDoneAgainst}
        prioritySubject={MOCK_PRIORITY_SUBJECT}
      />
    </div>
  )
}
