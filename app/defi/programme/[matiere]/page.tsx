import { redirect } from 'next/navigation'
import { contentLevelFor } from '@/lib/grades'
import DuelCourse from '@/components/duel/DuelCourse'
import { SALONS } from '@/lib/jeux/catalog'
import {
  MIN_PROGRAMME_QUESTIONS,
  orderQuizzesByWeakness,
  programmeSlug,
  subjectFromProgrammeSlug,
} from '@/lib/jeux/programme'
import { toModeQuestions, type QuickQuestionRow } from '@/lib/defi/quick-pool'
import { getChapterMastery } from '@/lib/mastery-server'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { drawSubjectSession } from '@/lib/questions/server-draw'
import { subjectTotal, type GameTrophyRow } from '@/lib/trophy-road'
import { normalizeAvatarConfig } from '@/lib/avatar'
import { toDayKey } from '@/lib/streak'
import { COURSE_QUESTION_BUFFER } from '@/lib/duel/course'
import { botOpponent, type Opponent } from '@/lib/duel/opponent'
import { chooseOpponent, fetchReplayCandidates } from '@/lib/duel/opponent-server'
import type { ModeQuestion } from '@/lib/defi-modes'

export const metadata = { title: 'Duel classé — Studuel' }
export const dynamic = 'force-dynamic'

function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Route /defi/programme/[matiere] — LE DUEL CLASSÉ d'une matière, devenu une
 * COURSE (components/duel). C'est ce que lance le bouton DUEL de l'arène.
 *
 * La page décide trois choses, et rien d'autre :
 *   1. LES QUESTIONS — celles du programme de la classe, servies par le moteur
 *      de sélection (60 % d'échues, 30 % d'inédites, fenêtre anti-répétition),
 *      avec le classement par faiblesse de chapitre en repli tant que la 239
 *      n'est pas passée. Une course consomme jusqu'à trente questions.
 *   2. L'ADVERSAIRE — un vrai élève du même niveau, à portée de trophées, dont
 *      on rejoue la course (migration 351) ; sinon un robot du banc, marqué
 *      comme tel. `?vs=` demande la revanche contre le même, `?sans=` écarte le
 *      robot d'avant.
 *   3. LA GRAINE — elle change à chaque `?n=`, donc la question dorée, l'ordre
 *      et le rival aussi. Deux courses ne se ressemblent jamais.
 *
 * Sous `MIN_PROGRAMME_QUESTIONS`, on renvoie à l'arène : un trophée gagné sur
 * une banque trop courte ne mesure plus rien.
 */
