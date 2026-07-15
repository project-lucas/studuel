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
import ContinueCard, { type ContinueTarget } from '@/components/ContinueCard'
import ConsolidateList, {
  type ConsolidateEntry,
} from '@/components/ConsolidateList'
import ExamProgress, { type ExamProgressEntry } from '@/components/ExamProgress'
import CommuteBanner from '@/components/CommuteBanner'
import ReviewQueueCard from '@/components/ReviewQueueCard'
import SubjectMasteryCelebration from '@/components/SubjectMasteryCelebration'
import { createClient } from '@/lib/supabase/server'
import { getSubjectsCached, getGradeChaptersCached } from '@/lib/catalog'
import { examsForProfile } from '@/lib/exams'
import { getChapterMastery, chapterState } from '@/lib/mastery'
import { getReviewItems, reviewQueue, countsBySubject } from '@/lib/srs'
import { toDayKey, computeStreak } from '@/lib/streak'
import {
  normalizeExamList,
  activeExams,
  examHintsBySubject,
} from '@/lib/next-exam'
import type { CommuteSlot, Subject } from '@/lib/types'

export const metadata = { title: 'Réviser — Studuel' }
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
    .select(
      'full_name, grade_level, selected_subjects, commute_slots, upcoming_exams',
    )
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
    cachedSubjects,
    cachedChapters,
    mastery,
    reviews,
    // Journées d'activité (tous types confondus) pour la flamme de série du
    // header — même définition que sur l'onglet Moi.
    { data: testDays },
    { data: studyDays },
    { data: lessonDays },
    { data: challengeDays },
  ] = await Promise.all([
    // Catalogue servi par le cache serveur (identique pour tous les élèves).
    getSubjectsCached(),
    getGradeChaptersCached(grade),
    getChapterMastery(supabase, user.id),
    getReviewItems(supabase, user.id),
    supabase.from('test_sessions').select('created_at').eq('user_id', user.id),
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

  // Repli authentifié : cache froid ou migration 026 pas encore exécutée.
  let subjects: Subject[] = cachedSubjects
  let error: { message: string } | null = null
  if (subjects.length === 0) {
    const res = await supabase
      .from('subjects')
      .select('*')
      .order('name')
      .returns<Subject[]>()
    subjects = res.data ?? []
    error = res.error
  }
  let levelChapters = cachedChapters
  if (levelChapters.length === 0) {
    const { data } = await supabase
      .from('chapters')
      .select('id, subject_id, level, title, position')
      .eq('level', grade)
      .order('position', { ascending: true })
      .returns<typeof cachedChapters>()
    levelChapters = data ?? []
  }

  if (error) {
    // Détail technique en console pour le dev, message rassurant pour l'élève.
    console.error('[reviser] chargement des matières impossible:', error.message)
    return (
      <div>
        <PageHeader title="Réviser" />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TriangleAlert className="size-4 text-destructive" />
              Tes matières sont momentanément indisponibles
            </CardTitle>
            <CardDescription>
              On n&apos;arrive pas à charger ton programme pour l&apos;instant.
              Réessaie dans quelques instants — si ça persiste, reviens un peu
              plus tard.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  // File « À revoir aujourd'hui » : items SRS dus + Revanche.
  const queue = reviewQueue(reviews, toDayKey(new Date()))

  // Série vivante pour la flamme du header.
  const activityDays = new Set(
    [
      ...(testDays ?? []),
      ...(studyDays ?? []),
      ...(lessonDays ?? []),
      ...(challengeDays ?? []),
    ].map((s) => String(s.created_at).slice(0, 10)),
  )
  const streak = computeStreak(activityDays)
  const firstName =
    String(profile?.full_name ?? '').split(' ')[0] || null

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

  // Créneaux de trajet : la bannière « mode trajet » ne s'affiche que dans
  // ces fenêtres (elle se teste côté client, en heure de Paris).
  const commuteSlots: CommuteSlot[] = Array.isArray(profile?.commute_slots)
    ? (profile.commute_slots as CommuteSlot[])
    : []

  // Contrôles à venir (migration 087) → annotation des dossiers : chaque matière
  // qui a un contrôle proche porte un liseré coloré + un compte à rebours.
  const today = toDayKey(new Date())
  const upcomingExams = activeExams(
    normalizeExamList(profile?.upcoming_exams),
    today,
  )
  const examBySubject = examHintsBySubject(upcomingExams, today)

  return (
    <div className="flex flex-col gap-4">
      {/* Fête (une seule fois) les matières arrivées à 90 % ou 100 %. */}
      <SubjectMasteryCelebration
        entries={followed.map((s) => ({
          slug: s.slug,
          name: s.name,
          pct: progressBySlug[s.slug] ?? 0,
        }))}
      />
      {/* En haut, façon carnet de programme : bandeau de salutation (prénom,
          classe, série) et la liste des matières qui le chevauche. */}
      <SubjectsHome
        firstName={firstName}
        streak={streak}
        subjects={ofLevel}
        selected={selected}
        grade={grade}
        progressBySlug={progressBySlug}
        examBySubject={examBySubject}
      />
      {/* Rappel contextuel : pendant le trajet, un temps mort devient de l'XP. */}
      <CommuteBanner slots={commuteSlots} />
      {/* La file du jour : révision espacée + Revanche — LE geste qui fait
          mémoriser, juste sous le programme. */}
      <ReviewQueueCard
        total={queue.length}
        revanche={queue.filter((i) => i.in_revanche).length}
        subjects={[...countsBySubject(queue).entries()].sort(
          (a, b) => b[1] - a[1],
        )}
      />
      {/* En dessous : les actions du jour (reprendre, consolider, examen). */}
      {continueTarget ? <ContinueCard target={continueTarget} /> : null}
      <ConsolidateList entries={consolidate} />
      <ExamProgress
        title={EXAM_TITLES[grade] ?? 'Objectif examen'}
        entries={examEntries}
      />
    </div>
  )
}
