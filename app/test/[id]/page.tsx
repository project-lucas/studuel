import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Lock, ArrowLeft } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/PageHeader'
import QuizPlayer from '@/components/QuizPlayer'
import { createClient } from '@/lib/supabase/server'
import { getUserTier, canAccessPremiumTests } from '@/lib/subscription'
import { permuteQuizOptions } from '@/lib/quiz-shuffle'
import { getCurrentUser, type CurrentUser } from '@/lib/supabase/user'
import { drawQuizSession } from '@/lib/questions/server-draw'
import { loadQuestionStates } from '@/lib/questions/server'
import type { QuestionState } from '@/lib/questions/engine'
import { getChapterMastery } from '@/lib/mastery-server'
import { toutLire } from '@/lib/postgrest-pages'
import {
  ENTRAINEMENT_MINIMUM,
  ENTRAINEMENT_TAILLE,
  veutEntrainement,
} from '@/lib/quiz-session'
import {
  chapitreSuivant,
  premierQuiz,
  questionsAcquises,
  quizDeLaLeconSuivante,
  xpPromise,
  type ChapitreRef,
  type LeconRef,
  type QuizCible,
  type QuizSuivant,
} from '@/lib/quiz-suivant'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Quiz, QuizQuestion } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function QuizPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Leçon → chapitre → matière embarqués dans la même requête (zéro cascade) :
  // le bouton « quitter » ramène au hub de la leçon d'origine, et le chapitre
  // (matière, niveau, position) sert à désigner le QUIZ SUIVANT sans relire.
  type QuizRow = Quiz & {
    lesson:
      | {
          id: string
          chapter: {
            id: string
            subject_id: string
            level: string
            position: number
            subject: { slug: string; color: string } | null
          } | null
        }
      | null
  }
  // Le tier (gating premium) ne dépend pas du quiz : les deux partent ensemble.
  const [{ data: quiz }, tier, user] = await Promise.all([
    supabase
      .from('quizzes')
      .select(
        'id, title, subject, grade_level, chapter, is_free, lesson:lessons(id, chapter:chapters(id, subject_id, level, position, subject:subjects(slug, color)))',
      )
      .eq('id', id)
      .single<QuizRow>(),
    getUserTier(),
    getCurrentUser(),
  ])

  if (!quiz) notFound()

  const backHref = quiz.lesson?.chapter?.subject
    ? `/reviser/${quiz.lesson.chapter.subject.slug}/${quiz.lesson.chapter.id}/${quiz.lesson.id}/cours`
    : '/reviser'

  // Gating abonnement : les quiz premium requièrent Studuel+ (tier1+).
  // La RLS sur quiz_questions applique la même règle côté base.
  if (!quiz.is_free && !canAccessPremiumTests(tier)) {
    return (
      <div>
        <PageHeader title={quiz.title} description={quiz.subject} />
        <Card className="mx-auto max-w-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="size-4" /> Test réservé à Studuel+
            </CardTitle>
            <CardDescription>
              Ce quiz fait partie du contenu premium de Studuel.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Abonne-toi à Studuel+ pour débloquer tous les tests, ou entraîne-toi
            d’abord avec les quiz gratuits.
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild>
              <Link href="/test">
                <ArrowLeft className="size-4" /> Retour aux révisions
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const { data: questions, error } = await supabase
    .from('quiz_questions')
    .select('id, quiz_id, question, kind, options, correct_index, explanation, position')
    .eq('quiz_id', quiz.id)
    .order('position', { ascending: true })
    .returns<QuizQuestion[]>()

  const meta = [quiz.subject, quiz.grade_level, quiz.chapter].filter(Boolean).join(' · ')

  // Options mélangées à la source (bonne réponse déplacée avec son index) pour
  // que « toujours cliquer la 1re » ne marche pas ; les vrai/faux gardent leur
  // ordre. Le player continue de lire `correct_index`, resté juste.
  const shuffledQuestions = (questions ?? []).map((q) => {
    const p = permuteQuizOptions(q.kind, q.options, q.correct_index, q.id)
    return { ...q, options: p.options, correct_index: p.correctIndex }
  })

  // L'ÉTAT DE L'ÉLÈVE sur les questions du quiz, lu UNE fois : il sert à la
  // séance d'entraînement (ci-dessous) ET à la carte « Questions maîtrisées »
  // de l'écran de fin. Vide sans utilisateur, ou tant que la migration 239
  // n'est pas passée (`loadQuestionStates` avale ses erreurs).
  const questionIds = shuffledQuestions.map((q) => q.id)
  const etats: Map<string, QuestionState> = user
    ? await loadQuestionStates(supabase, user.id, questionIds)
    : new Map()

  // LA SÉANCE D'ENTRAÎNEMENT, au deuxième passage et au-delà.
  //
  // Le quiz alimentait la répétition espacée sans jamais la consulter : on
  // reprenait les mêmes N questions dans le même ordre, y compris celles
  // acquises depuis longtemps. Le moteur (`lib/questions`) sait composer mieux
  // — encore fallait-il l'appeler. Cf. `lib/quiz-session` pour la règle.
  //
  // Tout ce bloc est FACULTATIF : sans utilisateur, sans état en base (la
  // migration 239 pas encore passée) ou sur un tirage trop maigre, `deck` reste
  // nul et la page se comporte exactement comme avant.
  //
  // LE QUIZ SUIVANT est cherché dans le même souffle : il ne dépend que du
  // catalogue et de l'avancement du chapitre, pas de la séance.
  const [deck, quizSuivant] = await Promise.all([
    composerSeance({
      supabase,
      user,
      etats,
      quizId: quiz.id,
      chapterId: quiz.lesson?.chapter?.id ?? null,
      subjectSlug: quiz.lesson?.chapter?.subject?.slug ?? null,
      level: quiz.grade_level ?? null,
      questions: shuffledQuestions,
    }),
    trouverQuizSuivant({
      supabase,
      user,
      quizId: quiz.id,
      chapitre: quiz.lesson?.chapter ?? null,
    }),
  ])

  // Ce que le chapitre a DÉJÀ acquis parmi ces questions : l'écran de fin y
  // ajoute les réussites de la manche. Nul sans utilisateur — la carte compte
  // alors les bonnes réponses de la manche, faute de mémoire à consulter.
  const maitrise = user
    ? { acquisesIds: questionsAcquises(questionIds, etats), total: questionIds.length }
    : null

  // Le temps de révision total, pour le compteur du haut. Lecture ISOLÉE :
  // s'il manque, le compteur repart de la seule session en cours plutôt que de
  // priver l'écran de son chrono.
  // La RLS de `profiles` limite déjà à sa propre ligne : pas besoin de
  // connaître l'identifiant ici, `maybeSingle()` suffit.
  const { data: profilTemps } = await supabase
    .from('profiles')
    .select('work_seconds')
    .maybeSingle()
  const tempsTotal = Number(profilTemps?.work_seconds ?? 0)

  // Le player occupe tout l'écran (template) : pas de PageHeader autour.
  if (!error && questions && questions.length > 0) {
    return (
      <>
        {/* Le chrono de travail vit DANS le player depuis qu'il affiche le
            temps gagné en fin de quiz : deux montages du même hook compteraient
            les secondes en double. */}
        <QuizPlayer
          quizId={quiz.id}
          title={quiz.title}
          questions={shuffledQuestions}
          // Le paquet servi, quand le moteur en a composé un plus court que le
          // quiz (deuxième passage et au-delà). Nul : le quiz entier.
          deck={deck}
          subject={quiz.subject}
          // La ROBE de la session : la couleur du dossier d'où vient le quiz.
          // Absente pour un quiz détaché de toute matière — le player retombe
          // alors sur le violet de l'app.
          subjectColor={quiz.lesson?.chapter?.subject?.color ?? null}
          // Le SLUG, pour l'illustration de la matière : la couleur seule
          // laissait l'écran sans identité (« ça manque de couleur, c'est
          // plat »). Absent pour un quiz détaché de toute matière.
          subjectSlug={quiz.lesson?.chapter?.subject?.slug ?? null}
          // Le temps de révision DÉJÀ accumulé (profiles.work_seconds) : le
          // chrono de la session s'y ajoute à l'écran, en direct.
          tempsTotalSecondes={tempsTotal}
          gradeLevel={quiz.grade_level}
          backHref={backHref}
          // L'écran de fin en XP : ce qui est acquis, et la tentation d'après.
          maitrise={maitrise}
          quizSuivant={quizSuivant}
        />
      </>
    )
  }

  return (
    <div>
      <PageHeader title={quiz.title} description={meta} />

      <Card className="mx-auto max-w-xl">
        <CardHeader>
          <CardTitle>Quiz indisponible</CardTitle>
          <CardDescription>
            {error
              ? `Erreur de chargement des questions (${error.message}).`
              : 'Aucune question n’est associée à ce quiz pour le moment.'}
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" asChild>
            <Link href="/test">
              <ArrowLeft className="size-4" /> Retour aux révisions
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

/**
 * Le paquet réellement servi, quand l'élève repasse un quiz qu'il a déjà bouclé.
 *
 * Rend `null` — et la page ressert alors le quiz entier — dans tous les cas où
 * le moteur n'a rien de mieux à proposer : premier passage, quiz trop court,
 * visiteur non connecté, état de répétition espacée absent de la base (la
 * migration 239 n'est pas passée), tirage sous le seuil. C'est un CHEMIN EN
 * PLUS, jamais un passage obligé : le quiz doit rester jouable même si tout ce
 * bloc échoue.
 */
async function composerSeance({
  supabase,
  user,
  etats,
  quizId,
  chapterId,
  subjectSlug,
  level,
  questions,
}: {
  supabase: SupabaseClient
  user: CurrentUser | null
  /** Les états déjà lus par la page (une seule lecture pour tout l'écran). */
  etats: ReadonlyMap<string, QuestionState>
  quizId: string
  chapterId: string | null
  subjectSlug: string | null
  level: string | null
  questions: QuizQuestion[]
}): Promise<QuizQuestion[] | null> {
  if (!user) return null

  // Une session enregistrée = l'évaluation est passée. `head: true` : on ne
  // veut que le compte, pas les lignes.
  const { count, error } = await supabase
    .from('test_sessions')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('quiz_id', quizId)
  if (error) return null

  if (!veutEntrainement({ dejaPasse: (count ?? 0) > 0, total: questions.length }))
    return null

  // LE MOTEUR A-T-IL VRAIMENT UNE MÉMOIRE À LIRE ?
  //
  // `loadQuestionStates` avale ses erreurs et rend une table vide : tant que la
  // migration 239 n'est pas passée, les colonnes du moteur (`box`, `due_at`,
  // `last_seen_at`) n'existent pas et TOUTES les questions passent pour
  // inédites. Le tirage réussirait quand même — il servirait 5 questions sur 8
  // au hasard, sans note à la clé. Un raccourci muet, pas un entraînement.
  //
  // Or un élève qui a déjà bouclé ce quiz a forcément laissé des états
  // derrière lui. Aucun état = le moteur est aveugle : on ressert le quiz
  // entier, qui reste la meilleure réponse.
  if (etats.size === 0) return null

  const drawn = await drawQuizSession({
    supabase,
    userId: user.id,
    quizId,
    chapterId,
    pool: questions.map((q) => ({
      questionId: q.id,
      chapterId,
      // La matière d'une question est son SLUG, jamais son nom affiché — même
      // identité que dans `question_scope` (cf. `lib/questions/server`), sans
      // quoi les deux chemins de tirage désigneraient deux matières.
      subjectId: subjectSlug,
      level,
    })),
    count: ENTRAINEMENT_TAILLE,
  })
  if (drawn.length < ENTRAINEMENT_MINIMUM) return null

  // On rejoue l'ordre décidé par le moteur : `drawSession` mélange son résultat
  // en dernier geste, justement pour que l'élève ne lise pas les paquets
  // (échues, inédites, au sort) dans l'ordre où ils ont été composés.
  const parId = new Map(questions.map((q) => [q.id, q]))
  const seance = drawn.flatMap((ref) => {
    const q = parId.get(ref.questionId)
    return q ? [q] : []
  })
  return seance.length >= ENTRAINEMENT_MINIMUM ? seance : null
}

// --- Le quiz suivant ---------------------------------------------------------

type ChapitreDuQuiz = {
  id: string
  subject_id: string
  level: string
  position: number
}

/**
 * Les leçons d'un chapitre avec leur quiz (le premier par id, s'il y en a
 * plusieurs). Colonnes PUBLIQUES seulement : `lessons` porte du contenu payant
 * révoqué (cf. LESSON_COLUMNS), un `*` casserait la lecture.
 */
async function leconsAvecQuiz(
  supabase: SupabaseClient,
  chapterId: string,
): Promise<LeconRef[]> {
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('id, position')
    .eq('chapter_id', chapterId)
    .order('position', { ascending: true })
    .order('id', { ascending: true })
    .returns<{ id: string; position: number }[]>()
  if (error || !lessons || lessons.length === 0) return []

  const { data: quizzes } = await supabase
    .from('quizzes')
    .select('id, title, lesson_id')
    .in(
      'lesson_id',
      lessons.map((l) => l.id),
    )
    .order('id', { ascending: true })
    .returns<{ id: string; title: string; lesson_id: string }[]>()

  const quizParLecon = new Map<string, { id: string; title: string }>()
  for (const q of quizzes ?? []) {
    if (!quizParLecon.has(q.lesson_id)) {
      quizParLecon.set(q.lesson_id, { id: q.id, title: q.title })
    }
  }
  return lessons.map((l) => {
    const q = quizParLecon.get(l.id)
    return {
      id: l.id,
      position: l.position,
      quizId: q?.id ?? null,
      quizTitre: q?.title ?? null,
    }
  })
}

/**
 * LE QUIZ SUIVANT — la tentation de l'écran de fin (« Quiz suivant · +30 XP »).
 *
 * Celui de la leçon d'après dans le même chapitre ; à la fin du chapitre, le
 * premier quiz du chapitre suivant de la matière, au même niveau ; au bout du
 * programme, rien. L'XP annoncée est celle que le chapitre visé peut encore
 * rapporter (sa prochaine couronne, cf. `xpPromise`).
 *
 * FACULTATIF de bout en bout : la moindre erreur rend `null`, et l'écran de
 * fin retombe sur « Continuer ». Un quiz doit rester jouable même quand la
 * suite ne se laisse pas deviner.
 */
async function trouverQuizSuivant({
  supabase,
  user,
  quizId,
  chapitre,
}: {
  supabase: SupabaseClient
  user: CurrentUser | null
  quizId: string
  chapitre: ChapitreDuQuiz | null
}): Promise<QuizSuivant | null> {
  if (!chapitre) return null
  try {
    let cible: QuizCible | null = quizDeLaLeconSuivante(
      await leconsAvecQuiz(supabase, chapitre.id),
      quizId,
    )
    let chapitreCible = chapitre.id

    if (!cible) {
      // Les chapitres de la matière à ce niveau : une lecture filtrée par
      // matière, donc paginée (règle du projet : PostgREST rend au plus
      // 1 000 lignes sans le dire).
      const { data: chapitres } = await toutLire<ChapitreRef>((from, to) =>
        supabase
          .from('chapters')
          .select('id, position')
          .eq('subject_id', chapitre.subject_id)
          .eq('level', chapitre.level)
          .order('id', { ascending: true })
          .range(from, to)
          .returns<ChapitreRef[]>(),
      )
      const suivant = chapitreSuivant(chapitres, chapitre.id)
      if (!suivant) return null
      cible = premierQuiz(await leconsAvecQuiz(supabase, suivant.id))
      if (!cible) return null
      chapitreCible = suivant.id
    }

    // L'XP promise : la prochaine couronne du chapitre visé. Sans utilisateur,
    // le chapitre est vierge par définition — première couronne.
    let valeur = 0
    if (user) {
      const mastery = await getChapterMastery(supabase, user.id)
      valeur = mastery.get(chapitreCible)?.value ?? 0
    }

    return { href: `/test/${cible.quizId}`, titre: cible.titre, xp: xpPromise(valeur) }
  } catch (e) {
    console.error(
      '[test] quiz suivant introuvable:',
      e instanceof Error ? e.message : e,
    )
    return null
  }
}
