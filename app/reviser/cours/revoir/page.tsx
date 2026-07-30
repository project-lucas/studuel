import { redirect } from 'next/navigation'
import ReviewSession, {
  type PlayableQuestion,
} from '@/components/carnet/ReviewSession'
import WorkTimer from '@/components/WorkTimer'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import {
  isQuestionReady,
  isQuestionType,
  normalizeQuestionContent,
} from '@/lib/carnet-cours'
import { revoirSummary, type RevoirAttempt } from '@/lib/carnet-revoir'
import { toDayKey } from '@/lib/streak'

export const metadata = { title: 'À revoir — Studuel' }
export const dynamic = 'force-dynamic'

// La session « À revoir aujourd'hui » du carnet : les questions dues de TOUS
// les cours (lib/carnet-revoir), enchaînées en une seule file. C'est la cible
// du héros du carnet — l'app a choisi la session, l'élève n'a qu'à jouer.
export default async function CarnetRevoirPage() {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const [{ data: questionRows }, { data: attemptRows }] = await Promise.all([
    // La RLS limite déjà aux cours de l'élève ; borne large par sécurité.
    supabase
      .from('carnet_questions')
      .select('id, course_id, type, content')
      .limit(2_000),
    supabase
      .from('carnet_review_attempts')
      .select('question_id, is_correct, answered_at')
      .eq('user_id', user.id)
      .order('answered_at', { ascending: false })
      .limit(4_000),
  ])

  // Questions jouables (brouillons exclus), avec leur contenu normalisé.
  const playable = (questionRows ?? []).flatMap((r) => {
    if (!isQuestionType(r.type)) return []
    const content = normalizeQuestionContent(r.type, r.content)
    if (!isQuestionReady(r.type, content)) return []
    return [
      {
        id: String(r.id),
        courseId: String(r.course_id),
        type: r.type,
        content,
      },
    ]
  })

  const attempts: RevoirAttempt[] = (attemptRows ?? []).map((a) => ({
    questionId: String(a.question_id),
    isCorrect: a.is_correct === true,
    answeredAt: String(a.answered_at ?? ''),
  }))

  const { dueIds } = revoirSummary(playable, attempts, toDayKey(new Date()))
  const dueSet = new Set(dueIds)
  const queue: PlayableQuestion[] = playable
    .filter((q) => dueSet.has(q.id))
    .map((q) => ({ id: q.id, type: q.type, content: q.content }))

  return (
    <>
      {/* Réviser son carnet est du travail : le chrono compte ces minutes. */}
      <WorkTimer />
      <ReviewSession
        courseId={null}
        chapterId={null}
        courseTitle="Mon carnet"
        scopeLabel="À revoir aujourd'hui"
        questions={queue}
        backHref="/reviser?espace=carnet"
        backLabel="Retour au carnet"
      />
    </>
  )
}
