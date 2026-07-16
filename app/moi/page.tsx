import Link from 'next/link'
import { CircleUser } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/PageHeader'
import CapacityScore from '@/components/CapacityScore'
import type { DayStatus } from '@/components/DisciplineCalendar'
import WeekSection from '@/components/WeekSection'
import MoiHeader from '@/components/MoiHeader'
import MoiTabs from '@/components/MoiTabs'
import MoiExtras from '@/components/MoiExtras'
import CompagnonCard from '@/components/CompagnonCard'
import DebriefCard from '@/components/DebriefCard'
import GradeSelector from '@/components/GradeSelector'
import StructureChart, { type WeekPoint } from '@/components/StructureChart'
import BadgeGrid from '@/components/BadgeGrid'
import WeeklyRecapCard from '@/components/WeeklyRecapCard'
import MilestonesTimeline from '@/components/MilestonesTimeline'
import { createClient } from '@/lib/supabase/server'
import { toDayKey, computeStreak, weekProgress } from '@/lib/streak'
import { computeWeeklyRecap } from '@/lib/weekly-recap'
import { computeMilestones } from '@/lib/milestones'
import {
  syncAutoHabits,
  isInCommuteSlot,
  longestRun,
  longestAnchored,
  dayIndexOf,
  habitDays,
  PLANIFIER_CATALOG_ID,
} from '@/lib/habits'
import { commuteStreak } from '@/lib/trajet'
import { SHOP_CATALOG } from '@/lib/tresor'
import {
  debriefYearStats,
  isDebriefOutcome,
  type DebriefOutcome,
} from '@/lib/debrief'
import { avatarDataUri, normalizeAvatarConfig } from '@/lib/avatar'
import { GRADE_LEVELS, type GradeLevel } from '@/lib/types'
import type {
  Habit,
  HabitLog,
  HabitCatalogEntry,
  Badge,
  CommuteSlot,
} from '@/lib/types'

export const metadata = { title: 'Moi — Studuel' }
export const dynamic = 'force-dynamic'

type SessionRow = { created_at: string; score: number; total: number }

