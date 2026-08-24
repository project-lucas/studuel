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
import { getCurrentUser } from '@/lib/supabase/user'
import { drawQuizSession } from '@/lib/questions/server-draw'
import { loadQuestionStates } from '@/lib/questions/server'
import {
  ENTRAINEMENT_MINIMUM,
  ENTRAINEMENT_TAILLE,
  veutEntrainement,
} from '@/lib/quiz-session'
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
  // le bouton « quitter » ramène au hub de la leçon d'origine.
  type QuizRow = Quiz & {
    lesson:
      | {
          id: string
          chapter: {
            id: string
            subject: { slug: string; color: string } | null
          } | null
        }
      | null
  }
  // Le tier (gating premium) ne dépend pas du quiz : les deux partent ensemble.
  const [{ data: quiz }, tier] = await Promise.all([
    supabase
      .from('quizzes')
      .select(
        'id, title, subject, grade_level, chapter, is_free, lesson:lessons(id, chapter:chapters(id, subject:subjects(slug, color)))',
      )
      .eq('id', id)
      .single<QuizRow>(),
    getUserTier(),
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
  const deck = await composerSeance({
    supabase,
    quizId: quiz.id,
    chapterId: quiz.lesson?.chapter?.id ?? null,
    subjectSlug: quiz.lesson?.chapter?.subject?.slug ?? null,
    level: quiz.grade_level ?? null,
    questions: shuffledQuestions,
  })

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
  quizId,
  chapterId,
  subjectSlug,
  level,
  questions,
}: {
  supabase: SupabaseClient
  quizId: string
  chapterId: string | null
  subjectSlug: string | null
  level: string | null
  questions: QuizQuestion[]
}): Promise<QuizQuestion[] | null> {
  const user = await getCurrentUser()
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
  // entier, qui reste la meilleure réponse. C'est une lecture de plus, sur un
  // chemin rare, contre une dégradation silencieuse.
  const etats = await loadQuestionStates(
    supabase,
    user.id,
    questions.map((q) => q.id),
  )
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
