import PageHeader from '@/components/PageHeader'
import AmisHome from '@/components/AmisHome'
import { createClient } from '@/lib/supabase/server'
import {
  getMockSchool,
  avatarEmojiFor,
  buildLiveSessions,
  buildSchoolBoard,
  mapFriendsOverview,
  sortStreaks,
  type Friend,
  type SchoolBoard,
  type PendingRequest,
  type StreakEntry,
} from '@/lib/social'
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

// Onglet social (extrême gauche). Tout est réel pour un élève connecté :
// classement aux trophées (RPC friends_trophies) enrichi de la présence en
// ligne (RPC 160) et école via le clan. Seuls le visiteur et l'élève sans
// établissement voient un aperçu mocké, signalé par la pastille « Aperçu ».
export default async function AmisPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let ranking: RankPlayer[] = []
  let friends: Friend[] = []
  let pendingRequests: PendingRequest[] = []
  let streaks: StreakEntry[] = []
  let myFriendCode = ''
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
      { data: profile },
      { data: trophyRow },
      { data: friendTrophyRows },
      { data: overviewRows },
      { data: friendStreakRows },
      { data: myStreakRaw },
      { data: liveRows },
      { data: squadRow },
      gemsBalance,
      referralCounts,
      squadSet,
    ] = await Promise.all([
      // friend_code vit sur profiles depuis 019 (déjà en base) → sûr à lire ici.
      // grade_level (onboarding) sert à choisir le cycle du clan (collège/lycée).
      supabase
        .from('profiles')
        .select('work_seconds, friend_code, grade_level')
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
      // Séries des amis + ma série (migration 155). Appels ISOLÉS : si 155 n'est
      // pas passée, ils échouent seuls → repli sans série, sans casser le reste.
      supabase.rpc('friends_streaks'),
      supabase.rpc('my_streak'),
      // « En direct » : amis actifs dans les 20 dernières minutes (migration 160).
      supabase.rpc('friends_live'),
      // Nom du groupe (squad_name, 176), select ISOLÉ : si la migration n'est
      // pas passée, il échoue seul → nom par défaut, sans casser le reste.
      supabase
        .from('profiles')
        .select('squad_name')
        .eq('id', user.id)
        .maybeSingle(),
      // Gemmes et filleuls (migration 183). Les deux helpers ont leur propre
      // repli si la migration n'est pas passée — pas de quoi casser l'onglet.
      fetchGems(supabase, user.id),
      fetchReferralCounts(supabase, user.id),
      fetchSquadIds(supabase, user.id),
    ])

    gems = gemsBalance
    referral = referralSummary(referralCounts.pending, referralCounts.activated)
    squadIds = [...squadSet]
    myFriendCode = String(profile?.friend_code ?? '')
    const rawSquad = String(squadRow?.squad_name ?? '').trim()
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

    // Mini-classement des séries : moi + mes amis, trié par jours décroissants.
    const myStreak = Math.max(0, Number(myStreakRaw ?? 0) || 0)
    streaks = sortStreaks([
      { id: 'me', name: 'Toi', emoji: '🔥', streak: myStreak, isMe: true },
      ...friends.map((f) => ({
        id: f.id,
        name: f.name,
        emoji: f.emoji,
        streak: f.streak ?? 0,
      })),
    ])

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

    // Droit de renommer le groupe : réservé au n°1 du classement (« celui qui a
    // le plus grimpé »). Un élève solo est trivialement n°1 → peut baptiser son
    // équipe. C'est une mécanique de jeu (l'action ne touche que mon profil).
    const meRanked = rankPlayers(ranking).find((p) => p.isMe)
    canRenameSquad = meRanked?.rank === 1
  }

  return (
    <div>
      <PageHeader
        title="Amis"
        description="Défie, rejoins, grimpe — ton cerveau contre les leurs."
      />
      <AmisHome
        ranking={ranking}
        onlineFriendIds={onlineFriendIds}
        streaks={streaks}
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
      />
    </div>
  )
}
