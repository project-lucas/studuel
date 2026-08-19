import { redirect } from 'next/navigation'
import GameTable from '@/components/jeux/GameTable'
import { SALONS } from '@/lib/jeux/catalog'
import {
  MIN_PROGRAMME_QUESTIONS,
  PROGRAMME_FORMAT,
  PROGRAMME_GAME_ID,
  PROGRAMME_NAME,
  orderQuizzesByWeakness,
  programmeSlug,
  subjectFromProgrammeSlug,
} from '@/lib/jeux/programme'
import { poolSizeFor } from '@/lib/jeux/formats'
import { toModeQuestions, type QuickQuestionRow } from '@/lib/defi/quick-pool'
import { getChapterMastery } from '@/lib/mastery'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { fetchGameGhost } from '@/lib/jeux/ghost-server'
import { drawSubjectSession } from '@/lib/questions/server-draw'
import { getSubjectOpponents } from '@/lib/subject-rank-server'
import {
  calibratedBot,
  pickOpponent,
  type MatchOpponent,
} from '@/lib/defi/matchmaking'
import { subjectTotal, type GameTrophyRow } from '@/lib/trophy-road'

export const metadata = { title: 'Ton programme — Studuel' }
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
 * Route /defi/programme/[matiere] — le jeu « Ton programme » d'une matière.
 *
 * C'est le seul jeu de la Route des trophées dont la banque vient de la BASE et
 * non d'un builder local : il sert les `quiz_questions` de la classe de l'élève,
 * chapitres les moins maîtrisés en tête. Il se joue avec la même table que les
 * jeux de salon (`GameTable`) — seul le pool change de provenance.
 *
 * Sous `MIN_PROGRAMME_QUESTIONS`, on renvoie à l'arène plutôt que d'ouvrir une
 * partie qui reboucle sur six questions : un trophée gagné sur une banque trop
 * courte ne mesure plus rien.
 */
