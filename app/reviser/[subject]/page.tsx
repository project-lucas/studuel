import { notFound, redirect } from 'next/navigation'
import SubjectTemplate from '@/components/reviser/SubjectTemplate'
import SubjectMasteryCelebration from '@/components/SubjectMasteryCelebration'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import {
  getSubjectsCached,
  getProgrammeCached,
  type CatalogChapter,
} from '@/lib/catalog'
import { getUserTierFor } from '@/lib/subscription'
import { canOpenChapter } from '@/lib/gems'
import { fetchGems, fetchUnlockedChapters } from '@/lib/gems-access'
import {
  chapterValue,
  chapterStatus,
  countWords,
  crowns,
  estimateMinutes,
  examBannerOnTop,
  modeFromParam,
  modesFor,
  resumeCta,
  subjectProgress,
  type ChapterExamHint,
  type ChapterRow,
  type SubjectTemplateData,
  type TrainingRow,
} from '@/lib/subject-template'
import { buildChapterSupports, type SupportLesson } from '@/lib/chapter-supports'
import { mindMapFromLessons } from '@/lib/mind-map-auto'
import { getReviewItems } from '@/lib/srs'
import { parseGradeStandings } from '@/lib/percentile'
import { permuteQuizOptions } from '@/lib/quiz-shuffle'
import type { ModeQuestion } from '@/lib/defi-modes'
import {
  normalizeExamList,
  activeExams,
  examCardLabel,
  examProximity,
} from '@/lib/next-exam'
import { controlesToExams, mergeExamSources } from '@/lib/controle-exams'
import { daysBetween, rowsToControles, type ControleRow } from '@/lib/prep-plan'
import { activityCutoff, computeStreak, toDayKey } from '@/lib/streak'
import {
  CHAPTER_COLUMNS,
  LESSON_COLUMNS,
  type QuizQuestion,
  type Subject,
} from '@/lib/types'

export const dynamic = 'force-dynamic'

