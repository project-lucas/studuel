import { notFound, redirect } from 'next/navigation'
import ControleBlanc from '@/components/exercice/ControleBlanc'
import PageChapitre from '@/components/exercices/PageChapitre'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { canAccessPremiumTests, getUserTierFor } from '@/lib/subscription'
import { CHAPTER_COLUMNS, type Chapter, type Subject } from '@/lib/types'

export const dynamic = 'force-dynamic'

// LE CONTRÔLE BLANC d'un chapitre qui a son cahier : la dernière marche du
// chemin, une copie rédigée que l'IA note sur 20 (360, 364, 365).
export default async function ControlePage({
  params,
}: {
  params: Promise<{ subject: string; chapter: string }>
}) {
  const { subject: slug, chapter: chapterId } = await params
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  type Row = Chapter & { subject: Subject | null }
  const [{ data: row }, tier] = await Promise.all([
    supabase
      .from('chapters')
      .select(`${CHAPTER_COLUMNS}, subject:subjects!inner(*)`)
      .eq('id', chapterId)
      .eq('subjects.slug', slug)
      .maybeSingle<Row>(),
    getUserTierFor(supabase, user.id),
  ])
  if (!row?.subject) notFound()
  const { subject, ...chapter } = row
  const cahierHref = `/reviser/${subject.slug}/${chapter.id}/exercice`
  if (!canAccessPremiumTests(tier)) redirect(cahierHref)

  return (
    <PageChapitre couleur={subject.color} surtitre={`${subject.name} · ${chapter.title}`} titre="Le contrôle blanc" retour={cahierHref}>
      <ControleBlanc chapterId={chapter.id} chapterTitle={chapter.title} backHref={cahierHref} />
    </PageChapitre>
  )
}
