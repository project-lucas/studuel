import Link from 'next/link'
import { CircleUser, GraduationCap } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/PageHeader'
import ExamBlancPlayer from '@/components/ExamBlancPlayer'
import { createClient } from '@/lib/supabase/server'
import { getSubjectsCached } from '@/lib/catalog'
import { examsForProfile } from '@/lib/exams'
import { composeExam, type ExamQuestion } from '@/lib/exam-blanc'
import { permuteQuizOptions } from '@/lib/quiz-shuffle'
import type { QuizQuestion, Subject } from '@/lib/types'

export const metadata = { title: 'Examen blanc — Studuel' }
export const dynamic = 'force-dynamic'

const EXAM_TITLES: Record<string, string> = {
  '3e': 'Conditions Brevet',
  '1re': 'Conditions Bac de français',
  Tle: 'Conditions Bac',
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default async function ExamenBlancPage({
  searchParams,
}: {
  // `?subject=slug` : examen blanc ciblé sur UNE matière (lancé depuis son
  // dossier). Absent → examen multi-matières classique.
  searchParams: Promise<{ subject?: string }>
}) {
  const { subject: subjectParam } = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div>
        <PageHeader
          title="Examen blanc"
          description="Chrono, plusieurs matières, bilan par chapitre."
        />
        <Card className="mx-auto w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CircleUser className="size-4" /> Connecte-toi pour composer
            </CardTitle>
            <CardDescription>
              L&apos;examen blanc simule les conditions du jour J et te dit
              exactement quoi retravailler.
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
        <PageHeader title="Examen blanc" />
        <Card className="mx-auto w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="size-4" /> Dis-nous ta classe
            </CardTitle>
            <CardDescription>
              Le sujet s&apos;adapte à ton programme — 30 secondes de config.
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

  const selected = Array.isArray(profile?.selected_subjects)
    ? (profile.selected_subjects as string[])
    : null

  // Le catalogue des matières sort du cache serveur (lib/catalog), pas d'un
  // scan Supabase à chaque composition d'examen.
  const [cachedSubjects, { data: quizzes }, { data: lastExam }] =
    await Promise.all([
      getSubjectsCached(),
      supabase
        .from('quizzes')
        .select('id, subject, lesson_id')
        .eq('grade_level', grade),
      supabase
        .from('exam_blanc_sessions')
        .select('score, total')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
    ])

  // Matières de l'épreuve : celles de l'examen officiel (brevet/bac) si la
  // classe en a un, sinon toutes les matières suivies — l'examen blanc reste
  // un contrôle multi-matières utile dès la 6e.
  // Repli authentifié : cache froid ou migration 026 pas encore exécutée
  // (même motif que /reviser/[subject]).
  let allSubjects: Subject[] = cachedSubjects
  if (allSubjects.length === 0) {
    const { data } = await supabase
      .from('subjects')
      .select('*')
      .returns<Subject[]>()
    allSubjects = data ?? []
  }
  const exams = examsForProfile(grade, selected, allSubjects)
  const examSubjectNames = new Set(exams.map((e) => e.subject.name))
  const slugBySubjectName = new Map(allSubjects.map((s) => [s.name, s.slug]))

  // Examen blanc ciblé : la matière du dossier d'où l'élève l'a lancé. On ne
  // compose alors que sur cette matière, quelle que soit la classe (toutes les
  // matières et toutes les classes disposent ainsi de leur examen blanc).
  const targetSubject = subjectParam
    ? (allSubjects.find((s) => s.slug === subjectParam) ?? null)
    : null
  const targetSubjectName = targetSubject?.name ?? null

  // Chapitre de chaque quiz (pour le bilan) : quiz → leçon → chapitre.
  const quizList = quizzes ?? []
  const lessonIds = quizList
    .map((q) => q.lesson_id)
    .filter((l): l is string => !!l)

  // La requête la plus lourde (quiz_questions) ne dépend QUE de quizList :
  // elle part en parallèle de la chaîne leçons → chapitres au lieu d'attendre
  // derrière elle (2 allers-retours sortis du chemin critique).
  const questionsPromise =
    quizList.length > 0
      ? supabase
          .from('quiz_questions')
          .select(
            'id, quiz_id, question, kind, options, correct_index, explanation, position',
          )
          .in('quiz_id', quizList.map((q) => q.id))
          .returns<QuizQuestion[]>()
      : Promise.resolve({ data: [] as QuizQuestion[] })

  const chapterByLesson = new Map<string, string>()
  const chapterTitles = new Map<string, string>()
  const chapterChain = (async () => {
    if (lessonIds.length === 0) return
    const { data: lessons } = await supabase
      .from('lessons')
      .select('id, chapter_id')
      .in('id', lessonIds)
    for (const l of lessons ?? []) {
      chapterByLesson.set(String(l.id), String(l.chapter_id))
    }
    const chapterIds = [...new Set(chapterByLesson.values())]
    if (chapterIds.length === 0) return
    const { data: chapters } = await supabase
      .from('chapters')
      .select('id, title')
      .in('id', chapterIds)
    for (const c of chapters ?? []) {
      chapterTitles.set(String(c.id), String(c.title))
    }
  })()

  const [{ data: questions }] = await Promise.all([
    questionsPromise,
    chapterChain,
  ])

  // Questions candidates, groupées par matière pour un sujet équilibré.
  const bySubject = new Map<string, ExamQuestion[]>()
  if (quizList.length > 0) {
    const quizById = new Map(quizList.map((q) => [q.id, q]))
    const valid = (questions ?? []).filter(
      (q) =>
        Array.isArray(q.options) &&
        q.options.length >= 2 &&
        q.correct_index >= 0 &&
        q.correct_index < q.options.length,
    )

    for (const q of shuffle(valid)) {
      const quiz = quizById.get(q.quiz_id)
      if (!quiz?.subject) continue
      // Examen ciblé : uniquement la matière demandée. Sinon, classes à examen :
      // seules les matières de l'épreuve composent.
      if (targetSubjectName) {
        if (quiz.subject !== targetSubjectName) continue
      } else if (examSubjectNames.size > 0 && !examSubjectNames.has(quiz.subject)) {
        continue
      }
      const chapterId = quiz.lesson_id
        ? (chapterByLesson.get(quiz.lesson_id) ?? null)
        : null
      const list = bySubject.get(quiz.subject) ?? []
      const shuffled = permuteQuizOptions(q.kind, q.options, q.correct_index, q.id)
      list.push({
        id: q.id,
        prompt: q.question,
        options: shuffled.options,
        correctIndex: shuffled.correctIndex,
        explanation: q.explanation,
        subject: quiz.subject,
        subjectSlug: slugBySubjectName.get(quiz.subject) ?? null,
        chapterId,
        chapterTitle: chapterId ? (chapterTitles.get(chapterId) ?? null) : null,
      })
      bySubject.set(quiz.subject, list)
    }
  }

  const examQuestions = composeExam(bySubject)

  return (
    // data-no-swipe : pas de changement d'onglet au balayage pendant l'examen
    // — le bilan en cours serait perdu (voir SwipeTabs).
    <div data-no-swipe className="flex flex-col gap-4">
      <PageHeader
        title={targetSubjectName ? `Examen blanc · ${targetSubjectName}` : 'Examen blanc'}
        description={
          targetSubjectName
            ? `Comme le jour J, sur ${targetSubjectName} : chrono et bilan par chapitre.`
            : 'Comme le jour J : chrono, plusieurs matières, bilan à la fin.'
        }
      />
      <ExamBlancPlayer
        questions={examQuestions}
        examTitle={
          targetSubjectName
            ? `Examen blanc · ${targetSubjectName}`
            : (EXAM_TITLES[grade] ?? 'Contrôle toutes matières')
        }
        subjectName={targetSubjectName}
        // Le dernier score enregistré n'a pas de matière : ne le montrer que
        // pour l'examen multi-matières (sinon comparaison trompeuse — total
        // différent d'un examen mono-matière ciblé).
        lastScore={
          !targetSubjectName && lastExam
            ? { score: Number(lastExam.score), total: Number(lastExam.total) }
            : null
        }
      />
    </div>
  )
}
