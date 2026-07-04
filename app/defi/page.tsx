import Link from 'next/link'
import { Zap, GraduationCap } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/PageHeader'
import DefiHome, { type ChallengeItem } from '@/components/DefiHome'
import { createClient } from '@/lib/supabase/server'
import { computeStreak, toDayKey } from '@/lib/streak'
import { getChapterMastery } from '@/lib/mastery'
import { computeXp, levelFor } from '@/lib/xp'
import type { QuizQuestion, DeckCard } from '@/lib/types'

export const metadata = { title: 'Défi — Scolaria' }
export const dynamic = 'force-dynamic'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default async function DefiPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div>
        <PageHeader title="Le Défi" description="3 minutes par jour. C'est tout." />
        <Card className="mx-auto w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="size-4 text-primary" /> Connecte-toi pour jouer
            </CardTitle>
            <CardDescription>
              Un défi de 3 minutes par jour, adapté à ta classe. XP, série,
              niveaux — et au passage, tu révises.
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
    .select('full_name, grade_level')
    .eq('id', user.id)
    .maybeSingle()

  const grade = profile?.grade_level ?? null
  if (!grade) {
    return (
      <div>
        <PageHeader title="Le Défi" />
        <Card className="mx-auto w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="size-4" /> Dis-nous ta classe
            </CardTitle>
            <CardDescription>
              Le défi s&apos;adapte à ton programme — 30 secondes de config.
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

  // --- Stats : XP, niveau, série (toutes sources de sessions) -----------------
  const [
    { data: tests },
    { data: studies },
    { data: lessonsDone },
    { data: challenges },
    mastery,
    { data: quizzes },
    { data: decks },
  ] = await Promise.all([
    supabase.from('test_sessions').select('created_at, score'),
    supabase.from('study_sessions').select('created_at, cards_count'),
    supabase.from('lesson_completions').select('created_at'),
    supabase.from('challenge_sessions').select('created_at, xp'),
    getChapterMastery(supabase),
    supabase
      .from('quizzes')
      .select('id, subject, lesson_id')
      .eq('grade_level', grade),
    supabase
      .from('flashcard_decks')
      .select('id, subject')
      .eq('grade_level', grade)
      .eq('is_free', true),
  ])

  const xpTotal = computeXp({
    quizzes: (tests ?? []).map((t) => ({ score: Number(t.score ?? 0) })),
    decks: (studies ?? []).map((s) => ({
      cards_count: Number(s.cards_count ?? 0),
    })),
    lessonsCount: (lessonsDone ?? []).length,
    challengesXp: (challenges ?? []).reduce((s, c) => s + Number(c.xp ?? 0), 0),
  })
  const level = levelFor(xpTotal)

  const activeDays = new Set(
    [
      ...(tests ?? []),
      ...(studies ?? []),
      ...(lessonsDone ?? []),
      ...(challenges ?? []),
    ].map((s) => String(s.created_at).slice(0, 10)),
  )
  const streak = computeStreak(activeDays)
  const today = toDayKey(new Date())
  const doneToday = (challenges ?? []).some((c) =>
    String(c.created_at).startsWith(today),
  )

  // --- Composition du défi : chapitres faibles d'abord -------------------------
  // Quiz de la classe, classés par maîtrise du chapitre lié (les plus bas d'abord).
  const quizList = quizzes ?? []
  const lessonIds = quizList
    .map((q) => q.lesson_id)
    .filter((l): l is string => !!l)
  const chapterByLesson = new Map<string, string>()
  if (lessonIds.length > 0) {
    const { data: lessons } = await supabase
      .from('lessons')
      .select('id, chapter_id')
      .in('id', lessonIds)
    for (const l of lessons ?? []) {
      chapterByLesson.set(String(l.id), String(l.chapter_id))
    }
  }
  const weightOf = (q: { lesson_id: string | null }) => {
    const chapterId = q.lesson_id ? chapterByLesson.get(q.lesson_id) : undefined
    const p = chapterId ? mastery.get(chapterId) : undefined
    return p?.value ?? 0 // jamais travaillé = priorité maximale
  }
  const rankedQuizzes = shuffle(quizList).sort((a, b) => weightOf(a) - weightOf(b))
  const pickedQuizzes = rankedQuizzes.slice(0, 2)

  const items: ChallengeItem[] = []

  if (pickedQuizzes.length > 0) {
    const { data: questions } = await supabase
      .from('quiz_questions')
      .select('id, quiz_id, question, kind, options, correct_index, explanation, position')
      .in('quiz_id', pickedQuizzes.map((q) => q.id))
      .returns<QuizQuestion[]>()
    const subjectByQuiz = new Map(pickedQuizzes.map((q) => [q.id, q.subject]))
    for (const q of shuffle(questions ?? []).slice(0, 5)) {
      items.push({
        kind: 'question',
        id: q.id,
        prompt: q.question,
        options: q.options,
        correctIndex: q.correct_index,
        explanation: q.explanation,
        subject: subjectByQuiz.get(q.quiz_id) ?? null,
      })
    }
  }

  const deck = shuffle(decks ?? [])[0]
  if (deck) {
    const { data: cards } = await supabase
      .from('deck_cards')
      .select('id, deck_id, front, back, position')
      .eq('deck_id', deck.id)
      .returns<DeckCard[]>()
    for (const c of shuffle(cards ?? []).slice(0, 3)) {
      items.push({
        kind: 'card',
        id: c.id,
        front: c.front,
        back: c.back,
        subject: deck.subject,
      })
    }
  }

  const firstName = profile?.full_name?.split(' ')[0] ?? null

  return (
    <DefiHome
      items={shuffle(items)}
      streak={streak}
      doneToday={doneToday}
      level={level}
      firstName={firstName}
    />
  )
}
