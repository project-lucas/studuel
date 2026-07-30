import TabHeader from '@/components/TabHeader'
import AmisHome from '@/components/AmisHome'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { readRowTolerant } from '@/lib/profile-read'
import {
  getMockSchool,
  avatarEmojiFor,
  buildLiveSessions,
  buildSchoolBoard,
  mapFriendsOverview,
  type Friend,
  type SchoolBoard,
  type PendingRequest,
} from '@/lib/social'
import { fetchClanWeekBoard } from '@/lib/clan-week-server'
import type { ClanWeekBoard } from '@/lib/clan-week'
import { toDayKey } from '@/lib/streak'
import { schoolLevelForGrade } from '@/lib/clan'
import { rankPlayers, type RankPlayer } from '@/lib/trophies'
import { referralSummary, STARTING_GEMS } from '@/lib/gems'
import {
  fetchGems,
  fetchReferralCounts,
  fetchSquadIds,
} from '@/lib/gems-access'

export const metadata = { title: 'Amis — Studuel' }
export const dynamic = 'force-dynamic'

// Les colonnes du profil qu'affiche cet écran, toutes migrations confondues.
type AmisProfileRow = {
  work_seconds: number | null
  friend_code: string | null
  grade_level: string | null
  trophies: number | null
  best_trophies: number | null
  squad_name: string | null
}

