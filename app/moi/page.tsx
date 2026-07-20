import Link from 'next/link'
import { CircleUser, Sparkles } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/PageHeader'
import TabHeader from '@/components/TabHeader'
import WorldBackdrop from '@/components/WorldBackdrop'
import MoiTopBar from '@/components/moi/MoiTopBar'
import MoiTabSwitcher from '@/components/moi/MoiTabSwitcher'
import HeroCard from '@/components/moi/HeroCard'
import TrajectoryCard from '@/components/moi/TrajectoryCard'
import WeeklyLeversCard, {
  type LeverState,
} from '@/components/moi/WeeklyLeversCard'
import { createClient } from '@/lib/supabase/server'
import { toDayKey } from '@/lib/streak'
import { syncAutoHabits, dayIndexOf, PLANIFIER_CATALOG_ID } from '@/lib/habits'
import {
  DRIVER_WINDOW_DAYS,
  LEVERS,
  computeCapacite,
  computeDriverScores,
  computePlafond,
} from '@/lib/capacite-drivers'
import { normalizeGradeList, trimestreOf, trimestreSummaries } from '@/lib/notes'
import {
  computeBacTrajectory,
  mergeTermAverages,
  normalizeTermGrades,
} from '@/lib/trajectoire-bac'
import { avatarDataUri, normalizeAvatarConfig } from '@/lib/avatar'
import { workLevel } from '@/lib/work-level'
import { GRADE_LEVELS, type GradeLevel } from '@/lib/types'
import type { Habit, HabitLog, CommuteSlot } from '@/lib/types'

export const metadata = { title: 'Moi — Studuel' }
export const dynamic = 'force-dynamic'

// Libellés des classes pour la pill du héros (le slug court sinon).
const GRADE_LABELS: Partial<Record<GradeLevel, string>> = {
  '2de': 'Seconde',
  '1re': 'Première',
  Tle: 'Terminale',
}

