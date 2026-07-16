import { redirect } from 'next/navigation'
import LibraryHub, { type LibraryRow } from '@/components/LibraryHub'
import { createClient } from '@/lib/supabase/server'
import {
  isLibraryKind,
  normalizeContent,
  isContentReady,
} from '@/lib/library'

export const metadata = { title: 'Ma bibliothèque — Studuel' }
export const dynamic = 'force-dynamic'

// « Ma bibliothèque » — les contenus que l'élève crée lui-même (fiches, quiz,
// cartes mentales). La page ne fait que charger la liste (library_items,
// migration 158) ; toute l'interaction vit dans LibraryHub (client).
export default async function BibliothequePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Si 158 n'est pas passée, la requête échoue → liste vide (dégradé propre).
  const { data: rows } = await supabase
    .from('library_items')
    .select('id, kind, title, subject, content, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  const items: LibraryRow[] = (rows ?? [])
    .filter((r) => isLibraryKind(r.kind))
    .map((r) => ({
      id: String(r.id),
      kind: r.kind,
      title: String(r.title ?? 'Sans titre'),
      ready: isContentReady(r.kind, normalizeContent(r.kind, r.content)),
    }))

  return <LibraryHub items={items} />
}
