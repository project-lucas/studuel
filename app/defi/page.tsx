import ModesSheet from '@/components/defi/ModesSheet'
import MatchClasseCta from '@/components/defi/MatchClasseCta'
import ArenaHud, { type OrbItem } from '@/components/defi/ArenaHud'
import TrophyBlock from '@/components/defi/TrophyBlock'
import WeeklyLeague from '@/components/defi/WeeklyLeague'
import LeaguePromotionWatch from '@/components/defi/LeaguePromotionWatch'
import RankingTabs from '@/components/defi/RankingTabs'
import ClanBanner from '@/components/defi/ClanBanner'
import ProfileChip from '@/components/defi/ProfileChip'
import { getProfileData } from '@/app/defi/profile-actions'
import DuelHistory from '@/components/defi/DuelHistory'
import SchoolTournament from '@/components/defi/SchoolTournament'
import { CrownIcon } from '@/components/defi/icons'
import {
  Crown,
  Hourglass,
  Shield,
  Sparkles,
  Target,
  Trophy,
  Users,
  Zap,
} from 'lucide-react'
import {
  MOCK_LEAGUE,
  MOCK_RANKINGS,
  MOCK_TOURNAMENT,
  MOCK_TROPHIES,
} from '@/lib/defi/mock-data'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { readRowTolerant } from '@/lib/profile-read'
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
import { clanWeekReward, type ClanWeekBoard } from '@/lib/clan-week'
import {
  claimableCount,
  countdownLabel as seasonCountdown,
  trackView,
  type SeasonState,
} from '@/lib/saison'
import { fetchSeasonState } from '@/lib/saison-server'
import SeasonTrack from '@/components/defi/SeasonTrack'
import {
  fetchClanWeekBoard,
  hasClaimedClanWeek,
  lastWeekKey,
} from '@/lib/clan-week-server'
import { fetchQuestViews, fetchClaimedQuestIds } from '@/lib/quests-server'
import { doneCount, type QuestView } from '@/lib/quests'
import { resolveCurrentChapter } from '@/lib/chapitre-courant-server'
import { reasonLabel } from '@/lib/chapitre-courant'
import Duel90Cta from '@/components/defi/Duel90Cta'
import DailyQuests from '@/components/defi/DailyQuests'
import ClanWeekCard from '@/components/defi/ClanWeekCard'
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

