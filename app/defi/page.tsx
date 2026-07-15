import DefiHero from '@/components/defi/DefiHero'
import SeasonBanner from '@/components/defi/SeasonBanner'
import ArenaCard from '@/components/defi/ArenaCard'
import ChestRow from '@/components/defi/ChestRow'
import CollapsibleSection from '@/components/defi/CollapsibleSection'
import WeeklyLeague from '@/components/defi/WeeklyLeague'
import RankingTabs from '@/components/defi/RankingTabs'
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

export const metadata = { title: 'Défi — Studuel' }

/**
 * Onglet Défi (route /defi) — « la route des trophées ». Assemble, de haut en
 * bas : saison, arène + match classé, coffres, ligue, classements, modes libres.
 * Données mockées (lib/defi) ; la structure est prête à se brancher sur Supabase.
 */
export default function DefiPage() {
  const arena = arenaProgress(MOCK_TROPHIES)

  // Aperçus montrés dans l'en-tête replié : le rang du joueur, en un coup d'œil.
  const me = MOCK_LEAGUE.players.find((p) => p.isMe)
  const leaguePreview = me ? `${me.rank}e · ${me.weeklyXp} XP` : undefined
  const myCollegeRank = MOCK_RANKINGS.college.entries.find((e) => e.isMe)?.rank
  const rankingPreview = myCollegeRank ? `${myCollegeRank}e au collège` : undefined

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4">
      <DefiHero arenaName={arena.current.name} arenaIcon={arena.current.icon} />
      <SeasonBanner season={MOCK_SEASON} />
      <ArenaCard trophies={MOCK_TROPHIES} />
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

      <CollapsibleSection
        title="Classements"
        icon={<TrophyIcon className="size-5 text-highlight" />}
        preview={rankingPreview}
        ariaLabel="Classements"
      >
        <RankingTabs boards={MOCK_RANKINGS} />
      </CollapsibleSection>

      <FreeModes modes={MOCK_FREE_MODES} />
    </div>
  )
}
