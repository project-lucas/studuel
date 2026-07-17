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
import {
  featuredModeId,
  GAME_MODES,
  type GameModeId,
  type ModeQuestion,
} from '@/lib/defi-modes'
import { permuteQuizOptions } from '@/lib/quiz-shuffle'
import { createClient } from '@/lib/supabase/server'
import { computeStreak, toDayKey } from '@/lib/streak'
import { getChapterMastery } from '@/lib/mastery'
import { normalizeExamList, activeExams, examChapterIds } from '@/lib/next-exam'
import { computeXp, levelFor } from '@/lib/xp'
import { commuteStreak } from '@/lib/trajet'
import { avatarEmojiFor, type FriendGhost } from '@/lib/social'
import type { RankPlayer } from '@/lib/trophies'
import type { CommuteSlot, QuizQuestion, DeckCard } from '@/lib/types'

export const metadata = { title: 'Jouer — Studuel' }
export const dynamic = 'force-dynamic'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Route /defi/jouer — la salle de jeu du Défi : défi du jour, modes (Duel,
 * Blitz, Chrono, Survie, Boss), match classé et coop. C'est l'ancienne page
 * /defi (commit 0bc8443~1), rebranchée derrière le nouvel écran d'arène : le
 * CTA « Match classé » et le camp d'entraînement mènent ici.
 */
export default async function DefiJouerPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>
}) {
  // Lien profond depuis le camp d'entraînement / le CTA classé : n'accepte
  // qu'un id du catalogue (ou 'ranked') — tout le reste ouvre l'accueil.
  const { mode } = await searchParams
  const initialMode: GameModeId | 'ranked' | null =
    mode === 'ranked'
      ? 'ranked'
      : GAME_MODES.some((m) => m.id === mode && m.implemented)
        ? (mode as GameModeId)
        : null

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
    { data: friendTrophyRows },
    { data: trophyRow },
    { data: examsRow },
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
    // Trophées des amis pour le classement — [] tant que la migration 079
    // n'est pas passée ou qu'aucun ami n'est accepté.
    supabase.rpc('friends_trophies'),
    // Mes trophées, dans un select ISOLÉ : si la migration 079 n'est pas encore
    // passée (colonnes absentes), cette requête échoue seule → repli sur 0, sans
    // casser la lecture du profil (classe, prénom).
    supabase
      .from('profiles')
      .select('trophies, best_trophies')
      .eq('id', user.id)
      .maybeSingle(),
    // Contrôles à venir (087), select ISOLÉ : si la colonne manque, repli sur []
    // sans casser le Défi. Ces chapitres sont priorisés dans la pioche.
    supabase
      .from('profiles')
      .select('upcoming_exams')
      .eq('id', user.id)
      .maybeSingle(),
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
  // Contrôles à venir déclarés sur Moi (087) : leurs chapitres passent DEVANT
  // dans la pioche → le Défi révise le prochain contrôle sans changer d'onglet.
  const upcomingExams = activeExams(
    normalizeExamList((examsRow as { upcoming_exams?: unknown } | null)?.upcoming_exams),
    today,
  )
  const examChapters = new Set(examChapterIds(upcomingExams))

  const weightOf = (q: { lesson_id: string | null }) => {
    const chapterId = q.lesson_id ? chapterByLesson.get(q.lesson_id) : undefined
    const p = chapterId ? mastery.get(chapterId) : undefined
    return p?.value ?? 0 // jamais travaillé = priorité maximale
  }
  // Priorité 1 : un chapitre de contrôle annoncé. Priorité 2 : maîtrise faible.
  const examPriorityOf = (q: { lesson_id: string | null }) => {
    const chapterId = q.lesson_id ? chapterByLesson.get(q.lesson_id) : undefined
    return chapterId && examChapters.has(chapterId) ? 0 : 1
  }
  const rankedQuizzes = shuffle(quizList).sort(
    (a, b) => examPriorityOf(a) - examPriorityOf(b) || weightOf(a) - weightOf(b),
  )
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
      const shuffled = permuteQuizOptions(q.kind, q.options, q.correct_index, q.id)
      items.push({
        kind: 'question',
        id: q.id,
        prompt: q.question,
        options: shuffled.options,
        correctIndex: shuffled.correctIndex,
        explanation: q.explanation,
        subject: subjectByQuiz.get(q.quiz_id) ?? null,
      })
    }

    for (const q of shuffle(valid).slice(0, 60)) {
      const shuffled = permuteQuizOptions(q.kind, q.options, q.correct_index, q.id)
      pool.push({
        id: q.id,
        prompt: q.question,
        options: shuffled.options,
        correctIndex: shuffled.correctIndex,
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

  // Classement : trophées des amis acceptés (prénom + total), formes revalidées.
  const friendRanks: RankPlayer[] = (
    Array.isArray(friendTrophyRows) ? friendTrophyRows : []
  ).flatMap((r) => {
    const id = r?.friend_id
    const trophies = Number(r?.trophies)
    if (!id || !Number.isFinite(trophies)) return []
    return [
      {
        id: String(id),
        name: String(r.full_name ?? 'Ami').split(' ')[0] || 'Ami',
        emoji: avatarEmojiFor(String(id)),
        trophies: Math.max(0, Math.floor(trophies)),
      },
    ]
  })

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
    // data-no-swipe : la salle de jeu est une pièce immersive — un balayage
    // pendant un duel/blitz/boss ne doit jamais changer d'onglet et perdre la
    // partie en cours (la sortie passe par les boutons explicites).
    <div data-no-swipe>
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
        userId={user.id}
        trophies={Math.max(0, Math.floor(Number(trophyRow?.trophies ?? 0)))}
        bestTrophies={Math.max(0, Math.floor(Number(trophyRow?.best_trophies ?? 0)))}
        friendRanks={friendRanks}
        initialMode={initialMode}
        examFocus={
          upcomingExams.length > 0
            ? { titles: upcomingExams.map((e) => e.chapterTitle) }
            : null
        }
      />
    </div>
  )
}