// Mélange (Fisher-Yates) — pour varier le pool du boss d'une visite à l'autre.
// Quiz de secours d'un chapitre : celui de la PREMIÈRE leçon qui en a un.
// Même règle (et même déterminisme) que `pickLessonQuiz` côté page de leçon —
// ici on n'a que l'id à afficher dans la tuile.
function quizDuChapitre(chapter: CatalogChapter): string | undefined {
  return chapter.lessons.find((l) => l.quizzes[0]?.id)?.quizzes[0]?.id
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Le boss de la matière pioche large mais borné : assez de variété pour un
// combat (10-18 PV), sans embarquer tout le programme dans la page.
const BOSS_POOL_SIZE = 60

// Page matière = template GÉNÉRIQUE unique : tout vient de Supabase (matière,
// chapitres, contenus par mode, progression, notions à revoir). Ajouter une
// matière = ajouter des lignes en base, zéro code ici.
export default async function SubjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ subject: string }>
  searchParams: Promise<{ onglet?: string }>
}) {
  const { subject: slug } = await params
  const { onglet } = await searchParams
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  // Profil (classe), catalogue des matières et contrôles annoncés en
  // parallèle — le catalogue sort du cache serveur, pas de Supabase.
  // Les DEUX sources de contrôles sont lues, chacune dans un select ISOLÉ : si
  // une migration manque (087 ou 203), seule l'annotation de cette source saute,
  // pas la page. `controles` (203) est la source courante, `upcoming_exams`
  // (087) l'ancienne, encore utile tant que la reprise 211 n'est pas passée.
  const [{ data: profile }, cachedSubjects, { data: examsRow }, { data: controleRows }] =
    await Promise.all([
      supabase
        .from('profiles')
        .select('grade_level')
        .eq('id', user.id)
        .maybeSingle<{ grade_level: string | null }>(),
      getSubjectsCached(),
      supabase
        .from('profiles')
        .select('upcoming_exams')
        .eq('id', user.id)
        .maybeSingle<{ upcoming_exams: unknown }>(),
      supabase
        .from('controles')
        .select('id, subject_slug, chapters, exam_date, grade, note, note_prompted, snooze_date')
        .eq('user_id', user.id)
        .returns<ControleRow[]>(),
    ])

  let subject = cachedSubjects.find((s) => s.slug === slug) ?? null
  if (!subject) {
    // Repli authentifié : cache froid ou migration 026 pas encore exécutée.
    const { data } = await supabase
      .from('subjects')
      .select('*')
      .eq('slug', slug)
      .maybeSingle<Subject>()
    subject = data
  }
  if (!subject) notFound()
  const grade = profile?.grade_level
  if (!grade) redirect('/onboarding')

  // Niveau de lecture des chapitres : la classe de l'élève, SAUF pour une
  // matière hors-niveau (ex. Culture générale) dont les thèmes vivent à un
  // niveau fixe (subject.fixed_level = « tous »).
  const level = subject.fixed_level ?? grade

  // Programme de la matière (chapitres → leçons → quiz), servi par le cache
  // serveur, avec le même repli authentifié.
  let catalog = await getProgrammeCached(subject.id, level)
  if (catalog.length === 0) {
    const { data } = await supabase
      .from('chapters')
      .select(`${CHAPTER_COLUMNS}, lessons(${LESSON_COLUMNS}, quizzes(id))`)
      .eq('subject_id', subject.id)
      .eq('level', level)
      .order('position', { ascending: true })
      .order('position', { ascending: true, referencedTable: 'lessons' })
      .returns<CatalogChapter[]>()
    catalog = data ?? []
  }

  const quizIds = catalog.flatMap((c) =>
    c.lessons.flatMap((l) => l.quizzes.map((q) => q.id)),
  )

  // Données personnelles + questions des quiz + file SRS, en un seul tour :
  // - lesson_completions → plancher d'avancement des chapitres ;
  // - test_sessions → meilleur score par quiz (« 7/10 ») ;
  // - quiz_questions (colonnes complètes) → compte de cartes/questions par
  //   quiz, rattachement des items SRS de la matière ET pool de l'onglet Boss ;
  // - review_items (file du jour) → bloc « À revoir » et « X à revoir ».
  // Tier + chapitres débloqués à la gemme : pour l'état « Débloquer » des
  // cartes mentales dans l'onglet Cartes.
  // Gemmes + série 🔥 : pour l'économie affichée en haut à droite du header —
  // la série est la MÊME série dérivée que la flamme de l'accueil Réviser
  // (mêmes quatre tables d'activité, même fenêtre), une seule vérité.
  // xp_events (défis relevés) : clés « leçon:jour » posées par recordLessonDefi
  // — tolère une base sans la migration 192 (repli : rien de relevé).
  const cutoff = activityCutoff()
  const [
    { data: completions },
    { data: sessions },
    { data: questions },
    reviewItems,
    tier,
    unlockedChapters,
    gems,
    { data: testDays },
    { data: studyDays },
    { data: challengeDays },
    { data: defiEvents },
    { data: standingsRow },
    { data: themeRows },
  ] =
    await Promise.all([
      supabase
        .from('lesson_completions')
        .select('lesson_id, created_at')
        .eq('user_id', user.id)
        .returns<{ lesson_id: string; created_at: string }[]>(),
      quizIds.length
        ? supabase
            .from('test_sessions')
            .select('quiz_id, score, total')
            .eq('user_id', user.id)
            .in('quiz_id', quizIds)
            .returns<{ quiz_id: string | null; score: number; total: number }[]>()
        : Promise.resolve({
            data: [] as { quiz_id: string | null; score: number; total: number }[],
          }),
      quizIds.length
        ? supabase
            .from('quiz_questions')
            .select(
              'id, quiz_id, question, kind, options, correct_index, explanation, position',
            )
            .in('quiz_id', quizIds)
            .returns<QuizQuestion[]>()
        : Promise.resolve({ data: [] as QuizQuestion[] }),
      getReviewItems(supabase, user.id),
      getUserTierFor(supabase, user.id),
      fetchUnlockedChapters(supabase, user.id),
      fetchGems(supabase, user.id),
      supabase
        .from('test_sessions')
        .select('created_at')
        .eq('user_id', user.id)
        .gte('created_at', cutoff)
        .returns<{ created_at: string }[]>(),
      supabase
        .from('study_sessions')
        .select('created_at')
        .eq('user_id', user.id)
        .gte('created_at', cutoff)
        .returns<{ created_at: string }[]>(),
      supabase
        .from('challenge_sessions')
        .select('created_at')
        .eq('user_id', user.id)
        .gte('created_at', cutoff)
        .returns<{ created_at: string }[]>(),
      supabase
        .from('xp_events')
        .select('source_key')
        .eq('user_id', user.id)
        .eq('source', 'defi')
        .returns<{ source_key: string | null }[]>(),
      // Classements par niveau (223) : on ne garde ici que la matière ouverte.
      // RPC SECURITY DEFINER — la RLS de `profiles` interdit toute jointure.
      supabase.rpc('my_grade_standings'),
      // Axes du programme (migration 234), dans un select ISOLÉ et toléré :
      // tant que la migration n'est pas exécutée, PostgREST répond « column
      // chapters.theme does not exist », `data` arrive à null et la liste reste
      // à plat. La colonne n'est donc PAS dans CHAPTER_COLUMNS, où son absence
      // casserait tout Réviser d'un coup.
      supabase
        .from('chapters')
        .select('id, theme')
        .eq('subject_id', subject.id)
        .eq('level', level)
        .returns<{ id: string; theme: string | null }[]>(),
    ])

  // Série 🔥 du header : jours (clés UTC) avec au moins une session, toutes
  // activités confondues — même calcul que la flamme de l'accueil Réviser.
  const activityDays = new Set(
    [
      ...(testDays ?? []),
      ...(studyDays ?? []),
      ...(challengeDays ?? []),
      ...(completions ?? []),
    ].map((r) => String(r.created_at).slice(0, 10)),
  )
  const streak = computeStreak(activityDays)

  // Leçons dont le défi a déjà été relevé (clé « leçon:jour »).
  const defiAttempted = new Set(
    (defiEvents ?? []).flatMap((e) =>
      e.source_key ? [e.source_key.split(':')[0]] : [],
    ),
  )

  // Meilleur essai par quiz (ratio ET score/total, pour le libellé « 7/10 »).
  const bestByQuiz = new Map<string, { score: number; total: number; ratio: number }>()
  for (const s of sessions ?? []) {
    if (!s.quiz_id || s.total <= 0) continue
    const ratio = Math.min(s.score / s.total, 1)
    const prev = bestByQuiz.get(s.quiz_id)
    if (!prev || ratio > prev.ratio)
      bestByQuiz.set(s.quiz_id, { score: s.score, total: s.total, ratio })
  }
  const completed = new Set((completions ?? []).map((c) => c.lesson_id))

  // Questions par quiz : compte (cartes/questions) + rattachement SRS.
  const questionCountByQuiz = new Map<string, number>()
  const quizByQuestion = new Map<string, string>()
  for (const q of questions ?? []) {
    questionCountByQuiz.set(q.quiz_id, (questionCountByQuiz.get(q.quiz_id) ?? 0) + 1)
    quizByQuestion.set(q.id, q.quiz_id)
  }

  // Notions faibles de CETTE matière dans la file SRS du jour : items marqués
  // de la matière par les players, plus les questions rattachées à ses quiz
  // (chaque item compté une seule fois).
  const dueByQuiz = new Map<string, number>()
  let weakCount = 0
  for (const item of reviewItems) {
    const quizId =
      item.item_kind === 'question' ? quizByQuestion.get(item.item_id) : undefined
    if (quizId) dueByQuiz.set(quizId, (dueByQuiz.get(quizId) ?? 0) + 1)
    if (quizId || item.subject === subject.slug) weakCount += 1
  }

  // Contrôles annoncés pour CETTE matière, encore actifs — un contrôle se
  // retire tout seul dès le lendemain de sa date (activeExams).
  const today = toDayKey(new Date())
  const examsByChapter: Record<string, ChapterExamHint> = {}
  // Échéance du contrôle le plus proche : elle décide si l'examen blanc mérite
  // la tête de page (cf. examBannerOnTop).
  let daysToExam: number | null = null
  for (const exam of activeExams(
    mergeExamSources(
      controlesToExams(rowsToControles(controleRows ?? [], [])),
      normalizeExamList(examsRow?.upcoming_exams),
    ),
    today,
  )) {
    if (exam.subject !== subject.slug) continue
    examsByChapter[exam.chapterId] = {
      label: examCardLabel(exam, today),
      proximity: examProximity(exam, today),
    }
    if (exam.date) {
      const days = Math.max(0, daysBetween(today, exam.date))
      daysToExam = daysToExam === null ? days : Math.min(daysToExam, days)
    }
  }

  // Vue « Programme » : une seule entrée par chapitre, avec couronnes et état.
  const values = catalog.map((chapter) =>
    chapterValue({
      bestQuizRatio: chapter.lessons.reduce<number | null>((best, l) => {
        const quizId = l.quizzes[0]?.id
        const ratio = quizId ? (bestByQuiz.get(quizId)?.ratio ?? null) : null
        if (ratio === null) return best
        return best === null ? ratio : Math.max(best, ratio)
      }, null),
      lessonDone: chapter.lessons.some((l) => completed.has(l.id)),
    }),
  )
  // Axe du programme, quand la base le porte (migration 234).
  const themeById = new Map(
    (themeRows ?? []).map((r) => [r.id, r.theme?.trim() || null]),
  )

  const chapters: ChapterRow[] = catalog.map((chapter, i) => ({
    id: chapter.id,
    position: chapter.position,
    title: chapter.title,
    status: chapterStatus(values[i]),
    crowns: crowns(values[i]),
    href: `/reviser/${subject.slug}/${chapter.id}`,
    examHint: examsByChapter[chapter.id] ?? null,
    // « ~6 min » : lecture des cours du chapitre + ses questions.
    minutes: estimateMinutes({
      words: chapter.lessons.reduce((sum, l) => sum + countWords(l.content), 0),
      questions: chapter.lessons.reduce(
        (sum, l) =>
          sum +
          (l.quizzes[0]?.id
            ? (questionCountByQuiz.get(l.quizzes[0].id) ?? 0)
            : 0),
        0,
      ),
    }),
    theme: themeById.get(chapter.id) ?? null,
  }))

  // Onglet « Mode de jeu » : un chapitre par ligne, ses cinq formats en
  // pastilles. Les quiz/flashcards/défis dérivent du quiz de chaque leçon (avec
  // le repli sur le quiz du chapitre : 564 leçons pour 295 quiz, cf.
  // lib/lesson-quiz) ; la carte mentale est portée par le chapitre. Le CHOIX du
  // support à proposer vit dans lib/chapter-supports, partagé avec le pied de
  // cours pour que les deux écrans ne racontent jamais deux histoires.
  const training: TrainingRow[] = catalog
    .map((chapter) => {
      const lessons: SupportLesson[] = chapter.lessons.map((l) => {
        const ownQuizId = l.quizzes[0]?.id ?? null
        const quizId = ownQuizId ?? quizDuChapitre(chapter) ?? null
        return {
          id: l.id,
          title: l.title,
          quizId,
          questionCount: quizId ? (questionCountByQuiz.get(quizId) ?? 0) : 0,
          dueCount: quizId ? (dueByQuiz.get(quizId) ?? 0) : 0,
          best: ownQuizId ? (bestByQuiz.get(ownQuizId) ?? null) : null,
          defiAttempted: defiAttempted.has(l.id),
          ownQuiz: ownQuizId !== null,
        }
      })
      // La carte s'affiche aussi quand elle est DÉRIVABLE du cours (cf.
      // lib/mind-map-auto) : sans cela, presque aucun chapitre n'en avait.
      const carteAvailable =
        Boolean(chapter.has_mind_map) ||
        mindMapFromLessons(chapter.title, chapter.lessons) !== null
      return {
        chapterId: chapter.id,
        position: chapter.position,
        title: chapter.title,
        chips: buildChapterSupports({
          subjectSlug: subject.slug,
          chapterId: chapter.id,
          lessons,
          carte: {
            available: carteAvailable,
            locked: !canOpenChapter(tier, chapter.id, unlockedChapters),
          },
          // Notions de CE chapitre dans la file du jour — la tuile « Mes
          // erreurs » n'apparaît que s'il y en a. Même rattachement que
          // `weakCount` : un item compte pour le quiz auquel il appartient.
          erreurs: chapter.lessons.reduce((sum, l) => {
            const quizId = l.quizzes[0]?.id
            return sum + (quizId ? (dueByQuiz.get(quizId) ?? 0) : 0)
          }, 0),
        }),
      }
    })
    .filter((row) => row.chips.length > 0)

  const progress = subjectProgress(values)

  // Onglet « Boss » : pool 100 % matière — le boss de la matière est le même
  // pour toutes les classes, seul le programme joué change.
  const validQuestions = (questions ?? []).filter(
    (q) =>
      Array.isArray(q.options) &&
      q.options.length >= 2 &&
      q.correct_index >= 0 &&
      q.correct_index < q.options.length,
  )
  const bossPool: ModeQuestion[] = shuffle(validQuestions)
    .slice(0, BOSS_POOL_SIZE)
    .map((q) => {
      const shuffled = permuteQuizOptions(q.kind, q.options, q.correct_index, q.id)
      return {
        id: q.id,
        prompt: q.question,
        options: shuffled.options,
        correctIndex: shuffled.correctIndex,
        explanation: q.explanation,
        // Convention de l'Arène : le nom affichable (« Anglais »), comme
        // quizzes.subject — bossForSubject normalise dans tous les cas.
        subject: subject.name,
      }
    })

  // Place de l'élève dans CETTE matière, parmi son niveau (223). L'appariement
  // se fait sur le nom affichable de la matière : c'est ce que porte
  // `quizzes.subject`, donc ce sur quoi la RPC agrège.
  const standings = parseGradeStandings(standingsRow)
  const subjectStanding =
    standings.maitrise.find((m) => m.subject === subject.name)?.standing ?? null

  const data: SubjectTemplateData = {
    subject: { slug: subject.slug, name: subject.name, color: subject.color },
    grade,
    gradeLevel: standings.grade,
    standing: subjectStanding,
    progress,
    resume: resumeCta(chapters),
    examOnTop: examBannerOnTop(progress.pct, daysToExam),
    weakCount,
    gems,
    streak,
    chapters,
    training,
    bossPool,
  }

  // Onglet demandé dans l'URL (`?onglet=boss` depuis la feuille Modes de jeu) —
  // les anciennes clés de format restent valides, toute valeur inconnue
  // retombe sur Programme.
  const initialMode = modeFromParam(onglet, modesFor(standings.grade))

  return (
    <>
      <SubjectMasteryCelebration
        entries={[{ slug: subject.slug, name: subject.name, pct: progress.pct }]}
      />
      <SubjectTemplate data={data} initialMode={initialMode} />
    </>
  )
}
