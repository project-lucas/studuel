import Link from 'next/link'
import {
  Gamepad2 as GamepadIcon,
  School as SchoolIcon,
  Users as UsersIcon,
} from 'lucide-react'
import ArenaHud, { type OrbItem } from '@/components/defi/ArenaHud'
import ArenaCenter from '@/components/defi/ArenaCenter'
import ChestRow from '@/components/defi/ChestRow'
import WeeklyLeague from '@/components/defi/WeeklyLeague'
import LeaguePromotionWatch from '@/components/defi/LeaguePromotionWatch'
import RankingTabs from '@/components/defi/RankingTabs'
import ClanBanner from '@/components/defi/ClanBanner'
import QuickActions from '@/components/defi/QuickActions'
import DuelHistory from '@/components/defi/DuelHistory'
import SchoolTournament from '@/components/defi/SchoolTournament'
import {
  ChevronRightIcon,
  ClockIcon,
  CrownIcon,
  SwordsIcon,
  TrophyIcon,
  ZapIcon,
} from '@/components/defi/icons'
import {
  MOCK_CHESTS,
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
    const { data: profile } = await supabase
      .from('profiles')
      .select(
        'full_name, grade_level, trophies, college_school_id, lycee_school_id',
      )
      .eq('id', user.id)
      .maybeSingle()

    trophies = Math.max(0, Number(profile?.trophies) || 0)
    const firstName = String(profile?.full_name ?? '').split(' ')[0] || 'Moi'
    const level = schoolLevelForGrade(profile?.grade_level ?? null)
    const schoolId =
      level === 'college'
        ? profile?.college_school_id
        : profile?.lycee_school_id

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
      icon: (
        <span className="text-2xl leading-none" aria-hidden>
          {league.tierIcon}
        </span>
      ),
      sub: leaguePreview,
      sheetTitle: league.name,
      sheetContent: <WeeklyLeague league={league} isDemo={leagueIsDemo} />,
    },
    {
      id: 'classements',
      label: 'Classements',
      icon: <TrophyIcon className="size-6 text-highlight" />,
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
      icon: <ZapIcon className="size-6 text-white" />,
      href: '/defi/jouer',
    },
  ]

  // Colonne droite : le social (mon clan-école, mes amis).
  const rightOrbs: OrbItem[] = [
    {
      id: 'clan',
      label: 'Mon clan',
      icon: <SchoolIcon className="size-6 text-white" aria-hidden="true" />,
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
      icon: <ClockIcon className="size-6 text-white" />,
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
      icon: <UsersIcon className="size-6 text-white" aria-hidden="true" />,
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
          <p className="flex max-w-full items-center gap-2 rounded-full border border-white/15 bg-black/25 px-4 py-1.5 text-xs font-bold text-white/85 backdrop-blur-sm">
            <CrownIcon className="size-4 shrink-0 text-highlight" />
            <span className="truncate">{MOCK_SEASON.name}</span>
            <span className="shrink-0 rounded-full bg-highlight/25 px-2 py-0.5 text-[10px] font-extrabold text-white/85">
              Aperçu
            </span>
          </p>
        </div>

        {/* La scène : arène au centre, orbes flottants sur les bords. */}
        <ArenaHud leftOrbs={leftOrbs} rightOrbs={rightOrbs}>
          <ArenaCenter trophies={trophies} />
        </ArenaHud>

        {/* Le bas d'écran : coffres, rangée sociale (QR), puis CTA principal. */}
        <ChestRow chests={MOCK_CHESTS} demo />

        {/* Duel en direct par QR — « Ajouter un ami » vit dans l'onglet Amis. */}
        {user ? <QuickActions /> : null}

        <Link
          href="/defi/jouer?mode=ranked"
          className="defi2-press flex w-full items-center justify-center gap-2.5 rounded-2xl border border-[oklch(0.72_0.16_70)] bg-gradient-to-b from-highlight to-[oklch(0.74_0.16_62)] px-5 py-3.5 text-center shadow-[0_14px_30px_-10px_color-mix(in_oklch,var(--highlight),transparent_35%)] focus-visible:ring-4 focus-visible:ring-highlight/50 focus-visible:outline-none"
          aria-label="Lancer un match classé"
        >
          <SwordsIcon className="size-6 text-[oklch(0.26_0.06_70)]" />
          <span className="flex flex-col items-start leading-tight">
            <span className="font-heading text-lg font-extrabold text-[oklch(0.24_0.06_70)]">
              MATCH CLASSÉ
            </span>
            <span className="text-[0.7rem] font-bold text-[oklch(0.32_0.06_70)]">
              BO3 · +30 victoire / −20 défaite
            </span>
          </span>
          <ChevronRightIcon className="ml-auto size-5 text-[oklch(0.3_0.06_70)]" />
        </Link>

        {/* L'espace Jeux : salons par matière + modes 2v2 entre amis. */}
        <Link
          href="/defi/jeux"
          className="defi2-press flex w-full items-center justify-center gap-2.5 rounded-2xl border border-[oklch(0.62_0.18_300)] bg-gradient-to-b from-[oklch(0.56_0.2_300)] to-[oklch(0.44_0.2_302)] px-5 py-3 text-center shadow-[0_14px_30px_-10px_oklch(0.4_0.2_300)] focus-visible:ring-4 focus-visible:ring-white/40 focus-visible:outline-none"
          aria-label="Modes de jeu — salons par matière et 2v2 entre amis"
        >
          <GamepadIcon className="size-6 text-white" aria-hidden="true" />
          <span className="flex flex-col items-start leading-tight">
            <span className="font-heading text-lg font-extrabold text-white">
              MODES DE JEU
            </span>
            <span className="text-[0.7rem] font-bold text-white/75">
              Salons par matière · 2v2 entre amis
            </span>
          </span>
          <ChevronRightIcon className="ml-auto size-5 text-white/70" />
        </Link>
      </div>
    </div>
  )
}
