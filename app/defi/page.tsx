import Link from 'next/link'
import ModesSheet from '@/components/defi/ModesSheet'
import ArenaHud, { type OrbItem } from '@/components/defi/ArenaHud'
import TrophyBlock from '@/components/defi/TrophyBlock'
import WeeklyLeague from '@/components/defi/WeeklyLeague'
import LeaguePromotionWatch from '@/components/defi/LeaguePromotionWatch'
import RankingTabs from '@/components/defi/RankingTabs'
import ClanBanner from '@/components/defi/ClanBanner'
import QuickActions from '@/components/defi/QuickActions'
import DuelHistory from '@/components/defi/DuelHistory'
import SchoolTournament from '@/components/defi/SchoolTournament'
import { ChevronRightIcon, CrownIcon, SwordsIcon } from '@/components/defi/icons'
import {
  Crown,
  Hourglass,
  Shield,
  Trophy,
  Users,
  Zap,
} from 'lucide-react'
import {
  MOCK_LEAGUE,
  MOCK_RANKINGS,
  MOCK_SEASON,
  MOCK_TOURNAMENT,
  MOCK_TROPHIES,
} from '@/lib/defi/mock-data'
import { createClient } from '@/lib/supabase/server'
import { avatarEmojiFor } from '@/lib/social'
import { normalizeRankedHistory } from '@/lib/defi/history'
import { normalizeTournamentBoard, type TournamentBoard } from '@/lib/tournament'
import { getReviewItems, reviewQueue } from '@/lib/srs'
import { toDayKey } from '@/lib/streak'
import {
  normalizeRanking,
  normalizeSchool,
  schoolLevelForGrade,
  rankHeadline,
  ordinalFr,
  type Ranking,
  type School,
} from '@/lib/clan'
import { normalizeLeagueStandings, buildLeague } from '@/lib/league'
import type {
  League,
  RankingBoard,
  RankingEntry,
  RankingScope,
} from '@/lib/defi/types'
import type { ReactNode } from 'react'

export const metadata = { title: 'Défi — Studuel' }
export const dynamic = 'force-dynamic'

// Icône crème centrée des médaillons d'orbes (cœur gemme violette derrière).
const ORB_ICON = 'size-6 text-[#faf6ef]'

// Convertit un classement (lib/clan) en tableau prêt pour RankingTabs.
// L'unité est TOUJOURS affichée (🏆) : un nombre nu ne dit pas dans quelle
// monnaie on est classé — et le mock parle la même langue.
function toEntries(r: Ranking, myId: string): RankingEntry[] {
  return r.entries.map((e) => ({
    id: e.id,
    rank: e.rank,
    name: e.name,
    avatar: avatarEmojiFor(e.id),
    score: e.trophies,
    scoreLabel: `${e.trophies.toLocaleString('fr-FR')} 🏆`,
    isMe: e.id === myId,
  }))
}

// Classement des amis (RPC friends_trophies) + moi, rangés par trophées.
function friendsRanking(
  rows: unknown,
  myId: string,
  myName: string,
  myTrophies: number,
): Ranking {
  const people = [
    { id: myId, name: myName, trophies: myTrophies },
    ...(Array.isArray(rows) ? rows : []).flatMap((r) => {
      const o = r as Record<string, unknown>
      const id = String(o?.friend_id ?? '')
      if (!id) return []
      return [
        {
          id,
          name: String(o?.full_name ?? 'Ami').split(' ')[0] || 'Ami',
          trophies: Math.max(0, Number(o?.trophies) || 0),
        },
      ]
    }),
  ]
  people.sort((a, b) => b.trophies - a.trophies || (a.id < b.id ? -1 : 1))
  const entries = people.map((p, i) => ({ ...p, rank: i + 1 }))
  return {
    schoolId: null,
    schoolName: null,
    myRank: entries.find((e) => e.id === myId)?.rank ?? null,
    total: entries.length,
    entries,
  }
}

