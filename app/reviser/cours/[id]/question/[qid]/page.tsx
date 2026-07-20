import { notFound, redirect } from 'next/navigation'
import QuestionEditor from '@/components/carnet/QuestionEditor'
import { createClient } from '@/lib/supabase/server'
import {
  isQuestionType,
  normalizeQuestionContent,
} from '@/lib/carnet-cours'

export const metadata = { title: 'Mon carnet — Studuel' }
export const dynamic = 'force-dynamic'

// Éditeur d'une question d'un cours du carnet. Charge la question (RLS via la
// propriété du cours) et délègue au composant client.
export default async function QuestionEditorPage({
  params,
}: {
  params: Promise<{ id: string; qid: string }>
}) {
  const { id, qid } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // La propriété est vérifiée par la jointure cours → owner (et par la RLS).
  const { data: course } = await supabase
    .from('carnet_courses')
    .select('id')
    .eq('id', id)
    .eq('owner_id', user.id)
    .maybeSingle()
  if (!course) notFound()

  const { data: row } = await supabase
    .from('carnet_questions')
    .select('id, type, content')
    .eq('id', qid)
    .eq('course_id', id)
    .maybeSingle()
  if (!row || !isQuestionType(row.type)) notFound()

  return (
    <QuestionEditor
      courseId={id}
      questionId={String(row.id)}
      initialType={row.type}
      initialContent={normalizeQuestionContent(row.type, row.content)}
    />
  )
}
