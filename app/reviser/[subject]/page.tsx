import { toutLire } from '@/lib/postgrest-pages'
import { notFound, redirect } from 'next/navigation'
import SubjectTemplate from '@/components/reviser/SubjectTemplate'
import CarnetDeLaMatiere from '@/components/carnet/CarnetDeLaMatiere'
import SubjectMasteryCelebration from '@/components/SubjectMasteryCelebration'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { isPremiumTier } from '@/lib/gems'
import type { Tier } from '@/lib/subscription'
import {
  getSubjectsCached,
  getProgrammeCached,
  getProgrammeFresh,
  getQuizQuestionCountsCached,
  getBossVivierCached,
  type CatalogChapter,
} from '@/lib/catalog'
import { contentLevelOf } from '@/lib/subject-visibility'
import { hrefEncyclopedie } from '@/lib/encyclopedie/matieres'
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
  disciplinesOf,
  subjectProgress,
  type ChapterExamHint,
  type ChapterRow,
  type SubjectProgress,
  type SubjectTemplateData,
} from '@/lib/subject-template'
import { EXAM_PAPER_COLUMNS, parseExamPapers } from '@/lib/exam-papers'
import { ANNALES_CORRIGEES } from '@/lib/annales-corrigees/registre'
import { annalesParAnnee } from '@/lib/annales-corrigees/apercu'
import { marquerReservees } from '@/lib/annales-corrigees/acces'
import {
  DERNIERE_SESSION_LABEL,
  derniereSession,
  tracesDeLaMatiere,
} from '@/lib/derniere-session'
import { getReviewItems } from '@/lib/srs'
import { xpRestantFiche } from '@/lib/reviser/programme'
import { suiteDeFiche } from '@/lib/reviser/suite'
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
// Le rattachement des questions de la file « À revoir » à leurs quiz se lit
// par lots : au-delà de ~150 identifiants, l'adresse de la requête déborde.
const IN_PAR_LOT = 150

