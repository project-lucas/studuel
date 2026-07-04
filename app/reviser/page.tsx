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

  // --- Bloc 2 : avancement examens, dérivé du profil --------------------------
  const selected = Array.isArray(profile?.selected_subjects)
    ? (profile.selected_subjects as string[])
    : null
  const allSubjects = subjects ?? []
  const exams = examsForProfile(grade, selected, allSubjects)

  let examEntries: ExamProgressEntry[] = []
  if (exams.length > 0) {
    // Chapitres couverts = quiz terminés → leçon → chapitre.
    const quizIds = Array.from(
      new Set((tests ?? []).map((t) => t.quiz_id).filter((q): q is string => !!q)),
    )
    const coveredChapters = new Set<string>()
    if (quizIds.length > 0) {
      const { data: quizRows } = await supabase
        .from('quizzes')
        .select('id, lesson_id')
        .in('id', quizIds)
        .returns<{ id: string; lesson_id: string | null }[]>()
      const lessonIds = (quizRows ?? [])
        .map((q) => q.lesson_id)
        .filter((l): l is string => !!l)
      if (lessonIds.length > 0) {
        const { data: lessonRows } = await supabase
          .from('lessons')
          .select('id, chapter_id')
          .in('id', lessonIds)
          .returns<{ id: string; chapter_id: string }[]>()
        for (const l of lessonRows ?? []) coveredChapters.add(l.chapter_id)
      }
    }

    // Total et couverture par matière d'examen (programme du niveau).
    const chaptersBySubject = new Map<string, string[]>()
    for (const c of levelChapters ?? []) {
      const list = chaptersBySubject.get(c.subject_id) ?? []
      list.push(c.id)
      chaptersBySubject.set(c.subject_id, list)
    }

    examEntries = exams.map(({ label, subject }) => {
      const ids = chaptersBySubject.get(subject.id) ?? []
      return {
        label,
        subject,
        total: ids.length,
        covered: ids.filter((id) => coveredChapters.has(id)).length,
      }
    })
  }

  // --- Bloc 3 : mes matières ---------------------------------------------------
  const ofLevel = allSubjects.filter((s) => s.levels.includes(grade))

  return (
    <div className="flex flex-col gap-4">
      <WeekStrip week={week} streak={streak} />
      <ExamProgress entries={examEntries} />
      <SubjectsHome subjects={ofLevel} selected={selected} grade={grade} />
    </div>
  )
}
