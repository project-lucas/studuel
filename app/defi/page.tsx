import { redirect } from 'next/navigation'
import { contentLevelFor } from '@/lib/grades'
import { PREMIUM_TIERS } from '@/lib/gems'
import type { Tier } from '@/lib/subscription'
import ModesSheet from '@/components/defi/ModesSheet'
import CombatButton from '@/components/defi/CombatButton'
import SubjectPlate from '@/components/defi/SubjectPlate'
import ArenaActionBar from '@/components/defi/ArenaActionBar'
import ClassementSheet from '@/components/defi/ClassementSheet'
import CompteTropheesArene from '@/components/defi/CompteTropheesArene'
import { cleEtatCompte, topPourcent } from '@/lib/defi/classement-arene'
import DuelSubjectProvider from '@/components/defi/DuelSubjectProvider'
import { buildDuelBoard } from '@/lib/defi/duel-board'
import {
  buildRoster,
  trophyMap,
  type RosterSubject,
} from '@/lib/defi/roster'
import type { GameTrophyRow } from '@/lib/trophy-road'
import {
  MIN_PROGRAMME_QUIZZES,
  programmeSlug,
} from '@/lib/jeux/programme'
import PremiumPill from '@/components/defi/PremiumPill'
import ArenaHud, {
  type OrbItem,
  type RailTile,
} from '@/components/defi/ArenaHud'
import ArenaHero from '@/components/defi/ArenaHero'
import FigerArene from '@/components/defi/FigerArene'
import {
  buildSubjectLadders,
  defaultSubject,
  type SubjectLadder,
} from '@/lib/subject-rank'
import { unlockedSubjectSlugs } from '@/lib/subject-unlock'
import { getChapterMastery } from '@/lib/mastery-server'
import { fetchAreneVague1 } from '@/lib/arene-vague1'
import { reviewQueue } from '@/lib/srs'
import WeeklyLeague from '@/components/defi/WeeklyLeague'
import LeaguePromotionWatch from '@/components/defi/LeaguePromotionWatch'
import ClanBanner from '@/components/defi/ClanBanner'
import ProfileChip from '@/components/defi/ProfileChip'
import { getProfileData } from '@/app/defi/profile-actions'
import DuelHistory from '@/components/defi/DuelHistory'
import SchoolTournament from '@/components/defi/SchoolTournament'
import {
  Gift,
  // Aliasé : `School` est déjà le TYPE d'une école (lib/clan) dans ce fichier.
} from 'lucide-react'
import {
  MOCK_LEAGUE,
  MOCK_TOURNAMENT,
  MOCK_TROPHIES,
} from '@/lib/defi/mock-data'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
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
  featuredCard,
  readyCount,
  type TraqueCard,
} from '@/lib/traque'
import {
  getSubjectsCached,
  getGradeChaptersCached,
  getSubjectLevelsCached,
  getQuizCountBySubjectCached,
} from '@/lib/catalog'
import { subjectsWithContentAt } from '@/lib/subject-visibility'
import { normalizeRankedHistory } from '@/lib/defi/history'
import { normalizeTournamentBoard, type TournamentBoard } from '@/lib/tournament'
import { toDayKey } from '@/lib/streak'
import {
  normalizeRanking,
  normalizeSchool,
  activeSchoolId,
  schoolLevelForGrade,
  type SchoolLevel,
  ordinalFr,
  type School,
} from '@/lib/clan'
import { clanWeekReward, type ClanWeekBoard } from '@/lib/clan-week'
import { fetchGems } from '@/lib/gems-access'
import { lireFinBoostXp } from '@/lib/boutique/boosts-server'
import {
  lastWeekKey,
} from '@/lib/clan-week-server'
import { fetchQuestViews, fetchClaimedQuestIds } from '@/lib/quests-server'
import { buildTraqueBoard } from '@/lib/traque-server'
import { doneCount, type QuestView } from '@/lib/quests'
import { resolveCurrentChapter } from '@/lib/chapitre-courant-server'
import { reasonLabel } from '@/lib/chapitre-courant'
import DailyQuests from '@/components/defi/DailyQuests'
import { duelGoal } from '@/lib/duel-cta'
import { fetchMyPalmares } from '@/lib/palmares/palmares-server'
import type { LignePalmares } from '@/lib/palmares/palmares'
import ClanWeekCard from '@/components/defi/ClanWeekCard'
import { normalizeLeagueStandings, buildLeague } from '@/lib/league'
import type { League } from '@/lib/defi/types'
import type { ReactNode } from 'react'

