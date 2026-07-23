import { notFound, redirect } from 'next/navigation'
import SubjectTemplate from '@/components/reviser/SubjectTemplate'
import SubjectMasteryCelebration from '@/components/SubjectMasteryCelebration'
import { createClient } from '@/lib/supabase/server'
import {
  getSubjectsCached,
  getProgrammeCached,
  type CatalogChapter,
} from '@/lib/catalog'
import { getUserTierFor } from '@/lib/subscription'
import { canOpenChapter } from '@/lib/gems'
import { fetchGems, fetchUnlockedChapters } from '@/lib/gems-access'
import { XP_AWARDS } from '@/lib/wallet'
import {
  carteMeta,
  chapterValue,
  chapterStatus,
  crowns,
  defiMeta,
  defiTitle,
  flashcardsMeta,
  isNewToSubject,
  quizMeta,
  subjectProgress,
  COMPLETE_THRESHOLD,
  MODES,
  type ModeKey,
  type ChapterExamHint,
  type ChapterRow,
  type ModeGroup,
  type SubjectTemplateData,
} from '@/lib/subject-template'
import { getReviewItems } from '@/lib/srs'
import { permuteQuizOptions } from '@/lib/quiz-shuffle'
import type { ModeQuestion } from '@/lib/defi-modes'
import {
  normalizeExamList,
  activeExams,
  examCardLabel,
  examProximity,
} from '@/lib/next-exam'
import { activityCutoff, computeStreak, toDayKey } from '@/lib/streak'
import {
  CHAPTER_COLUMNS,
  LESSON_COLUMNS,
  type QuizQuestion,
  type Subject,
} from '@/lib/types'

export const dynamic = 'force-dynamic'

// Mélange (Fisher-Yates) — pour varier le pool du boss d'une visite à l'autre.
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
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Profil (classe), catalogue des matières et contrôles annoncés en
  // parallèle — le catalogue sort du cache serveur, pas de Supabase.
  // upcoming_exams (087) reste isolé du profil : si la migration manque,
  // seule l'annotation des contrôles saute, pas la page.
  const [{ data: profile }, cachedSubjects, { data: examsRow }] =
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
  for (const exam of activeExams(
    normalizeExamList(examsRow?.upcoming_exams),
    today,
  )) {
    if (exam.subject !== subject.slug) continue
    examsByChapter[exam.chapterId] = {
      label: examCardLabel(exam, today),
      proximity: examProximity(exam, today),
    }
  }

  // Vue « Chapitres » : une seule entrée par chapitre, avec couronnes et état.
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
  const chapters: ChapterRow[] = catalog.map((chapter, i) => ({
    id: chapter.id,
    position: chapter.position,
    title: chapter.title,
    status: chapterStatus(values[i]),
    crowns: crowns(values[i]),
    href: `/reviser/${subject.slug}/${chapter.id}`,
    examHint: examsByChapter[chapter.id] ?? null,
  }))

  // Vues par mode : le contenu du mode groupé par chapitre. Quiz, flashcards
  // et défis dérivent du quiz de chaque leçon ; la carte mentale est portée
  // par le chapitre (colonne générée has_mind_map).
  const groupsFor = (
    itemsOf: (chapter: CatalogChapter) => ModeGroup['items'],
  ): ModeGroup[] =>
    catalog
      .map((chapter) => ({
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        position: chapter.position,
        items: itemsOf(chapter),
      }))
      .filter((g) => g.items.length > 0)

  const modes: SubjectTemplateData['modes'] = {
    quiz: groupsFor((chapter) =>
      chapter.lessons.flatMap((l) => {
        const quizId = l.quizzes[0]?.id
        if (!quizId) return []
        const best = bestByQuiz.get(quizId) ?? null
        return [
          {
            id: quizId,
            title: l.title,
            href: `/test/${quizId}`,
            meta: quizMeta(best),
            done: (best?.ratio ?? 0) >= COMPLETE_THRESHOLD,
            xp: XP_AWARDS.quiz,
          },
        ]
      }),
    ),
    flashcards: groupsFor((chapter) =>
      chapter.lessons.flatMap((l) => {
        const quizId = l.quizzes[0]?.id
        const count = quizId ? (questionCountByQuiz.get(quizId) ?? 0) : 0
        if (!quizId || count === 0) return []
        return [
          {
            id: l.id,
            title: l.title,
            href: `/reviser/${subject.slug}/${chapter.id}/${l.id}/flashcards`,
            meta: flashcardsMeta(count, dueByQuiz.get(quizId) ?? 0),
            done: false,
            xp: XP_AWARDS.flashcards,
          },
        ]
      }),
    ),
    cartes: groupsFor((chapter) => {
      if (!chapter.has_mind_map) return []
      const locked = !canOpenChapter(tier, chapter.id, unlockedChapters)
      return [
        {
          id: chapter.id,
          title: 'Carte mentale',
          href: `/reviser/${subject.slug}/${chapter.id}/carte`,
          meta: carteMeta(locked),
          done: false,
          locked,
        },
      ]
    }),
    defis: groupsFor((chapter) =>
      chapter.lessons.flatMap((l) => {
        const quizId = l.quizzes[0]?.id
        const count = quizId ? (questionCountByQuiz.get(quizId) ?? 0) : 0
        if (!quizId || count === 0) return []
        const attempted = defiAttempted.has(l.id)
        return [
          {
            id: l.id,
            title: defiTitle(count),
            href: `/reviser/${subject.slug}/${chapter.id}/${l.id}/defi`,
            meta: defiMeta(attempted),
            done: attempted,
            xp: XP_AWARDS.defi,
          },
        ]
      }),
    ),
  }

  const progress = subjectProgress(values)

  // Onglet « Mes erreurs » : la file SRS de la matière ventilée par chapitre.
  // Le total reste weakCount (même règle que le bandeau « À revoir ») — les
  // items rattachés à la matière sans quiz du programme n'ont pas de chapitre.
  const erreursByChapter = catalog
    .map((chapter) => ({
      title: chapter.title,
      count: chapter.lessons.reduce((sum, l) => {
        const quizId = l.quizzes[0]?.id
        return sum + (quizId ? (dueByQuiz.get(quizId) ?? 0) : 0)
      }, 0),
    }))
    .filter((c) => c.count > 0)

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

  const data: SubjectTemplateData = {
    subject: { slug: subject.slug, name: subject.name, color: subject.color },
    grade,
    progress,
    isNew: isNewToSubject(values),
    weakCount,
    gems,
    streak,
    chapters,
    modes,
    erreurs: { total: weakCount, byChapter: erreursByChapter },
    bossPool,
  }

  // Onglet demandé dans l'URL (`?onglet=boss` depuis la feuille Modes de jeu) —
  // toute valeur inconnue retombe sur Chapitres.
  const initialMode = MODES.some((m) => m.key === onglet)
    ? (onglet as ModeKey)
    : undefined

  return (
    <>
      <SubjectMasteryCelebration
        entries={[{ slug: subject.slug, name: subject.name, pct: progress.pct }]}
      />
      <SubjectTemplate data={data} initialMode={initialMode} />
    </>
  )
}
