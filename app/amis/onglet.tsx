import AmisHome from '@/components/AmisHome'
import OralListenCard from '@/components/amis/OralListenCard'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { readRowTolerant } from '@/lib/profile-read'
import {
  buildLiveSessions,
  mapFriendsOverview,
  type Friend,
  type PendingRequest,
} from '@/lib/social'
import { getDemandesRecues } from '@/lib/coach/oral-server'
import { referralSummary } from '@/lib/gems'
import { fetchReferralCounts, fetchSquadIds } from '@/lib/gems-access'
import { lireLigue } from '@/lib/ligue-server'
import { ligueApercu } from '@/lib/ligue-apercu'
import { classerAmis, type EtatLigue, type JoueurAmi } from '@/lib/ligue'
import { avatarAffiche } from '@/lib/avatar-affiche'

// Les colonnes du profil qu'affiche cet écran, toutes migrations confondues.
type AmisProfileRow = {
  friend_code: string | null
  squad_name: string | null
  avatar: unknown
}

/**
 * L'ONGLET AMIS, construit dès l'ouverture de l'app et gardé vivant,
 * comme les écrans de Clash Royale : il est rendu par la mise en page racine
 * (`app/layout.tsx`, via `components/OngletsVivants`), jamais par une page —
 * `app/amis/page.tsx` ne porte que le titre. Voir `lib/nav-tabs`
 * (`ongletVivant`) et `docs/latence.md`.
 *
 * Son cœur est la LIGUE DE LA SEMAINE (migration 376, `lib/ligue`) : un
 * groupe de 30 classé à l'XP, les divisions Bronze 4 → Maître, le bonus
 * d'amis. Tout est réel pour un élève connecté ; le visiteur voit une ligue
 * d'exemple signalée « Aperçu ».
 */
