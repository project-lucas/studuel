import { notFound, redirect } from 'next/navigation'
import ChapterExplorer from '@/components/ChapterExplorer'
import { createClient } from '@/lib/supabase/server'
import { getChapterMastery } from '@/lib/mastery'
import type { Subject, Chapter } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ subject: string }>
}) {
  const { subject: slug } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: subject }] = await Promise.all([
    supabase
      .from('profiles')
      .select('grade_level')
      .eq('id', user.id)
      .maybeSingle(),
    supabase
      .from('subjects')
      .select('*')
      .eq('slug', slug)
      .maybeSingle<Subject>(),
  ])

  if (!subject) notFound()
  const grade = profile?.grade_level
  if (!grade) redirect('/onboarding')

  // Le contenu dépend de la classe de l'élève : programme de SON niveau.
  const [{ data: chapters }, mastery] = await Promise.all([
    supabase
      .from('chapters')
      .select('id, subject_id, level, title, position')
      .eq('subject_id', subject.id)
      .eq('level', grade)
      .order('position', { ascending: true })
      .returns<Chapter[]>(),
    getChapterMastery(supabase),
  ])

  return (
    <ChapterExplorer
      subject={subject}
      chapters={chapters ?? []}
      grade={grade}
      mastery={Object.fromEntries(mastery)}
    />
  )
}