export default async function MoiPage({
  searchParams,
}: {
  searchParams: Promise<{ bilan?: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div>
        <PageHeader
          title="Moi"
          description="Ton score de structure, tes habitudes et tes records."
        />
        <Card className="mx-auto w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CircleUser className="size-4" /> Connecte-toi pour construire ta
              structure
            </CardTitle>
            <CardDescription>
              Sommeil, révision quotidienne, sport : les habitudes qui font
              monter les notes, suivies jour par jour.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/login">Se connecter</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Mission fixe pour tous : « Planifier ma semaine » (dimanche) —
  // auto-inscrite, impossible à perdre.
  await supabase.from('habits').upsert(
    { user_id: user.id, catalog_id: PLANIFIER_CATALOG_ID, target: {} },
    { onConflict: 'user_id,catalog_id', ignoreDuplicates: true },
  )

  // Profil + habitudes d'abord (nécessaires à la synchro auto).
  // capacity_quiz voyage avec le profil : si 013_capacite.sql n'est pas passée,
  // profileError le signale (bandeau migration) et la page continue, dégradée.
  const [{ data: profile, error: profileError }, { data: habits }, { data: avatarRow }] =
    await Promise.all([
    supabase
      .from('profiles')
      .select('full_name, grade_level, commute_slots, capacity_quiz')
      .eq('id', user.id)
      .maybeSingle(),
    supabase
      .from('habits')
      .select('id, catalog_id, target, created_at, habit_catalog(*)')
      .order('created_at', { ascending: true })
      .returns<Habit[]>(),
    // avatar isolé : la colonne vient de 082_avatar.sql (peut-être pas encore
    // passée) — son absence ne doit pas casser la lecture du profil (prénom,
    // créneaux) ni afficher un bandeau de migration trompeur.
    supabase.from('profiles').select('avatar').eq('id', user.id).maybeSingle(),
  ])

  const commuteSlots: CommuteSlot[] = Array.isArray(profile?.commute_slots)
    ? (profile.commute_slots as CommuteSlot[])
    : []

  // Validation automatique « à la volée » du jour (révision, trajets).
  await syncAutoHabits(supabase, user.id, habits ?? [], commuteSlots)

  // Un an de logs : la modale « Ma discipline » propose une vue Année.
  const since = new Date()
  since.setUTCDate(since.getUTCDate() - 366)

  const [
    { data: logs },
    { data: catalog, error: catalogError },
    { data: badges },
    { data: userBadges },
    { data: tests },
    { data: studies },
    { data: lessonsDone },
    { data: challenges },
    { data: workRow },
    { data: communityRaw },
    { data: purchases },
    { data: debriefSel, error: debriefError },
    { data: debriefRows },
    { data: debriefYearRows },
    { data: debriefRewardRow },
  ] = await Promise.all([
    supabase
      .from('habit_logs')
      .select('id, habit_id, date, completed, auto_validated')
      .gte('date', toDayKey(since))
      .returns<HabitLog[]>(),
    supabase.from('habit_catalog').select('*').returns<HabitCatalogEntry[]>(),
    supabase.from('badges').select('*').returns<Badge[]>(),
    supabase.from('user_badges').select('badge_id'),
    // user_id explicite : la RLS le garantit aujourd'hui, mais la couche
    // sociale ouvrira la lecture croisée des sessions — ces stats sont à soi.
    supabase
      .from('test_sessions')
      .select('created_at, score, total')
      .eq('user_id', user.id)
      .returns<SessionRow[]>(),
    supabase.from('study_sessions').select('created_at').eq('user_id', user.id),
    supabase
      .from('lesson_completions')
      .select('created_at')
      .eq('user_id', user.id),
    supabase
      .from('challenge_sessions')
      .select('created_at')
      .eq('user_id', user.id),
    // Temps de travail (chrono du Défi) — requête séparée : si 014_temps.sql
    // n'est pas passée, seule cette colonne manque, le reste tient debout.
    supabase
      .from('profiles')
      .select('work_seconds')
      .eq('id', user.id)
      .maybeSingle(),
    // Temps cumulé de tous les élèves (fonction SQL 014_temps.sql). Dégradé
    // proprement si la migration n'est pas encore passée.
    supabase.rpc('community_seconds'),
    // Accessoires du compagnon (achats boutique, kind « compagnon »).
    supabase.from('shop_purchases').select('item_id').eq('user_id', user.id),
    // Débrief d'habitudes (027_debrief.sql) — dégradé proprement si la
    // migration n'est pas encore passée (debriefError → carte en mode info).
    supabase.from('debrief_habits').select('pair_id'),
    supabase
      .from('debrief_logs')
      .select('pair_id, outcome')
      .eq('date', toDayKey(new Date())),
    // Un an de débriefs pour la rétrospective annuelle « ce que j'ai coaché ».
    supabase
      .from('debrief_logs')
      .select('pair_id, date, outcome')
      .gte('date', toDayKey(since)),
    // Récompense du jour déjà créditée ? (081 — dégradé si migration absente.)
    supabase
      .from('debrief_rewards')
      .select('date')
      .eq('date', toDayKey(new Date()))
      .maybeSingle(),
  ])

  if (catalogError) {
    // Détail technique en console pour le dev, message rassurant pour l'élève.
    console.error('[moi] catalogue des habitudes indisponible:', catalogError.message)
    return (
      <div>
        <PageHeader title="Moi" />
        <Card>
          <CardHeader>
            <CardTitle>Cet onglet est momentanément indisponible</CardTitle>
            <CardDescription>
              On n&apos;arrive pas à charger tes habitudes pour l&apos;instant.
              Réessaie dans quelques instants.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const activeHabits = habits ?? []
  const allLogs = logs ?? []
  const today = toDayKey(new Date())

  // --- Bloc 1 : bilan de capacités (questionnaire post-onboarding) ---------------
  const quiz = profile?.capacity_quiz as {
    score?: unknown
    answers?: unknown
  } | null
  const capacityScore =
    typeof quiz?.score === 'number' ? Math.round(quiz.score) : null
  const capacityAnswers =
    quiz?.answers && typeof quiz.answers === 'object'
      ? (quiz.answers as Record<string, number>)
      : {}
  const { bilan } = await searchParams

  // --- Bloc 2 : la semaine courante (dates, validations, missions par jour) ------
  const weekDates: string[] = []
  {
    const cursor = new Date()
    cursor.setUTCHours(0, 0, 0, 0)
    cursor.setUTCDate(cursor.getUTCDate() - ((cursor.getUTCDay() + 6) % 7))
    for (let i = 0; i < 7; i++) {
      weekDates.push(toDayKey(cursor))
      cursor.setUTCDate(cursor.getUTCDate() + 1)
    }
  }
  const doneByDate: Record<string, Record<string, boolean>> = {}
  for (const log of allLogs) {
    if (log.date >= weekDates[0] && log.date <= weekDates[6]) {
      ;(doneByDate[log.date] ??= {})[log.habit_id] = log.completed
    }
  }

  // --- Bloc 3 : « Ma discipline » — statut de chaque journée ---------------------
  // complete = toutes les missions planifiées validées ; partial = une partie ;
  // missed = aucune ; rest = rien de planifié ce jour-là.
  const completedKeys = new Set(
    allLogs.filter((l) => l.completed).map((l) => `${l.habit_id}|${l.date}`),
  )
  const dayStatuses: Record<string, DayStatus> = {}
  const dayCursor = new Date(since)
  while (toDayKey(dayCursor) <= today) {
    const key = toDayKey(dayCursor)
    const idx = dayIndexOf(key)
    const scheduled = activeHabits.filter(
      (h) =>
        habitDays(h).includes(idx) && String(h.created_at).slice(0, 10) <= key,
    )
    if (scheduled.length === 0) {
      dayStatuses[key] = 'rest'
    } else {
      const done = scheduled.filter((h) =>
        completedKeys.has(`${h.id}|${key}`),
      ).length
      dayStatuses[key] =
        done === scheduled.length
          ? 'complete'
          : done > 0
            ? 'partial'
            : key === today
              ? 'rest' // la journée n'est pas finie : pas encore « manquée »
              : 'missed'
    }
    dayCursor.setUTCDate(dayCursor.getUTCDate() + 1)
  }

  // --- Bloc 4 : structure vs notes, 8 semaines -----------------------------------
  const monday = new Date()
  monday.setUTCHours(0, 0, 0, 0)
  monday.setUTCDate(monday.getUTCDate() - ((monday.getUTCDay() + 6) % 7))

  // Structure d'une semaine = missions validées / missions PLANIFIÉES
  // (chaque habitude compte pour ses jours planifiés, pas 7 j/7).
  const activeIds = new Set(activeHabits.map((h) => h.id))
  const slotsPerWeek = activeHabits.reduce(
    (s, h) => s + habitDays(h).length,
    0,
  )

  const chartData: WeekPoint[] = []
  for (let w = 7; w >= 0; w--) {
    const start = new Date(monday)
    start.setUTCDate(start.getUTCDate() - w * 7)
    const end = new Date(start)
    end.setUTCDate(end.getUTCDate() + 7)
    const inWeek = (dateStr: string) => {
      const d = new Date(dateStr)
      return d >= start && d < end
    }

    const weekLogs = allLogs.filter(
      (l) =>
        l.completed && activeIds.has(l.habit_id) && inWeek(`${l.date}T12:00:00Z`),
    )
    const structure =
      slotsPerWeek > 0
        ? Math.min(100, Math.round((weekLogs.length / slotsPerWeek) * 100))
        : null

    const weekTests = (tests ?? []).filter(
      (t) => t.total > 0 && inWeek(t.created_at),
    )
    const notes =
      weekTests.length > 0
        ? Math.round(
            (weekTests.reduce((s, t) => s + t.score / t.total, 0) /
              weekTests.length) *
              100,
          )
        : null

    chartData.push({
      week: `${String(start.getUTCDate()).padStart(2, '0')}/${String(start.getUTCMonth() + 1).padStart(2, '0')}`,
      structure,
      notes,
    })
  }

  // --- Bloc 5 : records + badges -------------------------------------------------
  const allActivity = [
    ...(tests ?? []),
    ...(studies ?? []),
    ...(lessonsDone ?? []),
    ...(challenges ?? []),
  ]
  // Temps de travail mesuré par le chrono du Défi, stocké sur le profil.
  const workSeconds = Number(workRow?.work_seconds ?? 0) || 0
  const studyMinutes = Math.floor(workSeconds / 60)
  // bigint Postgres → nombre ou chaîne selon PostgREST : on normalise.
  const communityParsed = Number(communityRaw)
  const communitySeconds =
    communityRaw != null && Number.isFinite(communityParsed)
      ? communityParsed
      : null
  const activityDays = new Set(
    allActivity.map((s) => String(s.created_at).slice(0, 10)),
  )
  // Bloc 1 : la semaine en cours (L→D) et la série vivante.
  const currentStreak = computeStreak(activityDays)
  const week = weekProgress(activityDays)
  // Bilan hebdo : les chiffres marquants de la semaine courante (sessions, jours
  // actifs, moyenne aux quiz), calculés sur les données déjà chargées.
  const weeklyRecap = computeWeeklyRecap(
    weekDates[0],
    allActivity.map((s) => String(s.created_at).slice(0, 10)),
    (tests ?? []).map((t) => ({
      date: String(t.created_at).slice(0, 10),
      score: t.score,
      total: t.total,
    })),
  )
  // Journal de progression : jalons horodatés reconstruits sur les données déjà
  // chargées (sessions + jours d'activité), du plus récent au plus ancien.
  const milestones = computeMilestones({
    quizzes: (tests ?? []).map((t) => ({
      date: String(t.created_at).slice(0, 10),
      score: t.score,
      total: t.total,
    })),
    lessonDates: (lessonsDone ?? []).map((l) => String(l.created_at).slice(0, 10)),
    challengeDates: (challenges ?? []).map((c) => String(c.created_at).slice(0, 10)),
    activityDays: [...activityDays],
  })
  const sessionsPerDay = new Map<string, number>()
  for (const s of allActivity) {
    const key = String(s.created_at).slice(0, 10)
    sessionsPerDay.set(key, (sessionsPerDay.get(key) ?? 0) + 1)
  }
  const anchored = longestAnchored(activeHabits, allLogs)
  const records = {
    longestStreak: longestRun(activityDays),
    maxSessionsDay: Math.max(0, ...sessionsPerDay.values()),
    anchoredDays: anchored.days,
    anchoredTitle: anchored.title,
  }

  // Évaluation des badges (idempotente).
  // Sessions de trajet : quiz ET défis joués dans un créneau comptent.
  const commuteSessions = [...(tests ?? []), ...(challenges ?? [])].filter(
    (t) => isInCommuteSlot(String(t.created_at), commuteSlots),
  )
  const metrics = {
    streak: records.longestStreak,
    anchored: anchored.days,
    commuteQuizzes: commuteSessions.length,
    commuteStreak: commuteStreak(commuteSessions, commuteSlots),
    quizCount: (tests ?? []).length,
    perfect: (tests ?? []).some((t) => t.total > 0 && t.score === t.total),
    habitsCount: activeHabits.length,
    studyMinutes,
  }
  const meets = (condition: Record<string, unknown>): boolean => {
    const days = Number(condition.days ?? 0)
    const count = Number(condition.count ?? 0)
    const minutes = Number(condition.minutes ?? 0)
    switch (condition.type) {
      case 'study_minutes':
        return metrics.studyMinutes >= minutes
      case 'streak':
        return metrics.streak >= days
      case 'habit_anchored':
        return metrics.anchored >= days
      case 'commute_quizzes':
        return metrics.commuteQuizzes >= count
      case 'commute_streak':
        return metrics.commuteStreak >= days
      case 'habits_count':
        return metrics.habitsCount >= count
      case 'quiz_count':
        return metrics.quizCount >= count
      case 'perfect_quiz':
        return metrics.perfect
      default:
        return false
    }
  }

  const unlockedIds = new Set((userBadges ?? []).map((b) => String(b.badge_id)))
  const newlyUnlocked = (badges ?? []).filter(
    (b) => !unlockedIds.has(b.id) && meets(b.condition),
  )
  if (newlyUnlocked.length > 0) {
    await supabase
      .from('user_badges')
      .upsert(
        newlyUnlocked.map((b) => ({ user_id: user.id, badge_id: b.id })),
        { onConflict: 'user_id,badge_id', ignoreDuplicates: true },
      )
    for (const b of newlyUnlocked) unlockedIds.add(b.id)
  }

  const firstName = String(profile?.full_name ?? '').split(' ')[0] || 'Élève'

  // Classe courante, validée contre la liste fermée (null si non renseignée).
  const gradeLevel: GradeLevel | null = GRADE_LEVELS.includes(
    profile?.grade_level as GradeLevel,
  )
    ? (profile!.grade_level as GradeLevel)
    : null

  // Débrief d'habitudes : sélection référencée + issues du jour.
  const debriefSelected = (debriefSel ?? []).map((r) => String(r.pair_id))
  const debriefOutcomes: Record<string, DebriefOutcome> = {}
  for (const r of debriefRows ?? []) {
    if (isDebriefOutcome(r.outcome)) {
      debriefOutcomes[String(r.pair_id)] = r.outcome
    }
  }
  // Rétrospective annuelle + récompense du jour déjà prise.
  const debriefYearData = debriefYearStats(
    debriefSelected,
    (debriefYearRows ?? []).map((r) => ({
      pair_id: String(r.pair_id),
      date: String(r.date),
      outcome: String(r.outcome),
    })),
  )
  const debriefRewardClaimed = Boolean(debriefRewardRow)

  // Avatar personnalisable du bandeau : config validée + rendu pré-calculé
  // (data-URI) pour un affichage immédiat sans embarquer DiceBear côté client.
  const avatarConfig = normalizeAvatarConfig(avatarRow?.avatar)
  const avatarUri = avatarDataUri(avatarConfig, 160)

  // Compagnon d'étude : nourri par la série, habillé par la boutique.
  const ownedIds = new Set((purchases ?? []).map((p) => String(p.item_id)))
  const companionAccessories = SHOP_CATALOG.filter(
    (i) => i.kind === 'compagnon' && ownedIds.has(i.id),
  ).map((i) => i.emoji)

  return (
    <div>
      {/* Fond papier réchauffé pleine page, derrière tout l'onglet. */}
      <div aria-hidden="true" className="moi-bg fixed inset-0 -z-10" />

      {/* Carte bandeau : flamme de niveau à cheval, nom centré, série ramassée
          dans une pastille, temps total. */}
      <MoiHeader
        name={firstName}
        avatarUri={avatarUri}
        avatarConfig={avatarConfig}
        playerSeconds={workSeconds}
        communitySeconds={communitySeconds}
        streak={currentStreak}
      />

      {/* Le débrief du jour, sorti en évidence juste sous l'identité : le geste
          quotidien qui rapporte des pièces + la rétro annuelle du parcours. */}
      <div className="mt-5">
        <DebriefCard
          selected={debriefSelected}
          outcomes={debriefOutcomes}
          yearStats={debriefYearData}
          rewardClaimedToday={debriefRewardClaimed}
          needsMigration={Boolean(debriefError)}
        />
      </div>

      {/* Le reste, rangé derrière trois onglets (une section à la fois) au lieu
          d'être empilé : Ma semaine · Compagnon · Progrès. Fini le scroll. */}
      <MoiTabs
        semaine={
          <div className="flex flex-col gap-4">
            {/* Rétro hebdo : la semaine en cours résumée en chiffres. */}
            <WeeklyRecapCard recap={weeklyRecap} />
            <WeekSection
              week={week}
              streak={currentStreak}
              weekDates={weekDates}
              todayIdx={dayIndexOf(today)}
              habits={activeHabits}
              catalog={catalog ?? []}
              doneByDate={doneByDate}
              dayStatuses={dayStatuses}
              commuteSlots={commuteSlots}
            />
          </div>
        }
        compagnon={
          <CompagnonCard
            streak={currentStreak}
            activeToday={activityDays.has(today)}
            accessories={companionAccessories}
          />
        }
        progres={
          <>
            <div className="mb-4">
              <GradeSelector current={gradeLevel} />
            </div>
            <CapacityScore
              score={capacityScore}
              answers={capacityAnswers}
              autoOpen={bilan === '1'}
              needsMigration={Boolean(profileError)}
            />
            {/* Journal de progression : la frise des jalons du parcours. */}
            <div className="mt-4">
              <MilestonesTimeline milestones={milestones} />
            </div>
            {/* Graphique et badges : repliés derrière deux icônes, à la demande. */}
            <MoiExtras
              chart={<StructureChart data={chartData} />}
              badges={
                <BadgeGrid
                  badges={badges ?? []}
                  unlockedIds={unlockedIds}
                  records={records}
                />
              }
            />
          </>
        }
      />
    </div>
  )
}
