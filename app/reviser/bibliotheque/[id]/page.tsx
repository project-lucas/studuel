import { redirect, notFound } from 'next/navigation'
import LibraryEditor from '@/components/LibraryEditor'
import { createClient } from '@/lib/supabase/server'
import { isLibraryKind, normalizeContent, normalizeTitle } from '@/lib/library'

export const metadata = { title: 'Bibliothèque — Studuel' }
export const dynamic = 'force-dynamic'

// Éditeur d'un contenu de la bibliothèque. Charge l'item (RLS owner-only) et
// délègue l'édition au composant client, aiguillé par le type.
export default async function LibraryEditorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: row } = await supabase
    .from('library_items')
    .select('id, kind, title, content')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!row || !isLibraryKind(row.kind)) notFound()

  return (
    <LibraryEditor
      id={String(row.id)}
      kind={row.kind}
      initialTitle={normalizeTitle(row.title)}
      initialContent={normalizeContent(row.kind, row.content)}
    />
  )
}
