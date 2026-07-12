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
import { featuredModeId, type ModeQuestion } from '@/lib/defi-modes'
import { createClient } from '@/lib/supabase/server'
import { computeStreak, toDayKey } from '@/lib/streak'
import { getChapterMastery } from '@/lib/mastery'
import { computeXp, levelFor } from '@/lib/xp'
import { commuteStreak } from '@/lib/trajet'
import type { FriendGhost } from '@/lib/social'
import type { CommuteSlot, QuizQuestion, DeckCard } from '@/lib/types'

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
      // L'en-tête passe en blanc : il repose sur le fond sombre de l'Arène.
      <div className="[&_header_h1]:text-white [&_header_p]:text-white/75">
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
    .select('full_name, grade_level, commute_slots')
    .eq('id', user.id)
    .maybeSingle()

  const grade = profile?.grade_level ?? null
  if (!grade) {
    return (
      <div className="[&_header_h1]:text-white [&_header_p]:text-white/75">
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
    { data: ghostRows },
  ] = await Promise.all([
    // user_id explicite : la RLS le garantit aujourd'hui, mais la couche
    // sociale ouvrira la lecture croisée des sessions — XP et série sont à soi.
    supabase
      .from('test_sessions')
      .select('created_at, score')
      .eq('user_id', user.id),
    supabase
      .from('study_sessions')
      .select('created_at, cards_count')
      .eq('user_id', user.id),
    supabase
      .from('lesson_completions')
      .select('created_at')
      .eq('user_id', user.id),
    supabase
      .from('challenge_sessions')
      .select('created_at, xp')
      .eq('user_id', user.id),
    getChapterMastery(supabase, user.id),
    supabase
      .from('quizzes')
      .select('id, subject, lesson_id')
      .eq('grade_level', grade),
    supabase
      .from('flashcard_decks')
      .select('id, subject')
      .eq('grade_level', grade)
      .eq('is_free', true),
    // Fantômes des amis (duels asynchrones) — [] tant que la migration 023
    // n'est pas passée ou qu'aucun ami n'a joué de duel.
    supabase.rpc('friend_ghosts'),
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

  // Trajets : créneaux du profil + série de trajets studieux (quiz ou défi
  // joué dans un créneau, jours consécutifs).
  const commuteSlots: CommuteSlot[] = Array.isArray(profile?.commute_slots)
    ? (profile.commute_slots as CommuteSlot[])
    : []
  const commuteRun = commuteStreak(
    [...(tests ?? []), ...(challenges ?? [])],
    commuteSlots,
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
  // Pool élargi pour les modes de jeu (Duel, Blitz) : jusqu'à 8 quiz, les
  // chapitres fragiles d'abord — on s'entraîne en s'affrontant.
  const poolQuizzes = rankedQuizzes.slice(0, 8)

  const items: ChallengeItem[] = []
  const pool: ModeQuestion[] = []

  if (poolQuizzes.length > 0) {
    const { data: questions } = await supabase
      .from('quiz_questions')
      .select('id, quiz_id, question, kind, options, correct_index, explanation, position')
      .in('quiz_id', poolQuizzes.map((q) => q.id))
      .returns<QuizQuestion[]>()
    const subjectByQuiz = new Map(poolQuizzes.map((q) => [q.id, q.subject]))
    const valid = (questions ?? []).filter(
      (q) =>
        Array.isArray(q.options) &&
        q.options.length >= 2 &&
        q.correct_index >= 0 &&
        q.correct_index < q.options.length,
    )

    // Le défi du jour garde sa recette : 5 questions des 2 quiz prioritaires.
    const pickedIds = new Set(pickedQuizzes.map((q) => q.id))
    const daily = valid.filter((q) => pickedIds.has(q.quiz_id))
    for (const q of shuffle(daily).slice(0, 5)) {
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

    for (const q of shuffle(valid).slice(0, 60)) {
      pool.push({
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

  // Fantômes réels : les manches enregistrées des amis (prénom + manches,
  // rien d'autre). Formes revalidées — la donnée vient du réseau.
  const ghosts: FriendGhost[] = (Array.isArray(ghostRows) ? ghostRows : [])
    .flatMap((g) => {
      const rounds = (Array.isArray(g?.rounds) ? g.rounds : [])
        .slice(0, 3)
        .flatMap((r: { correct?: unknown; time_ms?: unknown }) => {
          const correct = Number(r?.correct)
          const timeMs = Number(r?.time_ms)
          return Number.isFinite(correct) && Number.isFinite(timeMs)
            ? [{ correct, timeMs }]
            : []
        })
      if (rounds.length === 0 || !g?.friend_id) return []
      return [
        {
          id: String(g.friend_id),
          name: String(g.full_name ?? 'Ami').split(' ')[0] || 'Ami',
          rounds,
        },
      ]
    })

  return (
    <DefiHome
      items={shuffle(items)}
      pool={pool}
      streak={streak}
      doneToday={doneToday}
      level={level}
      firstName={firstName}
      commuteSlots={commuteSlots}
      commuteStreak={commuteRun}
      featuredId={featuredModeId(today)}
      ghosts={ghosts}
    />
  )
}