// Onglet social (extrême gauche). Tout est réel pour un élève connecté :
// classement aux trophées (RPC friends_trophies) enrichi de la présence en
// ligne (RPC 160) et école via le clan. Seuls le visiteur et l'élève sans
// établissement voient un aperçu mocké, signalé par la pastille « Aperçu ».
export default async function AmisPage() {
  const supabase = await createClient()
  const user = await getCurrentUser()

  const today = toDayKey(new Date())
  let ranking: RankPlayer[] = []
  let friends: Friend[] = []
  let pendingRequests: PendingRequest[] = []
  let myFriendCode = ''
  // Coffre d'équipe hebdo (migration 204) — null : carte masquée.
  let clanBoard: ClanWeekBoard | null = null
  // Nom du groupe d'amis (« squad », migration 176) et droit de le renommer
  // (réservé au leader du classement) — défauts sûrs pour le visiteur.
  let squadName: string | null = null
  let canRenameSquad = false
  // Amis en session en ce moment (RPC 160) : points verts du classement.
  let onlineFriendIds: string[] = []
  // « Mon école » : réelle si l'élève est connecté, sinon aperçu mocké
  // (visiteur). Le drapeau schoolDemo suit la vérité et affiche la pastille
  // « Aperçu » — jamais de mock déguisé en réel.
  let school: SchoolBoard = getMockSchool(0)
  let schoolDemo = true
  // Économie des gemmes (migration 183). Le visiteur voit la dotation de
  // départ et un parrainage vierge : la carte lui montre ce qu'il gagnerait,
  // ce qui est exactement le message qu'on veut lui faire passer.
  let gems = STARTING_GEMS
  let referral = referralSummary(0, 0)
  let squadIds: string[] = []

  if (user) {
    const [
      profile,
      { data: friendTrophyRows },
      { data: overviewRows },
      { data: friendStreakRows },
      { data: liveRows },
      gemsBalance,
      referralCounts,
      squadSet,
      clanBoardRes,
    ] = await Promise.all([
      // Une seule lecture de `profiles` pour toutes les colonnes de l'écran,
      // quelles que soient leurs migrations d'origine : friend_code (019),
      // grade_level (onboarding), trophies/best_trophies (079), squad_name
      // (176). `readRowTolerant` retire tout seul celles que le schéma ne
      // connaît pas encore — l'isolation d'avant, sans les trois allers-retours
      // sur la même ligne.
      readRowTolerant<AmisProfileRow>(supabase, 'profiles', 'id', user.id, [
        'work_seconds',
        'friend_code',
        'grade_level',
        'trophies',
        'best_trophies',
        'squad_name',
      ]),
      // [] tant que 079 n'est pas passée ou qu'aucun ami n'est accepté.
      supabase.rpc('friends_trophies'),
      // Amis acceptés + demandes reçues/envoyées (migration 019).
      supabase.rpc('friends_overview'),
      // Séries des amis (migration 155), pour les anneaux flamme des stories.
      // Appel ISOLÉ : si 155 n'est pas passée, il échoue seul → sans série.
      supabase.rpc('friends_streaks'),
      // « En direct » : amis actifs dans les 20 dernières minutes (migration 160).
      supabase.rpc('friends_live'),
      // Gemmes et filleuls (migration 183). Les deux helpers ont leur propre
      // repli si la migration n'est pas passée — pas de quoi casser l'onglet.
      fetchGems(supabase, user.id),
      fetchReferralCounts(supabase, user.id),
      fetchSquadIds(supabase, user.id),
      // Coffre d'équipe hebdo (migration 204) — null si pas encore en base.
      fetchClanWeekBoard(supabase),
    ])

    gems = gemsBalance
    referral = referralSummary(referralCounts.pending, referralCounts.activated)
    squadIds = [...squadSet]
    clanBoard = clanBoardRes
    myFriendCode = String(profile?.friend_code ?? '')
    const rawSquad = String(profile.squad_name ?? '').trim()
    squadName = rawSquad.length > 0 ? rawSquad : null

    // Présence réelle (vide si personne n'est actif). « Mon école » réelle via
    // le clan (cycle déduit de la classe) ; à défaut de clan, aperçu adapté au
    // cycle (avec mon vrai temps) et signalé comme tel.
    onlineFriendIds = buildLiveSessions(liveRows).map((s) => s.friend.id)
    const level = schoolLevelForGrade(profile?.grade_level ?? null)
    const { data: clanMatesRaw } = await supabase.rpc('clan_mates', {
      p_level: level,
    })
    const realSchool = buildSchoolBoard(clanMatesRaw, user.id, level)
    if (realSchool.mates.length > 0) {
      school = realSchool
      schoolDemo = false
    } else {
      school = getMockSchool(Number(profile?.work_seconds ?? 0) || 0, level)
    }

    const overview = mapFriendsOverview(
      Array.isArray(overviewRows) ? overviewRows : [],
    )
    pendingRequests = overview.incoming

    // Séries : on indexe friend_id → jours, puis on décore chaque ami de sa
    // série (0 par défaut : migration 155 absente ou ami sans activité).
    const streakById = new Map<string, number>(
      (Array.isArray(friendStreakRows) ? friendStreakRows : []).flatMap((r) => {
        const id = r?.friend_id
        const n = Number(r?.streak)
        return id && Number.isFinite(n) ? [[String(id), Math.max(0, n)]] : []
      }),
    )
    friends = overview.accepted.map((f) => ({
      ...f,
      streak: streakById.get(f.id) ?? 0,
    }))

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
        trophies: Math.max(0, Math.floor(Number(profile.trophies ?? 0))),
        isMe: true,
      },
      ...friendRanks,
    ]

    // Droit de renommer le groupe : réservé au n°1 du classement (« celui qui a
    // le plus grimpé »). Un élève solo est trivialement n°1 → peut baptiser son
    // équipe. C'est une mécanique de jeu (l'action ne touche que mon profil).
    const meRanked = rankPlayers(ranking).find((p) => p.isMe)
    canRenameSquad = meRanked?.rank === 1
  }

  return (
    <div>
      <TabHeader
        title="Amis"
        subtitle="Ton équipe, ton école et vos classements."
      />
      <AmisHome
        ranking={ranking}
        onlineFriendIds={onlineFriendIds}
        school={school}
        schoolDemo={schoolDemo}
        friends={friends}
        pendingRequests={pendingRequests}
        myFriendCode={myFriendCode}
        squadName={squadName}
        canRenameSquad={canRenameSquad}
        gems={gems}
        referral={referral}
        squadIds={squadIds}
        clanBoard={clanBoard}
        today={today}
      />
    </div>
  )
}