/**
 * Onglet Défi (route /defi) — l'écran de jeu façon Clash Royale : l'arène
 * plein viewport (aucun scroll), la mascotte et les trophées au centre, les
 * entrées secondaires (ligue, classements, clan, modes) en orbes flottants qui
 * ouvrent des feuilles, l'orbe Amis route vers l'onglet Amis. En bas : les
 * coffres et le gros CTA « Match classé ». Trophées et classements sont RÉELS
 * (migrations 079/159) ; saison, ligue hebdo et coffres restent une vitrine
 * mockée (ils réclament un job planifié côté serveur — chantier séparé).
 */
export default async function DefiPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Valeurs par défaut (visiteur non connecté : démo mockée).
  let trophies = MOCK_TROPHIES
  // Bilan Victoires/Défaites des duels 1v1 (0 pour un visiteur).
  let wins = 0
  let losses = 0
  let boards: Record<RankingScope, RankingBoard> = MOCK_RANKINGS
  let league: League = MOCK_LEAGUE
  // Drapeau « Aperçu » : la ligue mockée (visiteur ou migration 161 absente)
  // est signalée comme telle, jamais déguisée en réelle.
  let leagueIsDemo = true
  let leaguePreview: string | undefined
  // Palier de ligue réel (pour la vigie de promotion) — null tant que démo.
  let leagueTier: number | null = null
  let clanLabel: string | undefined
  let clanNode: ReactNode = null
  let rankingPreview: string | undefined
  let hasSchool = true
  let duelEntries: ReturnType<typeof normalizeRankedHistory> = []
  let reviewCount = 0
  // Tournoi des écoles : vitrine mockée tant que la migration 162 n'est pas là.
  let tournament: TournamentBoard = MOCK_TOURNAMENT
  let tournamentIsDemo = true
  const todayKey = toDayKey(new Date())

  if (user) {
    // Identité de base (toujours présente) séparée des colonnes de migration
    // tardive : trophies (079) + college/lycee_school_id (159) isolés dans leur
    // propre requête, pour qu'une migration pas encore passée ne fasse pas perdre
    // le prénom et la classe (modèle avatar/weekly_goals de /moi). Parallèle =
    // perf-neutre.
    const [{ data: profile }, { data: geoRow }, { data: recordRow }] =
      await Promise.all([
        supabase
          .from('profiles')
          .select('full_name, grade_level')
          .eq('id', user.id)
          .maybeSingle(),
        supabase
          .from('profiles')
          .select('trophies, college_school_id, lycee_school_id')
          .eq('id', user.id)
          .maybeSingle(),
        // Bilan V/D (migration 174) isolé : une migration pas encore passée ne
        // doit pas faire perdre trophées ni identité (discipline « colonnes
        // tardives », cf. f20a539).
        supabase
          .from('profiles')
          .select('wins, losses')
          .eq('id', user.id)
          .maybeSingle(),
      ])

    trophies = Math.max(0, Number(geoRow?.trophies) || 0)
    wins = Math.max(0, Number(recordRow?.wins) || 0)
    losses = Math.max(0, Number(recordRow?.losses) || 0)
    const firstName = String(profile?.full_name ?? '').split(' ')[0] || 'Moi'
    const level = schoolLevelForGrade(profile?.grade_level ?? null)
    const schoolId =
      level === 'college'
        ? geoRow?.college_school_id
        : geoRow?.lycee_school_id

    // Classements réels + école courante, chacun tolérant à l'absence de la
    // migration 159 (RPC absente → data null → classement vide).
    const [
      clanRes,
      natRes,
      friendsRes,
      schoolRes,
      leagueRes,
      matchesRes,
      reviews,
      tournamentRes,
    ] = await Promise.all([
        supabase.rpc('clan_ranking', { p_level: level }),
        supabase.rpc('national_ranking'),
        supabase.rpc('friends_trophies'),
        schoolId
          ? supabase
              .from('schools')
              .select('id, name, city, level')
              .eq('id', schoolId)
              .maybeSingle()
          : Promise.resolve({ data: null }),
        supabase.rpc('league_standings'),
        // Historique des matchs classés (migration 079) — les 20 derniers.
        supabase
          .from('ranked_matches')
          .select('id, won, delta, trophies, opponent, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20),
        // File « À revoir » (SRS + Revanche) pour le pont pédagogique.
        getReviewItems(supabase, user.id),
        // Tournoi des écoles (migration 162) — null tant qu'elle n'est pas là.
        supabase.rpc('school_tournament_standings', { p_level: level }),
      ])

    duelEntries = normalizeRankedHistory(matchesRes.data)
    reviewCount = reviewQueue(reviews, todayKey).length
    const realTournament = normalizeTournamentBoard(tournamentRes.data)
    if (realTournament) {
      tournament = realTournament
      tournamentIsDemo = false
    }

    const clan = normalizeRanking(clanRes.data)
    const national = normalizeRanking(natRes.data)
    const amis = friendsRanking(friendsRes.data, user.id, firstName, trophies)
    const currentSchool: School | null = normalizeSchool(schoolRes.data)
    hasSchool = currentSchool !== null

    boards = {
      college: {
        scope: 'college',
        headline: currentSchool
          ? rankHeadline(clan.myRank, clan.total)
          : 'Rejoins ton école pour entrer dans le classement de ton clan.',
        subline: currentSchool?.city ?? undefined,
        entries: toEntries(clan, user.id),
      },
      national: {
        scope: 'national',
        headline: rankHeadline(national.myRank, national.total),
        subline: 'Tous les élèves de Studuel',
        entries: toEntries(national, user.id),
      },
      amis: {
        scope: 'amis',
        headline:
          amis.total > 1
            ? rankHeadline(amis.myRank, amis.total)
            : 'Ajoute des amis pour vous comparer.',
        entries: toEntries(amis, user.id),
      },
    }

    // Ligue hebdo réelle (XP de la semaine par palier). À défaut de données
    // (migration 161 non passée), on garde la vitrine mockée.
    const standings = normalizeLeagueStandings(leagueRes.data)
    if (standings.entries.length > 0) {
      league = buildLeague(standings, user.id, avatarEmojiFor)
      leagueIsDemo = false
      leagueTier = standings.tier
      // Aperçu court sous l'orbe (l'espace y est compté) : le rang seul.
      leaguePreview = standings.myRank
        ? ordinalFr(standings.myRank)
        : undefined
    }

    clanLabel = level === 'college' ? 'Mon collège' : 'Mon lycée'
    clanNode = <ClanBanner level={level} current={currentSchool} />
    rankingPreview =
      currentSchool && clan.myRank ? ordinalFr(clan.myRank) : undefined
  }

  // Visiteur (league = MOCK_LEAGUE) : aperçu dérivé du mock.
  if (leaguePreview === undefined && league === MOCK_LEAGUE) {
    const meMock = MOCK_LEAGUE.players.find((p) => p.isMe)
    leaguePreview = meMock ? `${meMock.rank}e` : undefined
  }

  // Colonne gauche : la compétition (ligue, classements, modes libres).
  const leftOrbs: OrbItem[] = [
    {
      id: 'ligue',
      label: 'Ligue',
      icon: <Crown className={ORB_ICON} strokeWidth={2.5} />,
      sub: leaguePreview,
      sheetTitle: league.name,
      sheetContent: <WeeklyLeague league={league} isDemo={leagueIsDemo} />,
    },
    {
      id: 'classements',
      label: 'Classements',
      icon: <Trophy className={ORB_ICON} strokeWidth={2.5} />,
      sub: rankingPreview,
      sheetTitle: 'Classements',
      sheetContent: <RankingTabs boards={boards} clanLabel={clanLabel} />,
    },
    {
      // Une seule porte vers les modes libres : la salle de jeu. L'ancienne
      // feuille « Camp d'entraînement » dupliquait Blitz/Chrono/Survie avec
      // des gains XP mockés — supprimée.
      id: 'entrainement',
      label: 'Entraînement',
      icon: <Zap className={ORB_ICON} strokeWidth={2.5} />,
      href: '/defi/jouer',
    },
  ]

  // Colonne droite : le social (mon clan-école, mes amis).
  const rightOrbs: OrbItem[] = [
    {
      id: 'clan',
      label: 'Mon clan',
      icon: <Shield className={ORB_ICON} strokeWidth={2.5} />,
      badge: user && !hasSchool ? '!' : undefined,
      sheetTitle: clanLabel ?? 'Mon clan',
      sheetContent: (
        <div className="flex flex-col gap-4 p-4">
          {clanNode ?? (
            <p className="py-4 text-center text-sm font-semibold text-white/70">
              Connecte-toi pour rejoindre ton école — elle devient ton clan au
              classement.
            </p>
          )}
          {/* Le tournoi du week-end : ton école contre les autres. */}
          <SchoolTournament
            board={tournament}
            todayKey={todayKey}
            isDemo={tournamentIsDemo}
          />
        </div>
      ),
    },
    {
      id: 'historique',
      label: 'Historique',
      icon: <Hourglass className={ORB_ICON} strokeWidth={2.5} />,
      sheetTitle: 'Mes derniers matchs',
      sheetContent: (
        <DuelHistory
          entries={duelEntries}
          reviewCount={reviewCount}
          todayKey={todayKey}
        />
      ),
    },
    {
      id: 'amis',
      label: 'Amis',
      icon: <Users className={ORB_ICON} strokeWidth={2.5} />,
      href: '/amis',
    },
  ]

  return (
    <div className="-mx-4 -mt-16 -mb-24 flex h-dvh flex-col overflow-hidden px-3 pt-14 pb-[calc(4.75rem+env(safe-area-inset-bottom))] md:mx-0 md:-my-10 md:pt-4 md:pb-4">
      {/* Vigie de promotion : fête la montée de ligue depuis la dernière visite. */}
      {leagueTier !== null ? <LeaguePromotionWatch tier={leagueTier} /> : null}
      <div className="mx-auto flex h-full w-full max-w-md flex-col gap-3">
        {/* Pilule de saison, discrète en haut de l'arène. Encore mockée
            (aucun cron de saison) → badge « Aperçu », sans faux compte à
            rebours qui prétendrait être vrai. */}
        <div className="flex justify-center">
          <p className="olympe-glass flex max-w-full items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold">
            <CrownIcon className="size-4 shrink-0 text-[#fcd34d]" />
            <span className="truncate">{MOCK_SEASON.name}</span>
            <span className="olympe-tag shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold">
              Aperçu
            </span>
          </p>
        </div>

        {/* La scène : arène plein cadre, entrées secondaires derrière le burger. */}
        <ArenaHud leftOrbs={leftOrbs} rightOrbs={rightOrbs} />

        {/* Le bas d'écran, de haut en bas : bloc trophées, CTA « Match classé »,
            duel en direct (QR), puis la feuille des modes. */}
        {/* Bloc trophées : descendu du centre de l'arène, juste au-dessus du CTA. */}
        <TrophyBlock trophies={trophies} wins={wins} losses={losses} />

        {/* CTA principal : plaque « or ciselé » pleine largeur, l'élément le
            plus proéminent de la pile. Texte encre ; l'ombre dure s'écrase au
            clic (olympe-press). */}
        <Link
          href="/defi/jouer?mode=ranked"
          className="olympe-gold olympe-press attract-sheen flex min-h-16 w-full items-center gap-3 rounded-2xl px-5 focus-visible:ring-4 focus-visible:ring-highlight/50 focus-visible:outline-none"
          aria-label="Lancer un match classé"
        >
          <SwordsIcon className="size-7 shrink-0" />
          <span className="flex flex-col items-start leading-tight">
            <span className="font-heading text-base font-extrabold">
              MATCH CLASSÉ
            </span>
            <span className="text-[0.72rem] font-bold opacity-80">
              BO3 · +30 victoire / −20 défaite
            </span>
          </span>
          <ChevronRightIcon className="ml-auto size-5 shrink-0" />
        </Link>

        {/* Duel en direct par QR, sous le CTA — « Ajouter un ami » vit dans
            l'onglet Amis. */}
        {user ? <QuickActions /> : null}

        {/* Tous les modes de jeu, en feuille qui monte du bas (billets +
            filtres) — le bouton remplace l'ancien lien vers /defi/jeux. */}
        <ModesSheet todayKey={todayKey} />
      </div>
    </div>
  )
}
