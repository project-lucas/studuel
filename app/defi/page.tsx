import ModesSheet from '@/components/defi/ModesSheet'
import MatchClasseCta from '@/components/defi/MatchClasseCta'
import ArenaHud, {
  type OrbItem,
  type RailTile,
} from '@/components/defi/ArenaHud'
import ArenaHero from '@/components/defi/ArenaHero'
import RankCard from '@/components/defi/RankCard'
import WeeklyLeague from '@/components/defi/WeeklyLeague'
import LeaguePromotionWatch from '@/components/defi/LeaguePromotionWatch'
import RankingTabs from '@/components/defi/RankingTabs'
import ClanBanner from '@/components/defi/ClanBanner'
import ProfileChip from '@/components/defi/ProfileChip'
import { getProfileData } from '@/app/defi/profile-actions'
import DuelHistory from '@/components/defi/DuelHistory'
import SchoolTournament from '@/components/defi/SchoolTournament'
import {
  Crown,
  Gift,
  // Aliasé : `School` est déjà le TYPE d'une école (lib/clan) dans ce fichier.
  School as SchoolIcon,
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
import {
  avatarEmojiFor,
  buildLiveSessions,
  mapFriendsOverview,
} from '@/lib/social'
import { questTileBadge } from '@/lib/arene-hud'
import BossSheet from '@/components/defi/BossSheet'
import BossFlash from '@/components/defi/BossFlash'
import {
  countdownLabel,
  dayBossCards,
  featuredCard,
  readyCount,
  type TraqueCard,
} from '@/lib/traque'
import TraqueStrip from '@/components/defi/TraqueStrip'
import {
  getSubjectsCached,
  getSubjectLevelsCached,
} from '@/lib/catalog'
import { subjectsWithContentAt } from '@/lib/subject-visibility'
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
  isSeasonLastDay,
  tierProgress,
  trackView,
  type SeasonState,
} from '@/lib/saison'
import { fetchSeasonState } from '@/lib/saison-server'
import SeasonTrack from '@/components/defi/SeasonTrack'
import SeasonBanner from '@/components/defi/SeasonBanner'
import {
  fetchClanWeekBoard,
  hasClaimedClanWeek,
  lastWeekKey,
} from '@/lib/clan-week-server'
import { fetchQuestViews, fetchClaimedQuestIds } from '@/lib/quests-server'
import { buildTraqueBoard, fetchGauges } from '@/lib/traque-server'
import { doneCount, type QuestView } from '@/lib/quests'
import { resolveCurrentChapter } from '@/lib/chapitre-courant-server'
import { reasonLabel } from '@/lib/chapitre-courant'
import Duel90Cta from '@/components/defi/Duel90Cta'
import QuestBubble from '@/components/defi/QuestBubble'
import DailyQuests from '@/components/defi/DailyQuests'
import { duelGoal } from '@/lib/duel-cta'
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

// Icône d'une entrée du menu burger. UNE seule famille (Lucide), UNE seule
// taille, UNE seule graisse : c'est la régularité qui fait le menu propre. Les
// objets illustrés (coupe, coffre) reviendront plus tard, mais tous ensemble —
// deux dessins peints au milieu de cinq pictos au trait, c'était l'écart.
const ORB_ICON = 'size-[18px] text-[#faf6ef]'
const ORB_STROKE = 2.2

