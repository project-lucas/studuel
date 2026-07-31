import { notFound, redirect } from 'next/navigation'
import TraqueCombat from '@/components/defi/TraqueCombat'
import { bossById, bossForSubject } from '@/lib/bosses'
import { getSubjectsCached } from '@/lib/catalog'
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
import { HORS_NIVEAU, type QuizQuestion } from '@/lib/types'

export const metadata = { title: 'La Traque — Studuel' }
export const dynamic = 'force-dynamic'

/** Nombre de quiz retenus pour composer le pool — de quoi tenir un combat. */
const POOL_QUIZZES = 10
const POOL_QUESTIONS = 40
/** Chapitres retenus par le repli « matière du gardien ». */
const POOL_CHAPTERS = 12

type DbClient = Awaited<ReturnType<typeof createClient>>

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

type ChapterRow = {
  id: string
  title: string
  subjects: { name: string; slug: string } | null
}

/** Les chapitres visés, avec leur matière. Aucun id → aucune requête. */
function selectChapters(supabase: DbClient, ids: readonly string[]) {
  if (ids.length === 0) {
    return Promise.resolve({ data: [] as ChapterRow[] })
  }
  return supabase
    .from('chapters')
    .select('id, title, subjects!inner(name, slug)')
    .in('id', ids)
    .returns<ChapterRow[]>()
}

/**
 * Repli : les chapitres de la (ou des) matière(s) du gardien, à la classe de
 * l'élève. On retrouve ces matières en passant le catalogue par
 * `bossForSubject` — c'est LA même fonction qui a désigné le gardien au moment
 * du crédit, donc on ne peut pas dériver d'une table de correspondance de plus.
 * `HORS_NIVEAU` est inclus : une matière de culture générale range son contenu
 * au niveau `tous`.
 */
async function bossSubjectChapters(
  supabase: DbClient,
  bossId: string,
  grade: string,
): Promise<string[]> {
  const subjectIds = (await getSubjectsCached())
    .filter((s) => bossForSubject(s.name).id === bossId)
    .map((s) => s.id)
  if (subjectIds.length === 0) return []
  const { data } = await supabase
    .from('chapters')
    .select('id')
    .in('subject_id', subjectIds)
    .in('level', [grade, HORS_NIVEAU])
    .order('position', { ascending: true })
    .limit(POOL_CHAPTERS)
    .returns<{ id: string }[]>()
  return (data ?? []).map((c) => c.id)
}

/**
 * Le pool de questions tiré d'une liste de chapitres ORDONNÉE (le plus récent
 * d'abord) : leçons → quiz → questions, pondérés par le rang du chapitre.
 * Renvoie [] dès qu'un maillon manque — c'est l'appelant qui décide du repli.
 */
async function buildPool(
  supabase: DbClient,
  chapters: readonly string[],
): Promise<ModeQuestion[]> {
  if (chapters.length === 0) return []

  const { data: lessonRows } = await supabase
    .from('lessons')
    .select('id, chapter_id')
    .in('chapter_id', chapters as string[])
    .returns<{ id: string; chapter_id: string }[]>()
  const lessons = lessonRows ?? []
  if (lessons.length === 0) return []

  const rankByChapter = new Map(chapters.map((id, i) => [id, i]))
  const lessonRank = new Map(
    lessons.map((l) => [
      l.id,
      rankByChapter.get(l.chapter_id) ?? Number.MAX_SAFE_INTEGER,
    ]),
  )

  const { data: quizRows } = await supabase
    .from('quizzes')
    .select('id, subject, lesson_id')
    .in('lesson_id', lessons.map((l) => l.id))
    .returns<{ id: string; subject: string | null; lesson_id: string | null }[]>()

  // Pondération « le plus récent d'abord » : le combat porte sur la dernière
  // session de révision avant tout. `sort` est stable, donc à rang égal le
  // mélange ci-dessus est conservé.
  const quizzes = shuffle(quizRows ?? [])
    .sort(
      (a, b) =>
        (lessonRank.get(a.lesson_id ?? '') ?? Number.MAX_SAFE_INTEGER) -
        (lessonRank.get(b.lesson_id ?? '') ?? Number.MAX_SAFE_INTEGER),
    )
    .slice(0, POOL_QUIZZES)
  if (quizzes.length === 0) return []

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
  return shuffle(valid)
    .slice(0, POOL_QUESTIONS)
    .map((q) => {
      const shuffled = permuteQuizOptions(q.kind, q.options, q.correct_index, q.id)
      return {
        id: q.id,
        prompt: q.question,
        options: shuffled.options,
        correctIndex: shuffled.correctIndex,
        explanation: q.explanation,
        subject: subjectByQuiz.get(q.quiz_id) ?? null,
      }
    })
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

  const { data: profile } = await supabase
    .from('profiles')
    .select('grade_level')
    .eq('id', user.id)
    .maybeSingle<{ grade_level: string | null }>()
  const grade = profile?.grade_level ?? null
  if (!grade) redirect('/onboarding')

  // --- Le vivier : les chapitres qui ont NOURRI la jauge, les plus récents
  // d'abord. À défaut, ceux de la matière du gardien à la classe de l'élève.
  //
  // Le repli n'est pas décoratif : une jauge peut se remplir SANS chapitre
  // (la file « À revoir » crédite par matière, ses items ne portent pas de
  // chapitre), et un chapitre nourri peut n'avoir aucun quiz. Sans repli,
  // l'élève débusquait un gardien puis trouvait un « GO » grisé : l'heure
  // promise brûlait, la jauge retombait à 50, et la boucle entière —
  // réviser → débusquer → combattre → gemmes — se refermait sur rien.
  let chapters = poolChapters(gauge.chapters)
  let pool = await buildPool(supabase, chapters)
  if (pool.length === 0) {
    const repli = await bossSubjectChapters(supabase, boss.id, grade)
    if (repli.length > 0) {
      chapters = repli
      pool = await buildPool(supabase, chapters)
    }
  }

  const { data: chapterRows } = await selectChapters(supabase, chapters)
  const chapterById = new Map((chapterRows ?? []).map((c) => [c.id, c]))
  // Le plus récemment travaillé est en tête de `chapters` : c'est LUI que
  // l'écran de victoire proposera d'ouvrir.
  const freshest = chapters.map((id) => chapterById.get(id)).find(Boolean) ?? null
  const subject = freshest?.subjects?.name ?? boss.epithet
  for (const q of pool) q.subject = q.subject ?? subject

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