// Les colonnes du profil qu'utilise l'arène, toutes migrations confondues :
// trophies (079), college/lycee_school_id (159). Absentes → `undefined`, et
// l'écran dégrade comme avant (0 trophée, pas d'école).
type DefiProfileRow = {
  full_name: string | null
  grade_level: string | null
  trophies: number | null
  college_school_id: string | null
  lycee_school_id: string | null
}

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
  const user = await getCurrentUser()

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

  // Les trois piliers de la boucle quotidienne, chacun tolérant à l'absence de
  // sa migration (204/205) : la carte disparaît, l'arène reste jouable.
  let duelReason: string | undefined
  let questViewList: QuestView[] = []
  let questClaimedIds: string[] = []
  let clanWeek: ClanWeekBoard | null = null
  let clanReward: { weekKey: string; label: string } | null = null
  let season: SeasonState | null = null

  if (user) {
    // Semaine écoulée : borne du coffre de clan, connue sans aucune requête.
    const previousWeek = lastWeekKey(todayKey)

    // --- VAGUE 1 : le profil ET tout ce qui ne dépend pas de la classe --------
    // L'arène enchaînait TROIS vagues (profil → classements → quêtes/saison)
    // alors qu'une seule requête sur les huit du 2e paquet et une seule sur les
    // sept du 3e dépendent réellement du cycle scolaire de l'élève. Le reste
    // attendait pour rien : il part maintenant avec le profil.
    //
    // Le profil lui-même tenait en deux requêtes sur la même ligne, pour isoler
    // les colonnes de migrations tardives (trophies de la 079, les school_id de
    // la 159). `readRowTolerant` assure la même tolérance en une seule.
    const [
      profile,
      natRes,
      friendsRes,
      leagueRes,
      matchesRes,
      reviews,
      questRes,
      claimedRes,
      weekRes,
      lastWeekRes,
      alreadyClaimed,
      seasonRes,
    ] = await Promise.all([
      readRowTolerant<DefiProfileRow>(supabase, 'profiles', 'id', user.id, [
        'full_name',
        'grade_level',
        'trophies',
        'college_school_id',
        'lycee_school_id',
      ]),
      supabase.rpc('national_ranking'),
      supabase.rpc('friends_trophies'),
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
      fetchQuestViews(supabase, user.id, todayKey),
      fetchClaimedQuestIds(supabase, user.id, todayKey),
      fetchClanWeekBoard(supabase),
      fetchClanWeekBoard(supabase, previousWeek),
      hasClaimedClanWeek(supabase, user.id, previousWeek),
      fetchSeasonState(supabase, todayKey),
    ])

    trophies = Math.max(0, Number(profile.trophies) || 0)
    const firstName = String(profile.full_name ?? '').split(' ')[0] || 'Moi'
    const level = schoolLevelForGrade(profile.grade_level ?? null)
    const schoolId =
      level === 'college'
        ? profile.college_school_id
        : profile.lycee_school_id

    // --- VAGUE 2 : ce qui dépend VRAIMENT du cycle et de l'école -------------
    // Quatre requêtes, pas quinze. Chacune reste tolérante à l'absence de sa
    // migration (RPC absente → data null → classement vide).
    const [clanRes, schoolRes, tournamentRes, chapterRes] = await Promise.all([
      supabase.rpc('clan_ranking', { p_level: level }),
      schoolId
        ? supabase
            .from('schools')
            .select('id, name, city, level')
            .eq('id', schoolId)
            .maybeSingle()
        : Promise.resolve({ data: null }),
      // Tournoi des écoles (migration 162) — null tant qu'elle n'est pas là.
      supabase.rpc('school_tournament_standings', { p_level: level }),
      // Chapitre courant : dépend de la classe (migration 203).
      profile.grade_level
        ? resolveCurrentChapter(supabase, user.id, profile.grade_level, todayKey)
        : Promise.resolve(null),
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


    duelReason = chapterRes?.chapter
      ? reasonLabel(chapterRes.chapter, todayKey)
      : undefined
    questViewList = questRes
    questClaimedIds = claimedRes
    clanWeek = weekRes
    season = seasonRes

    // Le coffre de la semaine passée : proposé seulement s'il y a vraiment
    // quelque chose à ouvrir (contribution suffisante, clan classé, et pas
    // déjà encaissé).
    if (lastWeekRes && !alreadyClaimed) {
      const reward = clanWeekReward(
        lastWeekRes.myClan?.rank ?? null,
        lastWeekRes.myPoints,
      )
      if (reward.tier !== 'aucune') {
        clanReward = { weekKey: lastWeekRes.weekKey, label: reward.label }
      }
    }
  }

  // Visiteur (league = MOCK_LEAGUE) : aperçu dérivé du mock.
  if (leaguePreview === undefined && league === MOCK_LEAGUE) {
    const meMock = MOCK_LEAGUE.players.find((p) => p.isMe)
    leaguePreview = meMock ? `${meMock.rank}e` : undefined
  }

  // Profil de jeu (carte haut-gauche) : agrégation stats + badges + cosmétiques.
  // Null pour un visiteur non connecté (pas de carte). Attribue au passage les
  // badges mérités (recalcul serveur).
  const profileData = user ? await getProfileData() : null

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
    // La piste de saison : le calendrier mensuel. La pastille compte les
    // récompenses à encaisser — c'est elle qui ramène dans la feuille.
    ...(season
      ? [
          {
            id: 'saison',
            // Sparkles et non Crown : l'orbe Ligue porte déjà la couronne, et
            // deux couronnes côte à côte se confondent au coup d'œil.
            label: 'Saison',
            icon: <Sparkles className={ORB_ICON} strokeWidth={2.5} />,
            sub: `Palier ${trackView(season.crowns, season.claimed, season.hasPass).filter((v) => v.reached).length}`,
            badge:
              claimableCount(
                trackView(season.crowns, season.claimed, season.hasPass),
              ) > 0
                ? '🎁'
                : undefined,
            sheetTitle: `Saison ${season.season.number} · ${season.season.name}`,
            sheetContent: (
              <div className="p-4">
                <SeasonTrack state={season} today={todayKey} />
              </div>
            ),
          } satisfies OrbItem,
        ]
      : []),
    // Les quêtes du jour : le rendez-vous quotidien. L'aperçu « 1/3 » sous
    // l'orbe est la seule information qui donne envie de l'ouvrir — un orbe
    // muet ne se clique pas.
    ...(questViewList.length > 0
      ? [
          {
            id: 'quetes',
            label: 'Quêtes',
            icon: <Target className={ORB_ICON} strokeWidth={2.5} />,
            sub: `${doneCount(questViewList)}/${questViewList.length}`,
            sheetTitle: 'Quêtes du jour',
            sheetContent: (
              <div className="p-4">
                <DailyQuests views={questViewList} claimedIds={questClaimedIds} />
              </div>
            ),
          } satisfies OrbItem,
        ]
      : []),
  ]

  // Colonne droite : le social (mon clan-école, mes amis).
  const rightOrbs: OrbItem[] = [
    {
      id: 'clan',
      label: 'Mon clan',
      icon: <Shield className={ORB_ICON} strokeWidth={2.5} />,
      // La semaine de clan est LE moteur de rétention : un coffre non réclamé
      // doit se voir depuis l'arène, pas seulement une fois la feuille ouverte.
      badge: clanReward ? '🎁' : user && !hasSchool ? '!' : undefined,
      sheetTitle: clanLabel ?? 'Mon clan',
      sheetContent: (
        <div className="flex flex-col gap-4 p-4">
          {/* La semaine en cours passe DEVANT : compte à rebours, place du
              clan, apport personnel. Le reste (école, tournoi) est du contexte. */}
          {clanWeek ? (
            <ClanWeekCard
              board={clanWeek}
              today={todayKey}
              pendingReward={clanReward}
            />
          ) : null}
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
        {/* La scène : arène plein cadre. En haut à droite la cartouche de rang
            et le parchemin des entrées secondaires ; en bas à gauche la saison.
            Aucun bandeau de titre : l'arène DIT déjà où l'on est, et le centre
            haut reste au décor. */}
        <ArenaHud
          leftOrbs={leftOrbs}
          rightOrbs={rightOrbs}
          profileSlot={profileData ? <ProfileChip data={profileData} /> : null}
          rankSlot={<TrophyBlock trophies={trophies} />}
          seasonSlot={
            // La saison est désormais RÉELLE : dérivée du calendrier (un mois =
            // une saison, migration 207), avec sa piste et son compte à rebours.
            // Fini le « pré-saison » qui avouait qu'aucun cycle n'existait.
            // Sans la migration, on retombe honnêtement sur l'ancien libellé.
            season ? (
              <p
                className="olympe-glass flex max-w-full items-center gap-1.5 rounded-full px-3 py-1 text-[0.68rem] font-bold"
                aria-label={`Saison ${season.season.number} : ${season.season.name}. ${seasonCountdown(todayKey)}.`}
              >
                <CrownIcon className="size-3.5 shrink-0 text-[#fcd34d]" />
                <span className="truncate">
                  S{season.season.number} · {seasonCountdown(todayKey)}
                </span>
              </p>
            ) : (
              <p
                className="olympe-glass flex max-w-full items-center gap-1.5 rounded-full px-3 py-1 text-[0.68rem] font-bold"
                aria-label="Pré-saison : le classement est déjà actif, tes trophées comptent et sont conservés."
              >
                <CrownIcon className="size-3.5 shrink-0 text-[#fcd34d]" />
                <span className="truncate">Classement · pré-saison</span>
              </p>
            )
          }
        />

        {/* CTA principal : le DUEL 90 s. C'est la boucle centrale du jeu — une
            action, 90 secondes, sur le chapitre le plus utile de l'élève. Il
            porte la plaque « or ciselé » (la matière fait tout le poids, façon
            bouton « Battle » de Clash Royale) et sa sous-ligne dit POURQUOI ce
            chapitre : « Contrôle dans 3 jours » vaut mille fois « Jouer ».
            Le match classé reste accessible juste en dessous, en second rôle :
            il s'adresse à qui vient chercher des trophées, pas à qui ouvre
            l'app sans savoir quoi faire. */}
        <Duel90Cta reason={duelReason} />
        <MatchClasseCta />

        {/* Tous les modes de jeu, en feuille qui monte du bas (billets +
            filtres). « Duel en direct » (QR) y vit désormais en icône flottante,
            en haut à droite de l'écran des modes — plus de bouton dédié ici. */}
        <ModesSheet todayKey={todayKey} liveDuel={!!user} />
      </div>
    </div>
  )
}