// Convertit un classement (lib/clan) en tableau prêt pour RankingTabs.
// La donnée ne porte QUE le nombre : l'unité (le trophée) est dessinée par la
// vue, avec le picto du jeu — et le mock parle la même langue.
function toEntries(r: Ranking, myId: string): RankingEntry[] {
  return r.entries.map((e) => ({
    id: e.id,
    rank: e.rank,
    name: e.name,
    avatar: avatarEmojiFor(e.id),
    score: e.trophies,
    scoreLabel: e.trophies.toLocaleString('fr-FR'),
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
 * Onglet Défi (route /defi) — l'écran d'arène VERSION FINALE, façon Clash
 * Royale : l'arène plein viewport (aucun scroll), le PERSONNAGE du joueur sur
 * son socle au centre de la scène, et les systèmes qui réclament leur visite
 * depuis les rails latéraux — à gauche le duo missions (Quêtes, Boss), à
 * droite la barrette de l'angle (Amis, puis le burger tout au bord) — le Pass
 * de saison, lui, s'ouvre depuis son bandeau. Les entrées de second rang
 * (ligue, classements, historique, tournoi, coffre) restent derrière le
 * burger. En bas, LA RANGÉE DE
 * COMBAT : le Duel 90 s en or, seul objet brillant de l'écran, encadré par ses
 * deux satellites carrés et sombres (Classé, Modes). Trophées et classements
 * sont RÉELS (migrations 079/159) ; le tournoi
 * et la ligue dégradent en vitrine mockée sans leurs migrations.
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
  // Présence sociale : le prénom d'UN ami en session (RPC friends_live) pour
  // le chip au-dessus du CTA duel. Rien si personne n'est en ligne.
  let onlineFriendName: string | undefined
  let questViewList: QuestView[] = []
  let questClaimedIds: string[] = []
  let clanWeek: ClanWeekBoard | null = null
  let clanReward: { weekKey: string; label: string } | null = null
  let season: SeasonState | null = null
  // Identité du socle : le prénom vit SOUS le personnage, plus dans le HUD.
  let heroName: string | null = null
  // LA TRAQUE (212) : une jauge par matière, remplie en révisant. Vide tant que
  // la migration n'est pas passée — la tuile Boss affiche alors une carte
  // d'invitation à réviser, jamais une erreur.
  let traqueBoard: TraqueCard[] = []
  // Demandes d'amis REÇUES : la pastille du jeton Amis de l'angle haut-droit.
  // Une demande en attente est un dû, comme un coffre — elle doit se voir
  // depuis l'arène, pas seulement en ouvrant l'onglet Amis.
  let friendRequests = 0

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
      liveRes,
      leagueRes,
      matchesRes,
      reviews,
      questRes,
      claimedRes,
      weekRes,
      lastWeekRes,
      alreadyClaimed,
      seasonRes,
      gaugesRes,
      catalogSubjects,
      overviewRes,
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
      // « En direct » : amis actifs dans les 20 dernières minutes (migration
      // 160) — alimente le chip de présence au-dessus du CTA duel.
      supabase.rpc('friends_live'),
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
      // Jauges de traque (212) : une par gardien déjà rencontré. Ne dépend pas
      // de la classe — elle part avec le profil, pas dans une vague à elle.
      fetchGauges(supabase, user.id),
      // Catalogue des matières : servi par le cache serveur, donc gratuit.
      getSubjectsCached(),
      // Amitiés (migration 019) : seules les demandes REÇUES nous intéressent
      // ici — elles font la pastille du jeton Amis. RPC absente → data null →
      // aucune pastille, jamais d'erreur.
      supabase.rpc('friends_overview'),
    ])

    trophies = Math.max(0, Number(profile.trophies) || 0)
    friendRequests = mapFriendsOverview(
      Array.isArray(overviewRes.data) ? overviewRes.data : [],
    ).incoming.length
    const firstName = String(profile.full_name ?? '').split(' ')[0] || 'Moi'
    heroName = firstName
    const level = schoolLevelForGrade(profile.grade_level ?? null)
    const schoolId =
      level === 'college'
        ? profile.college_school_id
        : profile.lycee_school_id

    // --- VAGUE 2 : ce qui dépend VRAIMENT du cycle et de l'école -------------
    // Quatre requêtes, pas quinze. Chacune reste tolérante à l'absence de sa
    // migration (RPC absente → data null → classement vide).
    const [clanRes, schoolRes, tournamentRes, chapterRes, subjectLevels] =
      await Promise.all([
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
          ? resolveCurrentChapter(
              supabase,
              user.id,
              profile.grade_level,
              todayKey,
            )
          : Promise.resolve(null),
        // Couples (matière, niveau) ayant du contenu (cache serveur, gratuit) :
        // ils disent quelles matières ont VRAIMENT de quoi réviser — une matière
        // vide n'aurait pas de gardien à traquer, sa jauge serait un cul-de-sac.
        // Tous les niveaux, pas seulement celui de l'élève : une matière
        // hors-niveau (culture générale) range son contenu ailleurs.
        getSubjectLevelsCached(),
      ])

    duelEntries = normalizeRankedHistory(matchesRes.data)
    reviewCount = reviewQueue(reviews, todayKey).length

    // LA TRAQUE : une carte par matière AYANT DU CONTENU à ce niveau. Une
    // matière déclarée mais vide (migration 193) donnerait une jauge qu'on ne
    // peut pas remplir — un cul-de-sac de plus.
    traqueBoard = buildTraqueBoard(
      gaugesRes,
      subjectsWithContentAt(
        catalogSubjects,
        subjectLevels,
        profile.grade_level ?? '',
      ).map((s) => ({
        name: s.name,
        slug: s.slug,
      })),
      todayKey,
    )
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
    onlineFriendName = buildLiveSessions(liveRes.data)[0]?.friend.name
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

  // LE BURGER — la porte unique du second rang, façon Clash Royale. La colonne
  // droite portait une cartouche de rang, une grappe de deux objets ET un
  // rouleau : quatre cibles empilées sur le bord d'un écran de jeu. Le rang est
  // parti rejoindre le niveau à gauche (colonne d'identité), et TOUT le reste
  // est ici, en trois groupes : ce qui se LIT (historique, classements, ligue),
  // ce qui se GAGNE (tournoi, coffre d'équipe), puis le compte (amis,
  // réglages — l'engrenage a quitté le bandeau du haut).
  const menuItems: OrbItem[] = [
    {
      id: 'historique',
      label: 'Historique',
      image: '/images/defi/icones/historique.webp',
      imageIsTile: true,
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
      // Une LISTE ordonnée, pas un trophée : le trophée désigne déjà le Tournoi
      // des écoles et la coupe du classement. Trois récompenses différentes
      // portaient le même dessin — on ne savait plus laquelle ouvrait quoi.
      id: 'classements',
      label: 'Classements',
      image: '/images/defi/icones/classement.webp',
      imageIsTile: true,
      sub: rankingPreview,
      sheetTitle: 'Classements',
      sheetContent: <RankingTabs boards={boards} clanLabel={clanLabel} />,
    },
    {
      // Médaille (pas une couronne : la couronne appartient à la SAISON —
      // le bandeau du haut — et deux couronnes pour deux concepts se lisaient
      // comme un doublon).
      id: 'ligue',
      label: 'Ligue',
      image: '/images/defi/icones/ligues.webp',
      imageIsTile: true,
      sub: leaguePreview,
      sheetTitle: league.name,
      sheetContent: <WeeklyLeague league={league} isDemo={leagueIsDemo} />,
    },
    {
      // L'ÉCOLE, plus le trophée : le trophée est parti au bouton « Classé »
      // de la rangée de combat, le seul mode qui fasse bouger le compteur de
      // trophées. Ici l'icône nomme le SUJET du tournoi (comme Users pour
      // Amis, Gift pour le coffre) — un dessin, un sens.
      id: 'tournoi',
      label: 'Tournoi des écoles',
      icon: <SchoolIcon className={ORB_ICON} strokeWidth={ORB_STROKE} />,
      dividerBefore: true,
      sheetTitle: 'Tournoi des écoles',
      sheetContent: (
        <div className="p-4">
          <SchoolTournament
            board={tournament}
            todayKey={todayKey}
            isDemo={tournamentIsDemo}
          />
        </div>
      ),
    },
    {
      // La semaine de clan est LE moteur de rétention : un coffre non réclamé
      // doit se voir depuis l'arène — d'où la pastille reportée sur le burger
      // quand le menu est fermé. Corail RÉSERVÉ au coffre à réclamer ;
      // « rejoins ton école » est une information, pas un dû → pastille neutre.
      id: 'coffre',
      // Libellé court : le nom du clan tenait sur deux lignes (ou se coupait)
      // dans une plaque de menu. Il reste le titre de la feuille, là où il a
      // la place de se lire en entier.
      label: "Coffre d'équipe",
      icon: <Gift className={ORB_ICON} strokeWidth={ORB_STROKE} />,
      // Pastille sans emoji : « 1 » (un coffre à ouvrir) ou « ! » (il manque
      // une école). Le 🎁 était rendu par la police du SYSTÈME — le seul dessin
      // de l'écran que le jeu ne contrôlait pas.
      badge: clanReward ? '1' : user && !hasSchool ? '!' : undefined,
      badgeTone: clanReward ? ('alert' as const) : ('neutral' as const),
      sheetTitle: clanLabel ?? 'Mon clan',
      sheetContent: (
        <div className="flex flex-col gap-4 p-4">
          {/* La semaine en cours passe DEVANT : compte à rebours, place du
              clan, apport personnel. L'école est le contexte (le tournoi a sa
              propre entrée). */}
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
        </div>
      ),
    },
    {
      // L'engrenage du bandeau a déménagé ici (lib/top-hud-routes) : sur
      // l'arène, le haut de l'écran est rendu au jeu. Un visiteur y trouve la
      // porte d'entrée plutôt qu'un réglage qui n'existe pas encore pour lui.
      id: 'reglages',
      label: user ? 'Paramètres' : 'Se connecter',
      image: '/images/defi/icones/reglages.webp',
      imageIsTile: true,
      dividerBefore: true,
      href: user ? '/compte' : '/login',
    },
  ]

  // LA BARRETTE DE L'ANGLE HAUT-DROIT, façon Clash Royale : les boutons qui
  // vivent AU BORD, juste sous la bande des monnaies, le burger tout au coin et
  // ses compagnons à sa gauche. Amis quitte le menu pour venir là : c'est la
  // seule entrée du second rang qui porte un DÛ permanent (une demande reçue
  // attend une réponse) — enfouie derrière le burger, elle ne se voyait plus.
  const cornerTiles: RailTile[] = [
    {
      id: 'amis',
      label:
        friendRequests > 0
          ? `Amis — ${friendRequests} demande${friendRequests > 1 ? 's' : ''} en attente`
          : 'Amis',
      image: '/images/defi/icones/amis.webp',
      imageIsTile: true,
      badge: friendRequests > 0 ? String(friendRequests) : undefined,
      badgeTone: 'alert',
      href: '/amis',
    },
  ]

  // Rail GAUCHE — le duo missions, tuiles libres. La pastille des quêtes dit
  // le dû (corail : récompense à réclamer) ou le reste à faire (neutre) —
  // décision dans lib/arene-hud.questTileBadge. Le boss de la semaine change
  // chaque lundi : sa tuile est vivante toute seule, le minuteur crée le
  // rendez-vous.
  const questBadge = questTileBadge(
    questViewList.map((v) => ({ id: v.def.id, done: v.done })),
    questClaimedIds,
  )
  // LA TRAQUE — la tuile Boss n'ouvre plus un mode de jeu : elle ouvre la CARTE
  // DES GARDIENS. Le boss le plus avancé (ou celui qui vient de sortir) donne
  // son visage à la tuile, la pastille compte ceux qui attendent, et le
  // minuteur dit l'essentiel d'un coup d'œil : le temps qui reste s'il est
  // sorti, l'avancement de la jauge sinon.
  const traqueReady = readyCount(traqueBoard)
  const traqueFeatured = featuredCard(traqueBoard)
  const traqueLead = traqueFeatured ?? traqueBoard[0] ?? null
  const traqueTimer = traqueFeatured
    ? countdownLabel(traqueFeatured.remainingMs)
    : traqueLead && traqueLead.percent > 0
      ? `${traqueLead.percent} %`
      : undefined
  const leftTiles: RailTile[] = [
    ...(questViewList.length > 0
      ? [
          {
            id: 'quetes',
            label: `Quêtes du jour — ${doneCount(questViewList)} sur ${questViewList.length} faites`,
            image: '/images/defi/icones/quetes.webp',
            imageIsTile: true,
            badge: questBadge ? String(questBadge.count) : undefined,
            badgeTone: questBadge?.tone,
            sheetTitle: 'Quêtes du jour',
            sheetContent: (
              <div className="p-4">
                <DailyQuests
                  views={questViewList}
                  claimedIds={questClaimedIds}
                />
              </div>
            ),
          } satisfies RailTile,
        ]
      : []),
    // La tuile disparaît tant que la migration 212 n'est pas exécutée
    // (traqueBoard vide) : mieux vaut pas de tuile qu'une carte de jauges qui
    // ne monteraient jamais.
    ...(traqueBoard.length > 0
      ? [
          {
            id: 'boss',
            label: traqueFeatured
              ? `${traqueFeatured.boss.name} est sorti de sa tanière — ouvrir la carte des gardiens`
              : 'Les gardiens — remplis leur jauge en révisant',
            // Le VISAGE du gardien n'apparaît que s'il est SORTI ; tant qu'il
            // rôde, la tuile ne montre que le sceau des gardiens. C'est ce
            // contraste qui fait l'événement — d'où deux illustrations, et pas
            // une seule : le buste (posé sur la tuile ambre de l'urgence) ou le
            // médaillon, qui porte déjà son propre cadre.
            image: traqueFeatured?.boss.image ?? '/images/defi/icones/boss.webp',
            imageIsTile: !traqueFeatured,
            family: traqueFeatured ? ('amber' as const) : undefined,
            badge: traqueReady > 0 ? String(traqueReady) : undefined,
            badgeTone: 'alert' as const,
            timer: traqueTimer,
            sheetTitle: 'La Traque',
            sheetContent: <BossSheet cards={traqueBoard} />,
          } satisfies RailTile,
        ]
      : []),
  ]

  // L'OBJECTIF DU BOUTON — ce que le CTA dit en plus de sa destination : la
  // contribution de clan de la semaine et le temps qu'il reste avant dimanche
  // (façon « 60/700 · Fin dans 3j 23h » de Clash Royale). Null sans semaine de
  // clan : le bouton retombe alors sur sa seule sous-ligne pédagogique.
  const goal = duelGoal(clanWeek ? clanWeek.myPoints : null, todayKey)

  // La piste du Pass de saison, ouverte par le bandeau du haut.
  const seasonViews = season
    ? trackView(season.crowns, season.claimed, season.hasPass)
    : null

  // LA BANDE DU HAUT — le bandeau de saison (ou, sans la migration 207, la
  // mention honnête de pré-saison). Il était collé au bloc CTA en bas ; il
  // occupe désormais le centre de la bande haute, entre la pastille de niveau
  // et les pièces, façon Pass Royale.
  const seasonBand =
    season && seasonViews ? (
      <SeasonBanner
        number={season.season.number}
        name={season.season.name}
        progress={tierProgress(season.crowns)}
        countdown={seasonCountdown(todayKey)}
        isLastDay={isSeasonLastDay(todayKey)}
        claimable={claimableCount(seasonViews)}
      >
        <div className="p-4">
          <SeasonTrack state={season} today={todayKey} />
        </div>
      </SeasonBanner>
    ) : (
      <p
        className="olympe-glass mx-auto flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[0.68rem] font-bold"
        aria-label="Pré-saison : le classement est déjà actif, tes trophées comptent et sont conservés."
      >
        <Crown
          className="size-3.5 shrink-0 text-highlight"
          strokeWidth={2.4}
          aria-hidden="true"
        />
        <span className="truncate">Classement · pré-saison</span>
      </p>
    )

  // Niveau + XP vivent UNIQUEMENT dans la pastille du HUD (ProfileChip, qui
  // lit l'XP du portefeuille) ; le socle du personnage ne porte que le prénom.
  return (
    <div className="-mx-4 -mt-16 -mb-24 flex h-dvh flex-col overflow-hidden px-3 pt-14 pb-[calc(4.75rem+env(safe-area-inset-bottom))] md:mx-0 md:-my-10 md:pt-4 md:pb-4">
      {/* Vigie de promotion : fête la montée de ligue depuis la dernière visite. */}
      {leagueTier !== null ? <LeaguePromotionWatch tier={leagueTier} /> : null}
      {/* Rythme vertical : gap-4 (2x) entre la scène/le podium et le groupe
          d'action du bas, qui règle son espacement interne sur gap-2 (x). */}
      <div className="mx-auto flex h-full w-full max-w-md flex-col gap-4">
        {/* La scène : arène plein cadre, le PERSONNAGE sur son socle ancré en
            bas au centre. Quatre rangées façon Clash Royale : monnaies (niveau
            dans l'angle gauche), puis rang à gauche FACE à la barrette
            Amis + burger dans l'angle droit, puis le bandeau de saison en
            pleine largeur, puis le rail des missions. Aucun bandeau de titre :
            l'arène DIT déjà où l'on est. */}
        <ArenaHud
          leftTiles={leftTiles}
          cornerTiles={cornerTiles}
          menuItems={menuItems}
          profileSlot={profileData ? <ProfileChip data={profileData} /> : null}
          // key : élément serveur rendu dans la colonne du HUD client — sans
          // clé, React (SSR) le signale comme enfant de liste anonyme.
          rankSlot={<RankCard key="rank" trophies={trophies} />}
          seasonSlot={seasonBand}
        >
          <ArenaHero name={heroName} boss={traqueFeatured?.boss ?? null} />
        </ArenaHud>

        {/* Le GROUPE d'action du bas : CTA duel + ligne CLASSÉ / MODES, soudés
            par un espacement x (gap-2). Le bandeau de saison n'y est plus : il
            a rejoint la bande du haut (seasonSlot). */}
        <div className="flex flex-col gap-2">
          {/* LE MESSAGE ÉCLAIR (façon 7DS) — il ne s'affiche QUE quand un
              gardien vient d'être débusqué, et il prend alors la première
              place du groupe d'action : ce qui se joue dans l'heure passe
              devant tout le reste. Un tap mène droit au combat. */}
          {traqueFeatured ? <BossFlash card={traqueFeatured} /> : null}

          {/* LES JAUGES DU JOUR, À DÉCOUVERT — la progression de la traque ne
              vit plus seulement dans la feuille Boss : les deux gardiens du
              jour montrent leur barre sur l'arène, et un tap mène là où on la
              remplit (Réviser la matière). Le gardien déjà annoncé en grand
              par le message éclair en est exclu : il n'y a pas deux fois la
              même information à l'écran. */}
          <TraqueStrip
            cards={dayBossCards(traqueBoard, 2, traqueFeatured?.boss.id)}
          />

          {/* LA BULLE DU JOUR — la checklist des quêtes à découvert, SOUDÉE au
              bouton par sa flèche (la bulle « Événement » de Clash Royale).
              Elle s'efface quand un gardien vient d'être débusqué : le message
              éclair est alors la seule urgence de l'écran, et deux appels
              simultanés n'en font aucun. La tuile Quêtes du rail gauche reste
              la porte dans ce cas. */}
          {traqueFeatured ? null : (
            <QuestBubble views={questViewList} claimedIds={questClaimedIds} />
          )}

          {/* LA RANGÉE DE COMBAT, façon home Clash Royale : le DUEL 90 s en or
              au centre — la boucle centrale du jeu, une action, 90 secondes,
              sur le chapitre le plus utile de l'élève — encadré par ses deux
              satellites carrés et sombres, Classé à gauche, Modes à droite.
              Une seule ligne, un seul objet brillant : l'œil n'a plus à
              choisir entre trois boutons empilés. */}
          <div className="flex items-stretch gap-2">
            <MatchClasseCta />
            <Duel90Cta
              reason={duelReason}
              onlineFriendName={onlineFriendName}
              goal={goal}
            />
            <ModesSheet todayKey={todayKey} liveDuel={!!user} />
          </div>
        </div>
      </div>
    </div>
  )
}
