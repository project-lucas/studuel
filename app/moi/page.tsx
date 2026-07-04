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
import StructureScore from '@/components/StructureScore'
import HabitsList from '@/components/HabitsList'
import StructureChart, { type WeekPoint } from '@/components/StructureChart'
import BadgeGrid from '@/components/BadgeGrid'
import { createClient } from '@/lib/supabase/server'
import { toDayKey } from '@/lib/streak'
import {
  structureScore,
  syncAutoHabits,
  isInCommuteSlot,
  longestRun,
  longestAnchored,
} from '@/lib/habits'
import type {
  Habit,
  HabitLog,
  HabitCatalogEntry,
  Badge,
  CommuteSlot,
} from '@/lib/types'

export const metadata = { title: 'Moi — Scolaria' }
export const dynamic = 'force-dynamic'

type SessionRow = { created_at: string; score: number; total: number }

export default async function MoiPage() {
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

  // Profil + habitudes d'abord (nécessaires à la synchro auto).
  const [{ data: profile }, { data: habits }] = await Promise.all([
    supabase
      .from('profiles')
      .select('full_name, commute_slots')
      .eq('id', user.id)
      .maybeSingle(),
    supabase
      .from('habits')
      .select('id, catalog_id, target, created_at, habit_catalog(*)')
      .order('created_at', { ascending: true })
      .returns<Habit[]>(),
  ])

  const commuteSlots: CommuteSlot[] = Array.isArray(profile?.commute_slots)
    ? (profile.commute_slots as CommuteSlot[])
    : []

  // Validation automatique « à la volée » du jour (révision, trajets).
  await syncAutoHabits(supabase, user.id, habits ?? [], commuteSlots)

  const since = new Date()
  since.setUTCDate(since.getUTCDate() - 180)

  const [
    { data: logs },
    { data: catalog, error: catalogError },
    { data: badges },
    { data: userBadges },
    { data: tests },
    { data: studies },
    { data: lessonsDone },
  ] = await Promise.all([
    supabase
      .from('habit_logs')
      .select('id, habit_id, date, completed, auto_validated')
      .gte('date', toDayKey(since))
      .returns<HabitLog[]>(),
    supabase.from('habit_catalog').select('*').returns<HabitCatalogEntry[]>(),
    supabase.from('badges').select('*').returns<Badge[]>(),
    supabase.from('user_badges').select('badge_id'),
    supabase
      .from('test_sessions')
      .select('created_at, score, total')
      .returns<SessionRow[]>(),
    supabase.from('study_sessions').select('created_at'),
    supabase.from('lesson_completions').select('created_at'),
  ])

  if (catalogError) {
    return (
      <div>
        <PageHeader title="Moi" />
        <Card>
          <CardHeader>
            <CardTitle>Onglet indisponible</CardTitle>
            <CardDescription>
              {catalogError.message} — exécute <code>supabase/010_moi.sql</code>{' '}
              dans le SQL Editor.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const activeHabits = habits ?? []
  const allLogs = logs ?? []
  const today = toDayKey(new Date())

  // --- Bloc 1 : score de structure ---------------------------------------------
  const score = structureScore(activeHabits, allLogs)

  // --- Bloc 2 : état du jour par habitude ---------------------------------------
  const todayByHabit: Record<string, boolean> = {}
  for (const log of allLogs) {
    if (log.date === today) todayByHabit[log.habit_id] = log.completed
  }

  // --- Bloc 3 : structure vs notes, 8 semaines -----------------------------------
  const monday = new Date()
  monday.setUTCHours(0, 0, 0, 0)
  monday.setUTCDate(monday.getUTCDate() - ((monday.getUTCDay() + 6) % 7))

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
      (l) => l.completed && inWeek(`${l.date}T12:00:00Z`),
    )
    const structure =
      activeHabits.length > 0
        ? Math.min(
            100,
            Math.round((weekLogs.length / (activeHabits.length * 7)) * 100),
          )
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

  // --- Bloc 4 : records + badges -------------------------------------------------
  const activityDays = new Set(
    [...(tests ?? []), ...(studies ?? []), ...(lessonsDone ?? [])].map((s) =>
      String(s.created_at).slice(0, 10),
    ),
  )
  const sessionsPerDay = new Map<string, number>()
  for (const s of [...(tests ?? []), ...(studies ?? []), ...(lessonsDone ?? [])]) {
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
  const metrics = {
    streak: records.longestStreak,
    anchored: anchored.days,
    commuteQuizzes: (tests ?? []).filter((t) =>
      isInCommuteSlot(t.created_at, commuteSlots),
    ).length,
    quizCount: (tests ?? []).length,
    perfect: (tests ?? []).some((t) => t.total > 0 && t.score === t.total),
    habitsCount: activeHabits.length,
  }
  const meets = (condition: Record<string, unknown>): boolean => {
    const days = Number(condition.days ?? 0)
    const count = Number(condition.count ?? 0)
    switch (condition.type) {
      case 'streak':
        return metrics.streak >= days
      case 'habit_anchored':
        return metrics.anchored >= days
      case 'commute_quizzes':
        return metrics.commuteQuizzes >= count
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

  const firstName = profile?.full_name?.split(' ')[0]

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={firstName ? `Moi — ${firstName}` : 'Moi'}
        description="Ta structure de travail, jour après jour. C'est elle qui fait les notes."
      />
      <StructureScore score={score} />
      <HabitsList
        habits={activeHabits}
        catalog={catalog ?? []}
        todayByHabit={todayByHabit}
        today={today}
        commuteSlots={commuteSlots}
      />
      <StructureChart data={chartData} />
      <BadgeGrid
        badges={badges ?? []}
        unlockedIds={unlockedIds}
        records={records}
      />
    </div>
  )
}
