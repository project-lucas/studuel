import { notFound, redirect } from 'next/navigation'
import SubjectTemplate from '@/components/reviser/SubjectTemplate'
import CarnetDeLaMatiere from '@/components/carnet/CarnetDeLaMatiere'
import SubjectMasteryCelebration from '@/components/SubjectMasteryCelebration'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import {
  getSubjectsCached,
  getProgrammeCached,
  getProgrammeFresh,
  type CatalogChapter,
} from '@/lib/catalog'
import { contentLevelOf } from '@/lib/subject-visibility'
import { fetchGardienCard } from '@/lib/traque-server'
import {
  catalogIsStale,
  chapterValue,
  chapterStatus,
  countWords,
  crowns,
  estimateMinutes,
  examBannerOnTop,
  modeFromParam,
  modesFor,
  resumeCta,
  disciplinesOf,
  subjectProgress,
  type ChapterExamHint,
  type ChapterRow,
  type SubjectProgress,
  type SubjectTemplateData,
} from '@/lib/subject-template'
import { EXAM_PAPER_COLUMNS, parseExamPapers } from '@/lib/exam-papers'
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
import { toDayKey } from '@/lib/streak'
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
// Le nombre de quiz tirés au sort pour nourrir ce pool : une dizaine de quiz
// font 60 à 100 questions, de quoi le remplir sans lire toute la matière.
const BOSS_QUIZ_SAMPLE = 10

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

  // Niveau de LECTURE des chapitres — deux replis, et la règle vit en lib
  // (`contentLevelOf`) plutôt que recopiée ici : une matière hors-niveau
  // (ex. Culture générale) lit ses thèmes à son niveau fixe (« tous »), et la
  // voie technologique lit le contenu de son niveau général, qui n'est pas
  // dupliqué en base.
  const level = contentLevelOf(subject, grade)

  // VAGUE B, LANCÉE AVANT LE PROGRAMME. Tout ce qui ne dépend que de l'élève,
  // de la matière et du niveau part MAINTENANT, pendant que le programme se
  // lit : la page enchaînait cinq allers-retours en file indienne (profil →
  // programme → données personnelles → carnet → questions du carnet), soit
  // ~500 ms de serveur pour ouvrir un dossier. Il en reste trois.
  //
  // - lesson_completions → plancher d'avancement des chapitres ;
  // - review_items (file du jour) → bloc « À revoir » et « X à revoir » ;
  // - my_grade_standings (223) → place de l'élève dans la matière. RPC
  //   SECURITY DEFINER : la RLS de `profiles` interdit toute jointure ;
  // - chapters.theme/discipline (234/247), select ISOLÉ et toléré : tant que
  //   les migrations ne sont pas exécutées, PostgREST répond « column does not
  //   exist », `data` arrive à null et la liste reste à plat. Ces colonnes ne
  //   sont donc PAS dans CHAPTER_COLUMNS, où leur absence casserait tout
  //   Réviser d'un coup ;
  // - exam_papers (236/237), isolé et toléré pour la même raison : sans la
  //   table, l'onglet Annales retombe sur l'épreuve blanche seule. Aucun
  //   filtre sur l'examen : c'est le NIVEAU qui le détermine ;
  // - la jauge du gardien (« La Traque », 212) : sans elle, la page perd son
  //   écusson et rien d'autre ;
  // - les cours du CARNET rattachés à la matière (316), isolés : sans la
  //   colonne, la liste est vide et le dossier est exactement ce qu'il était.
  //
  // ⚠️ NI GEMMES NI SÉRIE : elles étaient lues ici pour deux pastilles du
  // header qui DOUBLONNAIENT le bandeau du haut (`TopHud`, présent sur toutes
  // les pages) — quatre requêtes de moins à chaque ouverture d'une matière.
  const vagueB = Promise.all([
    supabase
      .from('lesson_completions')
      .select('lesson_id, created_at')
      .eq('user_id', user.id)
      .returns<{ lesson_id: string; created_at: string }[]>(),
    getReviewItems(supabase, user.id),
    supabase.rpc('my_grade_standings'),
    supabase
      .from('chapters')
      .select('id, theme, discipline')
      .eq('subject_id', subject.id)
      .eq('level', level)
      .returns<
        { id: string; theme: string | null; discipline: string | null }[]
      >(),
    supabase
      .from('exam_papers')
      .select(EXAM_PAPER_COLUMNS)
      .eq('subject_id', subject.id)
      .eq('level', level),
    fetchGardienCard(supabase, user.id, {
      name: subject.name,
      slug: subject.slug,
    }),
    supabase
      .from('carnet_courses')
      .select('id, title, icon, color, subject_id')
      .eq('owner_id', user.id)
      .eq('subject_id', subject.id)
      .limit(20),
  ])
  // La vague est attendue plus bas ; si la page sort avant (programme vide,
  // erreur), son rejet éventuel ne doit pas devenir un « rejet non géré ».
  vagueB.catch(() => {})

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

  // La vague B est (presque) arrivée pendant la lecture du programme : on la
  // récupère ici, parce que la vague C a besoin des cours du carnet.
  const [
    { data: completions },
    reviewItems,
    { data: standingsRow },
    { data: themeRows },
    { data: paperRows },
    gardien,
    { data: carnetRows },
  ] = await vagueB
  const carnetIds = (carnetRows ?? []).map((c) => String(c.id))

  // LE BOSS NE PIOCHE PLUS DANS TOUT LE PROGRAMME. La page lisait les COLONNES
  // COMPLÈTES (énoncé, options, explication) de TOUTES les questions de la
  // matière — plusieurs centaines de lignes de texte — pour en garder soixante
  // au hasard. C'était la lecture la plus lourde du dossier. On tire d'abord
  // au sort quelques quiz, et seules LEURS questions arrivent en entier ; le
  // compte de questions par quiz et le rattachement SRS, eux, n'ont besoin que
  // des identifiants.
  const bossQuizIds = shuffle(quizIds).slice(0, BOSS_QUIZ_SAMPLE)

  // VAGUE C : ce qui dépend du programme (les quiz) ou du carnet (ses cours).
  // - test_sessions → meilleur score par quiz (« 7/10 ») ;
  // - quiz_questions (id, quiz) → compte de cartes/questions par quiz et
  //   rattachement des items SRS de la matière ;
  // - quiz_questions (colonnes complètes, quiz tirés au sort) → pool du Boss ;
  // - carnet_questions / carnet_question_states → compteurs du carnet.
  const [
    { data: sessions },
    { data: questionRefs },
    { data: bossQuestions },
    { data: carnetQuestions },
    { data: carnetEtats },
  ] = await Promise.all([
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
          .select('id, quiz_id')
          .in('quiz_id', quizIds)
          .returns<{ id: string; quiz_id: string }[]>()
      : Promise.resolve({ data: [] as { id: string; quiz_id: string }[] }),
    bossQuizIds.length
      ? supabase
          .from('quiz_questions')
          .select(
            'id, quiz_id, question, kind, options, correct_index, explanation, position',
          )
          .in('quiz_id', bossQuizIds)
          .returns<QuizQuestion[]>()
      : Promise.resolve({ data: [] as QuizQuestion[] }),
    carnetIds.length > 0
      ? supabase
          .from('carnet_questions')
          .select('id, course_id')
          .in('course_id', carnetIds)
      : Promise.resolve({ data: [] as { id: string; course_id: string }[] }),
    carnetIds.length > 0
      ? supabase
          .from('carnet_question_states')
          .select('question_id, due_at')
          .eq('user_id', user.id)
      : Promise.resolve({ data: [] as { question_id: string; due_at: string }[] }),
  ])

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
  for (const q of questionRefs ?? []) {
    questionCountByQuiz.set(q.quiz_id, (questionCountByQuiz.get(q.quiz_id) ?? 0) + 1)
    quizByQuestion.set(q.id, q.quiz_id)
  }

  // Notions faibles de CETTE matière dans la file SRS du jour : items marqués
  // de la matière par les players, plus les questions rattachées à ses quiz
  // (chaque item compté une seule fois).
  let weakCount = 0
  for (const item of reviewItems) {
    const quizId =
      item.item_kind === 'question' ? quizByQuestion.get(item.item_id) : undefined
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

  // REPLI SI LA 247 N'EST PAS ENCORE JOUÉE. Le select ci-dessus demande `theme`
  // ET `discipline` : une seule colonne absente le fait échouer en entier, et
  // l'app perdrait AUSSI le regroupement par chapitre, qui, lui, fonctionne.
  // On redemande donc le seul axe — une requête de plus, mais uniquement dans
  // le cas dégradé, et jamais une fois la migration exécutée.
  let chapterMeta = themeRows
  if (chapterMeta === null) {
    const { data } = await supabase
      .from('chapters')
      .select('id, theme')
      .eq('subject_id', subject.id)
      .eq('level', level)
      .returns<{ id: string; theme: string | null }[]>()
    chapterMeta = data?.map((r) => ({ ...r, discipline: null })) ?? null
  }

  // LE CATALOGUE PEUT AVOIR CINQ MINUTES DE RETARD. `getProgrammeCached` sert le
  // programme depuis un cache de 300 s : un chapitre SUPPRIMÉ en base y survit
  // jusqu'à l'expiration, et la page continue de l'afficher. C'est ce qui est
  // arrivé à l'anglais de Terminale le 19/08/2026 — les 4 chapitres hors
  // programme effacés par la migration 243 sont revenus en « Autres chapitres »,
  // sans axe puisqu'ils n'existaient plus pour le porter.
  // Le select des axes, lui, est FRAIS et porte sur la même table, la même
  // matière et le même niveau : un chapitre absent de sa réponse n'est plus en
  // base. On s'en sert pour écarter les fantômes — sauf quand ce select a
  // échoué (colonne `theme` pas encore créée : `themeRows` arrive à `null`), où
  // il ne prouve rien et où le cache reste seul juge.
  // Mais un cache périmé ne se contente pas de GARDER des morts : il peut aussi
  // IGNORER des vivants. L'allemand de Terminale l'a montré le 20/08/2026 — la
  // migration 249 a supprimé les 3 fiches d'avant et posé 36 fiches neuves, le
  // cache servait encore les 3 disparues, aucune ne survivait au filtre, et la
  // page annonçait « arrive bientôt » sur un dossier plein. Quand le select
  // frais connaît un chapitre que le cache ignore, filtrer ne suffit donc plus :
  // on relit le programme SANS cache. Une requête de plus, seulement pendant les
  // 300 s qui suivent une migration de contenu.
  if (chapterMeta !== null) {
    if (catalogIsStale(catalog, chapterMeta)) {
      catalog = await getProgrammeFresh(subject.id, level)
    } else {
      const vivants = new Set(chapterMeta.map((r) => r.id))
      catalog = catalog.filter((c) => vivants.has(c.id))
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
  // Axe du programme (234) et discipline (247), quand la base les porte.
  const themeById = new Map(
    (chapterMeta ?? []).map((r) => [r.id, r.theme?.trim() || null]),
  )
  const disciplineById = new Map(
    (chapterMeta ?? []).map((r) => [r.id, r.discipline?.trim() || null]),
  )

  const chapters: ChapterRow[] = catalog.map((chapter, i) => ({
    id: chapter.id,
    position: chapter.position,
    title: chapter.title,
    status: chapterStatus(values[i]),
    value: values[i],
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
    discipline: disciplineById.get(chapter.id) ?? null,
  }))

  const progress = subjectProgress(values)

  // Onglet « Boss » : pool 100 % matière — le boss de la matière est le même
  // pour toutes les classes, seul le programme joué change.
  const validQuestions = (bossQuestions ?? []).filter(
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

  // La progression de chaque discipline, pour les matières qui en réunissent
  // deux : l'onglet « Géographie » compte ses fiches, pas celles du dossier.
  // Calculée ici, où les VALEURS d'avancement (0..1) existent encore — un
  // pourcentage est une moyenne, elle ne se recompose pas depuis des statuts.
  const progressByDiscipline: Record<string, SubjectProgress> = {}
  for (const discipline of disciplinesOf(chapters)) {
    progressByDiscipline[discipline] = subjectProgress(
      values.filter(
        (_, i) => disciplineById.get(catalog[i].id) === discipline,
      ),
    )
  }

  const data: SubjectTemplateData = {
    subject: { slug: subject.slug, name: subject.name, color: subject.color },
    grade,
    gradeLevel: standings.grade,
    standing: subjectStanding,
    progress,
    progressByDiscipline,
    resume: resumeCta(chapters),
    examOnTop: examBannerOnTop(progress.pct, daysToExam),
    weakCount,
    chapters,
    bossPool,
    gardien,
    papers: parseExamPapers(paperRows),
  }

  // Onglet demandé dans l'URL (`?onglet=boss` depuis la feuille Modes de jeu,
  // `?onglet=programme:geographie` depuis un lien partagé) — les anciennes clés
  // de format restent valides, toute valeur inconnue retombe sur le programme.
  // Les disciplines entrent dans le calcul : sans elles, l'onglet Géographie
  // n'existerait pas encore au moment de résoudre le paramètre.
  const initialMode = modeFromParam(
    onglet,
    modesFor(standings.grade, disciplinesOf(chapters)),
  )

  // Les cours du CARNET rattachés à cette matière (migration 316) : le carnet
  // cesse d'être une île, ses cours se posent à côté du programme officiel.
  // Lus dans les vagues B (les cours) et C (leurs questions et leurs états).

  // `new Date()` et non `Date.now()` : la règle de pureté de React refuse le
  // second dans un rendu de composant serveur (le premier est déjà utilisé
  // ainsi partout ailleurs dans le carnet).
  const maintenant = Date.parse(new Date().toISOString())
  // Une carte SANS état n'a jamais été vue : elle est due.
  const echeanceDe = new Map(
    (carnetEtats ?? []).map((e) => [String(e.question_id), String(e.due_at)]),
  )
  const compteurs = new Map<string, { total: number; dues: number }>()
  for (const q of carnetQuestions ?? []) {
    const cid = String(q.course_id)
    const c = compteurs.get(cid) ?? { total: 0, dues: 0 }
    c.total += 1
    const due = echeanceDe.get(String(q.id))
    if (!due || Date.parse(due) <= maintenant) c.dues += 1
    compteurs.set(cid, c)
  }

  const coursDuCarnet = (carnetRows ?? []).map((c) => {
    const compte = compteurs.get(String(c.id)) ?? { total: 0, dues: 0 }
    return {
      id: String(c.id),
      title: String(c.title ?? 'Sans titre'),
      icon: c.icon ? String(c.icon) : null,
      color: c.color ? String(c.color) : null,
      questionCount: compte.total,
      dueCount: compte.dues,
    }
  })

  return (
    <>
      <SubjectMasteryCelebration
        entries={[{ slug: subject.slug, name: subject.name, pct: progress.pct }]}
      />
      <CarnetDeLaMatiere cours={coursDuCarnet} matiere={subject.name} />
      <SubjectTemplate data={data} initialMode={initialMode} />
    </>
  )
}