export default async function ProgrammePage({
  params,
  searchParams,
}: {
  params: Promise<{ matiere: string }>
  searchParams: Promise<{ n?: string; vs?: string; sans?: string }>
}) {
  const [{ matiere }, { n, vs, sans }] = await Promise.all([params, searchParams])
  const subject = subjectFromProgrammeSlug(matiere)
  if (!subject) redirect('/defi')

  const user = await getCurrentUser()
  if (!user) redirect('/defi')

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('grade_level, full_name, avatar')
    .eq('id', user.id)
    .maybeSingle()

  const grade = profile?.grade_level ?? null
  if (!grade) redirect('/onboarding')

  const wanted = programmeSlug(subject)
  const round = Number.isFinite(Number(n)) ? Math.max(0, Math.floor(Number(n))) : 0
  const today = toDayKey(new Date())
  // La graine : un élève, une matière, un jour, un tour. Le tour change à
  // chaque « Revanche » ou « Nouvel adversaire » (?n=), donc la course entière.
  const seed = `${user.id}#${wanted}#${today}#${round}`

  // Les trois lectures qui ne dépendent pas les unes des autres partent
  // ensemble : les quiz de la classe, mes trophées sur la matière, la session
  // du moteur de questions.
  const [{ data: allQuizzes }, { data: mesTrophees }, drawn] = await Promise.all([
    supabase.from('quizzes').select('id, subject, lesson_id').eq('grade_level', contentLevelFor(grade)),
    supabase.from('game_trophies').select('subject_slug, game_id, trophies').eq('user_id', user.id),
    drawSubjectSession({
      supabase,
      userId: user.id,
      subjectSlug: wanted,
      level: grade,
      count: COURSE_QUESTION_BUFFER,
    }),
  ])

  const quizzes = (allQuizzes ?? []).filter(
    (q) => programmeSlug(String(q.subject ?? '')) === wanted,
  )
  if (quizzes.length === 0) redirect('/defi')

  const rows: GameTrophyRow[] = (Array.isArray(mesTrophees) ? mesTrophees : []).flatMap((row) => {
    const value = Number(row?.trophies)
    if (!row?.subject_slug || !row?.game_id || !Number.isFinite(value)) return []
    return [{ subject: String(row.subject_slug), gameId: String(row.game_id), trophies: value }]
  })
  const myTrophies = subjectTotal(rows, wanted)

  // ------------------------------------------------------------ LES QUESTIONS
  let pool: ModeQuestion[] = []
  if (drawn.length >= MIN_PROGRAMME_QUESTIONS) {
    const { data: engineRows } = await supabase
      .from('quiz_questions')
      .select('id, quiz_id, question, kind, options, correct_index, explanation')
      .in('id', drawn.map((ref) => ref.questionId))
      .returns<QuickQuestionRow[]>()
    // `.in()` rend les lignes dans un ordre arbitraire : on rejoue l'ordre du
    // moteur, sinon le mélange qui empêche de lire les buckets serait perdu.
    const parId = new Map((engineRows ?? []).map((row) => [row.id, row]))
    pool = toModeQuestions(
      drawn.flatMap((ref) => {
        const row = parId.get(ref.questionId)
        return row ? [row] : []
      }),
      () => subject,
    )
  }

  // LE REPLI, tant que la 239 n'est pas passée : classement par faiblesse de
  // chapitre. La course reste jouable, elle perd la mémoire anti-répétition.
  if (pool.length < MIN_PROGRAMME_QUESTIONS) {
    const lessonIds = quizzes.map((q) => q.lesson_id).filter((id): id is string => !!id)
    const [mastery, { data: lessons }] = await Promise.all([
      getChapterMastery(supabase, user.id),
      lessonIds.length > 0
        ? supabase.from('lessons').select('id, chapter_id').in('id', lessonIds)
        : Promise.resolve({ data: null }),
    ])
    const chapterByLesson = new Map<string, string>()
    for (const lesson of lessons ?? []) {
      chapterByLesson.set(String(lesson.id), String(lesson.chapter_id))
    }
    const ordered = orderQuizzesByWeakness(
      shuffle(quizzes),
      chapterByLesson,
      (chapterId) => mastery.get(chapterId)?.value,
    )
    const picked = ordered.slice(0, Math.max(8, Math.ceil(COURSE_QUESTION_BUFFER / 4)))
    const { data: fallbackRows } = await supabase
      .from('quiz_questions')
      .select('id, quiz_id, question, kind, options, correct_index, explanation')
      .in('quiz_id', picked.map((q) => q.id))
      .returns<QuickQuestionRow[]>()
    const rankOfQuiz = new Map(picked.map((q, index) => [q.id, index]))
    const sortedRows = shuffle(fallbackRows ?? [])
      .map((row, index) => ({
        row,
        index,
        rank: rankOfQuiz.get(row.quiz_id) ?? Number.MAX_SAFE_INTEGER,
      }))
      .sort((a, b) => a.rank - b.rank || a.index - b.index)
      .map((entry) => entry.row)
    pool = toModeQuestions(sortedRows, () => subject).slice(0, COURSE_QUESTION_BUFFER)
  }
  if (pool.length < MIN_PROGRAMME_QUESTIONS) redirect('/defi')

  // ------------------------------------------------------------ L'ADVERSAIRE
  const opponent = await resolveOpponent({
    supabase,
    wanted,
    myTrophies,
    seed,
    myName: profile?.full_name ?? null,
    vs,
    sans,
  })

  const emoji = SALONS.find((s) => s.subject === subject)?.emoji ?? '📘'
  const firstName = (profile?.full_name ?? '').trim().split(' ')[0] || 'Toi'
  const base = `/defi/programme/${wanted}`
  const revancheVs = opponent.kind === 'bot' ? `bot:${opponent.botId}` : `replay:${opponent.replayId}`

  return (
    <DuelCourse
      pool={pool.slice(0, COURSE_QUESTION_BUFFER)}
      subject={subject}
      subjectSlug={wanted}
      subjectEmoji={emoji}
      seed={seed}
      opponent={opponent}
      me={{
        name: firstName,
        avatar: normalizeAvatarConfig(profile?.avatar),
        trophies: myTrophies,
      }}
      hrefs={{
        revanche: `${base}?n=${round + 1}&vs=${encodeURIComponent(revancheVs)}`,
        nouveau:
          opponent.kind === 'bot'
            ? `${base}?n=${round + 1}&sans=${encodeURIComponent(opponent.botId)}`
            : `${base}?n=${round + 1}`,
        arene: '/defi',
      }}
    />
  )
}

// L'adversaire de la course. La REVANCHE (`?vs=`) rend le même rival — le
// robot par son id, le replay par le sien s'il est toujours à portée du
// vivier ; sinon on retombe sur l'appariement normal, qui préfère toujours un
// vrai élève et écarte le robot d'avant (`?sans=`).
async function resolveOpponent(input: {
  supabase: Awaited<ReturnType<typeof createClient>>
  wanted: string
  myTrophies: number
  seed: string
  myName: string | null
  vs?: string
  sans?: string
}): Promise<Opponent> {
  const { supabase, wanted, myTrophies, seed, myName, vs, sans } = input
  if (vs?.startsWith('bot:')) {
    const bot = botOpponent(vs.slice(4), myTrophies)
    if (bot) return bot
  }
  if (vs?.startsWith('replay:')) {
    const id = vs.slice(7)
    const candidates = await fetchReplayCandidates(supabase, wanted)
    const found = candidates.find((c) => c.replayId === id)
    if (found) {
      return {
        kind: 'replay',
        replayId: found.replayId,
        steps: found.steps,
        range: Math.abs(found.trophies - myTrophies) <= 150 ? 150 : null,
        identity: {
          name: found.name,
          avatar: normalizeAvatarConfig(found.avatar),
          trophies: found.trophies,
          isBot: false,
          tagline: 'A vraiment joué cette matière',
        },
      }
    }
  }
  return chooseOpponent({
    supabase,
    subjectSlug: wanted,
    myTrophies,
    seed,
    myName,
    lastBotId: sans ?? null,
  })
}