// Page matière = template GÉNÉRIQUE unique : tout vient de Supabase (matière,
// chapitres, contenus par mode, progression, notions à revoir). Ajouter une
// matière = ajouter des lignes en base, zéro code ici.
export default async function SubjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ subject: string }>
  searchParams: Promise<{ onglet?: string; theme?: string }>
}) {
  const { subject: slug } = await params
  const { onglet, theme: themeOuvert } = await searchParams
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
        .select('grade_level, subscription_tier')
        .eq('id', user.id)
        .maybeSingle<{ grade_level: string | null; subscription_tier: string | null }>(),
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

  // UNE SEULE VAGUE, CHAÎNÉE (30/10/2026, chantier latence). Tout part dès
  // l'arrivée du profil ; ce qui dépend d'une autre lecture y est accroché
  // (`.then`) au lieu d'attendre toute une vague. Avant, la page enchaînait
  // trois vagues, et la dernière attendait la plus lente de la deuxième.
  //
  // - le programme (chapitres → leçons → quiz), cache serveur, repli
  //   authentifié s'il revient vide ; les sessions de quiz s'y accrochent ;
  // - lesson_completions → plancher d'avancement des chapitres ;
  // - review_items (file du jour) → bloc « À revoir », « X à revoir ». Le
  //   rattachement des questions de la file à leurs quiz ne lit QUE ces
  //   questions-là (au plus 300) ;
  // - le compte de questions par quiz : cache serveur PARTAGÉ avec le Défi et
  //   Marcel (`catalog_quiz_question_counts`, 354). La page relisait tous les
  //   identifiants de questions de la matière pour les compter : 3 888 lignes
  //   en quatre pages à la file pour le français de 1re, 1,1 s à elle seule ;
  // - le vivier du boss, cache serveur par matière et niveau (`getBossVivierCached`) ;
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
  //   colonne, la liste est vide et le dossier est exactement ce qu'il était ;
  //   leurs questions et leurs états s'y accrochent ;
  // - le COMPTE des exercices du cahier (372), sans une seule ligne (`head`) :
  //   il décide si la porte « Exercices » existe et ce qu'elle annonce. Filtré
  //   par la jointure, pas par une liste d'identifiants (260 fiches de lecture
  //   ne tiennent pas dans une adresse). Le cahier lui-même se lit quand on
  //   ouvre la porte (app/api/reviser/cahier). Table absente : pas de porte.
  //
  // ⚠️ LA PLACE DANS LE NIVEAU N'EST PLUS LUE ICI. `my_grade_standings` (223)
  // balaie les sessions de toute la cohorte : la ligne « Top 10 % » arrive
  // après l'ouverture (`PlaceDansLaMatiere`, route GET /api/classement-niveau).
  // ⚠️ NI GEMMES NI SÉRIE : le bandeau du haut (`TopHud`) les montre déjà.
  const programmeP = (async () => {
    const enCache = await getProgrammeCached(subject.id, level)
    if (enCache.length > 0) return enCache
    const { data } = await supabase
      .from('chapters')
      .select(`${CHAPTER_COLUMNS}, lessons(${LESSON_COLUMNS}, quizzes(id))`)
      .eq('subject_id', subject.id)
      .eq('level', level)
      .order('position', { ascending: true })
      .order('position', { ascending: true, referencedTable: 'lessons' })
      .returns<CatalogChapter[]>()
    return data ?? []
  })()

  type SessionRow = {
    quiz_id: string | null
    score: number
    total: number
    created_at: string | null
  }
  // PAGINÉ (20/09/2026) : un élève assidu dépasse les 1 000 sessions sur une
  // matière, et PostgREST coupe à 1 000 sans le dire — les meilleurs scores
  // des fiches les plus anciennes disparaissaient, et le quiz du chapitre
  // (ouvert quand chaque fiche a été testée) se re-verrouillait tout seul.
  const sessionsP = programmeP.then((catalogue) => {
    const ids = catalogue.flatMap((c) => c.lessons.flatMap((l) => l.quizzes.map((q) => q.id)))
    if (ids.length === 0) return { data: [] as SessionRow[] }
    return toutLire<SessionRow>((from, to) =>
      supabase
        .from('test_sessions')
        // `created_at` : la date de la dernière session, pour le drapeau
        // posé sur la fiche où l'élève s'est arrêté (lib/derniere-session).
        .select('quiz_id, score, total, created_at')
        .eq('user_id', user.id)
        .in('quiz_id', ids)
        .order('id', { ascending: true })
        .range(from, to)
        .returns<SessionRow[]>(),
    )
  })

  // La file du jour, puis le quiz de chacune de SES questions.
  const revueP = getReviewItems(supabase, user.id).then(async (items) => {
    const questionIds = items.filter((i) => i.item_kind === 'question').map((i) => i.item_id)
    const lots: string[][] = []
    for (let i = 0; i < questionIds.length; i += IN_PAR_LOT) {
      lots.push(questionIds.slice(i, i + IN_PAR_LOT))
    }
    const lus = await Promise.all(
      lots.map((lot) =>
        supabase
          .from('quiz_questions')
          .select('id, quiz_id')
          .in('id', lot)
          .returns<{ id: string; quiz_id: string }[]>(),
      ),
    )
    return { items, refs: lus.flatMap((r) => r.data ?? []) }
  })

  const carnetP = Promise.resolve(
    supabase
      .from('carnet_courses')
      .select('id, title, icon, color, subject_id')
      .eq('owner_id', user.id)
      .eq('subject_id', subject.id)
      .limit(20),
  )
  type CarnetQuestion = { id: string; course_id: string }
  type CarnetEtat = { question_id: string; due_at: string }
  const carnetSuiteP = carnetP.then(
    async ({ data }): Promise<[CarnetQuestion[] | null, CarnetEtat[] | null]> => {
      const ids = (data ?? []).map((c) => String(c.id))
      if (ids.length === 0) return [[], []]
      const [questions, etats] = await Promise.all([
        supabase
          .from('carnet_questions')
          .select('id, course_id')
          .in('course_id', ids)
          .returns<CarnetQuestion[]>(),
        supabase
          .from('carnet_question_states')
          .select('question_id, due_at')
          .eq('user_id', user.id)
          .returns<CarnetEtat[]>(),
      ])
      return [questions.data, etats.data]
    },
  )

  const [
    catalogue,
    { data: sessions },
    { items: reviewItems, refs: questionRefs },
    { data: completions },
    comptesDeQuestions,
    vivierDuBoss,
    { data: themeRows },
    { data: paperRows },
    gardien,
    { data: carnetRows },
    [carnetQuestions, carnetEtats],
    { count: exercicesDuCahier },
  ] = await Promise.all([
    programmeP,
    sessionsP,
    revueP,
    supabase
      .from('lesson_completions')
      .select('lesson_id, created_at')
      .eq('user_id', user.id)
      .returns<{ lesson_id: string; created_at: string }[]>(),
    getQuizQuestionCountsCached(),
    getBossVivierCached(subject.id, level),
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
    carnetP,
    carnetSuiteP,
    supabase
      .from('exercices')
      .select('id, chapters!inner(subject_id, level)', { count: 'exact', head: true })
      .eq('chapters.subject_id', subject.id)
      .eq('chapters.level', level),
  ])
  let catalog = catalogue

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

  // Questions par quiz (cache partagé) et quiz de chaque question de la file.
  const questionCountByQuiz = new Map<string, number>(comptesDeQuestions)
  const quizIds = new Set(
    catalog.flatMap((c) => c.lessons.flatMap((l) => l.quizzes.map((q) => q.id))),
  )
  const quizByQuestion = new Map<string, string>()
  for (const q of questionRefs) {
    if (quizIds.has(q.quiz_id)) quizByQuestion.set(q.id, q.quiz_id)
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
    // Le quiz du chapitre s'ouvre quand chaque fiche a été testée une fois
    // (lib/subject-template.accesQuizChapitre) : ces deux drapeaux se lisent
    // dans les sessions DÉJÀ chargées, sans une requête de plus.
    aQuiz: chapter.lessons.some((l) => Boolean(l.quizzes[0]?.id)),
    quizTeste: chapter.lessons.some((l) => {
      const quizId = l.quizzes[0]?.id
      return Boolean(quizId && bestByQuiz.has(quizId))
    }),
    // Ce que la fiche peut encore rapporter (carte « Reprendre ») : les leçons
    // pas encore lues et les couronnes pas encore décrochées, au barème de base.
    xpRestant: xpRestantFiche({
      leconsALire: chapter.lessons.filter((l) => !completed.has(l.id)).length,
      couronnes: crowns(values[i]),
    }),
    // Où mène le bouton de la fiche : son cours, puis son quiz, puis
    // « Revoir ». Tout est déjà lu (le programme, les leçons terminées, les
    // meilleurs scores) — pas une requête de plus (lib/reviser/suite).
    suite: suiteDeFiche({
      subjectSlug: subject.slug,
      chapterId: chapter.id,
      lecons: chapter.lessons.map((l) => {
        const quizId = l.quizzes[0]?.id ?? null
        return {
          id: l.id,
          lue: completed.has(l.id),
          quizId,
          meilleur: quizId ? (bestByQuiz.get(quizId)?.ratio ?? null) : null,
        }
      }),
      terminee: chapterStatus(values[i]) === 'complete',
    }),
  }))

  const progress = subjectProgress(values)

  // Onglet « Boss » : pool 100 % matière — le boss de la matière est le même
  // pour toutes les classes, seul le programme joué change.
  const validQuestions = vivierDuBoss.filter(
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
    premium: isPremiumTier((profile?.subscription_tier ?? 'free') as Tier),
    grade,
    gradeLevel: grade,
    // Lue après l'ouverture (`PlaceDansLaMatiere`) : voir la vague plus haut.
    standing: null,
    progress,
    progressByDiscipline,
    // LE DRAPEAU DE LA DERNIÈRE SESSION (Lucas, 17/09/2026) : la fiche du quiz
    // joué ou du cours lu le plus récemment dans cette matière. Plus de
    // « Reprendre / Commencer » deviné — un repère sur ce qui a été fait.
    resume: (() => {
      const chapterId = derniereSession(
        tracesDeLaMatiere(catalog, sessions ?? [], completions ?? []),
      )
      return chapterId ? { chapterId, label: DERNIERE_SESSION_LABEL } : null
    })(),
    examOnTop: examBannerOnTop(progress.pct, daysToExam),
    weakCount,
    chapters,
    bossPool,
    gardien,
    papers: parseExamPapers(paperRows),
    // Deux annales corrigées par matière en gratuit, toutes avec Studuel+
    // (15/10/2026, lib/annales-corrigees/acces) : la couronne se pose ici.
    annalesCorrigees: marquerReservees(
      annalesParAnnee(ANNALES_CORRIGEES, subject.slug, level),
      ANNALES_CORRIGEES,
      subject.slug,
      level,
      isPremiumTier((profile?.subscription_tier ?? 'free') as Tier),
    ),
    cahier: exercicesDuCahier ? { total: exercicesDuCahier } : null,
    themeOuvert: themeOuvert ?? null,
  }

  // Onglet demandé dans l'URL (`?onglet=boss` depuis la feuille Modes de jeu,
  // `?onglet=programme:geographie` depuis un lien partagé) — les anciennes clés
  // de format restent valides, toute valeur inconnue retombe sur le programme.
  // Les disciplines entrent dans le calcul : sans elles, l'onglet Géographie
  // n'existerait pas encore au moment de résoudre le paramètre.
  const initialMode = modeFromParam(
    onglet,
    modesFor(grade, disciplinesOf(chapters), subject.slug, Boolean(exercicesDuCahier)),
  )
  // L'ENCYCLOPÉDIE EST UNE AUTRE PAGE. Un lien `?onglet=encyclopedie` — partagé,
  // ou reconstruit par une barre d'onglets — ne doit pas ouvrir ce dossier avec
  // l'onglet allumé et le contenu d'à côté en dessous : il conduit là où
  // l'encyclopédie vit vraiment.
  if (initialMode === 'encyclopedie') redirect(hrefEncyclopedie(subject.slug))

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
      {/* « Tes cours » se pose DANS la porte Cours, au-dessus du sommaire : la
          bannière de la matière ouvre la page, rien ne passe avant elle. */}
      <SubjectTemplate
        data={data}
        initialMode={initialMode}
        carnet={<CarnetDeLaMatiere cours={coursDuCarnet} matiere={subject.name} />}
      />
    </>
  )
}
