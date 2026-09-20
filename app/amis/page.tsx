import WorldBackdrop from '@/components/WorldBackdrop'
import AmisHome from '@/components/AmisHome'
import OralListenCard from '@/components/amis/OralListenCard'
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
import { getDemandesRecues } from '@/lib/coach/oral-server'
import { fetchClanWeekBoard } from '@/lib/clan-week-server'
import type { ClanWeekBoard } from '@/lib/clan-week'
import { toDayKey } from '@/lib/streak'
import { schoolLevelForGrade } from '@/lib/clan'
import { rankPlayers, type RankPlayer } from '@/lib/trophies'
import { referralSummary } from '@/lib/gems'
import { fetchReferralCounts, fetchSquadIds } from '@/lib/gems-access'

export const metadata = { title: 'Amis — Studuel' }
export const dynamic = 'force-dynamic'

// Les colonnes du profil qu'affiche cet écran, toutes migrations confondues.
type AmisProfileRow = {
  friend_code: string | null
  grade_level: string | null
  trophies: number | null
  best_trophies: number | null
  squad_name: string | null
  avatar: unknown
}

// Onglet social (extrême gauche). Tout est réel pour un élève connecté :
// classement aux trophées (RPC friends_trophies) enrichi de la présence en
// ligne (RPC 160) et école via le clan (RPC clan_mates, aux trophées depuis
// la 362). Seuls le visiteur et l'élève sans
// établissement voient un aperçu mocké, signalé par la pastille « Aperçu ».
export default async function AmisPage() {
  const [supabase, user] = await Promise.all([createClient(), getCurrentUser()])

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
  // Parrainage (migration 183). Le visiteur voit un parrainage vierge : la
  // carte lui montre ce qu'il gagnerait, ce qui est exactement le message
  // qu'on veut lui faire passer.
  let referral = referralSummary(0, 0)
  let squadIds: string[] = []
  let ecoutes: Awaited<ReturnType<typeof getDemandesRecues>> = {
    disponible: false,
    demandes: [],
  }

  if (user) {
    // UNE VAGUE (19/09/2026, chantier latence). L'onglet en faisait trois : la
    // grande lecture, puis l'école (`clan_mates`, qui n'attend que la classe),
    // puis les demandes d'écoute (qui n'attendent rien). L'école est désormais
    // CHAÎNÉE sur le seul profil, et les demandes partent avec le reste.
    const profileP = readRowTolerant<AmisProfileRow>(supabase, 'profiles', 'id', user.id, [
      'friend_code',
      'grade_level',
      'trophies',
      'best_trophies',
      'squad_name',
      'avatar',
    ])
    const clanMatesP = profileP.then((p) =>
      supabase.rpc('clan_mates', {
        p_level: schoolLevelForGrade(p?.grade_level ?? null),
      }),
    )
    const [
      profile,
      { data: friendTrophyRows },
      { data: overviewRows },
      { data: friendStreakRows },
      { data: liveRows },
      referralCounts,
      squadSet,
      clanBoardRes,
      { data: portraitRows },
      { data: clanMatesRaw },
      demandesEcoute,
    ] = await Promise.all([
      // Une seule lecture de `profiles` pour toutes les colonnes de l'écran,
      // quelles que soient leurs migrations d'origine : friend_code (019),
      // grade_level (onboarding), trophies/best_trophies (079), squad_name
      // (176). `readRowTolerant` retire tout seul celles que le schéma ne
      // connaît pas encore — l'isolation d'avant, sans les trois allers-retours
      // sur la même ligne.
      profileP,
      // [] tant que 079 n'est pas passée ou qu'aucun ami n'est accepté.
      supabase.rpc('friends_trophies'),
      // Amis acceptés + demandes reçues/envoyées (migration 019).
      supabase.rpc('friends_overview'),
      // Séries des amis (migration 155), pour les anneaux flamme des stories.
      // Appel ISOLÉ : si 155 n'est pas passée, il échoue seul → sans série.
      supabase.rpc('friends_streaks'),
      // « En direct » : amis actifs dans les 20 dernières minutes (migration 160).
      supabase.rpc('friends_live'),
      // Filleuls (migration 183) : repli propre si la migration n'est pas
      // passée — pas de quoi casser l'onglet.
      fetchReferralCounts(supabase, user.id),
      fetchSquadIds(supabase, user.id),
      // Coffre d'équipe hebdo (migration 204) — null si pas encore en base.
      fetchClanWeekBoard(supabase),
      // Blasons des amis (migration 363). Absente : chacun garde un blason
      // fixe déduit de son id (lib/portraits.portraitPourId).
      supabase.rpc('friends_portraits'),
      clanMatesP,
      // Barreau 4 de l'échelle de l'oral (migration 222) : les amis qui
      // demandent qu'on les écoute.
      getDemandesRecues(supabase),
    ])
    ecoutes = demandesEcoute

    const portraitById = new Map<string, string>(
      (Array.isArray(portraitRows) ? portraitRows : []).flatMap((r) =>
        r?.friend_id && typeof r.portrait === 'string'
          ? [[String(r.friend_id), r.portrait]]
          : [],
      ),
    )
    const avatarBrut = (profile?.avatar ?? {}) as { portrait?: unknown }
    const monPortrait =
      typeof avatarBrut.portrait === 'string' ? avatarBrut.portrait : ''

    referral = referralSummary(referralCounts.pending, referralCounts.activated)
    squadIds = [...squadSet]
    clanBoard = clanBoardRes
    myFriendCode = String(profile?.friend_code ?? '')
    const rawSquad = String(profile.squad_name ?? '').trim()
    squadName = rawSquad.length > 0 ? rawSquad : null

    // Présence réelle (vide si personne n'est actif). « Mon école » réelle via
    // le clan (cycle déduit de la classe), classée AUX TROPHÉES (migration
    // 362) ; à défaut de clan, aperçu adapté au cycle (avec mes vrais
    // trophées) et signalé comme tel.
    onlineFriendIds = buildLiveSessions(liveRows).map((s) => s.friend.id)
    const level = schoolLevelForGrade(profile?.grade_level ?? null)
    const myTrophies = Math.max(0, Math.floor(Number(profile.trophies ?? 0)))
    const realSchool = buildSchoolBoard(clanMatesRaw, user.id, level)
    // Ma ligne porte MON blason, même si la RPC (avant 363) ne le donne pas.
    realSchool.mates = realSchool.mates.map((m) =>
      m.isMe ? { ...m, portrait: monPortrait } : m,
    )
    if (realSchool.mates.length > 0) {
      school = realSchool
      schoolDemo = false
    } else {
      const apercu = getMockSchool(myTrophies, level)
      school = {
        ...apercu,
        mates: apercu.mates.map((m) =>
          m.isMe ? { ...m, portrait: monPortrait } : m,
        ),
      }
    }

    const overview = mapFriendsOverview(
      Array.isArray(overviewRows) ? overviewRows : [],
    )
    pendingRequests = overview.incoming.map((r) => ({
      ...r,
      portrait: portraitById.get(r.id) ?? '',
    }))

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
      portrait: portraitById.get(f.id) ?? '',
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
          portrait: portraitById.get(String(id)) ?? '',
          trophies: Math.max(0, Math.floor(trophies)),
        },
      ]
    })

    ranking = [
      {
        id: 'me',
        name: 'Toi',
        emoji: '🔥',
        portrait: monPortrait,
        trophies: myTrophies,
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

  // Les demandes d'écoute (oral) : le seul usage social du produit qui ne
  // soit pas une comparaison — d'où leur place TOUT EN HAUT, avant les
  // classements : quelqu'un attend quelque chose de toi, ça passe avant ton rang.
  return (
    <div>
      {/* Le fond de l'onglet. Porté sur <body> par WorldBackdrop (et pas posé
          ici en `fixed`) : un transform sur un ancêtre recadrerait un fond
          fixé dans la page. */}
      <WorldBackdrop className="tab-bg" />

      {/* Plus de titre d'onglet (Lucas, 16/09/2026) : le mot « Amis » vit sous
          l'icône active de la barre, l'écran commence par son contenu. */}
      <OralListenCard
        className="mb-4"
        demandes={ecoutes.demandes.map((d) => ({
          id: d.id,
          sujet: d.sujet,
          epreuve: d.epreuve,
          nom: d.nom,
        }))}
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
        referral={referral}
        squadIds={squadIds}
        clanBoard={clanBoard}
        today={today}
      />
    </div>
  )
}
