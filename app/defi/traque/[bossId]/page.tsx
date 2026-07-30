import { notFound, redirect } from 'next/navigation'
import TraqueCombat from '@/components/defi/TraqueCombat'
import { bossById } from '@/lib/bosses'
import { permuteQuizOptions } from '@/lib/quiz-shuffle'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { fetchGauges } from '@/lib/traque-server'
import {
  gaugeStatus,
  poolChapters,
  windowEndMs,
  type TraqueGauge,
} from '@/lib/traque'
import type { ModeQuestion } from '@/lib/defi-modes'
import type { BossRank } from '@/lib/bosses'
import type { QuizQuestion } from '@/lib/types'

export const metadata = { title: 'La Traque — Studuel' }
export const dynamic = 'force-dynamic'

/** Nombre de quiz retenus pour composer le pool — de quoi tenir un combat. */
const POOL_QUIZZES = 10
const POOL_QUESTIONS = 40

/**
 * Le gardien est-il RÉELLEMENT défiable à cet instant ? La question se pose
 * hors du composant : lire l'heure pendant un rendu est une impureté, même
 * côté serveur, et la règle vaut aussi ici.
 */
function isFightable(gauge: TraqueGauge | undefined): gauge is TraqueGauge {
  return gauge !== undefined && gaugeStatus(gauge, Date.now()) === 'debusque'
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Route /defi/traque/[bossId] — LE COMBAT de La Traque.
 *
 * On n'y arrive pas en choisissant un mode : on y arrive parce qu'on a
 * DÉBUSQUÉ le gardien en révisant, et le message éclair de l'arène y mène. La
 * page revérifie donc systématiquement que la jauge est bien pleine et que la
 * fenêtre d'une heure court encore — un lien recopié ou rouvert le lendemain
 * renvoie à l'arène, sans écran d'erreur.
 *
 * Le pool est tiré des CHAPITRES QUI ONT REMPLI LA JAUGE, les plus récemment
 * travaillés d'abord : le boss interroge littéralement ce qui vient d'être
 * révisé. C'est ce qui rend le combat gagnable — donc jouable, donc rejouable.
 */
export default async function TraquePage({
  params,
}: {
  params: Promise<{ bossId: string }>
}) {
  const { bossId } = await params
  const boss = bossById(bossId)
  if (!boss) notFound()

  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const gauges = await fetchGauges(supabase, user.id)
  const gauge = gauges?.get(boss.id)
  // Le gardien n'est pas sorti, ou sa fenêtre s'est refermée : rien à
  // combattre. On repart de l'arène plutôt que d'afficher une impasse.
  if (!isFightable(gauge)) redirect('/defi')

  const rank = Math.min(1 + gauge.victories, 3) as BossRank
  const chapters = poolChapters(gauge.chapters)

  // --- Le vivier : les quiz de la MATIÈRE du gardien, à la classe de l'élève,
  // priorisés par les chapitres qui ont nourri la jauge.
  const { data: profile } = await supabase
    .from('profiles')
    .select('grade_level')
    .eq('id', user.id)
    .maybeSingle<{ grade_level: string | null }>()
  const grade = profile?.grade_level ?? null
  if (!grade) redirect('/onboarding')

  // Les chapitres nourris disent déjà la matière ET le contenu : on part
  // d'eux, et le niveau de l'élève sert de garde-fou.
  const { data: chapterRows } = await supabase
    .from('chapters')
    .select('id, title, subjects!inner(name, slug)')
    .in('id', chapters.length > 0 ? chapters : ['00000000-0000-0000-0000-000000000000'])
    .returns<
      { id: string; title: string; subjects: { name: string; slug: string } | null }[]
    >()

  const chapterById = new Map((chapterRows ?? []).map((c) => [c.id, c]))
  // Le plus récemment travaillé est en tête de `chapters` : c'est LUI que
  // l'écran de victoire proposera d'ouvrir.
  const freshest = chapters.map((id) => chapterById.get(id)).find(Boolean) ?? null
  const subject = freshest?.subjects?.name ?? boss.epithet

  const { data: lessonRows } = await supabase
    .from('lessons')
    .select('id, chapter_id')
    .in('chapter_id', chapters.length > 0 ? chapters : ['x'])
    .returns<{ id: string; chapter_id: string }[]>()

  const rankByChapter = new Map(chapters.map((id, i) => [id, i]))
  const lessonRank = new Map(
    (lessonRows ?? []).map((l) => [
      l.id,
      rankByChapter.get(l.chapter_id) ?? Number.MAX_SAFE_INTEGER,
    ]),
  )

  const { data: quizRows } = await supabase
    .from('quizzes')
    .select('id, subject, lesson_id')
    .in(
      'lesson_id',
      (lessonRows ?? []).length > 0 ? (lessonRows ?? []).map((l) => l.id) : ['x'],
    )
    .returns<{ id: string; subject: string | null; lesson_id: string | null }[]>()

  // Pondération « le plus récent d'abord » : le combat porte sur la dernière
  // session de révision avant tout.
  const quizzes = shuffle(quizRows ?? [])
    .sort(
      (a, b) =>
        (lessonRank.get(a.lesson_id ?? '') ?? Number.MAX_SAFE_INTEGER) -
        (lessonRank.get(b.lesson_id ?? '') ?? Number.MAX_SAFE_INTEGER),
    )
    .slice(0, POOL_QUIZZES)

  const pool: ModeQuestion[] = []
  if (quizzes.length > 0) {
    const subjectByQuiz = new Map(quizzes.map((q) => [q.id, q.subject]))
    const { data: questions } = await supabase
      .from('quiz_questions')
      .select('id, quiz_id, question, kind, options, correct_index, explanation, position')
      .in('quiz_id', quizzes.map((q) => q.id))
      .returns<QuizQuestion[]>()

    const valid = (questions ?? []).filter(
      (q) =>
        Array.isArray(q.options) &&
        q.options.length >= 2 &&
        q.correct_index >= 0 &&
        q.correct_index < q.options.length,
    )
    for (const q of shuffle(valid).slice(0, POOL_QUESTIONS)) {
      const shuffled = permuteQuizOptions(q.kind, q.options, q.correct_index, q.id)
      pool.push({
        id: q.id,
        prompt: q.question,
        options: shuffled.options,
        correctIndex: shuffled.correctIndex,
        explanation: q.explanation,
        subject: subjectByQuiz.get(q.quiz_id) ?? subject,
      })
    }
  }

  const chapterHref =
    freshest && freshest.subjects?.slug
      ? `/reviser/${freshest.subjects.slug}/${freshest.id}`
      : null

  return (
    // La salle de combat : le décor de l'arène passe SOUS un voile de nuit
    // (.traque-salle). Sans lui, le combat s'écrivait à l'encre du monde crème
    // par-dessus l'académie en plein jour — nom du gardien, question et
    // réponses illisibles.
    <div className="traque-salle -mt-16 min-h-dvh px-4 pt-20 pb-24 md:-mt-10 md:pt-10">
      <TraqueCombat
        boss={boss}
        rank={rank}
        subject={subject}
        pool={pool}
        endsAt={windowEndMs(gauge)}
        attempts={gauge.attempts}
        chapter={
          freshest && chapterHref
            ? { title: freshest.title, href: chapterHref }
            : null
        }
      />
    </div>
  )
}
