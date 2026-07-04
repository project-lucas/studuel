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
import ContinueCard, { type ContinueTarget } from '@/components/ContinueCard'
import ConsolidateList, {
  type ConsolidateEntry,
} from '@/components/ConsolidateList'
import ExamProgress, { type ExamProgressEntry } from '@/components/ExamProgress'
import { createClient } from '@/lib/supabase/server'
import { computeStreak, weekProgress } from '@/lib/streak'
import { examsForProfile } from '@/lib/exams'
import { getChapterMastery, chapterState } from '@/lib/mastery'
import type { Subject } from '@/lib/types'

export const metadata = { title: 'Réviser — Scolaria' }
export const dynamic = 'force-dynamic'

const EXAM_TITLES: Record<string, string> = {
  '3e': 'Objectif Brevet',
  '1re': 'Objectif Bac de français',
  Tle: 'Objectif Bac',
}

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
          description="Ta série, ton avancement et ton programme, au même endroit."
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
    { data: completions },
    { data: levelChapters },
    mastery,
  ] = await Promise.all([
    supabase.from('subjects').select('*').order('name').returns<Subject[]>(),
    supabase.from('test_sessions').select('created_at'),
    supabase.from('study_sessions').select('created_at'),
    supabase.from('lesson_completions').select('created_at'),
    supabase
      .from('chapters')
      .select('id, subject_id, title, position')
      .eq('level', grade)
      .order('position', { ascending: true })
      .returns<{ id: string; subject_id: string; title: string; position: number }[]>(),
    getChapterMastery(supabase),
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
              {error.message} — exécute <code>supabase/008_reviser.sql</code> et{' '}
              <code>supabase/009_lesson_completions.sql</code> dans le SQL
              Editor.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  // --- Série : quiz, flashcards ET leçons terminées valident la journée ------
  const activeDays = new Set(
    [...(tests ?? []), ...(studies ?? []), ...(completions ?? [])].map((s) =>
      String(s.created_at).slice(0, 10),
    ),
  )
  const streak = computeStreak(activeDays)
  const week = weekProgress(activeDays)

  // --- Matières suivies (profil onboarding) -----------------------------------
  const selected = Array.isArray(profile?.selected_subjects)
    ? (profile.selected_subjects as string[])
    : null
  const allSubjects = subjects ?? []
  const ofLevel = allSubjects.filter((s) => s.levels.includes(grade))
  const followed = ofLevel.filter(
    (s) => selected === null || selected.length === 0 || selected.includes(s.slug),
  )
  const followedIds = new Set(followed.map((s) => s.id))
  const subjectById = new Map(followed.map((s) => [s.id, s]))

  // --- Analyse chapitre par chapitre ------------------------------------------
  type Analyzed = {
    subject: Subject
    chapterId: string
    chapterTitle: string
    value: number
    state: ReturnType<typeof chapterState>
  }
  const analyzed: Analyzed[] = []
  const sums = new Map<string, { sum: number; total: number }>()

  for (const c of levelChapters ?? []) {
    const subject = subjectById.get(c.subject_id)
    const agg = sums.get(c.subject_id) ?? { sum: 0, total: 0 }
    const p = mastery.get(c.id)
    agg.sum += p?.value ?? 0
    agg.total += 1
    sums.set(c.subject_id, agg)
    if (!subject || !followedIds.has(c.subject_id)) continue
    analyzed.push({
      subject,
      chapterId: c.id,
      chapterTitle: c.title,
      value: p?.value ?? 0,
      state: chapterState(p),
    })
  }

  // --- Carte « Reprendre » : fragile le plus bas > en cours le plus avancé >
  //     premier chapitre jamais commencé ----------------------------------------
  const fragiles = analyzed
    .filter((a) => a.state === 'fragile')
    .sort((a, b) => a.value - b.value)
  const enCours = analyzed
    .filter((a) => a.state === 'en_cours')
    .sort((a, b) => b.value - a.value)
  const aCommencer = analyzed.filter((a) => a.state === 'a_commencer')

  const next = fragiles[0] ?? enCours[0] ?? aCommencer[0] ?? null
  const continueTarget: ContinueTarget | null = next
    ? {
        subject: next.subject,
        chapterId: next.chapterId,
        chapterTitle: next.chapterTitle,
        progress: next.value,
        isNew: next.state === 'a_commencer',
      }
    : null

  // --- « À consolider » : fragiles puis à commencer (hors carte Reprendre) ----
  const consolidate: ConsolidateEntry[] = [...fragiles, ...aCommencer]
    .filter((a) => a.chapterId !== continueTarget?.chapterId)
    .slice(0, 3)
    .map((a) => ({
      subject: a.subject,
      chapterId: a.chapterId,
      chapterTitle: a.chapterTitle,
      state: a.state === 'fragile' ? 'fragile' : 'a_commencer',
      progress: a.value,
    }))

  // --- Objectif examen (classes à examen uniquement) ---------------------------
  const exams = examsForProfile(grade, selected, allSubjects)
  const examEntries: ExamProgressEntry[] = exams
    .map(({ subject }) => {
      const agg = sums.get(subject.id) ?? { sum: 0, total: 0 }
      return {
        label: subject.name,
        subject,
        total: agg.total,
        progress: agg.total > 0 ? agg.sum / agg.total : 0,
      }
    })
    .filter((e) => e.total > 0)

  // --- Anneaux des tuiles -------------------------------------------------------
  const progressBySlug: Record<string, number> = {}
  for (const s of ofLevel) {
    const agg = sums.get(s.id)
    progressBySlug[s.slug] =
      agg && agg.total > 0 ? Math.round((agg.sum / agg.total) * 100) : 0
  }

  return (
    <div className="flex flex-col gap-4">
      <WeekStrip week={week} streak={streak} />
      {continueTarget ? <ContinueCard target={continueTarget} /> : null}
      <ConsolidateList entries={consolidate} />
      <ExamProgress
        title={EXAM_TITLES[grade] ?? 'Objectif examen'}
        entries={examEntries}
      />
      <SubjectsHome
        subjects={ofLevel}
        selected={selected}
        grade={grade}
        progressBySlug={progressBySlug}
      />
    </div>
  )
}