export default async function ProgrammePage({
  params,
}: {
  params: Promise<{ matiere: string }>
}) {
  const { matiere } = await params
  const subject = subjectFromProgrammeSlug(matiere)
  if (!subject) redirect('/defi')

  const user = await getCurrentUser()
  if (!user) redirect('/defi')

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('grade_level')
    .eq('id', user.id)
    .maybeSingle()

  const grade = profile?.grade_level ?? null
  if (!grade) redirect('/onboarding')

  // Les quiz de la classe. Pas de HORS_NIVEAU ici, contrairement aux modes de
  // l'Arène : ce jeu porte LE PROGRAMME, la culture générale n'y a pas sa place.
  const { data: allQuizzes } = await supabase
    .from('quizzes')
    .select('id, subject, lesson_id')
    .eq('grade_level', grade)

  // Le nom de matière des quiz n'est pas garanti identique à celui du catalogue
  // de salons — on rapproche par SLUG, comme `salonSubjectFor` le fait dans
  // l'autre sens (lib/defi/modes-catalog.ts).
  const wanted = programmeSlug(subject)
  const quizzes = (allQuizzes ?? []).filter(
    (q) => programmeSlug(String(q.subject ?? '')) === wanted,
  )
  if (quizzes.length === 0) redirect('/defi')

  const size = poolSizeFor(PROGRAMME_FORMAT)

  // ------------------------------------------------------------ LE MOTEUR
  // Chemin normal depuis la migration 239 : la session est composée par le
  // moteur de sélection (lib/questions) — 60 % d'échues, 30 % d'inédites, le
  // reste tiré au sort, et la fenêtre glissante qui empêche de reposer ce qui
  // vient d'être vu. Le classement « par faiblesse de chapitre » qu'on servait
  // ici n'avait aucune mémoire : deux parties d'affilée sur le même chapitre
  // faible repiochaient dans les mêmes quiz, mélangés autrement.
  const drawn = await drawSubjectSession({
    supabase,
    userId: user.id,
    subjectSlug: wanted,
    level: grade,
    count: size,
  })

  /**
   * L'ADVERSAIRE DU CLASSÉ. Apparié sur le couple (matière, trophées ±150),
   * fourchette élargie par paliers si personne n'est à portée, et repli sur
   * l'entraîneur calibré en tout dernier recours (cf. lib/defi/matchmaking).
   *
   * Le fantôme d'AMI garde la priorité quand il existe : jouer contre la ligne
   * de quelqu'un qu'on connaît vaut mieux qu'un inconnu du même niveau, et
   * c'est déjà la doctrine de `game_ghost`. L'appariement large ne sert donc
   * qu'à combler le silence — ce qu'il fait presque tout le temps dans une
   * matière peu jouée.
   */
  async function trouverAdversaire(taille: number) {
    const [amical, viviers, { data: mesTrophees }] = await Promise.all([
      fetchGameGhost(supabase, wanted, PROGRAMME_GAME_ID),
      getSubjectOpponents(supabase, wanted),
      supabase
        .from('game_trophies')
        .select('subject_slug, game_id, trophies')
        .eq('user_id', user!.id),
    ])
    if (amical) return { ghost: amical, opponent: null as MatchOpponent | null }

    const rows: GameTrophyRow[] = (
      Array.isArray(mesTrophees) ? mesTrophees : []
    ).flatMap((row) => {
      const value = Number(row?.trophies)
      if (!row?.subject_slug || !row?.game_id || !Number.isFinite(value)) return []
      return [
        {
          subject: String(row.subject_slug),
          gameId: String(row.game_id),
          trophies: value,
        },
      ]
    })

    const opponent = pickOpponent(
      viviers,
      subjectTotal(rows, wanted),
      calibratedBot(taille),
    )
    return {
      ghost: opponent ? { name: opponent.name, score: opponent.score } : null,
      opponent,
    }
  }

  if (drawn.length >= MIN_PROGRAMME_QUESTIONS) {
    const { data: engineRows } = await supabase
      .from('quiz_questions')
      .select('id, quiz_id, question, kind, options, correct_index, explanation')
      .in(
        'id',
        drawn.map((ref) => ref.questionId),
      )
      .returns<QuickQuestionRow[]>()

    // `.in()` rend les lignes dans un ordre arbitraire : on rejoue l'ordre
    // décidé par le moteur, sinon le mélange final du tirage — celui qui
    // empêche l'élève de lire les buckets — serait perdu à la lecture.
    const parId = new Map((engineRows ?? []).map((row) => [row.id, row]))
    const enOrdre = drawn.flatMap((ref) => {
      const row = parId.get(ref.questionId)
      return row ? [row] : []
    })

    const moteurPool = toModeQuestions(enOrdre, () => subject)
    if (moteurPool.length >= MIN_PROGRAMME_QUESTIONS) {
      const emojiMoteur = SALONS.find((s) => s.subject === subject)?.emoji ?? '📘'
      const { ghost: ghostMoteur } = await trouverAdversaire(size)
      return (
        <GameTable
          format={PROGRAMME_FORMAT}
          pool={moteurPool.slice(0, size)}
          name={PROGRAMME_NAME}
          subject={subject}
          subjectEmoji={emojiMoteur}
          ghost={ghostMoteur}
        />
      )
    }
  }

  // ------------------------------------------------------------- LE REPLI
  // Tant que la 239 n'est pas exécutée (la vue `question_scope` n'existe pas),
  // ou pour un contenu que la vue ne couvre pas (quiz sans leçon rattachée), on
  // retombe sur le classement par faiblesse de chapitre. Le jeu reste jouable :
  // il perd la mémoire anti-répétition, pas sa banque.

  // Maîtrise par chapitre, pour servir les points faibles en premier. Les deux
  // lectures sont indépendantes → en parallèle.
  const lessonIds = quizzes
    .map((q) => q.lesson_id)
    .filter((id): id is string => !!id)
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

  // On mélange AVANT de trier : le tri par faiblesse est stable, donc deux
  // parties d'affilée sur le même chapitre faible ne servent pas les mêmes quiz.
  const ordered = orderQuizzesByWeakness(
    shuffle(quizzes),
    chapterByLesson,
    (chapterId) => mastery.get(chapterId)?.value,
  )

  // Assez de quiz pour couvrir le pool, avec de la marge : un quiz ne porte pas
  // forcément dix questions.
  const picked = ordered.slice(0, Math.max(8, size))
  const { data: rows } = await supabase
    .from('quiz_questions')
    .select('id, quiz_id, question, kind, options, correct_index, explanation')
    .in(
      'quiz_id',
      picked.map((q) => q.id),
    )
    .returns<QuickQuestionRow[]>()

  // `.in()` rend les lignes dans un ordre arbitraire : sans ce report du
  // classement, le tri par faiblesse ne survivrait pas à la lecture et la
  // partie servirait n'importe quel chapitre. On rejoue donc le rang du quiz
  // sur ses questions (mélangées entre elles, pour ne pas figer l'ordre du
  // quiz d'une partie à l'autre).
  const rankOfQuiz = new Map(picked.map((q, index) => [q.id, index]))
  const sortedRows = shuffle(rows ?? [])
    .map((row, index) => ({
      row,
      index,
      rank: rankOfQuiz.get(row.quiz_id) ?? Number.MAX_SAFE_INTEGER,
    }))
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .map((entry) => entry.row)

  const pool = toModeQuestions(sortedRows, () => subject)
  if (pool.length < MIN_PROGRAMME_QUESTIONS) redirect('/defi')

  const emoji = SALONS.find((s) => s.subject === subject)?.emoji ?? '📘'
  const { ghost } = await trouverAdversaire(size)

  return (
    <GameTable
      format={PROGRAMME_FORMAT}
      pool={pool.slice(0, size)}
      name={PROGRAMME_NAME}
      subject={subject}
      subjectEmoji={emoji}
      ghost={ghost}
    />
  )
}