export default async function OngletAmis() {
  const [supabase, user] = await Promise.all([createClient(), getCurrentUser()])

  const maintenant = new Date()

  if (!user) {
    return (
      <div>
        <h1 className="sr-only">Amis</h1>
        <AmisHome
          connecte={false}
          ligue={ligueApercu({ maintenant })}
          ligueApercu
          joueurs={[]}
          monId="visiteur"
          monPortrait=""
          monAvatar={null}
          onlineFriendIds={[]}
          friends={[]}
          pendingRequests={[]}
          myFriendCode=""
          squadName={null}
          canRenameSquad={false}
          referral={referralSummary(0, 0)}
          squadIds={[]}
          maintenantIso={maintenant.toISOString()}
        />
      </div>
    )
  }

  // UNE VAGUE (chantier latence du 19/09/2026) : tout part en même temps.
  const [
    profile,
    ligue,
    { data: overviewRows },
    { data: friendStreakRows },
    { data: liveRows },
    referralCounts,
    squadSet,
    { data: portraitRows },
    ecoutes,
  ] = await Promise.all([
    // Une seule lecture de `profiles` ; `readRowTolerant` retire les colonnes
    // que le schéma ne connaît pas encore.
    readRowTolerant<AmisProfileRow>(supabase, 'profiles', 'id', user.id, [
      'friend_code',
      'squad_name',
      'avatar',
    ]),
    // La ligue de la semaine (376) : clôture, groupe, amis et bilan en un appel.
    // null tant que la migration n'est pas passée — « La ligue ouvre bientôt ».
    lireLigue(supabase),
    // Amis acceptés + demandes reçues/envoyées (migration 019).
    supabase.rpc('friends_overview'),
    // Séries des amis (155), pour les anneaux flamme des stories.
    supabase.rpc('friends_streaks'),
    // « En direct » : amis actifs dans les 20 dernières minutes (160).
    supabase.rpc('friends_live'),
    // Filleuls (183) : repli propre si la migration n'est pas passée.
    fetchReferralCounts(supabase, user.id),
    fetchSquadIds(supabase, user.id),
    // Blasons des amis (363). Absente : blason fixe déduit de l'id.
    supabase.rpc('friends_portraits'),
    // Barreau 4 de l'échelle de l'oral (222) : les amis qui demandent qu'on
    // les écoute.
    getDemandesRecues(supabase),
  ])

  const portraitById = new Map<string, string>(
    (Array.isArray(portraitRows) ? portraitRows : []).flatMap((r) =>
      r?.friend_id && typeof r.portrait === 'string' ? [[String(r.friend_id), r.portrait]] : [],
    ),
  )
  const avatarBrut = (profile?.avatar ?? {}) as { portrait?: unknown }
  const monPortrait = typeof avatarBrut.portrait === 'string' ? avatarBrut.portrait : ''
  const rawSquad = String(profile?.squad_name ?? '').trim()
  const squadName = rawSquad.length > 0 ? rawSquad : null

  const overview = mapFriendsOverview(Array.isArray(overviewRows) ? overviewRows : [])
  const pendingRequests: PendingRequest[] = overview.incoming.map((r) => ({
    ...r,
    portrait: portraitById.get(r.id) ?? '',
  }))

  // Séries : friend_id → jours (0 par défaut : 155 absente ou ami inactif).
  const streakById = new Map<string, number>(
    (Array.isArray(friendStreakRows) ? friendStreakRows : []).flatMap((r) => {
      const id = r?.friend_id
      const n = Number(r?.streak)
      return id && Number.isFinite(n) ? [[String(id), Math.max(0, n)]] : []
    }),
  )
  const friends: Friend[] = overview.accepted.map((f) => ({
    ...f,
    portrait: portraitById.get(f.id) ?? '',
    streak: streakById.get(f.id) ?? 0,
  }))

  const joueurs = joueursDeLaSemaine(user.id, monPortrait, friends, ligue)
  // Le n°1 de la semaine baptise le groupe (un élève seul est n°1 d'office).
  const canRenameSquad = classerAmis(joueurs).find((j) => j.moi)?.rang === 1

  return (
    <div>
      {/* Pas de titre VISIBLE (Lucas, 16/09/2026) : le mot « Amis » vit sous
          l'icône active de la barre. Le H1 reste pour le lecteur d'écran. */}
      <h1 className="sr-only">Amis</h1>
      {/* Quelqu'un attend qu'on l'écoute : ça passe avant tout le reste. */}
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
        connecte
        ligue={ligue}
        ligueApercu={false}
        joueurs={joueurs}
        monId={user.id}
        monPortrait={monPortrait}
        // Mon VRAI avatar (celui de l'onglet Moi), pour la fenêtre « Fais
        // équipe » et mes lignes : un avatar composé n'est pas un blason.
        monAvatar={profile ? avatarAffiche(profile.avatar, 160) : null}
        onlineFriendIds={buildLiveSessions(liveRows).map((s) => s.friend.id)}
        friends={friends}
        pendingRequests={pendingRequests}
        myFriendCode={String(profile?.friend_code ?? '')}
        squadName={squadName}
        canRenameSquad={canRenameSquad}
        referral={referralSummary(referralCounts.pending, referralCounts.activated)}
        squadIds={[...squadSet]}
        maintenantIso={maintenant.toISOString()}
      />
    </div>
  )
}

/**
 * Moi et mes amis, avec l'XP de la semaine et l'échelon de ligue lus dans la
 * ligue. Sans ligue (376 absente), chacun est à 0 XP en Bronze 4 : la liste
 * reste juste, le classement attend l'ouverture.
 */
function joueursDeLaSemaine(
  monId: string,
  monPortrait: string,
  friends: Friend[],
  ligue: EtatLigue | null,
): JoueurAmi[] {
  const parAmi = new Map((ligue?.amis ?? []).map((a) => [a.id, a]))
  return [
    {
      id: monId,
      nom: 'Toi',
      portrait: monPortrait,
      xp: ligue?.xpSemaine ?? 0,
      echelon: ligue?.echelon ?? 0,
      moi: true,
    },
    ...friends.map((f) => ({
      id: f.id,
      nom: f.name.split(' ')[0] || 'Ami',
      portrait: f.portrait ?? '',
      xp: parAmi.get(f.id)?.xp ?? 0,
      echelon: parAmi.get(f.id)?.echelon ?? 0,
      moi: false,
    })),
  ]
}
