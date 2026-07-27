import Link from 'next/link'
import { after } from 'next/server'
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
import { getCurrentUser } from '@/lib/supabase/user'
import { readRowTolerant } from '@/lib/profile-read'
import { toDayKey, activityCutoff } from '@/lib/streak'
import {
  autoHabitLogs,
  mergeHabitLogs,
  dayIndexOf,
  PLANIFIER_CATALOG_ID,
} from '@/lib/habits'
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

// Les colonnes du profil que cet écran affiche, toutes migrations confondues.
type MoiProfileRow = {
  full_name: string | null
  grade_level: string | null
  commute_slots: unknown
  capacity_quiz: unknown
  work_seconds: number | null
  coins: number | null
  avatar: unknown
}

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
  const user = await getCurrentUser()

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

  // --- UNE SEULE VAGUE ----------------------------------------------------------
  // Cet écran enchaînait cinq allers-retours en série : l'inscription de la
  // mission fixe, puis le paquet de lectures, puis la synchro, puis les logs.
  // Trois d'entre eux n'avaient aucune raison d'attendre les autres :
  //
  //  · l'upsert « Planifier ma semaine » est idempotent et ne conditionne
  //    aucune des lectures qui suivaient — il part avec elles ;
  //  · les trois `select` sur `profiles` visaient la MÊME ligne : fusionnés ;
  //  · les logs d'habitudes étaient lus APRÈS `syncAutoHabits` alors que
  //    celle-ci n'écrit que la journée d'AUJOURD'HUI. On les lit maintenant en
  //    parallèle et on applique le résultat de la synchro par-dessus, en
  //    mémoire : même affichage, un aller-retour de moins (voir plus bas).
  //
  // Les quatre historiques de sessions sont désormais BORNÉS à la fenêtre
  // d'activité (400 j) : ils ne servent qu'à la série, aux drivers et à la
  // trajectoire, mais retransféraient tout le passé d'un élève assidu.
  const today = toDayKey(new Date())
  const since = new Date()
  since.setUTCDate(since.getUTCDate() - (DRIVER_WINDOW_DAYS - 1))

  const [
    profile,
    { data: habits },
    { data: tests },
    { data: studies },
    { data: lessonsDone },
    { data: challenges },
    { data: gradeRows },
    { data: termRows, error: termError },
    { data: storedLogs },
  ] = await Promise.all([
    readRowTolerant<MoiProfileRow>(supabase, 'profiles', 'id', user.id, [
      'full_name',
      'grade_level',
      'commute_slots',
      'capacity_quiz',
      // work_seconds (014), coins (018), avatar (082) : plus besoin de trois
      // requêtes pour trois migrations — `readRowTolerant` retire tout seul
      // celles que le schéma ne connaîtrait pas encore.
      'work_seconds',
      'coins',
      'avatar',
    ]),
    supabase
      .from('habits')
      .select('id, catalog_id, target, created_at, habit_catalog(*)')
      .order('created_at', { ascending: true })
      .returns<Habit[]>(),
    supabase
      .from('test_sessions')
      .select('created_at, score, total')
      .eq('user_id', user.id)
      .gte('created_at', activityCutoff()),
    supabase
      .from('study_sessions')
      .select('created_at')
      .eq('user_id', user.id)
      .gte('created_at', activityCutoff()),
    supabase
      .from('lesson_completions')
      .select('created_at')
      .eq('user_id', user.id)
      .gte('created_at', activityCutoff()),
    supabase
      .from('challenge_sessions')
      .select('created_at')
      .eq('user_id', user.id)
      .gte('created_at', activityCutoff()),
    // Notes réelles (167) et moyennes saisies (187) : indépendantes de la
    // synchro des habitudes → chargées ici plutôt que derrière syncAutoHabits.
    supabase
      .from('school_grades')
      .select('id, subject, label, score, out_of, coefficient, date')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(300),
    // termError → saisie masquée si la 187 n'est pas passée.
    supabase
      .from('term_grades')
      .select('school_year, term, average')
      .eq('user_id', user.id),
    supabase
      .from('habit_logs')
      .select('id, habit_id, date, completed, auto_validated')
      .gte('date', toDayKey(since))
      .returns<HabitLog[]>(),
    // Mission fixe pour tous : « Planifier ma semaine » (dimanche) — auto-
    // inscrite, elle nourrit le driver Régularité. Idempotente, donc sans
    // ordre imposé vis-à-vis des lectures ci-dessus.
    supabase.from('habits').upsert(
      { user_id: user.id, catalog_id: PLANIFIER_CATALOG_ID, target: {} },
      { onConflict: 'user_id,catalog_id', ignoreDuplicates: true },
    ),
  ])

  const commuteSlots: CommuteSlot[] = Array.isArray(profile?.commute_slots)
    ? (profile.commute_slots as CommuteSlot[])
    : []

  // Validation automatique du jour (révision, trajets) : les leviers Révision
  // et la Régularité se cochent tout seuls quand l'élève a vraiment travaillé.
  // La décision est PURE — on l'applique tout de suite sur les logs déjà lus…
  const autoRows = autoHabitLogs(
    user.id,
    habits ?? [],
    commuteSlots,
    {
      tests: tests ?? [],
      studies: studies ?? [],
      lessons: lessonsDone ?? [],
      challenges: challenges ?? [],
    },
    today,
  )
  const logs = mergeHabitLogs(storedLogs ?? [], autoRows)

  // … et on la persiste APRÈS l'envoi de la réponse (`after`). L'élève n'attend
  // plus une écriture dont l'écran connaît déjà le résultat ; au prochain
  // chargement, la base dira la même chose.
  if (autoRows.length > 0) {
    after(async () => {
      const { error } = await supabase
        .from('habit_logs')
        .upsert(autoRows, { onConflict: 'habit_id,date' })
      if (error) {
        console.error('[moi] validations auto non enregistrées :', error.message)
      }
    })
  }

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
  const level = workLevel(Number(profile.work_seconds ?? 0) || 0)
  const coins = Number(profile.coins ?? 0) || 0
  const avatarConfig = normalizeAvatarConfig(profile.avatar)
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
                equipment={avatarConfig.equipment}
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
