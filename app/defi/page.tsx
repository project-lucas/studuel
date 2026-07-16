import DefiHero from '@/components/defi/DefiHero'
import SeasonBanner from '@/components/defi/SeasonBanner'
import ArenaCard from '@/components/defi/ArenaCard'
import ChestRow from '@/components/defi/ChestRow'
import CollapsibleSection from '@/components/defi/CollapsibleSection'
import WeeklyLeague from '@/components/defi/WeeklyLeague'
import RankingTabs from '@/components/defi/RankingTabs'
import ClanBanner from '@/components/defi/ClanBanner'
import FreeModes from '@/components/defi/FreeModes'
import { TrophyIcon } from '@/components/defi/icons'
import { arenaProgress } from '@/lib/defi/arena'
import {
  MOCK_CHESTS,
  MOCK_FREE_MODES,
  MOCK_LEAGUE,
  MOCK_RANKINGS,
  MOCK_SEASON,
  MOCK_TROPHIES,
} from '@/lib/defi/mock-data'
import { createClient } from '@/lib/supabase/server'
import { avatarEmojiFor } from '@/lib/social'
import {
  normalizeRanking,
  normalizeSchool,
  schoolLevelForGrade,
  rankHeadline,
  ordinalFr,
  SCHOOL_LEVEL_LABEL,
  type Ranking,
  type School,
} from '@/lib/clan'
import type {
  RankingBoard,
  RankingEntry,
  RankingScope,
} from '@/lib/defi/types'
import type { ReactNode } from 'react'

export const metadata = { title: 'Défi — Studuel' }
export const dynamic = 'force-dynamic'

// Convertit un classement (lib/clan) en tableau prêt pour RankingTabs.
function toEntries(r: Ranking, myId: string): RankingEntry[] {
  return r.entries.map((e) => ({
    id: e.id,
    rank: e.rank,
    name: e.name,
    avatar: avatarEmojiFor(e.id),
    score: e.trophies,
    scoreLabel: `${e.trophies}`,
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
 * Onglet Défi (route /defi) — « la route des trophées ». Trophées et classements
 * (clan = ton école, national, amis) sont RÉELS (migrations 079/159). Saison,
 * ligue hebdo et coffres restent une vitrine mockée (ils réclament un job planifié
 * côté serveur — chantier séparé).
 */
export default async function DefiPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Valeurs par défaut (visiteur non connecté : démo mockée).
  let trophies = MOCK_TROPHIES
  let boards: Record<RankingScope, RankingBoard> = MOCK_RANKINGS
  let clanLabel: string | undefined
  let clanNode: ReactNode = null
  let rankingPreview: string | undefined

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
    const [clanRes, natRes, friendsRes, schoolRes] = await Promise.all([
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
    ])

    const clan = normalizeRanking(clanRes.data)
    const national = normalizeRanking(natRes.data)
    const amis = friendsRanking(friendsRes.data, user.id, firstName, trophies)
    const currentSchool: School | null = normalizeSchool(schoolRes.data)

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

    clanLabel = level === 'college' ? 'Mon collège' : 'Mon lycée'
    clanNode = <ClanBanner level={level} current={currentSchool} />
    rankingPreview =
      currentSchool && clan.myRank
        ? `${ordinalFr(clan.myRank)} · ${SCHOOL_LEVEL_LABEL[level].toLowerCase()}`
        : currentSchool
          ? undefined
          : 'Choisis ton clan'
  }

  const arena = arenaProgress(trophies)
  const me = MOCK_LEAGUE.players.find((p) => p.isMe)
  const leaguePreview = me ? `${me.rank}e · ${me.weeklyXp} XP` : undefined

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4">
      <DefiHero arenaName={arena.current.name} arenaIcon={arena.current.icon} />
      <SeasonBanner season={MOCK_SEASON} />
      <ArenaCard trophies={trophies} />
      <ChestRow chests={MOCK_CHESTS} />

      <CollapsibleSection
        title={MOCK_LEAGUE.name}
        icon={
          <span className="text-2xl leading-none" aria-hidden>
            {MOCK_LEAGUE.tierIcon}
          </span>
        }
        preview={leaguePreview}
        ariaLabel="Ligue hebdomadaire"
      >
        <WeeklyLeague league={MOCK_LEAGUE} />
      </CollapsibleSection>

      {/* Clan (école) + classements réels. */}
      {clanNode ? <div>{clanNode}</div> : null}
      <CollapsibleSection
        title="Classements"
        icon={<TrophyIcon className="size-5 text-highlight" />}
        preview={rankingPreview}
        ariaLabel="Classements"
      >
        <RankingTabs boards={boards} clanLabel={clanLabel} />
      </CollapsibleSection>

      <FreeModes modes={MOCK_FREE_MODES} />
    </div>
  )
}
