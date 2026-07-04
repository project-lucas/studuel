import Link from 'next/link'
import { CircleUser, GraduationCap, TriangleAlert } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/PageHeader'
import SubjectsHome from '@/components/SubjectsHome'
import WeekStrip from '@/components/WeekStrip'
import ExamProgress, { type ExamProgressEntry } from '@/components/ExamProgress'
import { createClient } from '@/lib/supabase/server'
import { computeStreak, weekProgress } from '@/lib/streak'
import { examsForProfile } from '@/lib/exams'
import { getChapterMastery, MASTERY_THRESHOLDS } from '@/lib/mastery'
import type { Subject } from '@/lib/types'

export const metadata = { title: 'Réviser — Scolaria' }
export const dynamic = 'force-dynamic'

export default async function ReviserPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div>
        <PageHeader
          title="Réviser"
          description="Ta série, ton avancement examen et ton programme, au même endroit."
        />
        <Card className="mx-auto w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CircleUser className="size-4" /> Connecte-toi pour réviser
            </CardTitle>
            <CardDescription>
              Tes matières s&apos;adaptent à ta classe, de la 6e à la Terminale.
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

  const { data: profile } = await supabase
    .from('profiles')
    .select('grade_level, selected_subjects')
    .eq('id', user.id)
    .maybeSingle()

  const grade = profile?.grade_level ?? null

  if (!grade) {
    return (
      <div>
        <PageHeader title="Réviser" />
        <Card className="mx-auto w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="size-4" /> Dis-nous ta classe
            </CardTitle>
            <CardDescription>
              Ton programme dépend de ta classe — configure-la en 30 secondes.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/onboarding">Choisir ma classe</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const [
    { data: subjects, error },
    { data: tests },
    { data: studies },
    { data: levelChapters },
  ] = await Promise.all([
    supabase.from('subjects').select('*').order('name').returns<Subject[]>(),
    supabase.from('test_sessions').select('created_at, quiz_id'),
    supabase.from('study_sessions').select('created_at'),
    supabase
      .from('chapters')
      .select('id, subject_id')
      .eq('level', grade)
      .returns<{ id: string; subject_id: string }[]>(),
  ])

  if (error) {
    return (
      <div>
        <PageHeader title="Réviser" />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TriangleAlert className="size-4 text-destructive" />
              Matières indisponibles
            </CardTitle>
            <CardDescription>
              {error.message} — exécute <code>supabase/008_reviser.sql</code>{' '}
              dans le SQL Editor.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  // --- Bloc 1 : série hebdomadaire (quiz + flashcards confondus) -------------
  const activeDays = new Set(
    [...(tests ?? []), ...(studies ?? [])].map((s) =>
      String(s.created_at).slice(0, 10),
    ),
  )
  const streak = computeStreak(activeDays)
  const week = weekProgress(activeDays)

  // --- Bloc 2 : avancement pondéré par les scores ------------------------------
  const selected = Array.isArray(profile?.selected_subjects)
    ? (profile.selected_subjects as string[])
    : null
  const allSubjects = subjects ?? []

  // Épreuves officielles si classe à examen, sinon progression des matières
  // sélectionnées : l'élève voit toujours que ses quiz payent.
  const exams = examsForProfile(grade, selected, allSubjects)
  const hasExam = exams.length > 0
  const tracked = hasExam
    ? exams
    : allSubjects
        .filter(
          (s) =>
            s.levels.includes(grade) &&
            (selected === null || selected.length === 0 || selected.includes(s.slug)),
        )
        .map((s) => ({ label: s.name, subject: s }))

  const mastery = await getChapterMastery(supabase)

  const chaptersBySubject = new Map<string, string[]>()
  for (const c of levelChapters ?? []) {
    const list = chaptersBySubject.get(c.subject_id) ?? []
    list.push(c.id)
    chaptersBySubject.set(c.subject_id, list)
  }

  const examEntries: ExamProgressEntry[] = tracked
    .map(({ label, subject }) => {
      const ids = chaptersBySubject.get(subject.id) ?? []
      let sum = 0
      let mastered = 0
      let fragile = 0
      let notStarted = 0
      for (const id of ids) {
        const m = mastery.get(id)
        if (m === undefined) {
          notStarted += 1
          continue
        }
        sum += m
        if (m >= MASTERY_THRESHOLDS.mastered) mastered += 1
        else if (m < MASTERY_THRESHOLDS.fragile) fragile += 1
      }
      return {
        label,
        subject,
        total: ids.length,
        progress: ids.length > 0 ? sum / ids.length : 0,
        mastered,
        fragile,
        notStarted,
      }
    })
    .filter((e) => e.total > 0)

  // --- Bloc 3 : mes matières ---------------------------------------------------
  const ofLevel = allSubjects.filter((s) => s.levels.includes(grade))

  return (
    <div className="flex flex-col gap-4">
      <WeekStrip week={week} streak={streak} />
      <ExamProgress
        title={hasExam ? 'Objectif examen' : 'Ma progression'}
        entries={examEntries}
      />
      <SubjectsHome subjects={ofLevel} selected={selected} grade={grade} />
    </div>
  )
}