// L'onglet Moi refondu : un miroir motivant, pas un dashboard. La hero card
// montre la capacité (et son plafond possible), la trajectoire au bac montre
// deux futurs, les leviers de la semaine donnent la main. L'app ne juge
// jamais : elle montre, l'élève choisit.
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
          description="Ta capacité, ta trajectoire et tes leviers."
        />
        <Card className="mx-auto w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CircleUser className="size-4" /> Connecte-toi pour voir ton
              miroir
            </CardTitle>
            <CardDescription>
              Sommeil, hydratation, régularité : l&apos;app te montre ton
              plafond invisible — et comment le repousser.
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

  // Mission fixe pour tous : « Planifier ma semaine » (dimanche) — auto-
  // inscrite, elle nourrit le driver Régularité.
  await supabase.from('habits').upsert(
    { user_id: user.id, catalog_id: PLANIFIER_CATALOG_ID, target: {} },
    { onConflict: 'user_id,catalog_id', ignoreDuplicates: true },
  )

  // Profil + habitudes + sessions (nécessaires à la synchro auto AVANT de lire
  // les logs). Colonnes de migrations différentes isolées pour dégrader proprement.
  const [
    { data: profile },
    { data: statsRow },
    { data: avatarRow },
    { data: habits },
    { data: tests },
    { data: studies },
    { data: lessonsDone },
    { data: challenges },
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('full_name, grade_level, commute_slots, capacity_quiz')
      .eq('id', user.id)
      .maybeSingle(),
    // work_seconds (014) + coins (018) : isolés du profil de base.
    supabase
      .from('profiles')
      .select('work_seconds, coins')
      .eq('id', user.id)
      .maybeSingle(),
    // avatar (082) : isolé aussi — son absence ne casse rien.
    supabase.from('profiles').select('avatar').eq('id', user.id).maybeSingle(),
    supabase
      .from('habits')
      .select('id, catalog_id, target, created_at, habit_catalog(*)')
      .order('created_at', { ascending: true })
      .returns<Habit[]>(),
    supabase
      .from('test_sessions')
      .select('created_at, score, total')
      .eq('user_id', user.id),
    supabase.from('study_sessions').select('created_at').eq('user_id', user.id),
    supabase
      .from('lesson_completions')
      .select('created_at')
      .eq('user_id', user.id),
    supabase
      .from('challenge_sessions')
      .select('created_at')
      .eq('user_id', user.id),
  ])

  const commuteSlots: CommuteSlot[] = Array.isArray(profile?.commute_slots)
    ? (profile.commute_slots as CommuteSlot[])
    : []

  // Validation automatique du jour (révision, trajets) : les leviers Révision
  // et la Régularité se cochent tout seuls quand l'élève a vraiment travaillé.
  await syncAutoHabits(supabase, user.id, habits ?? [], commuteSlots, {
    tests: tests ?? [],
    studies: studies ?? [],
    lessons: lessonsDone ?? [],
    challenges: challenges ?? [],
  })

  const today = toDayKey(new Date())
  const since = new Date()
  since.setUTCDate(since.getUTCDate() - (DRIVER_WINDOW_DAYS - 1))

  const [
    { data: logs },
    { data: gradeRows },
    { data: termRows, error: termError },
  ] = await Promise.all([
    supabase
      .from('habit_logs')
      .select('id, habit_id, date, completed, auto_validated')
      .gte('date', toDayKey(since))
      .returns<HabitLog[]>(),
    // Notes réelles (167) — dégradé en liste vide si absente.
    supabase
      .from('school_grades')
      .select('id, subject, label, score, out_of, coefficient, date')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(300),
    // Moyennes trimestrielles saisies (187) — termError → saisie masquée.
    supabase
      .from('term_grades')
      .select('school_year, term, average')
      .eq('user_id', user.id),
  ])

  const activeHabits = habits ?? []
  const allLogs = logs ?? []

  // --- Capacité : 4 drivers sur 14 jours, repli sur le quiz d'onboarding ------
  const quiz = profile?.capacity_quiz as { score?: unknown } | null
  const quizScore =
    typeof quiz?.score === 'number' ? Math.round(quiz.score) : null
  const drivers = computeDriverScores(activeHabits, allLogs, today)
  const capacite = computeCapacite(drivers, quizScore)
  const plafond = computePlafond(drivers, capacite)

  // --- Trajectoire au bac : notes réelles d'abord, saisie manuelle en repli ---
  const schoolGrades = normalizeGradeList(gradeRows ?? [])
  const summaries = trimestreSummaries(schoolGrades, today)
  const schoolYear = trimestreOf(today)?.year ?? new Date().getUTCFullYear()
  const manualTerms = normalizeTermGrades(termRows ?? [], schoolYear)
  const terms = mergeTermAverages(summaries, manualTerms)
  const trajectory = computeBacTrajectory(terms, capacite, plafond)

  // --- Leviers du jour : l'état coché vient de habit_logs (source unique) -----
  const habitByCatalog = new Map(activeHabits.map((h) => [h.catalog_id, h.id]))
  const doneToday = new Set(
    allLogs
      .filter((l) => l.completed && l.date === today)
      .map((l) => l.habit_id),
  )
  const levers: LeverState[] = LEVERS.map((l) => {
    const habitId = habitByCatalog.get(l.catalogId)
    return {
      catalogId: l.catalogId,
      label: l.label,
      points: l.points,
      driverKey: l.driverKey,
      doneToday: habitId !== undefined && doneToday.has(habitId),
    }
  })

  // --- Identité : prénom, classe, niveau de travail, pièces, avatar -----------
  const firstName = String(profile?.full_name ?? '').split(' ')[0] || 'Élève'
  const gradeLevel: GradeLevel | null = GRADE_LEVELS.includes(
    profile?.grade_level as GradeLevel,
  )
    ? (profile!.grade_level as GradeLevel)
    : null
  const gradeLabel = gradeLevel ? (GRADE_LABELS[gradeLevel] ?? gradeLevel) : null
  const level = workLevel(Number(statsRow?.work_seconds ?? 0) || 0)
  const coins = Number(statsRow?.coins ?? 0) || 0
  const avatarConfig = normalizeAvatarConfig(avatarRow?.avatar)
  const heroAvatarUri = avatarDataUri(avatarConfig, 320)
  const miniAvatarUri = avatarDataUri(avatarConfig, 80)

  return (
    <div>
      <WorldBackdrop className="moi-bg" />

      <TabHeader
        title="Moi"
        subtitle="Ta capacité, ta trajectoire et tes leviers."
      />

      <MoiTopBar level={level} coins={coins} avatarUri={miniAvatarUri} />

      <div className="mt-4">
        <MoiTabSwitcher
          progression={
            <div className="flex flex-col gap-4">
              <HeroCard
                name={firstName}
                gradeLabel={gradeLabel}
                avatarUri={heroAvatarUri}
                avatarConfig={avatarConfig}
                capacite={capacite}
                plafond={plafond}
                drivers={drivers}
              />
              <TrajectoryCard
                trajectory={trajectory}
                needsMigration={Boolean(termError)}
              />
              <WeeklyLeversCard
                levers={levers}
                todayIdx={dayIndexOf(today)}
                today={today}
              />
            </div>
          }
          habitudes={
            <div className="moi-card rounded-3xl bg-white px-4 py-8 text-center">
              <Sparkles
                className="mx-auto size-6 text-primary"
                aria-hidden="true"
              />
              <p className="mt-2 font-heading text-lg font-bold text-foreground">
                Bientôt ici
              </p>
              <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">
                Le détail de tes habitudes arrive : en attendant, coche tes
                leviers de la semaine dans « Ma progression ».
              </p>
            </div>
          }
        />
      </div>
    </div>
  )
}