export const metadata = { title: 'Défi — Studuel' }
export const dynamic = 'force-dynamic'

// Les colonnes du profil qu'utilise l'arène, toutes migrations confondues :
// trophies (079), college/lycee_school_id (159). Absentes → `undefined`, et
// l'écran dégrade comme avant (0 trophée, pas d'école).
// Icône d'une entrée du menu burger. UNE seule famille (Lucide), UNE seule
// taille, UNE seule graisse : c'est la régularité qui fait le menu propre. Les
// objets illustrés (coupe, coffre) reviendront plus tard, mais tous ensemble —
// deux dessins peints au milieu de cinq pictos au trait, c'était l'écart.
// Le picto de trait du coffre d'équipe, dans le puits du menu : 24 px, pour
// peser autant que les objets peints qui l'entourent. En violet depuis que le
// menu est clair (18/09/2026) : l'or se perdait dans le puits lavande.
const ORB_ICON = 'size-6 text-primary'
const ORB_STROKE = 2.2

/**
 * Quiz de la classe par matière (colonne brute `subject`) : cache serveur,
 * et lecture authentifiée si le cache froid revient vide (migration 026 absente).
 */
async function quizParMatiere(
  supabase: Awaited<ReturnType<typeof createClient>>,
  grade: string,
): Promise<[string, number][]> {
  const enCache = await getQuizCountBySubjectCached(grade)
  if (enCache.length > 0) return enCache
  const { data } = await supabase
    .from('quizzes')
    .select('subject')
    .eq('grade_level', contentLevelFor(grade))
  const counts = new Map<string, number>()
  for (const row of Array.isArray(data) ? data : []) {
    const subject = String(row?.subject ?? '')
    if (subject) counts.set(subject, (counts.get(subject) ?? 0) + 1)
  }
  return [...counts]
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
 * COMBAT : le bouton COMBAT en or, seul objet brillant de l'écran, encadré par
 * ses deux satellites carrés et sombres (Modes, Route des trophées). Trophées et classements
 * sont RÉELS (migrations 079/159) ; le tournoi
 * et la ligue dégradent en vitrine mockée sans leurs migrations.
 */
export default async function DefiPage() {
  const [supabase, user] = await Promise.all([createClient(), getCurrentUser()])

  // Valeurs par défaut (visiteur non connecté : démo mockée).
  let trophies = MOCK_TROPHIES
  let league: League = MOCK_LEAGUE
  // Drapeau « Aperçu » : la ligue mockée (visiteur ou migration 161 absente)
  // est signalée comme telle, jamais déguisée en réelle.
  let leagueIsDemo = true
  let leaguePreview: string | undefined
  // Palier de ligue réel (pour la vigie de promotion) — null tant que démo.
  let leagueTier: number | null = null
  let clanLabel: string | undefined
  let clanNode: ReactNode = null
  // Mon rang parmi TOUS les élèves (`national_ranking`, 159) : la bande
  // « Top 90 % » du compte de trophées et de l'écran Classement. Null pour un
  // visiteur ou tant que la base n'a rien dit.
  let classementNational: { rank: number | null; total: number } | null = null
  let hasSchool = true
  let duelEntries: ReturnType<typeof normalizeRankedHistory> = []
  let reviewCount = 0
  // Mon palmarès des modes (352) — vide pour un visiteur ou tant que la
  // migration dort ; la feuille des modes n'affiche alors aucune place.
  let palmaresLignes: LignePalmares[] = []
  // Le roster de la Route des trophées. Construit à vide pour le visiteur : les
  // tuiles s'affichent à zéro plutôt que de disparaître — on montre ce qu'il y
  // a à gagner avant de demander de se connecter.
  let roster: RosterSubject[] = buildRoster(new Map())
  // LE LADDER PAR MATIÈRE : un rang, un compteur et un pic par matière. Vide
  // pour le visiteur — le module classé ne s'affiche qu'une fois connecté, il
  // n'aurait rien à montrer d'autre que des zéros.
  let ladders: SubjectLadder[] = []
  let activeSubjectSlug: string | null = null
  // Couleur de chaque matière (`subjects.color`) — elle teinte le médaillon de
  // la roulette. Vide pour le visiteur : les médaillons prennent alors le crème
  // neutre, jamais rien.
  let subjectColors = new Map<string, string>()
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
  // LA SÉRIE ET LES CRISTAUX, portés par la carte du joueur (Lucas, 17/09/2026 :
  // « assemble ces trois blocs en un seul »). Le bandeau du haut (TopHud) se
  // masque sur /defi ; c'est donc la page qui lit ces deux compteurs, comme le
  // fait TopHudLoader ailleurs. `null` = visiteur ou base sans la RPC.
  let gems: number | null = null
  let streak: number | null = null
  // Le Boost XP du Marché qui court : « ×2 XP » contre le niveau de la carte.
  let boostXpJusqua: string | null = null
  // LA TRAQUE (212) : une jauge par matière, remplie en révisant. Vide tant que
  // la migration n'est pas passée — la tuile Boss affiche alors une carte
  // d'invitation à réviser, jamais une erreur.
  let traqueBoard: TraqueCard[] = []
  // Demandes d'amis REÇUES : la pastille du jeton Amis de l'angle haut-droit.
  // Une demande en attente est un dû, comme un coffre — elle doit se voir
  // depuis l'arène, pas seulement en ouvrant l'onglet Amis.
  let friendRequests = 0
  // Abonné Studuel+ ? Décide de la pastille d'appel du HUD. `false` par défaut :
  // un visiteur non connecté est justement la cible du message.
  let isPremium = false

  // LE PROFIL DE JEU PART MAINTENANT, en même temps que les vagues de l'arène.
  // Il ne dépend que de l'élève, pas des classements ni du chapitre, mais il
  // était attendu APRÈS eux : ses propres allers-retours (attribution des
  // badges, puis stats, puis bannières, puis école) s'ajoutaient bout à bout à
  // ceux de la page — sept vagues en file indienne, ~400 ms de serveur pour
  // l'écran d'accueil. Lancé ici, il court en parallèle et la page ne l'attend
  // qu'au moment de dessiner la carte. Le `catch` vide ne masque rien : la
  // promesse est bien attendue plus bas, et son erreur y est relancée — il
  // évite seulement un « rejet non géré » si la page échoue avant d'y arriver.
  const profileDataPromise = user ? getProfileData() : Promise.resolve(null)
  profileDataPromise.catch(() => {})

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
    // La vague 1 tient désormais en UNE lecture groupée (`arene_accueil`,
    // migration 322) au lieu de vingt. La latence était déjà bonne — elles
    // étaient parallélisées — mais le NOMBRE ne l'était pas : à cent mille
    // élèves, ~180 pages/s au pic, cette seule page aurait demandé ~4 500
    // requêtes/s à la base. `lib/arene-vague1.ts` porte le détail et le repli
    // sur les vingt lectures tant que la 322 n'est pas exécutée.
    //
    // Restent à côté : les quêtes (chaîne de lecture propre), le catalogue
    // (cache serveur, gratuit) et la maîtrise (son propre agrégat depuis la
    // 321).
    //
    // PLUS DE SECONDE VAGUE (19/09/2026, chantier latence). Ce qui dépend de
    // la classe ou de l'école est CHAÎNÉ sur la seule lecture groupée : il part
    // dès qu'elle rend le profil, sans attendre les quêtes, les gemmes ni la
    // maîtrise. Le palmarès et les couples (matière, niveau), qui ne dépendent
    // de rien, partent d'emblée. Le chapitre courant reçoit la maîtrise déjà
    // demandée ici au lieu de la relire, et les quiz de la classe viennent du
    // cache serveur.
    const vague1P = fetchAreneVague1(supabase, user.id, todayKey, previousWeek)
    const masteryP = getChapterMastery(supabase, user.id)
    const selonClasseP = vague1P.then(async (v) => {
      const p = v.profile
      const niveau = (v.level as SchoolLevel | null)
        ?? schoolLevelForGrade(p.grade_level ?? null)
      const idEcole = activeSchoolId(p, p.grade_level ?? null)
      return Promise.all([
        idEcole
          ? supabase
              .from('schools')
              .select('id, name, city, level')
              .eq('id', idEcole)
              .maybeSingle()
          : Promise.resolve({ data: null }),
        // Tournoi des écoles (migration 162) — null tant qu'elle n'est pas là.
        v.tournamentRes
          ?? supabase.rpc('school_tournament_standings', { p_level: niveau }),
        // Chapitre courant : dépend de la classe (migration 203).
        p.grade_level
          ? resolveCurrentChapter(supabase, user.id, p.grade_level, todayKey, masteryP)
          : Promise.resolve(null),
        // Quiz de la classe par matière, pour savoir lesquelles peuvent servir
        // leur « Programme » : le proxy bon marché de MIN_PROGRAMME_QUIZZES, la
        // route restant seule juge (cf. programme.ts). Cache serveur ; repli
        // sur la lecture authentifiée si le cache est froid et vide.
        p.grade_level ? quizParMatiere(supabase, p.grade_level) : Promise.resolve([]),
        // Chapitres de la classe (cache serveur, gratuit) : ils rattachent une
        // maîtrise de chapitre à SA matière, donc disent quelles matières sont
        // ouvertes au duel classé.
        p.grade_level
          ? getGradeChaptersCached(p.grade_level)
          : Promise.resolve([]),
      ])
    })
    const [
      vague1,
      questRes,
      claimedRes,
      catalogSubjects,
      quizMastery,
      gemsRes,
      streakRes,
      boostXpRes,
      subjectLevels,
      palmaresRes,
      [schoolRes, tournamentRes, chapterRes, quizCounts, gradeChapters],
    ] = await Promise.all([
      vague1P,
      fetchQuestViews(supabase, user.id, todayKey),
      fetchClaimedQuestIds(supabase, user.id, todayKey),
      getSubjectsCached(),
      masteryP,
      fetchGems(supabase, user.id),
      // La RPC `my_streak` (migration 155) : tolérante, comme dans TopHudLoader.
      supabase.rpc('my_streak'),
      lireFinBoostXp(supabase, user.id),
      // Couples (matière, niveau) ayant du contenu (cache serveur, gratuit) :
      // ils disent quelles matières ont VRAIMENT de quoi réviser — une matière
      // vide n'aurait pas de gardien à traquer, sa jauge serait un cul-de-sac.
      // Tous les niveaux, pas seulement celui de l'élève : une matière
      // hors-niveau (culture générale) range son contenu ailleurs.
      getSubjectLevelsCached(),
      // Mon palmarès des modes (352) : chaque billet de la feuille des modes
      // porte ma place de la semaine. Vide tant que la migration dort.
      fetchMyPalmares(supabase),
      selonClasseP,
    ])
    gems = gemsRes
    boostXpJusqua = boostXpRes
    if (!streakRes.error && streakRes.data != null) {
      const n = Number(streakRes.data)
      streak = Number.isFinite(n) ? Math.max(0, n) : null
    }

    const {
      profile,
      natRes,
      liveRes,
      leagueRes,
      matchesRes,
      reviews,
      weekRes,
      lastWeekRes,
      alreadyClaimed,
      gaugesRes,
      overviewRes,
      gameTrophyRes,
      subjectPeaks,
    } = vague1

    // L'arène est désormais la page d'accueil de l'app : un compte PARENT y
    // atterrit au lancement. Il n'a ni classe, ni trophées, ni quêtes — son
    // espace est ailleurs. (Même garde que `/reviser`, qui portait ce rôle
    // quand c'était lui la porte d'entrée.)
    if (profile.profile_type === 'parent') redirect('/parents')

    isPremium = PREMIUM_TIERS.includes(
      (profile.subscription_tier ?? 'free') as Tier,
    )
    trophies = Math.max(0, Number(profile.trophies) || 0)
    friendRequests = mapFriendsOverview(
      Array.isArray(overviewRes.data) ? overviewRes.data : [],
    ).incoming.length
    // Le cycle vient de la base quand la 322 est là (elle le calcule au moment
    // où elle lit le profil) : c'est lui qui obligeait à une SECONDE vague,
    // pour une donnée que Postgres avait déjà sous la main. Repli sur la règle
    // TypeScript, qui reste la référence — un test vérifie que le CASE SQL en
    // est le miroir exact (lib/clan-level.test.ts).
    const level = (vague1.level as SchoolLevel | null)
      ?? schoolLevelForGrade(profile.grade_level ?? null)

    duelEntries = normalizeRankedHistory(matchesRes.data)
    reviewCount = reviewQueue(reviews, todayKey).length
    palmaresLignes = palmaresRes

    // LA ROUTE DES TROPHÉES : compteurs par (matière × jeu), plus la liste des
    // matières dont le « Programme » a de quoi tourner. Formes revalidées — la
    // 238 peut ne pas être passée, auquel cas tout part de zéro sans casser.
    const trophyRows: GameTrophyRow[] = (
      Array.isArray(gameTrophyRes?.data) ? gameTrophyRes.data : []
    ).flatMap((row) => {
      const subject = row?.subject_slug
      const gameId = row?.game_id
      const value = Number(row?.trophies)
      if (!subject || !gameId || !Number.isFinite(value)) return []
      return [{ subject: String(subject), gameId: String(gameId), trophies: value }]
    })

    const quizzesPerSubject = new Map<string, number>()
    for (const [subject, count] of quizCounts) {
      const slug = programmeSlug(subject)
      if (!slug) continue
      quizzesPerSubject.set(slug, (quizzesPerSubject.get(slug) ?? 0) + count)
    }
    const programmeReady = new Set(
      [...quizzesPerSubject]
        .filter(([, count]) => count >= MIN_PROGRAMME_QUIZZES)
        .map(([slug]) => slug),
    )

    roster = buildRoster(trophyMap(trophyRows), { programmeReady })

    // LE LADDER PAR MATIÈRE. Il se DÉDUIT des compteurs déjà lus : le total
    // d'une matière est la somme de ses jeux, et le rang n'est qu'une lecture
    // de ce total (cf. lib/subject-rank). Aucune table de classement en plus —
    // un second compteur de trophées par matière aurait dû rester synchronisé
    // avec le premier, et l'app a déjà payé ce prix une fois.
    const slugBySubjectId = new Map(
      catalogSubjects.map((s) => [s.id, s.slug]),
    )
    subjectColors = new Map(
      catalogSubjects.flatMap((s) => (s.color ? [[s.slug, s.color]] : [])),
    )
    const unlocked = unlockedSubjectSlugs(
      quizMastery,
      gradeChapters.flatMap((chapter) => {
        const slug = slugBySubjectId.get(chapter.subject_id)
        return slug ? [{ chapterId: chapter.id, subjectSlug: slug }] : []
      }),
    )

    ladders = buildSubjectLadders({
      subjects: roster.map((entry) => ({
        subject: entry.subject,
        slug: entry.slug,
        emoji: entry.emoji,
      })),
      rows: trophyRows,
      peaks: subjectPeaks,
      unlockedSlugs: unlocked,
    })

    // La matière du chapitre en cours passe devant : c'est celle que l'élève
    // travaille, donc celle sur laquelle un duel a du sens tout de suite.
    // `chapter.subject` porte déjà le SLUG (cf. lib/chapitre-courant).
    activeSubjectSlug =
      defaultSubject(ladders, chapterRes?.chapter?.subject ?? null)?.slug ?? null

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

    // MON RANG PARMI TOUS LES ÉLÈVES (national_ranking, 159) : c'est lui que
    // le compte de trophées de l'arène traduit en « Top 90 % ». Les tableaux
    // du menu (clan, national, amis) sont partis avec l'entrée « Classements »
    // du burger (22/09/2026) : l'école se lit dans l'onglet Amis.
    const national = normalizeRanking(natRes.data)
    classementNational = { rank: national.myRank, total: national.total }
    const currentSchool: School | null = normalizeSchool(schoolRes.data)
    hasSchool = currentSchool !== null

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

    duelReason = chapterRes?.chapter
      ? reasonLabel(chapterRes.chapter, todayKey)
      : undefined
    onlineFriendName = buildLiveSessions(liveRes.data)[0]?.friend.name
    questViewList = questRes
    questClaimedIds = claimedRes
    clanWeek = weekRes

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

  // Profil de jeu (carte haut-gauche) : agrégation stats + badges + cosmétiques,
  // lancée tout en haut de la page. Null pour un visiteur non connecté (pas de
  // carte). Attribue au passage les badges mérités (recalcul serveur).
  const profileData = await profileDataPromise

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
      image: '/images/defi/icones/historique-v3.webp',
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
      // Médaille (pas une couronne : la couronne appartient à la SAISON —
      // le bandeau du haut — et deux couronnes pour deux concepts se lisaient
      // comme un doublon).
      id: 'ligue',
      label: 'Ligue',
      image: '/images/defi/icones/ligues-v3.webp',
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
      image: '/images/defi/icones/tournoi-v3.webp',
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
      // AMIS REVIENT DANS LE MENU (Lucas, 16/09/2026 : « supprime ce bloc ») :
      // sa plaque de l'angle droit est retirée. Le dû qu'elle portait (une
      // demande reçue) ne se perd pas : la pastille remonte sur le burger tant
      // que le menu est fermé (menuAlertCount), et se lit ici dès qu'il s'ouvre.
      id: 'amis',
      label: 'Amis',
      image: '/images/defi/icones/amis-v3.webp',
      badge: friendRequests > 0 ? String(friendRequests) : undefined,
      badgeTone: 'alert',
      dividerBefore: true,
      href: '/amis',
    },
    {
      // L'engrenage du bandeau a déménagé ici (lib/top-hud-routes) : sur
      // l'arène, le haut de l'écran est rendu au jeu. Un visiteur y trouve la
      // porte d'entrée plutôt qu'un réglage qui n'existe pas encore pour lui.
      id: 'reglages',
      label: user ? 'Paramètres' : 'Se connecter',
      image: '/images/defi/icones/reglages-v3.webp',
      href: user ? '/compte' : '/login',
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
            image: '/images/defi/icones/quetes-v3.webp',
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
            image: traqueFeatured?.boss.image ?? '/images/defi/icones/boss-v3.webp',
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

  // LE PLATEAU DU DUEL — une seule liste de matières pour les TROIS objets qui
  // en parlent : la roulette qui la choisit, le bouton COMBAT qui la lance, la
  // Route des trophées qui la raconte (cf. lib/defi/duel-board). Le roster en
  // fait la colonne vertébrale, donc un visiteur non connecté voit lui aussi
  // les sept matières — fermées, mais présentes.
  const duelBoard = buildDuelBoard(roster, ladders, {
    colorBySlug: subjectColors,
  })

  // PLUS DE BANDE DE SAISON SUR L'ARÈNE (Lucas, 17/09/2026 : « supprime le
  // bloc Saison 3, il est inutile »). La piste du Pass (lib/saison,
  // SeasonTrack) reste en place, sans porte sur cet écran.

  // Niveau + XP vivent UNIQUEMENT dans la pastille du HUD (ProfileChip, qui
  // lit l'XP du portefeuille) ; le socle du personnage ne porte que le prénom.
  return (
    <div className="-mx-4 -mt-16 -mb-24 flex h-dvh flex-col overflow-hidden px-3 pt-14 pb-[calc(5.75rem+env(safe-area-inset-bottom))] md:mx-0 md:-my-10 md:pt-4 md:pb-4">
      {/* L'arène ne défile pas : le document est figé le temps de cet écran. */}
      <FigerArene />
      {/* Vigie de promotion : fête la montée de ligue depuis la dernière visite. */}
      {leagueTier !== null ? <LeaguePromotionWatch tier={leagueTier} /> : null}
      {/* Rythme vertical : gap-4 (2x) entre la scène/le podium et le groupe
          d'action du bas, qui règle son espacement interne sur gap-2 (x).

          Le PROVIDER enveloppe la scène ET la rangée du bas : la matière
          courante est partagée par la roulette (rangée du bas), le bouton
          COMBAT (à côté d'elle) et la Route des trophées (dans le HUD, en
          haut à droite). Trois branches de rendu, un seul choix. */}
      <DuelSubjectProvider board={duelBoard} initialSlug={activeSubjectSlug}>
        <div className="mx-auto flex h-full w-full max-w-md flex-col gap-4">
          {/* La scène : arène plein cadre, le PERSONNAGE sur son socle ancré en
              bas au centre. Façon Clash Royale (22/09/2026) : une bande vide en
              haut, puis la carte du joueur dans l'angle gauche FACE au burger
              et à Studuel+ dans l'angle droit, le compte de trophées en or sous
              la carte, puis le rail des missions. Aucun bandeau de titre :
              l'arène DIT déjà où l'on est. */}
          <ArenaHud
            leftTiles={leftTiles}
            menuItems={menuItems}
            // L'appel Studuel+ n'existe que pour qui n'est pas (encore) abonné.
            premiumSlot={isPremium ? null : <PremiumPill key="premium" />}
            // Le COMPTE DE TROPHÉES sous la carte du joueur (22/09/2026) : la
            // coupe, le total en or, la bande « Top 90 % » en jaune — et la
            // fête du retour quand ils ont bougé. Rien pour un visiteur.
            tropheesSlot={
              user ? (
                <CompteTropheesArene
                  key="trophees"
                  trophees={trophies}
                  top={topPourcent(classementNational?.rank, classementNational?.total)}
                  cle={cleEtatCompte(user.id)}
                />
              ) : null
            }
            // La plaque CLASSEMENT, sous Studuel+ : l'écran clair qui a absorbé
            // la Route des trophées — moi, mes matières à la verticale, le barème.
            classementSlot={
              <ClassementSheet
                key="classement"
                trophees={user ? trophies : undefined}
                classement={classementNational}
              />
            }
            profileSlot={
              profileData ? (
                <ProfileChip
                  key="profil"
                  data={profileData}
                  gems={gems}
                  streak={streak}
                  boostXpJusqua={boostXpJusqua}
                />
              ) : null
            }
          >
            <ArenaHero />
          </ArenaHud>

          {/* Le GROUPE d'action du bas : CTA duel + ligne CLASSÉ / MODES, soudés
              par un espacement x (gap-2). */}
          <div className="flex flex-col gap-2">
            {/* LE MESSAGE ÉCLAIR (façon 7DS) — il ne s'affiche QUE quand un
                gardien vient d'être débusqué, et il prend alors la première
                place du groupe d'action : ce qui se joue dans l'heure passe
                devant tout le reste. Un tap mène droit au combat. */}
            {traqueFeatured ? <BossFlash card={traqueFeatured} /> : null}

            {/* Ni jauges de gardiens, ni bulle des quêtes entre la scène et le
                bouton : l'arène n'a QU'UN appel à l'action. La traque se lit dans
                la tuile Boss du rail gauche, les quêtes dans la tuile Quêtes —
                chacune a déjà sa porte, et sa pastille pour dire ce qui attend. */}

            {/* LA BARRE D'ACTION, façon home Clash Royale : COMBAT en or au
                centre, encadré par ses deux plaques sombres. Une seule ligne, un
                seul objet brillant — et depuis cette passe, une seule FAMILLE de
                formes : trois plaques rectangulaires de même hauteur, de même
                rayon et de même ombre portée. Ce qui distingue le centre est sa
                couleur et sa largeur, jamais sa profondeur.

                La matière courante est RENTRÉE dans le bouton, en second rang
                sous le mot. La ligne d'information qui la portait au-dessus
                flottait entre le socle et la barre, et son fond sombre la
                faisait passer pour un quatrième bouton.

                Le flanc droit ne mène plus à la Route des trophées (partie dans
                le HUD) : il porte la MATIÈRE, et un tap ouvre la feuille de
                sélection. Modes garde le flanc gauche. */}
            <ArenaActionBar
              left={
                <ModesSheet
                  todayKey={todayKey}
                  liveDuel={!!user}
                  palmares={palmaresLignes}
                  // L'accès Studuel+ ouvre tous les jeux d'une matière. (Le
                  // total de trophées a quitté la feuille pour l'arène, sous
                  // la carte du joueur — 22/09/2026.)
                  premium={isPremium}
                />
              }
              center={
                <CombatButton
                  reason={duelReason}
                  onlineFriendName={onlineFriendName}
                  goal={goal}
                />
              }
              right={<SubjectPlate />}
            />
          </div>
        </div>
      </DuelSubjectProvider>
    </div>
  )
}
